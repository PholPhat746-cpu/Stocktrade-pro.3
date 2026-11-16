'use client';
import { useState, useEffect } from 'react';

export default function WebViewChart({ symbol = 'NASDAQ:MSFT', interval = 'D' }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [symbol, interval]);

  const chartUrl = `https://s.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=${encodeURIComponent(
    symbol
  )}&interval=${interval}&hidesidetoolbar=1&symboledit=0&saveimage=0&toolbarbg=0b0f19&studies=%5B%5D&theme=dark&style=1&timezone=Asia%2FBangkok&withdateranges=1&showpopupbutton=0&locale=th_TH`;

  return (
    <div className="relative w-full h-[380px] bg-[#0b0f19] rounded-xl overflow-hidden border border-slate-800">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0b0f19] z-10 text-slate-400 text-sm">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2"></div>
          <span>กำลังโหลดกราฟ {symbol}...</span>
        </div>
      )}

      <iframe
        key={`${symbol}-${interval}`}
        src={chartUrl}
        title={`กราฟราคา ${symbol}`}
        className="w-full h-full border-0"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
