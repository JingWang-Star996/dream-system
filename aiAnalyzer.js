#!/usr/bin/env node

/**
 * Dream 记忆整合系统 - AI 分析模块
 * 
 * 职责：使用 AI 分析短期记忆，提取有价值的内容
 */

const https = require('https');

// AI 配置
const AI_CONFIG = {
  model: process.env.DREAM_MODEL || 'qwen3.6-plus',
  apiKey: process.env.DREAM_API_KEY || '',
  baseUrl: process.env.DREAM_API_URL || 'https://coding.dashscope.aliyuncs.com/v1'
};

/**
 * 使用 AI 分析记忆
 */
async function analyzeWithAI(memories) {
  if (!AI_CONFIG.apiKey) {
    console.log('⚠️ 未配置 API Key，跳过 AI 分析');
    return {
      newMemories: [],
      categories: {},
      summary: ''
    };
  }
  
  // 构建提示词
  const prompt = buildAnalysisPrompt(memories);
  
  try {
    const response = await callAI(prompt);
    return parseAIResponse(response);
  } catch (error) {
    console.log(`❌ AI 分析失败：${error.message}`);
    return {
      newMemories: [],
      categories: {},
      summary: ''
    };
  }
}

/**
 * 构建分析提示词
 */
function buildAnalysisPrompt(memories) {
  let prompt = `你是一个专业的记忆整理专家。

请分析以下短期记忆内容，提取有价值的长期记忆：

【短期记忆内容】
`;
  
  for (const memory of memories) {
    prompt += `\n---\n文件：${memory.file}\n内容：\n${memory.content.substring(0, 1000)}\n`;
  }
  
  prompt += `
【任务要求】
1. 提取 3-5 条最有价值的长期记忆
2. 按重要性排序
3. 每条记忆包含：标题、内容、分类、优先级
4. 删除重复和过时信息

【输出格式】
请以 JSON 格式输出：
{
  "newMemories": [
    {
      "title": "记忆标题",
      "content": "记忆内容",
      "category": "分类（决策/项目/经验/技术）",
      "priority": "优先级（高/中/低）"
    }
  ],
  "summary": "整体总结"
}
`;
  
  return prompt;
}

/**
 * 调用 AI API
 */
function callAI(prompt) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: AI_CONFIG.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000
    });

    // 解析 baseUrl
    const url = new URL(AI_CONFIG.baseUrl);
    // 使用 baseUrl 的 path 前缀 + chat/completions
    const apiPath = url.pathname.replace(/\/$/, '') + '/chat/completions';
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: apiPath,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Dream-System/1.0'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      if (res.statusCode !== 200) {
        console.log(`⚠️ API HTTP ${res.statusCode}`);
      }
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          // 检查响应结构
          if (!result.choices || !result.choices[0] || !result.choices[0].message) {
            console.log('⚠️ API 响应格式异常:', JSON.stringify(result).substring(0, 200));
            resolve('');
            return;
          }
          resolve(result.choices[0].message.content);
        } catch (error) {
          console.log('❌ API 响应解析失败:', error.message);
          console.log('原始响应:', data.substring(0, 500));
          resolve(''); // 返回空字符串，跳过 AI 分析
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.write(postData);
    req.end();
  });
}

/**
 * 解析 AI 响应
 */
function parseAIResponse(response) {
  try {
    // 提取 JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('未找到 JSON 格式');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      newMemories: parsed.newMemories || [],
      categories: parsed.categories || {},
      summary: parsed.summary || ''
    };
  } catch (error) {
    console.log(`解析 AI 响应失败：${error.message}`);
    return {
      newMemories: [],
      categories: {},
      summary: ''
    };
  }
}

// 导出
module.exports = {
  analyzeWithAI
};
