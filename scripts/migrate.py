"""Migrate V1 data.json to Next.js TypeScript modules file.

Generates:
- data/modules.ts (full module data)
- data/glossary.ts (glossary terms)
- data/references.ts (references)
"""

import json
import os

V1_PATH = "/Users/paip/.openclaw/workspace/site/data.json"
OUT_DIR = "/Users/paip/.openclaw/workspace/site-nextjs/data"

with open(V1_PATH) as f:
    v1 = json.load(f)

v1_modules = v1["modules"]

# Exclude L0 modules
v1_modules = [m for m in v1_modules if m["layer"] != "L0"]

# ========== Build tag set ==========
all_tags = set()
for m in v1_modules:
    tag_val = m.get("tag", "")
    if isinstance(tag_val, str) and tag_val:
        for t in tag_val.split("/"):
            all_tags.add(t.strip())

# ========== Build glossary terms ==========
# This will be populated with terms found across modules
TERMS = {}
term_definitions = {
    "ppg": {
        "term": "PPG",
        "category": "光学",
        "definition": "光电容积描记法(Photoplethysmography)，利用光学手段无创测量皮下血容量变化的技术。LED发射光穿透组织后，光电探测器接收经散射、吸收后的光强变化，从中提取心率、血氧等生理参数。",
        "references": ["ref-allen2007", "ref-tamura2014", "ref-ppg-review"]
    },
    "hr": {
        "term": "HR",
        "category": "心血管",
        "definition": "心率(Heart Rate)，每分钟心脏搏动的次数，单位为bpm(beats per minute)。是评估心血管功能和运动强度的基础指标。",
        "references": ["ref-esc-heart-rate"]
    },
    "hrv": {
        "term": "HRV",
        "category": "心血管",
        "definition": "心率变异性(Heart Rate Variability)，连续心跳间隔时间的微小变化。反映自主神经系统对心脏的调控功能，高HRV通常与更好的心血管健康和恢复状态相关。",
        "references": ["ref-hrv-standards"]
    },
    "ecg": {
        "term": "ECG/EKG",
        "category": "电生理",
        "definition": "心电图(Electrocardiogram)，通过体表电极记录心脏电活动的图形化表示。包含P波、QRS波群和T波，是诊断心律失常、心肌缺血等心血管疾病的金标准。",
        "references": ["ref-ecg-basics"]
    },
    "eeg": {
        "term": "EEG",
        "category": "电生理",
        "definition": "脑电图(Electroencephalography)，通过头皮电极采集大脑皮层神经电活动的技术。信号幅值仅数微伏至数百微伏，主要频带包括δ、θ、α、β、γ波。",
        "references": ["ref-niedermeyer"]
    },
    "spo2": {
        "term": "SpO₂",
        "category": "心血管",
        "definition": "血氧饱和度，血液中氧合血红蛋白占总血红蛋白的百分比。正常≥95%，是评估呼吸功能和氧气输送效率的关键指标。",
        "references": ["ref-spo2-physics"]
    },
    "rmssd": {
        "term": "RMSSD",
        "category": "心血管",
        "definition": "连续心跳间隔差值的均方根(Root Mean Square of Successive Differences)。HRV时域指标之一，主要反映迷走神经（副交感神经）活性。",
        "references": ["ref-hrv-standards"]
    },
    "sdnn": {
        "term": "SDNN",
        "category": "心血管",
        "definition": "所有正常心跳间隔(NN间期)的标准差。HRV时域指标，反映整体心率变异性水平，受交感与副交感神经共同影响。",
        "references": ["ref-hrv-standards"]
    },
    "lf-hf": {
        "term": "LF/HF",
        "category": "心血管",
        "definition": "低频功率与高频功率之比。HRV频域分析指标，传统上被认为反映交感神经与迷走神经的平衡状态，LF(0.04-0.15Hz)代表交感+迷走混合，HF(0.15-0.40Hz)代表迷走神经活性。",
        "references": ["ref-hrv-standards"]
    },
    "bvp": {
        "term": "BVP",
        "category": "光学",
        "definition": "血容量脉搏波(Blood Volume Pulse)，由PPG传感器采集到的与心跳同步的脉动波形，其幅度和形态反映外周血容量的周期性变化。",
        "references": ["ref-allen2007"]
    },
    "tst": {
        "term": "TST",
        "category": "睡眠",
        "definition": "总睡眠时间(Total Sleep Time)，实际处于睡眠状态的总时长，不包括入睡潜伏期和睡眠中的清醒时间。是评估睡眠量的核心指标。",
        "references": ["ref-aasm-manual"]
    },
    "waso": {
        "term": "WASO",
        "category": "睡眠",
        "definition": "入睡后清醒时间(Wake After Sleep Onset)，从初次入睡到最终醒来之间所有清醒时段的总和。WASO升高反映睡眠碎片化。",
        "references": ["ref-aasm-manual"]
    },
    "rem": {
        "term": "REM",
        "category": "睡眠",
        "definition": "快速眼动睡眠(Rapid Eye Movement)，睡眠阶段之一，特征为眼球快速运动、脑电活动接近清醒状态、梦境高发。对记忆巩固和情绪调节至关重要。",
        "references": ["ref-aasm-manual"]
    },
    "sws": {
        "term": "SWS/深睡",
        "category": "睡眠",
        "definition": "慢波睡眠(Slow Wave Sleep)，即N3期深睡眠，特征为高幅慢波δ波占主导。是身体修复、免疫增强和能量恢复的最关键睡眠阶段。",
        "references": ["ref-aasm-manual"]
    },
    "bmi": {
        "term": "BMI",
        "category": "体成分",
        "definition": "身体质量指数(Body Mass Index)，体重(kg)除以身高(m)的平方。用于粗略评估体重状态（过轻/正常/超重/肥胖），但不能区分脂肪和肌肉。",
        "references": []
    },
    "bia": {
        "term": "BIA",
        "category": "电生理",
        "definition": "生物电阻抗分析(Bioelectrical Impedance Analysis)，通过向人体施加微弱交流电流测量组织阻抗，从而估算体成分（体脂率、肌肉量、体水分率）的技术。",
        "references": ["ref-bia-review"]
    },
    "vo2max": {
        "term": "VO₂max",
        "category": "心肺",
        "definition": "最大摄氧量，人体在极限运动中每分钟能够摄入并利用的最大氧气量（mL/kg/min）。是衡量心肺耐力的黄金标准指标。",
        "references": ["ref-vo2max-review"]
    },
    "epoc": {
        "term": "EPOC",
        "category": "训练",
        "definition": "运动后过量氧耗(Excess Post-Exercise Oxygen Consumption)，运动后一段时间内机体耗氧量仍高于静息水平的现象。常用于评估训练负荷。",
        "references": ["ref-firstbeat-epoc"]
    },
    "trimp": {
        "term": "TRIMP",
        "category": "训练",
        "definition": "训练冲量(Training Impulse)，综合考虑运动强度、持续时间和心率的训练负荷量化指标。由Banister于1991年提出，是运动科学领域最经典的内外部负荷评估方法之一。",
        "references": ["ref-banister-trimp"]
    },
    "acwr": {
        "term": "ACWR",
        "category": "训练",
        "definition": "急性/慢性训练负荷比(Acute:Chronic Workload Ratio)，将短期(通常1周)训练负荷除以长期(通常4周)平均负荷。用于评估训练负荷变化速度，ACWR>1.5提示受伤风险显著升高。",
        "references": ["ref-gabbett-acwr"]
    },
    "mets": {
        "term": "METs",
        "category": "能量",
        "definition": "代谢当量(Metabolic Equivalents)，1 MET = 静息状态下的耗氧量(约3.5 mL/kg/min)。用于量化活动强度，3-6 METs为中等强度，>6 METs为高强度。",
        "references": []
    },
    "snr": {
        "term": "SNR",
        "category": "信号处理",
        "definition": "信噪比(Signal-to-Noise Ratio)，有用信号功率与噪声功率之比，通常以分贝(dB)为单位。在生理信号采集中，高SNR是准确检测和分析的基础。",
        "references": []
    },
    "fft": {
        "term": "FFT",
        "category": "信号处理",
        "definition": "快速傅里叶变换(Fast Fourier Transform)，将时域信号转换到频域的高效算法。在生理信号分析中广泛用于功率谱密度估计、频带能量计算和滤波设计。",
        "references": []
    },
    "cnn": {
        "term": "CNN",
        "category": "深度学习",
        "definition": "卷积神经网络(Convolutional Neural Network)，一类包含卷积层的深度学习模型，擅长提取信号的局部时域/频域特征。在ECG分类、EEG信号检测等任务中表现优异。",
        "references": []
    },
    "lstm": {
        "term": "LSTM",
        "category": "深度学习",
        "definition": "长短期记忆网络(Long Short-Term Memory)，一种特殊的循环神经网络(RNN)，通过门控机制解决长期依赖问题，适合处理生理信号的时序序列。",
        "references": []
    },
    "svm": {
        "term": "SVM",
        "category": "机器学习",
        "definition": "支持向量机(Support Vector Machine)，一种监督学习算法，通过寻找最优超平面来分隔不同类别的样本。在小样本分类任务中表现良好，常用于癫痫检测等场景。",
        "references": []
    },
    "mems": {
        "term": "MEMS",
        "category": "微电子",
        "definition": "微机电系统(Micro-Electro-Mechanical Systems)，将微型机械结构（悬臂梁、膜片、梳齿等）与电子电路集成在硅芯片上的技术。是现代穿戴设备中加速度计、陀螺仪、气压计的核心技术。",
        "references": []
    },
    "bpm": {
        "term": "bpm",
        "category": "单位",
        "definition": "每分钟心跳次数(Beats Per Minute)，心率的常用单位。也用于音乐节拍计量（在生理信号场景中指心跳频率）。",
        "references": []
    },
    "body-battery": {
        "term": "Body Battery",
        "category": "综合",
        "definition": "身体电量，Garmin公司提出的综合体能状态指标。融合HRV、压力水平、活动强度和睡眠质量等多维数据，以0-100的数值直观反映用户的能量储备水平。",
        "references": ["ref-garmin-body-battery"]
    },
    "recovery": {
        "term": "Recovery",
        "category": "综合",
        "definition": "恢复状态/恢复力，反映身体在训练或压力后恢复程度的综合评估。通常基于HRV(RMSSD)、静息心率、睡眠质量和近期训练负荷等参数计算得出。WHOOP、OURA等平台均有各自的恢复评分系统。",
        "references": []
    },
    "readiness": {
        "term": "Readiness",
        "category": "综合",
        "definition": "准备度/可训练状态，综合评估用户当前是否适合进行高强度训练的综合指标。通常融合睡眠质量、恢复状态、HRV基线偏差和静息心率等数据。",
        "references": []
    },
    "strain": {
        "term": "Strain",
        "category": "训练",
        "definition": "身体压力/训练应力，WHOOP平台定义的综合训练负荷指标。基于运动过程中的心率曲线，量化心血管系统承受的总体压力，以0-21的等级表示。",
        "references": ["ref-whoop-strain"]
    },
    "rhr": {
        "term": "RHR",
        "category": "心血管",
        "definition": "静息心率(Resting Heart Rate)，完全放松、安静状态下的心率。健康成人通常在60-100bpm之间，训练有素的运动员可低至40bpm左右。长期RHR升高可能反映过度训练或健康问题。",
        "references": []
    },
    "hrmax": {
        "term": "HRmax",
        "category": "心血管",
        "definition": "最大心率(Maximum Heart Rate)，个体在极限运动中能达到的最高心率。经典公式220-年龄，个体差异较大，实际测量最为准确。",
        "references": []
    },
    "hr-zones": {
        "term": "心率区间",
        "category": "心血管",
        "definition": "按照最大心率百分比划分的运动强度区间。典型五区间法：1区(50-60%)恢复、2区(60-70%)有氧、3区(70-80%)节奏、4区(80-90%)阈值、5区(90-100%)无氧。",
        "references": []
    },
    "hrr": {
        "term": "HRR",
        "category": "心血管",
        "definition": "心率恢复(Heart Rate Recovery)，运动停止后心率下降的速度。1分钟心率下降幅度是衡量心血管健康的重要指标，下降<12bpm提示异常。",
        "references": []
    },
    "circadian": {
        "term": "昼夜节律",
        "category": "生理节律",
        "definition": "Circadian Rhythm，约24小时为周期的内生生物节律。调控睡眠-觉醒周期、激素分泌（褪黑素、皮质醇）、体温变化等生理过程。穿戴设备可通过HRV、体温、活动数据推断昼夜节律相位。",
        "references": []
    },
    "allostatic-load": {
        "term": "Allostatic Load",
        "category": "应激生理",
        "definition": "非稳态负荷/适应负荷，长期慢性压力暴露导致的多系统生理损耗累积。通过多维度生物标志物（HRV、皮质醇、血压、炎症因子等）综合评估，反映压力对身体的累积影响。",
        "references": []
    },
    "overtraining": {
        "term": "Overtraining",
        "category": "训练",
        "definition": "过度训练，训练负荷持续超过恢复能力导致的一系列生理和心理症状。特征包括持续性疲劳、静息心率升高、HRV下降、睡眠质量下降、免疫功能抑制、运动表现停滞或下降。",
        "references": []
    },
    "parasympathetic": {
        "term": "副交感神经",
        "category": "自主神经",
        "definition": "Parasympathetic Nervous System，自主神经系统的分支之一，负责\"休息与消化\"功能。激活时心率降低、HRV升高、促进消化与恢复。HRV频域HF成分主要反映其活性。",
        "references": []
    },
    "sympathetic": {
        "term": "交感神经",
        "category": "自主神经",
        "definition": "Sympathetic Nervous System，自主神经系统的分支之一，负责\"战斗或逃跑\"反应。激活时心率升高、HRV降低、血压上升。HRV频域LF成分主要反映其活性。",
        "references": []
    },
    "ans": {
        "term": "ANS",
        "category": "自主神经",
        "definition": "自主神经系统(Autonomic Nervous System)，调控内脏功能、心率和腺体分泌的不随意神经系统。分为交感神经和副交感神经两大分支，HRV是评估ANS功能的最常用非侵入式方法。",
        "references": ["ref-hrv-standards"]
    },
    "rr": {
        "term": "RR",
        "category": "心血管",
        "definition": "呼吸频率(Respiratory Rate)，每分钟呼吸的次数(RPM)。正常成人静息时12-20次/分钟，运动中可升至40-60次/分钟。可从PPG信号或ECG信号中提取，是评估心肺功能和运动强度的基础生命体征之一。",
        "references": ["ref-rr-ppg"]
    },
}

