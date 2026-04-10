const data = window.GAME_MONITOR_DATA;

const viewMeta = {
  overview: { title: '总览', subtitle: '用于快速扫盘本周行业重点动态与重点池状态' },
  activity: { title: '动态监控', subtitle: '按时间查看重点游戏的版本、营销、舆情、投放与预约动作' },
  games: { title: '游戏档案', subtitle: '按监控池分层查看每款游戏的核心判断、风险与机会点' },
  cases: { title: '营销案例', subtitle: '沉淀可复用的福利、联动、达人、回流与赛道案例' }
};

function badge(level) {
  const text = level === 'high' ? '高优先级' : level === 'medium' ? '中优先级' : '低优先级';
  return `<span class="badge ${level}">${text}</span>`;
}

function metricCard(title, value, note) {
  return `<div class="card"><h3>${title}</h3><div class="metric">${value}</div><div class="muted">${note}</div></div>`;
}

function sectionCard(title, body) {
  return `<div class="card"><h3 class="section-title">${title}</h3>${body}</div>`;
}

function renderFocusGames() {
  const el = document.getElementById('focus-games');
  el.innerHTML = data.games.map(game => `<span class="chip">${game.name}</span>`).join('');
}

function getPoolStats() {
  return {
    self: data.games.filter(game => game.pool === '自家'),
    launched: data.games.filter(game => game.status === '已上线'),
    upcoming: data.games.filter(game => game.status === '预约中')
  };
}

