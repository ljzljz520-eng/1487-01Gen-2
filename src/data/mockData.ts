import type { TestCategory, AllergyRecord, PatientData } from '@/types/patient';

export const mockTestCategories: TestCategory[] = [
  {
    id: 'blood',
    name: '血液检查',
    description: '常规血液检查项目',
    items: [
      { id: 'blood_001', name: '血常规', code: 'CBC', price: 35, categoryId: 'blood', description: '白细胞、红细胞、血小板等' },
      { id: 'blood_002', name: '生化全套', code: 'BIO-FULL', price: 280, categoryId: 'blood', description: '肝肾功能、血糖、血脂等' },
      { id: 'blood_003', name: '肝功能', code: 'LFT', price: 85, categoryId: 'blood', description: '谷丙转氨酶、谷草转氨酶等' },
      { id: 'blood_004', name: '肾功能', code: 'RFT', price: 65, categoryId: 'blood', description: '肌酐、尿素氮等' },
      { id: 'blood_005', name: '血糖', code: 'GLU', price: 15, categoryId: 'blood', description: '空腹血糖检测' },
      { id: 'blood_006', name: '血脂四项', code: 'LIPID-4', price: 120, categoryId: 'blood', description: '总胆固醇、甘油三酯等' },
      { id: 'blood_007', name: '凝血功能', code: 'COAG', price: 150, categoryId: 'blood', description: 'PT、APTT、纤维蛋白原等' },
      { id: 'blood_008', name: '甲状腺功能', code: 'THYROID', price: 240, categoryId: 'blood', description: 'TSH、T3、T4等' }
    ],
    packages: [
      {
        id: 'pkg_blood_001',
        name: '入职体检套餐',
        itemIds: ['blood_001', 'blood_003', 'blood_004', 'blood_005', 'blood_006'],
        price: 320,
        discountPrice: 280
      },
      {
        id: 'pkg_blood_002',
        name: '全面体检套餐',
        itemIds: ['blood_001', 'blood_002', 'blood_007', 'blood_008'],
        price: 725,
        discountPrice: 650
      }
    ]
  },
  {
    id: 'imaging',
    name: '影像学检查',
    description: 'X光、CT、MRI等影像检查',
    items: [
      { id: 'img_001', name: '胸部X光', code: 'CXR', price: 120, categoryId: 'imaging', description: '胸部正侧位片' },
      { id: 'img_002', name: '胸部CT', code: 'CHEST-CT', price: 480, categoryId: 'imaging', description: '胸部平扫CT' },
      { id: 'img_003', name: '头颅CT', code: 'HEAD-CT', price: 450, categoryId: 'imaging', description: '头部平扫CT' },
      { id: 'img_004', name: '腹部B超', code: 'ABDOMEN-US', price: 180, categoryId: 'imaging', description: '肝、胆、胰、脾、双肾' },
      { id: 'img_005', name: '心电图', code: 'ECG', price: 45, categoryId: 'imaging', description: '常规12导联心电图' },
      { id: 'img_006', name: '心脏彩超', code: 'ECHO', price: 280, categoryId: 'imaging', description: '心脏结构及功能评估' }
    ]
  },
  {
    id: 'urine',
    name: '尿液检查',
    description: '尿常规及相关检查',
    items: [
      { id: 'urine_001', name: '尿常规', code: 'UA', price: 25, categoryId: 'urine', description: '尿蛋白、尿糖、潜血等' },
      { id: 'urine_002', name: '尿沉渣', code: 'US-SED', price: 35, categoryId: 'urine', description: '尿液有形成分分析' },
      { id: 'urine_003', name: '尿微量白蛋白', code: 'U-ALB', price: 45, categoryId: 'urine', description: '早期肾损伤指标' }
    ]
  },
  {
    id: 'microbiology',
    name: '微生物检查',
    description: '细菌、病毒等微生物检测',
    items: [
      { id: 'micro_001', name: '血常规+CRP', code: 'CBC+CRP', price: 65, categoryId: 'microbiology', description: '炎症指标筛查' },
      { id: 'micro_002', name: '降钙素原', code: 'PCT', price: 180, categoryId: 'microbiology', description: '细菌感染指标' },
      { id: 'micro_003', name: '血培养', code: 'BC', price: 150, categoryId: 'microbiology', description: '血液细菌培养+药敏' }
    ]
  }
];

export const mockPatientData: Partial<PatientData> = {
  name: '张三',
  gender: 'male',
  age: 35,
  idCard: '110101199001011234',
  phone: '13812345678',
  address: '北京市朝阳区建国路88号SOHO现代城A座1201室',
  bloodType: 'A',
  maritalStatus: 'married'
};

export const mockAllergyRecords: AllergyRecord[] = [
  {
    id: 'allergy_001',
    type: 'drug',
    allergen: '青霉素',
    severity: 'severe',
    reaction: '皮疹、呼吸困难、过敏性休克',
    onsetDate: '2015-03-15',
    notes: '静脉滴注后5分钟出现严重过敏反应，经抢救恢复'
  },
  {
    id: 'allergy_002',
    type: 'food',
    allergen: '花生',
    severity: 'moderate',
    reaction: '口腔瘙痒、皮疹',
    onsetDate: '2010-06-20',
    notes: '食用后30分钟内出现症状'
  }
];

export const mockSelectedTestItems = ['blood_001', 'blood_003', 'blood_005', 'img_001', 'urine_001'];
