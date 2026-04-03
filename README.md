# 🌙 Dream 记忆整合系统

> 一个自动化的记忆整合系统，灵感来自 Claude Code 的记忆管理功能

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## 🔒 安全提示

**⚠️ 重要**：本项目不使用硬编码 API Key，所有敏感信息使用环境变量配置。

**快速配置**：
```bash
export DREAM_API_KEY="your-api-key-here"
export DREAM_MODEL="qwen3.5-plus"
```

**❌ 永远不要**：
- 在代码中硬编码 API Key
- 将 API Key 提交到 Git
- 在公开文档中分享 API Key

---

## ✨ 核心功能

- 🤖 **AI 智能分析** - 使用 qwen3.5-plus 模型分析短期记忆
- 📝 **自动整合** - 将短期记忆转化为长期记忆
- 🗑️ **智能修剪** - 保持 MEMORY.md 精简（<200 行）
- 💾 **自动备份** - 写入前自动备份，防止数据丢失
- ⏰ **定时执行** - 每天凌晨 5 点自动运行

---

## 🏗️ 系统架构

```
dream-system/
├── executor.js          # 主执行器
├── aiAnalyzer.js        # AI 分析模块
├── pruner.js            # 智能修剪模块
├── config.js            # 配置管理
├── scripts/             # 工具脚本
│   └── cleanup-before-release.sh  # 发布前清理脚本
└── docs/                # 文档
    └── RELEASE_CHECKLIST.md  # 发布前检查清单
```

---

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/JingWang-Star996/dream-system.git
cd dream-system
```

### 2. 配置环境变量

**Linux/macOS**：
```bash
# 添加到 ~/.bashrc
echo 'export DREAM_API_KEY="your-api-key-here"' >> ~/.bashrc
echo 'export DREAM_MODEL="qwen3.5-plus"' >> ~/.bashrc

# 生效
source ~/.bashrc
```

**Windows**：
```powershell
setx DREAM_API_KEY "your-api-key-here"
setx DREAM_MODEL "qwen3.5-plus"
```

### 3. 测试运行

```bash
node executor.js
```

**预期输出**：
```
=== Dream 记忆整合系统启动 ===
模型：qwen3.5-plus
记忆目录：./memory
记忆文件：./MEMORY.md

【Phase 1】读取短期记忆...
读取到 9 个短期记忆文件

【Phase 2】AI 智能分析...
AI 分析完成，生成 5 条新记忆

【Phase 3】整合到长期记忆...
记忆整合完成

【Phase 4】智能修剪...
记忆修剪完成

=== Dream 记忆整合系统完成 ===
```

---

## 📊 执行流程

```
┌─────────────────┐
│  Phase 1        │
│  读取短期记忆   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Phase 2        │
│  AI 智能分析     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Phase 3        │
│  整合到长期记忆 │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Phase 4        │
│  智能修剪       │
└─────────────────┘
```

---

## 🔧 配置选项

### 环境变量

| 变量名 | 说明 | 默认值 | 必填 |
|--------|------|--------|------|
| `DREAM_API_KEY` | AI API Key | 无 | ✅ |
| `DREAM_MODEL` | AI 模型 | `qwen3.5-plus` | ❌ |
| `DREAM_MEMORY_DIR` | 记忆目录 | `./memory` | ❌ |
| `DREAM_LOG_FILE` | 日志文件 | `./dream.log` | ❌ |

### 使用 .env 文件（推荐）

创建 `.env` 文件：
```bash
DREAM_API_KEY=your-api-key-here
DREAM_MODEL=qwen3.5-plus
```

**注意**：`.env` 文件已在 `.gitignore` 中，不会被提交到 Git。

---

## 📝 使用示例

### 手动执行

```bash
cd dream-system
node executor.js
```

### 定时任务

**Linux/macOS**（crontab）：
```bash
# 编辑 crontab
crontab -e

# 添加每天凌晨 5 点执行
0 5 * * * cd /path/to/dream-system && node executor.js >> logs/dream.log 2>&1
```

**Windows**（任务计划程序）：
1. 打开"任务计划程序"
2. 创建基本任务
3. 设置每天 5:00 触发
4. 操作：启动程序 `node.exe`，参数 `executor.js`

---

## 🔒 安全最佳实践

### 1. 使用环境变量

**❌ 错误**：
```javascript
const CONFIG = {
  apiKey: 'sk-sp-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
};
```

**✅ 正确**：
```javascript
const CONFIG = {
  apiKey: process.env.DREAM_API_KEY || ''
};
```

### 2. 不要提交敏感信息

**.gitignore** 已包含：
```
# 环境变量
.env
.env.local
.env.*.local

# 日志
logs/
*.log

# 备份
backups/
*.backup
```

### 3. 发布前检查

使用提供的检查脚本：
```bash
cd scripts
./cleanup-before-release.sh
```

或手动检查：
```bash
# 检查 API Key
grep -r "sk-sp-" . --include="*.js"

# 检查个人信息
grep -r "z3129119" . --include="*.js"
```

---

## 📚 文档

- [使用指南](https://www.feishu.cn/docx/Rv57duDxlobsDIxAEYKcodCcn4e)
- [发布前检查清单](docs/RELEASE_CHECKLIST.md)

---

## 🤝 贡献指南

### 提交代码

1. Fork 仓库
2. 创建分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 发布前检查

**必须执行**：
```bash
# 运行清理脚本
./scripts/cleanup-before-release.sh

# 手动检查
grep -r "sk-sp-" . --include="*.js"
grep -r "z3129119" . --include="*.js"
```

**检查清单**：
- [ ] 无 API Key
- [ ] 无用户名
- [ ] 无本地路径
- [ ] 无个人邮箱

详见：[RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md)

---

## 📄 许可证

MIT License

---

## 🔗 相关链接

- **GitHub**: https://github.com/JingWang-Star996/dream-system
- **Issues**: https://github.com/JingWang-Star996/dream-system/issues
- **使用指南**: https://www.feishu.cn/docx/Rv57duDxlobsDIxAEYKcodCcn4e

---

**最后更新**：2026-04-03  
**版本**：v1.0.0

---

**🎊 感谢使用 Dream 记忆整合系统！**