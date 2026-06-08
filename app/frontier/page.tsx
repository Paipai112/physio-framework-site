import type { Metadata } from "next";
import { getLayerHex } from "@/data/colors";

export const metadata: Metadata = {
  title: "前沿研究 — 生理信号处理框架",
  description:
    "L1-L5各层级最新最前沿的商业应用与科研成果，覆盖传感器技术、AI算法、数字生物标志物与AI健康教练。",
};

interface FrontierItem {
  title: string;
  type: "commercial" | "research";
  description: string;
  source: string;
  year: number;
}

const frontierData: Record<string, FrontierItem[]> = {
  L1: [
    {
      title: "可拉伸表皮电子皮肤",
      type: "research",
      description:
        "Rogers实验室(西北大学)2024年Nature论文展示无线无电池表皮系统——在40μm厚NFC贴片上集成ECG+PPG+温度+汗液生物标志物+运动传感器。Bao实验室(斯坦福)实现全可拉伸聚合物半导体晶体管阵列(100%+应变，载流子迁移率>1.3 cm²/Vs)。衍生公司Epicore Biosystems(Gatorade Gx汗液贴片FDA获批)、Sibel Health(ANNE平台FDA获批)已商业化。",
      source: "Rogers JA, Northwestern University; Bao Z, Stanford University",
      year: 2025,
    },
    {
      title: "可穿戴超声贴片连续血压监测",
      type: "research",
      description:
        "UC San Diego徐升实验室开发24μm厚的超声贴片(相控阵压电换能器)，从颈/股动脉深度4cm处连续监测中心血压。与侵入性动脉导管对比偏差<1 mmHg(Nature Biomedical Engineering 2024)。衍生公司Softsonics正在商业化。Pulsify Medical(Leuven)32阵元3-5MHz可穿戴超声贴片测量心输出量/射血分数/室壁运动，通过AI图像判读，CE标志预计2025-2026。",
      source: "Xu S, UCSD; Pulsify Medical, KU Leuven/imec",
      year: 2025,
    },
    {
      title: "汗液传感器商业化：Epicore/Nix/Kenzen",
      type: "commercial",
      description:
        "Epicore Biosystems Gatorade Gx汗液贴片：首个FDA获批可穿戴汗液传感器，测量出汗率、Na+浓度、体液流失(比色法读数，无内置电子)。Nix水合生物传感器：可重复使用的传感器仓+一次性贴片，实时蓝牙测Na+、K+、总体液流失。Kenzen ECHO智能贴片：多传感器(皮温+HR+汗率+运动)工安热安全方案，机器学习个性化热阈值。",
      source: "Epicore Biosystems (Cambridge); Nix Biosensors (Boston); Kenzen (San Francisco)",
      year: 2025,
    },
    {
      title: "多分析物微针ISF采样 — Biolinq",
      type: "commercial",
      description:
        "Biolinq硅微针阵列(~0.5mm穿透深度，神经纤维缺失的真皮层)上每根微针印刷电化学传感器。2cm²皮肤贴片同时测量葡萄糖、酮体、乳酸。获FDA两项突破性设备认定(2024年从单一葡萄糖扩展为多分析物)。关键试验MARD~10%(vs静脉血糖)。累计融资$100M+(Series C Alpha Wave Ventures领投)。",
      source: "Biolinq (San Diego, CA)",
      year: 2025,
    },
  ],
  L2: [
    {
      title: "PPG形态学血管年龄评估商业化",
      type: "commercial",
      description:
        "Oura Ring Gen 4(2024年10月)Smart Sensing算法在18条PPG信号路径间动态切换。心血管年龄(Cardiovascular Age)功能从光电容积波速度(PWV)特征估算动脉硬化程度并与实际年龄比较。与金标准颈-股PWV验证相关r=0.71。Yilmaz等(2026, PLOS Digit Health)发表了消费者睡眠追踪器血管年龄估算研究。",
      source: "Oura Health (Oulu, Finland); Yilmaz G et al., PLOS Digit Health 2026",
      year: 2026,
    },
    {
      title: "毫米波雷达非接触生命体征",
      type: "commercial",
      description:
        "Google Nest Hub 2nd Gen内置Soli 60GHz FMCW雷达获FDA De Novo批准用于非接触睡眠追踪(呼吸率+睡眠分期)。TI IWR6843 Vital Signs SDK在1-3m距离实现<5 bpm心率、<2 bpm呼吸率精度。Acconeer A212(2024+)增加MIMO多天线120°FOV多人生命体征监测。Novelda X7 UWB雷达主导汽车儿童存在检测CPD市场(Euro NCAP 2025合规)。",
      source: "Google ATAP; Texas Instruments; Acconeer; Novelda",
      year: 2025,
    },
    {
      title: "边缘AI：传感器端生物信号处理",
      type: "research",
      description:
        "ST LSM6DSO机器学习核心(MLC)在IMU传感器上以<10μA电流运行决策树分类器，实现常开活动识别。ARM Ethos-U55/U65微NPU在Cortex-M级MCU上以<1mW功耗运行1D CNN进行ECG/PPG异常检测。量化的生物信号基础模型将数十亿参数架构压缩至<10MB以部署到边缘设备。脉冲神经网络(Spiking NN)对微瓦级生物信号推理展现出前景。",
      source: "STMicroelectronics; ARM; Qualcomm Snapdragon Wear W5+ Gen 2",
      year: 2025,
    },
  ],
  L3: [
    {
      title: "DFA α1实时运动阈值检测",
      type: "research",
      description:
        "Rogers & Gronwald(2020-2025系列, 15+篇论文)确立了DFA α1=0.75(VT1)和α1=0.50(VT2)为仅从RR间期数据得出的有效非侵入式运动强度阈值。Tanner等(2024)元分析(12项研究, 262受试者)确认HRVT1 vs VT1平均心率差仅0.4 bpm，HRVT2 vs VT2差1.6 bpm。AI Endurance App(Andriolo等, 2024 Sensors)展示了从日常训练数据提取DFA α1-功率关系的能力。Rogers等(2026)验证了运动中使用智能手机PPG进行DFA α1分析的可行性。",
      source: "Rogers B, Gronwald T; AI Endurance app",
      year: 2026,
    },
    {
      title: "数字生物标志物精神健康检测",
      type: "research",
      description:
        "多模态模型结合HRV(RMSSD+SDNN)+睡眠碎片化+活动水平，在压力分类任务上达到AUC 0.75-0.85(Choi A等, JMIR 2024)。Hehlmann等(2026, Sci Rep)从可穿戴生物特征+手机行为数据检测抑郁严重度(与临床量表相关r=0.65；睡眠效率单特征最强d=0.82)。Corponi等(2024, JMIR)使用自监督学习从可穿戴数据检测急性心境发作，无需标记临床数据。截至2026年中期尚无FDA批准的消费者可穿戴设备精神健康生物标志物。",
      source: "Choi A, Hehlmann MI, Corponi F et al.; 各期刊 2024-2026",
      year: 2026,
    },
    {
      title: "无袖带血压——进展与差距",
      type: "research",
      description:
        "Aktiia Bracelet(CE IIa级)使用光学PPG脉冲波形分析，24h连续血压监测，每月校准1次。Samsung Galaxy Watch(PWA+袖带校准，部分地区)均差约5mmHg。2025年深度学习方法(SleepBP-Net, HGCTNet)在实验室达到<5mmHg均差，但真实动态场景误差仍然大得多。Schutte AE等(2024, J Hum Hypertens)评论：\"何时才算够好？\"—无袖带血压设备尚未获得FDA批准替代临床血压测量。核心障碍：校准漂移、PEP变异性混淆PAT、人群异质性、运动伪影。",
      source: "Aktiia (Switzerland); Samsung; Schutte AE et al.",
      year: 2025,
    },
    {
      title: "大规模可穿戴健康研究(2024-2026成果)",
      type: "research",
      description:
        "UK Biobank加速度计子研究(10.4万参与者, Axivity AX3 7日监测)2024-2026年发表：可穿戴步数+睡眠联合预测MACE事件(Yun J等, EClinicalMedicine 2026)；昼夜节律模式预测VTE风险(Zhang Q等, 2026)；MVPA降低全因痴呆风险(Wanigatunga AA等, 2025)。All of Us可穿戴数据集(Patten T等, Nat Med 2026)：连接完整电子健康档案的最多样化大规模可穿戴数据集(Fitbit数据来自10K+参与者)。Apple Heart Study(41.9万参与者)2025年追踪发现73%白人、9%西语裔代表性—虚拟试验中少数群体代表性不足。",
      source: "UK Biobank; All of Us Research Program; Apple Heart Study",
      year: 2026,
    },
  ],
  L4: [
    {
      title: "WHOOP压力监测+GPT-4教练",
      type: "commercial",
      description:
        "WHOOP压力监测(2024年中)：使用HRV+皮温+静息HR将实时急性压力与慢性负荷分开，独立于Recovery评分。WHOOP Coach(GPT-4驱动，2023年9月推出)提供上下文感知对话式健康指导，可访问完整WHOOP数据历史。\"三角化AI\"架构将确定性生理模型与LLM推理结合以防止幻觉。力量训练模块(2024年扩展)量化肌肉负荷(次数/组数/速度追踪)和肌群容量负荷。",
      source: "WHOOP Inc. (Boston, MA)",
      year: 2024,
    },
    {
      title: "Apple Watch生命体征+睡眠呼吸暂停检测",
      type: "commercial",
      description:
        "Apple Watch Series 10(2024年9月)推出Vitals App(watchOS 11)：汇总夜间心率、呼吸率、手腕温度、睡眠时长、SpO2建立个人基线范围，2+指标偏离基线时标记(疾病、饮酒、海拔影响)。睡眠呼吸暂停通知(FDA De Novo 2024年获批)：加速度计30天滚动窗口检测呼吸紊乱，中度-重度AHI的灵敏度~90%。训练负荷(watchOS 11)：1-10级自觉努力评级+7天vs28天对比。\"Project Mulberry\"(Apple Intelligence + Health, 2025)：设备端神经引擎处理，医生训练的AI健康教练。",
      source: "Apple Inc.",
      year: 2025,
    },
    {
      title: "Oura Gen 4 + 心血管年龄 + 弹性指标",
      type: "commercial",
      description:
        "Oura Ring Gen 4(2024年10月)Smart Sensing算法动态切换18条PPG信号路径。心血管年龄(参见L2前沿)。弹性指标(Resilience, 2024年扩展)：使用日间压力+恢复趋势在14天窗口内量化生理压力恢复能力。压力监测将一天分为压力期/投入期/放松期/恢复期四个时段。Symptom Radar：针对温度+HR+HRV+RR进行ML异常检测以识别疾病信号。Oura Advisor对话式AI教练(Beta测试中)。",
      source: "Oura Health (Oulu, Finland)",
      year: 2025,
    },
  ],
  L5: [
    {
      title: "ECG基础模型爆发(2025)",
      type: "research",
      description:
        "2025年见证了ECG基础模型的快速涌现：ECGFM(百万级ECG预训练)、FoundationalECGNet(轻量级多任务心脏分析)、Self-DANA(通道自适应SSL)、AnyECG-Lab(从单导联ECG估算实验室检查值)。OpenECG基准提供120万条公开记录。2025年一篇关键\"现实核查\"论文质疑了过度声称的性能增益。跨模态迁移：EEG预训练的基础模型在ECG/PPG上微调用于无袖带血压估算。发展轨迹与NLP(2018-19)和CV(2020-21)基础模型采用路径相似。",
      source: "多个研究组; DBLP 2025出版物",
      year: 2025,
    },
    {
      title: "LLM健康教练平台对比",
      type: "commercial",
      description:
        "WHOOP Coach(GPT-4+专有生理模型，\"三角化AI\")、Oura Advisor(LLM+纵向数据，模式发现)、Fitbit AI(Google Gemini集成，对话式健康数据探索，Fitbit Labs 2024年实验性功能)、Galaxy AI Health(Samsung Gauss+Google Gemini，能量评分+健康Tips+睡眠呼吸暂停FDA获批)、Apple Intelligence+Health \"Project Mulberry\"(设备端神经引擎处理，隐私优先，医生训练的AI代理2025年)。核心差异化：设备端(Apple, Samsung) vs 云端(Google Fitbit/Gemini)。隐私架构正成为竞争护城河。",
      source: "WHOOP, Oura, Google/Fitbit, Samsung, Apple",
      year: 2025,
    },
    {
      title: "生成式AI合成生理数据",
      type: "research",
      description:
        "扩散模型超越GAN成为生物信号生成的首选方法：ECGTwin(可控扩散个性化ECG生成, 2025)、结构化状态空间模型SSSM-ECG(2025)、模拟器增强扩散(混合生物物理模拟先验, 2025)。应用场景：罕见心律失常合成数据用于训练、多机构数据共享无需传输原始数据(HIPAA/GDPR合规)、FDA对合成数据用于算法验证的监管兴趣(2025年新兴)。多尺度时序一致性仍是主要技术挑战。",
      source: "多个研究组; DBLP 2025出版物",
      year: 2025,
    },
    {
      title: "All of Us可穿戴数据集+电子健康档案关联",
      type: "research",
      description:
        "Patten T等在Nature Medicine(2026年4月)发表了All of Us Research Program可穿戴数据集：10K+参与者的Fitbit数据关联完整电子健康档案，是种族/民族/社会经济最多样化的大规模可穿戴数据集。2025-2026年发表成果：REM睡眠作为可改变CVD风险因子(Kang J等)、可穿戴数据用于产后抑郁筛查(Hurwitz E等)、设备佩戴时间的群体差异及偏差纠正方法。UK Biobank加速度计子研究(10.4万参与者)在2024-2026年产出死亡率/CVD/糖尿病/痴呆/COPD结局论文。",
      source: "All of Us Research Program; Nature Medicine 2026; UK Biobank",
      year: 2026,
    },
  ],
};

