# B站直播抓取小工具 v3

这是整理后的可复用小工具版本。

## 你以后直接用的命令

### 查看支持的游戏

```powershell
node scripts/bili_live_tool_v3.js --list-games
```

### 查询《火炬之光：无限》

```powershell
node scripts/bili_live_tool_v3.js --game torchlight-infinite
```

### 第一次需要人工过验证时

```powershell
node scripts/bili_live_tool_v3.js --game torchlight-infinite --headful --manual-captcha
```

## 默认行为

- 默认使用持久 profile：`.openclaw/playwright-bili-profile`
- 默认把结果写到：`.openclaw/outputs/bili-<game>.json`
- 默认游戏别名：`torchlight-infinite`

## 当前已配置游戏

- `torchlight-infinite` → 火炬之光：无限

配置文件位置：`config/bili-games.json`

## 给大飞哥自己调用时的固定入口

以后如果老板让我查 B站《火炬之光：无限》直播数量，优先直接调用：

```powershell
node scripts/bili_live_tool_v3.js --game torchlight-infinite
```

如果被验证码拦了，再改用：

```powershell
node scripts/bili_live_tool_v3.js --game torchlight-infinite --headful --manual-captcha
```

## 输出

标准输出会给：

- `status`
- `count`
- `topRooms`
- `output`（完整 JSON 路径）

完整结果会保存到 JSON 文件，便于后续复用、比较、自动化。
