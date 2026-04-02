# 🌙 Dream Memory Consolidation System

**Inspired by Claude Code · Fully Compatible with OpenClaw · One-Click Installation, Instant Results**

**Release Author**: 【游戏人王鲸】【游戏制作人王鲸】(JingWang)

---

## 📢 Introduction

Dream is an automated memory management tool designed for OpenClaw. Inspired by Claude Code's memory management, it converts short-term memory (daily logs, work records) into long-term memory (MEMORY.md).

### ✨ Core Features

| Feature | Description |
|---------|-------------|
| 🤖 AI Analysis | Auto-extract valuable info using Alibaba Cloud Bailian qwen3.5-plus |
| 📝 Auto Consolidation | Convert short-term memory to long-term memory |
| 🗑️ Smart Pruning | Keep MEMORY.md concise (<200 lines, ~25KB) |
| 💾 Auto Backup | Backup before writing to prevent data loss |
| ⏰ Scheduled Execution | Auto-run daily at 5:00 AM |
| 🔒 Security | Read-only mode + Content validation + Lock mechanism |

---

## 🚀 Quick Start

### One-Click Installation (Recommended)

```bash
# Download and run installer
curl -O https://raw.githubusercontent.com/JingWang-Star996/dream-system/main/install.sh
chmod +x install.sh
./install.sh
```

### Manual Installation

```bash
# Clone to OpenClaw workspace
cd ~/.openclaw/workspace
git clone https://github.com/JingWang-Star996/dream-system.git skills/dream-system

# Configure API Key
export DREAM_API_KEY="sk-your-bailian-api-key"
export DREAM_MODEL="qwen3.5-plus"

# Configure cron job
crontab -e
# Add: 0 5 * * * cd ~/.openclaw/workspace && node skills/dream-system/executor.js >> logs/dream.log 2>&1

# Test run
node skills/dream-system/executor.js
```

---

## 📁 File Structure

```
dream-system/
├── SKILL.md              # OpenClaw skill definition
├── executor.js           # Main executor (10.2 KB)
├── aiAnalyzer.js         # AI analysis module (3.8 KB)
├── pruner.js             # Pruning module (10.2 KB)
├── start.sh              # Startup script
├── install.sh            # One-click installer ⭐
├── README.md             # This document (bilingual)
├── README.github.md      # GitHub documentation
├── RELEASE.md            # Release notes
├── CRON_SETUP.md         # Cron setup guide
└── 发布帖.md             # Detailed release post (Chinese)
```

---

## 🔄 Execution Flow

```
Phase 1: Orient
  ↓ Read MEMORY.md
  ↓ List memory/ directory

Phase 2: Gather
  ↓ Read ZVP plans
  ↓ Read ZVP completions
  ↓ Read recent memory files

Phase 3: Consolidate
  ↓ AI analysis extract key info
  ↓ Categorize to existing topics or create new
  ↓ Convert relative dates to absolute dates

Phase 4: Prune
  ↓ Remove outdated info (>30 days)
  ↓ Keep <200 lines
  ↓ Update index
```

---

## 🛡️ Security Features

### 1. Read-Only Mode

**Read allowed**:
- `memory/` directory
- `temp/zvp 计划/` directory
- `temp/zvp 完成情况/` directory

**Write allowed**:
- `MEMORY.md` (root directory only)

**Forbidden**:
- `.openclaw/config/` - Core config
- `skills/` - Skill files
- `docs/` - Documents
- `AGENTS.md`, `SOUL.md`, `TOOLS.md` - Protected files

### 2. Auto Backup

```bash
MEMORY.md → MEMORY.md.backup-<timestamp>
```

Backup before every write to prevent data loss.

### 3. Content Validation

- New content cannot be empty
- Must include important sections
- New content length ≥ 90% of old content

### 4. Lock Mechanism

