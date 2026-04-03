#!/bin/bash

# Dream 系统快速启动脚本

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"
LOG_DIR="$WORKSPACE_DIR/logs"
LOG_FILE="$LOG_DIR/dream.log"

# 颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}  Dream 记忆整合系统 - 快速启动${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}错误：未找到 Node.js，请先安装 Node.js${NC}"
    exit 1
fi

echo -e "${YELLOW}Node.js 版本:${NC}"
node --version
echo ""

# 创建日志目录
if [ ! -d "$LOG_DIR" ]; then
    echo -e "${YELLOW}创建日志目录...${NC}"
    mkdir -p "$LOG_DIR"
fi

# 检查依赖
echo -e "${YELLOW}检查依赖...${NC}"
cd "$WORKSPACE_DIR"
if [ ! -d "node_modules/axios" ]; then
    echo "安装 axios..."
    npm install axios --save
fi
echo ""

# 检查环境变量
echo -e "${YELLOW}环境变量检查:${NC}"
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo -e "${YELLOW}  ANTHROPIC_API_KEY: 未设置（将使用模拟响应）${NC}"
    echo "  如需使用 AI 功能，请设置："
    echo "  export ANTHROPIC_API_KEY='your-api-key'"
else
    echo -e "${GREEN}  ANTHROPIC_API_KEY: 已配置${NC}"
fi

if [ -z "$DREAM_MODEL" ]; then
    echo -e "${YELLOW}  DREAM_MODEL: 未设置（使用默认 claude-sonnet-4-6）${NC}"
else
    echo -e "${GREEN}  DREAM_MODEL: $DREAM_MODEL${NC}"
fi
echo ""

# 执行 Dream 系统
echo -e "${YELLOW}开始执行 Dream 记忆整合...${NC}"
echo ""

cd "$WORKSPACE_DIR"
node skills/dream-system/executor.js 2>&1 | tee -a "$LOG_FILE"

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}  Dream 记忆整合完成！${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${YELLOW}日志文件：$LOG_FILE${NC}"
echo ""

# 显示修剪统计
if grep -q "修剪完成" "$LOG_FILE"; then
    echo -e "${GREEN}本次修剪统计:${NC}"
    grep -A 3 "修剪完成" "$LOG_FILE" | tail -3
    echo ""
fi

# 询问是否设置定时任务
read -p "是否设置每日 18 点自动执行？(y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${YELLOW}正在配置 cron 定时任务...${NC}"
    
    # 检查 crontab 是否已存在
    if crontab -l 2>/dev/null | grep -q "dream-system/executor.js"; then
        echo -e "${YELLOW}定时任务已存在，跳过${NC}"
    else
        # 添加 cron 任务
        (crontab -l 2>/dev/null; echo "0 18 * * * cd $SCRIPT_DIR && node executor.js >> $LOG_FILE 2>&1") | crontab -
        echo -e "${GREEN}定时任务已添加！每日 18:00 自动执行${NC}"
        echo ""
        echo "查看定时任务：crontab -l"
        echo "删除定时任务：crontab -e (手动删除对应行)"
    fi
fi

echo ""
echo -e "${GREEN}完成！${NC}"
