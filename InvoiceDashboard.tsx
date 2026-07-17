import React, { useState } from 'react';
import {
  Menu, Search, Bell, Settings, HelpCircle,
  ChevronLeft, Plus, MoreHorizontal, Filter,
  Calendar, FileText, CheckCircle,
  ArrowUpRight, Copy
} from 'lucide-react';

// Mock data
const MOCK_AVATARS = [
  "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  "https://i.pravatar.cc/150?u=a04258114e29026702d",
  "https://i.pravatar.cc/150?u=a048581f4e29026701d",
  "https://i.pravatar.cc/150?u=a042581f4e29026703d",
];

const INVOICES = [
  { id: '#404-002', dueIn: 'in 2 days', status: 'Unsent', amount: '$80,770.00', avatar: MOCK_AVATARS[0] },
  { id: '#426-001', dueIn: 'in 4 days', status: 'Viewed', amount: '$27,114.00', avatar: MOCK_AVATARS[1] },
  { id: '#427-012', dueIn: 'in 5 days', status: 'Unsent', amount: '$53,154.00', avatar: MOCK_AVATARS[2], active: true },
  { id: '#424-112', dueIn: 'in 16 days', status: 'Viewed', amount: '$61,223.00', avatar: MOCK_AVATARS[3] },
  { id: '#417-020', dueIn: 'in 19 days', status: 'Viewed', amount: '$7,311.00', avatar: MOCK_AVATARS[4] },
];

const TABS = ['Estimates', 'Invoices', 'Payments', 'Recurring invoices', 'Checkouts'];
const INVOICE_FILTERS = ['All invoices', 'Draft', 'Unpaid'];

// Reusable components
const Avatar = ({ src, className = "" }: { src: string; className?: string }) => (
  <img src={src} alt="" className={`rounded-full border-2 border-gray-900 object-cover ${className}`} />
);

const Badge = ({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
      active ? 'bg-[#ADFF2F] text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
    }`}
  >
    {children}
  </button>
);

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-[#1E1F23] rounded-2xl p-6 ${className}`}>
    {children}
  </div>
);

const IconButton = ({ icon: Icon, children }: { icon: React.ElementType; children?: React.ReactNode }) => (
  <button className="p-2 bg-gray-800/50 hover:bg-gray-700 rounded-full text-gray-400 transition-colors">
    <Icon size={20} />
  </button>
);

// Overview Widget Component
const OverviewWidget = () => (
  <Card className="lg:col-span-2 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-800 via-[#ADFF2F] to-gray-800 opacity-20" />
    <div className="grid grid-cols-3 gap-8 mb-8">
      <div>
        <p className="text-sm text-gray-400 mb-1">Overdue</p>
        <h2 className="text-3xl font-light"><span className="text-gray-500 text-xl">$</span>31,211.00</h2>
      </div>
      <div>
        <p className="text-sm text-gray-400 mb-1">Due within next month</p>
        <h2 className="text-3xl font-light"><span className="text-gray-500 text-xl">$</span>172,560.00</h2>
      </div>
      <div>
        <p className="text-sm text-gray-400 mb-1">Average time to get paid</p>
        <h2 className="text-3xl font-light">12<span className="text-gray-500 text-xl ml-1">days</span></h2>
      </div>
    </div>

    <div className="relative mt-12">
      <div className="flex justify-between text-xs text-gray-500 mb-2">
        <span>Sep</span><span>Oct</span><span className="text-[#ADFF2F]">Nov</span><span>Dec</span>
      </div>
      <div className="h-1.5 w-full bg-gray-800 rounded-full flex relative">
        <div className="h-full bg-gray-600 rounded-l-full" style={{ width: '25%' }} />
        <div className="h-full bg-[#ADFF2F] relative" style={{ width: '20%' }}>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#ADFF2F] rounded-full border-2 border-[#1E1F23]" />
        </div>
        <div className="h-full bg-gray-800 rounded-r-full flex-1" />
      </div>
      <div className="flex justify-between mt-4">
        <div className="flex -space-x-2">
          {MOCK_AVATARS.slice(0, 4).map((src, i) => <Avatar key={i} src={src} className="w-8 h-8" />)}
        </div>
        <div className="flex -space-x-2 ml-12">
          {MOCK_AVATARS.slice(1, 3).map((src, i) => <Avatar key={i} src={src} className="w-8 h-8" />)}
        </div>
        <div className="flex -space-x-2 mr-12">
          {MOCK_AVATARS.slice(3, 5).map((src, i) => <Avatar key={i} src={src} className="w-8 h-8" />)}
        </div>
      </div>
    </div>
  </Card>
);

