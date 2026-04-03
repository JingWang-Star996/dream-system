#!/bin/bash

# Dream 记忆系统 - 一键安装脚本
# 灵感来自 Claude Code · 完全适配 OpenClaw · 一键安装，马上生效

set -e

echo "🌙 Dream 记忆系统安装程序"
echo "================================"

# 检查是否在 OpenClaw workspace
if [ ! -d "$HOME/.openclaw/workspace" ]; then
    echo "❌ 错误：未找到 OpenClaw workspace"
    echo "请先安装 OpenClaw: https://docs.openclaw.ai"
    exit 1
fi

cd "$HOME/.openclaw/workspace"

echo "✅ 检测到 OpenClaw workspace"

# 创建 skills 目录（如果不存在）
if [ ! -d "skills" ]; then
    echo "📁 创建 skills 目录..."
    mkdir -p skills
fi

# 检查是否已安装
if [ -d "skills/dream-system" ]; then
    echo "⚠️  Dream 系统已安装"
    read -p "是否覆盖安装？(y/N): " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        echo "❌ 取消安装"
        exit 0
    fi
    echo "🗑️  删除旧版本..."
    rm -rf skills/dream-system
fi

# 创建 dream-system 目录
echo "📁 创建 dream-system 目录..."
mkdir -p skills/dream-system

# 复制文件（如果是本地安装）
if [ -d "skills/dream-system-bak" ]; then
    echo "📦 从备份恢复..."
    cp -r skills/dream-system-bak/* skills/dream-system/
else
    echo "⚠️  请手动下载文件到 skills/dream-system/"
    echo "GitHub: https://github.com/your-username/dream-system"
    exit 1
fi

# 设置执行权限
echo "🔧 设置执行权限..."
chmod +x skills/dream-system/executor.js
chmod +x skills/dream-system/start.sh

# 配置 API Key
echo ""
echo "🔑 配置 API Key"
echo "请选择配置方式："
echo "1. 环境变量（推荐）"
echo "2. 内置配置"
echo "3. 跳过（稍后手动配置）"
read -p "请选择 (1/2/3): " api_choice

case $api_choice in
    1)
        read -p "请输入阿里云百炼 API Key: " api_key
        read -p "请输入模型名称 (默认：qwen3.5-plus): " model
        model=${model:-qwen3.5-plus}
        
        echo ""
        echo "添加到 ~/.bashrc..."
        cat >> ~/.bashrc << EOF

# Dream 记忆系统配置
export DREAM_API_KEY="$api_key"
export DREAM_MODEL="$model"
EOF
        
        echo "✅ API Key 已配置"
        echo "💡 执行 'source ~/.bashrc' 生效"
        ;;
    2)
        read -p "请输入阿里云百炼 API Key: " api_key
        
        # 修改 executor.js
        if grep -q "process.env.DREAM_API_KEY = ''" skills/dream-system/executor.js; then
            sed -i "s/process.env.DREAM_API_KEY = ''/process.env.DREAM_API_KEY = '$api_key'/" skills/dream-system/executor.js
            echo "✅ API Key 已内置到 executor.js"
        else
            echo "⚠️  请手动配置 executor.js 中的 API Key"
        fi
        ;;
    3)
        echo "⚠️  已跳过 API 配置"
        echo "💡 请手动配置 DREAM_API_KEY 环境变量"
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

# 配置定时任务
echo ""
echo "⏰ 配置定时任务"
read -p "是否每天凌晨 5 点自动执行？(Y/n): " cron_choice
if [ "$cron_choice" != "n" ] && [ "$cron_choice" != "N" ]; then
    # 检查 crontab 是否已配置
    if crontab -l 2>/dev/null | grep -q "dream-system/executor.js"; then
        echo "✅ 定时任务已配置"
    else
        echo "📝 添加定时任务..."
        (crontab -l 2>/dev/null | grep -v "dream-system"; echo "0 5 * * * cd $HOME/.openclaw/workspace && node skills/dream-system/executor.js >> logs/dream.log 2>&1") | crontab -
        echo "✅ 定时任务已添加（每天 05:00）"
    fi
fi

# 创建日志目录
if [ ! -d "logs" ]; then
    mkdir -p logs
fi

# 测试运行
echo ""
echo "🧪 测试运行..."
read -p "是否立即测试一次？(Y/n): " test_choice
if [ "$test_choice" != "n" ] && [ "$test_choice" != "N" ]; then
    if [ -n "$DREAM_API_KEY" ] || grep -q "DREAM_API_KEY = 'sk-" skills/dream-system/executor.js; then
        echo "执行测试..."
        node skills/dream-system/executor.js || echo "⚠️  测试失败，请检查配置"
    else
        echo "⚠️  API Key 未配置，跳过测试"
    fi
fi

# 完成
echo ""
echo "================================"
echo "🎉 安装完成！"
echo ""
echo "📋 下一步："
echo "1. 如果选择了环境变量配置，执行：source ~/.bashrc"
echo "2. 查看日志：tail -f logs/dream.log"
echo "3. 手动测试：node skills/dream-system/executor.js"
echo ""
echo "📖 文档：skills/dream-system/README.md"
echo "================================"
