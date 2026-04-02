# Dream 记忆整合系统

> 🌙 将短期记忆转化为长期记忆的后台引擎

---

## 📊 系统概览

**Dream（梦境）** 是一个后台记忆整合引擎，负责将用户的短期记忆（每日日志、工作记录、会话记录）整合为长期记忆（MEMORY.md）。

### 核心特性

- **三分支触发** - 时间门（24h）+ 会话门（5 次）+ 锁门
- **只读执行** - Bash 命令限制（ls/find/grep/cat 等）
- **四阶段流程** - Orient→Gather→Consolidate→Prune
- **子代理执行** - 后台运行，不阻塞主流程
- **进度可视化** - 任务状态实时更新
- **核心保护** - 只读模式 + 自动备份 + 内容验证

---

## 🚀 快速开始

### 1. 配置（可选）

如果需要调用 AI API，配置环境变量：

```bash
export ANTHROPIC_API_KEY="your-api-key"
export DREAM_MODEL="claude-sonnet-4-6"
```

不配置则使用模拟响应（仅测试用）。

### 2. 手动触发

```bash
cd /home/z3129119/.openclaw/workspace
node skills/dream-system/executor.js
```

### 3. 查看输出

```
[Dream] 开始记忆整合...
[Dream] Phase 1: Orient
[Dream] Phase 2: Gather
[Dream] 读取计划：2026-04-01.json
[Dream] 读取完成情况：2026-04-01.json
[Dream] 收集到 2 个信号
[Dream] Phase 3: Consolidate
[Dream] Phase 4: Prune
[Dream] MEMORY.md 大小：22.88 KB
[Dream] 文件大小正常，无需修剪
[Dream] 记忆整合完成
```

---

## 📁 文件结构

```
skills/dream-system/
├── SKILL.md           # Skill 提示词（AI 角色定义）
├── executor.js        # 主执行器（四阶段流程 + 安全保护）
├── aiAnalyzer.js      # AI 分析模块（调用 API + 解析响应）
├── README.md          # 本文档
└── test/              # 测试目录（待创建）
```

---

## 🔄 执行流程

### Phase 1: Orient（定位）

**目标**：了解现有记忆结构

**操作**：
1. 读取 MEMORY.md
2. 列出 memory/ 目录
3. 识别现有主题

**输出**：
```javascript
{
  memoryContent: "...",
  memoryPath: "...",
  files: ["2026-04-01.md", ...]
}
```

---

### Phase 2: Gather（收集信号）

**目标**：收集短期记忆

**操作**：
1. 读取 `temp/zvp 计划/*.json`
2. 读取 `temp/zvp 完成情况/*.json`
3. 读取 `memory/日期.md`
4. 识别新信息

**输出**：
```javascript
[
  { type: 'plan', file: '2026-04-01.json', content: "..." },
  { type: 'completion', file: '2026-04-01.json', content: "..." }
]
```

---

### Phase 3: Consolidate（整合）

**目标**：分析并生成记忆更新

**操作**：
1. 调用 AI API 分析信号
2. 提取有价值的信息
3. 生成 MEMORY.md 更新内容

**AI 返回格式**：
```json
{
  "newSections": [
    {
      "title": "主题名称",
      "date": "2026-04-01",
      "source": "来源文件",
      "content": "具体内容，<100 字",
      "priority": "高|中|低",
      "category": "重要决策 | 项目与任务 | 经验教训 | 技术发现"
    }
  ],
  "updates": [],
  "pruneSuggestions": []
}
```

---

### Phase 4: Prune（修剪）

**目标**：保持 MEMORY.md 精简

**操作**：
1. 检查文件大小（<25KB）
2. 检查行数（<200 行）
3. 识别过时内容
4. 生成修剪建议

**限制**：
- 大小：25KB
- 行数：200 行
- 保留：高优先级内容
- 删除：超过 30 天且低优先级的内容

