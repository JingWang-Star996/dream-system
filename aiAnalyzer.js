#!/usr/bin/env node

/**
 * Dream 系统 - AI 分析模块
 * 
 * 负责调用 AI API 分析收集到的信号，生成记忆更新
 */

const axios = require('axios')
const fs = require('fs/promises')

// 配置 - 阿里云百炼
const AI_CONFIG = {
  model: process.env.DREAM_MODEL || 'qwen3.5-plus',
  maxTokens: 4096,
  timeout: 300000, // 5 分钟
  apiKey: process.env.DREAM_API_KEY || '',
  // 阿里云百炼 API 端点
  baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1'
}
async function analyzeWithAI(memoryStructure, newSignals) {
  console.log('[Dream.AI] 开始 AI 分析...')
  console.log('[Dream.AI] 模型:', AI_CONFIG.model)
  console.log('[Dream.AI] 信号数量:', newSignals.length)
  
  // 构建 prompt
  const prompt = buildAnalysisPrompt(memoryStructure, newSignals)
  
  // 调用 AI API
  const aiResponse = await callClaudeAPI(prompt)
  
  // 解析 AI 响应
  const updates = parseAIResponse(aiResponse)
  
  console.log('[Dream.AI] 分析完成')
  console.log('[Dream.AI] 生成新记忆:', updates.newSections.length, '条')
  console.log('[Dream.AI] 更新记忆:', updates.updates.length, '条')
  
  return updates
}

/**
 * 构建分析 prompt
 */
function buildAnalysisPrompt(memoryStructure, newSignals) {
  let prompt = `# Dream 记忆整合系统

你是一个专业的记忆整合专家。你的任务是将用户的短期记忆（工作日志、计划、完成情况）整合为长期记忆。

## 现有记忆结构

MEMORY.md 内容长度：${memoryStructure.memoryContent.length} 字符
memory/ 目录文件：${memoryStructure.files.length} 个

## 新信号

`
  
  for (const signal of newSignals) {
    prompt += `### ${signal.type.toUpperCase()}: ${signal.file}\n`
    prompt += `${signal.content}\n\n`
  }
  
  prompt += `
## 任务

请分析新信号，提取有价值的信息，生成需要追加到 MEMORY.md 的内容。

## 提取标准

**值得记录的信息**：
1. 重要决策和原则
2. 项目进度和里程碑
3. 经验教训和最佳实践
4. 技术发现和创新
5. 问题和解决方案
6. 数据指标和趋势

**不值得记录的信息**：
1. 日常琐事（如"吃了什么"）
2. 临时性安排
3. 重复性内容
4. 过于细节的技术实现

## 输出格式

**必须严格遵循以下 JSON 格式**：

{
  "newSections": [
    {
      "title": "主题名称",
      "date": "2026-04-01",
      "source": "来源文件名",
      "content": "具体内容，<100 字",
      "priority": "高|中|低",
      "category": "重要决策 | 项目与任务 | 经验教训 | 技术发现"
    }
  ],
  "updates": [
    {
      "section": "现有章节名",
      "action": "update|append",
      "content": "更新或追加的内容"
    }
  ],
  "pruneSuggestions": [
    {
      "section": "建议删除的章节",
      "reason": "删除理由（过时/重复/无价值）"
    }
  ]
}

## 规则

1. **简洁** - 每条记忆 < 100 字
2. **日期** - 统一使用 YYYY-MM-DD 格式
3. **来源** - 标注来源文件名
4. **优先级** - 高/中/低
5. **分类** - 重要决策/项目与任务/经验教训/技术发现
6. **保守** - 只记录真正有价值的内容，宁缺毋滥

## 示例

**输入**：
{
  "type": "completion",
  "file": "2026-04-01.json",
  "content": "ZVP 工作收集回复率 90%，10 人回复 9 人"
}

**输出**：
{
  "newSections": [
    {
      "title": "ZVP 工作收集系统",
      "date": "2026-04-01",
      "source": "2026-04-01.json",
      "content": "已实现自动收集系统，18 点自动私聊 10 位成员，收集工作完成情况，回复率约 90%",
      "priority": "高",
      "category": "技术发现"
    }
  ],
  "updates": [],
  "pruneSuggestions": []
}

---

**请分析上述新信号，输出 JSON 格式的记忆更新建议。**
`
  
  return prompt
}

/**
 * 调用阿里云百炼 API
 */