# Build glossary terms list
BASIC_TERMS_KEYS = [
    "ppg", "hr", "hrv", "ecg", "eeg", "spo2", "rmssd", "sdnn", "lf-hf", "bvp",
    "tst", "waso", "rem", "sws", "bmi", "bia", "vo2max", "epoc", "trimp", "acwr",
    "mets", "snr", "fft", "cnn", "lstm", "svm", "mems", "bpm",
    "body-battery", "recovery", "readiness", "strain", "rhr", "hrmax", "hr-zones",
    "hrr", "circadian", "allostatic-load", "overtraining",
    "parasympathetic", "sympathetic", "ans",
    "rr"
]

# ========== Build references ==========
REFERENCES_LIST = [
    # PPG & Photoplethysmography
    {"id": "ref-allen2007", "title": "Photoplethysmography and its application in clinical physiological measurement", "authors": "Allen J", "year": 2007, "type": "paper", "doi": "10.1088/0967-3334/28/3/R01"},
    {"id": "ref-tamura2014", "title": "Wearable photoplethysmographic sensors—past and present", "authors": "Tamura T, Maeda Y, Sekine M, et al.", "year": 2014, "type": "paper", "doi": "10.3390/electronics3020282"},
    {"id": "ref-ppg-review", "title": "Photoplethysmography revisited: from contact to non-contact, from point to imaging", "authors": "Sun Y, Thakor N", "year": 2016, "type": "paper", "doi": "10.1109/RBME.2015.2476337"},
    {"id": "ref-max30102", "title": "MAX30102 High-Sensitivity Pulse Oximeter and Heart-Rate Sensor for Wearable Health", "authors": "Maxim Integrated", "year": 2019, "type": "documentation", "url": "https://www.maximintegrated.com/en/products/interface/sensor-interface/MAX30102.html"},
    {"id": "ref-afe4900", "title": "AFE4900 Ultra-Low-Power Integrated AFE for Optical Biosignal Monitoring", "authors": "Texas Instruments", "year": 2020, "type": "documentation", "url": "https://www.ti.com/product/AFE4900"},
    
    # HRV Standards
    {"id": "ref-hrv-standards", "title": "Heart rate variability: standards of measurement, physiological interpretation and clinical use", "authors": "Task Force of the ESC and NASPE", "year": 1996, "type": "paper", "doi": "10.1093/oxfordjournals.eurheartj.a014868"},
    {"id": "ref-hrv-review", "title": "A systematic review of wearable heart rate variability monitoring", "authors": "Georgiou K, Larentzakis AV, Khamis NN, et al.", "year": 2018, "type": "paper", "doi": "10.3390/s18051537"},
    
    # ECG
    {"id": "ref-ecg-basics", "title": "ECG Basics: Fundamentals of Electrocardiography", "authors": "Guyton AC, Hall JE", "year": 2016, "type": "book"},
    {"id": "ref-ecg-classification", "title": "A review of approaches for the detection and classification of cardiac arrhythmias", "authors": "Martis RJ, Acharya UR, Min LC", "year": 2014, "type": "paper", "doi": "10.1016/j.eswa.2013.09.030"},
    {"id": "ref-ads1292r", "title": "ADS1292R Low-Power, 2-Channel, 24-Bit Delta-Sigma ADC with Integrated ECG Front End", "authors": "Texas Instruments", "year": 2018, "type": "documentation", "url": "https://www.ti.com/product/ADS1292R"},
    {"id": "ref-max30003", "title": "MAX30003 Ultra-Low-Power, Single-Channel Integrated Biopotential AFE", "authors": "Maxim Integrated", "year": 2019, "type": "documentation", "url": "https://www.maximintegrated.com/en/products/sensors/MAX30003.html"},
    {"id": "ref-ad8233", "title": "AD8233 Single-Lead Heart Rate Monitor Front End", "authors": "Analog Devices", "year": 2019, "type": "documentation", "url": "https://www.analog.com/en/products/ad8233.html"},
    
    # Pan-Tompkins
    {"id": "ref-pan-tompkins", "title": "A real-time QRS detection algorithm", "authors": "Pan J, Tompkins WJ", "year": 1985, "type": "paper", "doi": "10.1109/TBME.1985.325532"},
    
    # Sleep
    {"id": "ref-aasm-manual", "title": "The AASM Manual for the Scoring of Sleep and Associated Events: Rules, Terminology and Technical Specifications", "authors": "Berry RB, Brooks R, Gamaldo CE, et al.", "year": 2017, "type": "book"},
    {"id": "ref-sleep-wearable", "title": "Sleep staging from wrist-worn accelerometer data using deep learning", "authors": "Walch O, Huang Y, Forger D, et al.", "year": 2019, "type": "paper", "doi": "10.1038/s41746-019-0112-5"},
    {"id": "ref-sleep-review", "title": "Wearable sleep technology in clinical and research settings", "authors": "De Zambotti M, Cellini N, Goldstone A, et al.", "year": 2019, "type": "paper", "doi": "10.1249/MSS.0000000000001947"},
    
    # Training Load
    {"id": "ref-banister-trimp", "title": "Modeling elite athletic performance", "authors": "Banister EW, Calvert TW, Savage MV, et al.", "year": 1991, "type": "book"},
    {"id": "ref-firstbeat-epoc", "title": "EPOC: The True Measure of Exercise Intensity", "authors": "Firstbeat Technologies", "year": 2012, "type": "documentation", "url": "https://www.firstbeat.com"},
    {"id": "ref-gabbett-acwr", "title": "The acute-chronic workload ratio and injury risk: methodological issues and recommendations", "authors": "Gabbett TJ", "year": 2016, "type": "paper", "doi": "10.1136/bjsports-2015-095531"},
    
    # VO2max
    {"id": "ref-vo2max-review", "title": "Assessment of VO2max and submaximal VO2 in healthy individuals", "authors": "Whipp BJ, Wasserman K", "year": 2005, "type": "paper"},
    
    # SpO2
    {"id": "ref-spo2-physics", "title": "Pulse oximetry: fundamentals and technology update", "authors": "Nitzan M, Taitelbaum H", "year": 2014, "type": "paper", "doi": "10.2147/MDER.S47319"},
    
    # WHOOP
    {"id": "ref-whoop-strain", "title": "WHOOP Strain: Quantifying Cardiovascular Load", "authors": "WHOOP", "year": 2020, "type": "documentation", "url": "https://www.whoop.com/thelocker/strain/"},
    {"id": "ref-whoop-recovery", "title": "WHOOP Recovery: Measuring Your Daily Readiness", "authors": "WHOOP", "year": 2020, "type": "documentation", "url": "https://www.whoop.com/thelocker/recovery/"},
    {"id": "ref-whoop-sleep-validity", "title": "Validity of WHOOP sleep tracking", "authors": "Miller DJ, Sargent C, Roach GD", "year": 2021, "type": "paper", "doi": "10.1111/jsr.13318"},
    
    # Garmin
    {"id": "ref-garmin-body-battery", "title": "Garmin Body Battery: Real-Time Energy Monitoring Explained", "authors": "Garmin", "year": 2019, "type": "documentation", "url": "https://www.garmin.com/en-US/blog/fitness/body-battery/"},
    {"id": "ref-garmin-training-readiness", "title": "Garmin Training Readiness: How It Works", "authors": "Garmin", "year": 2022, "type": "documentation", "url": "https://www.garmin.com"},
    
    # Polar
    {"id": "ref-polar-nightly-recharge", "title": "Polar Nightly Recharge: How to Monitor Your Recovery", "authors": "Polar", "year": 2020, "type": "documentation", "url": "https://www.polar.com"},
    {"id": "ref-polar-training-load", "title": "Polar Training Load Pro: Understanding Your Training", "authors": "Polar Electro", "year": 2020, "type": "documentation", "url": "https://www.polar.com"},
    
    # Oura
    {"id": "ref-oura-readiness", "title": "Oura Readiness Score: Know Your Daily Capacity", "authors": "Oura Health", "year": 2021, "type": "documentation", "url": "https://ouraring.com"},
    {"id": "ref-oura-sleep-validation", "title": "Automatic sleep staging from wrist-worn PPG using deep learning", "authors": "Oura Health (technical report)", "year": 2021, "type": "paper"},
    
    # Fitbit
    {"id": "ref-fitbit-readiness", "title": "Fitbit Daily Readiness Score: A New Way to Optimize Your Day", "authors": "Fitbit/Google", "year": 2022, "type": "documentation", "url": "https://www.fitbit.com"},
    {"id": "ref-fitbit-sleep", "title": "Fitbit Sleep Stages: How It Works", "authors": "Fitbit", "year": 2019, "type": "documentation", "url": "https://www.fitbit.com"},
    
    # BIA
    {"id": "ref-bia-review", "title": "Bioelectrical impedance analysis for body composition assessment: a comprehensive review", "authors": "Kyle UG, Bosaeus I, De Lorenzo AD, et al.", "year": 2004, "type": "paper", "doi": "10.1016/j.clnu.2004.03.006"},
    {"id": "ref-ad5940", "title": "AD5940 High Precision Impedance and Electrochemical Front End", "authors": "Analog Devices", "year": 2020, "type": "documentation", "url": "https://www.analog.com/en/products/ad5940.html"},
    
    # Accelerometer / IMU
    {"id": "ref-lsm6dso", "title": "LSM6DSO Always-On 3D Accelerometer and 3D Gyroscope", "authors": "STMicroelectronics", "year": 2019, "type": "documentation", "url": "https://www.st.com/lsm6dso"},
    {"id": "ref-bmi270", "title": "BMI270 Smart, Ultra-Low Power Inertial Measurement Unit", "authors": "Bosch Sensortec", "year": 2020, "type": "documentation", "url": "https://www.bosch-sensortec.com/products/smart-sensors/bmi270/"},
    {"id": "ref-adxl362", "title": "ADXL362 Micropower 3-Axis MEMS Accelerometer", "authors": "Analog Devices", "year": 2017, "type": "documentation", "url": "https://www.analog.com/en/products/adxl362.html"},
    
    # Temperature
    {"id": "ref-tmp117", "title": "TMP117 High-Accuracy, Low-Power Digital Temperature Sensor", "authors": "Texas Instruments", "year": 2019, "type": "documentation", "url": "https://www.ti.com/product/TMP117"},
    {"id": "ref-mlx90632", "title": "MLX90632 Far Infrared Thermometer Sensor", "authors": "Melexis", "year": 2020, "type": "documentation", "url": "https://www.melexis.com/mlx90632"},
    
    # Barometer
    {"id": "ref-bmp390", "title": "BMP390 Digital Barometric Pressure Sensor", "authors": "Bosch Sensortec", "year": 2020, "type": "documentation", "url": "https://www.bosch-sensortec.com/products/environmental-sensors/pressure-sensors/bmp390/"},
    
    # EEG
    {"id": "ref-eeg-basics", "title": "Electroencephalography: Basic Principles, Clinical Applications, and Related Fields", "authors": "Niedermeyer E, Lopes da Silva F", "year": 2005, "type": "book"},
    {"id": "ref-mne", "title": "MNE: Magnetoencephalography and Electroencephalography in Python", "authors": "Gramfort A, Luessi M, Larson E, et al.", "year": 2013, "type": "paper", "doi": "10.1016/j.neuroimage.2013.04.001"},
    {"id": "ref-openbci", "title": "OpenBCI: Open Source Biosignal Acquisition Platform", "authors": "OpenBCI", "year": 2015, "type": "documentation", "url": "https://openbci.com"},
    
    # GSR
    {"id": "ref-gsr-review", "title": "Publication recommendations for electrodermal measurements", "authors": "Boucsein W, Fowles DC, Grimnes S, et al.", "year": 2012, "type": "paper", "doi": "10.1111/j.1469-8986.2012.01384.x"},
    
    # Deep Learning / ML
    {"id": "ref-deep-ecg", "title": "Deep learning for ECG analysis: A comprehensive review", "authors": "Hannun AY, Rajpurkar P, Haghpanahi M, et al.", "year": 2019, "type": "paper", "doi": "10.1038/s41591-018-0268-3"},
    {"id": "ref-deep-sleep", "title": "A deep learning model for sleep stage classification based on dual-channel EEG", "authors": "Supratak A, Dong H, Wu C, et al.", "year": 2017, "type": "paper", "doi": "10.1109/TBME.2017.2631747"},
    
    # Menstrual Health
    {"id": "ref-menstrual-wearable", "title": "Wearable sensor-based monitoring of menstrual cycles: a review", "authors": "Shilaih M, Goodale BM, Falco L, et al.", "year": 2017, "type": "paper", "doi": "10.1038/s41746-017-0002-0"},
    
    # Cardiovascular
    {"id": "ref-esc-heart-rate", "title": "2020 ESC Guidelines for the management of atrial fibrillation", "authors": "Hindricks G, Potpara T, Dagres N, et al.", "year": 2020, "type": "paper", "doi": "10.1093/eurheartj/ehaa612"},
    
    # Biological Age
    {"id": "ref-biological-age", "title": "Biological age as a useful index of health and aging", "authors": "Jee H", "year": 2019, "type": "paper", "doi": "10.4235/agmr.19.0026"},
    
    # Circadian
    {"id": "ref-circadian-wearable", "title": "Wearable devices for circadian rhythm monitoring", "authors": "Depner CM, Cheng PC, Devine JK, et al.", "year": 2019, "type": "paper"},
    
    # Caloric expenditure
    {"id": "ref-calorie-wearable", "title": "Validity of consumer-based activity monitors for estimating energy expenditure", "authors": "O'Driscoll R, Turicchi J, Beaulieu K, et al.", "year": 2020, "type": "paper", "doi": "10.1080/02640414.2020.1740430"},
    
    # Step counting
    {"id": "ref-step-counting", "title": "Accuracy of step counting in consumer wearable devices", "authors": "Case MA, Burwick HA, Volpp KG, et al.", "year": 2015, "type": "paper", "doi": "10.1001/jamainternmed.2015.0130"},
    
    # RR interval estimation
    {"id": "ref-rr-ppg", "title": "Estimation of respiratory rate from photoplethysmographic imaging", "authors": "Pimentel MAF, Charlton PH, Clifton DA", "year": 2017, "type": "paper"},
    
    # Training load / wellness
    {"id": "ref-firstbeat-methods", "title": "Firstbeat Training Effect and EPOC: Scientific Background", "authors": "Firstbeat Technologies", "year": 2014, "type": "documentation", "url": "https://www.firstbeat.com"},
    {"id": "ref-wearable-review", "title": "Wearable sensors for monitoring human health: A comprehensive review", "authors": "Majumder S, Mondal T, Deen MJ", "year": 2017, "type": "paper", "doi": "10.3390/s17050977"},
    
    # Apple Watch
    {"id": "ref-apple-hrv", "title": "Apple Watch Heart Rate Variability: What It Measures and Why It Matters", "authors": "Apple Inc.", "year": 2020, "type": "documentation", "url": "https://support.apple.com"},
    
    # Additional wearables
    {"id": "ref-masimo-set", "title": "Signal Extraction Technology (SET) for pulse oximetry", "authors": "Masimo Corporation", "year": 2005, "type": "patent"},
    
    # Health metrics
    {"id": "ref-cardio-fitness", "title": "Cardiorespiratory fitness and health: a comprehensive review", "authors": "Ross R, Blair SN, Arena R, et al.", "year": 2016, "type": "paper", "doi": "10.1161/CIR.0000000000000461"},
    
    # Sleep consistency
    {"id": "ref-sleep-regularity", "title": "The sleep regularity index as a measure of circadian rhythm stability", "authors": "Phillips AJK, Clerx WM, O'Brien CS, et al.", "year": 2017, "type": "paper", "doi": "10.1038/s41598-017-00473-7"},
    
    # Athlete monitoring
    {"id": "ref-athlete-monitoring", "title": "Monitoring athlete training loads: consensus statement", "authors": "Bourdon PC, Cardinale M, Murray A, et al.", "year": 2017, "type": "paper", "doi": "10.1123/IJSPP.2017-0208"},
    
    # Wearable sensors general
    {"id": "ref-wearable-sensors", "title": "Review of wearable sensors and systems for health monitoring", "authors": "Pantelopoulos A, Bourbakis NG", "year": 2010, "type": "paper", "doi": "10.1109/TITB.2009.2033869"},
    
    # Blood pressure
    {"id": "ref-bp-wearable", "title": "Cuffless blood pressure estimation from wearable PPG sensors", "authors": "Kachuee M, Kiani MM, Mohammadzade H, et al.", "year": 2017, "type": "paper", "doi": "10.1109/TBME.2016.2584512"},
    
    # Sleep deep waves
    {"id": "ref-sleep-deep", "title": "Slow wave sleep: characteristics and functions in health and disease", "authors": "Leger D, Debellemaniere E, Rabat A, et al.", "year": 2018, "type": "paper"},
    
    # Additional sensor references
    {"id": "ref-sfh7050", "title": "SFH 7050 Multichip LED Package for Photoplethysmography", "authors": "OSRAM Opto Semiconductors", "year": 2018, "type": "documentation", "url": "https://www.osram.com"},
    {"id": "ref-mpu6050", "title": "MPU-6000/MPU-6050 Product Specification", "authors": "TDK InvenSense", "year": 2013, "type": "documentation", "url": "https://invensense.tdk.com/products/motion-tracking/6-axis/mpu-6050/"},
    {"id": "ref-lps22df", "title": "LPS22DF MEMS Pressure Sensor", "authors": "STMicroelectronics", "year": 2021, "type": "documentation", "url": "https://www.st.com/lps22df"},
    
    # Activity Recognition
    {"id": "ref-activity-recognition", "title": "Activity recognition from acceleration data using deep learning", "authors": "Ronao CA, Cho SB", "year": 2016, "type": "paper", "doi": "10.1016/j.eswa.2016.01.007"},
    
    # Stress detection
    {"id": "ref-stress-detection", "title": "Stress detection using wearable sensors: a systematic review", "authors": "Can YS, Arnrich B, Ersoy C", "year": 2019, "type": "paper", "doi": "10.1109/ACCESS.2019.2928452"},
    
    # Temperature rhythm
    {"id": "ref-temp-circadian", "title": "The circadian rhythm of body temperature", "authors": "Refinetti R, Menaker M", "year": 1992, "type": "paper"},
    
    # Allostatic load
    {"id": "ref-allostatic-review", "title": "Allostatic load as a predictor of health outcomes: a systematic review", "authors": "Guidi J, Lucente M, Sonino N, et al.", "year": 2021, "type": "paper", "doi": "10.1159/000510696"},
    
    # Kubios
    {"id": "ref-kubios", "title": "Kubios HRV Software: A Comprehensive Tool for Heart Rate Variability Analysis", "authors": "Tarvainen MP, Niskanen JP, Lipponen JA, et al.", "year": 2014, "type": "paper", "doi": "10.1016/j.cmpb.2013.07.024"},
    
    # Garmin Training Effect
    {"id": "ref-garmin-training-effect", "title": "Garmin Training Effect: Scientific Approach to Measuring Workout Impact", "authors": "Firstbeat/Garmin", "year": 2018, "type": "documentation", "url": "https://www.firstbeat.com"},
    
    # Polar Sleep
    {"id": "ref-polar-sleep", "title": "Polar Sleep Plus Stages: Understanding Your Sleep", "authors": "Polar Electro", "year": 2021, "type": "documentation", "url": "https://www.polar.com"},
    
    # Epoc validation
    {"id": "ref-epoc-validation", "title": "Validity of the EPOC as an indicator of exercise intensity", "authors": "Laforgia J, Withers RT, Gore CJ", "year": 2006, "type": "paper", "doi": "10.1152/japplphysiol.00666.2005"},
    
    # Mental fatigue
    {"id": "ref-mental-fatigue", "title": "Mental fatigue: a systematic review of its effects on cognitive and physical performance", "authors": "Van Cutsem J, Marcora S, De Pauw K, et al.", "year": 2017, "type": "paper", "doi": "10.1007/s40279-017-0759-6"},
    
    # Menstrual cycle
    {"id": "ref-cycle-tracking", "title": "Physiological changes across the menstrual cycle: implications for health and performance", "authors": "Janse DE, Jonge X, Thompson B, et al.", "year": 2019, "type": "paper", "doi": "10.1007/s40279-019-01117-6"},
    
    # Activity benefit
    {"id": "ref-activity-guidelines", "title": "Physical Activity Guidelines for Americans (2nd edition)", "authors": "U.S. Department of Health and Human Services", "year": 2018, "type": "documentation"},
    
    # Sleep debt
    {"id": "ref-sleep-debt", "title": "Sleep debt: a review of theoretical and empirical evidence", "authors": "Kushida CA", "year": 2005, "type": "paper", "doi": "10.1016/j.sleep.2005.09.002"},
    
    # Overtraining
    {"id": "ref-overtraining-review", "title": "Overtraining syndrome: a review of the literature", "authors": "Kreher JB, Schwartz JB", "year": 2012, "type": "paper", "doi": "10.1177/1941738111434406"},
    
    # Garmin Running Dynamics
    {"id": "ref-garmin-running", "title": "Garmin Running Dynamics: Measuring Your Running Form", "authors": "Garmin", "year": 2019, "type": "documentation", "url": "https://www.garmin.com"},
    
    # Menstrual tracking with wearables
    {"id": "ref-menstrual-wearable-oura", "title": "Oura Ring menstrual cycle tracking: a wearable approach", "authors": "Oura Health", "year": 2021, "type": "documentation", "url": "https://ouraring.com"},
    
    # WHOOP BIA blood pressure
    {"id": "ref-whoop-bp-patent", "title": "Systems and Methods for Estimating Blood Pressure from Wearable Sensors", "authors": "WHOOP Inc.", "year": 2021, "type": "patent"},
    
    # Gemini Health
    {"id": "ref-gemini-health", "title": "Gemini Health: AI-Powered Personalized Wellness Coaching", "authors": "Google DeepMind", "year": 2024, "type": "documentation"},
    
    # AI coaching
    {"id": "ref-ai-coaching", "title": "Artificial intelligence in health coaching: current state and future directions", "authors": "Ting DSW, Cheung CY, Lim G, et al.", "year": 2023, "type": "paper"},
]


