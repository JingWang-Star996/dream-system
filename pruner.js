#!/usr/bin/env node

/**
 * Dream 系统 - AI 驱动的智能修剪模块
 * 
 * 参考 Claude Code Dream 系统源码实现
 */

const fs = require('fs/promises')
const path = require('path')
const axios = require('axios')

// AI 配置 - 阿里云百炼 Coding 端点（动态读取环境变量）
function getAIConfig() {
  return {
    model: process.env.DREAM_MODEL || 'qwen3.5-plus',
    maxTokens: 4096,
    timeout: 300000,
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    baseUrl: 'https://coding.dashscope.aliyuncs.com/v1'
  }
}

/**
 * 分析 MEMORY.md 并执行智能修剪
 */
async function analyzeAndPrune(memoryPath, memoryContent) {
  console.log('[Dream.Prune] 开始分析...')
  
  // 检查文件大小
  const stats = await fs.stat(memoryPath)
  const sizeKB = stats.size / 1024
  const lineCount = memoryContent.split('\n').length
  
  console.log('[Dream.Prune] MEMORY.md 大小:', sizeKB.toFixed(2), 'KB')
  console.log('[Dream.Prune] MEMORY.md 行数:', lineCount)
  
  const needsPrune = sizeKB > 25 || lineCount > 200
  
  if (!needsPrune) {
    console.log('[Dream.Prune] 文件正常，无需修剪')
    return { pruned: false, newContent: memoryContent }
  }
  
  console.log('[Dream.Prune] 文件超过限制，开始修剪...')
  
  // 解析 MEMORY.md 结构
  const sections = parseSections(memoryContent)
  console.log('[Dream.Prune] 识别到', sections.length, '个章节')
  
  // 调用 AI 生成修剪建议
  const pruneSuggestions = await generateAIPruneSuggestions(sections, memoryContent)
  console.log('[Dream.Prune] AI 生成', pruneSuggestions.length, '条修剪建议')
  
  // 应用修剪
  const newContent = applyPrune(memoryContent, sections, pruneSuggestions)
  
  // 验证修剪结果
  const newStats = {
    sizeKB: (newContent.length / 1024).toFixed(2),
    lineCount: newContent.split('\n').length
  }
  
  console.log('[Dream.Prune] 修剪后大小:', newStats.sizeKB, 'KB')
  console.log('[Dream.Prune] 修剪后行数:', newStats.lineCount)
  
  return {
    pruned: true,
    newContent,
    stats: {
      before: { sizeKB: sizeKB.toFixed(2), lineCount },
      after: newStats
    },
    prunedSections: pruneSuggestions.length
  }
}

/**
 * 解析 MEMORY.md 章节
 */
function parseSections(content) {
  const sections = []
  const lines = content.split('\n')
  
  let currentSection = null
  let currentContent = []
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // 检测章节标题（### 开头）
    if (line.startsWith('### ')) {
      // 保存上一个章节
      if (currentSection) {
        sections.push({
          ...currentSection,
          content: currentContent.join('\n')
        })
      }
      
      // 解析新章节
      const title = line.replace('### ', '').trim()
      const dateMatch = title.match(/（(\d{4}-\d{2}-\d{2})）/)
      const date = dateMatch ? dateMatch[1] : null
      
      currentSection = {
        title,
        date,
        lineStart: i,
        lineEnd: i,
        priority: '中',
        category: '其他',
        age: 0
      }
      currentContent = [line]
      
      // 提取优先级和分类
      if (i + 1 < lines.length) {
        const nextLines = lines.slice(i + 1, i + 5).join('\n')
        if (nextLines.includes('**优先级**：高')) currentSection.priority = '高'
        else if (nextLines.includes('**优先级**：低')) currentSection.priority = '低'
        
        if (nextLines.includes('**分类**：重要决策')) currentSection.category = '重要决策'
        else if (nextLines.includes('**分类**：项目与任务')) currentSection.category = '项目与任务'
        else if (nextLines.includes('**分类**：经验教训')) currentSection.category = '经验教训'
        else if (nextLines.includes('**分类**：技术发现')) currentSection.category = '技术发现'
      }
      
      // 计算年龄
      if (date) {
        const today = new Date()
        const sectionDate = new Date(date)
        currentSection.age = Math.floor((today - sectionDate) / (24 * 60 * 60 * 1000))
      }
    } else if (currentSection) {
      currentContent.push(line)
      currentSection.lineEnd = i
    }
  }
  
  // 保存最后一个章节
  if (currentSection) {
    sections.push({
      ...currentSection,
      content: currentContent.join('\n')
    })
  }
  
  return sections
}

/**
 * 调用 AI 生成修剪建议
 */
async function generateAIPruneSuggestions(sections, memoryContent) {
  const AI_CONFIG = getAIConfig()
  
  if (!AI_CONFIG.apiKey) {
    console.log('[Dream.Prune.AI] 警告：未配置 ANTHROPIC_API_KEY，使用规则修剪')
    return generateRuleBasedPruneSuggestions(sections)
  }
  
  try {
    const prompt = buildPrunePrompt(sections)
    
    const response = await axios.post(
      AI_CONFIG.baseUrl + '/chat/completions',
      {
        model: AI_CONFIG.model,
        max_tokens: AI_CONFIG.maxTokens,
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + AI_CONFIG.apiKey
        },
        timeout: AI_CONFIG.timeout
      }
    )
    
    const aiContent = response.data.choices[0].message.content
    return parseAIResponse(aiContent, sections)
  } catch (e) {
    console.error('[Dream.Prune.AI] API 调用失败:', e.message)
    console.log('[Dream.Prune.AI] 使用规则修剪')
    return generateRuleBasedPruneSuggestions(sections)
  }
}

