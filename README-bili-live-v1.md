# B站《火炬之光：无限》直播数量抓取 v1

这是一个 **网页抓取版 v1**，不是官方 API 方案。

## 当前结论

B站该分类页在无特殊上下文下很容易触发 **极验验证码**，所以 v1 的目标不是假装“100% 自动”，而是：

1. 自动打开目标分类页
2. 自动滚动，尽量加载更多直播卡片
3. 若未触发验证码，则统计直播房间数
4. 若触发验证码，则明确返回 `BLOCKED_BY_CAPTCHA`

## 目标页面

默认目标页：

`https://live.bilibili.com/p/eden/area-tags?areaId=910&parentAreaId=3`

## 运行方式

### 1. 直接跑（无头）

```powershell
node scripts/bili_live_count_v1.js
```

### 2. 可视化跑（方便人工过验证）

```powershell
node scripts/bili_live_count_v1.js --headful
```

### 3. 保存一次浏览器状态

```powershell
node scripts/bili_live_count_v1.js --headful --save-state .openclaw\bili-state.json
```

### 4. 复用已保存状态

```powershell
node scripts/bili_live_count_v1.js --storage-state .openclaw\bili-state.json
```

## 输出说明

成功时：

- `status: OK`
- `count`: 当前抓到的唯一直播房间数
- `rooms`: 抓到的房间样本

被拦时：

- `status: BLOCKED_BY_CAPTCHA`
- 会附带提示文本

## 已知限制

- B站直播页是强动态页面，且有风控
- `count` 代表 **当前页面抓到的唯一房间数**，不保证等于平台真实总数
- 如果页面有更多分页/懒加载，v1 可能低估
- 如果 B站 DOM 结构变化，选择器策略可能需要更新

## 下一版建议

v2 可以继续做：

1. 更稳定的卡片识别
2. 分页/滚动终止条件优化
3. 若能观察到网页自用请求，则优先读前端返回数据
4. 更好的反风控与人工接管流程