async function callClaudeAPI(prompt) {
  if (!AI_CONFIG.apiKey) {
    console.log('[Dream.AI] 警告：未配置 API Key，使用模拟响应')
    return getMockAIResponse()
  }
  
  try {
    const response = await axios.post(
      AI_CONFIG.baseUrl + '/chat/completions',
      {
        model: AI_CONFIG.model,
        max_tokens: AI_CONFIG.maxTokens,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
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
    console.log('[Dream.AI] API 调用成功')
    
    return aiContent
  } catch (e) {
    console.error('[Dream.AI] API 调用失败:', e.message)
    if (e.response) {
      console.error('[Dream.AI] 响应状态:', e.response.status)
      console.error('[Dream.AI] 响应内容:', e.response.data)
    }
    console.log('[Dream.AI] 使用模拟响应')
    return getMockAIResponse()
  }
}

/**
 * 模拟 AI 响应（用于测试或无 API key 时）
 * 基于规则生成有意义的记忆更新
 */
function getMockAIResponse() {
  const newSections = []
  
  // 分析输入信号，生成简单的记忆更新
  // 这里可以添加更多规则来提取有价值的信息
  
  return JSON.stringify({
    newSections,
    updates: [],
    pruneSuggestions: []
  }, null, 2)
}

/**
 * 解析 AI 响应
 */
function parseAIResponse(aiResponse) {
  try {
    // 尝试从响应中提取 JSON
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
    
    if (jsonMatch && jsonMatch[0]) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        newSections: parsed.newSections || [],
        updates: parsed.updates || [],
        pruneSuggestions: parsed.pruneSuggestions || []
      }
    }
    
    // 如果没有 JSON 块，尝试直接解析
    const parsed = JSON.parse(aiResponse)
    return {
      newSections: parsed.newSections || [],
      updates: parsed.updates || [],
      pruneSuggestions: parsed.pruneSuggestions || []
    }
  } catch (e) {
    console.error('[Dream.AI] 解析 AI 响应失败:', e.message)
    console.log('[Dream.AI] 原始响应:', aiResponse.substring(0, 500))
    return {
      newSections: [],
      updates: [],
      pruneSuggestions: []
    }
  }
}

/**
 * 将 AI 生成的更新应用到 MEMORY.md
 */
async function applyUpdates(memoryPath, memoryContent, updates) {
  console.log('[Dream.AI] 应用更新...')
  
  let newContent = memoryContent
  
  // 应用新章节
  if (updates.newSections && updates.newSections.length > 0) {
    const today = new Date().toISOString().split('T')[0]
    
    for (const section of updates.newSections) {
      const sectionMarkdown = `
### ${section.title}（${section.date || today}）
**来源**：${section.source}
**内容**：${section.content}
**优先级**：${section.priority || '中'}
**分类**：${section.category || '其他'}

`
      // 根据分类插入到对应位置
      newContent = insertSectionByCategory(newContent, sectionMarkdown, section.category)
    }
    
    console.log('[Dream.AI] 添加了', updates.newSections.length, '个新章节')
  }
  
  // 应用更新
  if (updates.updates && updates.updates.length > 0) {
    for (const update of updates.updates) {
      if (update.action === 'append') {
        newContent += '\n' + update.content
      } else if (update.action === 'update') {
        // TODO: 实现更新逻辑
      }
    }
    
    console.log('[Dream.AI] 应用了', updates.updates.length, '个更新')
  }
  
  return newContent
}

/**
 * 根据分类插入章节到合适位置
 */
function insertSectionByCategory(content, sectionMarkdown, category) {
  const categoryMarkers = {
    '重要决策': '## 📌 重要决策与原则',
    '项目与任务': '## 📋 项目与任务',
    '经验教训': '## 💡 经验教训',
    '技术发现': '## 🔍 技术发现'
  }
  
  const marker = categoryMarkers[category] || categoryMarkers['经验教训']
  
  const index = content.indexOf(marker)
  if (index !== -1) {
    // 找到标记，插入到标记后的第一个空行
    const nextNewline = content.indexOf('\n\n', index)
    if (nextNewline !== -1) {
      return content.slice(0, nextNewline + 2) + sectionMarkdown + content.slice(nextNewline + 2)
    }
  }
  
  // 没找到标记，追加到末尾
  return content + '\n' + sectionMarkdown
}

module.exports = {
  analyzeWithAI,
  applyUpdates
}
