const data = window.GAME_MONITOR_DATA;

const state = {
  currentView: 'overview',
  filters: {
    pool: '全部',
    platform: '全部',
    status: '全部',
    category: '全部'
  },
  selectedGameId: null
};

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

function getPoolStats() {
  return {
    self: data.games.filter(game => game.pool === '自家'),
    launched: data.games.filter(game => game.status === '已上线'),
    upcoming: data.games.filter(game => game.status === '预约中')
  };
}

function getFilterOptions() {
  return {
    pool: ['全部', ...new Set(data.games.map(game => game.pool))],
    platform: ['全部', ...new Set(data.games.map(game => game.platform))],
    status: ['全部', ...new Set(data.games.map(game => game.status))],
    category: ['全部', ...new Set(data.activities.map(item => item.category))]
  };
}

function renderFocusGames() {
  const el = document.getElementById('focus-games');
  el.innerHTML = data.games.map(game => `<span class="chip">${game.name}</span>`).join('');
}

function renderUpdateMechanismSidebar() {
  const el = document.getElementById('update-mechanism');
  const blocks = [
    { title: '人工维护', items: data.updateMechanism.manual },
    { title: '我持续维护模板', items: data.updateMechanism.assistant },
    { title: '后续可抓取', items: data.updateMechanism.futureAutomation }
  ];
  el.innerHTML = blocks.map(block => `
    <div class="list-item compact">
      <h4>${block.title}</h4>
      <ul class="mini-list">${block.items.map(item => `<li>${item}</li>`).join('')}</ul>
    </div>
  `).join('');
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
            <div class="list-item clickable" data-open-game="${game.id}">
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
      ${sectionCard('更新机制', `
        <div class="profile-grid single-column">
          <div class="profile-section"><h4>人工维护</h4><ul>${data.updateMechanism.manual.map(item => `<li>${item}</li>`).join('')}</ul></div>
          <div class="profile-section"><h4>我持续维护模板</h4><ul>${data.updateMechanism.assistant.map(item => `<li>${item}</li>`).join('')}</ul></div>
          <div class="profile-section"><h4>后续可接抓取</h4><ul>${data.updateMechanism.futureAutomation.map(item => `<li>${item}</li>`).join('')}</ul></div>
        </div>
      `)}
    </div>
  `;
}

function filterActivities() {
  return data.activities.filter(item => {
    const matchPlatform = state.filters.platform === '全部' || item.platform === state.filters.platform;
    const matchCategory = state.filters.category === '全部' || item.category === state.filters.category;
    const matchStatus = state.filters.status === '全部' || data.games.find(game => game.name === item.game)?.status === state.filters.status;
    const matchPool = state.filters.pool === '全部' || data.games.find(game => game.name === item.game)?.pool === state.filters.pool;
    return matchPlatform && matchCategory && matchStatus && matchPool;
  });
}

function filterGames() {
  return data.games.filter(game => {
    const matchPool = state.filters.pool === '全部' || game.pool === state.filters.pool;
    const matchPlatform = state.filters.platform === '全部' || game.platform === state.filters.platform;
    const matchStatus = state.filters.status === '全部' || game.status === state.filters.status;
    return matchPool && matchPlatform && matchStatus;
  });
}

function renderFilters(type) {
  const options = getFilterOptions();
  const keys = type === 'activity'
    ? ['pool', 'platform', 'status', 'category']
    : ['pool', 'platform', 'status'];

  return `
    <div class="filter-bar card">
      ${keys.map(key => `
        <label class="filter-item">
          <span>${key === 'pool' ? '监控池' : key === 'platform' ? '平台' : key === 'status' ? '状态' : '动态类型'}</span>
          <select data-filter-key="${key}">
            ${options[key].map(option => `<option value="${option}" ${state.filters[key] === option ? 'selected' : ''}>${option}</option>`).join('')}
          </select>
        </label>
      `).join('')}
      <button class="reset-btn" id="reset-filters">重置筛选</button>
    </div>
  `;
}

function renderActivity() {
  const filtered = filterActivities();
  const grouped = {
    high: filtered.filter(item => item.importance === 'high'),
    medium: filtered.filter(item => item.importance === 'medium'),
    low: filtered.filter(item => item.importance === 'low')
  };

  document.getElementById('view-activity').innerHTML = `
    ${renderFilters('activity')}
    <div class="cards" style="margin-top:16px;">
      ${metricCard('高优先级', grouped.high.length, '需要优先同步或跟进')}
      ${metricCard('中优先级', grouped.medium.length, '日常监控主干')}
      ${metricCard('低优先级', grouped.low.length, '可观察但暂不抢资源')}
      ${metricCard('动态总数', filtered.length, '当前筛选结果')}
    </div>
    <div class="card" style="margin-top:16px;">
      <h3 class="section-title">重点动态流</h3>
      <table class="table">
        <thead><tr><th>日期</th><th>游戏</th><th>平台</th><th>类型</th><th>优先级</th><th>摘要</th></tr></thead>
        <tbody>
          ${filtered.map(item => `
            <tr>
              <td>${item.date}</td>
              <td>${item.game}</td>
              <td>${item.platform}</td>
              <td>${item.category}</td>
              <td>${badge(item.importance)}</td>
              <td><strong>${item.title}</strong><br /><span class="muted">${item.summary}</span></td>
            </tr>
          `).join('') || '<tr><td colspan="6" class="muted">当前筛选条件下暂无动态。</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
}

function renderGames() {
  const groups = ['自家', '已上线重点监控', '预约中重点监控'];
  const filteredGames = filterGames();

  document.getElementById('view-games').innerHTML = `
    ${renderFilters('games')}
    <div class="list" style="margin-top:16px; gap: 24px;">
      ${groups.map(group => {
        const list = filteredGames.filter(game => game.pool === group);
        if (!list.length) return '';
        return `
          <div>
            <div class="card" style="margin-bottom:16px;">
              <h3>${group}</h3>
              <p class="muted">共 ${list.length} 款，建议按“产品判断—监控重点—风险机会”连续维护。</p>
            </div>
            <div class="list">
              ${list.map(game => `
                <div class="card clickable" data-open-game="${game.id}">
                  <div class="card-head">
                    <div>
                      <h3>${game.name}</h3>
                      <p class="muted">${game.platform} / ${game.genre} / ${game.status}</p>
                    </div>
                    <button class="detail-btn" data-open-game="${game.id}">查看详情</button>
                  </div>
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
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }).join('') || '<div class="card"><p class="muted">当前筛选条件下暂无游戏。</p></div>'}
    </div>
  `;
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

function renderGameDetail() {
  const game = data.games.find(item => item.id === state.selectedGameId);
  const container = document.getElementById('game-detail');
  if (!game) {
    container.classList.remove('active');
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <div class="detail-overlay" data-close-detail="true"></div>
    <div class="detail-panel">
      <div class="card-head">
        <div>
          <h3>${game.name}</h3>
          <p class="muted">${game.pool} / ${game.platform} / ${game.genre} / ${game.status}</p>
        </div>
        <button class="detail-btn secondary" data-close-detail="true">关闭</button>
      </div>
      <div class="profile-grid">
        <div class="profile-section">
          <h4>基础判断</h4>
          <ul>
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
  `;
  container.classList.add('active');
}

function renderCurrentView() {
  if (state.currentView === 'overview') renderOverview();
  if (state.currentView === 'activity') renderActivity();
  if (state.currentView === 'games') renderGames();
  if (state.currentView === 'cases') renderCases();
  bindDynamicActions();
  renderGameDetail();
}

function activateView(view) {
  state.currentView = view;
  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  document.querySelector(`#view-${view}`).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.view === view));
  document.getElementById('page-title').textContent = viewMeta[view].title;
  document.getElementById('page-subtitle').textContent = viewMeta[view].subtitle;
  renderCurrentView();
}

function bindDynamicActions() {
  document.querySelectorAll('[data-filter-key]').forEach(select => {
    select.addEventListener('change', (event) => {
      state.filters[event.target.dataset.filterKey] = event.target.value;
      renderCurrentView();
    });
  });

  const reset = document.getElementById('reset-filters');
  if (reset) {
    reset.addEventListener('click', () => {
      state.filters = { pool: '全部', platform: '全部', status: '全部', category: '全部' };
      renderCurrentView();
    });
  }

  document.querySelectorAll('[data-open-game]').forEach(button => {
    button.addEventListener('click', (event) => {
      const gameId = event.currentTarget.dataset.openGame;
      state.selectedGameId = gameId;
      renderGameDetail();
    });
  });

  document.querySelectorAll('[data-close-detail]').forEach(button => {
    button.addEventListener('click', () => {
      state.selectedGameId = null;
      renderGameDetail();
    });
  });
}

function init() {
  renderFocusGames();
  renderUpdateMechanismSidebar();
  renderCurrentView();

  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => activateView(btn.dataset.view));
  });
}

init();