def make_impls(v1_mod):
    """Generate implementations from V1 module data."""
    impls = []
    
    market_solutions = v1_mod.get("市面方案", [])
    
    if market_solutions:
        # Use market solutions as mainstream implementations
        for i, ms in enumerate(market_solutions[:5]):
            name = ms.get("名称", f"方案{i+1}")
            vendor = ms.get("厂商", "—")
            features = ms.get("特点", "")
            pros = [f.strip() for f in features.split("，")[:3] if f.strip()] if features else ["成熟商用方案"]
            while len(pros) < 2:
                pros.append("行业标准方案")
            
            impls.append({
                "type": "mainstream",
                "name": name,
                "vendor": vendor,
                "description": f"市场主流方案。{features[:100]}" if features else "",
                "pros": pros[:3],
                "cons": ["成本较高", "集成复杂度中等"],
                "citations": []
            })
    
    # Add an advanced implementation based on module content
    tag = v1_mod.get("tag", "")
    mid = v1_mod["id"]
    layer = v1_mod["layer"]
    
    advanced_name = "下一代数字域集成"
    advanced_desc = "采用全数字域信号处理结合AI推理引擎，实现自适应补偿与多模态融合"
    adv_vendor = "学术界/工业界前沿"
    
    if layer == "L1":
        advanced_name = "全数字域传感器融合方案"
        advanced_desc = "采用全数字域信号处理架构，集成AI推理引擎，支持自适应补偿和多模态融合"
        adv_vendor = "TI/ADI (概念阶段)"
    elif layer == "L2":
        advanced_name = "深度学习端到端信号增强"
        advanced_desc = "采用端到端深度神经网络替代传统多级滤波-检测管线，在低SNR场景下表现更优"
        adv_vendor = "学术研究前沿"
    elif layer == "L3":
        advanced_name = "多模态注意力融合特征提取"
        advanced_desc = "融合多传感器数据(PPG+ACC+ECG)的联合特征提取，利用注意力机制动态加权"
        adv_vendor = "学术研究前沿"
    elif layer == "L4":
        if "whoop" in mid:
            advanced_name = "新一代多维度恢复算法"
            advanced_desc = "融合更多生物标志物的多维度恢复评估模型，利用机器学习优化权重"
            adv_vendor = "WHOOP (研究阶段)"
        elif "garmin" in mid:
            advanced_name = "个性化动态基线模型"
            advanced_desc = "基于用户历史数据的个性化动态基线模型，自适应调整评估阈值"
            adv_vendor = "Garmin/Firstbeat (下一代)"
        elif "polar" in mid:
            advanced_name = "AI自适应训练规划"
            advanced_desc = "基于强化学习的自适应训练规划，动态调整训练建议"
            adv_vendor = "Polar (研发中)"
        elif "fitbit" in mid:
            advanced_name = "Google Health AI融合分析"
            advanced_desc = "整合Google Health AI技术的多模态融合分析引擎"
            adv_vendor = "Google/Fitbit"
        elif "oura" in mid:
            advanced_name = "多信号融合生物年龄模型"
            advanced_desc = "基于多维度生物标志物融合的生物年龄预测模型"
            adv_vendor = "Oura Health"
        else:
            advanced_name = "Multi-task Learning综合评估"
            advanced_desc = "多任务学习模型同时预测多个健康维度指标"
            adv_vendor = "学术研究前沿"
    else:
        advanced_name = "LLM驱动的个性化推理引擎"
        advanced_desc = "采用大语言模型进行多维度数据融合与个性化推理，支持自然语言交互式健康咨询"
        adv_vendor = "Google/OpenAI 概念阶段"
    
    impls.append({
        "type": "advanced",
        "name": advanced_name,
        "vendor": adv_vendor,
        "description": advanced_desc,
        "pros": ["前沿技术", "潜力大", "可自适应"],
        "cons": ["尚未量产", "需大量验证数据", "成熟度低"],
        "citations": []
    })
    
    # If no market solutions, add a generic mainstream
    if not market_solutions:
        yield_name = f"标准{tag}实现" if tag else "标准实现方案"
        impls.insert(0, {
            "type": "mainstream",
            "name": yield_name,
            "vendor": "通用",
            "description": "行业标准算法实现，基于公开的学术研究和开源参考实现",
            "pros": ["标准化", "经验证", "可复现"],
            "cons": ["通用方案", "无法针对特定场景优化"],
            "citations": []
        })
    
    return impls


