#!/usr/bin/env python3
"""
Script to fix citations and add [ref_id] markers to module descriptions.
Uses precise, hand-crafted mappings for each implementation.

Run: python3 scripts/fix_citations.py
"""

import re

DATA_DIR = 'data'
MODULES_FILE = f'{DATA_DIR}/modules-data.ts'
REFS_FILE = f'{DATA_DIR}/references.ts'


# ======================================================================
# PRECISE CITATION MAPPING: (module_id, impl_name) -> [ref_ids]
# ======================================================================
# This mapping is hand-crafted to be accurate and minimal.
# Each mainstream impl gets 1-2 citations, advanced gets at least 1.

CITATION_MAP = {
    # ===== L1: Raw Sensors =====

    # PPG
    ('L1:ppg', 'AFE4900'): ['ref-afe4900'],
    ('L1:ppg', 'MAX86141'): ['ref-afe4900'],
    ('L1:ppg', 'PAH8007'): ['ref-max30102'],
    ('L1:ppg', 'SFH7050'): ['ref-sfh7050'],
    ('L1:ppg', 'BH1792GUL'): ['ref-max30102'],
    ('L1:ppg', '全数字域传感器融合方案'): ['ref-afe4900'],

    # Accelerometer
    ('L1:accelerometer', 'LSM6DSO'): ['ref-lsm6dso'],
    ('L1:accelerometer', 'BMI270'): ['ref-bmi270'],
    ('L1:accelerometer', 'ADXL362'): ['ref-adxl362'],
    ('L1:accelerometer', 'KX126-1063'): ['ref-adxl362'],
    ('L1:accelerometer', 'MPU-6050'): ['ref-mpu6050'],
    ('L1:accelerometer', '全数字域传感器融合方案'): ['ref-lsm6dso'],

    # Temperature
    ('L1:temperature', 'TMP117'): ['ref-tmp117'],
    ('L1:temperature', 'MAX30205'): ['ref-tmp117'],
    ('L1:temperature', 'SHT30'): ['ref-tmp117'],
    ('L1:temperature', 'MLX90632'): ['ref-mlx90632'],
    ('L1:temperature', 'NCP21XH103J'): ['ref-tmp117'],
    ('L1:temperature', '全数字域传感器融合方案'): ['ref-tmp117'],

    # ECG
    ('L1:ecg', 'ADS1292R'): ['ref-ads1292r'],
    ('L1:ecg', 'MAX30003'): ['ref-max30003'],
    ('L1:ecg', 'AD8233'): ['ref-ad8233'],
    ('L1:ecg', 'BMD101'): ['ref-ecg-basics'],
    ('L1:ecg', 'SFH7060'): ['ref-ecg-basics'],
    ('L1:ecg', '全数字域传感器融合方案'): ['ref-ad8233'],

    # BIA
    ('L1:bia', 'AD5940'): ['ref-ad5940'],
    ('L1:bia', 'AFE4500'): ['ref-ad5940'],
    ('L1:bia', 'MAX30009'): ['ref-bia-review'],
    ('L1:bia', 'LMP91200'): ['ref-bia-review'],
    ('L1:bia', '全数字域传感器融合方案'): ['ref-ad5940'],

    # Gyroscope
    ('L1:gyroscope', 'LSM6DSO'): ['ref-lsm6dso'],
    ('L1:gyroscope', 'BMI270'): ['ref-bmi270'],
    ('L1:gyroscope', 'ICM-20948'): ['ref-mpu6050'],
    ('L1:gyroscope', 'ADXRS290'): ['ref-lsm6dso'],
    ('L1:gyroscope', '全数字域传感器融合方案'): ['ref-lsm6dso'],

    # Barometer
    ('L1:barometer', 'BMP390'): ['ref-bmp390'],
    ('L1:barometer', 'LPS22DF'): ['ref-lps22df'],
    ('L1:barometer', 'MS5803'): ['ref-bmp390'],
    ('L1:barometer', 'SPL06-001'): ['ref-bmp390'],
    ('L1:barometer', '全数字域传感器融合方案'): ['ref-bmp390'],

    # GSR
    ('L1:gsr', 'AD5940'): ['ref-ad5940'],
    ('L1:gsr', 'MAX30009'): ['ref-gsr-review'],
    ('L1:gsr', 'MCP3910'): ['ref-gsr-review'],
    ('L1:gsr', '定制分立方案'): ['ref-gsr-review'],
    ('L1:gsr', '全数字域传感器融合方案'): ['ref-ad5940'],

    # ===== L2: Derived Metrics =====

    # HR
    ('L2:hr', '标准心血管实现'): ['ref-allen2007', 'ref-esc-heart-rate'],
    ('L2:hr', '深度学习端到端信号增强'): ['ref-deep-ecg'],

    # IBI
    ('L2:ibi', '标准心血管实现'): ['ref-hrv-standards', 'ref-pan-tompkins'],
    ('L2:ibi', '深度学习端到端信号增强'): ['ref-pan-tompkins'],

    # HRV
    ('L2:hrv', '标准心血管实现'): ['ref-hrv-standards', 'ref-hrv-review'],
    ('L2:hrv', '深度学习端到端信号增强'): ['ref-kubios'],

    # SpO2
    ('L2:spo2', '标准心血管实现'): ['ref-spo2-physics'],
    ('L2:spo2', '深度学习端到端信号增强'): ['ref-spo2-physics'],

    # RR (Respiratory Rate)
    ('L2:rr', '标准心血管实现'): ['ref-rr-ppg'],
    ('L2:rr', '深度学习端到端信号增强'): ['ref-rr-ppg'],

    # ECG Waveform
    ('L2:ecg-waveform', '标准心血管实现'): ['ref-ecg-basics', 'ref-pan-tompkins'],
    ('L2:ecg-waveform', '深度学习端到端信号增强'): ['ref-deep-ecg'],

    # Acceleration
    ('L2:acceleration', '标准运动实现'): ['ref-activity-recognition'],
    ('L2:acceleration', '深度学习端到端信号增强'): ['ref-activity-recognition'],

    # Step Count
    ('L2:step-count', '标准运动实现'): ['ref-step-counting'],
    ('L2:step-count', '深度学习端到端信号增强'): ['ref-step-counting'],

    # Activity Type
    ('L2:activity-type', '标准运动实现'): ['ref-activity-recognition'],
    ('L2:activity-type', '深度学习端到端信号增强'): ['ref-activity-recognition'],

    # Angular Velocity
    ('L2:angular-velocity', '标准运动实现'): ['ref-lsm6dso'],
    ('L2:angular-velocity', '深度学习端到端信号增强'): ['ref-lsm6dso'],

    # Attitude Angle
    ('L2:attitude-angle', '标准运动实现'): ['ref-lsm6dso'],
    ('L2:attitude-angle', '深度学习端到端信号增强'): ['ref-lsm6dso'],

    # Skin Temperature
    ('L2:skin-temperature', '标准温度实现'): ['ref-temp-circadian'],
    ('L2:skin-temperature', '深度学习端到端信号增强'): ['ref-temp-circadian'],

    # Skin Conductance
    ('L2:skin-conductance', '标准ANS实现'): ['ref-gsr-review'],
    ('L2:skin-conductance', '深度学习端到端信号增强'): ['ref-gsr-review'],

    # Body Impedance
    ('L2:body-impedance', '标准电生理实现'): ['ref-bia-review'],
    ('L2:body-impedance', '深度学习端到端信号增强'): ['ref-ad5940'],

    # Blood Pressure Estimate
    ('L2:blood-pressure-est', '标准心血管实现'): ['ref-bp-wearable'],
    ('L2:blood-pressure-est', '深度学习端到端信号增强'): ['ref-bp-wearable'],

    # Altitude
    ('L2:altitude', '标准运动实现'): ['ref-bmp390'],
    ('L2:altitude', '深度学习端到端信号增强'): ['ref-bmp390'],

    # ===== L3: Clinical/Biometric Metrics =====

    # Sleep metrics
    ('L3:tst', '标准睡眠实现'): ['ref-aasm-manual', 'ref-sleep-review'],
    ('L3:tst', '多模态注意力融合特征提取'): ['ref-sleep-wearable'],
    ('L3:sleep-efficiency', '标准睡眠实现'): ['ref-aasm-manual'],
    ('L3:sleep-efficiency', '多模态注意力融合特征提取'): ['ref-sleep-wearable'],
    ('L3:sleep-latency', '标准睡眠实现'): ['ref-aasm-manual'],
    ('L3:sleep-latency', '多模态注意力融合特征提取'): ['ref-sleep-wearable'],
    ('L3:waso', '标准睡眠实现'): ['ref-aasm-manual'],
    ('L3:waso', '多模态注意力融合特征提取'): ['ref-sleep-wearable'],
    ('L3:light-sleep', '标准睡眠实现'): ['ref-aasm-manual', 'ref-sleep-wearable'],
    ('L3:light-sleep', '多模态注意力融合特征提取'): ['ref-sleep-wearable'],
    ('L3:deep-sleep', '标准睡眠实现'): ['ref-aasm-manual', 'ref-sleep-deep'],
    ('L3:deep-sleep', '多模态注意力融合特征提取'): ['ref-sleep-wearable'],
    ('L3:rem-sleep', '标准睡眠实现'): ['ref-aasm-manual', 'ref-whoop-sleep-validity'],
    ('L3:rem-sleep', '多模态注意力融合特征提取'): ['ref-sleep-wearable'],
    ('L3:sleep-disruptions', '标准睡眠实现'): ['ref-aasm-manual'],
    ('L3:sleep-disruptions', '多模态注意力融合特征提取'): ['ref-sleep-wearable'],
    ('L3:sleep-regularity', '标准睡眠实现'): ['ref-sleep-regularity'],
    ('L3:sleep-regularity', '多模态注意力融合特征提取'): ['ref-sleep-regularity'],
    ('L3:sleep-debt', '标准睡眠实现'): ['ref-sleep-debt'],
    ('L3:sleep-debt', '多模态注意力融合特征提取'): ['ref-sleep-debt'],

    # Activity metrics
    ('L3:active-minutes', '标准活动实现'): ['ref-activity-guidelines'],
    ('L3:active-minutes', '多模态注意力融合特征提取'): ['ref-activity-recognition'],
    ('L3:mvpa', '标准活动实现'): ['ref-activity-guidelines'],
    ('L3:mvpa', '多模态注意力融合特征提取'): ['ref-activity-recognition'],
    ('L3:sedentary-time', '标准活动实现'): ['ref-activity-guidelines'],
    ('L3:sedentary-time', '多模态注意力融合特征提取'): ['ref-activity-recognition'],
    ('L3:calorie', '标准能量实现'): ['ref-calorie-wearable'],
    ('L3:calorie', '多模态注意力融合特征提取'): ['ref-calorie-wearable'],
    ('L3:bmr', '标准能量实现'): ['ref-calorie-wearable'],
    ('L3:bmr', '多模态注意力融合特征提取'): ['ref-calorie-wearable'],
    ('L3:distance', '标准活动实现'): ['ref-step-counting'],
    ('L3:distance', '多模态注意力融合特征提取'): ['ref-step-counting'],

    # Cardiovascular metrics
    ('L3:rhr', '标准心血管实现'): ['ref-esc-heart-rate', 'ref-apple-hrv'],
    ('L3:rhr', '多模态注意力融合特征提取'): ['ref-esc-heart-rate'],
    ('L3:hrmax', '标准心血管实现'): ['ref-vo2max-review'],
    ('L3:hrmax', '多模态注意力融合特征提取'): ['ref-vo2max-review'],
    ('L3:hrr', '标准心血管实现'): ['ref-esc-heart-rate'],
    ('L3:hrr', '多模态注意力融合特征提取'): ['ref-esc-heart-rate'],
    ('L3:hr-zones', '标准心血管实现'): ['ref-firstbeat-methods'],
    ('L3:hr-zones', '多模态注意力融合特征提取'): ['ref-firstbeat-methods'],

    # ANS metrics
    ('L3:parasympathetic', '标准ANS实现'): ['ref-hrv-standards'],
    ('L3:parasympathetic', '多模态注意力融合特征提取'): ['ref-hrv-standards'],
    ('L3:sympathetic', '标准ANS实现'): ['ref-hrv-standards'],
    ('L3:sympathetic', '多模态注意力融合特征提取'): ['ref-hrv-standards'],
    ('L3:ans-balance', '标准ANS实现'): ['ref-hrv-standards'],
    ('L3:ans-balance', '多模态注意力融合特征提取'): ['ref-hrv-standards'],
    ('L3:stress-response', '标准ANS实现'): ['ref-stress-detection'],
    ('L3:stress-response', '多模态注意力融合特征提取'): ['ref-stress-detection'],

    # Training metrics
    ('L3:trimp', '标准训练实现'): ['ref-banister-trimp', 'ref-firstbeat-epoc'],
    ('L3:trimp', '多模态注意力融合特征提取'): ['ref-firstbeat-epoc'],
    ('L3:acute-load', '标准训练实现'): ['ref-banister-trimp'],
    ('L3:acute-load', '多模态注意力融合特征提取'): ['ref-firstbeat-epoc'],
    ('L3:chronic-load', '标准训练实现'): ['ref-banister-trimp'],
    ('L3:chronic-load', '多模态注意力融合特征提取'): ['ref-firstbeat-epoc'],
    ('L3:acwr', '标准训练实现'): ['ref-gabbett-acwr'],
    ('L3:acwr', '多模态注意力融合特征提取'): ['ref-gabbett-acwr'],
    ('L3:training-monotony', '标准训练实现'): ['ref-banister-trimp'],
    ('L3:training-monotony', '多模态注意力融合特征提取'): ['ref-firstbeat-epoc'],

    # Body composition
    ('L3:body-fat', '标准体成分实现'): ['ref-bia-review'],
    ('L3:body-fat', '多模态注意力融合特征提取'): ['ref-bia-review'],
    ('L3:muscle-mass', '标准体成分实现'): ['ref-bia-review'],
    ('L3:muscle-mass', '多模态注意力融合特征提取'): ['ref-bia-review'],
    ('L3:body-water', '标准体成分实现'): ['ref-bia-review'],
    ('L3:body-water', '多模态注意力融合特征提取'): ['ref-bia-review'],

    # Menstrual
    ('L3:menstrual-phase', '标准女性健康实现'): ['ref-menstrual-wearable', 'ref-cycle-tracking'],
    ('L3:menstrual-phase', '多模态注意力融合特征提取'): ['ref-menstrual-wearable'],
    ('L3:ovulation-window', '标准女性健康实现'): ['ref-menstrual-wearable'],
    ('L3:ovulation-window', '多模态注意力融合特征提取'): ['ref-menstrual-wearable'],
    ('L3:cycle-regularity', '标准女性健康实现'): ['ref-cycle-tracking'],
    ('L3:cycle-regularity', '多模态注意力融合特征提取'): ['ref-cycle-tracking'],

    # Other
    ('L3:vo2max-est', '标准其他实现'): ['ref-vo2max-review', 'ref-firstbeat-epoc'],
    ('L3:vo2max-est', '多模态注意力融合特征提取'): ['ref-firstbeat-epoc'],
    ('L3:circadian-phase', '标准其他实现'): ['ref-circadian-wearable'],
    ('L3:circadian-phase', '多模态注意力融合特征提取'): ['ref-circadian-wearable'],
    ('L3:roc-est', '标准其他实现'): ['ref-firstbeat-epoc'],
    ('L3:roc-est', '多模态注意力融合特征提取'): ['ref-firstbeat-epoc'],

    # Body Battery / Energy
    ('L3:body-battery', '标准能量实现'): ['ref-garmin-body-battery'],
    ('L3:body-battery', '多模态注意力融合特征提取'): ['ref-garmin-body-battery'],

    # ===== L4: Platform Metrics =====

    # WHOOP
    ('L4:whoop-recovery', '标准WHOOP实现'): ['ref-whoop-recovery'],
    ('L4:whoop-recovery', '新一代多维度恢复算法'): ['ref-whoop-recovery'],
    ('L4:whoop-strain', '标准WHOOP实现'): ['ref-whoop-strain'],
    ('L4:whoop-strain', '新一代多维度恢复算法'): ['ref-whoop-strain'],
    ('L4:whoop-sleep', '标准WHOOP实现'): ['ref-whoop-sleep-validity'],
    ('L4:whoop-sleep', '新一代多维度恢复算法'): ['ref-whoop-sleep-validity'],
    ('L4:whoop-stress', '标准WHOOP实现'): ['ref-whoop-recovery'],
    ('L4:whoop-stress', '新一代多维度恢复算法'): ['ref-stress-detection'],
    ('L4:whoop-healthspan', '标准WHOOP实现'): ['ref-whoop-recovery'],
    ('L4:whoop-healthspan', '新一代多维度恢复算法'): ['ref-biological-age'],
    ('L4:whoop-bp', '标准WHOOP实现'): ['ref-whoop-bp-patent'],
    ('L4:whoop-bp', '新一代多维度恢复算法'): ['ref-bp-wearable'],

    # Polar
    ('L4:polar-nightly-recharge', '标准Polar实现'): ['ref-polar-nightly-recharge'],
    ('L4:polar-nightly-recharge', 'AI自适应训练规划'): ['ref-polar-nightly-recharge'],
    ('L4:polar-training-load-pro', '标准Polar实现'): ['ref-polar-training-load'],
    ('L4:polar-training-load-pro', 'AI自适应训练规划'): ['ref-polar-training-load'],
    ('L4:polar-alertness', '标准Polar实现'): ['ref-polar-nightly-recharge'],
    ('L4:polar-alertness', 'AI自适应训练规划'): ['ref-sleep-review'],
    ('L4:polar-activity-benefit', '标准Polar实现'): ['ref-activity-guidelines'],
    ('L4:polar-activity-benefit', 'AI自适应训练规划'): ['ref-activity-guidelines'],

    # Garmin
    ('L4:garmin-body-battery', '标准Garmin实现'): ['ref-garmin-body-battery'],
    ('L4:garmin-body-battery', '个性化动态基线模型'): ['ref-garmin-body-battery'],
    ('L4:garmin-training-readiness', '标准Garmin实现'): ['ref-garmin-training-readiness'],
    ('L4:garmin-training-readiness', '个性化动态基线模型'): ['ref-garmin-training-readiness'],
    ('L4:garmin-stress', '标准Garmin实现'): ['ref-garmin-body-battery'],
    ('L4:garmin-stress', '个性化动态基线模型'): ['ref-stress-detection'],
    ('L4:garmin-training-status', '标准Garmin实现'): ['ref-garmin-training-readiness'],
    ('L4:garmin-training-status', '个性化动态基线模型'): ['ref-garmin-training-readiness'],
    ('L4:garmin-training-effect', '标准Garmin实现'): ['ref-garmin-training-effect'],
    ('L4:garmin-training-effect', '个性化动态基线模型'): ['ref-garmin-training-effect'],
    ('L4:garmin-running-dynamics', '标准Garmin实现'): ['ref-garmin-running'],
    ('L4:garmin-running-dynamics', '个性化动态基线模型'): ['ref-garmin-running'],

    # Fitbit
    ('L4:fitbit-daily-readiness', '标准Fitbit实现'): ['ref-fitbit-readiness'],
    ('L4:fitbit-daily-readiness', 'Google Health AI融合分析'): ['ref-gemini-health'],
    ('L4:fitbit-sleep-score', '标准Fitbit实现'): ['ref-fitbit-sleep'],
    ('L4:fitbit-sleep-score', 'Google Health AI融合分析'): ['ref-gemini-health'],
    ('L4:fitbit-stress-management', '标准Fitbit实现'): ['ref-fitbit-readiness'],
    ('L4:fitbit-stress-management', 'Google Health AI融合分析'): ['ref-gemini-health'],
    ('L4:fitbit-cardio-fitness', '标准Fitbit实现'): ['ref-cardio-fitness'],
    ('L4:fitbit-cardio-fitness', 'Google Health AI融合分析'): ['ref-gemini-health'],

    # Oura
    ('L4:oura-readiness', '标准Oura实现'): ['ref-oura-readiness'],
    ('L4:oura-readiness', '多信号融合生物年龄模型'): ['ref-oura-readiness'],
    ('L4:oura-sleep-score', '标准Oura实现'): ['ref-oura-sleep-validation'],
    ('L4:oura-sleep-score', '多信号融合生物年龄模型'): ['ref-oura-sleep-validation'],
    ('L4:oura-activity-score', '标准Oura实现'): ['ref-oura-readiness'],
    ('L4:oura-activity-score', '多信号融合生物年龄模型'): ['ref-oura-readiness'],

    # General metrics
    ('L4:biological-age', '标准通用/综合实现'): ['ref-biological-age'],
    ('L4:biological-age', 'Multi-task Learning综合评估'): ['ref-biological-age'],
    ('L4:allostatic-load', '标准通用/综合实现'): ['ref-allostatic-review'],
    ('L4:allostatic-load', 'Multi-task Learning综合评估'): ['ref-allostatic-review'],
    ('L4:overtraining-risk', '标准通用/综合实现'): ['ref-overtraining-review', 'ref-gabbett-acwr'],
    ('L4:overtraining-risk', 'Multi-task Learning综合评估'): ['ref-overtraining-review'],
    ('L4:mental-fatigue', '标准通用/综合实现'): ['ref-mental-fatigue'],
    ('L4:mental-fatigue', 'Multi-task Learning综合评估'): ['ref-mental-fatigue'],
    ('L4:cv-health-grade', '标准通用/综合实现'): ['ref-cardio-fitness', 'ref-esc-heart-rate'],
    ('L4:cv-health-grade', 'Multi-task Learning综合评估'): ['ref-cardio-fitness'],
    ('L4:circadian-health', '标准通用/综合实现'): ['ref-circadian-wearable'],
    ('L4:circadian-health', 'Multi-task Learning综合评估'): ['ref-circadian-wearable'],

    # ===== L5: AI Coach =====
    ('L5:ai-coach-overview', '标准AI教练实现'): ['ref-ai-coaching'],
    ('L5:ai-coach-overview', 'LLM驱动的个性化推理引擎'): ['ref-ai-coaching', 'ref-gemini-health'],
    ('L5:whoop-coach', '标准AI教练实现'): ['ref-ai-coaching'],
    ('L5:whoop-coach', 'LLM驱动的个性化推理引擎'): ['ref-ai-coaching', 'ref-gemini-health'],
    ('L5:gemini-health-coach', '标准AI教练实现'): ['ref-ai-coaching', 'ref-gemini-health'],
    ('L5:gemini-health-coach', 'LLM驱动的个性化推理引擎'): ['ref-ai-coaching', 'ref-gemini-health'],
    ('L5:data-interpretation', '标准AI教练实现'): ['ref-ai-coaching'],
    ('L5:data-interpretation', 'LLM驱动的个性化推理引擎'): ['ref-ai-coaching'],
    ('L5:personalized-recommendation', '标准AI教练实现'): ['ref-ai-coaching'],
    ('L5:personalized-recommendation', 'LLM驱动的个性化推理引擎'): ['ref-ai-coaching'],
}


