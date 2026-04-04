# Dream 系统定时任务配置

## 方法 1：使用 cron（推荐）

### 1. 编辑 crontab

```bash
crontab -e
```

### 2. 添加定时任务

```bash
# 每日 18 点执行 Dream 记忆整合
0 18 * * * cd ~/.openclaw/workspace && node skills/dream-system/executor.js >> logs/dream.log 2>&1
```

### 3. 验证

```bash
crontab -l
```

---

## 方法 2：使用 systemd timer（Linux）

### 1. 创建 service 文件

`/etc/systemd/system/dream-memory.service`

```ini
[Unit]
Description=Dream Memory Consolidation
After=network.target

[Service]
Type=oneshot
User=your-username
WorkingDirectory=/home/your-username/.openclaw/workspace
ExecStart=/usr/bin/node skills/dream-system/executor.js
StandardOutput=append:/home/your-username/.openclaw/workspace/logs/dream.log
StandardError=append:/home/your-username/.openclaw/workspace/logs/dream.log
```

### 2. 创建 timer 文件

`/etc/systemd/system/dream-memory.timer`

```ini
[Unit]
Description=Run Dream Memory Consolidation Daily
Requires=dream-memory.service

[Timer]
OnCalendar=*-*-* 18:00:00
Persistent=true

[Install]
WantedBy=timers.target
```

### 3. 启用 timer

```bash
sudo systemctl daemon-reload
sudo systemctl enable dream-memory.timer
sudo systemctl start dream-memory.timer
```

### 4. 查看状态

```bash
systemctl list-timers | grep dream
systemctl status dream-memory.timer
```

---

## 方法 3：使用 Node.js 内部调度

创建 `scheduler.js`：

```javascript
const { exec } = require('child_process')
const path = require('path')

// 每日 18 点执行
const schedule = require('node-schedule')

const job = schedule.scheduleJob('0 18 * * *', function() {
  console.log('[Dream.Scheduler] 开始执行...')
  
  const executorPath = path.join(__dirname, 'executor.js')
  exec(`node ${executorPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error('[Dream.Scheduler] 执行失败:', error)
      return
    }
    console.log('[Dream.Scheduler] 执行完成')
    console.log(stdout)
  })
})

console.log('[Dream.Scheduler] 定时任务已启动（每日 18:00）')
```

安装依赖：

```bash
npm install node-schedule
```

运行：

```bash
node skills/dream-system/scheduler.js
```

---

## 日志管理

### 创建日志目录

```bash
mkdir -p /home/z3129119/.openclaw/workspace/logs
```

### 日志轮转（logrotate）

`/etc/logrotate.d/dream-memory`

```
/home/your-username/.openclaw/workspace/logs/dream.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0644 your-username your-username
}
```

---

## 环境变量配置

创建 `.env` 文件（`/home/z3129119/.openclaw/workspace/.env`）：

```bash
# Dream 系统配置
DREAM_MODEL=claude-sonnet-4-6
ANTHROPIC_API_KEY=your-api-key-here

# 日志级别
LOG_LEVEL=info
```

在 cron 中加载：

```bash
0 18 * * * . /home/z3129119/.openclaw/workspace/.env && cd /home/z3129119/.openclaw/workspace && node skills/dream-system/executor.js >> logs/dream.log 2>&1
```

---

## 测试定时任务

### 手动触发测试

```bash
# 立即执行测试
node skills/dream-system/executor.js

# 查看日志
tail -f logs/dream.log
```

### 模拟明天执行

```bash
# 临时修改 cron 时间为 2 分钟后
# 等待执行
# 查看日志
# 恢复 cron 配置
```

---

## 监控和告警

### 健康检查脚本

`scripts/check-dream.sh`

```bash
#!/bin/bash

LOG_FILE="~/.openclaw/workspace/logs/dream.log"
LAST_RUN=$(tail -1 "$LOG_FILE" | grep -oP '\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}')

if [ -z "$LAST_RUN" ]; then
  echo "ERROR: Dream 系统可能未运行"
  exit 1
fi

echo "OK: Dream 系统最后运行时间：$LAST_RUN"
exit 0
```

### 添加到监控

```bash
chmod +x scripts/check-dream.sh
./scripts/check-dream.sh
```

---

**推荐使用方法 1（cron）**，简单可靠！
