'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Activity, Wallet, TrendingUp, ShoppingBag, ArrowUpRight } from 'lucide-react';

export default function StockTradePro() {
  const [cash, setCash] = useState(150000);
  const [shares, setShares] = useState(25);
  const [price, setPrice] = useState(142.63);
  const [change, setChange] = useState(2.58);
  const [percent, setPercent] = useState(1.84);
  const [trades, setTrades] = useState([
    { type: 'BUY', qty: 15, price: 141.00, time: '09:00' }
  ]);

  const containerRef = useRef<HTMLDivElement>(null);

  // ฝัง TradingView Widget
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container__widget';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';
    containerRef.current.appendChild(widgetContainer);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": "SET:PTT",
      "interval": "D",
      "timezone": "Asia/Bangkok",
      "theme": "dark",
      "style": "1",
      "locale": "th",
      "enable_publishing": false,
      "allow_symbol_change": true,
      "calendar": false,
      "support_host": "https://www.tradingview.com"
    });
    
    containerRef.current.appendChild(script);
  }, []);

  const handleBuy = () => {
    const cost = 5 * price;
    if (cash >= cost) {
      setCash(cash - cost);
      setShares(shares + 5);
      setTrades([{ type: 'BUY', qty: 5, price, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }, ...trades]);
    }
  };

  const handleSell = () => {
    if (shares >= 5) {
      setCash(cash + (5 * price));
      setShares(shares - 5);
      setTrades([{ type: 'SELL', qty: 5, price, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }, ...trades]);
    }
  };

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', minHeight: '100vh', padding: '16px', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity color="#10b981" size={24} />
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>StockTrade Pro</h1>
            <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>Advanced Trading Platform</p>
          </div>
        </div>
        <div style={{ backgroundColor: '#064e3b', color: '#34d399', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
          ● LIVE
        </div>
      </div>

      {/* Portfolio Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <div style={{ backgroundColor: '#161616', padding: '14px', borderRadius: '12px', border: '1px solid #262626' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '12px', marginBottom: '6px' }}>
            <Wallet size={14} /> เงินสดในพอร์ต
          </div>
          <div style={{ fontSize: '15px', fontWeight: 'bold' }}>฿{cash.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
        </div>
        <div style={{ backgroundColor: '#161616', padding: '14px', borderRadius: '12px', border: '1px solid #262626' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '12px', marginBottom: '6px' }}>
            <TrendingUp size={14} /> มูลค่าหุ้นทั้งหมด
          </div>
          <div style={{ fontSize: '15px', fontWeight: 'bold' }}>{shares} หุ้น <span style={{ fontSize: '11px', color: '#888' }}>(฿{(shares * price).toLocaleString(undefined, {maximumFractionDigits: 0})})</span></div>
        </div>
      </div>

      {/* Stock Trading & TradingView Widget Section */}
      <div style={{ backgroundColor: '#161616', padding: '16px', borderRadius: '12px', border: '1px solid #262626', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: 'bold', margin: 0 }}>PTT PUBLIC COMPANY</h2>
            <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>SET: PTT • Energy & Utilities</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>฿{price.toFixed(2)}</div>
            <div style={{ fontSize: '11px', color: '#10b981' }}>+{change} (+{percent}%)</div>
          </div>
        </div>

        {/* TradingView Widget Container */}
        <div ref={containerRef} className="tradingview-widget-container" style={{ width: '100%', height: '350px', marginBottom: '14px', borderRadius: '8px', overflow: 'hidden' }} />

        {/* Buy / Sell Buttons */}
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

      {/* Journalytix Affiliate Banner */}
      <div style={{ backgroundColor: '#161616', padding: '16px', borderRadius: '12px', border: '1px solid #262626', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <ShoppingBag size={18} color="#10b981" />
          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Journalytix Pro Trading Journal</span>
        </div>
        <div style={{ backgroundColor: '#064e3b', color: '#34d399', display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', marginBottom: '8px' }}>
          RECOMMENDED PARTNER
        </div>
        <p style={{ fontSize: '12px', color: '#aaa', margin: '0 0 12px 0' }}>
          ยกระดับการบันทึกสถิติการเทรด วิเคราะห์พฤติกรรม และวัดผลกำไร-ขาดทุนอย่างมืออาชีพด้วยเครื่องมือระดับสากล
        </p>
        <a href="https://journalytix.com?ref=8125056" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', backgroundColor: '#10b981', color: '#000', padding: '10px', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', fontSize: '13px' }}>
          สมัครใช้งาน Journalytix <ArrowUpRight size={16} />
        </a>
      </div>

      {/* Trade History */}
      <div style={{ backgroundColor: '#161616', padding: '14px', borderRadius: '12px', border: '1px solid #262626' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 10px 0', color: '#888' }}>ประวัติการทำรายการล่าสุด</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {trades.map((t, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-sign', fontSize: '12px', borderBottom: '1px solid #222', paddingBottom: '6px', justifyContent: 'space-between' }}>
              <span style={{ color: t.type === 'BUY' ? '#10b981' : '#dc2626', fontWeight: 'bold' }}>
                {t.type === 'BUY' ? 'ซื้อ' : 'ขาย'} PTT จำนวน {t.qty} หุ้น
              </span>
              <span style={{ color: '#aaa' }}>@฿{t.price.toFixed(2)} ({t.time})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