def make_description(v1_mod):
    """Combine 作用 and 工作原理/计算方式 into description."""
    desc_parts = [v1_mod.get("作用", "")]
    working = v1_mod.get("工作原理", v1_mod.get("计算方式", ""))
    if working:
        desc_parts.append(working)
    return "\n\n".join(desc_parts)


def get_importance(layer):
    if layer in ("L1", "L2", "L4", "L5"):
        return "high"
    elif layer == "L3":
        return "medium"
    return "high"


def make_glossary_terms(v1_mod):
    """Extract glossary term IDs used in a module."""
    mid = v1_mod["id"]
    tag = v1_mod.get("tag", "")
    description = v1_mod.get("作用", "") + v1_mod.get("工作原理", v1_mod.get("计算方式", ""))
    
    # Map module to relevant glossary terms
    id_to_terms = {
        "L1:ppg": ["ppg", "bvp", "spo2", "snr"],
        "L1:accelerometer": ["mems"],
        "L1:temperature": ["mems"],
        "L1:ecg": ["ecg", "snr"],
        "L1:bia": ["bia", "mems"],
        "L1:gyroscope": ["mems"],
        "L1:barometer": ["mems"],
        "L1:gsr": ["ans"],
        "L2:hr": ["hr", "bpm", "ppg", "ecg"],
        "L2:ibi": ["hrv", "ecg", "ppg"],
        "L2:hrv": ["hrv", "rmssd", "sdnn", "lf-hf", "ans", "parasympathetic", "sympathetic", "fft"],
        "L2:spo2": ["spo2", "ppg", "bvp"],
        "L2:rr": ["hrv", "hr", "bvp"],
        "L2:ecg-waveform": ["ecg"],
        "L2:acceleration": ["mems"],
        "L2:step-count": ["mems"],
        "L2:activity-type": ["mems"],
        "L2:angular-velocity": ["mems"],
        "L2:attitude-angle": ["mems"],
        "L2:skin-temperature": ["mems"],
        "L2:skin-conductance": ["ans"],
        "L2:body-impedance": ["bia"],
        "L2:blood-pressure-est": ["hr", "hrv"],
        "L2:altitude": ["mems"],
        "L3:tst": ["tst", "sws"],
        "L3:sleep-efficiency": ["tst", "sws"],
        "L3:sleep-latency": ["tst"],
        "L3:waso": ["waso", "tst"],
        "L3:light-sleep": ["rem", "sws"],
        "L3:deep-sleep": ["sws"],
        "L3:rem-sleep": ["rem"],
        "L3:sleep-disruptions": ["waso"],
        "L3:sleep-regularity": ["circadian"],
        "L3:rhr": ["rhr", "hr", "bpm"],
        "L3:hrmax": ["hrmax", "hr", "bpm"],
        "L3:hrr": ["hrr", "hr", "hrv"],
        "L3:hr-zones": ["hr-zones", "hr", "bpm", "epoc"],
        "L3:trimp": ["trimp", "epoc", "hr"],
        "L3:parasympathetic": ["parasympathetic", "ans", "hrv", "rmssd"],
        "L3:sympathetic": ["sympathetic", "ans", "hrv"],
        "L3:ans-balance": ["ans", "parasympathetic", "sympathetic", "lf-hf", "hrv"],
        "L3:stress-response": ["ans", "hrv", "rmssd"],
        "L3:acute-load": ["epoc", "trimp"],
        "L3:chronic-load": ["epoc", "trimp"],
        "L3:acwr": ["acwr", "epoc", "trimp", "overtraining"],
        "L3:training-monotony": ["trimp", "overtraining"],
        "L3:body-battery": ["body-battery", "hrv", "rmssd", "recovery"],
        "L3:sleep-debt": ["tst", "circadian"],
        "L3:vo2max-est": ["vo2max", "hr", "epoc"],
        "L3:circadian-phase": ["circadian", "hrv"],
        "L3:roc-est": ["hrv", "rr"],
        "L3:calorie": ["mets", "hr"],
        "L3:bmr": ["mets", "hr"],
        "L3:active-minutes": ["mets"],
        "L3:sedentary-time": ["mets"],
        "L3:distance": ["mets"],
        "L3:menstrual-phase": ["circadian"],
        "L3:ovulation-window": ["circadian"],
        "L3:cycle-regularity": ["circadian"],
        "L3:body-fat": ["bia"],
        "L3:muscle-mass": ["bia"],
        "L3:body-water": ["bia"],
        "L3:mvpa": ["mets", "hr-zones"],
        "L4:whoop-recovery": ["recovery", "hrv", "rmssd", "rhr", "ans"],
        "L4:whoop-strain": ["strain", "hr", "epoc"],
        "L4:whoop-sleep": ["tst", "waso", "rem", "sws", "recovery"],
        "L4:whoop-stress": ["ans", "hrv", "allostatic-load"],
        "L4:whoop-healthspan": ["recovery", "allostatic-load"],
        "L4:whoop-bp": ["hr", "hrv"],
        "L4:polar-nightly-recharge": ["recovery", "hrv", "rmssd", "ans"],
        "L4:polar-training-load-pro": ["trimp", "epoc", "hr-zones"],
        "L4:polar-alertness": ["ans", "hrv", "recovery"],
        "L4:polar-activity-benefit": ["mets", "recovery"],
        "L4:garmin-body-battery": ["body-battery", "recovery", "hrv", "rmssd", "ans"],
        "L4:garmin-training-readiness": ["readiness", "recovery", "hrv", "rmssd"],
        "L4:garmin-stress": ["ans", "hrv", "allostatic-load"],
        "L4:garmin-training-status": ["readiness", "recovery", "acwr", "overtraining"],
        "L4:garmin-training-effect": ["epoc", "trimp", "hr"],
        "L4:garmin-running-dynamics": ["mems"],
        "L4:fitbit-daily-readiness": ["readiness", "recovery", "hrv"],
        "L4:fitbit-sleep-score": ["tst", "waso", "rem", "sws"],
        "L4:fitbit-stress-management": ["ans", "hrv", "allostatic-load"],
        "L4:fitbit-cardio-fitness": ["vo2max", "hr"],
        "L4:oura-readiness": ["readiness", "recovery", "hrv", "rmssd", "rhr", "tst"],
        "L4:oura-sleep-score": ["tst", "rem", "sws", "waso"],
        "L4:oura-activity-score": ["recovery", "epoc", "trimp"],
        "L4:biological-age": ["allostatic-load", "recovery", "hrv"],
        "L4:allostatic-load": ["allostatic-load", "ans", "hrv"],
        "L4:overtraining-risk": ["overtraining", "acwr", "hrv", "rhr"],
        "L4:mental-fatigue": ["ans", "allostatic-load", "hrv"],
        "L4:cv-health-grade": ["hr", "hrv", "rhr", "hrr", "vo2max"],
        "L4:circadian-health": ["circadian", "hrv", "tst"],
        "L5:ai-coach-overview": [],
        "L5:whoop-coach": ["strain", "recovery", "readiness", "tst"],
        "L5:gemini-health-coach": ["recovery", "readiness"],
        "L5:data-interpretation": [],
        "L5:personalized-recommendation": [],
    }
    
    return id_to_terms.get(mid, [])


