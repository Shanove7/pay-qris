// credits : kasan
import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const [amount, setAmount] = useState('');
  const [model, setModel] = useState('standard');
  const [finalQRIS, setFinalQRIS] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  
  const baseQRIS = "00020101021126610016ID.CO.SHOPEE.WWW01189360091800219377670208219377670303UMI51440014ID.CO.QRIS.WWW0215ID10243669982000303UMI5204581253033605802ID5906Khasan6006BATANG61055125262070703A0163043C8D";

  const calcCRC16 = (str) => {
    let crc = 0xFFFF;
    for (let i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        if ((crc & 0x8000) !== 0) {
          crc = (crc << 1) ^ 0x1021;
        } else {
          crc <<= 1;
        }
      }
    }
    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  };

  const generate = () => {
    let raw = baseQRIS.substring(0, baseQRIS.length - 4);
    if (amount && parseInt(amount) > 0) {
      const parts = raw.split('5802ID');
      const amtStr = amount.toString();
      const amtTag = `54${amtStr.length.toString().padStart(2, '0')}${amtStr}`;
      raw = parts[0].includes('54') 
        ? parts[0].replace(/54\d{2}\d+/, amtTag) + '5802ID' + parts[1]
        : parts[0] + amtTag + '5802ID' + parts[1];
    }
    const res = raw + calcCRC16(raw);
    setFinalQRIS(res);
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(res)}`);
  };

  useEffect(() => {
    generate();
  }, [amount]);

  const models = {
    standard: { bg: 'bg-white', text: 'text-slate-900', accent: 'bg-blue-600', head: 'QRIS STANDAR' },
    dark: { bg: 'bg-slate-900', text: 'text-white', accent: 'bg-amber-500', head: 'PREMIUM PAYMENT' },
    glass: { bg: 'bg-gradient-to-br from-purple-500 to-pink-500', text: 'text-white', accent: 'bg-white/20', head: 'MODERN PAY' },
    minimal: { bg: 'bg-zinc-50', text: 'text-zinc-800', accent: 'bg-zinc-800', head: 'Khasan Store' }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-10 font-sans flex flex-col md:flex-row gap-8 justify-center items-start">
      <div className="w-full max-w-md space-y-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Pengaturan QRIS</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Nominal (Rp)</label>
              <input 
                type="number" 
                placeholder="Kosongkan untuk statis"
                className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Pilih Model</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {Object.keys(models).map((m) => (
                  <button 
                    key={m}
                    onClick={() => setModel(m)}
                    className={`p-3 rounded-xl border text-sm font-bold capitalize transition-all ${model === m ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-200 text-gray-600'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">String QRIS Hasil</h3>
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 break-all text-[10px] font-mono text-gray-500 max-h-24 overflow-y-auto">
            {finalQRIS}
          </div>
        </div>
      </div>

      <div className={`w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-500 ${models[model].bg} ${models[model].text}`}>
        <div className="p-8 flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-6">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg" alt="QRIS" className={`h-6 ${model === 'dark' || model === 'glass' ? 'brightness-0 invert' : ''}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{models[model].head}</span>
          </div>

          <div className="bg-white p-4 rounded-3xl shadow-inner relative group">
            <img src={qrUrl} alt="QR" className="w-64 h-64 mix-blend-multiply" />
          </div>

          <div className="mt-8 text-center space-y-1">
            <h1 className="text-2xl font-black uppercase tracking-tight">Khasan</h1>
            <p className="text-xs opacity-60 font-medium">NMK: ID1024366998200</p>
          </div>

          {amount && (
            <div className={`mt-6 px-6 py-3 rounded-2xl ${models[model].accent} bg-opacity-10 border border-current border-opacity-10 text-center`}>
              <p className="text-[10px] uppercase font-bold opacity-60">Total Bayar</p>
              <p className="text-xl font-black">Rp {parseInt(amount).toLocaleString('id-ID')}</p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-current border-opacity-10 w-full flex justify-center gap-4">
             <div className="flex flex-col items-center opacity-40">
                <div className="w-2 h-2 rounded-full bg-current mb-1" />
                <span className="text-[8px] font-bold">AMAN</span>
             </div>
             <div className="flex flex-col items-center opacity-40">
                <div className="w-2 h-2 rounded-full bg-current mb-1" />
                <span className="text-[8px] font-bold">CEPAT</span>
             </div>
             <div className="flex flex-col items-center opacity-40">
                <div className="w-2 h-2 rounded-full bg-current mb-1" />
                <span className="text-[8px] font-bold">MUDAH</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