// Payout Widget Component
const PayoutWidget = () => (
  <Card className="flex flex-col justify-between">
    <div>
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm text-gray-400">Available for Instant Payout</p>
        <button className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-400">
          <ArrowUpRight size={16} />
        </button>
      </div>
      <div className="flex items-baseline gap-3">
        <h2 className="text-3xl font-light"><span className="text-gray-500 text-xl">$</span>214,390.00</h2>
        <span className="text-xs px-2 py-1 bg-gray-800 text-gray-400 rounded-full">Expects</span>
      </div>
    </div>

    <div className="flex gap-3 mt-6">
      {[
        { label: 'Visa', sub: '****4443', bg: 'bg-gray-800/50' },
        { label: 'Stripe', sub: '#177210', bg: 'bg-[#ADFF2F] text-black shadow-[0_0_15px_rgba(173,255,47,0.2)]' },
        { label: 'PayPal', sub: '#711221', bg: 'bg-gray-800/50' },
      ].map((method) => (
        <div
          key={method.label}
          className={`flex-1 ${method.bg} rounded-xl p-4 flex flex-col justify-between h-28 border border-gray-700/50 cursor-pointer transition-all hover:-translate-y-1`}
        >
          <span className="text-xs font-mono text-gray-500">{method.sub}</span>
          <span className="text-sm font-medium">{method.label}</span>
        </div>
      ))}
    </div>

    <button className="w-full mt-4 bg-white hover:bg-gray-100 text-black font-medium py-3 rounded-xl transition-colors">
      Pay out now
    </button>
  </Card>
);

// Invoice List Item Component
const InvoiceListItem = ({ invoice, isActive, onClick }: {
  invoice: typeof INVOICES[0];
  isActive: boolean;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
      isActive ? 'bg-[#1E1F23] text-white shadow-lg' : 'hover:bg-gray-50'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className="relative">
        <Avatar src={invoice.avatar} className={`w-10 h-10 ${isActive ? 'border-gray-700' : 'border-transparent'}`} />
        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${isActive ? 'border-[#1E1F23]' : 'border-white'} ${
          invoice.status === 'Unsent' ? 'bg-orange-400' : 'bg-gray-300'
        }`} />
      </div>
      <div>
        <p className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-900'}`}>{invoice.id}</p>
        <p className={`text-xs ${isActive ? 'text-gray-400' : 'text-gray-500'}`}>{invoice.dueIn}</p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <span className={`text-xs px-3 py-1 rounded-full border ${
        isActive ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-600'
      }`}>
        {invoice.status}
      </span>
      <span className={`font-medium ${isActive ? 'text-white' : 'text-gray-900'}`}>{invoice.amount}</span>
    </div>
  </div>
);