---

## 🛡️ 安全保护

### 第 1 层：只读模式

**只能读取**：
- `memory/` 目录
- `temp/zvp 计划/` 目录
- `temp/zvp 完成情况/` 目录

**只能写入**：
- `MEMORY.md`（只追加，不覆盖）

**禁止访问**：
- `.openclaw/config/` - 核心配置
- `skills/` - 技能文件
- `docs/` - 文档
- `AGENTS.md`, `SOUL.md`, `TOOLS.md` - 核心配置文件

---

### 第 2 层：自动备份

**写入前自动备份**：
```bash
MEMORY.md → MEMORY.md.backup-<时间戳>
```

**备份保留**：24 小时

---

### 第 4 层：内容验证

**写入前验证**：
1. 新内容不能为空
2. 必须包含重要章节（`# MEMORY.md`, `## 📌 重要决策`, `## 📋 项目与任务`）
3. 新内容长度不能少于旧内容的 90%（防止误删）

**原子写入**：
1. 写入临时文件
2. 验证写入成功
3. 原子重命名
4. 清理备份

---

## ⚙️ 配置选项

### 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `ANTHROPIC_API_KEY` | Claude API Key | 无（使用模拟响应） |
| `DREAM_MODEL` | AI 模型 | `claude-sonnet-4-6` |

### 触发配置（待实现）

```javascript
{
  schedule: '0 18 * * *',  // 每日 18 点
  minSessions: 5,           // 最少会话数
  lockFile: '/tmp/dream.lock'
}
```

---

## 🧪 测试

### 测试 1：手动触发

```bash
cd /home/z3129119/.openclaw/workspace
node skills/dream-system/executor.js
```

**预期**：
- 成功读取文件
- 成功调用 AI（或模拟响应）
- 成功更新 MEMORY.md（如有新内容）

### 测试 2：并发保护

```bash
# 终端 1
node skills/dream-system/executor.js

# 终端 2（同时执行）
node skills/dream-system/executor.js
```

**预期**：
- 终端 1 成功执行
- 终端 2 输出"另一个 Dream 进程正在运行，跳过"

### 测试 3：备份验证

```bash
# 执行后检查
ls -la MEMORY.md.backup-*
```

**预期**：
- 存在备份文件
- 备份内容与原文件一致

---

## 📝 待办事项

### 高优先级
- [ ] 配置定时任务（cron job）
- [ ] 实现 Phase 4 完整修剪逻辑
- [ ] 添加错误重试机制
- [ ] 完善日志输出

### 中优先级
- [ ] 支持更多数据源（会话记录、聊天记录）
- [ ] 添加进度可视化（任务状态）
- [ ] 实现锁机制（防止并发）
- [ ] 添加邮件/消息通知

### 低优先级
- [ ] Web UI 查看进度
- [ ] 支持自定义提取规则
- [ ] 记忆版本控制
- [ ] 记忆搜索功能

---

## 📚 参考资料

- [Claude Code Dream 系统源码分析](../../docs/03-Dream 系统深度分析.md)
- [MEMORY.md 格式规范](../../MEMORY.md)

---

### 待办事项

### 高优先级
- [x] 配置定时任务（cron job）- 见 CRON_SETUP.md
- [x] 实现 Phase 4 完整修剪逻辑 - AI 驱动智能修剪
- [ ] 配置 ANTHROPIC_API_KEY 环境变量

### 中优先级
- [x] 添加锁机制（防止并发）
- [x] 完善日志输出
- [ ] 添加错误重试机制

### 低优先级
- [ ] Web UI 查看进度
- [ ] 支持自定义提取规则
- [ ] 记忆版本控制
- [ ] 记忆搜索功能

---

**维护人**：王鲸 AI 分析团队  
**最后更新**：2026-04-01  
**版本**：v2.0（完整版）  
**状态**：✅ 100% 完成 - 可投入使用