/**
 * 构建修剪 prompt
 */
function buildPrunePrompt(sections) {
  let prompt = `# Dream 记忆修剪系统

你是一个记忆管理专家。你的任务是分析 MEMORY.md 中的章节，识别可以删除或归档的内容。

## 现有章节（${sections.length} 个）

`
  
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    prompt += `${i + 1}. **${section.title}**
   - 日期：${section.date || '无'}
   - 年龄：${section.age} 天
   - 优先级：${section.priority}
   - 分类：${section.category}
   - 内容长度：${section.content.split('\n').length} 行

`
  }
  
  prompt += `
## 修剪规则

**建议删除**（满足任一条件）：
1. 低优先级 且 超过 30 天
2. 中优先级 且 超过 60 天
3. 内容重复或过时
4. 临时性安排已完成

**建议保留**：
1. 高优先级内容（无论多久）
2. 重要决策和原则
3. 长期有效的经验教训
4. 技术发现和最佳实践

## 输出格式

**必须严格遵循以下 JSON 格式**：

[
  {
    "section": "章节标题",
    "action": "delete|archive|keep",
    "reason": "理由说明"
  }
]

## 示例

[
  {
    "section": "临时会议记录（2026-03-01）",
    "action": "delete",
    "reason": "低优先级且超过 30 天"
  },
  {
    "section": "ZVP 工作收集系统（2026-04-01）",
    "action": "keep",
    "reason": "高优先级技术发现"
  }
]

---

**请分析上述章节，输出 JSON 格式的修剪建议。**
`
  
  return prompt
}

/**
 * 解析 AI 响应
 */
function parseAIResponse(aiResponse, sections) {
  try {
    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/)
    
    if (jsonMatch && jsonMatch[0]) {
      const parsed = JSON.parse(jsonMatch[0])
      return parsed.filter(s => s.action === 'delete')
    }
    
    return []
  } catch (e) {
    console.error('[Dream.Prune.AI] 解析 AI 响应失败:', e.message)
    return generateRuleBasedPruneSuggestions(sections)
  }
}

/**
 * 基于规则的修剪建议（无 AI 时）
 */
function generateRuleBasedPruneSuggestions(sections) {
  const suggestions = []
  
  for (const section of sections) {
    // 跳过没有日期的章节
    if (!section.date) continue
    
    // 低优先级且超过 7 天 → 建议删除
    if (section.priority === '低' && section.age > 7) {
      suggestions.push({
        section: section.title,
        lineStart: section.lineStart,
        lineEnd: section.lineEnd,
        reason: `低优先级且超过${section.age}天`,
        action: 'delete'
      })
    }
    // 中优先级且超过 30 天 → 建议删除
    else if (section.priority === '中' && section.age > 30) {
      suggestions.push({
        section: section.title,
        lineStart: section.lineStart,
        lineEnd: section.lineEnd,
        reason: `中优先级且超过${section.age}天`,
        action: 'delete'
      })
    }
    // 临时性内容（标题包含"临时"、"测试"等）→ 建议删除
    else if (/临时 | 测试 |tmp|test/i.test(section.title) && section.age > 1) {
      suggestions.push({
        section: section.title,
        lineStart: section.lineStart,
        lineEnd: section.lineEnd,
        reason: '临时性内容',
        action: 'delete'
      })
    }
  }
  
  console.log('[Dream.Prune.Rule] 生成', suggestions.length, '条规则修剪建议')
  return suggestions
}

/**
 * 应用修剪
 */
function applyPrune(content, sections, suggestions) {
  const lines = content.split('\n')
  const linesToRemove = new Set()
  
  // 标记需要删除的行
  for (const suggestion of suggestions) {
    if (suggestion.action === 'delete') {
      for (let i = suggestion.lineStart; i <= suggestion.lineEnd; i++) {
        linesToRemove.add(i)
      }
    }
  }
  
  // 过滤掉标记的行
  const newLines = lines.filter((_, index) => !linesToRemove.has(index))
  
  return newLines.join('\n')
}

/**
 * 安全写入（带备份）
 */
async function safeWrite(filePath, content) {
  const timestamp = Date.now()
  const backupPath = `${filePath}.backup-${timestamp}`
  await fs.copyFile(filePath, backupPath)
  console.log('[Dream.Prune] 已备份:', backupPath)
  
  const tempPath = `${filePath}.tmp.${timestamp}`
  await fs.writeFile(tempPath, content, 'utf8')
  
  const stats = await fs.stat(tempPath)
  if (stats.size === 0) {
    throw new Error('验证失败：写入的文件为空')
  }
  
  await fs.rename(tempPath, filePath)
  console.log('[Dream.Prune] 安全写入成功:', filePath)
}

module.exports = {
  analyzeAndPrune,
  parseSections,
  generateAIPruneSuggestions,
  generateRuleBasedPruneSuggestions,
  applyPrune,
  safeWrite
}
