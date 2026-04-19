# 🌙 Dream 记忆整合系统

> 自动化记忆管理系统 — 将短期记忆自动整合为长期记忆，保持 MEMORY.md 精简高效。

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 概述

Dream 是一个自动化的记忆整合系统。它定期读取 `memory/` 目录下的短期记忆文件，通过 AI 分析提取有价值的信息，自动追加到长期记忆 `MEMORY.md` 中，并通过智能修剪保持文件精简。

设计灵感来源于 Claude Code 的记忆管理机制，适配 OpenClaw 的记忆体系。

## 核心功能

| 功能 | 说明 |
|------|------|
| AI 智能分析 | 使用 qwen3.6-plus 模型分析短期记忆，提取 3-5 条高价值长期记忆 |
| 自动整合 | 将分析结果按结构化格式追加到 MEMORY.md |
| 自动备份 | 写入前自动备份 MEMORY.md，防止数据丢失 |
| 内容验证 | 跳过空内容或过短内容（<100 字符），防止无效写入 |
| 智能修剪 | 基于 AI + 规则双引擎，自动识别并删除过期/低优先级章节 |

## 执行流程

```
Phase 1 ── 读取短期记忆
   │           扫描 memory/ 目录下的所有 .md 文件
   ▼
Phase 2 ── AI 智能分析
   │           调用大模型提取有价值的长期记忆
   ▼
Phase 3 ── 整合到长期记忆
   │           备份 MEMORY.md → 结构化追加 → 内容验证
   ▼
Phase 4 ── 智能修剪
               当文件超过 25KB 或 200 行时自动修剪
```

## 快速开始

### 1. 配置

设置环境变量：

```bash
export DREAM_API_KEY="your-api-key-here"
```

可选环境变量：

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `DREAM_API_KEY` | API 密钥（必填） | — |
| `DREAM_MODEL` | AI 模型 | `qwen3.6-plus` |
| `DREAM_API_URL` | API 地址 | `https://coding.dashscope.aliyuncs.com/v1` |
| `DREAM_MEMORY_DIR` | 记忆目录 | `./memory` |
| `DREAM_LOG_FILE` | 日志文件 | `./dream.log` |

### 2. 手动执行

```bash
node executor.js
```

### 3. 定时执行（推荐）

通过 crontab 每天凌晨 5 点自动运行：

```bash
crontab -e
# 添加以下行
0 5 * * * cd /path/to/dream-system && node executor.js >> logs/dream.log 2>&1
```

## 项目结构

```
dream-system/
├── executor.js          # 主执行器（4 阶段流水线）
├── aiAnalyzer.js        # AI 分析模块（调用大模型提取记忆）
├── pruner.js            # 智能修剪模块（AI + 规则双引擎）
├── config.js            # 配置管理
├── scripts/
│   └── cleanup-before-release.sh  # 发布前清理脚本
└── docs/
    └── RELEASE_CHECKLIST.md       # 发布检查清单
```

## 模块说明

### executor.js — 主执行器

四阶段流水线：读取短期记忆 → AI 分析 → 整合到长期记忆 → 智能修剪。无新的短期记忆时自动跳过本次执行。

### aiAnalyzer.js — AI 分析

调用大模型分析短期记忆文件内容，提取标题、内容、分类、优先级等结构化信息。未配置 API Key 时跳过 AI 分析，不报错。

### pruner.js — 智能修剪

- **触发条件**：MEMORY.md 超过 25KB 或 200 行
- **AI 模式**：调用大模型分析各章节，生成删除/保留建议
- **规则模式**：AI 不可用时自动降级为规则修剪（低优先级 +7 天、中优先级 +30 天、临时内容 +1 天）
- **安全写入**：写入前备份 → 写入临时文件 → 验证非空 → 原子替换

### config.js — 配置管理

统一管理 AI 配置和系统配置，全部支持环境变量覆盖。

## 配置方式

推荐使用 `.env` 文件（已在 `.gitignore` 中）：

```bash
DREAM_API_KEY=your-api-key-here
DREAM_MODEL=qwen3.6-plus
DREAM_API_URL=https://coding.dashscope.aliyuncs.com/v1
```

## 版本历史

### v1.1.0 (2026-04-19)

- 升级默认模型：`qwen3.5-plus` → `qwen3.6-plus`
- API 地址改为 `coding.dashscope.aliyuncs.com/v1`，支持 `DREAM_API_URL` 环境变量
- `integrateMemories` 完整实现：自动备份 + 结构化追加 + 内容验证
- AI 分析路径动态拼接，兼容不同 baseUrl 格式

### v1.0.0 (2026-04-03)

- 初始版本发布

## 许可证

MIT
