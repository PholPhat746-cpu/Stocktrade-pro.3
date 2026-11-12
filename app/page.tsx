'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Wallet, TrendingUp, ArrowUpRight, LogOut, Trophy, BarChart2, BookOpen, Info, Code, Smartphone, Target, Layers } from 'lucide-react';

interface StockItem {
  symbol: string;
  name: string;
  price: number;
  basePrice: number;
  change: string;
  percent: string;
  high: number;
  low: number;
  vol: string;
}

interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
}

interface DrawingLine {
  type: 'SUPPORT' | 'RESISTANCE';
  price: number;
}

const INITIAL_STOCKS: StockItem[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 228.50, basePrice: 224.30, change: '+4.20', percent: '+1.87', high: 230.00, low: 225.50, vol: '54.2M' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 135.20, basePrice: 129.40, change: '+5.80', percent: '+4.48', high: 137.50, low: 130.00, vol: '120.5M' },
  { symbol: 'TSLA', name: 'Tesla, Inc.', price: 245.60, basePrice: 249.00, change: '-3.40', percent: '-1.37', high: 252.00, low: 243.00, vol: '85.4M' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 430.19, basePrice: 423.20, change: '+6.99', percent: '+1.65', high: 431.07, low: 422.00, vol: '21.8M' },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.', price: 186.40, basePrice: 184.90, change: '+1.50', percent: '+0.81', high: 188.00, low: 184.50, vol: '38.1M' },
  { symbol: 'GOOGL', name: 'Alphabet Inc. (Google)', price: 178.90, basePrice: 177.70, change: '+1.20', percent: '+0.68', high: 180.50, low: 177.00, vol: '24.6M' },
  { symbol: 'META', name: 'Meta Platforms, Inc.', price: 520.40, basePrice: 511.80, change: '+8.60', percent: '+1.68', high: 525.00, low: 512.00, vol: '18.9M' },
  { symbol: 'NFLX', name: 'Netflix, Inc.', price: 685.10, basePrice: 672.80, change: '+12.30', percent: '+1.83', high: 690.00, low: 675.00, vol: '9.4M' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', price: 156.80, basePrice: 158.90, change: '-2.10', percent: '-1.32', high: 160.00, low: 155.00, vol: '45.1M' },
  { symbol: 'INTC', name: 'Intel Corporation', price: 22.40, basePrice: 22.70, change: '-0.30', percent: '-1.32', high: 23.00, low: 22.10, vol: '62.3M' },
  { symbol: 'COIN', name: 'Coinbase Global, Inc.', price: 210.50, basePrice: 196.30, change: '+14.20', percent: '+7.23', high: 215.00, low: 198.00, vol: '31.2M' },
  { symbol: 'PLTR', name: 'Palantir Technologies', price: 42.10, basePrice: 39.70, change: '+2.40', percent: '+6.05', high: 43.00, low: 40.20, vol: '74.8M' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 222.30, basePrice: 221.50, change: '+0.80', percent: '+0.36', high: 223.50, low: 221.00, vol: '11.5M' },
  { symbol: 'DIS', name: 'The Walt Disney Company', price: 95.80, basePrice: 96.30, change: '-0.50', percent: '-0.52', high: 97.00, low: 95.20, vol: '14.9M' },
  { symbol: 'BABA', name: 'Alibaba Group Holding', price: 98.40, basePrice: 95.30, change: '+3.10', percent: '+3.25', high: 100.00, low: 96.00, vol: '41.6M' },
];

const createInitialCandles = (stock: StockItem, tf: string): Candle[] => {
  const count = tf === '3M' ? 30 : 15; // ถ้าเลือก 3 เดือน จะสร้างแท่งเทียนจำลองย้อนหลังมากถึง 30 แท่ง
  const list: Candle[] = [];
  let p = stock.price * (tf === '3M' ? 0.85 : 0.96);
  for (let i = 0; i < count; i++) {
    const seed = (stock.symbol.charCodeAt(0) * 11 + i * 17) % 100;
    const delta = (seed - 48) * (stock.price * 0.003);
    const open = p;
    const close = open + delta;
    const high = Math.max(open, close) + (seed % 5) * (stock.price * 0.0015);
    const low = Math.min(open, close) - ((seed + 2) % 5) * (stock.price * 0.0015);
    p = close;
    list.push({ open, high, low, close });
  }
  list[list.length - 1].close = stock.price;
  list[list.length - 1].high = Math.max(list[list.length - 1].open, stock.price) * 1.002;
  list[list.length - 1].low = Math.min(list[list.length - 1].open, stock.price) * 0.998;
  return list;
};