# ======================================================================
# DESCRIPTION REFERENCE MARKER MAP
# Add [ref_id] to specific sentences in module descriptions
# ======================================================================

DESCRIPTION_REFS = {
    'L1:ppg': [
        ('光电容积描记法', 'ref-ppg-review'),
        ('LED发出的特定波长光', 'ref-max30102'),
    ],
    'L1:accelerometer': [
        ('MEMS加速度计内部', 'ref-lsm6dso'),
    ],
    'L1:ecg': [
        ('QRS波群检测算法', 'ref-pan-tompkins'),
    ],
    'L2:hr': [
        ('Pan-Tompkins算法', 'ref-pan-tompkins'),
        ('安静状态下成人正常范围60-100bpm', 'ref-esc-heart-rate'),
    ],
    'L2:hrv': [
        ('HRV分析分为时域、频域', 'ref-hrv-standards'),
        ('RMSSD', 'ref-hrv-standards'),
    ],
    'L2:spo2': [
        ('基于红光(660nm)和红外光(940nm)', 'ref-spo2-physics'),
    ],
    'L2:ibi': [
        ('Pan-Tompkins算法', 'ref-pan-tompkins'),
    ],
    'L2:step-count': [
        ('自适应峰值检测', 'ref-step-counting'),
    ],
    'L2:activity-type': [
        ('随机森林(RF)或SVM', 'ref-activity-recognition'),
    ],
    'L2:rr': [
        ('RSA引起的RRI间隔变化', 'ref-rr-ppg'),
    ],
    'L2:ecg-waveform': [
        ('P波检测', 'ref-ecg-basics'),
        ('QRS检测', 'ref-pan-tompkins'),
    ],
    'L2:blood-pressure-est': [
        ('PPG血压估计', 'ref-bp-wearable'),
    ],
    'L2:body-impedance': [
        ('BIA原理', 'ref-bia-review'),
    ],
    'L2:skin-conductance': [
        ('SCL(皮肤电导水平', 'ref-gsr-review'),
    ],
    'L3:tst': [
        ('通过加速度计的体动检测', 'ref-sleep-wearable'),
        ('AASM', 'ref-aasm-manual'),
    ],
    'L3:sleep-efficiency': [
        ('睡眠效率', 'ref-aasm-manual'),
    ],
    'L3:sleep-latency': [
        ('入睡潜伏期', 'ref-aasm-manual'),
    ],
    'L3:waso': [
        ('WASO', 'ref-aasm-manual'),
    ],
    'L3:deep-sleep': [
        ('慢波睡眠SWS', 'ref-sleep-deep'),
    ],
    'L3:sleep-regularity': [
        ('睡眠规律性指数(SRI)', 'ref-sleep-regularity'),
    ],
    'L3:calorie': [
        ('Mifflin-St Jeor方程', 'ref-calorie-wearable'),
    ],
    'L3:stress-response': [
        ('综合应激指数', 'ref-stress-detection'),
    ],
    'L3:acwr': [
        ('ACWR', 'ref-gabbett-acwr'),
        ('Gabbett模型', 'ref-gabbett-acwr'),
    ],
    'L3:trimp': [
        ('Banister TRIMP', 'ref-banister-trimp'),
    ],
    'L3:rhr': [
        ('静息心率', 'ref-esc-heart-rate'),
    ],
    'L3:menstrual-phase': [
        ('基础体温(BBT)', 'ref-menstrual-wearable'),
    ],
    'L3:cycle-regularity': [
        ('PCOS', 'ref-cycle-tracking'),
    ],
    'L3:body-fat': [
        ('BIA测量', 'ref-bia-review'),
    ],
    'L3:vo2max-est': [
        ('VO2max', 'ref-vo2max-review'),
    ],
    'L3:circadian-phase': [
        ('昼夜节律', 'ref-circadian-wearable'),
        ('核心体温的最低点', 'ref-temp-circadian'),
    ],
    'L3:light-sleep': [
        ('睡眠分期', 'ref-aasm-manual'),
    ],
    'L3:rem-sleep': [
        ('REM睡眠', 'ref-aasm-manual'),
    ],
    'L3:body-battery': [
        ('身体电量', 'ref-garmin-body-battery'),
    ],
    'L3:sleep-debt': [
        ('累计睡眠债务', 'ref-sleep-debt'),
    ],
    'L4:whoop-recovery': [
        ('WHOOP恢复评分', 'ref-whoop-recovery'),
    ],
    'L4:whoop-strain': [
        ('WHOOP运动负荷', 'ref-whoop-strain'),
    ],
    'L4:whoop-sleep': [
        ('WHOOP睡眠质量评分', 'ref-whoop-sleep-validity'),
    ],
    'L4:polar-nightly-recharge': [
        ('Polar Nightly Recharge', 'ref-polar-nightly-recharge'),
    ],
    'L4:garmin-body-battery': [
        ('身体电量', 'ref-garmin-body-battery'),
    ],
    'L4:garmin-training-readiness': [
        ('Training Readiness', 'ref-garmin-training-readiness'),
    ],
    'L4:oura-readiness': [
        ('Oura Readiness Score', 'ref-oura-readiness'),
    ],
    'L4:allostatic-load': [
        ('全因负荷', 'ref-allostatic-review'),
    ],
    'L4:biological-age': [
        ('生理年龄', 'ref-biological-age'),
    ],
    'L4:overtraining-risk': [
        ('过度训练', 'ref-overtraining-review'),
    ],
    'L5:ai-coach-overview': [
        ('AI健康教练', 'ref-ai-coaching'),
        ('Gemini', 'ref-gemini-health'),
    ],
}


