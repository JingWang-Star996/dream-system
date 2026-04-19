#!/usr/bin/env node

/**
 * Dream 记忆整合系统 - 主执行器
 * 
 * 职责：读取短期记忆 → AI 分析 → 整合到长期记忆 → 智能修剪
 * 
 * 执行时间：每天凌晨 5 点自动执行
 */

const fs = require('fs');
const path = require('path');
const { analyzeWithAI } = require('./aiAnalyzer');

// 配置
const CONFIG = {
  memoryDir: path.join(__dirname, '../../memory'),
  memoryFile: path.join(__dirname, '../../MEMORY.md'),
  backupDir: path.join(__dirname, '../../memory/backups'),
  logFile: path.join(__dirname, '../../logs/dream.log'),
  model: process.env.DREAM_MODEL || 'qwen3.6-plus',
  apiKey: process.env.DREAM_API_KEY || ''
};

// 日志函数
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage);
  
  // 写入日志文件
  fs.appendFileSync(CONFIG.logFile, logMessage);
}

// 主函数
async function main() {
  log('=== Dream 记忆整合系统启动 ===');
  log(`模型：${CONFIG.model}`);
  log(`记忆目录：${CONFIG.memoryDir}`);
  log(`记忆文件：${CONFIG.memoryFile}`);
  
  try {
    // Phase 1: 读取短期记忆
    log('\n【Phase 1】读取短期记忆...');
    const shortTermMemories = readShortTermMemories();
    log(`读取到 ${shortTermMemories.length} 个短期记忆文件`);
    
    if (shortTermMemories.length === 0) {
      log('没有新的短期记忆，跳过本次整合');
      return;
    }
    
    // Phase 2: AI 分析
    log('\n【Phase 2】AI 智能分析...');
    const analysis = await analyzeWithAI(shortTermMemories);
    log(`AI 分析完成，生成 ${analysis.newMemories.length} 条新记忆`);
    
    // Phase 3: 整合到长期记忆
    log('\n【Phase 3】整合到长期记忆...');
    integrateMemories(analysis);
    log('记忆整合完成');
    
    // Phase 4: 智能修剪
    log('\n【Phase 4】智能修剪...');
    pruneMemories();
    log('记忆修剪完成');
    
    log('\n=== Dream 记忆整合系统完成 ===');
    
  } catch (error) {
    log(`❌ 错误：${error.message}`);
    log(error.stack);
    process.exit(1);
  }
}

// Phase 1: 读取短期记忆
function readShortTermMemories() {
  const files = [];
  
  if (!fs.existsSync(CONFIG.memoryDir)) {
    log(`记忆目录不存在：${CONFIG.memoryDir}`);
    return files;
  }
  
  const entries = fs.readdirSync(CONFIG.memoryDir, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.md')) {
      const filePath = path.join(CONFIG.memoryDir, entry.name);
      const content = fs.readFileSync(filePath, 'utf-8');
      files.push({
        file: entry.name,
        path: filePath,
        content: content
      });
    }
  }
  
  return files;
}

// Phase 2: AI 分析（已移至 aiAnalyzer.js）
// async function analyzeMemories(memories) {...}

// Phase 3: 整合到长期记忆
function integrateMemories(analysis) {
  // 备份
  if (!fs.existsSync(CONFIG.backupDir)) fs.mkdirSync(CONFIG.backupDir, { recursive: true });
  const now = new Date();
  const backupPath = path.join(CONFIG.backupDir, `MEMORY-backup-${now.toISOString().slice(0,10)}.md`);
  if (fs.existsSync(CONFIG.memoryFile)) {
    fs.copyFileSync(CONFIG.memoryFile, backupPath);
    log(`已备份：${backupPath}`);
  }

  // 读取现有 MEMORY.md
  let existingContent = '';
  if (fs.existsSync(CONFIG.memoryFile)) {
    existingContent = fs.readFileSync(CONFIG.memoryFile, 'utf-8');
  }

  // 构建新内容
  let newSections = '';
  const today = now.toISOString().slice(0, 10);

  if (analysis.newMemories && analysis.newMemories.length > 0) {
    newSections += `\n\n## 🆕 自动整合（${today}）\n\n`;
    for (const mem of analysis.newMemories) {
      newSections += `### ${mem.title || '未命名'}\n`;
      newSections += `- **分类**: ${mem.category || '未分类'}\n`;
      newSections += `- **优先级**: ${mem.priority || '中'}\n`;
      newSections += `- **内容**: ${mem.content || ''}\n\n`;
    }
  }

  if (analysis.summary) {
    newSections += `\n\n### 📊 本次整理总结\n${analysis.summary}\n`;
  }

  // 验证：新内容不能为空
  if (!newSections.trim()) {
    log('⚠️ AI 分析无新内容，跳过写入');
    return;
  }

  // 验证：追加的内容不能少于 100 字符（防止无意义写入）
  if (newSections.length < 100) {
    log(`⚠️ 新内容(${newSections.length}B)太少，跳过写入`);
    return;
  }

  // 追加到 MEMORY.md
  const finalContent = existingContent + newSections;
  fs.writeFileSync(CONFIG.memoryFile, finalContent, 'utf-8');
  log(`✅ MEMORY.md 已更新（${existingContent.length}B → ${finalContent.length}B）`);
}

// Phase 4: 智能修剪
function pruneMemories() {
  // TODO: 智能修剪 MEMORY.md，保持精简
  
  log('修剪功能待实现');
}

// 启动
main().catch(console.error);