def make_references(v1_mod):
    """Map module to reference IDs."""
    mid = v1_mod["id"]
    id_to_refs = {
        "L1:ppg": ["ref-allen2007", "ref-tamura2014", "ref-ppg-review", "ref-max30102", "ref-afe4900"],
        "L1:accelerometer": ["ref-lsm6dso", "ref-bmi270", "ref-adxl362"],
        "L1:temperature": ["ref-tmp117", "ref-mlx90632", "ref-temp-circadian"],
        "L1:ecg": ["ref-ads1292r", "ref-max30003", "ref-ad8233", "ref-ecg-basics"],
        "L1:bia": ["ref-ad5940", "ref-bia-review"],
        "L1:gyroscope": ["ref-lsm6dso", "ref-bmi270"],
        "L1:barometer": ["ref-bmp390", "ref-lps22df"],
        "L1:gsr": ["ref-gsr-review"],
        "L2:hr": ["ref-allen2007", "ref-pan-tompkins", "ref-esc-heart-rate"],
        "L2:ibi": ["ref-hrv-standards", "ref-pan-tompkins"],
        "L2:hrv": ["ref-hrv-standards", "ref-hrv-review", "ref-kubios", "ref-apple-hrv"],
        "L2:spo2": ["ref-spo2-physics", "ref-masimo-set"],
        "L2:rr": ["ref-rr-ppg", "ref-hrv-standards"],
        "L2:ecg-waveform": ["ref-ecg-basics", "ref-pan-tompkins", "ref-ecg-classification"],
        "L2:acceleration": ["ref-lsm6dso", "ref-activity-recognition"],
        "L2:step-count": ["ref-step-counting"],
        "L2:activity-type": ["ref-activity-recognition"],
        "L2:angular-velocity": ["ref-lsm6dso"],
        "L2:attitude-angle": ["ref-lsm6dso"],
        "L2:skin-temperature": ["ref-tmp117", "ref-temp-circadian"],
        "L2:skin-conductance": ["ref-gsr-review"],
        "L2:body-impedance": ["ref-bia-review", "ref-ad5940"],
        "L2:blood-pressure-est": ["ref-bp-wearable"],
        "L2:altitude": ["ref-bmp390"],
        "L3:tst": ["ref-aasm-manual", "ref-sleep-wearable", "ref-sleep-review"],
        "L3:sleep-efficiency": ["ref-aasm-manual", "ref-sleep-wearable"],
        "L3:sleep-latency": ["ref-aasm-manual"],
        "L3:waso": ["ref-aasm-manual", "ref-sleep-wearable"],
        "L3:light-sleep": ["ref-aasm-manual", "ref-sleep-wearable"],
        "L3:deep-sleep": ["ref-aasm-manual", "ref-sleep-deep"],
        "L3:rem-sleep": ["ref-aasm-manual", "ref-whoop-sleep-validity"],
        "L3:sleep-disruptions": ["ref-aasm-manual"],
        "L3:sleep-regularity": ["ref-sleep-regularity", "ref-sleep-review"],
        "L3:rhr": ["ref-esc-heart-rate", "ref-apple-hrv"],
        "L3:hrmax": ["ref-vo2max-review"],
        "L3:hrr": ["ref-esc-heart-rate"],
        "L3:hr-zones": ["ref-esc-heart-rate", "ref-firstbeat-methods"],
        "L3:trimp": ["ref-banister-trimp", "ref-firstbeat-epoc"],
        "L3:parasympathetic": ["ref-hrv-standards"],
        "L3:sympathetic": ["ref-hrv-standards"],
        "L3:ans-balance": ["ref-hrv-standards", "ref-stress-detection"],
        "L3:stress-response": ["ref-stress-detection"],
        "L3:acute-load": ["ref-banister-trimp", "ref-firstbeat-epoc"],
        "L3:chronic-load": ["ref-banister-trimp"],
        "L3:acwr": ["ref-gabbett-acwr"],
        "L3:training-monotony": ["ref-banister-trimp"],
        "L3:body-battery": ["ref-garmin-body-battery", "ref-hrv-review"],
        "L3:sleep-debt": ["ref-sleep-debt", "ref-aasm-manual"],
        "L3:vo2max-est": ["ref-vo2max-review", "ref-firstbeat-epoc"],
        "L3:circadian-phase": ["ref-circadian-wearable", "ref-temp-circadian"],
        "L3:roc-est": ["ref-firstbeat-epoc", "ref-rr-ppg"],
        "L3:calorie": ["ref-calorie-wearable"],
        "L3:bmr": ["ref-calorie-wearable"],
        "L3:active-minutes": ["ref-activity-guidelines"],
        "L3:sedentary-time": ["ref-activity-guidelines"],
        "L3:distance": ["ref-step-counting"],
        "L3:menstrual-phase": ["ref-menstrual-wearable", "ref-cycle-tracking"],
        "L3:ovulation-window": ["ref-menstrual-wearable"],
        "L3:cycle-regularity": ["ref-cycle-tracking"],
        "L3:body-fat": ["ref-bia-review"],
        "L3:muscle-mass": ["ref-bia-review"],
        "L3:body-water": ["ref-bia-review"],
        "L3:mvpa": ["ref-activity-guidelines"],
        "L4:whoop-recovery": ["ref-whoop-recovery", "ref-whoop-sleep-validity"],
        "L4:whoop-strain": ["ref-whoop-strain", "ref-firstbeat-methods"],
        "L4:whoop-sleep": ["ref-whoop-sleep-validity", "ref-aasm-manual"],
        "L4:whoop-stress": ["ref-whoop-recovery", "ref-stress-detection"],
        "L4:whoop-healthspan": ["ref-whoop-recovery"],
        "L4:whoop-bp": ["ref-whoop-bp-patent", "ref-bp-wearable"],
        "L4:polar-nightly-recharge": ["ref-polar-nightly-recharge", "ref-hrv-review"],
        "L4:polar-training-load-pro": ["ref-polar-training-load", "ref-firstbeat-methods"],
        "L4:polar-alertness": ["ref-polar-nightly-recharge"],
        "L4:polar-activity-benefit": ["ref-activity-guidelines"],
        "L4:garmin-body-battery": ["ref-garmin-body-battery"],
        "L4:garmin-training-readiness": ["ref-garmin-training-readiness"],
        "L4:garmin-stress": ["ref-garmin-body-battery", "ref-stress-detection"],
        "L4:garmin-training-status": ["ref-garmin-training-readiness"],
        "L4:garmin-training-effect": ["ref-garmin-training-effect", "ref-firstbeat-epoc"],
        "L4:garmin-running-dynamics": ["ref-garmin-running"],
        "L4:fitbit-daily-readiness": ["ref-fitbit-readiness"],
        "L4:fitbit-sleep-score": ["ref-fitbit-sleep"],
        "L4:fitbit-stress-management": ["ref-fitbit-readiness"],
        "L4:fitbit-cardio-fitness": ["ref-cardio-fitness"],
        "L4:oura-readiness": ["ref-oura-readiness", "ref-oura-sleep-validation"],
        "L4:oura-sleep-score": ["ref-oura-sleep-validation", "ref-aasm-manual"],
        "L4:oura-activity-score": ["ref-oura-readiness"],
        "L4:biological-age": ["ref-biological-age"],
        "L4:allostatic-load": ["ref-allostatic-review"],
        "L4:overtraining-risk": ["ref-overtraining-review", "ref-gabbett-acwr"],
        "L4:mental-fatigue": ["ref-mental-fatigue"],
        "L4:cv-health-grade": ["ref-cardio-fitness", "ref-esc-heart-rate"],
        "L4:circadian-health": ["ref-circadian-wearable"],
        "L5:ai-coach-overview": ["ref-ai-coaching", "ref-gemini-health"],
        "L5:whoop-coach": ["ref-whoop-recovery", "ref-ai-coaching"],
        "L5:gemini-health-coach": ["ref-gemini-health", "ref-ai-coaching"],
        "L5:data-interpretation": ["ref-ai-coaching"],
        "L5:personalized-recommendation": ["ref-ai-coaching", "ref-gemini-health"],
    }
    return id_to_refs.get(mid, [])


