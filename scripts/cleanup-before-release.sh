#!/bin/bash

# Dream 系统发布前清理脚本
# 用途：清理所有个人环境信息，确保不包含用户名、本地路径等敏感信息

echo "🔍 开始清理个人环境信息..."

# 定义需要清理的模式
PATTERNS=(
  "z3129119"
  "/home/z3129119"
  "$HOME"
)

# 替换为通用路径
REPLACEMENTS=(
  "username"
  "/path/to/home"
  "~"
)

# 需要检查的文件类型
FILE_TYPES=("*.js" "*.md" "*.sh" "*.json" "*.txt")

# 统计
FILES_CHECKED=0
FILES_MODIFIED=0

echo "📂 检查范围：${FILE_TYPES[*]}"
echo ""

# 遍历所有文件
for pattern in "${PATTERNS[@]}"; do
  echo "🔍 搜索模式：$pattern"
  
  for file_type in "${FILE_TYPES[@]}"; do
    while IFS= read -r -d '' file; do
      FILES_CHECKED=$((FILES_CHECKED + 1))
      
      # 检查文件是否包含敏感信息
      if grep -q "$pattern" "$file" 2>/dev/null; then
        echo "  ⚠️  发现敏感信息：$file"
        
        # 询问是否替换
        read -p "     是否替换？(y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
          # 执行替换
          sed -i.bak "s|$pattern|{REDACTED}|g" "$file"
          rm -f "${file}.bak"
          FILES_MODIFIED=$((FILES_MODIFIED + 1))
          echo "  ✅ 已清理：$file"
        fi
      fi
    done < <(find . -name "$file_type" -print0)
  done
  
  echo ""
done

echo "📊 清理完成统计："
echo "  检查文件数：$FILES_CHECKED"
echo "  修改文件数：$FILES_MODIFIED"
echo ""

if [ $FILES_MODIFIED -gt 0 ]; then
  echo "⚠️  请检查修改的文件，确认无误后提交："
  echo "  git status"
  echo "  git diff"
  echo ""
  echo "确认无误后执行："
  echo "  git add -A"
  echo "  git commit -m 'chore: 清理个人环境信息'"
  echo "  git push"
else
  echo "✅ 未发现需要清理的信息！"
fi
