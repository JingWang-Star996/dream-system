# 📋 Dream 系统发布前检查清单

**版本**：v1.0  
**最后更新**：2026-04-03

---

## 🔒 安全检查（必须）

### 1. API Key 检查

```bash
# 检查所有代码文件
grep -r "sk-sp-" . --include="*.js" --include="*.md" --include="*.sh"

# 检查所有可能的 API Key 格式
grep -r "sk-[a-zA-Z0-9]\{20,\}" . --include="*.js" --include="*.md" --include="*.sh"
```

**✅ 通过标准**：
- ❌ 无硬编码 API Key
- ✅ 所有 API Key 使用环境变量
- ✅ .env 文件在 .gitignore 中

---

### 2. 个人信息检查

```bash
# 检查用户名
grep -r "z3129119" . --include="*.js" --include="*.md" --include="*.sh"

# 检查本地路径
grep -r "/home/" . --include="*.js" --include="*.md" --include="*.sh" | grep -v "/home/node"

# 检查其他个人信息
grep -r "@" . --include="*.md" | grep -v "github.com"
```

**✅ 通过标准**：
- ❌ 无用户名
- ❌ 无本地路径（使用 `/path/to/` 或 `~/`）
- ❌ 无个人邮箱

---

### 3. 配置文件检查

```bash
# 检查 .env 示例文件
cat .env.example

# 检查 .gitignore
cat .gitignore
```

**✅ 通过标准**：
- ✅ .env.example 存在且只包含占位符
- ✅ .gitignore 包含 .env
- ✅ README.md 有配置说明

---

## 📝 文档检查

### 1. README.md

**检查项**：
- [ ] 无 API Key 示例
- [ ] 路径使用占位符（`/path/to/`）
- [ ] 安装说明清晰
- [ ] 配置说明完整
- [ ] 使用示例安全

**示例代码检查**：
```bash
# ❌ 错误
export DREAM_API_KEY="sk-sp-f2174d07a0324a9f8d31ecd651c3639e"
cd /home/z3129119/dream-system

# ✅ 正确
export DREAM_API_KEY="your-api-key-here"
cd /path/to/dream-system
```

---

### 2. 代码注释检查

**检查项**：
- [ ] 注释中无 API Key
- [ ] 注释中无本地路径
- [ ] 注释中无个人信息

**示例**：
```javascript
// ❌ 错误
// 默认路径：/home/z3129119/dream-system/memory

// ✅ 正确
// 默认路径：./memory
```

---

## 🔧 自动化清理

### 使用清理脚本

```bash
# 进入 scripts 目录
cd scripts

# 执行清理脚本
chmod +x cleanup-before-release.sh
./cleanup-before-release.sh
```

**脚本功能**：
- 自动搜索敏感信息
- 交互式确认替换
- 生成备份文件
- 统计修改文件数

---

## 📦 发布流程

### 1. 代码审查

```bash
# 查看所有修改
git status

# 查看具体变更
git diff

# 查看暂存的变更
git diff --cached
```

### 2. 运行检查

```bash
# 运行安全检查脚本
./scripts/check-before-release.sh

# 如果没有该脚本，手动执行检查
grep -r "sk-sp-" . --include="*.js"
grep -r "z3129119" . --include="*.js"
```

### 3. 本地测试

```bash
# 安装依赖
npm install

# 运行测试
npm test

# 手动测试
node executor.js
```

### 4. 提交代码

```bash
# 添加所有修改
git add -A

# 提交（使用清晰的提交信息）
git commit -m "chore: 清理个人环境信息，准备发布"

# 推送
git push origin main
```

### 5. 创建 Release

1. 访问 GitHub Releases
2. 点击 "Create a new release"
3. 填写版本号（如 v1.0.0）
4. 填写发布说明
5. 点击 "Publish release"

---

## ⚠️ 常见错误

### 1. 硬编码 API Key

**错误示例**：
```javascript
const CONFIG = {
  apiKey: 'sk-sp-f2174d07a0324a9f8d31ecd651c3639e'
};
```

**正确做法**：
```javascript
const CONFIG = {
  apiKey: process.env.DREAM_API_KEY || ''
};
```

---

### 2. 硬编码路径

**错误示例**：
```javascript
const memoryDir = '/home/z3129119/dream-system/memory';
```

**正确做法**：
```javascript
const memoryDir = path.join(__dirname, '../../memory');
// 或
const memoryDir = process.env.DREAM_MEMORY_DIR || './memory';
```

---

### 3. 文档中的个人信息

**错误示例**：
```markdown
## 安装

```bash
cd /home/z3129119/dream-system
```

**正确做法**：
```markdown
## 安装

```bash
cd /path/to/dream-system
```

---

## 📋 发布前清单

**安全检查**：
- [ ] 无 API Key
- [ ] 无用户名
- [ ] 无本地路径
- [ ] 无个人邮箱

**文档检查**：
- [ ] README.md 安全
- [ ] 代码注释安全
- [ ] 示例代码安全

**测试检查**：
- [ ] 单元测试通过
- [ ] 手动测试通过
- [ ] 配置文件完整

**Git 检查**：
- [ ] .gitignore 完整
- [ ] .env.example 存在
- [ ] 提交信息清晰

---

**最后检查时间**：2026-04-03  
**检查人**：___________  
**批准发布**：___________

---

**✅ 所有检查通过后，方可发布！**