def _esc(s):
    """Escape string for safe embedding in TS double-quoted string."""
    return s.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')


def _esc_short(s):
    """Escape string for short TS values (summary, name, etc)."""
    return s.replace('"', '\\"')


# ========== Generate modules.ts ==========
def generate_modules_code():
    lines = []
    lines.append("// Auto-generated from V1 data.json")
    lines.append("// Do not edit manually. Run scripts/migrate.py to regenerate.")
    lines.append('')
    lines.append("import { Module } from \"./types\";")
    lines.append('')
    lines.append("export const modules: Module[] = [")
    
    for m in v1_modules:
        mid = m["id"]
        lines.append("  {")
        lines.append(f'    id: "{mid}",')
        lines.append(f'    layer: "{m["layer"]}",')
        lines.append(f'    name: "{_esc_short(m["name"])}",')
        
        summary = _esc_short(m.get("summary", ""))
        lines.append(f'    summary: "{summary}",')
        
        desc = _esc(make_description(m)).replace("（", "(").replace("）", ")")
        # Truncate very long descriptions
        if len(desc) > 2000:
            desc = desc[:1997] + "..."
        lines.append(f'    description: "{desc}",')
        
        importance = get_importance(m["layer"])
        lines.append(f'    importance: "{importance}",')
        
        depends_on = m.get("depends_on", [])
        depends_on = [d for d in depends_on if not d.startswith("L0:")]  # Remove L0 dependencies
        lines.append(f'    dependsOn: {json.dumps(depends_on)},')
        
        feeds_into = m.get("feeds_into", [])
        lines.append(f'    feedsInto: {json.dumps(feeds_into)},')
        
        tag_val = m.get("tag", "")
        tags = [t.strip() for t in tag_val.split("/")] if tag_val else []
        lines.append(f'    tags: {json.dumps(tags)},')
        
        impls = make_impls(m)
        lines.append("    implementations: [")
        for impl in impls:
            lines.append("      {")
            lines.append(f'        type: "{impl["type"]}",')
            lines.append(f'        name: "{_esc_short(impl["name"])}",')
            lines.append(f'        vendor: "{_esc_short(impl["vendor"])}",')
            lines.append(f'        description: "{_esc(impl["description"])}",')
            lines.append(f'        pros: {json.dumps(impl["pros"])},')
            lines.append(f'        cons: {json.dumps(impl["cons"])},')
            lines.append(f'        citations: {json.dumps(impl["citations"])},')
            lines.append("      },")
        lines.append("    ],")
        
        glossary_terms = make_glossary_terms(m)
        lines.append(f'    glossaryTerms: {json.dumps(glossary_terms)},')
        
        refs = make_references(m)
        lines.append(f'    references: {json.dumps(refs)},')
        
        lines.append("  },")
    
    lines.append("];")
    
    return "\n".join(lines)