const LAYER_INFO: Record<string, { name: string; description: string }> = {
  L1: { name: "传感器层", description: "新型传感模态、材料科学突破与芯片创新" },
  L2: { name: "基础指标层", description: "信号处理算法、边缘AI与新型生物标志物" },
  L3: { name: "融合指标层", description: "数字生物标志物、大规模验证研究与多模态融合" },
  L4: { name: "高级指标层", description: "厂商专有评分系统、新型健康指标与AI功能" },
  L5: { name: "AI教练层", description: "基础模型、生成式AI与LLM健康教练平台" },
};

function TypeBadge({ type }: { type: "commercial" | "research" }) {
  return (
    <span
      className={
        type === "commercial"
          ? "inline-flex items-center rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-xs font-medium text-blue-400"
          : "inline-flex items-center rounded-full bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 text-xs font-medium text-violet-400"
      }
    >
      {type === "commercial" ? "商业产品" : "科研成果"}
    </span>
  );
}

export default function FrontierPage() {
  const layerOrder = ["L1", "L2", "L3", "L4", "L5"];

  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="py-16 text-center">
        <h1 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-[-0.03em] text-text-primary">
          前沿研究
        </h1>
        <div className="mx-auto my-6 h-[3px] w-[60px] rounded-full bg-gradient-to-r from-layer-1 via-layer-2 via-layer-3 via-layer-4 to-layer-5" />
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-text-body">
          追踪最新最前沿的商业应用与科研成果，按五层架构 L1-L5
          组织。涵盖传感器技术、AI/ML突破、数字生物标志物、可穿戴健康创新与AI健康教练。
        </p>
      </section>

      {/* Layer-by-layer frontier sections */}
      {layerOrder.map((layerId) => {
        const items = frontierData[layerId];
        if (!items || items.length === 0) return null;
        const info = LAYER_INFO[layerId];
        const hex = getLayerHex(layerId);

        return (
          <section key={layerId}>
            {/* Section header */}
            <div className="mb-6 flex items-center gap-3">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: hex }}
              />
              <span className="font-heading text-2xl font-bold text-text-primary">
                {layerId}
              </span>
              <span className="text-lg font-medium text-text-secondary">
                {info.name}
              </span>
              <span className="text-sm text-text-muted hidden sm:inline">
                · {info.description}
              </span>
            </div>

            {/* Items grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-2xl border border-border-subtle bg-surface-elevated p-6 transition-all duration-300 hover:border-white/10 hover:bg-surface-highlight"
                  style={{
                    borderLeftWidth: "2px",
                    borderLeftColor: hex,
                  }}
                >
                  {/* Header row */}
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h3 className="font-heading text-base font-semibold text-text-primary leading-snug">
                      {item.title}
                    </h3>
                    <TypeBadge type={item.type} />
                  </div>

                  {/* Description */}
                  <p className="mb-4 text-sm text-text-body leading-relaxed">
                    {item.description}
                  </p>

                  {/* Source & year */}
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <span className="line-clamp-1">{item.source}</span>
                    <span className="shrink-0 rounded-full bg-white/5 px-2 py-0.5">
                      {item.year}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* Bottom note */}
      <section className="border-t border-border-subtle pt-10 text-center">
        <p className="text-sm text-text-muted">
          前沿研究页面持续更新。内容来源于学术期刊、企业官方发布与行业报告。
          <br />
          最后更新：2026年6月
        </p>
      </section>
    </div>
  );
}