export default function StockTradePro() {
  const [user, setUser] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const [activeTab, setActiveTab] = useState<'TRADE' | 'JOURNAL' | 'ABOUT' | 'LEADERBOARD'>('TRADE');
  const [timeframe, setTimeframe] = useState<'5M' | '1H' | '1D' | '1W' | '3M'>('1D');
  const [drawingTool, setDrawingTool] = useState<'NONE' | 'SUPPORT' | 'RESISTANCE'>('NONE');
  const [drawnLines, setDrawnLines] = useState<DrawingLine[]>([]);

  const [stocks, setStocks] = useState<StockItem[]>(INITIAL_STOCKS);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('MSFT');
  const [candles, setCandles] = useState<Candle[]>(() => createInitialCandles(INITIAL_STOCKS[3], '1D'));
  const [tickCount, setTickCount] = useState<number>(0);

  const [demoCash, setDemoCash] = useState(100000);
  const [demoShares, setDemoShares] = useState(0);
  const [demoTrades, setDemoTrades] = useState<{ type: string; symbol: string; qty: number; price: number; time: string }[]>([]);
  
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'DEPOSIT' | 'WITHDRAW'>('DEPOSIT');
  const [modalAmount, setModalAmount] = useState('');

  const selectedStock = stocks.find((s) => s.symbol === selectedSymbol) || stocks[3];

  useEffect(() => {
    const savedUser = localStorage.getItem('stock_pro_user');
    if (savedUser) {
      setUser(savedUser);
      loadUserData(savedUser);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks((prevStocks) => {
        const updated = prevStocks.map((s) => {
          const volatility = s.price * 0.0025;
          const move = (Math.random() - 0.49) * volatility;
          const newPrice = Math.max(1, parseFloat((s.price + move).toFixed(2)));
          const diff = newPrice - s.basePrice;
          const pct = (diff / s.basePrice) * 100;

          return {
            ...s,
            price: newPrice,
            high: Math.max(s.high, newPrice),
            low: Math.min(s.low, newPrice),
            change: `${diff >= 0 ? '+' : ''}${diff.toFixed(2)}`,
            percent: `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}`,
          };
        });

        const currentTarget = updated.find((item) => item.symbol === selectedSymbol);
        if (currentTarget) {
          setCandles((prevCandles) => {
            const next = [...prevCandles];
            if (next.length === 0) return prevCandles;
            const last = { ...next[next.length - 1] };
            last.close = currentTarget.price;
            last.high = Math.max(last.high, currentTarget.price);
            last.low = Math.min(last.low, currentTarget.price);
            next[next.length - 1] = last;
            return next;
          });
        }

        return updated;
      });

      setTickCount((c) => c + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedSymbol]);

  const handleSelectSymbol = (sym: string) => {
    setSelectedSymbol(sym);
    const found = stocks.find((s) => s.symbol === sym);
    if (found) setCandles(createInitialCandles(found, timeframe));
  };

  const handleTimeframeChange = (tf: '5M' | '1H' | '1D' | '1W' | '3M') => {
    setTimeframe(tf);
    setCandles(createInitialCandles(selectedStock, tf));
  };

  const loadUserData = (username: string) => {
    const sDemoCash = localStorage.getItem(`demo_cash_${username}`);
    const sDemoShares = localStorage.getItem(`demo_shares_${username}`);
    const sDemoTrades = localStorage.getItem(`demo_trades_${username}`);
    if (sDemoCash) setDemoCash(JSON.parse(sDemoCash));
    if (sDemoShares) setDemoShares(JSON.parse(sDemoShares));
    if (sDemoTrades) setDemoTrades(JSON.parse(sDemoTrades));
  };

  const saveDemoData = (username: string, c: number, s: number, t: any[]) => {
    localStorage.setItem(`demo_cash_${username}`, JSON.stringify(c));
    localStorage.setItem(`demo_shares_${username}`, JSON.stringify(s));
    localStorage.setItem(`demo_trades_${username}`, JSON.stringify(t));
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    const username = emailInput.trim();
    setUser(username);
    localStorage.setItem('stock_pro_user', username);

    const saved = localStorage.getItem(`demo_cash_${username}`);
    if (!saved) {
      setDemoCash(100000);
      setDemoShares(0);
      setDemoTrades([]);
      saveDemoData(username, 100000, 0, []);
    } else {
      loadUserData(username);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('stock_pro_user');
  };

  const handleBuy = () => {
    const cost = 5 * selectedStock.price;
    if (!user) return;
    if (demoCash >= cost) {
      const nc = demoCash - cost;
      const ns = demoShares + 5;
      const nt = [{ type: 'BUY', symbol: selectedStock.symbol, qty: 5, price: selectedStock.price, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }, ...demoTrades];
      setDemoCash(nc);
      setDemoShares(ns);
      setDemoTrades(nt);
      saveDemoData(user, nc, ns, nt);
    } else {
      alert('เงินสดในพอร์ตไม่เพียงพอ!');
    }
  };

  const handleSell = () => {
    if (!user) return;
    if (demoShares >= 5) {
      const nc = demoCash + (5 * selectedStock.price);
      const ns = demoShares - 5;
      const nt = [{ type: 'SELL', symbol: selectedStock.symbol, qty: 5, price: selectedStock.price, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }, ...demoTrades];
      setDemoCash(nc);
      setDemoShares(ns);
      setDemoTrades(nt);
      saveDemoData(user, nc, ns, nt);
    } else {
      alert('จำนวนหุ้นไม่พอขาย!');
    }
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(modalAmount);
    if (isNaN(amt) || amt <= 0 || !user) return;

    if (modalType === 'DEPOSIT') {
      const nc = demoCash + amt;
      setDemoCash(nc);
      saveDemoData(user, nc, demoShares, demoTrades);
      alert(`จำลองฝากเงินสำเร็จ +$${amt.toLocaleString()}`);
    } else {
      if (demoCash >= amt) {
        const nc = demoCash - amt;
        setDemoCash(nc);
        saveDemoData(user, nc, demoShares, demoTrades);
        alert(`จำลองถอนเงินสำเร็จ -$${amt.toLocaleString()}`);
      } else {
        alert('ยอดเงินสดในพอร์ตไม่พอถอน!');
      }
    }
    setModalAmount('');
    setShowModal(false);
  };

  const handleChartClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (drawingTool === 'NONE') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const ratio = clickY / 200;
    
    const clickedPrice = maxChartPrice - ratio * priceSpan;
    setDrawnLines([...drawnLines, { type: drawingTool, price: clickedPrice }]);
    setDrawingTool('NONE');
  };

  const profitLoss = demoCash - 100000;
  const isPositiveChange = !selectedStock.change.startsWith('-');

  const minChartPrice = Math.min(...candles.map((c) => c.low)) * 0.998;
  const maxChartPrice = Math.max(...candles.map((c) => c.high)) * 1.002;
  const priceSpan = maxChartPrice - minChartPrice || 1;
  const scaleY = (val: number) => Math.max(10, Math.min(190, 190 - ((val - minChartPrice) / priceSpan) * 175));

  const leaderboardData = [
    { rank: 1, name: 'คุณธนกร (GlobalPro)', profit: '+$34,250', roi: '+342.5%', reward: '🏆 โบนัสพิเศษ $1,000' },
    { rank: 2, name: 'คุณสุกัญญา (AlphaUS)', profit: '+$28,510', roi: '+285.1%', reward: '🥈 โบนัสพิเศษ $700' },
    { rank: 3, name: 'คุณกิตติพงษ์ (WallStBull)', profit: '+$21,040', roi: '+210.4%', reward: '🥉 โบนัสพิเศษ $500' },
    { rank: 4, name: 'คุณนภัสสร (TechTrader)', profit: '+$17,580', roi: '+175.8%', reward: '🎁 ของที่ระลึก Pro Kit' },
    { rank: 5, name: 'คุณวิชัย (WaveRider)', profit: '+$14,200', roi: '+142.0%', reward: '🎁 ของที่ระลึก Pro Kit' },
    { rank: 6, name: 'คุณพิมพ์ใจ (CryptoQueen)', profit: '+$11,860', roi: '+118.6%', reward: '🎁 ของที่ระลึก Pro Kit' },
    { rank: 7, name: 'คุณอานนท์ (Nasdor_Master)', profit: '+$9,530', roi: '+95.3%', reward: '🎁 ของที่ระลึก Pro Kit' },
    { rank: 8, name: 'คุณจิราวรรณ (Investor)', profit: '+$7,820', roi: '+78.2%', reward: '🎁 ของที่ระลึก Pro Kit' },
    { rank: 9, name: 'คุณสมชาย (ValueInvest)', profit: '+$6,490', roi: '+64.9%', reward: '🎁 ของที่ระลึก Pro Kit' },
    { rank: 10, name: 'คุณธิดา (DayTradeUS)', profit: '+$5,120', roi: '+51.2%', reward: '🎁 ของที่ระลึก Pro Kit' },
    { rank: 11, name: 'คุณไพฑูรย์ (PaiTrade)', profit: '+$3,840', roi: '+38.4%', reward: '🎯 ผ่านเกณฑ์ฝึกซ้อม' },
    { rank: 12, name: 'คุณรัตนา (Ratana_Inv)', profit: '+$2,510', roi: '+25.1%', reward: '🎯 ผ่านเกณฑ์ฝึกซ้อม' },
    { rank: 13, name: 'คุณณรงค์ (Narong_Fx)', profit: '+$1,280', roi: '+12.8%', reward: '🎯 ผ่านเกณฑ์ฝึกซ้อม' },
    { rank: 14, name: user || 'คุณพล (StockTrade Pro)', profit: `+$${(demoCash - 100000).toLocaleString()}`, roi: `${(((demoCash - 100000)/100000)*100).toFixed(1)}%`, reward: '📍 พอร์ตของคุณ' },
    { rank: 15, name: 'คุณเมธา (Metha_Stx)', profit: '-$540', roi: '-5.4%', reward: '🎯 ผ่านเกณฑ์ฝึกซ้อม' },
  ];

  if (!user) {
    return (
      <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <Activity color="#10b981" size={32} />
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>StockTrade Pro (Global)</h1>
        </div>

        <div style={{ backgroundColor: '#161616', padding: '24px', borderRadius: '16px', border: '1px solid #262626', width: '100%', maxWidth: '380px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center', color: isRegister ? '#34d399' : '#fff' }}>
            {isRegister ? '📝 สมัครสมาชิก (รับเงินเดโม $100,000)' : '🔐 เข้าสู่ระบบ StockTrade Pro'}
          </h2>
          
          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {isRegister && (
              <div>
                <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '4px' }}>ชื่อ-นามสกุล / นามแฝง</label>
                <input 
                  type="text" 
                  value={nameInput} 
                  onChange={(e) => setNameInput(e.target.value)} 
                  placeholder=" ชื่อนักเทรดของคุณ" 
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#222', border: '1px solid #444', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
            )}
            <div>
              <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '4px' }}>อีเมล หรือ ชื่อผู้ใช้งาน</label>
              <input 
                type="text" 
                value={emailInput} 
                onChange={(e) => setEmailInput(e.target.value)} 
                placeholder=" trader@email.com" 
                required
                style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#222', border: '1px solid #444', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '4px' }}>รหัสผ่าน</label>
              <input 
                type="password" 
                value={passInput} 
                onChange={(e) => setPassInput(e.target.value)} 
                placeholder=" ••••••••" 
                required
                style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#222', border: '1px solid #444', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <button 
              type="submit" 
              style={{ backgroundColor: '#10b981', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', marginTop: '8px' }}
            >
              {isRegister ? 'ยืนยันการสมัครสมาชิก' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button 
              onClick={() => setIsRegister(!isRegister)} 
              style={{ background: 'none', border: 'none', color: '#34d399', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
            >
              {isRegister ? 'มีบัญชีอยู่แล้ว? เข้าสู่ระบบที่นี่' : 'ยังไม่มีบัญชี? สมัครสมาชิกรับเงินเดโม $100,000'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalPortfolioValue = demoCash + (demoShares * selectedStock.price);

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', minHeight: '100vh', padding: '16px', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity color="#10b981" size={24} />
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>StockTrade Pro</h1>
            <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>ยูสเซอร์: {user}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          style={{ backgroundColor: '#222', color: '#ff4d4d', border: '1px solid #444', padding: '4px 8px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <LogOut size={12} /> ออก
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', backgroundColor: '#161616', padding: '4px', borderRadius: '10px', border: '1px solid #262626', marginBottom: '14px', gap: '3px' }}>
        <button 
          onClick={() => setActiveTab('TRADE')}
          style={{ flex: 1, padding: '8px 2px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'TRADE' ? '#059669' : 'transparent', color: activeTab === 'TRADE' ? '#fff' : '#888', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}
        >
          📈 เทรดหุ้น
        </button>
        <button 
          onClick={() => setActiveTab('JOURNAL')}
          style={{ flex: 1, padding: '8px 2px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'JOURNAL' ? '#0284c7' : 'transparent', color: activeTab === 'JOURNAL' ? '#fff' : '#888', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}
        >
          📖 Journal (Web View)
        </button>
        <button 
          onClick={() => setActiveTab('ABOUT')}
          style={{ flex: 1, padding: '8px 2px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'ABOUT' ? '#7c3aed' : 'transparent', color: activeTab === 'ABOUT' ? '#fff' : '#888', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}
        >
          ℹ️ ผู้พัฒนา
        </button>
        <button 
          onClick={() => setActiveTab('LEADERBOARD')}
          style={{ flex: 1, padding: '8px 2px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'LEADERBOARD' ? '#d97706' : 'transparent', color: activeTab === 'LEADERBOARD' ? '#fff' : '#888', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}
        >
          🏆 อันดับ
        </button>
      </div>

      {activeTab === 'TRADE' && (
        <>
          {/* Stock Selector Dropdown */}
          <div style={{ backgroundColor: '#161616', padding: '12px', borderRadius: '12px', border: '1px solid #262626', marginBottom: '14px' }}>
            <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '6px' }}>🔍 เลือกหุ้นต่างประเทศ (15 บริษัทชั้นนำระดับโลก)</label>
            <select 
              value={selectedStock.symbol}
              onChange={(e) => handleSelectSymbol(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#222', border: '1px solid #444', color: '#fff', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {stocks.map((stock) => (
                <option key={stock.symbol} value={stock.symbol}>
                  {stock.symbol} - {stock.name} (${stock.price.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {/* Portfolio Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div style={{ backgroundColor: '#161616', padding: '14px', borderRadius: '12px', border: '1px solid #262626' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#888', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Wallet size={14} /> เงินสดเดโม</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button onClick={() => { setModalType('DEPOSIT'); setShowModal(true); }} style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>+ ฝาก</button>
                  <button onClick={() => { setModalType('WITHDRAW'); setShowModal(true); }} style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>- ถอน</button>
                </div>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 'bold' }}>${demoCash.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            </div>
            <div style={{ backgroundColor: '#161616', padding: '14px', borderRadius: '12px', border: '1px solid #262626' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '12px', marginBottom: '6px' }}>
                <TrendingUp size={14} /> มูลค่ารวมพอร์ต
              </div>
              <div style={{ fontSize: '15px', fontWeight: 'bold' }}>${totalPortfolioValue.toLocaleString(undefined, {maximumFractionDigits: 0})} <span style={{ fontSize: '10px', color: '#10b981' }}>({demoShares} หุ้น)</span></div>
            </div>
          </div>

          {/* Candlestick Chart Panel with 3M Timeframe & Support/Resistance Drawing Tools */}
          <div style={{ backgroundColor: '#161616', padding: '16px', borderRadius: '12px', border: '1px solid #262626', marginBottom: '16px', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BarChart2 size={18} color="#10b981" />
                  <h2 style={{ fontSize: '15px', fontWeight: 'bold', margin: 0 }}>{selectedStock.symbol}</h2>
                </div>
                <p style={{ fontSize: '11px', color: '#888', margin: '2px 0 0 0' }}>{selectedStock.name}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: isPositiveChange ? '#10b981' : '#ef4444' }}>
                  ${selectedStock.price.toFixed(2)}
                </div>
                <div style={{ fontSize: '11px', color: isPositiveChange ? '#10b981' : '#ef4444' }}>
                  {selectedStock.change} ({selectedStock.percent}%)
                </div>
              </div>
            </div>

            {/* Timeframe selector (Including 3M) & Drawing Tools */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '4px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '3px' }}>
                {(['5M', '1H', '1D', '1W', '3M'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => handleTimeframeChange(tf)}
                    style={{
                      backgroundColor: timeframe === tf ? '#0284c7' : '#222',
                      color: '#fff',
                      border: '1px solid #444',
                      padding: '4px 6px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => setDrawingTool(drawingTool === 'SUPPORT' ? 'NONE' : 'SUPPORT')}
                  style={{
                    backgroundColor: drawingTool === 'SUPPORT' ? '#10b981' : '#1e293b',
                    color: '#fff',
                    border: '1px solid #334155',
                    padding: '4px 6px',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}
                >
                  <Target size={11} /> แนวรับ
                </button>
                <button
                  onClick={() => setDrawingTool(drawingTool === 'RESISTANCE' ? 'NONE' : 'RESISTANCE')}
                  style={{
                    backgroundColor: drawingTool === 'RESISTANCE' ? '#ef4444' : '#1e293b',
                    color: '#fff',
                    border: '1px solid #334155',
                    padding: '4px 6px',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}
                >
                  <Layers size={11} /> แนวต้าน
                </button>
              </div>
            </div>

            {drawingTool !== 'NONE' && (
              <div style={{ backgroundColor: '#064e3b', color: '#34d399', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', textAlign: 'center', marginBottom: '8px', fontWeight: 'bold' }}>
                👉 แตะเลือกตำแหน่งระดับราคาบนกราฟเพื่อวาดเส้น {drawingTool === 'SUPPORT' ? 'แนวรับ (Support)' : 'แนวต้าน (Resistance)'}
              </div>
            )}

            <div style={{ backgroundColor: '#0f172a', borderRadius: '8px', padding: '12px', border: '1px solid #1e293b', marginBottom: '10px' }}>
              <div style={{ height: '220px', width: '100%', position: 'relative' }}>
                <svg 
                  viewBox="0 0 420 200" 
                  onClick={handleChartClick}
                  style={{ width: '100%', height: '100%', overflow: 'visible', cursor: drawingTool !== 'NONE' ? 'crosshair' : 'default' }}
                >
                  <line x1="0" y1="40" x2="420" y2="40" stroke="#1e293b" strokeDasharray="3,3" />
                  <line x1="0" y1="100" x2="420" y2="100" stroke="#1e293b" strokeDasharray="3,3" />
                  <line x1="0" y1="160" x2="420" y2="160" stroke="#1e293b" strokeDasharray="3,3" />

                  {drawnLines.map((line, idx) => {
                    const yPos = scaleY(line.price);
                    const isSupport = line.type === 'SUPPORT';
                    return (
                      <g key={idx}>
                        <line x1="0" y1={yPos} x2="420" y2={yPos} stroke={isSupport ? '#10b981' : '#ef4444'} strokeWidth="1.5" strokeDasharray="4,2" />
                        <text x="5" y={yPos - 3} fill={isSupport ? '#34d399' : '#f87171'} fontSize="9" fontWeight="bold">
                          {isSupport ? 'Support' : 'Resistance'}: ${line.price.toFixed(2)}
                        </text>
                      </g>
                    );
                  })}

                  <line 
                    x1="0" 
                    y1={scaleY(selectedStock.price)} 
                    x2="420" 
                    y2={scaleY(selectedStock.price)} 
                    stroke={isPositiveChange ? '#10b981' : '#ef4444'} 
                    strokeWidth="1" 
                    strokeDasharray="2,2" 
                  />

                  {candles.map((bar, i) => {
                    const isGreen = bar.close >= bar.open;
                    const color = isGreen ? '#10b981' : '#ef4444';
                    // ปรับขนาดแท่งเทียนให้อัตโนมัติตามจำนวนแท่ง (ถ้าเลือก 3M จะมีแท่งเทียนเยอะขึ้น)
                    const candleWidth = timeframe === '3M' ? 10 : 12;
                    const gap = timeframe === '3M' ? 3 : 15;
                    const x = i * (candleWidth + gap) + 8;

                    const yHigh = scaleY(bar.high);
                    const yLow = scaleY(bar.low);
                    const yOpen = scaleY(bar.open);
                    const yClose = scaleY(bar.close);

                    const bodyTop = Math.min(yOpen, yClose);
                    const bodyHeight = Math.max(3, Math.abs(yClose - yOpen));

                    return (
                      <g key={i}>
                        <line x1={x + candleWidth / 2} y1={yHigh} x2={x + candleWidth / 2} y2={yLow} stroke={color} strokeWidth="1.2" />
                        <rect x={x} y={bodyTop} width={candleWidth} height={bodyHeight} fill={color} rx="1" />
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8', marginTop: '8px', borderTop: '1px solid #1e293b', paddingTop: '6px' }}>
                <span>TF: {timeframe} | High: ${selectedStock.high.toFixed(2)} | Low: ${selectedStock.low.toFixed(2)}</span>
                <span style={{ color: '#34d399', fontWeight: 'bold' }}>● LIVE MARKET</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button 
                onClick={handleBuy}
                style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
              >
                ซื้อ (BUY 5 หุ้น)
              </button>
              <button 
                onClick={handleSell}
                style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
              >
                ขาย (SELL 5 หุ้น)
              </button>
            </div>
          </div>
        </>
      )}

      {activeTab === 'JOURNAL' && (
        <div style={{ backgroundColor: '#161616', padding: '16px', borderRadius: '12px', border: '1px solid #262626' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <BookOpen color="#0284c7" size={22} />
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 'bold', margin: 0 }}>Trade Journal (Web View Mode)</h2>
              <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>วิเคราะห์สถิติพอร์ตและประวัติย้อนหลังแบบเต็มรูปแบบ</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>กำไร/ขาดทุนสุทธิ (PnL)</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: profitLoss >= 0 ? '#10b981' : '#ef4444' }}>
                {profitLoss >= 0 ? `+$${profitLoss.toLocaleString(undefined, {maximumFractionDigits: 2})}` : `-$${Math.abs(profitLoss).toLocaleString(undefined, {maximumFractionDigits: 2})}`}
              </div>
            </div>
            <div style={{ backgroundColor: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>จำนวนไม้ที่บันทึก</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#38bdf8' }}>{demoTrades.length} รายการ</div>
            </div>
          </div>

          <div style={{ backgroundColor: '#0f172a', borderRadius: '10px', padding: '14px', border: '1px solid #1e293b', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff', marginBottom: '10px' }}>📈 กราฟเส้นโค้งผลงานพอร์ตย้อนหลัง (Equity Curve Web View)</div>
            <div style={{ height: '140px', width: '100%', position: 'relative' }}>
              <svg viewBox="0 0 400 140" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <line x1="0" y1="30" x2="400" y2="30" stroke="#1e293b" strokeDasharray="2,2" />
                <line x1="0" y1="70" x2="400" y2="70" stroke="#1e293b" strokeDasharray="2,2" />
                <line x1="0" y1="110" x2="400" y2="110" stroke="#1e293b" strokeDasharray="2,2" />
                <path d="M 0 110 Q 100 85, 200 65 T 400 35" fill="none" stroke="#0284c7" strokeWidth="3" />
                <circle cx="400" cy="35" r="4" fill="#38bdf8" />
              </svg>
            </div>
          </div>

          <div style={{ backgroundColor: '#0f172a', borderRadius: '10px', padding: '14px', border: '1px solid #1e293b', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff', marginBottom: '10px' }}>📋 บันทึกประวัติการเทรดรายไม้</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '160px', overflowY: 'auto' }}>
              {demoTrades.length === 0 ? (
                <div style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', padding: '12px' }}>ยังไม่มีประวัติการซื้อขายในพอร์ต</div>
              ) : (
                demoTrades.map((t, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#1e293b', padding: '8px 10px', borderRadius: '6px', fontSize: '11px' }}>
                    <span style={{ color: t.type === 'BUY' ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>{t.type} {t.symbol} ({t.qty} หุ้น)</span>
                    <span style={{ color: '#cbd5e1' }}>@${t.price.toFixed(2)} - {t.time}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div style={{ backgroundColor: '#0f172a', borderRadius: '10px', padding: '14px', border: '1px solid #1e293b' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff', marginBottom: '6px' }}>💡 พาร์ทเนอร์แนะนำ</div>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 10px 0', lineHeight: '1.5' }}>
              ยกระดับการเก็บบันทึกสถิติการเทรดระดับสากลด้วย Journalytix Pro[span_0](start_span)[span_0](end_span)
            </p>
            <a href="https://journalytix.com?ref=8125056" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', backgroundColor: '#0284c7', color: '#fff', padding: '10px', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', fontSize: '12px' }}>
              สมัครใช้งาน Journalytix <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      )}

      {activeTab === 'ABOUT' && (
        <div style={{ backgroundColor: '#161616', padding: '16px', borderRadius: '12px', border: '1px solid #262626' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Info color="#7c3aed" size={22} />
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 'bold', margin: 0 }}>เกี่ยวกับนักพัฒนา & บ้านเครื่องมือ</h2>
              <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>เบื้องหลังการสร้างแพลตฟอร์ม StockTrade Pro</p>
            </div>
          </div>

          <div style={{ backgroundColor: '#0f172a', borderRadius: '10px', padding: '14px', border: '1px solid #1e293b', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Code size={18} color="#a78bfa" />
              <h3 style={{ fontSize: '13px', fontWeight: 'bold', margin: 0, color: '#fff' }}>นักพัฒนา (Developer)</h3>
            </div>
            <p style={{ fontSize: '12px', color: '#cbd5e1', margin: '0 0 8px 0', lineHeight: '1.5' }}>
              พัฒนาและสร้างสรรค์โดย <strong style={{ color: '#34d399' }}>คุณพล</strong> นักพัฒนาซอฟต์แวร์ Full-Stack ผู้มีความเชี่ยวชาญในการสร้างเว็บและแอปพลิเคชันมือถือผ่านกระบวนการลงมือปฏิบัติจริง (Hands-on Technical Workflow)
            </p>
          </div>

          <div style={{ backgroundColor: '#0f172a', borderRadius: '10px', padding: '14px', border: '1px solid #1e293b', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Smartphone size={18} color="#38bdf8" />
              <h3 style={{ fontSize: '13px', fontWeight: 'bold', margin: 0, color: '#fff' }}>บ้านเครื่องมือ (Tech Stack & Environment)</h3>
            </div>
            <ul style={{ fontSize: '11px', color: '#cbd5e1', margin: 0, paddingLeft: '16px', lineHeight: '1.6' }}>
              <li><strong>Mobile Hardware:</strong> Xiaomi Redmi Note 14 Pro (Android 16)</li>
              <li><strong>Terminal Environment:</strong> Termux บนมือถือ Android สำหรับรันคำสั่ง</li>
              <li><strong>Frontend Framework:</strong> Next.js & React</li>
              <li><strong>Styling & Icons:</strong> Tailwind CSS & Lucide React</li>
              <li><strong>Deployment Pipeline:</strong> Vercel CLI สำหรับ Cloud Production</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'LEADERBOARD' && (
        <div style={{ backgroundColor: '#161616', padding: '16px', borderRadius: '12px', border: '1px solid #262626' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Trophy color="#f59e0b" size={20} />
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 'bold', margin: 0 }}>กระดานผู้นำนักเทรด (Top 15 Global Traders)</h2>
              <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>10 อันดับแรกรับรางวัลพิเศษประจำสัปดาห์</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {leaderboardData.map((item) => (
              <div 
                key={item.rank} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  backgroundColor: item.rank <= 3 ? '#1e293b' : '#111', 
                  padding: '10px 12px', 
                  borderRadius: '8px',
                  border: item.rank === 14 ? '1px solid #10b981' : '1px solid #222'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    backgroundColor: item.rank === 1 ? '#f59e0b' : item.rank === 2 ? '#94a3b8' : item.rank === 3 ? '#b45309' : '#333', 
                    color: '#fff', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    fontSize: '11px', 
                    fontWeight: 'bold' 
                  }}>
                    {item.rank}
                  </span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: item.rank <= 3 ? '#fbbf24' : '#fff' }}>{item.name}</div>
                    <div style={{ fontSize: '10px', color: '#888' }}>{item.reward}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#10b981' }}>{item.profit}</div>
                  <div style={{ fontSize: '10px', color: '#888' }}>ROI: {item.roi}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deposit/Withdraw Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#161616', padding: '24px', borderRadius: '16px', border: '1px solid #333', width: '100%', maxWidth: '320px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
              {modalType === 'DEPOSIT' ? '📥 จำลองฝากเงินเดโม' : '📤 จำลองถอนเงินเดโม'}
            </h3>
            <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input 
                type="number" 
                value={modalAmount} 
                onChange={(e) => setModalAmount(e.target.value)} 
                placeholder="ระบุจำนวนเงิน (USD)" 
                required
                style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#222', border: '1px solid #444', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
              />
              <button type="submit" style={{ backgroundColor: modalType === 'DEPOSIT' ? '#059669' : '#dc2626', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
                ยืนยัน
              </button>
              <button type="button" onClick={() => setShowModal(false)} style={{ backgroundColor: 'transparent', color: '#888', border: 'none', padding: '6px', fontSize: '12px', cursor: 'pointer' }}>
                ยกเลิก
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