function renderOverview() {
  const { overview, games, activities } = data;
  const pools = getPoolStats();
  const hottestGames = [...games].sort((a, b) => b.metrics.heatIndex - a.metrics.heatIndex).slice(0, 3);
  const highActivities = activities.filter(item => item.importance === 'high');

  document.getElementById('view-overview').innerHTML = `
    <div class="cards">
      ${metricCard('重点监控游戏', overview.monitoredGames, '当前重点池总量')}
      ${metricCard('已上线重点', overview.launchedGames, '成熟产品与竞品观察池')}
      ${metricCard('预约中重点', overview.upcomingGames, '需盯预热与测试节奏')}
      ${metricCard('本周关键更新', overview.keyUpdatesThisWeek, '版本 / 赛季 / 活动')}
    </div>

    <div class="grid-2">
      ${sectionCard('重点池结构', `
        <div class="list">
          <div class="list-item"><h4>自家产品</h4><p>${pools.self.map(item => item.name).join('、')}</p></div>
          <div class="list-item"><h4>已上线重点监控</h4><p>${pools.launched.filter(item => item.pool !== '自家').map(item => item.name).join('、')}</p></div>
          <div class="list-item"><h4>预约中重点监控</h4><p>${pools.upcoming.map(item => item.name).join('、')}</p></div>
        </div>
      `)}
      ${sectionCard('重点提醒', `
        <div class="list">
          ${overview.watchouts.map(text => `<div class="list-item"><p>${text}</p></div>`).join('')}
        </div>
      `)}
    </div>

    <div class="grid-2">
      ${sectionCard('高优先级动态', `
        <table class="table">
          <thead><tr><th>日期</th><th>游戏</th><th>类型</th><th>摘要</th></tr></thead>
          <tbody>
            ${highActivities.map(item => `
              <tr>
                <td>${item.date}</td>
                <td>${item.game}</td>
                <td>${item.category}</td>
                <td>${item.title}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `)}
      ${sectionCard('当前高热游戏', `
        <div class="list">
          ${hottestGames.map(game => `
            <div class="list-item">
              <h4>${game.name}</h4>
              <p>热度指数 ${game.metrics.heatIndex} / ${game.status} / ${game.pool}</p>
            </div>
          `).join('')}
        </div>
      `)}
    </div>

    <div class="grid-2">
      ${sectionCard('平台分布', `
        <div class="list">
          <div class="list-item"><h4>端游重点</h4><p>${overview.pcFocusedGames} 款</p></div>
          <div class="list-item"><h4>手游重点</h4><p>${overview.mobileFocusedGames} 款</p></div>
          <div class="list-item"><h4>跨端重点</h4><p>${overview.crossPlatformGames} 款</p></div>
        </div>
      `)}
      ${sectionCard('本周营销动作', `
        <div class="list">
          <div class="list-item"><h4>重点营销动作</h4><p>${overview.keyMarketingActions} 项</p></div>
          <div class="list-item"><h4>广告趋势</h4><p>${overview.adTrend}</p></div>
          <div class="list-item"><h4>建议</h4><p>优先持续补充活动包装、预约预热与头部内容创作者动向。</p></div>
        </div>
      `)}
    </div>
  `;
}

function renderActivity() {
  const grouped = {
    high: data.activities.filter(item => item.importance === 'high'),
    medium: data.activities.filter(item => item.importance === 'medium'),
    low: data.activities.filter(item => item.importance === 'low')
  };

  document.getElementById('view-activity').innerHTML = `
    <div class="cards">
      ${metricCard('高优先级', grouped.high.length, '需要优先同步或跟进')}
      ${metricCard('中优先级', grouped.medium.length, '日常监控主干')}
      ${metricCard('低优先级', grouped.low.length, '可观察但暂不抢资源')}
      ${metricCard('动态总数', data.activities.length, '当前示例样本')}
    </div>
    <div class="card" style="margin-top:16px;">
      <h3 class="section-title">重点动态流</h3>
      <table class="table">
        <thead><tr><th>日期</th><th>游戏</th><th>平台</th><th>类型</th><th>优先级</th><th>摘要</th></tr></thead>
        <tbody>
          ${data.activities.map(item => `
            <tr>
              <td>${item.date}</td>
              <td>${item.game}</td>
              <td>${item.platform}</td>
              <td>${item.category}</td>
              <td>${badge(item.importance)}</td>
              <td><strong>${item.title}</strong><br /><span class="muted">${item.summary}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderGames() {
  const groups = ['自家', '已上线重点监控', '预约中重点监控'];
  document.getElementById('view-games').innerHTML = groups.map(group => {
    const list = data.games.filter(game => game.pool === group);
    return `
      <div class="card" style="margin-bottom:16px;">
        <h3>${group}</h3>
        <p class="muted">共 ${list.length} 款，建议按“产品判断—监控重点—风险机会”连续维护。</p>
      </div>
      <div class="list" style="margin-bottom:24px;">
        ${list.map(game => `
          <div class="card">
            <h3>${game.name}</h3>
            <p class="muted">${game.platform} / ${game.genre} / ${game.status}</p>
            <div class="profile-grid">
              <div class="profile-section">
                <h4>基础判断</h4>
                <ul>
                  <li>监控池：${game.pool}</li>
                  <li>研发/发行：${game.developer}</li>
                  <li>核心概述：${game.summary}</li>
                  <li>目标人群：${game.audience}</li>
                </ul>
              </div>
              <div class="profile-section">
                <h4>核心指标</h4>
                <ul>
                  <li>热度指数：${game.metrics.heatIndex}</li>
                  <li>社媒讨论：${game.metrics.socialVolume}</li>
                  <li>视频趋势：${game.metrics.videoVolume}</li>
                  <li>广告趋势：${game.metrics.adTrend}</li>
                </ul>
              </div>
              <div class="profile-section">
                <h4>核心卖点</h4>
                <ul>${game.coreSellingPoints.map(item => `<li>${item}</li>`).join('')}</ul>
              </div>
              <div class="profile-section">
                <h4>当前重点监控</h4>
                <ul>${game.monitoringFocus.map(item => `<li>${item}</li>`).join('')}</ul>
              </div>
              <div class="profile-section">
                <h4>风险点</h4>
                <ul>${game.risks.map(item => `<li>${item}</li>`).join('')}</ul>
              </div>
              <div class="profile-section">
                <h4>机会点</h4>
                <ul>${game.opportunities.map(item => `<li>${item}</li>`).join('')}</ul>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }).join('');
}

function renderCases() {
  document.getElementById('view-cases').innerHTML = `
    <div class="cards">
      ${metricCard('案例数', data.cases.length, '当前已沉淀的示例案例')}
      ${metricCard('福利/品牌型', 1, '高质感包装型')}
      ${metricCard('成熟活动型', 1, '大盘产品参考')}
      ${metricCard('赛道参照型', 1, '竞品策略参考')}
    </div>
    <div class="list" style="margin-top:16px;">
      ${data.cases.map(item => `
        <div class="card">
          <h3>${item.name}</h3>
          <p class="muted">${item.game} / ${item.type}</p>
          <div class="profile-grid">
            <div class="profile-section">
              <h4>案例摘要</h4>
              <ul><li>${item.summary}</li></ul>
            </div>
            <div class="profile-section">
              <h4>可复用启发</h4>
              <ul><li>${item.takeaway}</li></ul>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function activateView(view) {
  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  document.querySelector(`#view-${view}`).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.view === view));
  document.getElementById('page-title').textContent = viewMeta[view].title;
  document.getElementById('page-subtitle').textContent = viewMeta[view].subtitle;
}

function init() {
  renderFocusGames();
  renderOverview();
  renderActivity();
  renderGames();
  renderCases();

  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => activateView(btn.dataset.view));
  });
}

init();
