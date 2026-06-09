/**
 * MVP Tree Data — Curated minimal set of 19 highest-ROI modules
 * needed to build a screenless wristband physiology framework.
 *
 * The MVP tree follows a 4-phase build plan (14 weeks total),
 * progressing from sensor integration through AI-powered coaching.
 */

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface MvpNode {
  id: string;        // matches modules-data.ts (e.g. "L1:ppg")
  layer: string;     // "L1" | "L2" | "L3" | "L4" | "L5"
  name: string;      // Chinese display name
  summary: string;   // one-sentence Chinese description
  whyMVP: string;    // 1-2 sentences explaining ROI for the MVP
  buildPhase: 1 | 2 | 3 | 4;
  keyMetric: string; // e.g. "bpm", "ms", "0-100%"
  sensor?: string;   // only for L1 modules
}

export interface MvpEdge {
  from: string;  // source MvpNode id
  to: string;    // target MvpNode id
}

export interface BuildPhase {
  phase: 1 | 2 | 3 | 4;
  label: string;       // e.g. "Phase 1 (1-3周)"
  title: string;       // e.g. "传感接入"
  description: string; // what this phase delivers
  moduleIds: string[]; // MvpNode ids in this phase
}

// ---------------------------------------------------------------------------
// MVP Nodes (19 modules)
// ---------------------------------------------------------------------------

