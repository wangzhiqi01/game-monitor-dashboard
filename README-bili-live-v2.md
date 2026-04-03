# B站《火炬之光：无限》直播数量抓取 v2

v2 在 v1 基础上增加了两件真正关键的能力：

1. **人工过验证码等待模式**
2. **持久浏览器用户目录复用**

## 核心思路

B站直播分类页会触发极验验证码。
所以 v2 不再假设“全自动无验证”，而是支持：

- 先打开可视化浏览器
- 人工完成一次验证
- 保存并复用浏览器状态
- 再去统计当前页面抓到的唯一直播房间数

## 脚本

`scripts/bili_live_count_v2.js`

## 推荐用法

### 第一次：人工过验证 + 持久 profile

```powershell
node scripts/bili_live_count_v2.js --headful --manual-captcha --manual-wait-ms 180000 --persistent
```

含义：

- 打开可见浏览器
- 如果检测到验证码，给你 180 秒人工处理
- 浏览器状态会保存在：`.openclaw/playwright-bili-profile`

### 第二次及以后：直接复用状态

```powershell
node scripts/bili_live_count_v2.js --persistent
```

如果状态没失效，脚本会直接继续抓取。

## 备用用法：storage state 文件

### 首次保存

```powershell
node scripts/bili_live_count_v2.js --headful --manual-captcha --save-state .openclaw\bili-state.json
```

### 复用保存状态

```powershell
node scripts/bili_live_count_v2.js --storage-state .openclaw\bili-state.json
```

## 输出

- `OK`: 成功抓到当前页面的唯一直播房间数
- `BLOCKED_BY_CAPTCHA`: 仍被验证码拦截
- `ERROR`: 执行出错

## 仍然存在的限制

- 统计值是**当前抓到的唯一房间数**，不是平台官方总数
- B站可能再次触发风控，导致之前保存的状态失效
- 页面 DOM 结构变化时，可能要更新提取规则

## 建议的真实使用方式

最现实的工作流是：

1. 第一次人工过一次验证
2. 保存 profile
3. 后续定期复用 profile 跑统计
4. 一旦再次被拦，再人工接管一次
