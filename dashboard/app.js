const data = window.GAME_MONITOR_DATA;

const viewMeta = {
  overview: { title: '总览', subtitle: '用于快速扫盘本周行业重点动态' },
  activity: { title: '动态监控', subtitle: '按时间查看重点游戏的版本、营销、舆情与投放动作' },
  games: { title: '游戏档案', subtitle: '每款游戏一页，沉淀长期有效的产品与营销判断' },
  cases: { title: '营销案例', subtitle: '沉淀可复用的福利、联动、达人与回流案例' }
};

function badge(level) {
  const text = level === 'high' ? '高优先级' : level === 'medium' ? '中优先级' : '低优先级';
  return `<span class="badge ${level}">${text}</span>`;
}

function renderFocusGames() {
  const el = document.getElementById('focus-games');
  el.innerHTML = data.games.map(game => `<span class="chip">${game.name}</span>`).join('');
}

function renderOverview() {
  const { overview, games, activities } = data;
  document.getElementById('view-overview').innerHTML = `
    <div class="cards">
      <div class="card"><h3>重点监控游戏</h3><div class="metric">${overview.monitoredGames}</div><div class="muted">当前重点池总量</div></div>
      <div class="card"><h3>本周重点更新</h3><div class="metric">${overview.keyUpdatesThisWeek}</div><div class="muted">版本/赛季/活动</div></div>
      <div class="card"><h3>重点营销动作</h3><div class="metric">${overview.keyMarketingActions}</div><div class="muted">达人/福利/联动/品牌</div></div>
      <div class="card"><h3>广告趋势</h3><div class="metric">${overview.adTrend}</div><div class="muted">相对上周变化</div></div>
    </div>
    <div class="grid-2">
      <div class="card">
        <h3 class="section-title">本周重点动态</h3>
        <table class="table">
          <thead><tr><th>日期</th><th>游戏</th><th>类型</th><th>摘要</th></tr></thead>
          <tbody>
            ${activities.map(item => `
              <tr>
                <td>${item.date}</td>
                <td>${item.game}</td>
                <td>${item.category}</td>
                <td>${item.title}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div class="card">
        <h3 class="section-title">重点提醒</h3>
        <div class="list">
          ${overview.watchouts.map(text => `<div class="list-item"><p>${text}</p></div>`).join('')}
        </div>
      </div>
    </div>
    <div class="grid-2">
      <div class="card">
        <h3 class="section-title">平台分布</h3>
        <p class="muted">端游：${overview.pcGames} / 手游：${overview.mobileGames}</p>
      </div>
      <div class="card">
        <h3 class="section-title">当前最值得深盯的游戏</h3>
        <div class="list">
          ${games.slice(0, 2).map(game => `<div class="list-item"><h4>${game.name}</h4><p>${game.summary}</p></div>`).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderActivity() {
  document.getElementById('view-activity').innerHTML = `
    <div class="card">
      <h3 class="section-title">重点动态流</h3>
      <table class="table">
        <thead><tr><th>日期</th><th>游戏</th><th>平台</th><th>类型</th><th>重要级别</th><th>摘要</th></tr></thead>
        <tbody>
          ${data.activities.map(item => `
            <tr>
              <td>${item.date}</td>
              <td>${item.game}</td>
              <td>${item.platform}</td>
              <td>${item.category}</td>
              <td>${badge(item.importance)}</td>
              <td>
                <strong>${item.title}</strong><br />
                <span class="muted">${item.summary}</span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderGames() {
  document.getElementById('view-games').innerHTML = `
    <div class="list">
      ${data.games.map(game => `
        <div class="card">
          <h3>${game.name}</h3>
          <p class="muted">${game.platform} / ${game.genre} / ${game.status}</p>
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
      `).join('')}
    </div>
  `;
}

function renderCases() {
  document.getElementById('view-cases').innerHTML = `
    <div class="list">
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