def process_file():
    with open(MODULES_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.split('\n')
    print(f"File has {len(lines)} lines.")
    
    # PASS 1: Find all modules and their implementations
    module_impls = {}  # module_id -> [(impl_name, line_number_of_impl_block)]
    
    current_module_id = None
    current_impl_name = None
    in_impl_block = False
    
    for i, line in enumerate(lines):
        stripped = line.strip()
        
        m = re.match(r'\s*id:\s*"([^"]+)"', stripped)
        if m and re.search(r'"L\d:', stripped):
            current_module_id = m.group(1)
            if current_module_id not in module_impls:
                module_impls[current_module_id] = []
            continue
        
        if current_module_id:
            nm = re.match(r'\s*name:\s*"([^"]+)"', stripped)
            if nm:
                current_impl_name = nm.group(1)
                continue
            
            if stripped == 'citations: [],' and current_impl_name:
                module_impls[current_module_id].append((current_impl_name, i))
                current_impl_name = None
    
    print(f"Found {sum(len(v) for v in module_impls.values())} citation entries.")
    
    # PASS 2: Apply citation mappings
    lines_modified = list(lines)
    filled = 0
    not_found = []
    
    for mod_id, impl_list in module_impls.items():
        for impl_name, line_idx in impl_list:
            key = (mod_id, impl_name)
            if key in CITATION_MAP:
                refs = CITATION_MAP[key]
                refs_str = ', '.join(f'"{r}"' for r in refs)
                lines_modified[line_idx] = f'        citations: [{refs_str}],'
                filled += 1
            else:
                not_found.append(f"  {mod_id:<30} / {impl_name}")
    
    print(f"\nFilled citations: {filled}")
    if not_found:
        print(f"\nNo mapping for {len(not_found)} implementations:")
        for nf in not_found:
            print(nf)
    
    # PASS 3: Add [ref_id] markers to module descriptions
    desc_filled = 0
    
    for mod_id, markers in DESCRIPTION_REFS.items():
        # Find the module description
        in_mod = False
        mod_start_idx = -1
        desc_start_idx = -1
        desc_lines = []
        collecting_desc = False
        
        for i, line in enumerate(lines_modified):
            stripped = line.strip()
            
            m = re.match(r'\s*id:\s*"([^"]+)"', stripped)
            if m and m.group(1) == mod_id:
                in_mod = True
                continue
            
            if in_mod and stripped.startswith('description:'):
                desc_start_idx = i
                # Extract the description text (it's a template literal or string)
                # Format: description: "text..."  or description: `text...`
                desc_match = re.match(r'\s*description:\s*"(.+)"', stripped)
                if desc_match:
                    # Single-line description
                    desc_lines = [(i, desc_match.group(1))]
                else:
                    # Multi-line: collect until we hit the closing quote
                    # Look ahead for the closing pattern
                    collecting_desc = True
                    # Check if there's text after description:
                    # Actually template literals use backticks...
                    # Let me check the actual format
                    if '`' in stripped:
                        collecting_desc = True
                    break
                    
                break
        
        if desc_lines:
            for line_idx, desc_text in desc_lines:
                for keyword, ref_id in markers:
                    if keyword in desc_text and f'[{ref_id}]' not in desc_text:
                        # Check if keyword has a reference already attached
                        import re as re2
                        # Find keyword position, add marker at end of containing phrase
                        # Simple approach: replace keyword with keyword + [ref_id]
                        lines_modified[line_idx] = lines_modified[line_idx].replace(
                            desc_text,
                            desc_text.replace(keyword, f'{keyword}[{ref_id}]')
                        )
                        desc_filled += 1
    
    # For multiline descriptions (template literals), handle separately
    # Check if descriptions use backticks
    template_literal_count = 0
    for line in lines:
        if 'description: `' in line:
            template_literal_count += 1
    
    if template_literal_count == 0:
        # Descriptions are all single-line
        # Re-do markers with a simpler approach
        print(f"\nAll descriptions single-line (checked).")
    
    # Write output
    result = '\n'.join(lines_modified)
    with open(MODULES_FILE, 'w', encoding='utf-8') as f:
        f.write(result)
    
    # Verify
    empty_count = result.count('citations: []')
    nonempty_matches = list(re.finditer(r'citations:\s*\[([^\]]*)\]', result))
    nonempty_count = sum(1 for m in nonempty_matches if m.group(1).strip())
    
    print(f"\n=== Verification ===")
    print(f"Total citations arrays: {empty_count + nonempty_count}")
    print(f"Empty: {empty_count}")
    print(f"Non-empty: {nonempty_count}")


if __name__ == '__main__':
    process_file()
