import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Copy, Check, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardBody, Button } from '@/components/ui';
import { maskIdCard, maskPhone, maskAddress, maskName, maskAllergen } from '@/utils/privacyMask';

const examples = [
  {
    field: 'name',
    label: '患者姓名',
    original: '张明华',
    masked: maskName('张明华'),
    description: '显示姓氏，隐藏名字部分',
    icon: '👤'
  },
  {
    field: 'idCard',
    label: '身份证号',
    original: '110101199001011234',
    masked: maskIdCard('110101199001011234'),
    description: '显示前6位和后4位，中间8位隐藏',
    icon: '🆔'
  },
  {
    field: 'phone',
    label: '手机号码',
    original: '13812345678',
    masked: maskPhone('13812345678'),
    description: '显示前3位和后4位，中间4位隐藏',
    icon: '📱'
  },
  {
    field: 'address',
    label: '家庭住址',
    original: '北京市朝阳区建国路88号SOHO现代城A座1201室',
    masked: maskAddress('北京市朝阳区建国路88号SOHO现代城A座1201室'),
    description: '保留城市和区县信息，隐藏详细门牌号码',
    icon: '🏠'
  },
  {
    field: 'allergen',
    label: '过敏原信息',
    original: '青霉素、头孢菌素',
    masked: maskAllergen('青霉素、头孢菌素'),
    description: '完全隐藏敏感医疗信息',
    icon: '💊'
  }
];

const maskRules = [
  {
    type: '身份证号',
    pattern: '前6后4',
    example: '110101********1234',
    regex: '/^[1-9]\\\\d{5}(19|20)\\\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\\\d|3[01])\\\\d{3}[\\\\dXx]$/',
    useCase: '患者身份识别、医保报销'
  },
  {
    type: '手机号码',
    pattern: '前3后4',
    example: '138****5678',
    regex: '/^1[3-9]\\\\d{9}$/',
    useCase: '预约通知、结果查询'
  },
  {
    type: '家庭住址',
    pattern: '保留前6字符',
    example: '北京市朝阳区****',
    regex: '/^[\\u4e00-\\u9fa5a-zA-Z0-9]+$/',
    useCase: '病历记录、随访管理'
  },
  {
    type: '患者姓名',
    pattern: '保留姓氏',
    example: '张*',
    regex: '/^[\\u4e00-\\u9fa5]{2,20}$/',
    useCase: '叫号系统、公开列表'
  },
  {
    type: '敏感医疗信息',
    pattern: '全部隐藏',
    example: '******',
    regex: '/^.+$/',
    useCase: '过敏史、既往病史、诊断结果'
  }
];

const triggerScenarios = [
  {
    scenario: '表单提交后',
    description: '患者信息提交保存后，查看历史记录时自动应用遮罩',
    icon: '📋'
  },
  {
    scenario: '非授权用户访问',
    description: '未获得隐私查看权限的用户查看患者信息时',
    icon: '🔒'
  },
  {
    scenario: '历史记录查看',
    description: '查看既往病历、检验报告等历史数据时',
    icon: '📜'
  },
  {
    scenario: '列表展示',
    description: '患者列表、预约列表等批量展示场景',
    icon: '📊'
  },
  {
    scenario: '数据导出',
    description: '导出患者数据用于统计分析时',
    icon: '📤'
  }
];

const authMethods = [
  {
    method: '密码验证',
    description: '输入个人密码验证身份后解锁',
    level: '低',
    color: 'bg-medical-green-100 text-medical-green-700'
  },
  {
    method: '指纹识别',
    description: '生物特征识别验证',
    level: '中',
    color: 'bg-medical-blue-100 text-medical-blue-700'
  },
  {
    method: '人脸识别',
    description: '面部特征识别验证',
    level: '中',
    color: 'bg-medical-blue-100 text-medical-blue-700'
  },
  {
    method: '工牌刷卡',
    description: 'RFID工牌近距离感应',
    level: '高',
    color: 'bg-medical-purple-100 text-medical-purple-700'
  },
  {
    method: '双人复核',
    description: '需要两名授权人员同时确认',
    level: '最高',
    color: 'bg-medical-red-100 text-medical-red-700'
  }
];

