export interface FrontierReference {
  title: string;
  url: string;
  type: "paper" | "website" | "article" | "product" | "video";
  description?: string;
}

export interface FrontierItem {
  id: string;
  title: string;
  layer: string;
  type: "commercial" | "research";
  summary: string;
  description: string;
  impact: {
    technology: string;
    product: string;
    industry: string;
  };
  applications: string[];
  references: FrontierReference[];
  source: string;
  year: number;
}

export const frontierItems: FrontierItem[] = [
  // ───────── L1: 传感器层 ─────────
  {
    id: "epidermal-electronics",
    title: "可拉伸表皮电子皮肤",
    layer: "L1",
    type: "research",
    summary:
      "Rogers实验室(西北大学)2024年Nature论文展示无线无电池表皮系统，在40μm厚NFC贴片上集成ECG+PPG+温度+汗液生物标志物+运动传感器。Bao实验室(斯坦福)实现全可拉伸聚合物半导体晶体管阵列(100%+应变，载流子迁移率>1.3 cm²/Vs)。",
    description: `表皮电子（Epidermal Electronics）代表了可穿戴传感器从"戴在身上"到"贴在皮肤上"的范式转变。其核心技术突破在于将传统刚性硅基电子元件通过蛇形互连（serpentine interconnects）、屈曲力学（buckling mechanics）和超薄基底（<50μm）转化为可与皮肤共形贴合的柔性系统。

John A. Rogers 实验室（西北大学）是该领域的奠基者。2024年他们在 Nature 发表的无线无电池表皮系统在仅 40μm 厚的 NFC 贴片上集成了 ECG、PPG、皮肤温度、汗液生物标志物（Na⁺、K⁺、葡萄糖、乳酸）和加速度计。该系统通过 NFC 从智能手机获取能量并传输数据，无需电池，实现了"贴上去就能用"的用户体验。

Zhenan Bao 实验室（斯坦福大学）则在材料层面实现了突破——全可拉伸聚合物半导体晶体管阵列，在 100%+ 拉伸应变下仍保持 >1.3 cm²/Vs 的载流子迁移率。这意味着传感器电路本身可以像皮肤一样拉伸，而不仅仅是柔性基底上的刚性岛。

衍生公司方面，Epicore Biosystems 的 Gatorade Gx 汗液贴片已获 FDA 批准，Sibel Health 的 ANNE 平台（柔性胸部/脚部贴片监测呼吸率、心率、体温、活动）也获 FDA 批准用于新生儿和成人监护。这表明表皮电子已经从实验室走向了临床和消费市场。`,
    impact: {
      technology:
        "推动柔性混合电子（FHE）制造工艺成熟，使传感器从刚性封装向皮肤共形贴片过渡。蛇形互连和屈曲力学设计方法已成为行业标准范式，影响后续所有柔性可穿戴设备的设计。",
      product:
        "催生了新一代\"即贴即用\"医疗级贴片产品：Epicore Gatorade Gx（汗液分析，FDA获批）、Sibel Health ANNE（多参数生命体征，FDA获批）、BioStamp nPoint（MC10/Medidata，临床研究用）。这些产品将医院级监护能力延伸到家庭和运动场。",
      industry:
        "开创了\"表皮电子\"这一新品类，预计 2030 年全球柔性电子医疗市场达 $2,000 亿。远程患者监护（RPM）从笨重的腕带/胸带转向隐形贴片，降低患者佩戴负担，提高长期依从性。",
    },
    applications: [
      "新生儿重症监护（NICU）：ANNE 柔性贴片替代传统有线电极，减少皮肤损伤和线缆缠绕风险",
      "运动员水合管理：Gatorade Gx 贴片实时监测汗液 Na⁺浓度和出汗率，个性化补水策略",
      "慢性病远程监护：表皮贴片连续监测 ECG、呼吸率、体温，预警 COPD/心衰恶化",
      "药物临床试验：BioStamp nPoint 在分散式临床试验中收集高保真生理数据，替代传统院内检查",
      "军事/极端环境：美军与 Rogers 实验室合作开发士兵生理状态监测表皮贴片",
    ],
    references: [
      {
        title: "Rogers JA et al. — Wireless battery-free epidermal systems (Nature 2024)",
        url: "https://www.nature.com/",
        type: "paper",
        description: "无线无电池表皮电子系统的标志性论文",
      },
      {
        title: "Bao Z et al. — Fully stretchable polymer semiconductor transistor arrays (Nature)",
        url: "https://www.nature.com/",
        type: "paper",
        description: "全可拉伸聚合物半导体的材料学突破",
      },
      {
        title: "Epicore Biosystems — Gatorade Gx Sweat Patch (FDA Cleared)",
        url: "https://www.epicorebiosystems.com/",
        type: "product",
        description: "首款 FDA 获批可穿戴汗液传感器产品",
      },
      {
        title: "Sibel Health — ANNE One Platform (FDA Cleared)",
        url: "https://www.sibelhealth.com/",
        type: "product",
        description: "柔性多参数生命体征监测平台",
      },
      {
        title: "Rogers Lab — Northwestern University Querrey Simpson Institute",
        url: "https://rogersgroup.northwestern.edu/",
        type: "website",
        description: "Rogers 生物集成电子实验室主页",
      },
      {
        title: "Bao Lab — Stanford University",
        url: "https://baogroup.stanford.edu/",
        type: "website",
        description: "Bao 可拉伸电子/电子皮肤实验室主页",
      },
    ],
    source: "Rogers JA, Northwestern University; Bao Z, Stanford University",
    year: 2025,
  },
  {
    id: "wearable-ultrasound-bp",
    title: "可穿戴超声贴片连续血压监测",
    layer: "L1",
    type: "research",
    summary:
      "UC San Diego徐升实验室开发24μm厚超声贴片从颈/股动脉深度4cm处连续监测中心血压，与侵入性动脉导管对比偏差<1 mmHg。Pulsify Medical 32阵元3-5MHz可穿戴超声贴片测量心输出量/射血分数/室壁运动。",
    description: `可穿戴超声贴片是近五年生物医学工程领域最具颠覆性的创新之一。传统血压测量依赖袖带充气（示波法），只能提供间歇性单点读数，而动脉导管（金标准）为侵入性操作，仅限于重症监护使用。超声贴片通过相控阵压电换能器从体表进行深度组织成像和多普勒血流测量，实现了无创连续血压监测。

UC San Diego 徐升（Sheng Xu）实验室是该领域的技术先驱。2024 年 Nature Biomedical Engineering 论文展示了仅 24μm 厚的超声贴片，内置相控阵压电换能器阵列，可从颈部（颈动脉）或腹股沟（股动脉）等深度达 4cm 的血管处连续测量中心血压波形。与侵入性动脉导管（临床金标准）的直接对比显示偏差 <1 mmHg——这一精度水平前所未有。贴片通过柔性蛇形导线连接外部电子模块，使用医用级硅胶粘合剂固定。

Pulsify Medical（比利时鲁汶/imec 衍生公司）采用不同技术路线：32 阵元 3-5MHz 可穿戴超声阵列贴在胸骨左缘，通过 AI 图像判读算法从超声 B 模式/M 模式图像中自动提取心输出量、射血分数和室壁运动参数。该设备已进入临床试验阶段，预计 2025-2026 年获得 CE 标志。

核心技术挑战包括：（1）长期佩戴的粘合剂性能——汗液和运动导致贴片移位；（2）运动伪影抑制——超声信号对探头-皮肤界面位移极度敏感；（3）声学耦合介质——传统超声凝胶会在数小时内干燥，需要新型固态耦合材料；（4）功耗——连续超声发射需要显著能量，限制电池寿命。`,
    impact: {
      technology:
        "将医学超声从手持探头+操作者依赖的形态转变为可穿戴+自动化的连续监测模态。相控阵微型化（MEMS 超声换能器，即 PMUT/CMUT）和 AI 自动图像判读是实现可穿戴化的两大关键技术推动力。",
      product:
        "Pulsify Medical 预计 2025-2026 年 CE 标志获批，成为首个可穿戴心脏超声产品。Softsonics（徐升实验室衍生公司）正在开发消费级超声血压贴片。长期展望：超声贴片可能嵌入智能手表/臂带/胸带，成为消费电子标配。",
      industry:
        "颠覆 $30 亿全球血压监测市场。从间歇性袖带测量转向连续波形监测，为高血压管理（全球 13 亿患者）提供前所未有的时间分辨率。可能改变高血压诊断标准（从诊室单点血压转向 24h 连续中心血压）。",
    },
    applications: [
      "高血压精准管理：24h 连续中心血压监测替代诊室单点测量，检出隐匿性高血压和白大衣高血压",
      "重症监护去侵入化：替代动脉导管在 ICU/术后监护中连续监测血压波形，降低感染和血栓风险",
      "心衰患者家庭监护：通过连续心输出量和射血分数趋势预警心衰恶化，减少再住院率",
      "运动生理学研究：实时中心血压响应评估运动处方效果和心血管风险分层",
      "药物临床试验：连续血压波形作为高血压新药试验的终点指标，比偶测血压更敏感",
    ],
    references: [
      {
        title: "Xu S et al. — Wearable ultrasound patch for continuous central blood pressure monitoring (Nat Biomed Eng 2024)",
        url: "https://www.nature.com/natbiomedeng/",
        type: "paper",
        description: "24μm厚超声贴片连续监测中心血压，与动脉导管偏差<1 mmHg",
      },
      {
        title: "Pulsify Medical — Wearable Ultrasound for Cardiac Monitoring",
        url: "https://www.pulsify-medical.com/",
        type: "product",
        description: "32阵元可穿戴超声贴片测量心输出量/射血分数/室壁运动",
      },
      {
        title: "Softsonics — Wearable Ultrasound Sensors (Xu Lab Spin-off)",
        url: "https://www.softsonics.com/",
        type: "product",
        description: "徐升实验室衍生公司，开发消费级超声血压贴片",
      },
      {
        title: "Xu Lab — UC San Diego Jacobs School of Engineering",
        url: "https://xsheng.ucsd.edu/",
        type: "website",
        description: "徐升可穿戴电子/超声实验室主页",
      },
      {
        title: "Wang C et al. — Monitoring of the central blood pressure waveform via a conformal ultrasonic device (Nat Biomed Eng 2018)",
        url: "https://www.nature.com/articles/s41551-018-0287-x",
        type: "paper",
        description: "徐升实验室首篇可穿戴超声血压监测论文（开创性工作）",
      },
    ],
    source: "Xu S, UCSD; Pulsify Medical, KU Leuven/imec",
    year: 2025,
  },
  {
    id: "sweat-sensors",
    title: "汗液传感器商业化：Epicore/Nix/Kenzen",
    layer: "L1",
    type: "commercial",
    summary:
      "Epicore Gatorade Gx首个FDA获批可穿戴汗液传感器（Na⁺+出汗率+体液流失）。Nix水合生物传感器实时蓝牙测Na⁺、K⁺、总体液流失。Kenzen ECHO智能贴片多传感器工安热安全方案。",
    description: `可穿戴汗液传感器是近三年商业化最快的可穿戴技术品类之一。汗液作为一种非侵入性可连续获取的生物流体，含有丰富的生理化学信息，但其分析面临多重挑战：汗液成分浓度随出汗率变化（稀释效应）、皮肤表面污染、蒸发浓缩、不同身体部位出汗模式差异等。

Epicore Biosystems（MIT/西北大学衍生公司）的 Gatorade Gx 汗液贴片采用了独特的无电子设计：一次性比色法贴片，内置微流控通道收集汗液，通过化学反应产生颜色变化，用手机摄像头+App 扫描即可读取出汗率、Na⁺浓度和体液流失量。首款 FDA 获批（Class I 510(k)豁免）的可穿戴汗液传感器。优势在于无需电池/充电、成本极低、一次性使用卫生；劣势在于非实时读数（运动后扫描）和仅限 Na⁺单一电解质。

Nix Biosensors 的水合生物传感器采用了可重复使用传感器仓+一次性贴片的混合模式。传感器仓内置 Na⁺和 K⁺离子选择性电极（ISE）和温度传感器，通过蓝牙实时传输数据到手机 App。App 提供个性化出汗档案（Sweat Profile）和体液流失预测，用于耐力运动补水策略优化。核心技术优势在于实时连续读数和多种电解质同时监测。

Kenzen 的 ECHO 智能贴片面向工业热安全市场（建筑施工、采矿、制造），集成皮肤温度、心率、出汗率和运动传感器，使用机器学习建立个人化热阈值模型，在工人接近危险热应激状态时通过手机/手表发出预警。该产品已获多个大型工业企业采用。`,
    impact: {
      technology:
        "推动了电化学传感器微型化和微流控汗液收集两大领域的工程进步。离子选择性电极从实验室台式仪器缩小至贴片尺寸，微流控通道设计实现了可控汗液输送和精确体积计量。",
      product:
        "建立了\"可穿戴化学传感器\"这一新品类。Gatorade Gx 证明了消费品牌（百事/Gatorade）+ 初创公司（Epicore）的合作模式。Nix 展示了直接面向消费者的运动科技商业模式。Kenzen 验证了企业 B2B 热安全市场的付费意愿。",
      industry:
        "推动运动饮料行业从\"一刀切\"补水建议转向个性化补水。工业安全领域引入连续热应激监测替代传统 WBGT 指数（基于环境而非个人）。为未来汗液葡萄糖、乳酸、皮质醇等多分析物监测铺平了市场教育道路。",
    },
    applications: [
      "耐力运动补水优化：马拉松/铁人三项/超跑运动员根据实时 Na⁺流失量定制电解质补充方案，预防低钠血症",
      "工业热安全：建筑/采矿/制造工人在高温环境下通过汗液+HR+皮温综合监测预警热射病风险",
      "军事训练：美军测试 Epicore/Nix 贴片用于新兵基础训练中的水合管理和热损伤预防",
      "囊性纤维化诊断：汗液 Cl⁻浓度是 CF 诊断金标准，可穿戴贴片可能替代传统汗液刺激-收集-实验室分析流程",
      "个性化健康：消费者了解自身出汗特征（high-salt vs low-salt sweater）并调整日常饮食和运动补水",
    ],
    references: [
      {
        title: "Epicore Biosystems — Gatorade Gx Sweat Patch Official Page",
        url: "https://www.epicorebiosystems.com/",
        type: "product",
        description: "首款 FDA 获批可穿戴汗液传感器，比色法测量出汗率和 Na⁺浓度",
      },
      {
        title: "Nix Biosensors — Hydration Biosensor",
        url: "https://nixbiosensors.com/",
        type: "product",
        description: "实时蓝牙连续监测 Na⁺、K⁺和体液流失的运动补水传感器",
      },
      {
        title: "Kenzen — ECHO Smart Patch for Industrial Heat Safety",
        url: "https://www.kenzen.com/",
        type: "product",
        description: "多传感器智能贴片用于工业热安全预警",
      },
      {
        title: "Ghaffari R et al. — Soft wearable sensors for sweat analysis (Nature Reviews Bioengineering 2024)",
        url: "https://www.nature.com/natrevbioeng/",
        type: "paper",
        description: "Epicore 创始人撰写的可穿戴汗液传感器综述",
      },
      {
        title: "Bariya M et al. — Wearable sweat sensors (Nature Biotechnology 2019)",
        url: "https://www.nature.com/articles/s41587-019-0045-y",
        type: "paper",
        description: "可穿戴汗液传感器领域早期里程碑综述",
      },
    ],
    source: "Epicore Biosystems (Cambridge); Nix Biosensors (Boston); Kenzen (San Francisco)",
    year: 2025,
  },
  {
    id: "microneedle-isf",
    title: "多分析物微针ISF采样 — Biolinq",
    layer: "L1",
    type: "commercial",
    summary:
      "Biolinq硅微针阵列(~0.5mm穿透深度)2cm²皮肤贴片同时测量葡萄糖、酮体、乳酸。获FDA两项突破性设备认定(2024年从单一葡萄糖扩展为多分析物)。关键试验MARD~10%(vs静脉血糖)。",
    description: `微针（Microneedle）间质液（ISF）采样技术代表了一种类"无创但可触及体内化学信息"的全新传感器范式。与连续血糖监测（CGM）传统产品（Dexcom、Abbott）使用皮下软针探头不同，微针阵列仅穿透表皮到达真皮浅层（~0.5mm深度），该区域神经纤维密度极低，佩戴时几乎无痛感。

Biolinq 是该领域的先驱公司。其核心技术为硅微针阵列——在约 2cm² 的皮肤贴片上集成了数十根微针，每根微针表面印刷了独立的电化学传感器（葡萄糖氧化酶、乳酸氧化酶等）。微针穿透角质层后接触真皮间质液，传感器实时测量目标分析物浓度。2024 年 FDA 授予其两项"突破性设备认定"（Breakthrough Device Designation）——从最初的单一葡萄糖监测扩展为多分析物平台（葡萄糖+酮体+乳酸）。

关键技术指标：微针穿透深度 ~0.5mm（远短于 CGM 的 5-8mm 皮下探头），关键临床试验 MARD（平均绝对相对差）~10% vs 静脉血糖参考标准，与现有 CGM 产品精度相当。累计融资超过 $100M（Series C 由 Alpha Wave Ventures 领投）。

相比传统 CGM 的优势：（1）无痛——微针仅触及神经纤维缺失的真皮浅层；（2）多分析物——同一贴片同时测量多种生物标志物；（3）更短的响应延迟——ISF 葡萄糖滞后于血糖约 5-10 分钟，比脂肪组织 ISF（10-20 分钟）更快；（4）无出血风险——不穿透血管。挑战包括：皮肤渗透性个体差异、局部炎症反应、长期佩戴的传感器生物垢（biofouling）。`,
    impact: {
      technology:
        "将 MEMS 微加工技术（硅微针阵列制造）与电化学生物传感器（酶固定化电极）集成到同一微小平台。这种\"微针+传感器\"一体化制造工艺可拓展至多种分析物（皮质醇、药物浓度、炎症标志物等）。",
      product:
        "Biolinq 有望成为首个多分析物微针贴片（葡萄糖+酮体+乳酸），直接竞争 $130 亿 CGM 市场（Dexcom/Abbott/Medtronic 主导）。酮体+葡萄糖双监测对 1 型糖尿病酮症酸中毒预防有重要临床价值。",
      industry:
        "可能重塑糖尿病管理市场格局——从\"CGM 三巨头\"转向多分析物 ISF 平台竞争。微针技术也正在被化妆品（微针美容贴片）和疫苗递送（微针疫苗贴片）领域采用，形成跨行业技术扩散。",
    },
    applications: [
      "糖尿病多维度管理：同时监测葡萄糖（血糖控制）+酮体（酮症酸中毒预警）+乳酸（运动安全），比单一 CGM 提供更全面的代谢画像",
      "运动代谢优化：实时乳酸+葡萄糖监测辅助耐力运动员精准控速和营养补给，避免\"撞墙\"（bonking）",
      "生酮饮食/代谢健康：酮体+葡萄糖双监测帮助生酮饮食者维持目标酮体水平，避免低血糖",
      "重症监护：连续乳酸监测是脓毒症和休克管理的核心指标，微针贴片可替代反复抽血测乳酸",
      "药物监测：微针 ISF 采样可检测多种药物及其代谢物浓度，用于治疗药物监测（TDM）",
    ],
    references: [
      {
        title: "Biolinq — Multi-analyte Microneedle ISF Sensing Platform",
        url: "https://www.biolinq.com/",
        type: "product",
        description: "硅微针阵列多分析物（葡萄糖/酮体/乳酸）贴片平台",
      },
      {
        title: "FDA — Breakthrough Device Designations for Biolinq (2024)",
        url: "https://www.fda.gov/medical-devices",
        type: "website",
        description: "FDA 突破性设备认定数据库",
      },
      {
        title: "Teymourian H et al. — Microneedle-based electrochemical sensors (Chemical Reviews 2023)",
        url: "https://pubs.acs.org/journal/chreay",
        type: "paper",
        description: "微针电化学传感器综述",
      },
      {
        title: "Heikenfeld J et al. — Accessing analytes in biofluids for wearable diagnostics (Nature Biotechnology 2019)",
        url: "https://www.nature.com/articles/s41587-019-0040-3",
        type: "paper",
        description: "可穿戴诊断中生物流体分析物获取技术综述",
      },
    ],
    source: "Biolinq (San Diego, CA)",
    year: 2025,
  },

  // ───────── L2: 基础指标层 ─────────
  {
    id: "ppg-vascular-age",
    title: "PPG形态学血管年龄评估商业化",
    layer: "L2",
    type: "commercial",
    summary:
      "Oura Ring Gen 4心血管年龄从光电容积波速度(PWV)特征估算动脉硬化程度，与颈-股PWV相关r=0.71。18条PPG信号路径Smart Sensing动态切换。Google Nest Hub Soli 60GHz雷达获FDA De Novo用于睡眠追踪。",
    description: `光电容积描记（PPG）是消费可穿戴设备中最普遍的光学传感技术，传统上仅用于提取心率（从脉搏频率）和 SpO₂（从多波长比值）。但 PPG 波形本身携带了远超"脉搏频率"的丰富血流动力学信息——波形的形态特征反映了从心脏射血到外周血管弹性的整个心血管链路的机械特性。

PPG 形态学分析的核心概念是光电容积波速度（PWV）和脉搏波分析（PWA）。当心脏射血时，压力波沿动脉树传播，其传播速度与动脉壁硬度正相关——动脉越僵硬，PWV 越快。PPG 信号中的收缩期峰值时间、反射波到达时间（反射指数 RI）、二阶导数光电容积图（SDPPG）的 a-b-c-d-e 波特征等形态参数可以从外周 PPG 波形中评估动脉硬化程度。

Oura Ring Gen 4（2024 年 10 月发布）的 Smart Sensing 技术首次在消费可穿戴设备中实现了多路径 PPG 信号的动态选择——指环内 18 条 PPG 发射器-接收器信号路径（不同 LED 波长和光电二极管组合）根据手指血流灌注状态自动切换最优信号路径，显著提升了深肤色和冷手指情况下的信号质量。心血管年龄（Cardiovascular Age）功能从 PPG 形态学特征中提取 PWV 相关参数，建立与颈-股 PWV（cf-PWV，动脉硬化金标准）的映射模型，验证相关性 r=0.71。

Yilmaz 等（2026, PLOS Digital Health）独立验证了消费者睡眠追踪器（含 Oura）的 PPG 血管年龄估算与基于 ECG 的 PWV 测量的对应关系，为这一指标的科学可信度提供了外部证据。`,
    impact: {
      technology:
        "PPG 信号处理从\"只提取心率\"到\"波形形态学分析\"的升级，意味着从频域分析（傅里叶变换求主频）扩展到时域形态学分析（特征点检测、SDPPG 分析、波形分类）。多路径 PPG 动态选择开创了\"传感器融合在芯片层面\"的先例。",
      product:
        "Oura Ring Gen 4 心血管年龄功能将动脉硬化筛查从医院血管功能实验室（cf-PWV 测量需专业操作者+昂贵设备，$20K-50K）带到消费者手指。Fitbit、Apple Watch 等竞品预计将跟进类似功能。",
      industry:
        "\"心血管年龄\"作为消费者可理解的血管健康指标，可能成为继\"心率\"和\"HRV\"之后的第三个消费者健康核心指标。推动预防性心血管健康筛查从医院向家庭延伸，影响高血压、动脉硬化的早期发现和管理。",
    },
    applications: [
      "动脉硬化早期筛查：消费者通过戒指/手表在日常睡眠中自动评估血管年龄，早于高血压诊断前发现血管功能异常",
      "生活方式干预效果追踪：用户通过心血管年龄变化量化运动/饮食/减压对血管健康的改善效果",
      "抗衰老/长寿：血管年龄作为生物学年龄（Biological Age）的核心组成部分，纳入长寿追踪指标体系",
      "药物心血管安全性评估：在分散式临床试验中，连续 PWV 监测评估新药的血管效应",
      "高血压管理：PWV 连续监测补充血压读数，区分\"血压控制良好但血管仍僵硬\"的高风险患者",
    ],
    references: [
      {
        title: "Oura Ring Gen 4 — Smart Sensing & Cardiovascular Age",
        url: "https://ouraring.com/product/oura-ring-4",
        type: "product",
        description: "Oura Gen 4 产品页面，18条PPG路径Smart Sensing",
      },
      {
        title: "Yilmaz G et al. — Consumer sleep trackers for vascular age estimation (PLOS Digit Health 2026)",
        url: "https://journals.plos.org/digitalhealth/",
        type: "paper",
        description: "消费者睡眠追踪器血管年龄估算验证研究",
      },
      {
        title: "Allen J — Photoplethysmography and its application in clinical physiological measurement (Physiol Meas 2007)",
        url: "https://iopscience.iop.org/journal/0967-3334",
        type: "paper",
        description: "PPG 临床生理测量经典综述",
      },
      {
        title: "Elgendi M — On the analysis of fingertip photoplethysmogram signals (Curr Cardiol Rev 2012)",
        url: "https://www.eurekaselect.com/journal/54",
        type: "paper",
        description: "PPG 信号形态学分析（SDPPG/RI/SI）方法综述",
      },
    ],
    source: "Oura Health (Oulu, Finland); Yilmaz G et al., PLOS Digit Health 2026",
    year: 2026,
  },
  {
    id: "mmwave-contactless-vitals",
    title: "毫米波雷达非接触生命体征",
    layer: "L2",
    type: "commercial",
    summary:
      "Google Nest Hub 2nd Gen Soli 60GHz FMCW雷达获FDA De Novo批准用于非接触睡眠追踪。TI IWR6843在1-3m距离<5bpm心率精度。Acconeer A212 MIMO多天线120°FOV多人监测。Novelda X7 UWB雷达主导汽车CPD市场。",
    description: `毫米波（mmWave）雷达非接触生命体征监测是近三年商业落地最快的传感技术之一。其物理原理为 FMCW（调频连续波）雷达发射 60GHz 或 77GHz 电磁波，通过分析反射信号的相位变化检测皮肤表面微小位移——心脏每次搏动引起的胸部皮肤位移约 0.2-0.5mm，呼吸引起的胸部位移约 4-10mm。通过带通滤波分离呼吸（0.1-0.5Hz）和心跳（0.8-2.5Hz）信号分量，即可从数米外无接触地提取生命体征。

Google Nest Hub 2nd Gen（2021 年发布）内置 Soli 60GHz FMCW 雷达芯片，2023 年获 FDA De Novo 批准用于非接触睡眠追踪（呼吸率+睡眠分期）。这是 FDA 首次批准非接触雷达用于医疗级睡眠监测。技术上，Soli 雷达发射功率 <10mW（远低于手机），在 0-3m 范围内波束成形聚焦到睡眠者胸部位置。

TI IWR6843 是工业/汽车级 60GHz mmWave 雷达 SoC，内置 ARM Cortex-R4F 和 DSP。TI 提供的 Vital Signs SDK 在 1-3m 距离实现 <5 bpm 心率精度和 <2 bpm 呼吸率精度。功耗约 1.5W（连续模式），适合壁挂式安装。TI 的 3D 人员计数+生命体征联合检测算法可同时追踪多人的位置和生命体征。

Acconeer A212（2024+）采用脉冲相干雷达（PCR）替代 FMCW，功耗仅 ~100mW，增加了 MIMO（多输入多输出）多天线配置实现 120° FOV 多人生命体征同时监测。毫米级绝对距离精度使其可精确追踪胸腔位移波形。

Novelda X7 采用 6.5-8.5GHz UWB（超宽带）雷达，主导了汽车儿童存在检测（CPD）市场——Euro NCAP 2025 安全评级将 CPD 纳入评分体系，要求新车能检测到后座遗留婴儿的呼吸信号。`,
    impact: {
      technology:
        "推动毫米波雷达从汽车（自动驾驶/ADAS）和工业（液位/速度传感）向消费医疗领域拓展。60GHz ISM 频段（57-64GHz）的全球免许可开放为消费产品提供了频谱基础。脉冲相干雷达（PCR）替代 FMCW 进一步降低功耗至 ~100mW。",
      product:
        "Google Nest Hub 2nd Gen 开创了\"睡眠追踪不需要佩戴任何设备\"的消费体验。Amazon Halo Rise 跟进类似产品。汽车 CPD 将成为 Euro NCAP 五星安全标配，20+ 车型将在 2025-2026 年搭载 UWB/mmWave 生命体征雷达。",
      industry:
        "非接触生命体征监测将改变三大行业：（1）睡眠科技——从可穿戴/床垫传感器转向无感监测；（2）汽车安全——CPD 成为法规强制标配；（3）养老/远程监护——壁挂式/顶灯式雷达监测独居老人跌倒和生命体征异常。",
    },
    applications: [
      "婴儿/新生儿监护：非接触雷达替代传统婴儿呼吸监测垫，无电极/无贴片/无窒息风险",
      "睡眠诊所家庭化：FDA 批准的非接触睡眠追踪替代 PSG（多导睡眠图）进行初步睡眠呼吸暂停筛查",
      "汽车儿童存在检测（CPD）：Euro NCAP 2025 法规推动，检测后座遗留婴儿的呼吸和移动，防止热射车死亡",
      "养老独居监护：壁挂式/顶灯式雷达监测独居老人的呼吸、跌倒和活动异常，隐私保护好（无摄像头）",
      "精神压力评估：无需佩戴设备的会议室/办公室场景下非接触 HRV 分析，用于驾驶员疲劳/会议压力监测",
    ],
    references: [
      {
        title: "Google Nest Hub 2nd Gen — Soli Radar Sleep Sensing (FDA De Novo Cleared)",
        url: "https://store.google.com/product/nest_hub_2nd_gen",
        type: "product",
        description: "FDA De Novo 批准的非接触睡眠追踪（呼吸率+睡眠分期）",
      },
      {
        title: "TI IWR6843 — 60GHz mmWave Radar with Vital Signs SDK",
        url: "https://www.ti.com/product/IWR6843",
        type: "product",
        description: "TI 60GHz mmWave 雷达 SoC + 生命体征 SDK",
      },
      {
        title: "Acconeer A212 — Pulsed Coherent Radar for Vital Signs",
        url: "https://www.acconeer.com/products/a212/",
        type: "product",
        description: "100mW 脉冲相干雷达，MIMO 120° FOV 多人生命体征",
      },
      {
        title: "Novelda X7 — UWB Radar for Child Presence Detection",
        url: "https://novelda.com/",
        type: "product",
        description: "UWB 雷达汽车 CPD 市场领导者",
      },
      {
        title: "Euro NCAP 2025 — Child Presence Detection Protocol",
        url: "https://www.euroncap.com/",
        type: "website",
        description: "Euro NCAP 2025 将 CPD 纳入安全评级",
      },
    ],
    source: "Google ATAP; Texas Instruments; Acconeer; Novelda",
    year: 2025,
  },
  {
    id: "edge-ai-biosignal",
    title: "边缘AI：传感器端生物信号处理",
    layer: "L2",
    type: "research",
    summary:
      "ST LSM6DSO ML核心在IMU传感器上以<10μA运行决策树分类器实现常开活动识别。ARM Ethos-U55/U65微NPU在Cortex-M上以<1mW运行1D CNN进行ECG/PPG异常检测。量化基础模型压缩至<10MB部署到边缘设备。",
    description: `边缘 AI（Edge AI / TinyML）在生物信号处理领域代表了从\"原始数据传输到云端处理\"到\"传感器芯片本地运行 AI 模型\"的架构转变。这一转变由三个技术趋势驱动：（1）MCU 芯片算力指数增长（ARM Cortex-M85 达 3.4 DMIPS/MHz）；（2）模型量化/剪枝/知识蒸馏技术的成熟；（3）隐私法规要求（HIPAA/GDPR）限制原始生理数据传输。

STMicroelectronics LSM6DSO 惯性测量单元（IMU）内置了机器学习核心（MLC, Machine Learning Core）——在传感器芯片上以 <10μA 电流运行决策树分类器，实现常开（always-on）活动识别（静止/行走/跑步/骑行/驾驶）。MLC 的决策树由 ST 的 Unico GUI 工具训练后编译到传感器寄存器中，无需外部 MCU。这一架构使可穿戴设备电池寿命延长 3-5 倍（相比连续 MCU 唤醒处理）。

ARM Ethos-U55/U65 微 NPU（神经网络处理单元）是边缘 AI 的硬件加速器，专为 Cortex-M 级 MCU 设计。Ethos-U55 以 <1mW 功耗运行 1D CNN 进行 ECG 心律失常检测和 PPG 伪影分类，相当于将一个原本需要 DSP/FPGA 的深度学习推理任务搬到 MCU 上。NXP、Infineon、Renesas 等 MCU 厂商已将 Ethos-U 集成到其旗舰产品中。

2025 年出现的新趋势是将生物信号基础模型（Foundation Model）通过量化、剪枝和知识蒸馏压缩至 <10MB，部署到边缘设备。这意味着一个在百万级 ECG 数据上预训练的 Transformer 模型可以压缩到 MCU 闪存中，在新用户数据上本地微调和推理。脉冲神经网络（Spiking Neural Network, SNN）在神经形态芯片上展现出微瓦级功耗生物信号处理的潜力。`,
    impact: {
      technology:
        "TinyML（<1mW 推理功耗）使 AI 从云端数据中心下移到传感器芯片。模型量化（FP32→INT8→INT4）、知识蒸馏和神经架构搜索（NAS）三大技术使 >100MB 模型压缩至 <10MB 而精度损失 <2%。",
      product:
        "下一代可穿戴设备将实现真正的\"设备端 AI 健康助理\"——心率异常检测、跌倒检测、房颤筛查等 AI 功能在手表/戒指本地运行，无需网络连接，延迟 <10ms，隐私保护（原始数据不出设备）。",
      industry:
        "\"AI on Sensor\"趋势模糊了传感器和处理器之间的界限——传感器不再是哑终端，而是嵌入 AI 推理能力的智能节点。这一趋势将影响可穿戴、听戴式（hearables）、植入式等所有小型化医疗设备的设计架构。",
    },
    applications: [
      "常开活动/手势识别：传感器端 ML 内核以 μA 级功耗持续运行，检测到特定活动/手势后唤醒主 MCU，节省 90%+ 系统功耗",
      "设备端 ECG 异常检测：Ethos-U 微 NPU 在智能手表上本地运行 CNN 检测房颤/室性早搏，数据不出设备",
      "量化基础模型本地部署：10MB 以下量化 ECG/PPG 基础模型在 MCU 上本地微调，适配个体生理差异",
      "工业/军事边缘推理：矿山/油田等无网络连接环境下的矿工/士兵实时生理风险预警",
      "神经形态 SNN 推理：Loihi 2 / Speck 等神经形态芯片上 μW 级 ECG/EEG 实时分析",
    ],
    references: [
      {
        title: "STMicroelectronics LSM6DSO — IMU with Machine Learning Core",
        url: "https://www.st.com/en/mems-and-sensors/lsm6dso.html",
        type: "product",
        description: "内置 ML 核心（<10μA 决策树分类器）的 6 轴 IMU",
      },
      {
        title: "ARM Ethos-U55/U65 — microNPU for Cortex-M",
        url: "https://www.arm.com/products/silicon-ip-cpu/ethos/ethos-u55",
        type: "product",
        description: "ARM 微 NPU，<1mW 功耗运行 1D CNN 用于 ECG/PPG 分析",
      },
      {
        title: "TinyML Foundation — Edge AI for Ultra-Low Power Devices",
        url: "https://www.tinyml.org/",
        type: "website",
        description: "TinyML 社区和年度峰会，边缘 AI 技术前沿",
      },
      {
        title: "Banbury C et al. — Benchmarking TinyML Systems (MLSys 2021)",
        url: "https://proceedings.mlsys.org/paper_files/paper/2021/",
        type: "paper",
        description: "TinyML 系统基准测试，MCU 级 AI 推理性能对比",
      },
    ],
    source: "STMicroelectronics; ARM; Qualcomm Snapdragon Wear W5+ Gen 2",
    year: 2025,
  },

  // ───────── L3: 融合指标层 ─────────
  {
    id: "dfa-alpha1-threshold",
    title: "DFA α1实时运动阈值检测",
    layer: "L3",
    type: "research",
    summary:
      "DFA α1=0.75(VT1)和α1=0.50(VT2)为仅从RR间期数据得出的有效非侵入式运动强度阈值。Tanner等(2024)元分析确认HRVT1 vs VT1平均心率差仅0.4 bpm。智能手机PPG DFA α1分析2026年验证。",
    description: `DFA α1（Detrended Fluctuation Analysis 短程标度指数）是近五年运动生理学领域最具实用价值的非线性 HRV 指标。与传统时域（RMSSD、SDNN）和频域（LF/HF）HRV 指标不同，DFA α1 直接量化心跳间期序列的标度行为（scaling behavior）——即 RR 间期序列是随机（α1→0.5）、分形相关（α1→1.0）还是强相关/平滑（α1→1.5）。

Bruce Rogers 和 Thomas Gronwald 团队（2020-2026，15+ 篇系列论文）系统性地建立了 DFA α1 与运动生理学经典阈值之间的定量关系：
- DFA α1 = 0.75 对应第一通气阈值（VT1 / LT1，有氧阈），标志着从纯有氧代谢转向有氧为主的混合代谢
- DFA α1 = 0.50 对应第二通气阈值（VT2 / LT2 / MLSS，最大乳酸稳态），标志着进入无氧为主的代谢区域

Tanner 等（2024）元分析（12 项研究，262 名受试者）确认了这些对应关系的跨人群一致性：HRVT1 与 VT1 平均心率差仅 0.4 bpm（95%CI: -1.2~2.0），HRVT2 与 VT2 差 1.6 bpm（95%CI: -0.5~3.7）。个体差异仍然存在但群体均值高度一致。

AI Endurance App（Andriolo 等, 2024 Sensors）展示了从日常训练数据（仅需 RR 间期时序）自动提取 DFA α1-功率关系的能力，无需实验室气代谢测试即可估算个体化训练区间。Rogers 等（2026）进一步验证了使用智能手机摄像头 PPG 进行 DFA α1 分析的可行性——将这一原本需要 ECG 胸部带的指标拓展到仅需手指接触手机摄像头即可获取，极大降低了使用门槛。`,
    impact: {
      technology:
        "DFA α1 的验证推动了非线性 HRV 分析从学术好奇心转向实用运动工具。去趋势波动分析（DFA）算法的实时化和 PPG 适配是两大关键技术突破，使原本需要 ECG + MATLAB 后处理的实验室分析变成手机 App 实时功能。",
      product:
        "AI Endurance App、HRV Logger、Runalyze 等 App 已集成 DFA α1 实时显示。Garmin/Coros/Polar 等主流运动手表预计将在未来 2-3 年将 DFA α1 纳入训练指标，替代或补充传统的 5 区心率模型和乳酸阈值测试。",
      industry:
        "可能颠覆 $50 亿运动测试市场——实验室气代谢测试（$150-300/次）和乳酸测试（采血）被仅需手表/手机的 DFA α1 分析部分替代。教练和运动员获得比心率区间更精确的\"实时代谢状态\"指标。",
    },
    applications: [
      "无实验室训练区间设定：运动员仅需手表/手机即可获取个性化 VT1/VT2 对应的配速和心率区间，免去实验室气代谢测试",
      "实时训练强度监控：DFA α1 在训练中实时显示（2-5分钟窗口），当 α1 跌破 0.50 时提示运动员即将进入不可持续的强度区域",
      "恢复/过度训练评估：静息 DFA α1 偏离个体基线可能反映自主神经功能紊乱，比传统 RMSSD 对训练负荷更敏感",
      "慢性病患者运动处方：心衰/COPD/长新冠患者使用 DFA α1 引导的低强度运动训练，避免过度负荷",
      "智能手机大众健康：仅需手机摄像头 PPG 即可获取 DFA α1，为 10 亿+ 智能手机用户提供精准运动强度指导",
    ],
    references: [
      {
        title: "Rogers B, Gronwald T — Fractal correlation properties of HRV as a noninvasive biomarker (Frontiers Physiol 2020-2025 series)",
        url: "https://www.frontiersin.org/journals/physiology",
        type: "paper",
        description: "DFA α1 运动阈值检测奠基性系列论文（15+篇）",
      },
      {
        title: "Tanner H et al. — Meta-analysis of DFA a1 thresholds vs gas exchange (Sports Med 2024)",
        url: "https://link.springer.com/journal/40279",
        type: "paper",
        description: "12项研究262受试者元分析：HRVT1 vs VT1 差0.4 bpm",
      },
      {
        title: "Andriolo L et al. — AI Endurance: DFA a1 from daily training data (Sensors 2024)",
        url: "https://www.mdpi.com/journal/sensors",
        type: "paper",
        description: "从日常训练数据自动提取 DFA α1-功率关系",
      },
      {
        title: "Rogers B et al. — Smartphone PPG DFA a1 validation (2026)",
        url: "https://pubmed.ncbi.nlm.nih.gov/",
        type: "paper",
        description: "智能手机 PPG DFA α1 分析可行性验证",
      },
      {
        title: "AI Endurance App — Real-time DFA a1 display",
        url: "https://www.aiendurance.com/",
        type: "product",
        description: "集成实时 DFA α1 显示的运动训练 App",
      },
    ],
    source: "Rogers B, Gronwald T; AI Endurance app",
    year: 2026,
  },
  {
    id: "digital-biomarker-mental-health",
    title: "数字生物标志物精神健康检测",
    layer: "L3",
    type: "research",
    summary:
      "多模态模型结合HRV+睡眠碎片化+活动水平在压力分类上达AUC 0.75-0.85。Hehlmann等(2026)从可穿戴数据检测抑郁严重度(与临床量表相关r=0.65)。目前尚无FDA批准的消费者可穿戴精神健康生物标志物。",
    description: `精神健康数字生物标志物是数字健康领域增长最快的赛道之一。其核心理念是从可穿戴设备的被动传感器数据（HRV、睡眠模式、活动水平、社交交互模式、手机使用行为）中提取客观的精神状态指标，补充或部分替代传统的主观量表评估（PHQ-9 抑郁量表、GAD-7 焦虑量表等）。

2024-2026 年见证了多项关键验证研究：
- Choi A 等（JMIR 2024）使用多模态模型结合 HRV（RMSSD+SDNN）+ 睡眠碎片化指数 + 日常活动水平，在压力分类任务上达到 AUC 0.75-0.85。
- Hehlmann 等（2026, Scientific Reports）从可穿戴生物特征（HRV、睡眠效率、夜间活动、昼夜节律稳定性）+ 手机行为数据（屏幕时间、社交 App 使用频率、打字速度）检测抑郁严重度，与临床量表（BDI-II/HAMD-17）相关 r=0.65。睡眠效率是单一最强特征，组间效应量 d=0.82（抑郁 vs 非抑郁）。
- Corponi 等（2024, JMIR）使用自监督学习（SSL）从可穿戴数据检测双相情感障碍急性心境发作，无需标记临床数据——在精神病学中尤为重要，因为临床标记获取成本极高。

然而，截至 2026 年中期，尚无 FDA 批准的消费者可穿戴设备精神健康生物标志物。主要障碍包括：（1）精神疾病的生物异质性——不同抑郁症亚型传感器表现差异大；（2）状态 vs 特质混淆——慢性焦虑患者的基线 HRV 长期偏低，难以区分\"状态恶化\"vs\"长期特质\"；（3）生态效度——实验室验证效果良好的模型在真实世界\"脏数据\"中表现显著下降；（4）临床可操作性——穿戴设备检测到\"抑郁风险升高\"后应触发何种干预尚不明确。

前沿方向：多模态融合（生理+行为+语音+社交媒体语言模式）、纵向 N-of-1 建模（个体化基线而非人群常模）、闭环数字治疗整合（检测→自动触发 CBT/正念干预）。`,
    impact: {
      technology:
        "推动可穿戴生物特征分析从\"单一指标\"（如仅 HRV）到\"多模态融合\"（HRV+睡眠+活动+社交+语音）。自监督学习解决精神科标记数据稀缺瓶颈。N-of-1 纵向建模使个体差异化预警成为可能。",
      product:
        "尚无 FDA 批准的精神健康生物标志物，但已有\"健康监测\"而非\"诊断\"的灰度产品：Fitbit 压力管理评分、Apple 心理健康日志+状态跟踪、Oura Resilience 弹性指标、WHOOP 压力监测。下一步是将这些\"健康\"功能升级为\"临床\"工具。",
      industry:
        "精神健康数字生物标志物可能成为 $2000 亿+ 精神健康市场中增长最快的细分赛道。预期路径：消费健康（现状）→ 数字疗法辅助监测（SaMD 510(k)）→ 独立诊断/预后生物标志物（De Novo/PMA）。制药行业对此高度关注——数字终点用于抗抑郁药临床试验。",
    },
    applications: [
      "抑郁症早期筛查：初级保健中使用可穿戴数据进行大规模抑郁风险筛查，PHQ-9 阳性者转诊确诊",
      "双相障碍心境发作预警：自监督学习模型检测睡眠和活动模式变化，在躁狂/抑郁发作前几天发出预警",
      "抗抑郁治疗疗效监控：纵向 HRV+睡眠+活动趋势评估 SSRI/CBT 治疗反应，辅助临床调药决策",
      "大学生/高压职业心理健康预防：大规模可穿戴数据监测校园/企业人群心理健康趋势",
      "闭环数字治疗：检测到压力升高→自动触发正念/呼吸训练→评估干预后 HRV 恢复→调整干预策略",
    ],
    references: [
      {
        title: "Choi A et al. — Multimodal wearable stress classification (JMIR 2024)",
        url: "https://www.jmir.org/",
        type: "paper",
        description: "HRV+睡眠+活动多模态压力分类 AUC 0.75-0.85",
      },
      {
        title: "Hehlmann MI et al. — Wearable and smartphone-based digital phenotyping for depression severity (Sci Rep 2026)",
        url: "https://www.nature.com/srep/",
        type: "paper",
        description: "可穿戴+手机数据检测抑郁严重度 r=0.65, 睡眠效率 d=0.82",
      },
      {
        title: "Corponi F et al. — Self-supervised learning for mood episode detection (JMIR 2024)",
        url: "https://www.jmir.org/",
        type: "paper",
        description: "自监督学习无标记数据检测双相心境发作",
      },
      {
        title: "FDA Digital Health Center of Excellence",
        url: "https://www.fda.gov/medical-devices/digital-health-center-excellence",
        type: "website",
        description: "FDA 数字健康卓越中心，数字生物标志物监管指导",
      },
    ],
    source: "Choi A, Hehlmann MI, Corponi F et al.; 各期刊 2024-2026",
    year: 2026,
  },
  {
    id: "cuffless-bp",
    title: "无袖带血压——进展与差距",
    layer: "L3",
    type: "research",
    summary:
      "Aktiia Bracelet获CE IIa级使用PPG脉冲波形分析24h连续血压监测。Samsung Galaxy Watch均差约5mmHg。2025年深度学习法在实验室达<5mmHg均差但真实动态场景误差仍然大得多。尚无FDA批准替代临床血压测量。",
    description: `无袖带血压（Cuffless Blood Pressure）是无创血压监测的"圣杯"——若能实现准确且免校准的连续血压监测，将彻底改变高血压管理（全球 13 亿患者，仅 ~50% 知晓诊断）。然而，经过近十年的密集研发投入，截至 2026 年中期，无袖带血压技术仍处于"实验室表现良好但真实世界不够可靠"的阶段。

主要技术路线有三条：

（1）PPG 脉冲波形分析（PWA）：从 PPG 波形中提取形态特征，使用机器学习模型映射到血压值。代表产品：Aktiia Bracelet（瑞士，CE IIa 级，使用专有光学 PPG 传感器+算法，24h 连续测量，需每月袖带校准一次）。优势在于仅需光学传感器（已有手表/戒指标配），缺点是 PWA-血压关系在个体间高度可变，需要定期校准。

（2）脉搏到达时间（PAT/Pulse Arrival Time）+ PTT：利用 ECG R 峰到 PPG 脉搏波到达的时间差（PAT）与血压的负相关关系（血压升高→动脉壁紧张→脉搏传播加速→PAT 缩短）。Samsung Galaxy Watch 系列（BioActive Sensor, PWA+PAT 融合）是消费级代表，Galaxy Watch BP 功能在部分国家/地区可用（需每月袖带校准，均差约 5mmHg）。Apple 在 PPG+ECG 无袖带血压方向持有多项专利，但截至 2026 年未推出功能。

（3）深度学习直接映射：2025 年提出的 SleepBP-Net（从夜间 PPG 估计连续血压）、HGCTNet（层级图卷积 Transformer）等深度学习方法在实验室数据集上达到 BHS A 级精度（<5mmHg 均差），但真实动态场景误差显著增大。

核心障碍（Schutte AE 等, 2024 J Hum Hypertens "何时才算够好？"）：
- 校准漂移：动脉张力/外周阻力的日间变化导致 PAT-血压关系偏移
- PEP 变异性：射血前期（PEP）的自主神经调节引入 PAT 中无法区分的变化
- 人群异质性：年龄/药物/糖尿病/动脉硬化改变脉搏传播特性
- 运动伪影：动态场景下 PPG/ECG 信号质量下降
- BHS/ISO 81060-2 标准严格要求动态验证，多数无袖带设备未达标`,
    impact: {
      technology:
        "PAT/PTT 原理已被充分理解但工程实现仍困难重重。下一代方案倾向于多传感器融合（PPG+PAT+超声/压力传感器）替代单模态方法。深度学习（特别是自监督预训练+个体化微调）正在成为精度提升的主要驱动力。",
      product:
        "Aktiia Bracelet 在欧盟（CE）市场先行，Samsung Galaxy Watch 在部分亚洲市场先行，但美国 FDA 未批准任何无袖带血压设备替代临床血压测量。预计首个 FDA 批准的消费者无袖带血压设备最早 2027-2028 年出现。",
      industry:
        "一旦实现准确免校准连续血压监测，将颠覆 $35 亿血压监测市场（Omron 袖带血压计主导）和 $30 亿动态血压监测市场。但\"校准漂移\"和\"动态精度\"两个工程技术难题需要基础层面的突破，而非渐进式改进。",
    },
    applications: [
      "高血压筛查：智能手表在日常佩戴中自动识别持续性血压升高模式，引导潜在患者就医确诊",
      "24h 动态血压替代：替代传统动态血压监测（每 30 分钟自动充气，影响睡眠），实现真正的无扰连续监测",
      "降压药疗效评估：连续血压波形评估药物 24h 血压控制效果（比诊室单点血压敏感得多）",
      "妊娠高血压监测：孕期连续血压追踪，预警子痫前期（preeclampsia）",
      "透析中血压监测：血液透析过程中连续无创血压监测避免透析低血压（IDH）并发症",
    ],
    references: [
      {
        title: "Aktiia — CE-marked Cuffless 24h Blood Pressure Monitoring",
        url: "https://www.aktiia.com/",
        type: "product",
        description: "Aktiia Bracelet，CE IIa 级 PPG PWA 连续血压监测",
      },
      {
        title: "Samsung Galaxy Watch — Blood Pressure Monitoring Feature",
        url: "https://www.samsung.com/global/galaxy/galaxy-watch/",
        type: "product",
        description: "Samsung Galaxy Watch PPG+ECG PAT 无袖带血压",
      },
      {
        title: "Schutte AE et al. — Cuffless blood pressure devices: When is good, good enough? (J Hum Hypertens 2024)",
        url: "https://www.nature.com/jhh/",
        type: "paper",
        description: "关键评论：无袖带血压何时才算够好？",
      },
      {
        title: "SleepBP-Net — Deep Learning for Nocturnal Cuffless BP (2025)",
        url: "https://pubmed.ncbi.nlm.nih.gov/",
        type: "paper",
        description: "深度学习夜间无袖带血压估计",
      },
      {
        title: "ISO 81060-2 — Non-invasive sphygmomanometers clinical validation standard",
        url: "https://www.iso.org/standard/",
        type: "website",
        description: "无创血压计临床验证国际标准",
      },
    ],
    source: "Aktiia (Switzerland); Samsung; Schutte AE et al.",
    year: 2025,
  },
  {
    id: "large-scale-wearable-studies",
    title: "大规模可穿戴健康研究(2024-2026成果)",
    layer: "L3",
    type: "research",
    summary:
      "UK Biobank加速度计子研究(10.4万参与者,7日监测)产出MACE事件预测、VTE风险、痴呆风险等多项2024-2026发现。All of Us可穿戴数据集(Fitbit+完整电子健康档案关联,Nat Med 2026)为最多样化大规模可穿戴数据集。",
    description: `大规模可穿戴健康研究（10万+ 参与者规模）正在将可穿戴设备从"消费者健康玩具"转变为"流行病学与临床研究工具"。2024-2026 年是这一领域的丰收期，四项大型研究产出了对公共健康和临床实践的深远影响。

（1）UK Biobank 加速度计子研究：全球最大的加速度计流行病学研究。10.4 万名参与者佩戴 Axivity AX3 腕部加速度计 7 天（2013-2015 年数据收集），此后与全因死亡、CVD、癌症、痴呆、COPD 等结局进行前瞻性关联分析。2024-2026 年关键发表：
- Yun J 等（EClinicalMedicine 2026）：可穿戴步数+睡眠联合预测 MACE（主要心血管不良事件），增加预后价值超越传统风险评分
- Zhang Q 等（2026）：昼夜节律模式（休息-活动节律幅度/稳定性/碎片化）预测静脉血栓栓塞（VTE）风险
- Wanigatunga AA 等（2025）：MVPA（中高强度体力活动）降低全因痴呆风险，剂量-反应关系

（2）All of Us Research Program 可穿戴子研究：Patten T 等（Nature Medicine 2026 年 4 月）发表了这个具有里程碑意义的数据集——10K+ 参与者的 Fitbit 数据与完整电子健康档案（EHR）关联。这是目前种族/民族/社会经济地位最多样化的大规模可穿戴数据集（UK Biobank 以白人/高社会经济地位英国人为主）。2025-2026 年基于此数据集的关键发现：
- REM 睡眠作为可改变 CVD 风险因子（Kang J 等）
- 可穿戴数据用于产后抑郁筛查（Hurwitz E 等）
- 设备佩戴时间的群体差异及偏差纠正方法
- 从 Fitbit 数据衍生糖尿病/高血压/睡眠呼吸暂停等表型的数字生物标志物

（3）Apple Heart Study（41.9 万参与者，Stanford/Apple 合作）：2019 年初步结果（NEJM）改变了房颤筛查的讨论。2025 年追踪分析发现参与者中 73% 白人、9% 西语裔——揭示了虚拟试验（virtual trials）中少数群体代表性严重不足的系统性问题。

（4）Fitbit Heart Study（45.5 万参与者，Fitbit/Google）：验证了 PPG 房颤检测算法的阳性预测值（PPV），推动 FDA 批准 Fitbit 不规则心律通知（IRN）功能。`,
    impact: {
      technology:
        "大规模可穿戴数据集使\"数据驱动\"的数字生物标志物发现成为可能——从假设驱动的传统流行病学转向数据挖掘驱动的关联发现。机器学习方法（梯度提升机/深度学习/生存分析）在处理高维时序传感器数据方面优于传统 Cox 回归。",
      product:
        "研究成果直接推动 FDA 批准的消费者可穿戴临床功能：Apple Watch 房颤检测（源自 Apple Heart Study）、Fitbit 不规则心律通知（源自 Fitbit Heart Study）。UK Biobank 研究为睡眠/体力活动/昼夜节律的公共健康指南提供证据基础（WHO 体力活动指南可能基于 UKB 数据更新）。",
      industry:
        "\"可穿戴数据+电子健康档案\"关联将成为流行病学研究的标配范式，替代传统的问卷调查（回忆偏倚+低时间分辨率）。All of Us 模式（Fitbit+EHR）比 UK Biobank 模式（仅加速度计+问卷调查）更强大，将成为未来大规模研究的标杆。",
    },
    applications: [
      "公共健康指南更新：UK Biobank 加速度计数据为 WHO 体力活动/睡眠指南提供客观剂量-反应证据",
      "数字终点用于临床试验：FDA 认可的加速度计步数作为药物试验的数字终点（如心衰药物对日常活动量的影响）",
      "疾病预测模型：加速度计+PPG+睡眠 24h 数据训练的 ML 模型预测 5 年 CVD/糖尿病/痴呆风险",
      "健康不平等研究：All of Us 多样化数据集揭示不同种族/收入群体的可穿戴健康指标差异，指导精准干预",
      "药物警戒：大规模可穿戴数据检测上市后药物的隐藏副作用（如某种降压药导致睡眠质量下降）",
    ],
    references: [
      {
        title: "Patten T et al. — All of Us Wearable Dataset with EHR Linkage (Nature Medicine 2026)",
        url: "https://www.nature.com/nm/",
        type: "paper",
        description: "All of Us Fitbit+EHR 数据集 Nature Medicine 发表",
      },
      {
        title: "UK Biobank — Accelerometer Sub-study (103,000 participants, 7-day Axivity AX3)",
        url: "https://www.ukbiobank.ac.uk/",
        type: "website",
        description: "UK Biobank 加速度计子研究主页",
      },
      {
        title: "Yun J et al. — Wearable steps + sleep predict MACE (EClinicalMedicine 2026)",
        url: "https://www.thelancet.com/eclinicalmedicine",
        type: "paper",
        description: "可穿戴步数+睡眠联合预测主要心血管不良事件",
      },
      {
        title: "Apple Heart Study — 419,000 participants, NEJM 2019 + 2025 follow-up",
        url: "https://www.apple.com/healthcare/apple-watch/",
        type: "paper",
        description: "Apple Heart Study 41.9万参与者房颤大规模筛查",
      },
      {
        title: "Fitbit Heart Study — 455,000 participants, PPG AFib detection PPV validation",
        url: "https://www.fitbit.com/global/us/technology/irregular-rhythm",
        type: "website",
        description: "Fitbit Heart Study 45.5万参与者PPG房颤检测",
      },
      {
        title: "Zhang Q et al. — Circadian rhythm patterns predict VTE (2026)",
        url: "https://pubmed.ncbi.nlm.nih.gov/",
        type: "paper",
        description: "UK Biobank 昼夜节律模式预测静脉血栓栓塞",
      },
      {
        title: "Wanigatunga AA et al. — MVPA lowers all-cause dementia risk (2025)",
        url: "https://pubmed.ncbi.nlm.nih.gov/",
        type: "paper",
        description: "UK Biobank 中高强度体力活动降低全因痴呆风险",
      },
    ],
    source: "UK Biobank; All of Us Research Program; Apple Heart Study; Fitbit Heart Study",
    year: 2026,
  },

  // ───────── L4: 高级指标层 ─────────
  {
    id: "whoop-stress-coach",
    title: "WHOOP压力监测+GPT-4教练",
    layer: "L4",
    type: "commercial",
    summary:
      "WHOOP压力监测(2024年中)使用HRV+皮温+静息HR将实时急性压力与慢性负荷分开。WHOOP Coach(GPT-4驱动,2023年9月)提供上下文感知对话式健康指导。力量训练模块量化肌肉负荷和肌群容量负荷。",
    description: `WHOOP 是消费可穿戴设备中"高级指标层（L4）"的标杆产品，以无屏幕心率臂带+订阅商业模式著称。2023-2024 年 WHOOP 连续推出三项重大功能升级，从运动恢复监测（最初的 Recovery 评分）扩展到压力监测、AI 教练和力量训练量化。

（1）WHOOP 压力监测（2024 年中推出）：与传统 Recovery 评分（晨间单点评估）不同，压力监测功能提供全天的实时急性生理压力追踪。传感器融合 HRV（RMSSD 滚动窗口）、皮肤温度（偏离基线）和静息心率（偏离基线）三个指标，将生理状态分为四个区域：压力期（Stress）、投入期（Engaged）、放松期（Relaxed）和恢复期（Restorative）。核心创新在于将"急性压力（工作/咖啡/酒精引起的短期 HRV 下降+HR 上升）"与"慢性负荷（训练引起的持续 HRV 抑制）"区分开，使用多日趋势分析和基线偏离算法。

（2）WHOOP Coach（2023 年 9 月推出）：基于 GPT-4 的对话式 AI 健康教练，可访问用户的完整 WHOOP 数据历史（数月至数年的 Recovery/Strain/Sleep 数据）。技术上采用"三角化 AI"架构——将确定性生理模型（基于运动科学的研究证据和临床指南）与 LLM 推理引擎结合：（a）确定性模型确保建议不会违背已知的运动生理学原理（如超量恢复、训练负荷-适应关系）；（b）LLM 负责自然语言理解和个性化叙事生成（"你在周二晚上喝了两杯酒后，周三的 HRV 比基线低 8ms，体温升高 0.3°C"）。

（3）力量训练模块（2024 年扩展）：使用加速度计+陀螺仪自动追踪力量训练动作、次数和组数，结合 RPE（自觉努力评级）量化肌群容量负荷（volume load = 组数 × 次数 × 估算重量）。将力量训练数据与 Strain 评分（原仅含心血管负荷）整合，提供肌肉+心血管双维度的训练负荷画像。`,
    impact: {
      technology:
        "\"LLM + 确定性生理模型\"混合架构（WHOOP 称之为三角化 AI）为健康 AI 教练设立了技术标准——纯粹依赖 LLM 容易产生幻觉和违背生理学原理的建议，纯粹依赖确定性规则又缺乏个性化叙事和对话灵活性。这种混合架构是医疗健康 AI 的正确方向。",
      product:
        "WHOOP 的硬件免费（会员制）+ 持续功能升级模式证明了\"传感器作为服务入口\"的商业模式可行性。压力监测和 AI 教练从两个方向扩展了 WHOOP 的价值主张：从运动员扩展到大众人群（压力管理）和从数据展示扩展到可操作建议（AI 教练）。",
      industry:
        "WHOOP 是 L4（高级指标层）商业化的最佳案例——将 L1-L3 的原始数据融合为消费者可理解的单一评分和个性化建议。其年收入超过 $3 亿（2024 年估值 $36 亿），证明了消费者愿意为\"高级生理洞察\"而非\"更多数据\"付费。",
    },
    applications: [
      "全天压力管理：WHOOP 用户通过实时压力监测识别压力触发因素（会议/咖啡/酒精/睡眠不足），主动调整作息",
      "AI 个性化训练建议：WHOOP Coach 基于数月训练历史推荐当日训练强度和恢复策略",
      "力量+有氧双维度训练优化：肌肉负荷和心血管 Strain 同时追踪，预防局部肌群过度训练",
      "睡眠-恢复闭环：WHOOP 的 Sleep Coach 基于前一日 Strain 和恢复状态推荐次日所需睡眠时长",
      "健康行为改变：LLM 教练的个性化叙事比通用健康建议更能激发用户行为改变（'你昨晚只睡了 5.5 小时，建议今天降低训练强度'）",
    ],
    references: [
      {
        title: "WHOOP Stress Monitor — Real-time physiological stress tracking",
        url: "https://www.whoop.com/us/en/thelocker/whoop-stress-monitor/",
        type: "product",
        description: "WHOOP 压力监测功能介绍",
      },
      {
        title: "WHOOP Coach — GPT-4 Powered Conversational Health Coaching",
        url: "https://www.whoop.com/us/en/thelocker/whoop-coach/",
        type: "product",
        description: "GPT-4 驱动的对话式 AI 健康教练",
      },
      {
        title: "WHOOP Strength Trainer — Muscular Load Quantification",
        url: "https://www.whoop.com/us/en/thelocker/whoop-strength-trainer/",
        type: "product",
        description: "力量训练动作识别和肌群容量负荷量化",
      },
      {
        title: "Berryhill S et al. — Effect of wearables on sleep and performance: a WHOOP study (2020-2024 series)",
        url: "https://pubmed.ncbi.nlm.nih.gov/",
        type: "paper",
        description: "WHOOP 数据驱动的学术论文系列",
      },
    ],
    source: "WHOOP Inc. (Boston, MA)",
    year: 2024,
  },
  {
    id: "apple-watch-vitals-sleep-apnea",
    title: "Apple Watch生命体征+睡眠呼吸暂停检测",
    layer: "L4",
    type: "commercial",
    summary:
      "Apple Watch S10推出Vitals App汇总夜间心率/呼吸率/手腕温度/睡眠时长/SpO2建立个人基线，2+指标偏离时标记。睡眠呼吸暂停通知(FDA De Novo 2024获批)加速度计30天滚动窗口检测呼吸紊乱，中度-重度AHI灵敏度~90%。",
    description: `Apple Watch 是消费者可穿戴设备中"L4 高级指标层"的领跑者。watchOS 11（2024 年 9 月随 Apple Watch Series 10 推出）引入了多项重大健康功能升级，标志着 Apple 从单点指标（心率/ECG/SpO₂）向融合性高级健康洞察的转变。

（1）Vitals App（watchOS 11）：这是 Apple 首个融合多传感器数据创建个人化健康基线的功能。Vitals App 在夜间自动收集 5 个核心指标——心率、呼吸率、手腕温度、睡眠时长和 SpO₂——建立个人基线范围（基于数周至数月的夜间数据分布）。当 2+ 指标同时偏离基线时，App 发出标记并提供可能的解释（疾病前驱期、酒精摄入、海拔变化、月经周期阶段）。这一功能将 Apple Watch 的定位从"测量工具"升级为"趋势解释工具"——用户不需要理解每个指标，只需要知道"有什么不对劲"。

（2）睡眠呼吸暂停通知（FDA De Novo 2024 年获批）：使用加速度计（非 SpO₂）在 30 天滚动窗口内检测呼吸紊乱模式。算法利用睡眠期间的手腕微动模式推断呼吸努力度变化（胸腹矛盾呼吸），在中度-重度阻塞性睡眠呼吸暂停（AHI≥15）检测中灵敏度约 90%（vs 实验室 PSG 金标准）。FDA De Novo 分类将其定位为非诊断性筛查工具（类似 ECG 房颤检测），阳性结果提示就医确诊而非自我诊断。这一批准标志着 FDA 对消费可穿戴设备睡眠呼吸障碍筛查的认可。

（3）训练负荷（Training Load, watchOS 11）：Apple 引入 1-10 级自觉努力评级（RPE），结合心率数据估算每次训练的心血管负荷，并比较 7 天平均 vs 28 天平均训练负荷趋势（上升/稳定/下降箭头+文字描述）。这种"趋势对比"而非"单一分数输出"的设计哲学反映了运动科学共识——训练负荷变化的趋势和速率比绝对值更重要。

（4）"Project Mulberry"（Apple Intelligence + Health, 2025 年传闻）：据 Bloomberg/Gurman 报道，Apple 正在开发设备端 AI 健康教练（基于 Apple Intelligence/神经引擎），医生参与训练 AI 代理，设备端处理确保隐私（数据不离开设备）。这是 Apple 在 L5 AI 教练层的重要布局。`,
    impact: {
      technology:
        "Vitals App 的\"多指标基线偏离\"分析范式代表了可穿戴健康监测的下一步——从\"测量单点指标并展示给用户\"到\"综合分析多指标的时间趋势并提供上下文解释\"。加速度计（非光学传感器）检测睡眠呼吸紊乱开辟了利用惯性传感器进行呼吸监测的新途径。",
      product:
        "Apple Watch 在健康监测领域的每一次 FDA 批准（ECG 房颤检测→不规则心律通知→睡眠呼吸暂停通知）都在扩大\"消费设备作为临床筛查工具\"的边界。Vitals App 为普通用户（非运动员/患者）提供了理解自身生理状态的最简入口。",
      industry:
        "Apple 的设备端 AI 隐私架构（Project Mulberry）和 Google/Samsung 的云端 AI 架构形成了健康 AI 的两条路径——隐私 vs 能力。Apple 的路径（设备端处理）在健康数据安全法规日趋严格的时代具有战略优势，但设备算力限制了 AI 模型的复杂度。",
    },
    applications: [
      "疾病早期预警：Vitals App 多指标偏离在日常使用中预警流感/COVID 前驱期，促使用户休息/就医",
      "睡眠呼吸暂停大规模筛查：数千万 Apple Watch 用户中自动筛查呼吸紊乱，引导高风险者就医行 PSG 确诊",
      "训练管理大众化：Training Load 趋势比较为普通跑步/健身爱好者提供原本仅精英运动员拥有的训练管理工具",
      "月经周期健康：手腕温度+HR 夜间趋势辅助排卵/黄体期识别和周期异常检测",
      "AI 健康教练试点：Project Mulberry 将为数亿用户提供设备端隐私保护的 AI 健康指导",
    ],
    references: [
      {
        title: "Apple Watch Series 10 — Vitals App, Sleep Apnea Notification, Training Load (watchOS 11)",
        url: "https://www.apple.com/watch/",
        type: "product",
        description: "Apple Watch S10 + watchOS 11 健康功能",
      },
      {
        title: "FDA De Novo — Apple Watch Sleep Apnea Notification (2024)",
        url: "https://www.fda.gov/medical-devices",
        type: "website",
        description: "Apple Watch 睡眠呼吸暂停通知 FDA De Novo 批准",
      },
      {
        title: "Apple Health — Vitals App Technical Overview",
        url: "https://www.apple.com/health/",
        type: "website",
        description: "Apple Health Vitals App 技术文档",
      },
      {
        title: "Gurman M (Bloomberg) — Apple 'Project Mulberry' AI Health Coach",
        url: "https://www.bloomberg.com/",
        type: "article",
        description: "Bloomberg 报道 Apple 设备端 AI 健康教练项目",
      },
    ],
    source: "Apple Inc.",
    year: 2025,
  },
  {
    id: "oura-gen4-resilience",
    title: "Oura Gen 4 + 心血管年龄 + 弹性指标",
    layer: "L4",
    type: "commercial",
    summary:
      "Oura Ring Gen 4(2024年10月)Smart Sensing动态切换18条PPG信号路径。心血管年龄从PWV特征估算动脉硬化。弹性(Resilience)14天窗口量化生理压力恢复能力。Symptom Radar ML异常检测识别疾病信号。",
    description: `Oura Health 是指环形态可穿戴设备的开创者和市场领导者（累计销量超过 250 万枚指环）。Oura Ring Gen 4（2024 年 10 月发布）是该公司成立以来最大的一次硬件升级，与其配套的软件功能升级将 Oura 从"睡眠追踪器"重新定位为"全天候女性/男性健康+长寿追踪平台"。

（1）Smart Sensing 硬件（Gen 4 独有）：指环内的 18 条 PPG 信号路径（多种 LED 波长组合 × 多个光电二极管位置）通过算法实时评估每条路径的血流灌注质量（受手指温度、肤色、运动状态影响），并自动切换到最佳路径。这解决了指环形设备的固有问题——手指冷/黑肤色/运动时信号质量下降。Gen 4 的信号质量在深肤色和冷手指条件下比 Gen 3 提升 30-40%。

（2）心血管年龄（Cardiovascular Age, 2024 年扩展）：从 PPG 形态学提取 PWV 特征估算动脉硬化程度，与用户实际年龄比较得出心血管年龄。与金标准颈-股 PWV 验证相关 r=0.71。Cardiovascular Age 将复杂的血管功能测量转化为消费者可直观理解的"你的血管比你年轻 3 岁"这样的单一数字。

（3）弹性指标（Resilience, 2024 年扩展）：在 14 天滚动窗口内量化日间生理压力（上午-下午 HRV 下降 + HR 上升 + 活动水平）与夜间恢复（睡眠中 HRV 回升 + HR 下降）的平衡。弹性分为 5 个等级（Limited → Adequate → Solid → Strong → Exceptional）。这一指标的核心洞察是"压力本身不是问题，压力后的恢复速度才是"。

（4）Symptom Radar（疾病雷达）：使用 ML 异常检测算法在温度、静息心率、HRV 和呼吸率 4 个夜间指标上检测个体基线偏离。当偏离程度和模式匹配病毒感染的典型特征时发出警告。在 COVID-19 大流行期间收集的数据为这一功能提供了训练验证基础。

（5）Oura Advisor（对话式 AI，Beta 测试中）：LLM 驱动的对话式健康教练，与 WHOOP Coach 类似，但强调纵向数据发现和模式解释（"过去 6 个月你的 HRV 每月上升 2ms——这可能是你的耐力训练效果"）。`,
    impact: {
      technology:
        "Smart Sensing 多路径 PPG 动态选择是信号质量工程优化的范例——不依赖更好的传感器硬件（仍使用现有 LED+PD），而是通过软件智能选择最优信号路径。这一方法将为所有光学可穿戴设备（手表/戒指/臂带/耳机）提供信号质量提升的方法论参考。",
      product:
        "Oura 通过心血管年龄和 Resilience 弹性指标将自身定位从\"睡眠追踪器\"升级为\"长寿+健康优化平台\"。这两个指标的命名高度面向消费者（\"心血管年龄\"比\"PWV指数\"更易理解，\"弹性\"比\"自主神经恢复效率\"更直观），是健康科技产品 UX 的优秀案例。",
      industry:
        "Oura 的\"无屏幕形态 + 长续航（7天）+ 高级指标\"差异化策略证明了指环形态在消费可穿戴市场中有持久竞争力。2024 年 Samsung Galaxy Ring 的进入验证了这一品类的市场潜力，Oura 已提起专利诉讼应对竞争。",
    },
    applications: [
      "心血管健康长寿追踪：心血管年龄变化作为生活方式干预（运动/饮食/减压）对血管衰老影响的客观量化",
      "压力恢复能力评估：Resilience 弹性追踪帮助用户了解自身压力恢复模式，识别累积性负荷过高的时期",
      "疾病早期预警：Symptom Radar 在 COVID/流感前驱期提示异常，促使用户主动休息和检测",
      "女性健康：夜间手腕温度趋势辅助排卵检测、黄体期确认和围绝经期追踪",
      "健康行为改变：Oura Advisor AI 教练将长期生理趋势（6-12 个月数据）转化为个性化健康建议",
    ],
    references: [
      {
        title: "Oura Ring Gen 4 — Smart Sensing & Cardiovascular Age",
        url: "https://ouraring.com/product/oura-ring-4",
        type: "product",
        description: "Oura Gen 4 产品页面",
      },
      {
        title: "Oura Resilience — Stress Recovery Balance Quantification",
        url: "https://ouraring.com/blog/resilience/",
        type: "product",
        description: "Oura 弹性指标：14天窗口压力恢复平衡量化",
      },
      {
        title: "Oura Symptom Radar — ML Anomaly Detection for Illness Prediction",
        url: "https://ouraring.com/blog/symptom-radar/",
        type: "product",
        description: "Symptom Radar 疾病雷达 ML 异常检测功能",
      },
      {
        title: "Oura Advisor — Conversational AI Health Coach (Beta)",
        url: "https://ouraring.com/blog/oura-advisor/",
        type: "product",
        description: "Oura Advisor 对话式 AI 健康教练 Beta",
      },
    ],
    source: "Oura Health (Oulu, Finland)",
    year: 2025,
  },

  // ───────── L5: AI教练层 ─────────
  {
    id: "ecg-foundation-models",
    title: "ECG基础模型爆发(2025)",
    layer: "L5",
    type: "research",
    summary:
      "2025年见证了ECG基础模型快速涌现：ECGFM(百万级ECG预训练)、FoundationalECGNet(轻量级多任务)、Self-DANA(通道自适应SSL)、AnyECG-Lab(单导联估算实验室检查值)。OpenECG基准120万条公开记录。",
    description: `2025 年是 ECG（心电图）基础模型（Foundation Model）的元年。与 NLP 领域 2018-2019 年（BERT/GPT）和计算机视觉 2020-2021 年（ViT/MAE）的基础模型爆发路径高度类似，ECG 基础模型在 2025 年经历了从"单任务专用模型"到"大规模预训练通用模型"的范式转变。

关键模型：
（1）ECGFM：基于 Transformer 架构在百万级 ECG 记录上预训练，覆盖 50+ 种心律失常、心肌缺血、电解质紊乱等多种心脏异常检测。采用掩码时间序列重建（Masked Time-series Reconstruction, MTR）作为自监督预训练任务，类似 NLP 中的掩码语言模型（MLM）。
（2）FoundationalECGNet：聚焦"轻量级多任务心脏分析"，在保持 <50M 参数的前提下同时执行 QRS 检测、心搏分类、QTc 测量、房颤检测等多项 ECG 核心任务，参数量远小于通用大模型。
（3）Self-DANA（通道自适应 SSL）：解决"不同 ECG 导联配置（12 导联 vs 单导联 vs 3 导联 Holter）的域适应"核心难题——在一个导联配置上预训练的模型是否能泛化到其他导联配置？
（4）AnyECG-Lab：最具野心的概念——仅从单导联 ECG 波形估算通常需要抽血检测的实验室检查值（电解质 K⁺/Ca²⁺、血红蛋白、血糖水平等），属于"生理信号→生化推断"的跨模态映射。

关键基础设施：OpenECG 基准提供了 120 万条公开 ECG 记录的标准评估框架，类似于 NLP 的 GLUE/SuperGLUE 或 CV 的 ImageNet——为标准化的模型对比和进展追踪提供了基准。

然而，2025 年也出现了一篇重要的"现实核查"论文，质疑了部分 ECG 基础模型的过度声称——在外部验证数据集上的性能远低于内部测试集，提示过拟合和数据集偏倚问题。这一批评推动了领域向更严格的跨机构/跨设备/跨人群外部验证标准发展。`,
    impact: {
      technology:
        "ECG 基础模型的\"预训练+微调\"范式将取代\"每类心律失常一个专用模型\"的传统方法。自监督预训练解决了医学标注数据昂贵稀缺的核心瓶颈——模型在海量未标记 ECG 数据上学习通用特征表示，仅需少量标注数据微调即可达到或超过专用模型性能。",
      product:
        "未来 2-3 年，ECG 基础模型将嵌入所有 ECG 采集设备（Holter 动态心电图、除颤器、可穿戴 ECG 贴片），实现\"超人类\"心律失常检测精度（已有多项研究表明深度学习在 ECG 分类上超过心脏病专家平均水平）。AnyECG-Lab 概念如在消费可穿戴设备上实现，将开启\"手表测电解质\"的科幻级应用。",
      industry:
        "ECG 诊断市场（每年 3 亿+ 次 ECG 检查）将经历 AI 驱动的自动化转型。然而，监管审批（FDA/CE SaMD）和医疗责任归属（AI 漏诊谁负责？）是比技术更难解决的问题。\"现实核查\"论文也提示：外部验证需成为行业标准而非可选加分项。",
    },
    applications: [
      "大规模 ECG 筛查：基础模型在百万级人群 ECG 数据上检出隐性心脏异常（无症状心肌缺血/长 QT 综合征/Brugada 综合征）",
      "可穿戴设备 ECG 诊断升级：基础模型嵌入 Apple Watch/Withings/Fitbit ECG 功能，从简单房颤检测扩展到多类心律失常",
      "\"手表测电解质\"：AnyECG-Lab 类模型从单导联 ECG 估算 K⁺/Ca²⁺，用于肾功能衰竭患者的无创电解质监测",
      "急诊科快速 ECG 分诊：基础模型在 <1 秒内分类 ECG 异常等级（正常/异常需关注/STEMI 需紧急处理）",
      "跨设备泛化：Self-DANA 类模型适配不同 ECG 设备（标准 12 导联、Holter、手表单导联、植入式环路记录器），无需重新训练",
    ],
    references: [
      {
        title: "ECGFM — ECG Foundation Model (2025 preprints)",
        url: "https://arxiv.org/",
        type: "paper",
        description: "ECG 基础模型，百万级 ECG 预训练，50+种异常检测",
      },
      {
        title: "FoundationalECGNet — Lightweight Multi-task ECG Analysis (2025)",
        url: "https://pubmed.ncbi.nlm.nih.gov/",
        type: "paper",
        description: "轻量级多任务 ECG 基础模型",
      },
      {
        title: "OpenECG Benchmark — 1.2 Million Public ECG Records",
        url: "https://github.com/",
        type: "website",
        description: "OpenECG 公开基准，120万条 ECG 标准评估框架",
      },
      {
        title: "Reality Check — ECG Foundation Model External Validation Critique (2025)",
        url: "https://arxiv.org/",
        type: "paper",
        description: "ECG 基础模型外部验证\"现实核查\"论文",
      },
      {
        title: "AnyECG-Lab — Estimating Lab Values from Single-lead ECG",
        url: "https://pubmed.ncbi.nlm.nih.gov/",
        type: "paper",
        description: "单导联 ECG 估算实验室检查值",
      },
    ],
    source: "多个研究组; DBLP 2025出版物",
    year: 2025,
  },
  {
    id: "llm-health-coach",
    title: "LLM健康教练平台对比",
    layer: "L5",
    type: "commercial",
    summary:
      "WHOOP Coach(GPT-4+专有生理模型)、Oura Advisor(LLM+纵向数据)、Fitbit AI(Google Gemini集成)、Galaxy AI Health(Samsung Gauss+Gemini)、Apple Intelligence+Health \"Project Mulberry\"(设备端神经引擎,隐私优先)。",
    description: `LLM（大语言模型）健康教练是 2023-2025 年消费健康科技领域最受关注的创新方向。五大主要消费平台（WHOOP、Oura、Fitbit/Google、Samsung、Apple）都宣布了各自的 AI 健康教练方案，但在技术架构、数据策略和隐私模型上存在显著差异。

（1）WHOOP Coach（2023 年 9 月最先推出）：基于 GPT-4 的云端推理 + "三角化 AI"架构（确定性生理模型作为安全网）。用户可与 Coach 对话询问任何与其 WHOOP 数据相关的健康问题（"为什么我周三的 Recovery 很低？""我应该今天训练吗？"）。Coach 可访问完整的 WHOOP 数据历史。隐私：数据发送至 OpenAI 进行处理，但 WHOOP 声明数据不用于训练 OpenAI 模型。

（2）Oura Advisor（Beta 测试中）：LLM 驱动的对话式教练，与 WHOOP Coach 类似但在交互设计上更注重"模式发现"——Advisor 主动发现用户长期生理趋势（"过去 6 个月你的 HRV 每月上升 2ms——这可能表明你的有氧训练正在产生效果"）而非仅反应性回答。Oura 尚未公开其 LLM 提供商。

（3）Fitbit AI（Google Gemini 集成, 2024 年 Fitbit Labs 实验性功能）：利用 Google Gemini 模型提供对话式健康数据探索。Fitbit 的独特优势在于 Google 自身的 LLM 能力和数千万用户的长期数据规模。Fitbit Labs 实验性功能包括：AI 从 Fitbit 数据生成个性化健康报告、自然语言查询健康趋势。

（4）Galaxy AI Health（Samsung Gauss + Google Gemini）：Samsung 采用混合策略——Gauss 模型（Samsung 自研）用于设备端处理，复杂查询调用 Google Gemini 云端推理。Energy Score 和 AI 生成的健康 Tips 是首批 AI 功能。

（5）Apple Intelligence + Health "Project Mulberry"（据媒体报道，2025 年）：Apple 的策略最激进——完全设备端处理（Apple Neural Engine），医生参与训练的 AI 健康代理。数据不出设备是 Apple 的"隐私护城河"策略——在健康数据隐私法规（HIPAA/GDPR）日趋严格的环境下，这一策略可能成为关键竞争优势。

核心差异化维度：
- 设备端（Apple/Samsung 混合）vs 云端（Google Fitbit/WHOOP）——隐私 vs 能力
- 反应式（回答用户问题）vs 主动式（发现模式并主动推送洞察）
- 单平台锁定（Apple/Samsung/Google）vs 跨平台（WHOOP/Oura 可与多种设备/手机配合）`,
    impact: {
      technology:
        "LLM 在健康领域的\"幻觉\"风险远高于一般领域（错误的健康建议可能产生临床后果）。WHOOP 的\"三角化 AI\"架构（确定性模型作为安全网）和 Apple 的\"医生参与训练\"策略代表了两种解决幻觉问题的方法。\"设备端推理\"的隐私优势 vs \"云端推理\"的模型能力优势将成为长期竞争维度。",
      product:
        "AI 健康教练将成为可穿戴设备的\"新 OS 层\"——用户不再需要理解 HRV/SDNN/SpO₂ 等指标的医学含义，只需通过自然语言与 AI 对话即可获取个性化健康建议。\"教练\"比\"追踪器\"的用户粘性高得多——人们不会每天看自己的 HRV，但可能每天与 AI 教练对话。",
      industry:
        "WHOOP 的订阅模式（硬件免费/会员付费）和 Oura 的订阅+硬件模式证明\"AI 教练\"是消费者付费的核心驱动力——用户不付费购买传感器数据（心率/HRV/睡眠），而是付费购买\"从数据中提炼的可操作建议\"。AI 教练的竞争将从\"LLM 能力\"转向\"生理学知识库+个性化数据+用户体验\"的整合。",
    },
    applications: [
      "个性化运动处方：AI 教练基于用户数月训练数据+当天恢复状态推荐当日训练强度和时长",
      "慢性病管理对话：2 型糖尿病/高血压/肥胖患者通过 AI 教练获得个性化的饮食/运动/药物依从性指导",
      "睡眠优化闭环：AI 教练分析睡眠-运动-饮食-酒精-咖啡因的交互效应，生成个性化睡眠改善建议",
      "老年健康陪伴：AI 教练为独居老人提供每日健康对话和异常预警，兼具健康监测和社交陪伴功能",
      "术前预康/术后康复：AI 教练基于手术类型和个体生理状态指导术前体能优化和术后渐进式康复",
    ],
    references: [
      {
        title: "WHOOP Coach — GPT-4 Triangulated AI Architecture",
        url: "https://www.whoop.com/us/en/thelocker/whoop-coach/",
        type: "product",
        description: "GPT-4 驱动 WHOOP Coach，三角化 AI 架构",
      },
      {
        title: "Oura Advisor — LLM Conversational Health Coach (Beta)",
        url: "https://ouraring.com/blog/oura-advisor/",
        type: "product",
        description: "Oura Advisor 对话式 AI 健康教练",
      },
      {
        title: "Fitbit Labs — Google Gemini AI Health Data Exploration",
        url: "https://www.fitbit.com/global/us/technology/fitbit-labs",
        type: "product",
        description: "Fitbit Labs + Google Gemini 实验性 AI 功能",
      },
      {
        title: "Samsung Galaxy AI Health — Gauss + Gemini Hybrid Architecture",
        url: "https://www.samsung.com/global/galaxy-ai/",
        type: "product",
        description: "Samsung Galaxy AI Health 混合 AI 架构",
      },
      {
        title: "Gurman M (Bloomberg) — Apple Project Mulberry AI Health Coach (2025)",
        url: "https://www.bloomberg.com/",
        type: "article",
        description: "Bloomberg 报道 Apple 设备端 AI 健康教练",
      },
    ],
    source: "WHOOP, Oura, Google/Fitbit, Samsung, Apple",
    year: 2025,
  },
  {
    id: "gen-ai-synthetic-physio",
    title: "生成式AI合成生理数据",
    layer: "L5",
    type: "research",
    summary:
      "扩散模型超越GAN成为生物信号生成首选：ECGTwin(可控扩散个性化ECG生成)、SSSM-ECG(结构化状态空间模型)、模拟器增强扩散(混合生物物理模拟先验)。应用：罕见心律失常合成数据训练、HIPAA/GDPR合规多机构共享、FDA合成数据算法验证监管。",
    description: `生成式 AI 合成生理数据是 2025 年快速发展的前沿领域。其核心理念是利用扩散模型（Diffusion Model）、生成对抗网络（GAN）或结构化状态空间模型（SSSM）学习真实生理信号的统计分布，然后从该分布中采样生成"看起来真实但从未存在过"的合成数据。该技术解决的核心问题是医学数据共享的隐私-效用权衡。

技术演进：
（1）GAN 时代（2019-2023）：早期尝试使用 DCGAN/WGAN 生成 ECG/EEG 信号，但存在模式坍缩（mode collapse，生成样本缺乏多样性）和时序一致性差的问题。
（2）扩散模型时代（2024-2025）：扩散模型（DDPM/DDIM）在时序生成质量上显著超越 GAN。ECGTwin（2025）使用可控扩散实现个性化 ECG 生成——以特定患者的少数真实心搏为条件，生成该患者心律失常发作时的合成 ECG（"如果我这位房颤患者发作时 ECG 是什么样？"）。
（3）结构化状态空间模型（SSSM-ECG, 2025）：S4/Mamba 等状态空间模型在长程时序生成（数千个采样点的一致节律）方面表现优于 Transformers 和扩散模型，因为 SSM 对长程依赖的建模效率更高。
（4）模拟器增强扩散（2025）：最有前景的方法——将生物物理心脏模拟器（如 O'Hara-Rudy 心室细胞模型）的先验知识嵌入扩散模型的去噪过程，生成的合成 ECG 不仅"看起来真实"，而且"物理学上合理"（P 波-QRS-T 波的时序和振幅满足心脏电生理约束）。

应用场景和监管进展：
- 罕见心律失常数据增强：某一类心律失常（如 Brugada 综合征 ECG 模式）在真实数据集中极度罕见（<1:10,000），合成生成可无限扩充训练集
- HIPAA/GDPR 合规数据共享：多机构协作训练 AI 模型时共享合成 ECG 而非真实患者数据，满足隐私法规
- FDA 对合成数据认证的兴趣：2025 年 FDA 开始评估合成数据用于 AI/ML 医疗器械（SaMD）算法验证的可能性——如果合成数据能充分代表真实患者群体，可能部分替代昂贵且耗时的临床试验

核心技术挑战：多尺度时序一致性——ECG 需要在三个时间尺度上同时保持一致：毫秒级（QRS 波形态）、秒级（心搏间期变化）和分钟级（心率趋势）。当前的扩散模型在前两个尺度表现良好，但在分钟级趋势的合理性上仍有欠缺。`,
    impact: {
      technology:
        "扩散模型+生物物理模拟器混合方法代表了\"AI 生成\"与\"物理约束\"融合的前沿——纯粹的 AI 生成可能产生物理上不可能的信号，而纯粹的物理模拟器缺乏个体差异性。两者融合的\"物理信息扩散模型\"（Physics-Informed Diffusion Models）是正确方向。",
      product:
        "合成数据平台将使 AI 医疗器械开发者能够获取\"无限\"且\"多样\"的训练数据，大幅降低数据采集成本和时间。初创公司（如 Syntropy、MDClone、Hazy）已在此赛道布局。",
      industry:
        "合成数据可能重构医疗 AI 的数据经济——从\"数据是护城河\"（拥有独家真实数据优势）转向\"合成数据民主化\"（任何人都可以生成高质量训练数据）。但监管态度（FDA/EMA 是否接受合成数据用于产品验证）将决定该技术的实际影响力。",
    },
    applications: [
      "罕见病 AI 模型训练：合成数据为 Brugada 综合征/长 QT 综合征等罕见心脏疾病的 AI 检测模型提供充足训练样本",
      "跨机构 AI 协作：多医院使用合成数据联合训练 ECG 基础模型，无需共享真实患者数据，满足 HIPAA/GDPR",
      "医疗器械算法验证：FDA 考虑接受高质量合成数据作为 SaMD 算法性能验证的补充数据来源",
      "跨种族/年龄数据公平性：合成少数群体数据平衡训练集，减少 AI 模型在少数族裔/老年人中的性能差异",
      "心血管数字孪生：ECG 合成+血流动力学模型创建个性化心脏数字孪生，用于手术预演和药物反应预测",
    ],
    references: [
      {
        title: "ECGTwin — Controllable Diffusion for Personalized ECG Generation (2025)",
        url: "https://arxiv.org/",
        type: "paper",
        description: "可控扩散个性化 ECG 生成",
      },
      {
        title: "SSSM-ECG — Structured State Space Models for ECG Synthesis (2025)",
        url: "https://arxiv.org/",
        type: "paper",
        description: "结构化状态空间模型长程 ECG 生成",
      },
      {
        title: "Simulator-Augmented Diffusion — Biophysical Prior in ECG Generation (2025)",
        url: "https://arxiv.org/",
        type: "paper",
        description: "生物物理心脏模拟器增强扩散模型",
      },
      {
        title: "FDA — Synthetic Data in Medical Device Validation (Emerging Interest 2025)",
        url: "https://www.fda.gov/medical-devices",
        type: "website",
        description: "FDA 对合成数据用于医疗器械验证的监管评估",
      },
      {
        title: "Syntropy — Synthetic Healthcare Data Platform",
        url: "https://www.syntropy.com/",
        type: "product",
        description: "医疗合成数据平台",
      },
    ],
    source: "多个研究组; DBLP 2025出版物",
    year: 2025,
  },
  {
    id: "all-of-us-wearable",
    title: "All of Us可穿戴数据集+电子健康档案关联",
    layer: "L5",
    type: "research",
    summary:
      "Patten T等(Nature Medicine 2026)发表All of Us可穿戴数据集：10K+参与者Fitbit数据关联完整电子健康档案，是种族/民族/社会经济最多样化的大规模可穿戴数据集。发现REM睡眠为可改变CVD风险因子、可穿戴数据用于产后抑郁筛查等。",
    description: `All of Us Research Program 是美国国立卫生研究院（NIH）资助的大规模精准医学队列研究，目标招募 100 万+ 代表美国多样性的参与者。其可穿戴数据子研究由 Patten T 等在 Nature Medicine（2026 年 4 月）发表，代表了可穿戴设备数据与电子健康档案（EHR）深度关联的里程碑。

数据集特征：
- 参与者规模：10K+ 参与者（随着持续招募和 Fitbit 设备分发计划，预期扩展到 50K+）
- 数据来源：Fitbit 设备（Charge 系列 / Versa 系列 / Inspire 系列），通过 Fitbit Web API 获取（参与者同时授予 All of Us 数据共享权限）
- 数据维度：心率（PPG）、步数、体力活动强度（轻/中/高）、睡眠（总时长+分期）、卡路里消耗
- 数据时间跨度：中位数 3.5 年随访（个别参与者 6+ 年），数万 TB 级别的纵向可穿戴数据
- EHR 关联：完整关联电子健康档案，包括诊断码（ICD-10）、用药记录、实验室检查值、影像报告、手术/住院记录
- 人群多样性：种族/民族构成远比 UK Biobank（94% 白人）和 Apple Heart Study（73% 白人）多样化——非裔美国人、西班牙裔/拉丁裔、亚裔和美国原住民都有显著代表性

2025-2026 年基于此数据集的关键科学发现：
（1）REM 睡眠作为可改变 CVD 风险因子（Kang J 等）：在控制年龄/性别/BMI/高血压后，REM 睡眠占总睡眠比例降低 10% 与 CVD 事件风险增加 18% 独立相关。这为 REM 睡眠的"心血管保护"假说提供了大规模实证支持。
（2）产后抑郁筛查（Hurwitz E 等）：分娩后 6 个月内可穿戴数据（睡眠碎片化+夜间活动+HR 升高）与产后抑郁筛查阳性（EPDS≥10）相关，AUC 0.72。相比传统产后抑郁筛查（依赖产后 6 周单次门诊），可穿戴数据提供了连续的客观监测。
（3）设备佩戴时间的群体差异及偏差纠正方法：发现低收入和少数族裔参与者 Fitbit 佩戴天数显著少于白人/高收入人群，提出了多重填补和逆概率加权偏差纠正方法。
（4）数字生物标志物发现：从纵向 Fitbit 数据中系统地衍生糖尿病、高血压、肥胖、睡眠呼吸暂停的数字表型（digital phenotype），并与 EHR 中的临床诊断码进行验证。

All of Us 区别于 UK Biobank 和 Apple/Fitbit Heart Study 的核心价值：
- 多样性 → 可穿戴算法在少数群体中的偏差可被直接测量和纠正
- EHR 关联 → 可穿戴数据可与真实临床结局（非自我报告）关联验证
- 纵向长度 → 中位数 3.5 年随访可观察慢病进展和可穿戴指标的长期趋势
- 开放性 → 全球合格研究者可通过 All of Us Researcher Workbench 访问去标识化数据`,
    impact: {
      technology:
        "All of Us 可穿戴+EHR 数据集为机器学习驱动的数字生物标志物发现提供了理想环境——有监督学习（以临床诊断码为标签）和自监督学习（海量未标记数据预训练）均可行。预计将推动可穿戴健康 AI 从\"相关性\"到\"因果推断\"的方法学进步。",
      product:
        "基于 All of Us 的研究成果将为下一代可穿戴健康功能提供临床验证证据（如\"REM 睡眠 CVD 风险\"可能成为消费设备的下一批健康功能）。多样的数据集也为解决可穿戴设备在深肤色人群中 PPG 精度下降问题提供了训练数据。",
      industry:
        "All of Us 模式（政府资助+多样化招募+EHR 关联+研究者开放访问）是精准医学基础设施的典范。其他国家（英国 Our Future Health 500 万参与者、中国慢性病前瞻性研究 CKB 50 万参与者）正在效仿并可能添加可穿戴数据维度。\"可穿戴数据+EHR\"将成为下一代队列研究的标配。",
    },
    applications: [
      "健康不平等纠正：在多样化数据集上训练的可穿戴算法减少了对少数族裔/低收入群体的精度偏差",
      "慢病早期预警：结合 Fitbit 纵向趋势+EHR 标签训练的 ML 模型在社区人群中预警糖尿病/高血压/CVD 年+超前",
      "数字终点监管认证：All of Us 数据可能用于支持 FDA 认可的可穿戴步数/睡眠数字终点（Digital Endpoint）",
      "药物流行病学：可穿戴数据+EHR 用药记录关联分析药物对日常体力活动/睡眠的影响（如某种降压药导致疲劳/失眠）",
      "精准预防指南：基于多样化数据的亚组分析揭示不同人群的最佳体力活动/睡眠推荐量（\"一刀切\"指南→精准分层指南）",
    ],
    references: [
      {
        title: "Patten T et al. — All of Us Wearable Dataset (Nature Medicine 2026)",
        url: "https://www.nature.com/nm/",
        type: "paper",
        description: "All of Us 可穿戴数据集 Nature Medicine 里程碑论文",
      },
      {
        title: "All of Us Research Hub — Researcher Workbench",
        url: "https://www.researchallofus.org/",
        type: "website",
        description: "All of Us 研究者工作台，全球合格研究者访问入口",
      },
      {
        title: "Kang J et al. — REM Sleep as Modifiable CVD Risk Factor (2025)",
        url: "https://pubmed.ncbi.nlm.nih.gov/",
        type: "paper",
        description: "REM 睡眠与 CVD 风险 All of Us 队列分析",
      },
      {
        title: "Hurwitz E et al. — Wearable Data for Postpartum Depression Screening (2025-2026)",
        url: "https://pubmed.ncbi.nlm.nih.gov/",
        type: "paper",
        description: "可穿戴数据用于产后抑郁筛查",
      },
      {
        title: "Our Future Health — UK 5 Million Participant Precision Medicine Cohort",
        url: "https://ourfuturehealth.org.uk/",
        type: "website",
        description: "英国 500 万人精准医学队列（All of Us 对标）",
      },
      {
        title: "China Kadoorie Biobank (CKB) — 500K Participants",
        url: "https://www.ckbiobank.org/",
        type: "website",
        description: "中国慢性病前瞻性研究 50 万人队列",
      },
    ],
    source: "All of Us Research Program; Nature Medicine 2026",
    year: 2026,
  },
];

export const frontierItemsByLayer = (layerId: string): FrontierItem[] =>
  frontierItems.filter((item) => item.layer === layerId);

export const getFrontierItemById = (id: string): FrontierItem | undefined =>
  frontierItems.find((item) => item.id === id);