Prevent concurrent execution using `/tmp/dream.lock` file.

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DREAM_API_KEY` | Alibaba Cloud Bailian API Key | Required |
| `DREAM_MODEL` | AI Model | `qwen3.5-plus` |

### Get API Key

1. Visit: https://bailian.console.aliyun.com/
2. Login/Register Alibaba Cloud account
3. Create API Key
4. Copy Key to environment:
   ```bash
   export DREAM_API_KEY="sk-xxx"
   ```

---

## 📊 Performance

### Test Results (2026-04-02)

| Metric | Before | After | Optimization |
|--------|--------|-------|--------------|
| File Size | 30.25 KB | 15.45 KB | **-49%** |
| Lines | 950 | 950 | Unchanged |
| API Call | ✅ Success | - | - |
| Backup | ✅ Created | - | - |

### Performance

- **Execution Time**: ~30 seconds
- **API Calls**: 1 (qwen3.5-plus)
- **Memory Usage**: <50MB
- **Disk Usage**: ~30KB (with backup)

---

## 📋 Commands Reference

### Installation

```bash
# One-click install
./install.sh

# Manual install
git clone <repo-url> skills/dream-system
```

### Configuration

```bash
# Set environment variables
export DREAM_API_KEY="sk-xxx"
export DREAM_MODEL="qwen3.5-plus"

# Permanent config (add to ~/.bashrc)
echo 'export DREAM_API_KEY="sk-xxx"' >> ~/.bashrc
source ~/.bashrc
```

### Execution

```bash
# Manual run
cd ~/.openclaw/workspace
node skills/dream-system/executor.js

# View logs
tail -f logs/dream.log

# View backups
ls -lh MEMORY.md.backup-*
```

### Cron Jobs

```bash
# View current crontab
crontab -l

# Edit crontab
crontab -e

# Add Dream task
0 5 * * * cd ~/.openclaw/workspace && node skills/dream-system/executor.js >> logs/dream.log 2>&1

# Disable task (add # before task)
# 0 5 * * * ...

# Delete task
crontab -r
```

### Debug

```bash
# Check API config
echo $DREAM_API_KEY
echo $DREAM_MODEL

# Test API call
node -e "require('./skills/dream-system/aiAnalyzer.js').analyzeWithAI({}, []).then(console.log)"

# Check file permissions
ls -la skills/dream-system/

# View process lock
cat /tmp/dream.lock
```

---

## ❓ FAQ

### Q: How to disable Dream system?

```bash
crontab -e
# Add # before Dream task
# 0 5 * * * ...
```

### Q: How to view logs?

```bash
tail -f ~/.openclaw/workspace/logs/dream.log
```

### Q: How to run manually?

```bash
cd ~/.openclaw/workspace
node skills/dream-system/executor.js
```

### Q: API call failed?

1. Check API Key is correct
2. Check network connection
3. View logs: `logs/dream.log`
4. Test API: `curl -H "Authorization: Bearer $DREAM_API_KEY" https://dashscope.aliyuncs.com/compatible-mode/v1/models`

### Q: How to restore backup?

```bash
# View backups
ls -lh MEMORY.md.backup-*

# Restore specific backup
cp MEMORY.md.backup-1775103782790 MEMORY.md
```

### Q: Support other AI models?

Yes! Modify `aiAnalyzer.js`:

```javascript
const AI_CONFIG = {
  model: 'qwen-max',  // or any supported model
  apiKey: process.env.DREAM_API_KEY,
  baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1'
}
```

---

## 🏗️ Architecture

### Overview

```
┌─────────────────────────────────────────────────────────┐
│                    OpenClaw Gateway                      │
└─────────────────────────────────────────────────────────┘
                            │
                            │ Scheduled Trigger (05:00 daily)
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   Dream Memory System                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ executor.js │→ │aiAnalyzer.js│→ │ pruner.js   │     │
│  │  Executor   │  │  AI Analysis│  │  Pruning    │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│         │                │                  │           │
│         ▼                ▼                  ▼           │
│  ┌─────────────────────────────────────────────────┐   │
│  │            MEMORY.md (Long-term Memory)          │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
         │                │                  │
         ▼                ▼                  ▼
  ┌──────────┐    ┌──────────┐    ┌──────────┐
  │ memory/  │    │temp/Plan │    │temp/Done │
  │ Daily    │    │ Plans    │    │ Complete │
  └──────────┘    └──────────┘    └──────────┘
```

### Modules

#### 1. executor.js (Main Executor)

**Responsibilities**:
- Coordinate 4 phases (Orient, Gather, Consolidate, Prune)
- Path permission validation (read-only mode)
- Lock mechanism (prevent concurrent execution)
- Error handling

#### 2. aiAnalyzer.js (AI Analysis Module)

**Responsibilities**:
- Build analysis prompt
- Call Alibaba Cloud Bailian API
- Parse AI response (JSON format)
- Generate memory update suggestions

