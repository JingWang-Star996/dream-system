# 🌙 Dream Memory Integration System

> Automated memory management — consolidates short-term memories into long-term memory, keeping MEMORY.md lean and useful.

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Overview

Dream is an automated memory integration system. It periodically reads short-term memory files from the `memory/` directory, uses AI to extract valuable insights, and appends them to the long-term memory file `MEMORY.md`. Smart pruning keeps the file concise.

Inspired by Claude Code's memory management, adapted for the OpenClaw memory system.

## Features

| Feature | Description |
|---------|-------------|
| AI-Powered Analysis | Uses qwen3.6-plus to extract 3-5 high-value long-term memories from short-term notes |
| Auto Integration | Appends analysis results to MEMORY.md in a structured format |
| Auto Backup | Backs up MEMORY.md before every write to prevent data loss |
| Content Validation | Skips empty or trivial content (<100 chars) to avoid meaningless writes |
| Smart Pruning | Dual-engine (AI + rules) to automatically identify and remove outdated or low-priority sections |

## Workflow

```
Phase 1 ── Read Short-Term Memory
   │           Scan all .md files in memory/
   ▼
Phase 2 ── AI Analysis
   │           Call LLM to extract valuable long-term memories
   ▼
Phase 3 ── Integrate to Long-Term Memory
   │           Backup MEMORY.md → Structured append → Content validation
   ▼
Phase 4 ── Smart Pruning
               Auto-prune when file exceeds 25KB or 200 lines
```

## Quick Start

### 1. Configure

Set environment variables:

```bash
export DREAM_API_KEY="your-api-key-here"
```

Optional variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `DREAM_API_KEY` | API key (required) | — |
| `DREAM_MODEL` | AI model | `qwen3.6-plus` |
| `DREAM_API_URL` | API endpoint | `https://coding.dashscope.aliyuncs.com/v1` |
| `DREAM_MEMORY_DIR` | Memory directory | `./memory` |
| `DREAM_LOG_FILE` | Log file | `./dream.log` |

### 2. Manual Execution

```bash
node executor.js
```

### 3. Scheduled Execution (Recommended)

Run daily at 5:00 AM via crontab:

```bash
crontab -e
# Add this line
0 5 * * * cd /path/to/dream-system && node executor.js >> logs/dream.log 2>&1
```

## Project Structure

```
dream-system/
├── executor.js          # Main executor (4-stage pipeline)
├── aiAnalyzer.js        # AI analysis module (LLM-powered memory extraction)
├── pruner.js            # Smart pruning module (AI + rules dual engine)
├── config.js            # Configuration management
├── scripts/
│   └── cleanup-before-release.sh  # Pre-release cleanup script
└── docs/
    └── RELEASE_CHECKLIST.md       # Release checklist
```

## Module Details

### executor.js — Main Executor

Four-stage pipeline: read short-term memory → AI analysis → integrate to long-term memory → smart pruning. Skips execution when no new short-term memories exist.

### aiAnalyzer.js — AI Analysis

Calls the LLM to analyze short-term memory files and extract structured information (title, content, category, priority). Gracefully skips analysis when no API key is configured.

### pruner.js — Smart Pruning

- **Trigger**: MEMORY.md exceeds 25KB or 200 lines
- **AI Mode**: Calls LLM to analyze sections and generate delete/keep recommendations
- **Rule Mode**: Falls back to rule-based pruning when AI is unavailable (low priority +7 days, medium priority +30 days, temporary content +1 day)
- **Safe Write**: Backup → write to temp file → verify non-empty → atomic rename

### config.js — Configuration

Centralized AI and system configuration, all overridable via environment variables.

## Configuration

Recommended: use a `.env` file (already in `.gitignore`):

```bash
DREAM_API_KEY=your-api-key-here
DREAM_MODEL=qwen3.6-plus
DREAM_API_URL=https://coding.dashscope.aliyuncs.com/v1
```

## Changelog

### v1.1.0 (2026-04-19)

- Upgraded default model: `qwen3.5-plus` → `qwen3.6-plus`
- API URL changed to `coding.dashscope.aliyuncs.com/v1`, configurable via `DREAM_API_URL`
- `integrateMemories` fully implemented: auto-backup + structured append + validation
- AI analysis path dynamically built from baseUrl

### v1.0.0 (2026-04-03)

- Initial release

## License

MIT
