# 🌙 Dream Memory Consolidation System

**灵感来自 Claude Code · 完全适配 OpenClaw · 一键安装，马上生效**

[中文文档](#中文文档) | [English Docs](#english-documentation)

---

## 中文文档

### 📖 简介

Dream 记忆整合系统是一个专为 OpenClaw 设计的自动化记忆管理工具。灵感来自 Claude Code 的记忆管理功能，完全适配 OpenClaw 架构。

**核心功能**：
- 🤖 AI 智能分析 - 使用阿里云百炼 qwen3.5-plus 自动提取有价值信息
- 📝 自动整合 - 将短期记忆（每日日志、工作记录）转化为长期记忆
- 🗑️ 智能修剪 - 保持 MEMORY.md 简洁（<200 行，~25KB）
- 💾 自动备份 - 写入前自动备份，防止数据丢失
- ⏰ 定时执行 - 每天凌晨 5 点自动运行
- 🔒 安全保护 - 只读模式 + 内容验证 + 锁机制

### ✨ 特性

1. **只读模式保护**
   - 只能读取：`memory/`、`temp/zvp 计划/`、`temp/zvp 完成情况/`
   - 只能写入：`MEMORY.md`（根目录）
   - 禁止访问：配置文件、技能文件、文档目录

2. **自动备份机制**
   - 每次写入前自动创建备份
   - 备份文件名：`MEMORY.md.backup-<时间戳>`
   - 防止误操作导致数据丢失

3. **内容验证**
   - 新内容不能为空
   - 必须包含重要章节
   - 新内容长度 ≥ 旧内容的 90%

4. **智能修剪**
   - 删除超过 30 天且无价值的信息
   - 保持 MEMORY.md < 200 行
   - 更新索引和交叉引用

### 🚀 快速开始

#### 1. 安装

```bash
# 克隆或复制到 OpenClaw workspace
cd ~/.openclaw/workspace
git clone <your-repo-url> skills/dream-system

# 或直接复制文件
cp -r dream-system ~/.openclaw/workspace/skills/
```

#### 2. 配置 API Key

**方法 A：环境变量（推荐）**

```bash
# 添加到 ~/.bashrc 或 ~/.zshrc
export DREAM_API_KEY="sk-你的百炼 API Key"
export DREAM_MODEL="qwen3.5-plus"

# 生效
source ~/.bashrc
```

**方法 B：内置配置**

编辑 `executor.js`，添加默认 API Key：

```javascript
// 在 executeDream() 函数开头
if (!process.env.DREAM_API_KEY) {
  process.env.DREAM_API_KEY = 'sk-你的 API Key'
}
```

#### 3. 配置定时任务

**使用 crontab：**

```bash
crontab -e
```

添加：

```bash
# 每天凌晨 5 点执行 Dream 记忆整合
0 5 * * * cd ~/.openclaw/workspace && node skills/dream-system/executor.js >> logs/dream.log 2>&1
```

**或使用 OpenClaw cron 工具：**

```bash
openclaw cron add --name "Dream 记忆整合" --schedule "0 5 * * *" --command "node skills/dream-system/executor.js"
```

#### 4. 测试运行

```bash
cd ~/.openclaw/workspace
node skills/dream-system/executor.js

# 查看日志
tail -20 logs/dream.log
```

### 📁 文件结构

```
dream-system/
├── SKILL.md           # OpenClaw 技能定义
├── executor.js        # 主执行器
├── aiAnalyzer.js      # AI 分析模块
├── pruner.js          # 修剪模块
├── start.sh          # 启动脚本
├── README.md         # 本文档
└── CRON_SETUP.md     # 定时任务配置指南
```

### 🔧 配置说明

| 环境变量 | 说明 | 默认值 |
|---------|------|--------|
| `DREAM_API_KEY` | 阿里云百炼 API Key | 必填 |
| `DREAM_MODEL` | AI 模型 | `qwen3.5-plus` |

### 📊 执行流程

```
Phase 1: Orient（定位）
  ↓ 读取 MEMORY.md
  ↓ 列出 memory/ 目录

Phase 2: Gather（收集）
  ↓ 读取 ZVP 计划
  ↓ 读取 ZVP 完成情况
  ↓ 读取最近记忆文件

Phase 3: Consolidate（整合）
  ↓ AI 分析提取关键信息
  ↓ 分类到现有主题或创建新主题
  ↓ 转换相对日期为绝对日期

Phase 4: Prune（修剪）
  ↓ 删除过时信息
  ↓ 保持 <200 行
  ↓ 更新索引
```

### 🛡️ 安全特性

1. **锁机制** - 防止并发执行
2. **路径验证** - 只允许访问指定目录
3. **内容验证** - 防止错误数据
4. **自动备份** - 写入前备份
5. **错误处理** - 失败时不写入任何内容

### 📝 日志查看

```bash
# 查看执行日志
tail -f ~/.openclaw/workspace/logs/dream.log

# 查看备份文件
ls -lh ~/.openclaw/workspace/MEMORY.md.backup-*
```

### ❓ 常见问题

**Q: 如何禁用 Dream 系统？**
```bash
# 注释掉 crontab 任务
crontab -e
# 在 Dream 任务前添加 #
```

**Q: 如何手动执行？**
```bash
cd ~/.openclaw/workspace
node skills/dream-system/executor.js
```

**Q: API 调用失败怎么办？**
- 检查 API Key 是否正确
- 检查网络连接
- 查看日志：`logs/dream.log`

### 📄 许可证

MIT License

---

## English Documentation

### 📖 Introduction

Dream Memory Consolidation System is an automated memory management tool designed for OpenClaw. Inspired by Claude Code's memory management, fully compatible with OpenClaw architecture.

**Core Features**:
- 🤖 AI Analysis - Auto-extract valuable info using Alibaba Cloud Bailian qwen3.5-plus
- 📝 Auto Consolidation - Convert short-term memory to long-term memory
- 🗑️ Smart Pruning - Keep MEMORY.md concise (<200 lines, ~25KB)
- 💾 Auto Backup - Backup before writing to prevent data loss
- ⏰ Scheduled Execution - Auto-run daily at 5:00 AM
- 🔒 Security - Read-only mode + Content validation + Lock mechanism

### ✨ Features

1. **Read-Only Mode Protection**
   - Read allowed: `memory/`, `temp/zvp 计划/`, `temp/zvp 完成情况/`
   - Write allowed: `MEMORY.md` (root directory only)
   - Forbidden: config files, skills, docs

2. **Auto Backup**
   - Backup before every write
   - Backup file: `MEMORY.md.backup-<timestamp>`
   - Prevent data loss from accidents

3. **Content Validation**
   - New content cannot be empty
   - Must include important sections
   - New content length ≥ 90% of old content

4. **Smart Pruning**
   - Remove outdated info (>30 days, no value)
   - Keep MEMORY.md <200 lines
   - Update index and cross-references

### 🚀 Quick Start

#### 1. Install

```bash
# Clone or copy to OpenClaw workspace
cd ~/.openclaw/workspace
git clone <your-repo-url> skills/dream-system

# Or copy files directly
cp -r dream-system ~/.openclaw/workspace/skills/
```

#### 2. Configure API Key

**Option A: Environment Variables (Recommended)**

```bash
# Add to ~/.bashrc or ~/.zshrc
export DREAM_API_KEY="sk-your-bailian-api-key"
export DREAM_MODEL="qwen3.5-plus"

# Apply
source ~/.bashrc
```

**Option B: Built-in Configuration**

Edit `executor.js`, add default API Key:

```javascript
// At the beginning of executeDream()
if (!process.env.DREAM_API_KEY) {
  process.env.DREAM_API_KEY = 'sk-your-api-key'
}
```

#### 3. Configure Scheduled Task

**Using crontab:**

```bash
crontab -e
```

Add:

```bash
# Run Dream memory consolidation daily at 5 AM
0 5 * * * cd ~/.openclaw/workspace && node skills/dream-system/executor.js >> logs/dream.log 2>&1
```

**Or use OpenClaw cron tool:**

```bash
openclaw cron add --name "Dream Memory" --schedule "0 5 * * *" --command "node skills/dream-system/executor.js"
```

#### 4. Test Run

```bash
cd ~/.openclaw/workspace
node skills/dream-system/executor.js

# View logs
tail -20 logs/dream.log
```

### 📁 File Structure

```
dream-system/
├── SKILL.md           # OpenClaw skill definition
├── executor.js        # Main executor
├── aiAnalyzer.js      # AI analysis module
├── pruner.js          # Pruning module
├── start.sh          # Startup script
├── README.md         # This document
└── CRON_SETUP.md     # Cron setup guide
```

### 🔧 Configuration

| Env Variable | Description | Default |
|-------------|-------------|---------|
| `DREAM_API_KEY` | Alibaba Cloud Bailian API Key | Required |
| `DREAM_MODEL` | AI Model | `qwen3.5-plus` |

### 📊 Execution Flow

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
  ↓ Remove outdated info
  ↓ Keep <200 lines
  ↓ Update index
```

### 🛡️ Security Features

1. **Lock Mechanism** - Prevent concurrent execution
2. **Path Validation** - Only allow specified directories
3. **Content Validation** - Prevent corrupted data
4. **Auto Backup** - Backup before writing
5. **Error Handling** - Don't write on failure

### 📝 View Logs

```bash
# View execution logs
tail -f ~/.openclaw/workspace/logs/dream.log

# View backup files
ls -lh ~/.openclaw/workspace/MEMORY.md.backup-*
```

### ❓ FAQ

**Q: How to disable Dream system?**
```bash
# Comment out crontab task
crontab -e
# Add # before Dream task
```

**Q: How to run manually?**
```bash
cd ~/.openclaw/workspace
node skills/dream-system/executor.js
```

**Q: API call failed?**
- Check API Key is correct
- Check network connection
- View logs: `logs/dream.log`

### 📄 License

MIT License

---

**Made with ❤️ for OpenClaw Community**
