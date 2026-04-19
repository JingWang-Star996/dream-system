#!/usr/bin/env node

/**
 * Dream 记忆整合系统 - 配置模块
 * 
 * 职责：提供统一的配置管理
 */

// AI 配置 - 阿里云百炼 Coding 端点（动态读取环境变量）
function getAIConfig() {
  return {
    model: process.env.DREAM_MODEL || 'qwen3.6-plus',
    maxTokens: 4096,
    timeout: 300000,
    apiKey: process.env.DREAM_API_KEY || '',  // 从环境变量读取
    baseUrl: process.env.DREAM_API_URL || 'https://coding.dashscope.aliyuncs.com/v1'
  }
}

// 系统配置
function getSystemConfig() {
  return {
    memoryDir: process.env.DREAM_MEMORY_DIR || './memory',
    memoryFile: process.env.DREAM_MEMORY_FILE || './MEMORY.md',
    logFile: process.env.DREAM_LOG_FILE || './dream.log'
  }
}

module.exports = {
  getAIConfig,
  getSystemConfig
}
