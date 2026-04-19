# 🌙 Dream Memory Integration System

> An automated memory management system inspired by Claude Code's memory features.

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## 🔒 Security

**⚠️ Important**: This project does NOT use hardcoded API keys. All sensitive information is configured via environment variables.

**Quick Setup**:
```bash
export DREAM_API_KEY="your-api-key-here"
export DREAM_MODEL="qwen3.6-plus"
export DREAM_API_URL="https://coding.dashscope.aliyuncs.com/v1"  # optional
```

**❌ NEVER**:
- Hardcode API keys in source code
- Commit API keys to Git
- Share API keys in public docs

---

## ✨ Features

- 🤖 **AI-Powered Analysis** - Analyzes short-term memory using qwen3.6-plus
- 📝 **Auto Integration** - Converts short-term memories into long-term memory
- 💾 **Auto Backup** - Backs up MEMORY.md before writing to prevent data loss
- 🔍 **Content Validation** - Skips empty or trivial writes automatically
- ⏰ **Scheduled Execution** - Runs daily at 5:00 AM

---

## 🏗️ Architecture

```
dream-system/
├── executor.js          # Main executor
├── aiAnalyzer.js        # AI analysis module
├── pruner.js            # Smart pruning module
├── config.js            # Configuration manager
├── scripts/             # Utility scripts
│   └── cleanup-before-release.sh
└── docs/
    └── RELEASE_CHECKLIST.md
```

---

## 🚀 Quick Start

### 1. Clone

```bash
git clone https://github.com/JingWang-Star996/dream-system.git
cd dream-system
```

### 2. Configure

```bash
export DREAM_API_KEY="your-api-key-here"
export DREAM_MODEL="qwen3.6-plus"
```

### 3. Run

```bash
node executor.js
```

---

## 📊 Workflow

```
Phase 1: Read short-term memory
    ↓
Phase 2: AI analysis
    ↓
Phase 3: Integrate to long-term memory (backup + validate + write)
    ↓
Phase 4: Smart pruning
```

---

## 🔧 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DREAM_API_KEY` | AI API Key | None | ✅ |
| `DREAM_MODEL` | AI model | `qwen3.6-plus` | ❌ |
| `DREAM_API_URL` | API endpoint | `https://coding.dashscope.aliyuncs.com/v1` | ❌ |
| `DREAM_MEMORY_DIR` | Memory directory | `./memory` | ❌ |
| `DREAM_LOG_FILE` | Log file | `./dream.log` | ❌ |

### Using .env (Recommended)

```bash
DREAM_API_KEY=your-api-key-here
DREAM_MODEL=qwen3.6-plus
```

**Note**: `.env` is in `.gitignore` and will NOT be committed.

---

## 📝 Usage

### Manual

```bash
cd dream-system && node executor.js
```

### Scheduled (crontab)

```bash
0 5 * * * cd /path/to/dream-system && node executor.js >> logs/dream.log 2>&1
```

---

## 🔒 Security Best Practices

### 1. Use Environment Variables

**❌ Wrong**:
```javascript
const CONFIG = { apiKey: 'sk-sp-xxxxxx' };
```

**✅ Correct**:
```javascript
const CONFIG = { apiKey: process.env.DREAM_API_KEY || '' };
```

### 2. Pre-Release Check

```bash
./scripts/cleanup-before-release.sh
grep -r "sk-sp-" . --include="*.js"
grep -r "z3129119" . --include="*.js"
```

---

## 📋 Changelog

### v1.1.0 (2026-04-19)
- Upgraded default model: `qwen3.5-plus` → `qwen3.6-plus`
- API URL changed to `coding.dashscope.aliyuncs.com/v1`, configurable via `DREAM_API_URL`
- `integrateMemories` fully implemented: auto-backup + structured append + validation
- AI analysis path now dynamically built from baseUrl

### v1.0.0 (2026-04-03)
- Initial release

---

## 🔗 Links

- **GitHub**: https://github.com/JingWang-Star996/dream-system
- **Issues**: https://github.com/JingWang-Star996/dream-system/issues

---

**🎊 Thanks for using Dream Memory Integration System!**
