#!/usr/bin/env node

/**
 * Dream 记忆整合系统执行器
 * 
 * 核心保护：
 * 1. 只读模式 - 只能读取指定目录
 * 2. 自动备份 - 写入前自动备份
 * 4. 内容验证 - 防止错误数据
 */

const fs = require('fs')
const fsPromises = require('fs/promises')
const path = require('path')
const { exec } = require('child_process')
const util = require('util')
const execPromise = util.promisify(exec)
const { analyzeWithAI, applyUpdates } = require('./aiAnalyzer')
const { analyzeAndPrune, safeWrite } = require('./pruner')

// ============ 第 1 层：只读模式配置 ============

const READ_ONLY_DIRS = [
  'memory/',
  'temp/zvp 计划/',
  'temp/zvp 完成情况/'
]

const WRITE_ALLOWED = [
  'MEMORY.md'
]

const FORBIDDEN_DIRS = [
  '.openclaw/config/',
  'skills/',
  'docs/',
  'agents/'
]

const PROTECTED_FILES = [
  'AGENTS.md',
  'SOUL.md',
  'TOOLS.md',
  'IDENTITY.md',
  'USER.md'
]

// ============ 工具函数 ============
// 使用 pruner.js 中的 safeWrite 和 backupFile

async function isPathAllowed(filePath) {
  // 转换为相对路径
  const relativePath = path.relative(process.cwd(), filePath)
  
  // 检查是否在禁止目录
  for (const forbidden of FORBIDDEN_DIRS) {
    if (relativePath.includes(forbidden) || filePath.includes(forbidden)) {
      return { allowed: false, reason: `禁止访问目录：${forbidden}` }
    }
  }
  
  // 检查是否是受保护文件
  const fileName = path.basename(filePath)
  if (PROTECTED_FILES.includes(fileName)) {
    return { allowed: false, reason: `受保护文件：${fileName}` }
  }
  
  // 特殊处理 MEMORY.md（根目录）
  if (fileName === 'MEMORY.md' && path.dirname(relativePath) === '.') {
    return { allowed: true, mode: 'write' }
  }
  
  // 检查是否在只读目录
  for (const readOnly of READ_ONLY_DIRS) {
    if (relativePath.startsWith(readOnly) || filePath.includes(readOnly)) {
      return { allowed: true, mode: 'read-only' }
    }
  }
  
  // 检查是否在允许写入列表
  for (const allowed of WRITE_ALLOWED) {
    if (relativePath === allowed || fileName === allowed) {
      return { allowed: true, mode: 'write' }
    }
  }
  
  return { allowed: false, reason: `路径不在允许列表：${relativePath}` }
}

// ============ Dream 核心流程 ============

async function orient() {
  console.log('[Dream] Phase 1: Orient')
  
  // 读取 MEMORY.md
  const memoryPath = path.join(process.cwd(), 'MEMORY.md')
  const permission = await isPathAllowed(memoryPath)
  if (!permission.allowed) {
    throw new Error(`无法访问 MEMORY.md: ${permission.reason}`)
  }
  
  const memoryContent = await fsPromises.readFile(memoryPath, 'utf8')
  
  // 列出 memory/ 目录
  const memoryDir = path.join(process.cwd(), 'memory')
  let files = []
  try {
    const permission = await isPathAllowed('memory/')
    if (permission.allowed) {
      files = await fsPromises.readdir(memoryDir)
    }
  } catch (e) {
    console.log('[Dream] memory/ 目录不存在，跳过')
  }
  
  return {
    memoryContent,
    memoryPath,
    files
  }
}

async function gather() {
  console.log('[Dream] Phase 2: Gather')
  
  const signals = []
  
  // 读取 ZVP 计划
  const planDir = path.join(process.cwd(), 'temp/zvp 计划')
  try {
    const permission = await isPathAllowed('temp/zvp 计划/')
    if (permission.allowed) {
      const files = await fsPromises.readdir(planDir)
      for (const file of files) {
        if (file.endsWith('.json')) {
          const content = await fsPromises.readFile(path.join(planDir, file), 'utf8')
          signals.push({ type: 'plan', file, content })
          console.log('[Dream] 读取计划:', file)
        }
      }
    }
  } catch (e) {
    console.log('[Dream] ZVP 计划目录不存在，跳过')
  }
  
  // 读取 ZVP 完成情况
  const completionDir = path.join(process.cwd(), 'temp/zvp 完成情况')
  try {
    const permission = await isPathAllowed('temp/zvp 完成情况/')
    if (permission.allowed) {
      const files = await fsPromises.readdir(completionDir)
      for (const file of files) {
        if (file.endsWith('.json')) {
          const content = await fsPromises.readFile(path.join(completionDir, file), 'utf8')
          signals.push({ type: 'completion', file, content })
          console.log('[Dream] 读取完成情况:', file)
        }
      }
    }
  } catch (e) {
    console.log('[Dream] ZVP 完成情况目录不存在，跳过')
  }
  
  // 读取最近的 memory 文件
  const memoryDir = path.join(process.cwd(), 'memory')
  try {
    const permission = await isPathAllowed('memory/')
    if (permission.allowed) {
      const files = await fsPromises.readdir(memoryDir)
      const today = new Date().toISOString().split('T')[0]
      const todayFile = `${today}.md`
      
      if (files.includes(todayFile)) {
        const content = await fsPromises.readFile(path.join(memoryDir, todayFile), 'utf8')
        signals.push({ type: 'daily', file: todayFile, content })
        console.log('[Dream] 读取今日记忆:', todayFile)
      }
    }
  } catch (e) {
    console.log('[Dream] memory 目录读取失败，跳过')
  }
  
  console.log('[Dream] 收集到', signals.length, '个信号')
  return signals
}

