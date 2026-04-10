window.GAME_MONITOR_DATA = {
  overview: {
    monitoredGames: 9,
    selfGames: 1,
    launchedGames: 5,
    upcomingGames: 3,
    pcFocusedGames: 4,
    mobileFocusedGames: 2,
    crossPlatformGames: 3,
    keyUpdatesThisWeek: 11,
    keyMarketingActions: 8,
    adTrend: '+18%',
    watchouts: [
      'ARPG 赛道的“回流理由 + 福利包装”明显升温，火炬与流放之路2的节点都值得重点对照。',
      '射击赛道近期会更看版本内容与社区口碑联动，三角洲行动与无畏契约的版本传播需持续盯。',
      '预约中产品要重点记录“首曝物料—测试节点—预约福利—达人预热”这条完整链路，而不是只看单次 PV。'
    ]
  },
  games: [
    {
      id: 'torchlight-infinite',
      name: '火炬之光：无限',
      pool: '自家',
      platform: '端游/手游',
      genre: '暗黑打宝 ARPG',
      status: '已上线',
      developer: '心动',
      summary: '以刷图、爆装、BD 构筑为核心，赛季制驱动内容更新，是当前监控池中的自家核心产品。',
      audience: 'ARPG / 暗黑 Like / 重度刷宝用户',
      coreSellingPoints: ['刷图爽感强', '构筑深度高', '赛季内容明确', '福利包装空间大'],
      monitoringFocus: ['赛季更新', '金钞项目', '达人传播', '直播讨论度'],
      risks: ['新用户理解成本较高', '福利信息如果讲不清，会直接影响转化效率'],
      opportunities: ['围绕“回本”“现实掉金”叙事持续扩展', '魔兽/刷子游戏用户承接空间大'],
      metrics: {
        heatIndex: 82,
        socialVolume: '高',
        videoVolume: '上升',
        adTrend: '中高'
      }
    },
    {
      id: 'delta-force',
      name: '三角洲行动',
      pool: '已上线重点监控',
      platform: '端游/手游',
      genre: '战术射击',
      status: '已上线',
      developer: '腾讯',
      summary: '强话题射击产品，适合持续监控版本更新、赛事/主播内容与社区口碑联动。',
      audience: '射击用户 / 军事题材用户 / 竞技内容受众',
      coreSellingPoints: ['战术氛围强', '射击反馈直接', '内容传播空间大'],
      monitoringFocus: ['版本节奏', '主播/视频传播', '社区争议点', '广告素材方向'],
      risks: ['玩家对平衡性、内容节奏、外挂/环境问题敏感'],
      opportunities: ['可拆解战术射击赛道如何做持续内容热度运营'],
      metrics: {
        heatIndex: 84,
        socialVolume: '高',
        videoVolume: '上升',
        adTrend: '高'
      }
    },
    {
      id: 'rock-kingdom',
      name: '洛克王国',
      pool: '已上线重点监控',
      platform: '手游',
      genre: '养成 / IP 向休闲 RPG',
      status: '已上线',
      developer: '腾讯',
      summary: '高认知度 IP，适合观察怀旧情绪、IP 转化与轻量受众的内容反馈。',
      audience: 'IP 情怀用户 / 轻中度养成用户 / 年轻泛用户',
      coreSellingPoints: ['IP 认知强', '情怀驱动明显', '轻量传播友好'],
      monitoringFocus: ['版本活动', 'IP 情怀传播', '社区评价', '回流节点'],
      risks: ['用户对还原度与玩法深度的预期差'],
      opportunities: ['可研究经典 IP 如何做新一轮回流包装'],
      metrics: {
        heatIndex: 71,
        socialVolume: '中高',
        videoVolume: '稳定',
        adTrend: '中'
      }
    },
    {
      id: 'game-for-peace',
      name: '和平精英',
      pool: '已上线重点监控',
      platform: '手游',
      genre: '竞技射击',
      status: '已上线',
      developer: '腾讯',
      summary: '成熟大众产品，适合重点盯大型活动、联动、版本传播和素材打法。',
      audience: '大众竞技用户 / 社交开黑用户 / 泛娱乐用户',
      coreSellingPoints: ['大众认知极强', '活动打法成熟', '联动案例丰富'],
      monitoringFocus: ['活动福利', '跨界联动', '短视频素材', '社媒热度'],
      risks: ['成熟产品创新疲劳', '活动频次高导致边际感知下降'],
      opportunities: ['适合作为“成熟大盘如何维持热度”的样本'],
      metrics: {
        heatIndex: 90,
        socialVolume: '高',
        videoVolume: '高',
        adTrend: '高'
      }
    },
    {
      id: 'valorant',
      name: '无畏契约',
      pool: '已上线重点监控',
      platform: '端游',
      genre: '竞技射击',
      status: '已上线',
      developer: 'Riot',
      summary: '强竞技属性产品，适合观察赛事、主播、版本平衡调整对热度的拉动。',
      audience: '核心竞技 FPS 用户 / 赛事观看用户',
      coreSellingPoints: ['竞技观赏性强', '赛事与主播驱动明显', '角色差异化鲜明'],
      monitoringFocus: ['版本平衡', '赛事热度', '头部主播内容', '社区争议'],
      risks: ['用户对平衡性极其敏感', '高门槛会影响泛用户扩张'],
      opportunities: ['适合研究竞技产品的内容链路与社区反馈机制'],
      metrics: {
        heatIndex: 86,
        socialVolume: '高',
        videoVolume: '高',
        adTrend: '中'
      }
    },
    {
      id: 'path-of-exile-2',
      name: '流放之路2',
      pool: '已上线重点监控',
      platform: '端游',
      genre: '暗黑 ARPG',
      status: '已上线',
      developer: 'Grinding Gear Games',
      summary: '高关注 ARPG 产品，是火炬之光：无限在玩法深度与核心受众层面的重点对照样本。',
      audience: '硬核 ARPG / 暗黑 Like / 核心刷宝用户',
      coreSellingPoints: ['硬核深度强', '职业/构筑讨论度高', '核心用户黏性高'],
      monitoringFocus: ['版本更新', 'Build 讨论', '社区反馈', 'ARPG 赛道口碑对照'],
      risks: ['复杂度较高', '新用户门槛高'],
      opportunities: ['适合与火炬对照研究“深度 vs 易入门”的平衡点'],
      metrics: {
        heatIndex: 87,
        socialVolume: '高',
        videoVolume: '上升',
        adTrend: '低中'
      }
    },
    {
      id: 'honor-chess',
      name: '王者万象棋',
      pool: '预约中重点监控',
      platform: '手游',
      genre: '策略 / 自走棋',
      status: '预约中',
      developer: '腾讯',
      summary: '依托王者 IP 的新品，重点看玩法认知建立、IP 借势强度与预约传播节奏。',
      audience: '王者 IP 用户 / 轻中度策略用户',
      coreSellingPoints: ['IP 认知高', '适合做预约预热', '玩法认知空间大'],
      monitoringFocus: ['首曝物料', '预约福利', '社区认知', '达人试水内容'],
      risks: ['玩法差异如果说不清，用户容易只把它当 IP 衍生'],
      opportunities: ['适合研究大 IP 新玩法如何做第一波教育'],
      metrics: {
        heatIndex: 75,
        socialVolume: '中高',
        videoVolume: '上升',
        adTrend: '中'
      }
    },
    {
      id: 'honor-world',
      name: '王者荣耀世界',
      pool: '预约中重点监控',
      platform: '端游/手游',
      genre: '开放世界 RPG',
      status: '预约中',
      developer: '腾讯',
      summary: '高关注度大 IP 新品，重点看预期管理、测试节点、PV 传播和社区质疑点。',
      audience: '王者 IP 用户 / 开放世界用户 / 泛动作 RPG 用户',
      coreSellingPoints: ['大 IP 支撑', '高关注度', '物料传播潜力大'],
      monitoringFocus: ['PV 传播', '测试节点', '预约节奏', '核心质疑点'],
      risks: ['用户预期极高，舆情波动可能放大'],
      opportunities: ['适合研究高期待新品的预热节奏与舆情管理'],
      metrics: {
        heatIndex: 89,
        socialVolume: '高',
        videoVolume: '高',
        adTrend: '中高'
      }
    },
    {
      id: 'out-of-control-evolution',
      name: '失控进化',
      pool: '预约中重点监控',
      platform: '端游/手游',
      genre: '生存 / 进化题材',
      status: '预约中',
      developer: '待补充',
      summary: '新品认知仍在建立阶段，重点观察题材卖点是否清晰、社区第一印象如何形成。',
      audience: '生存建造 / 新品尝鲜用户',
      coreSellingPoints: ['题材新鲜感', '有机会形成强第一印象'],
      monitoringFocus: ['产品定位', '预约传播', '卖点清晰度', '社区第一波反馈'],
      risks: ['产品认知模糊会直接影响预约效率'],
      opportunities: ['适合作为“认知建立期新品”的监控样本'],
      metrics: {
        heatIndex: 63,
        socialVolume: '中',
        videoVolume: '起量中',
        adTrend: '待观察'
      }
    }
  ],
  activities: [
    {
      date: '2026-04-10',
      game: '火炬之光：无限',
      platform: '端游/手游',
      category: '营销动作',
      title: 'SS12 金钞项目继续推进达人内容合作',
      importance: 'high',
      summary: '重点围绕“金钞获取机制”“回坑理由”“中国美院共创”三层信息展开达人传播。'
    },
    {
      date: '2026-04-10',
      game: '流放之路2',
      platform: '端游',
      category: '赛道对照',
      title: 'ARPG 核心用户讨论继续集中在深度与门槛平衡',
      importance: 'medium',
      summary: '适合与火炬之光：无限对照分析“易入门叙事 vs 深度叙事”如何影响传播。'
    },
    {
      date: '2026-04-09',
      game: '王者荣耀世界',
      platform: '端游/手游',
      category: '预约/预热',
      title: '高关注新品进入物料与预期管理双重观察期',
      importance: 'high',
      summary: '后续需重点记录 PV 表现、评论关键词和测试节点前的舆情走向。'
    },
    {
      date: '2026-04-09',
      game: '三角洲行动',
      platform: '端游/手游',
      category: '社区口碑',
      title: '玩家对版本内容与竞技环境持续讨论',
      importance: 'medium',
      summary: '适合跟踪其内容更新是否带动正向讨论，还是继续累积环境类抱怨。'
    },
    {
      date: '2026-04-08',
      game: '和平精英',
      platform: '手游',
      category: '营销动作',
      title: '成熟产品依旧保持高频活动与联动打法',
      importance: 'medium',
      summary: '值得持续拆解其活动包装、素材节奏和大众传播语言。'
    },
    {
      date: '2026-04-08',
      game: '无畏契约',
      platform: '端游',
      category: '赛事/主播',
      title: '竞技内容与主播讨论继续拉动社区热度',
      importance: 'medium',
      summary: '重点观察版本平衡、赛事热点与内容创作者话题之间的联动。'
    },
    {
      date: '2026-04-07',
      game: '王者万象棋',
      platform: '手游',
      category: '预约/预热',
      title: '新品玩法认知建立期，适合记录用户第一印象',
      importance: 'medium',
      summary: '需要重点观察用户到底是冲玩法来，还是主要由王者 IP 驱动关注。'
    },
    {
      date: '2026-04-07',
      game: '失控进化',
      platform: '端游/手游',
      category: '定位观察',
      title: '题材与核心卖点仍在形成认知',
      importance: 'low',
      summary: '现阶段重点不是看绝对热度，而是看“用户是否知道它是什么”。'
    }
  ],
  cases: [
    {
      game: '火炬之光：无限',
      name: 'SS12 金钞项目',
      type: '福利包装 / 达人传播 / 品牌内容',
      summary: '把版本福利与文化审美表达结合，形成“刷图掉真金”的差异化传播点。',
      takeaway: '福利机制一定要讲清获取路径，同时保留高质感外层包装。'
    },
    {
      game: '和平精英',
      name: '成熟产品活动高频运营打法',
      type: '活动运营 / 联动',
      summary: '长期通过活动包装与联动动作维持大众盘热度。',
      takeaway: '成熟产品的重点不只是“大活动”，而是活动密度与传播语言的连续性。'
    },
    {
      game: '流放之路2',
      name: '硬核 ARPG 深度叙事',
      type: '赛道参照 / 社区运营',
      summary: '围绕构筑深度与核心用户讨论形成稳定的赛道认知。',
      takeaway: '当产品足够深，传播也会天然偏圈层化，需要考虑如何承接新用户。'
    }
  ]
};