export default function PrivacyDoc() {
  const [showOriginal, setShowOriginal] = useState<Record<string, boolean>>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const toggleOriginal = (field: string) => {
    setShowOriginal(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-5xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-medical-blue-100 mb-4">
            <Shield className="w-8 h-8 text-medical-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-3">医疗隐私字段遮罩规范</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            为保护患者隐私安全，医疗系统中的敏感信息需按照以下规范进行脱敏展示。
            所有遮罩规则符合《个人信息保护法》和《医疗数据安全规范》。
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-medical-blue-500" />
              遮罩效果示例
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {examples.map((example) => (
                <div
                  key={example.field}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-medical-blue-200 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{example.icon}</span>
                      <div>
                        <h3 className="font-semibold text-slate-700">{example.label}</h3>
                        <p className="text-sm text-slate-500">{example.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleOriginal(example.field)}
                        className="text-medical-blue-500 hover:text-medical-blue-600 hover:bg-medical-blue-50"
                      >
                        {showOriginal[example.field] ? (
                          <><EyeOff className="w-4 h-4 mr-1" /> 隐藏</>
                        ) : (
                          <><Eye className="w-4 h-4 mr-1" /> 查看原文</>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(example.original, example.field)}
                        className="text-slate-500 hover:text-slate-700"
                      >
                        {copiedField === example.field ? (
                          <><Check className="w-4 h-4 mr-1" /> 已复制</>
                        ) : (
                          <><Copy className="w-4 h-4 mr-1" /> 复制</>
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-slate-400 mb-1 uppercase tracking-wider">原始数据</div>
                      <div className={cn(
                        'font-mono text-sm p-3 rounded-lg border',
                        showOriginal[example.field]
                          ? 'bg-white text-slate-700 border-slate-200'
                          : 'bg-slate-100 text-slate-400 border-slate-200'
                      )}>
                        {showOriginal[example.field] ? example.original : '••••••••••'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1 uppercase tracking-wider">遮罩后展示</div>
                      <div className="font-mono text-sm p-3 rounded-lg bg-medical-blue-50 text-medical-blue-700 border border-medical-blue-200">
                        {example.masked}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Copy className="w-5 h-5 text-medical-purple-500" />
              遮罩规则对照表
            </CardTitle>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">字段类型</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">遮罩模式</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">示例</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">适用场景</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {maskRules.map((rule, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-700">{rule.type}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-medical-purple-100 text-medical-purple-700 rounded-full">
                          {rule.pattern}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <code className="font-mono text-sm text-medical-blue-600">{rule.example}</code>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-500">
                        {rule.useCase}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChevronRight className="w-5 h-5 text-medical-orange-500" />
                遮罩触发时机
              </CardTitle>
            </CardHeader>
            <CardBody>
              <ul className="space-y-3">
                {triggerScenarios.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <div className="font-medium text-slate-700">{item.scenario}</div>
                      <div className="text-sm text-slate-500 mt-0.5">{item.description}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-medical-green-500" />
                解锁验证方式
              </CardTitle>
            </CardHeader>
            <CardBody>
              <ul className="space-y-3">
                {authMethods.map((item, index) => (
                  <li key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-slate-600">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium text-slate-700">{item.method}</div>
                        <div className="text-sm text-slate-500 mt-0.5">{item.description}</div>
                      </div>
                    </div>
                    <span className={cn('badge', item.color)}>
                      安全等级：{item.level}
                    </span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-medical-teal-500" />
              法律法规依据
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-medical-blue-50 rounded-xl border border-medical-blue-100">
                <h4 className="font-semibold text-medical-blue-800 mb-2">《中华人民共和国个人信息保护法》</h4>
                <p className="text-sm text-medical-blue-700 leading-relaxed">
                  处理个人信息应当采取对个人权益影响最小的方式。处理敏感个人信息应当取得个人的单独同意，
                  并应当具有特定的目的和充分的必要性。
                </p>
              </div>
              <div className="p-4 bg-medical-green-50 rounded-xl border border-medical-green-100">
                <h4 className="font-semibold text-medical-green-800 mb-2">《医疗数据安全管理规范》</h4>
                <p className="text-sm text-medical-green-700 leading-relaxed">
                  医疗数据应当按照分级分类原则进行管理。涉及患者隐私的敏感数据在展示、传输、
                  存储过程中应当采取加密、脱敏、去标识化等保护措施。
                </p>
              </div>
              <div className="p-4 bg-medical-purple-50 rounded-xl border border-medical-purple-100">
                <h4 className="font-semibold text-medical-purple-800 mb-2">《医疗机构病历管理规定》</h4>
                <p className="text-sm text-medical-purple-700 leading-relaxed">
                  除为患者提供诊疗服务的医务人员，以及经卫生计生行政部门、中医药管理部门或者医疗机构授权的
                  负责病案管理、医疗管理的部门或者人员外，其他任何机构和个人不得擅自查阅患者病历。
                </p>
              </div>
              <div className="p-4 bg-medical-orange-50 rounded-xl border border-medical-orange-100">
                <h4 className="font-semibold text-medical-orange-800 mb-2">《网络安全法》</h4>
                <p className="text-sm text-medical-orange-700 leading-relaxed">
                  网络运营者应当对其收集的用户信息严格保密，并建立健全用户信息保护制度。
                  未经被收集者同意，不得向他人提供个人信息。但是，经过处理无法识别特定个人且不能复原的除外。
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="mt-8 text-center text-sm text-slate-400">
          <p>本规范版本：v1.0 | 最后更新：{new Date().toLocaleDateString('zh-CN')}</p>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