async function consolidate(memoryStructure, newSignals) {
  console.log('[Dream] Phase 3: Consolidate')
  
  // 调用 AI 分析并生成更新内容
  const updates = await analyzeWithAI(memoryStructure, newSignals)
  
  return updates
}

function buildConsolidatePrompt(memoryStructure, newSignals) {
  let prompt = `# Dream 记忆整合任务

## 现有记忆结构
MEMORY.md 内容长度：${memoryStructure.memoryContent.length} 字符
memory/ 目录文件：${memoryStructure.files.length} 个

## 新信号
`
  
  for (const signal of newSignals) {
    prompt += `\n### ${signal.type}: ${signal.file}\n${signal.content.substring(0, 500)}...\n`
  }
  
  prompt += `
## 任务
请分析新信号，提取有价值的信息，更新 MEMORY.md。

## 输出格式
只输出需要追加到 MEMORY.md 的内容，格式如下：

---

### 主题名称（日期）
**来源**：xxx
**内容**：xxx
**优先级**：高/中/低

---

注意：
1. 只输出新内容，不要重复旧内容
2. 每条记忆 < 100 字
3. 日期格式：2026-04-01
4. 优先级：高/中/低
`
  
  return prompt
}

async function prune() {
  console.log('[Dream] Phase 4: Prune')
  
  const memoryPath = path.join(process.cwd(), 'MEMORY.md')
  const memoryContent = await fsPromises.readFile(memoryPath, 'utf8')
  
  // 调用修剪模块
  const result = await analyzeAndPrune(memoryPath, memoryContent)
  
  if (result.pruned) {
    // 应用修剪
    await safeWrite(memoryPath, result.newContent)
    console.log('[Dream] 修剪完成')
    console.log('[Dream] 修剪前:', result.stats.before)
    console.log('[Dream] 修剪后:', result.stats.after)
  }
}

// ============ 锁机制 ============

const LOCK_FILE = '/tmp/dream.lock'

function tryAcquireLock() {
  try {
    if (fs.existsSync(LOCK_FILE)) {
      const pid = fs.readFileSync(LOCK_FILE, 'utf8')
      // 检查进程是否还在运行
      try {
        process.kill(pid, 0)
        console.log('[Dream] 另一个 Dream 进程正在运行（PID:', pid + '），跳过')
        return false
      } catch {
        // 进程已死，删除锁文件
        fs.unlinkSync(LOCK_FILE)
        console.log('[Dream] 检测到死锁，清理锁文件')
      }
    }
    
    // 获取锁
    fs.writeFileSync(LOCK_FILE, process.pid.toString())
    console.log('[Dream] 获取锁成功（PID:', process.pid + ')')
    return true
  } catch (e) {
    console.error('[Dream] 获取锁失败:', e.message)
    return false
  }
}

function releaseLock() {
  try {
    if (fs.existsSync(LOCK_FILE)) {
      fs.unlinkSync(LOCK_FILE)
      console.log('[Dream] 释放锁')
    }
  } catch (e) {
    console.error('[Dream] 释放锁失败:', e.message)
  }
}

// ============ 主执行流程 ============

async function executeDream() {
  console.log('[Dream] 开始记忆整合...')
  console.log('[Dream] 工作目录:', process.cwd())
  
  // 设置默认 API Key（阿里云百炼）
  if (!process.env.DREAM_API_KEY) {
    process.env.DREAM_API_KEY = 'sk-sp-f2174d07a0324a9f8d31ecd651c3639e'
    console.log('[Dream] 使用默认 API Key')
  }
  
  // 设置默认模型
  if (!process.env.DREAM_MODEL) {
    process.env.DREAM_MODEL = 'qwen3.5-plus'
    console.log('[Dream] 使用默认模型:', process.env.DREAM_MODEL)
  }
  
  // 尝试获取锁
  if (!tryAcquireLock()) {
    return
  }
  
  try {
    // Phase 1: Orient
    const memoryStructure = await orient()
    
    // Phase 2: Gather
    const newSignals = await gather()
    
    if (newSignals.length === 0) {
      console.log('[Dream] 没有新信号，跳过整合')
      return
    }
    
    // Phase 3: Consolidate
    const updates = await consolidate(memoryStructure, newSignals)
    
    // 应用更新到 MEMORY.md
    if (updates.newSections && updates.newSections.length > 0) {
      const { applyUpdates } = require('./aiAnalyzer')
      const newContent = await applyUpdates(memoryStructure.memoryPath, memoryStructure.memoryContent, updates)
      
      // 安全写入（带备份和验证）
      await safeWrite(memoryStructure.memoryPath, newContent)
      console.log('[Dream] MEMORY.md 已更新')
    } else {
      console.log('[Dream] 没有新内容需要添加')
    }
    
    // Phase 4: Prune
    await prune()
    
    console.log('[Dream] 记忆整合完成')
  } catch (e) {
    console.error('[Dream] 执行失败:', e.message)
    console.error('[Dream] 不会写入任何内容')
    throw e
  } finally {
    releaseLock()
  }
}

// ============ 命令行入口 ============

if (require.main === module) {
  executeDream().catch(console.error)
}

module.exports = { executeDream }
