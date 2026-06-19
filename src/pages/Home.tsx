import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Scissors, FlaskConical, User, AlertTriangle, PenLine, Shield, ChevronRight, Layers, CheckCircle, Zap, Eye } from 'lucide-react';
import { Button, Card, CardBody } from '@/components/ui';

const features = [
  {
    icon: <User className="w-6 h-6" />,
    title: '患者信息组件',
    description: '完整的患者基础信息录入，支持隐私字段自动脱敏'
  },
  {
    icon: <AlertTriangle className="w-6 h-6" />,
    title: '过敏史组件',
    description: '药物、食物等过敏史管理，严重程度分级标记'
  },
  {
    icon: <FlaskConical className="w-6 h-6" />,
    title: '检验项目选择',
    description: '分类展示、套餐选择、价格计算、搜索筛选'
  },
  {
    icon: <PenLine className="w-6 h-6" />,
    title: '签名确认组件',
    description: '支持触摸和鼠标签名，撤销、清空、图片导出'
  }
];

const demos = [
  {
    icon: <Stethoscope className="w-8 h-8" />,
    title: '内科入院记录',
    description: '患者信息 + 过敏史 + 签名确认',
    path: '/internal-medicine',
    color: 'bg-medical-blue-100 text-medical-blue-600',
    borderColor: 'border-medical-blue-200 hover:border-medical-blue-400'
  },
  {
    icon: <Scissors className="w-8 h-8" />,
    title: '外科手术知情同意书',
    description: '患者信息 + 过敏史 + 术前检查 + 签名',
    path: '/surgery',
    color: 'bg-medical-red-100 text-medical-red-600',
    borderColor: 'border-medical-red-200 hover:border-medical-red-400'
  },
  {
    icon: <FlaskConical className="w-8 h-8" />,
    title: '检验科申请单',
    description: '患者信息 + 检验项目选择 + 签名',
    path: '/laboratory',
    color: 'bg-medical-purple-100 text-medical-purple-600',
    borderColor: 'border-medical-purple-200 hover:border-medical-purple-400'
  }
];

const highlights = [
  {
    icon: <CheckCircle className="w-5 h-5" />,
    title: '必填校验',
    description: '内置必填项校验，支持自定义校验规则'
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: '实时验证',
    description: '输入时即时校验，友好的错误提示'
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: '只读模式',
    description: '支持只读展示，防止误操作'
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: '隐私保护',
    description: '敏感字段自动脱敏，符合医疗数据安全规范'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-br from-medical-blue-50 via-white to-medical-purple-50">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-medical-blue-200/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-medical-purple-200/30 rounded-full blur-3xl" />
        </div>
        
        <div className="container py-16 relative">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-medical-blue-100 text-medical-blue-700 rounded-full text-sm font-medium mb-6">
              <Layers className="w-4 h-4" />
              Web Components 组件库
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight">
              医院表单
              <span className="text-medical-blue-600"> Web Components</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              专业的医疗表单组件库，提供患者信息、过敏史、检验项目选择和签名确认等组件。
              支持必填校验、格式验证、只读模式和隐私字段遮罩，可灵活组合成不同科室的表单应用。
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/internal-medicine">
                <Button size="lg" className="px-8">
                  查看演示
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/privacy">
                <Button variant="secondary" size="lg" className="px-8">
                  <Shield className="w-4 h-4" />
                  隐私规范
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
            {highlights.map((item, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-slate-200 text-center hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-medical-blue-100 text-medical-blue-600 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-slate-800 mb-1.5">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-3">核心组件</h2>
          <p className="text-slate-500">四个可复用的专业医疗表单组件</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} hover className="h-full">
              <CardBody className="p-6">
                <div className="w-14 h-14 rounded-xl bg-medical-blue-100 text-medical-blue-600 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-3">科室表单示例</h2>
          <p className="text-slate-500">灵活组合组件，快速构建不同科室的专业表单</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {demos.map((demo, index) => (
            <Link key={index} to={demo.path}>
              <div className={cn(
                'h-full p-6 rounded-xl border-2 transition-all duration-300',
                'bg-white hover:shadow-card-hover hover:-translate-y-1 cursor-pointer',
                demo.borderColor
              )}>
                <div className={cn('w-16 h-16 rounded-xl flex items-center justify-center mb-4', demo.color)}>
                  {demo.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{demo.title}</h3>
                <p className="text-sm text-slate-500 mb-4">{demo.description}</p>
                <div className="flex items-center text-medical-blue-600 text-sm font-medium">
                  立即体验
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Card>
          <CardBody className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">快速开始使用</h2>
                <p className="text-slate-500 mb-6 leading-relaxed">
                  组件库提供完整的 TypeScript 类型支持，遵循 React 最佳实践。
                  每个组件都支持必填校验、自定义验证规则、只读模式和隐私数据脱敏。
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-medical-green-500 flex-shrink-0" />
                    <span className="text-slate-700">支持必填、格式、自定义多层校验</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-medical-green-500 flex-shrink-0" />
                    <span className="text-slate-700">身份证、手机号等隐私字段自动遮罩</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-medical-green-500 flex-shrink-0" />
                    <span className="text-slate-700">一键切换显示/隐藏敏感信息</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-medical-green-500 flex-shrink-0" />
                    <span className="text-slate-700">字段级别的只读/编辑控制</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900 rounded-xl p-6 font-mono text-sm overflow-x-auto">
                <pre className="text-slate-400 mb-2">// 基础使用示例</pre>
                <pre className="text-slate-300 whitespace-pre">
{`import { PatientInfo } from '@/components/PatientInfo';

const MyForm = () => {
  const [data, setData] = useState({});

  return (
    <PatientInfo
      value={data}
      onChange={setData}
      maskSensitiveData={true}
      fields={{ name: { required: true } }}
    />
  );
};`}
                </pre>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="bg-slate-800 text-white py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">医院表单 Web Components</h3>
              <p className="text-slate-400 text-sm">专业、安全、可复用的医疗表单组件库</p>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/privacy">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-700">
                  <Shield className="w-4 h-4 mr-2" />
                  隐私保护规范
                </Button>
              </Link>
              <Link to="/internal-medicine">
                <Button>
                  开始使用
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-700 text-center text-sm text-slate-500">
            <p>© {new Date().getFullYear()} 医院表单组件库 | 符合《个人信息保护法》医疗数据安全规范</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