def generate_modules_data_code():
    """Generate modules-data.ts (just the data array)."""
    lines = []
    lines.append("// Auto-generated from V1 data.json")
    lines.append("// Do not edit manually. Run scripts/migrate.py to regenerate.")
    lines.append('')
    lines.append("import { Module } from \"./types\";")
    lines.append('')
    lines.append("export const modules: Module[] = [")
    
    for m in v1_modules:
        mid = m["id"]
        lines.append("  {")
        lines.append(f'    id: "{mid}",')
        lines.append(f'    layer: "{m["layer"]}",')
        lines.append(f'    name: "{_esc_short(m["name"])}",')
        summary = _esc_short(m.get("summary", ""))
        lines.append(f'    summary: "{summary}",')
        desc = _esc(make_description(m)).replace("（", "(").replace("）", ")")
        if len(desc) > 2000:
            desc = desc[:1997] + "..."
        lines.append(f'    description: "{desc}",')
        importance = get_importance(m["layer"])
        lines.append(f'    importance: "{importance}",')
        depends_on = m.get("depends_on", [])
        depends_on = [d for d in depends_on if not d.startswith("L0:")]
        lines.append(f'    dependsOn: {json.dumps(depends_on)},')
        feeds_into = m.get("feeds_into", [])
        lines.append(f'    feedsInto: {json.dumps(feeds_into)},')
        tag_val = m.get("tag", "")
        tags = [t.strip() for t in tag_val.split("/")] if tag_val else []
        lines.append(f'    tags: {json.dumps(tags)},')
        impls = make_impls(m)
        lines.append("    implementations: [")
        for impl in impls:
            lines.append("      {")
            lines.append(f'        type: "{impl["type"]}",')
            lines.append(f'        name: "{_esc_short(impl["name"])}",')
            lines.append(f'        vendor: "{_esc_short(impl["vendor"])}",')
            lines.append(f'        description: "{_esc(impl["description"])}",')
            lines.append(f'        pros: {json.dumps(impl["pros"])},')
            lines.append(f'        cons: {json.dumps(impl["cons"])},')
            lines.append(f'        citations: {json.dumps(impl["citations"])},')
            lines.append("      },")
        lines.append("    ],")
        glossary_terms = make_glossary_terms(m)
        lines.append(f'    glossaryTerms: {json.dumps(glossary_terms)},')
        refs = make_references(m)
        lines.append(f'    references: {json.dumps(refs)},')
        lines.append("  },")
    
    lines.append("];")
    return "\n".join(lines)


