# Dream 记忆整合系统 v1.0.0

**灵感来自 Claude Code · 完全适配 OpenClaw · 一键安装，马上生效**

---

## 🎉 发布说明

Dream 记忆整合系统是一个专为 OpenClaw 设计的自动化记忆管理工具，灵感来自 Claude Code 的记忆管理功能。

### ✨ 核心功能

- 🤖 **AI 智能分析** - 使用阿里云百炼 qwen3.5-plus 自动提取有价值信息
- 📝 **自动整合** - 将短期记忆（每日日志、工作记录）转化为长期记忆
- 🗑️ **智能修剪** - 保持 MEMORY.md 简洁（<200 行，~25KB）
- 💾 **自动备份** - 写入前自动备份，防止数据丢失
- ⏰ **定时执行** - 每天凌晨 5 点自动运行
- 🔒 **安全保护** - 只读模式 + 内容验证 + 锁机制

### 🚀 快速开始

#### 一键安装（推荐）

```bash
# 下载安装脚本
curl -O https://raw.githubusercontent.com/your-username/dream-system/main/install.sh

# 执行安装
chmod +x install.sh
./install.sh
```

#### 手动安装

```bash
# 克隆到 OpenClaw workspace
cd ~/.openclaw/workspace
git clone https://github.com/your-username/dream-system.git skills/dream-system

# 配置 API Key
export DREAM_API_KEY="sk-你的百炼 API Key"

# 配置定时任务
crontab -e
# 添加：0 5 * * * cd ~/.openclaw/workspace && node skills/dream-system/executor.js >> logs/dream.log 2>&1

# 测试运行
node skills/dream-system/executor.js
```

### 📁 文件清单

```
dream-system/
├── SKILL.md              # OpenClaw 技能定义
├── executor.js           # 主执行器（10.2 KB）
├── aiAnalyzer.js         # AI 分析模块（3.8 KB）
├── pruner.js            # 修剪模块（10.2 KB）
├── start.sh             # 启动脚本（3.0 KB）
├── install.sh           # 一键安装脚本（3.7 KB）⭐ 新增
├── README.md            # 中文文档
├── README.github.md     # GitHub 双语文档 ⭐ 新增
├── CRON_SETUP.md        # 定时任务配置指南
└── LICENSE              # MIT 许可证
```

### 🔧 配置要求

- **OpenClaw**: v2026.3.24 或更高版本
- **Node.js**: v14 或更高版本
- **API**: 阿里云百炼 API Key（qwen3.5-plus 模型）

### 📊 测试结果

在实际测试中（2026-04-02）：
- ✅ API 调用成功
- ✅ 文件大小优化：30.25KB → 15.45KB（-49%）
- ✅ 行数保持不变：950 行
- ✅ 自动备份创建成功
- ✅ 定时任务配置成功

### 🛡️ 安全特性

1. **只读模式** - 只能读取指定目录（memory/、temp/）
2. **写入限制** - 只能写入 MEMORY.md（根目录）
3. **自动备份** - 每次写入前自动备份
4. **内容验证** - 防止错误数据覆盖
5. **锁机制** - 防止并发执行
6. **路径验证** - 禁止访问配置目录

### 📝 更新日志

#### v1.0.0 (2026-04-02)

**新增**
- ✨ 初始版本发布
- 🤖 AI 智能分析模块
- 🗑️ 智能修剪功能
- 💾 自动备份机制
- ⏰ 定时任务支持
- 🔒 安全保护机制
- 📱 一键安装脚本
- 📖 中英文双语文档

**优化**
- ⚡ 适配 OpenClaw v2026.4.1
- 🔧 支持阿里云百炼 API
- 📝 支持 qwen3.5-plus 模型

### 📖 文档

- [中文文档](README.md)
- [English Docs](README.github.md)
- [安装指南](install.sh)
- [定时任务配置](CRON_SETUP.md)

### ❓ 常见问题

**Q: 如何禁用 Dream 系统？**
```bash
crontab -e
# 在 Dream 任务前添加 # 注释
```

**Q: 如何查看执行日志？**
```bash
tail -f ~/.openclaw/workspace/logs/dream.log
```

**Q: 如何手动执行？**
```bash
cd ~/.openclaw/workspace
node skills/dream-system/executor.js
```

### 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 📄 许可证

MIT License - 详见 [LICENSE](LICENSE)

### 🙏 致谢

- 灵感来自 [Claude Code](https://claude.ai/code) 的记忆管理功能
- 完全适配 [OpenClaw](https://github.com/openclaw/openclaw) 架构
- 使用 [阿里云百炼](https://bailian.console.aliyun.com/) 提供 AI 能力

---

**Made with ❤️ for OpenClaw Community**

**GitHub**: https://github.com/your-username/dream-system  
**Issues**: https://github.com/your-username/dream-system/issues  
**Docs**: https://github.com/your-username/dream-system/blob/main/README.github.md