#### 3. pruner.js (Pruning Module)

**Responsibilities**:
- Analyze MEMORY.md content
- Generate pruning suggestions (remove outdated info)
- Safe write (with backup and validation)
- Keep <200 lines

---

## 📄 License

**MIT License**

```
Copyright (c) 2026 JingWang【游戏人王鲸】【游戏制作人王鲸】

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🤝 Contributing

Welcome to submit Issues and Pull Requests!

### Development Setup

```bash
# Clone repository
git clone https://github.com/JingWang-Star996/dream-system.git
cd dream-system

# Install dependencies (if any)
npm install

# Run test
node executor.js
```

### Commit Convention

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation update
- `style:` Code style
- `refactor:` Refactoring
- `test:` Test
- `chore:` Build/Tools

---

## 🙏 Acknowledgments

- **Inspiration**: [Claude Code](https://claude.ai/code) memory management
- **Platform**: [OpenClaw](https://github.com/openclaw/openclaw) community
- **AI Provider**: [Alibaba Cloud Bailian](https://bailian.console.aliyun.com/)

---

## 📬 Contact

- **GitHub**: https://github.com/JingWang-Star996/dream-system
- **Issues**: https://github.com/JingWang-Star996/dream-system/issues
- **Author**: JingWang【游戏人王鲸】【游戏制作人王鲸】

---

**Made with ❤️ by【游戏人王鲸】【游戏制作人王鲸】for OpenClaw Community**

**Last Updated**: 2026-04-02

---

---

# 🌙 Dream 记忆整合系统（中文文档）

**灵感来自 Claude Code · 完全适配 OpenClaw · 一键安装，马上生效**

**发布人**：【游戏人王鲸】【游戏制作人王鲸】

---

## 📖 简介

Dream 记忆整合系统是一个专为 OpenClaw 设计的自动化记忆管理工具。灵感来自 Claude Code 的记忆管理功能，完全适配 OpenClaw 架构。

### ✨ 核心功能

- 🤖 AI 智能分析 - 使用阿里云百炼 qwen3.5-plus 自动提取有价值信息
- 📝 自动整合 - 将短期记忆（每日日志、工作记录）转化为长期记忆
- 🗑️ 智能修剪 - 保持 MEMORY.md 简洁（<200 行，~25KB）
- 💾 自动备份 - 写入前自动备份，防止数据丢失
- ⏰ 定时执行 - 每天凌晨 5 点自动运行
- 🔒 安全保护 - 只读模式 + 内容验证 + 锁机制

---

## 🚀 快速开始

### 一键安装

```bash
curl -O https://raw.githubusercontent.com/JingWang-Star996/dream-system/main/install.sh
chmod +x install.sh
./install.sh
```

### 手动安装

```bash
cd ~/.openclaw/workspace
git clone https://github.com/JingWang-Star996/dream-system.git skills/dream-system
export DREAM_API_KEY="sk-你的百炼 API Key"
crontab -e
# 添加：0 5 * * * cd ~/.openclaw/workspace && node skills/dream-system/executor.js >> logs/dream.log 2>&1
```

---

## 📁 文件结构

```
dream-system/
├── SKILL.md           # OpenClaw 技能定义
├── executor.js        # 主执行器
├── aiAnalyzer.js      # AI 分析模块
├── pruner.js          # 修剪模块
├── install.sh         # 一键安装脚本
├── README.md          # 本文档
└── 发布帖.md          # 详细发布帖
```

---

## 📊 实测数据

| 指标 | 修剪前 | 修剪后 | 优化 |
|------|--------|--------|------|
| 文件大小 | 30.25 KB | 15.45 KB | **-49%** |
| 行数 | 950 行 | 950 行 | 保持不变 |
| API 调用 | ✅ 成功 | - | - |

---

## ❓ 常见问题

### Q: 如何禁用 Dream 系统？

```bash
crontab -e
# 在 Dream 任务前添加 # 注释
```

### Q: 如何查看执行日志？

```bash
tail -f ~/.openclaw/workspace/logs/dream.log
```

### Q: 如何手动执行？

```bash
cd ~/.openclaw/workspace
node skills/dream-system/executor.js
```

---

**Made with ❤️ by【游戏人王鲸】【游戏制作人王鲸】for OpenClaw Community**

**最后更新**：2026-04-02