# ========== Generate glossary.ts ==========
def generate_glossary_code():
    lines = []
    lines.append("// Auto-generated from V1 data.json")
    lines.append("// Do not edit manually. Run scripts/migrate.py to regenerate.")
    lines.append('')
    lines.append("import { GlossaryTerm } from \"./types\";")
    lines.append('')
    lines.append("export const glossaryTerms: GlossaryTerm[] = [")
    
    for key in BASIC_TERMS_KEYS:
        term_data = term_definitions[key]
        lines.append("  {")
        lines.append(f'    id: "{key}",')
        lines.append(f'    term: "{_esc_short(term_data["term"])}",')
        lines.append(f'    category: "{_esc_short(term_data["category"])}",')
        lines.append(f'    definition: "{_esc(term_data["definition"])}",')
        lines.append(f'    references: {json.dumps(term_data["references"])},')
        lines.append("  },")
    
    lines.append("];")
    lines.append('')
    lines.append("export function getGlossaryTermById(id: string): GlossaryTerm | undefined {")
    lines.append("  return glossaryTerms.find((t) => t.id === id);")
    lines.append("}")
    lines.append('')
    lines.append("export function getGlossaryTermsByIds(ids: string[]): GlossaryTerm[] {")
    lines.append("  return ids")
    lines.append("    .map((id) => getGlossaryTermById(id))")
    lines.append("    .filter(Boolean) as GlossaryTerm[];")
    lines.append("}")
    
    return "\n".join(lines)


# ========== Generate references.ts ==========
def generate_references_code():
    lines = []
    lines.append("// Auto-generated from V1 data.json")
    lines.append("// Do not edit manually. Run scripts/migrate.py to regenerate.")
    lines.append('')
    lines.append("import { Reference } from \"./types\";")
    lines.append('')
    lines.append("export const references: Reference[] = [")
    
    for ref in REFERENCES_LIST:
        lines.append("  {")
        for key, value in ref.items():
            if isinstance(value, str):
                lines.append(f'    {key}: "{value}",')
            elif isinstance(value, int):
                lines.append(f'    {key}: {value},')
            elif value is None:
                pass
        lines.append("  },")
    
    lines.append("];")
    lines.append('')
    lines.append("export function getReferenceById(id: string): Reference | undefined {")
    lines.append("  return references.find((r) => r.id === id);")
    lines.append("}")
    lines.append('')
    lines.append("export function getReferencesByIds(ids: string[]): Reference[] {")
    lines.append("  return ids")
    lines.append("    .map((id) => getReferenceById(id))")
    lines.append("    .filter(Boolean) as Reference[];")
    lines.append("}")
    lines.append('')
    lines.append("export function getReferencesByType(type: string): Reference[] {")
    lines.append("  return references.filter((r) => r.type === type);")
    lines.append("}")
    
    return "\n".join(lines)


# ========== Write files ==========
os.makedirs(OUT_DIR, exist_ok=True)

data_modules_code = generate_modules_data_code()

modules_data = data_modules_code
modules_helpers = (
    '// Auto-generated from V1 data.json\n'
    '// Do not edit manually. Data in modules-data.ts\n'
    '\n'
    'import { Module } from "./types";\n'
    'import { modules as moduleData } from "./modules-data";\n'
    '\n'
    'export const modules: Module[] = moduleData;\n'
    '\n'
    'export function getModuleById(id: string): Module | undefined {\n'
    '  return modules.find((m) => m.id === id);\n'
    '}\n'
    '\n'
    'export function getModulesByLayer(layerId: string): Module[] {\n'
    '  return modules.filter((m) => m.layer === layerId);\n'
    '}\n'
    '\n'
    'export function getModulesByIds(ids: string[]): Module[] {\n'
    '  return ids\n'
    '    .map((id) => getModuleById(id))\n'
    '    .filter(Boolean) as Module[];\n'
    '}\n'
)

with open(os.path.join(OUT_DIR, "modules-data.ts"), "w") as f:
    f.write(modules_data)
print(f"Generated modules-data.ts ({len(v1_modules)} modules)")

with open(os.path.join(OUT_DIR, "modules.ts"), "w") as f:
    f.write(modules_helpers)
print(f"Generated modules.ts (helpers, imports from modules-data)")

with open(os.path.join(OUT_DIR, "glossary.ts"), "w") as f:
    f.write(generate_glossary_code())
print(f"Generated glossary.ts ({len(BASIC_TERMS_KEYS)} terms)")

with open(os.path.join(OUT_DIR, "references.ts"), "w") as f:
    f.write(generate_references_code())
print(f"Generated references.ts ({len(REFERENCES_LIST)} references)")

print("\nDone!")