export const mvpNodes: MvpNode[] = [
  // ---- L1: 传感器层 (3 modules) ----
  {
    id: 'L1:ppg',
    layer: 'L1',
    name: 'PPG光心率传感器',
    summary: '通过光电容积描记法测量血容量变化，是智能手表最重要的传感器',
    whyMVP: 'PPG是穿戴设备的"眼睛"——心率、血氧、呼吸频率、HRV全部依赖它。一颗传感器覆盖5+下游指标，是MVP中ROI最高的单点投资',
    buildPhase: 1,
    keyMetric: '脉率(bpm)',
    sensor: '光电二极管+LED (绿光520nm/红外940nm)',
  },
  {
    id: 'L1:accelerometer',
    layer: 'L1',
    name: '加速度计',
    summary: '三轴MEMS加速度传感器，感知运动方向、强度和频率',
    whyMVP: '计步、睡眠检测、活动识别三项刚需功能的共同基础。没有加速度计，设备无法区分"静止"和"运动"，睡眠和能量消耗也无法准确估算',
    buildPhase: 1,
    keyMetric: '加速度(g)',
    sensor: '三轴MEMS电容式 (ST LSM6DSO/Bosch BMI270)',
  },
  {
    id: 'L1:temperature',
    layer: 'L1',
    name: '温度传感器',
    summary: 'NTC热敏电阻或红外传感器测量皮肤表面温度',
    whyMVP: '皮肤温度是睡眠分期的重要辅助信号（入睡时体温微升），也是恢复评估的输入。成本极低但显著提升睡眠和恢复算法的精度',
    buildPhase: 1,
    keyMetric: '皮温(°C)',
    sensor: 'NTC热敏电阻 (±0.1°C)',
  },

  // ---- L2: 基础指标层 (5 modules) ----
  {
    id: 'L2:hr',
    layer: 'L2',
    name: '心率(Heart Rate)',
    summary: '从PPG信号中提取的心跳频率，每分钟心跳次数',
    whyMVP: '心率是整个生理指标体系的"地基"。静息心率、心率恢复、卡路里估算、训练负荷全部建立在心率之上。没有HR，MVP失去80%的下游价值',
    buildPhase: 1,
    keyMetric: '瞬时心率(bpm)',
  },
  {
    id: 'L2:step-count',
    layer: 'L2',
    name: '步数',
    summary: '从加速度计信号中识别的步行步数',
    whyMVP: '步数是最直观的用户反馈，也是活动量和卡路里的基础输入。用户每天打开App第一眼看到的数据就是它——这是MVP的"日活锚点"',
    buildPhase: 1,
    keyMetric: '步数(步/天)',
  },
  {
    id: 'L2:hrv',
    layer: 'L2',
    name: '心率变异性(HRV)',
    summary: '逐次心跳间期的微小波动，反映自主神经系统状态',
    whyMVP: 'HRV是身体压力/恢复的"晴雨表"。几乎所有高级恢复评分（WHOOP/Garmin/Oura）都以HRV为核心输入。采集简单（同PPG），但算法复杂度适中',
    buildPhase: 2,
    keyMetric: 'RMSSD(ms)',
  },
  {
    id: 'L2:rr',
    layer: 'L2',
    name: '呼吸频率(Respiratory Rate)',
    summary: '从PPG信号中提取的每分钟呼吸次数',
    whyMVP: '呼吸频率是唯一可从PPG中提取、且与睡眠深度和高强度压力强关联的指标。它不需要额外硬件，纯粹靠算法从已有PPG波形中剥离呼吸调制分量',
    buildPhase: 2,
    keyMetric: '呼吸频率(bpm)',
  },
  {
    id: 'L2:spo2',
    layer: 'L2',
    name: '血氧饱和度(SpO₂)',
    summary: '血液中氧合血红蛋白占比，反映呼吸和循环效率',
    whyMVP: '血氧是睡眠质量（尤其睡眠呼吸暂停筛查）和高海拔适应的关键指标。虽然同源PPG，但需要红光+红外双波长，硬件和算法复杂度比HR高一级',
    buildPhase: 3,
    keyMetric: 'SpO₂(0-100%)',
  },

  // ---- L3: 融合指标层 (6 modules) ----
  {
    id: 'L3:rhr',
    layer: 'L3',
    name: '静息心率(Resting HR)',
    summary: '身体完全静止且清醒状态下的最低心率，反映心血管健康',
    whyMVP: '静息心率是心血管健康的"快照"指标。下降趋势提示训练适应（体能提升），突然上升可能是过度训练或疾病的早期信号。WHOOP和Garmin的恢复评分均重度依赖RHR',
    buildPhase: 2,
    keyMetric: '静息心率(bpm)',
  },
  {
    id: 'L3:calorie',
    layer: 'L3',
    name: '卡路里消耗',
    summary: '基于心率和活动强度的全天总能量消耗估算',
    whyMVP: '卡路里是消费者认知最强的健康指标。虽精度有限（心率-卡路里模型有15-25%误差），但它是连接"运动数据"和"健康行为改变"的关键心理桥梁',
    buildPhase: 2,
    keyMetric: '消耗热量(kcal)',
  },
  {
    id: 'L3:parasympathetic',
    layer: 'L3',
    name: '副交感神经活性',
    summary: '从HRV提取的副交感（"休息与消化"）神经系统活跃程度',
    whyMVP: '副交感活性是HRV的"高级用法"——从整体HRV中剥离出纯粹的恢复信号。它是所有压力评分的共同底层特征，技术门槛适中但差异化价值大',
    buildPhase: 2,
    keyMetric: '副交感活性指数',
  },
  {
    id: 'L3:deep-sleep',
    layer: 'L3',
    name: '深睡时长',
    summary: '基于体动和心率特征的深度睡眠阶段时长估算',
    whyMVP: '深睡是身体修复的黄金时段。只需加速度计+心率两个已有信号即可估算（无需脑电），用户对睡眠数据的关注度极高，是留存和付费转化的核心卖点',
    buildPhase: 3,
    keyMetric: '深睡时间(min)',
  },
  {
    id: 'L3:hrr',
    layer: 'L3',
    name: '心率恢复(HR Recovery)',
    summary: '运动停止后心率回落到静息水平的速率，反映心肺适应能力',
    whyMVP: '心率恢复是有氧适能和训练负荷的简洁代理指标。1分钟恢复差<12bpm是心血管风险的独立预测因子——它既是训练指标也是健康指标，一鱼两吃',
    buildPhase: 3,
    keyMetric: '1分钟恢复差(bpm)',
  },
  {
    id: 'L3:body-battery',
    layer: 'L3',
    name: '身体电量(Body Battery)',
    summary: '基于HRV、活动和睡眠的体能储备综合估算',
    whyMVP: '身体电量将多维度数据压缩为0-100的一个数，是Garmin生态中用户最爱的功能。它用"充电/放电"类比降低了复杂度，让普通用户秒懂身体状态',
    buildPhase: 3,
    keyMetric: '身体电量值(0-100)',
  },

  // ---- L4: 高级指标层 (4 modules) ----
  {
    id: 'L4:whoop-recovery',
    layer: 'L4',
    name: 'WHOOP恢复评分',
    summary: '基于RHR、HRV、睡眠和呼吸的综合恢复评分(0-100%)',
    whyMVP: 'Whoop的核心竞争力就是恢复评分——每天早上一句话告诉用户"今天能拼/要歇"。它把5个L3指标融合成一个可执行决策，是MVP从"数据展示"到"行为指导"的转折点',
    buildPhase: 4,
    keyMetric: '恢复评分(0-100%)',
  },
  {
    id: 'L4:garmin-body-battery',
    layer: 'L4',
    name: 'Garmin Body Battery',
    summary: 'Garmin的体能储备评分，类似电池充放电模型',
    whyMVP: 'Body Battery的"充电放电"可视化是穿戴设备中最成功的用户体验设计之一。算法输入与MVP已有模块高度重叠（HRV+活动+睡眠），复用成本低',
    buildPhase: 4,
    keyMetric: '身体电量值(0-100)',
  },
  {
    id: 'L4:garmin-stress',
    layer: 'L4',
    name: 'Garmin压力评分',
    summary: '基于HRV的全天候压力水平评分(0-100)',
    whyMVP: '压力评分扩宽了MVP的使用场景——从"运动恢复"延伸到"日常心理健康"。HRV是唯一输入，算法基于心率变异性的时域/频域特征，实现成本低但感知价值高',
    buildPhase: 4,
    keyMetric: '压力评分(0-100)',
  },
  {
    id: 'L4:garmin-training-readiness',
    layer: 'L4',
    name: 'Garmin Training Readiness',
    summary: '综合恢复、负荷、睡眠和HRV的训练准备度评分(0-100)',
    whyMVP: '训练准备度是MVP的"总控台"——综合所有上游指标告诉用户"今天适合训练吗？什么强度？"。它将WHOOP恢复评分从被动监测升级为主动指导',
    buildPhase: 4,
    keyMetric: '训练准备度(0-100)',
  },

  // ---- L5: AI教练层 (1 module) ----
  {
    id: 'L5:personalized-recommendation',
    layer: 'L5',
    name: '个性化建议生成',
    summary: '基于L4高级指标生成自然语言健康与训练建议',
    whyMVP: '这是MVP的"最后一公里"——把数字评分翻译成用户能执行的建议。LLM的成本已降至可接受水平，且不需要额外传感器投入，纯粹是软件层的增值',
    buildPhase: 4,
    keyMetric: '建议条数/天',
  },
];

