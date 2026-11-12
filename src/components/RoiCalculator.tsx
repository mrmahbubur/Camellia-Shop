import React, { useState, useMemo } from 'react';
import { ArrowRight, DollarSign, Percent, Users, Download, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface BusinessModelConfig {
  id: string;
  name: string;
  defaultVisitors: number;
  defaultConversion: number;
  defaultAov: number;
  defaultOverhead: number;
  marginMultiplier: number;
  description: string;
  linkedPlaybookId: string;
}

const BUSINESS_MODELS: BusinessModelConfig[] = [
  {
    id: 'digital-templates',
    name: 'Digital Notion & Code Templates',
    defaultVisitors: 4500,
    defaultConversion: 2.2,
    defaultAov: 59,
    defaultOverhead: 45,
    marginMultiplier: 0.94,
    description: 'Zero physical inventory, high recurring margin with automated checkout.',
    linkedPlaybookId: 'digital-templates-os'
  },
  {
    id: 'remote-tech',
    name: 'Remote Tech Diagnostics Agency',
    defaultVisitors: 850,
    defaultConversion: 4.5,
    defaultAov: 125,
    defaultOverhead: 60,
    marginMultiplier: 0.88,
    description: 'High-ticket diagnostic sessions, PC debloating, and corporate WiFi retainers.',
    linkedPlaybookId: 'tech-troubleshooting-services'
  },
  {
    id: 'affiliate-authority',
    name: 'Curated Review & Comparison Hub',
    defaultVisitors: 18000,
    defaultConversion: 1.8,
    defaultAov: 42,
    defaultOverhead: 90,
    marginMultiplier: 0.92,
    description: 'B2B SaaS and productivity hardware commissions via SEO long-tail keywords.',
    linkedPlaybookId: 'curated-affiliate-authority'
  },
  {
    id: 'ecommerce-hardware',
    name: 'Physical Desk Gear & E-Commerce',
    defaultVisitors: 8000,
    defaultConversion: 2.6,
    defaultAov: 75,
    defaultOverhead: 350,
    marginMultiplier: 0.52,
    description: 'Direct-to-consumer ergonomic accessories, desk mats, and audio gear.',
    linkedPlaybookId: 'mrs-desk-mat'
  }
];

interface RoiCalculatorProps {
  onSelectPlaybook?: (playbookId: string) => void;
}

export const RoiCalculator: React.FC<RoiCalculatorProps> = ({ onSelectPlaybook }) => {
  const { formatPrice, currency } = useCart();
  const [selectedModelId, setSelectedModelId] = useState<string>('digital-templates');

  const activeModel = useMemo(() => {
    return BUSINESS_MODELS.find((m) => m.id === selectedModelId) || BUSINESS_MODELS[0];
  }, [selectedModelId]);

  const [monthlyVisitors, setMonthlyVisitors] = useState<number>(activeModel.defaultVisitors);
  const [conversionRate, setConversionRate] = useState<number>(activeModel.defaultConversion);
  const [averageOrderValue, setAverageOrderValue] = useState<number>(activeModel.defaultAov);
  const [monthlyOverhead, setMonthlyOverhead] = useState<number>(activeModel.defaultOverhead);

  const handleModelChange = (model: BusinessModelConfig) => {
    setSelectedModelId(model.id);
    setMonthlyVisitors(model.defaultVisitors);
    setConversionRate(model.defaultConversion);
    setAverageOrderValue(model.defaultAov);
    setMonthlyOverhead(model.defaultOverhead);
  };

  const monthlyOrders = Math.round((monthlyVisitors * conversionRate) / 100);
  const grossMonthlyRevenue = monthlyOrders * averageOrderValue;
  const netMonthlyProfit = Math.max(
    0,
    Math.round(grossMonthlyRevenue * activeModel.marginMultiplier - monthlyOverhead)
  );
  const annualRunRate = netMonthlyProfit * 12;
  const profitMarginPercent =
    grossMonthlyRevenue > 0
      ? Math.round((netMonthlyProfit / grossMonthlyRevenue) * 100)
      : 0;

  const handleExportReport = () => {
    const content = [
      `MRS DIGITAL — UNIT ECONOMICS PROJECTION (${currency})`,
      `Model: ${activeModel.name}`,
      `Date: ${new Date().toLocaleDateString('en-US')}`,
      ``,
      `INPUT PARAMETERS:`,
      `- Monthly Targeted Visitors: ${monthlyVisitors.toLocaleString()}`,
      `- Conversion Rate: ${conversionRate.toFixed(1)}%`,
      `- Average Order Value: ${formatPrice(averageOrderValue)}`,
      `- Monthly Overhead: ${formatPrice(monthlyOverhead)}`,
      ``,
      `CALCULATED RESULTS:`,
      `- Estimated Monthly Orders: ${monthlyOrders}`,
      `- Gross Monthly Revenue: ${formatPrice(grossMonthlyRevenue)}`,
      `- Estimated Net Monthly Profit: ${formatPrice(netMonthlyProfit)} (~${profitMarginPercent}% margin)`,
      `- Calculated Annual Run-Rate: ${formatPrice(annualRunRate)}`
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mrs-roi-${activeModel.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="roi-calculator" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              <span>Interactive Tool</span>
              <span aria-hidden="true">·</span>
              <span>Real Financial Math</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
              Online Business Revenue &amp; Profit Calculator
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Calculate actual unit economics before building. Select a business model and adjust inputs to compute projected monthly net income and annual run rate.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleModelChange(activeModel)}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={handleExportReport}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Summary</span>
            </button>
          </div>
        </div>

        {/* Business Model Selector Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-8">
          {BUSINESS_MODELS.map((model) => {
            const isSelected = model.id === selectedModelId;
            return (
              <button
                key={model.id}
                onClick={() => handleModelChange(model)}
                className={`p-3.5 text-left rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-semibold line-clamp-1 mb-1">{model.name}</div>
                <div className={`text-[11px] line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  {model.description}
                </div>
              </button>
            );
          })}
        </div>

        {/* Calculator Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Sliders & Parameter Controls (7 cols) */}
          <div className="lg:col-span-7 bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-6">
            
            {/* Control 1: Monthly Visitors */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  Monthly Targeted Visitors / Inbound Leads
                </label>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {monthlyVisitors.toLocaleString()} / mo
                </span>
              </div>
              <input
                type="range"
                min="300"
                max="50000"
                step="100"
                value={monthlyVisitors}
                onChange={(e) => setMonthlyVisitors(Number(e.target.value))}
                className="w-full accent-slate-900 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>300 (Micro audience)</span>
                <span>25,000 (Medium brand)</span>
                <span>50,000+ (Established)</span>
              </div>
            </div>

            {/* Control 2: Conversion Rate */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-slate-500" />
                  Visitor-to-Buyer Conversion Rate
                </label>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {conversionRate.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="8.0"
                step="0.1"
                value={conversionRate}
                onChange={(e) => setConversionRate(Number(e.target.value))}
                className="w-full accent-slate-900 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>0.5% (Cold traffic)</span>
                <span>2.0% - 3.0% (Industry avg)</span>
                <span>8.0% (High trust)</span>
              </div>
            </div>

            {/* Control 3: Average Order Value */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                  Average Ticket Size / Order Value
                </label>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {formatPrice(averageOrderValue)}
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="500"
                step="5"
                value={averageOrderValue}
                onChange={(e) => setAverageOrderValue(Number(e.target.value))}
                className="w-full accent-slate-900 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>$15 (Micro-eBook)</span>
                <span>$65 (Playbook/Gear)</span>
                <span>$500 (Diagnostic Sprint)</span>
              </div>
            </div>

            {/* Control 4: Monthly Overhead */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <label className="font-semibold text-slate-700">
                  Estimated Monthly SaaS &amp; Hosting Overhead
                </label>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {formatPrice(monthlyOverhead)} / mo
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="600"
                step="10"
                value={monthlyOverhead}
                onChange={(e) => setMonthlyOverhead(Number(e.target.value))}
                className="w-full accent-slate-900 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

          </div>

          {/* Right Column: Calculated Projections Card (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 text-white p-7 rounded-2xl shadow-xl flex flex-col justify-between">
            
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Projected Financial Run-Rate
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {monthlyOrders} Orders/Mo
                </span>
              </div>

              {/* Main Net Profit Metric */}
              <div className="mb-6">
                <div className="text-xs text-slate-400 mb-1">Estimated Net Monthly Profit</div>
                <div className="text-4xl font-bold font-mono tabular-nums text-white tracking-tight">
                  {formatPrice(netMonthlyProfit)}
                  <span className="text-sm font-normal text-slate-400"> / month</span>
                </div>
                <div className="text-xs text-emerald-400 font-medium mt-1">
                  ~ {profitMarginPercent}% Net Profit Margin
                </div>
              </div>

              {/* Breakdown List with Tabular Figures */}
              <div className="space-y-3 py-4 border-y border-slate-800 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Gross Monthly Volume</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-200">
                    {formatPrice(grossMonthlyRevenue)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Calculated Annual Run-Rate</span>
                  <span className="font-mono tabular-nums font-semibold text-amber-300">
                    {formatPrice(annualRunRate)} / year
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Tool &amp; Server Fees</span>
                  <span className="font-mono tabular-nums text-slate-400">
                    - {formatPrice(monthlyOverhead)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Card Bottom */}
            <div className="mt-8 pt-4">
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 mb-4">
                <div className="text-xs font-semibold text-slate-200 mb-1">
                  Recommended Action Plan:
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Start with a free problem-solving guide to capture your first 200 subscribers, then deploy the {activeModel.name} system.
                </p>
              </div>

              {onSelectPlaybook && (
                <button
                  onClick={() => onSelectPlaybook(activeModel.linkedPlaybookId)}
                  className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>View Step-by-Step {activeModel.name} Playbook</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