// Invoice Detail View Component
const InvoiceDetailView = ({ invoice }: { invoice: typeof INVOICES[0] }) => {
  const services = [
    { amount: '$10,630.80', name: 'Concept Development' },
    { amount: '$31,892.40', name: 'CRM Development' },
    { amount: '$10,630.80', name: 'CRM Integration' },
  ];

  return (
    <div className="bg-[#1E1F23] h-full rounded-2xl flex flex-col relative overflow-hidden">
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <IconButton icon={Copy} />
        <IconButton icon={MoreHorizontal} />
      </div>

      <div className="p-8 flex-1">
        <div className="flex justify-between items-start mb-12 mt-8">
          <div>
            <p className="text-gray-400 text-sm mb-2">Invoice details</p>
            <div className="flex items-center gap-3">
              <h2 className="text-4xl font-light">{invoice.id}</h2>
              <span className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-xs text-gray-400">{invoice.status}</span>
            </div>
          </div>

          <div className="flex gap-12 text-right">
            <div>
              <p className="text-gray-400 text-sm mb-2">Company</p>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-xl font-medium">BlueRock</span>
                <div className="w-6 h-6 bg-blue-500 rounded-sm rotate-45 transform" />
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2 text-left">Customer</p>
              <div className="flex items-center gap-3">
                <Avatar src={invoice.avatar} className="w-10 h-10 border-gray-700" />
                <div className="text-left">
                  <p className="text-sm font-medium">Maria Jones</p>
                  <p className="text-xs text-gray-500">CEO BlueRock Pvt Ltd.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {services.map((service, i) => (
            <div key={i} className="bg-[#25262B] p-5 rounded-2xl hover:bg-gray-800 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-6">
                <p className="text-xl font-light">{service.amount}</p>
                <ArrowUpRight size={16} className="text-gray-500 group-hover:text-white transition-colors" />
              </div>
              <p className="text-xs text-gray-400">{service.name}</p>
            </div>
          ))}
        </div>

        <button className="w-full py-4 border border-dashed border-gray-700 rounded-2xl text-gray-500 hover:text-white hover:bg-gray-800/50 hover:border-gray-500 flex justify-center items-center transition-all">
          <Plus size={20} />
        </button>
      </div>

      <div className="bg-[#1A1B1F] p-6 border-t border-gray-800 flex items-center justify-between mt-auto">
        <div className="flex gap-12">
          {[
            { label: 'Sub total', value: '$53,154.00' },
            { label: 'Total', value: '$53,154.00' },
            { label: 'Balance Due', value: '$53,154.00', highlight: true },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs text-gray-500 mb-1">{item.label}</p>
              <p className={`text-lg ${item.highlight ? 'text-xl font-medium' : ''}`}>
                <span className="text-gray-600 text-sm">$</span> {item.value.replace('$', '')}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 transition-colors">
            <CheckCircle size={18} />
          </button>
          <button className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 transition-colors">
            <FileText size={18} />
          </button>
          <button className="bg-[#ADFF2F] hover:bg-[#9BE62A] text-black font-semibold px-6 py-2.5 rounded-full transition-colors ml-2">
            Pay out now
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function InvoiceDashboard() {
  const [activeTab, setActiveTab] = useState('Invoices');
  const [invoiceFilter, setInvoiceFilter] = useState('Unpaid');
  const [selectedInvoice, setSelectedInvoice] = useState(INVOICES[2]);

  return (
    <div className="min-h-screen bg-[#111215] text-gray-100 font-sans selection:bg-[#ADFF2F] selection:text-black pb-12">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800/50">
        <div className="flex items-center gap-2">
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
          </svg>
          <span className="font-semibold text-lg tracking-tight">salesforce</span>
        </div>

        <div className="flex-1 max-w-2xl mx-8 hidden md:block">
          <div className="bg-[#1A1B1F] rounded-full p-1.5 flex items-center justify-between">
            <button className="p-2 text-gray-400 hover:text-white rounded-full"><Menu size={18} /></button>
            <div className="flex gap-1">
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeTab === tab ? 'bg-[#ADFF2F] text-black' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center text-gray-400">
              {[FileText, Calendar, Settings, HelpCircle].map((Icon, i) => (
                <button key={i} className="p-2 hover:text-white rounded-full"><Icon size={18} /></button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white"><Search size={20} /></button>
          <button className="text-gray-400 hover:text-white relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <Avatar src={MOCK_AVATARS[0]} className="w-8 h-8" />
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 mt-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <IconButton icon={ChevronLeft} />
            <h1 className="text-3xl font-light">Invoices</h1>
          </div>
          <div className="flex items-center gap-3">
            <IconButton icon={Filter} />
            <button className="flex items-center gap-2 bg-[#1A1B1F] border border-gray-700 hover:bg-gray-800 px-4 py-2 rounded-full text-sm font-medium transition-colors">
              <Plus size={16} />
              Create an invoice
            </button>
          </div>
        </header>

        {/* Overview & Payout Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <OverviewWidget />
          <PayoutWidget />
        </div>

        {/* Filter Section */}
        <div className="flex items-center gap-4 mb-6 bg-[#1A1B1F] p-2 rounded-2xl border border-gray-800/50 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 px-3">
            <span className="text-sm font-medium">Active filters</span>
            <span className="bg-white text-black w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">2</span>
          </div>
          <div className="h-6 w-px bg-gray-800" />
          {['All customers', 'All statuses'].map((label, i) => (
            <React.Fragment key={label}>
              {i === 1 && <div className="h-4 w-px bg-gray-800" />}
              <select className="bg-transparent text-sm text-gray-300 outline-none cursor-pointer appearance-none pr-6 hover:text-white">
                <option>{label}</option>
              </select>
            </React.Fragment>
          ))}
          <div className="h-6 w-px bg-gray-800" />
          {['November 2023', 'December 2023'].map(date => (
            <div key={date} className="flex items-center gap-2 px-2 bg-gray-800/50 rounded-lg py-1.5 cursor-pointer hover:bg-gray-700/50">
              <Calendar size={14} className="text-gray-400" />
              <span className="text-sm text-gray-300">{date}</span>
            </div>
          ))}
          <div className="h-6 w-px bg-gray-800" />
          <div className="flex-1 min-w-[200px] flex items-center gap-2 px-2">
            <input type="text" placeholder="Enter invoice #" className="bg-transparent border-none outline-none text-sm w-full text-gray-300 placeholder-gray-600" />
            <Search size={16} className="text-gray-500" />
          </div>
        </div>

        {/* Invoice Panel */}
        <div className="bg-white rounded-3xl p-2 relative overflow-hidden flex flex-col lg:flex-row min-h-[500px]">
          {/* Filter Pills */}
          <div className="absolute top-6 right-1/2 translate-x-1/2 z-10 flex bg-[#1E1F23] rounded-full p-1 shadow-lg shadow-black/20 border border-gray-800">
            {INVOICE_FILTERS.map(filter => (
              <Badge
                key={filter}
                active={invoiceFilter === filter}
                onClick={() => setInvoiceFilter(filter)}
                className="!px-4 !py-2 !text-sm mr-1"
              >
                {filter}
                {filter === 'Draft' && <span className="ml-1 opacity-50">3</span>}
                {filter === 'Unpaid' && (
                  <span className="bg-black text-[#ADFF2F] w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ml-1">5</span>
                )}
              </Badge>
            ))}
          </div>

          {/* Invoice List */}
          <div className="w-full lg:w-[35%] bg-white text-black p-6 rounded-l-2xl border-r border-gray-100 flex flex-col">
            <h3 className="font-semibold text-lg mb-6 pt-12">Unpaid Invoices</h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-2">
              {INVOICES.map((inv) => (
                <InvoiceListItem
                  key={inv.id}
                  invoice={inv}
                  isActive={selectedInvoice.id === inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                />
              ))}
            </div>
          </div>

          {/* Invoice Detail */}
          <div className="w-full lg:w-[65%] p-2 h-full">
            <InvoiceDetailView invoice={selectedInvoice} />
          </div>
        </div>
      </main>
    </div>
  );
}