// ---------------------------------------------------------------------------
// MVP Edges — signal-flow dependency graph
// ---------------------------------------------------------------------------

export const mvpEdges: MvpEdge[] = [
  // L1 → L2
  { from: 'L1:ppg', to: 'L2:hr' },
  { from: 'L1:ppg', to: 'L2:hrv' },
  { from: 'L1:ppg', to: 'L2:rr' },
  { from: 'L1:ppg', to: 'L2:spo2' },
  { from: 'L1:accelerometer', to: 'L2:step-count' },
  { from: 'L1:accelerometer', to: 'L3:deep-sleep' },
  { from: 'L1:temperature', to: 'L3:rhr' },
  { from: 'L1:temperature', to: 'L4:whoop-recovery' },

  // L2 → L3
  { from: 'L2:hr', to: 'L3:rhr' },
  { from: 'L2:hr', to: 'L3:calorie' },
  { from: 'L2:hr', to: 'L3:hrr' },
  { from: 'L2:hr', to: 'L3:body-battery' },
  { from: 'L2:hrv', to: 'L3:parasympathetic' },
  { from: 'L2:hrv', to: 'L3:rhr' },
  { from: 'L2:hrv', to: 'L3:body-battery' },
  { from: 'L2:hrv', to: 'L4:garmin-stress' },
  { from: 'L2:rr', to: 'L3:deep-sleep' },
  { from: 'L2:rr', to: 'L4:garmin-stress' },
  { from: 'L2:step-count', to: 'L3:calorie' },
  { from: 'L2:spo2', to: 'L3:deep-sleep' },
  { from: 'L2:spo2', to: 'L4:whoop-recovery' },

  // L3 → L4
  { from: 'L3:rhr', to: 'L4:whoop-recovery' },
  { from: 'L3:rhr', to: 'L4:garmin-training-readiness' },
  { from: 'L3:parasympathetic', to: 'L4:garmin-stress' },
  { from: 'L3:parasympathetic', to: 'L4:whoop-recovery' },
  { from: 'L3:hrr', to: 'L4:garmin-training-readiness' },
  { from: 'L3:body-battery', to: 'L4:garmin-body-battery' },
  { from: 'L3:deep-sleep', to: 'L4:whoop-recovery' },
  { from: 'L3:calorie', to: 'L4:garmin-body-battery' },

  // L4 → L5
  { from: 'L4:whoop-recovery', to: 'L5:personalized-recommendation' },
  { from: 'L4:garmin-body-battery', to: 'L5:personalized-recommendation' },
  { from: 'L4:garmin-stress', to: 'L5:personalized-recommendation' },
  { from: 'L4:garmin-training-readiness', to: 'L5:personalized-recommendation' },
];

// ---------------------------------------------------------------------------
// Build Phases
// ---------------------------------------------------------------------------

export const buildPhases: BuildPhase[] = [
  {
    phase: 1,
    label: 'Phase 1 (1-3周)',
    title: '传感接入 — PPG信号采集 + 心率检测 + 步数',
    description:
      '搭建传感器驱动层，采集PPG和加速度计原始信号，输出心率和步数两个核心基础指标。这是整个MVP的硬件-软件接口层，所有下游模块都依赖此阶段的输出',
    moduleIds: [
      'L1:ppg',
      'L1:accelerometer',
      'L1:temperature',
      'L2:hr',
      'L2:step-count',
    ],
  },
  {
    phase: 2,
    label: 'Phase 2 (4-6周)',
    title: '指标计算 — HRV/呼吸频率/卡路里/静息心率/副交感',
    description:
      '在心率采集稳定的基础上，计算HRV和呼吸频率两个PPG衍生指标，并构建静息心率、卡路里消耗和副交感神经活性三个融合指标。此阶段完成后，设备已具备基础的恢复/压力监测能力',
    moduleIds: [
      'L2:hrv',
      'L2:rr',
      'L3:rhr',
      'L3:calorie',
      'L3:parasympathetic',
    ],
  },
  {
    phase: 3,
    label: 'Phase 3 (7-10周)',
    title: '融合分析 — SpO₂/深睡/心率恢复/身体电量',
    description:
      '引入血氧算法（需红光LED硬件支持），结合体动和心率特征实现睡眠分期，并输出心率恢复和身体电量两个综合指标。此阶段使MVP具备完整的睡眠监测和体能储备评估能力',
    moduleIds: [
      'L2:spo2',
      'L3:deep-sleep',
      'L3:hrr',
      'L3:body-battery',
    ],
  },
  {
    phase: 4,
    label: 'Phase 4 (11-14周)',
    title: '高级算法 — 恢复/压力/训练准备度/个性建议',
    description:
      '构建四个专有评分模型（恢复、身体电量、压力、训练准备度），并在最上层接入LLM驱动的个性化建议生成。此阶段完成后，MVP具备从传感器到AI建议的完整数据-洞察-行动闭环',
    moduleIds: [
      'L4:whoop-recovery',
      'L4:garmin-body-battery',
      'L4:garmin-stress',
      'L4:garmin-training-readiness',
      'L5:personalized-recommendation',
    ],
  },
];

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

/**
 * Returns all MVP nodes belonging to a given layer (e.g. "L1", "L2", ...).
 */
export function getMvpNodesByLayer(layerId: string): MvpNode[] {
  return mvpNodes.filter((node) => node.layer === layerId);
}

/**
 * Returns a single MVP node by its id, or undefined if not found.
 */
export function getMvpNodeById(id: string): MvpNode | undefined {
  return mvpNodes.find((node) => node.id === id);
}
