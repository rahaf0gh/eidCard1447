"use client";

// app/customize/page.tsx

import { useState, useRef, useEffect } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, runTransaction } from "firebase/database";

// ── Firebase ──────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyCIGMdnGQQyxpDf_AnVQTcbLwAl3wBp3fI",
  authDomain: "eid1447-627fc.firebaseapp.com",
  databaseURL: "https://eid1447-627fc-default-rtdb.firebaseio.com",
  projectId: "eid1447-627fc",
  storageBucket: "eid1447-627fc.firebasestorage.app",
  messagingSenderId: "116647763860",
  appId: "1:116647763860:web:53917aae32bcac0fa2b981",
};
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db  = getDatabase(app);
const incrementCount = () =>
  runTransaction(ref(db, "downloadCount"), (cur) => (cur ?? 0) + 1);

// ── رابط الواتساب ─────────────────────────────────────────────────
const WHATSAPP_NUMBER = "966580589199";
const WHATSAPP_MSG    = encodeURIComponent("أهلاً، أريد تخصيص تهنئة العيد");
const WHATSAPP_URL    = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;

// ── ثوابت ─────────────────────────────────────────────────────────
const CARD_DESIGNS = [
  { id:1, label:"فجر ذهبي",     gradient:"linear-gradient(135deg,#1a1a2e 0%,#16213e 40%,#c8a84b 100%)", accent:"#c8a84b" },
  { id:2, label:"ليلة عيد",     gradient:"linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)", accent:"#a78bfa" },
  { id:3, label:"وردي ناعم",    gradient:"linear-gradient(135deg,#f8cdda 0%,#e8a0b4 50%,#c06c84 100%)", accent:"#6c2c5a" },
  { id:4, label:"سماء زرقاء",   gradient:"linear-gradient(135deg,#0f2027 0%,#203a43 50%,#2c5364 100%)", accent:"#7dd3fc" },
  { id:5, label:"أخضر فيروزي",  gradient:"linear-gradient(135deg,#0d4d3a 0%,#1a7a5e 50%,#22c55e 100%)", accent:"#a7f3d0" },
  { id:6, label:"غروب برتقالي", gradient:"linear-gradient(135deg,#7c2d12 0%,#c2410c 50%,#f97316 100%)", accent:"#fed7aa" },
  { id:7, label:"بنفسجي ملكي",  gradient:"linear-gradient(135deg,#3b0764 0%,#6b21a8 50%,#a855f7 100%)", accent:"#e9d5ff" },
  { id:8, label:"وردي ذهبي",    gradient:"linear-gradient(135deg,#831843 0%,#be185d 50%,#c8a84b 100%)", accent:"#fce7f3" },
  { id:9, label:"ليلي هادئ",    gradient:"linear-gradient(135deg,#0c1445 0%,#1e3a5f 50%,#2563eb 100%)", accent:"#bfdbfe" },
];

const ARABIC_FONTS = [
  { label:"تجوال",    value:"Tajawal",           google:"Tajawal:wght@700;900" },
  { label:"كايرو",    value:"Cairo",             google:"Cairo:wght@700;900" },
  { label:"أميري",    value:"Amiri",             google:"Amiri:wght@700" },
  { label:"نوتو نسخ", value:"Noto Naskh Arabic", google:"Noto+Naskh+Arabic:wght@700" },
  { label:"لطيف",     value:"Lateef",            google:"Lateef:wght@700" },
];

const FONT_SIZES    = [20, 24, 28, 32, 36, 42, 48, 56];
const PRESET_COLORS = ["#ffffff","#f0e6c8","#c8a84b","#fca5a5","#a5f3fc","#bbf7d0","#e9d5ff","#000000"];

type Mode = "single" | "bulk";

// ── Canvas renderer ────────────────────────────────────────────────
function renderCard(
  canvas: HTMLCanvasElement,
  gradient: string,
  mainText: string, mainFont: string, mainSize: number, mainColor: string, mainPosY: number,
  nameText: string, nameFont: string, nameSize: number, nameColor: string, namePosY: number,
  w = 540, h = 900,
): string {
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const grd = ctx.createLinearGradient(0, 0, w, h);
  const cols = gradient.match(/#[0-9a-fA-F]{6}/g) ?? ["#1a1a2e","#c8a84b"];
  cols.forEach((c, i) => grd.addColorStop(i / Math.max(cols.length - 1, 1), c));
  ctx.fillStyle = grd; ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(255,255,255,0.12)"; ctx.lineWidth = 2;
  ctx.strokeRect(16, 16, w - 32, h - 32);
  ctx.beginPath(); ctx.arc(w-80, 80, 120, 0, Math.PI*2);
  ctx.fillStyle = "rgba(255,255,255,0.05)"; ctx.fill();
  ctx.beginPath(); ctx.arc(80, h-80, 90, 0, Math.PI*2);
  ctx.fillStyle = "rgba(255,255,255,0.04)"; ctx.fill();
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  if (mainText.trim()) {
    ctx.font = `bold ${mainSize}px '${mainFont}','Tajawal',sans-serif`;
    ctx.fillStyle = mainColor;
    ctx.shadowColor = "rgba(0,0,0,0.4)"; ctx.shadowBlur = 8;
    ctx.fillText(mainText, w/2, h*mainPosY); ctx.shadowBlur = 0;
  }
  if (nameText.trim()) {
    ctx.font = `bold ${nameSize}px '${nameFont}','Tajawal',sans-serif`;
    ctx.fillStyle = nameColor;
    ctx.shadowColor = "rgba(0,0,0,0.35)"; ctx.shadowBlur = 6;
    ctx.fillText(nameText, w/2, h*namePosY); ctx.shadowBlur = 0;
  }
  return canvas.toDataURL("image/png");
}

// ── CSS Preview ────────────────────────────────────────────────────
function CardPreview({ design, mainText, mainFont, mainSize, mainColor, mainPosY, nameText, nameFont, nameSize, nameColor, namePosY }: {
  design: typeof CARD_DESIGNS[0];
  mainText:string; mainFont:string; mainSize:number; mainColor:string; mainPosY:number;
  nameText:string; nameFont:string; nameSize:number; nameColor:string; namePosY:number;
}) {
  return (
    <div className="relative w-full overflow-hidden rounded-xl select-none"
      style={{ paddingBottom:"160%", background:design.gradient }}>
      <div className="absolute inset-0">
        <div className="absolute inset-2 rounded-lg" style={{border:"1px solid rgba(255,255,255,0.12)"}}/>
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full" style={{background:"rgba(255,255,255,0.05)"}}/>
        <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full" style={{background:"rgba(255,255,255,0.04)"}}/>
        <div className="absolute w-full text-center px-4 font-bold" style={{
          top:`${mainPosY*100}%`, transform:"translateY(-50%)",
          fontFamily:`'${mainFont}','Tajawal',sans-serif`,
          fontSize:`clamp(12px,3vw,${mainSize}px)`,
          color: mainText ? mainColor : "rgba(255,255,255,0.2)",
          textShadow:"0 2px 8px rgba(0,0,0,0.4)",
        }}>
          {mainText || "النص هنا"}
        </div>
        <div className="absolute w-full text-center px-4 font-bold" style={{
          top:`${namePosY*100}%`, transform:"translateY(-50%)",
          fontFamily:`'${nameFont}','Tajawal',sans-serif`,
          fontSize:`clamp(10px,2.4vw,${nameSize}px)`,
          color: nameText ? nameColor : "rgba(255,255,255,0.15)",
          textShadow:"0 2px 6px rgba(0,0,0,0.4)",
        }}>
          {nameText || "الاسم هنا"}
        </div>
      </div>
    </div>
  );
}

// ── FontControls ───────────────────────────────────────────────────
function FontControls({ font, setFont, size, setSize, color, setColor, label, accentColor }: {
  font:string; setFont:(v:string)=>void;
  size:number; setSize:(v:number)=>void;
  color:string; setColor:(v:string)=>void;
  label:string; accentColor:string;
}) {
  return (
    <div className="rounded-2xl p-4" style={{background:"rgba(255,255,255,.04)", border:`1px solid ${accentColor}22`}}>
      <h3 className="text-sm font-bold mb-3" style={{color:"rgba(240,230,200,.75)"}}>إعدادات {label}</h3>
      <p className="text-xs mb-2" style={{color:"rgba(240,230,200,.4)"}}>نوع الخط</p>
      <div className="grid grid-cols-3 gap-1.5 mb-4">
        {ARABIC_FONTS.map((f) => (
          <button key={f.value} onClick={()=>setFont(f.value)}
            className="px-2 py-2 rounded-lg text-xs transition-all cursor-pointer text-center"
            style={{
              background: font===f.value ? `${accentColor}28` : "rgba(255,255,255,.04)",
              border:`1px solid ${font===f.value ? accentColor+"88" : "rgba(255,255,255,.08)"}`,
              color: font===f.value ? accentColor : "rgba(240,230,200,.6)",
              fontFamily:`'${f.value}',sans-serif`,
            }}>
            {f.label}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs" style={{color:"rgba(240,230,200,.4)"}}>حجم الخط</p>
        <span className="text-xs font-bold" style={{color:accentColor}}>{size}px</span>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {FONT_SIZES.map((s) => (
          <button key={s} onClick={()=>setSize(s)}
            className="w-10 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer"
            style={{
              background: size===s ? `${accentColor}28` : "rgba(255,255,255,.05)",
              border:`1px solid ${size===s ? accentColor+"88" : "rgba(255,255,255,.08)"}`,
              color: size===s ? accentColor : "rgba(240,230,200,.6)",
              fontFamily:"Tajawal,sans-serif",
            }}>
            {s}
          </button>
        ))}
      </div>
      <p className="text-xs mb-2" style={{color:"rgba(240,230,200,.4)"}}>لون الخط</p>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {PRESET_COLORS.map((c) => (
          <button key={c} onClick={()=>setColor(c)}
            className="w-7 h-7 rounded-lg transition-all cursor-pointer"
            style={{
              background:c,
              border:`2px solid ${color===c ? accentColor : "rgba(255,255,255,.15)"}`,
              transform: color===c ? "scale(1.2)" : undefined,
              boxShadow: color===c ? `0 0 0 2px ${accentColor}55` : undefined,
            }}/>
        ))}
        <label className="w-7 h-7 rounded-lg cursor-pointer flex items-center justify-center relative overflow-hidden"
          style={{background:"rgba(255,255,255,.08)",border:"1px dashed rgba(255,255,255,.2)",color:"rgba(240,230,200,.5)",fontSize:"14px"}}>
          +
          <input type="color" value={color} onChange={(e)=>setColor(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
        </label>
      </div>
      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg" style={{background:"rgba(255,255,255,.04)"}}>
        <span className="w-4 h-4 rounded" style={{background:color, boxShadow:"0 1px 4px rgba(0,0,0,.3)"}}/>
        <span className="text-xs font-mono" style={{color:"rgba(240,230,200,.45)"}}>{color}</span>
      </div>
    </div>
  );
}

// ── الصفحة ────────────────────────────────────────────────────────
export default function CustomizePage() {
  const [mode, setMode]             = useState<Mode>("single");
  const [selectedId, setSelectedId] = useState<number>(1);
  const [mainText, setMainText]     = useState("");
  const [mainFont, setMainFont]     = useState(ARABIC_FONTS[0].value);
  const [mainSize, setMainSize]     = useState(36);
  const [mainColor, setMainColor]   = useState("#f0e6c8");
  const [mainPosY, setMainPosY]     = useState(0.38);
  const [nameText, setNameText]     = useState("");
  const [nameFont, setNameFont]     = useState(ARABIC_FONTS[0].value);
  const [nameSize, setNameSize]     = useState(28);
  const [nameColor, setNameColor]   = useState("#c8a84b");
  const [namePosY, setNamePosY]     = useState(0.62);
  const [namesInput, setNamesInput] = useState("");
  const [bulkPreviews, setBulkPreviews] = useState<{name:string;url:string}[]>([]);
  const [bulkLoading, setBulkLoading]   = useState(false);

  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const selectedDesign = CARD_DESIGNS.find((d) => d.id === selectedId)!;

  useEffect(() => {
    const params = ARABIC_FONTS.map((f) => `family=${f.google}`).join("&");
    const link = document.createElement("link");
    link.rel="stylesheet";
    link.href=`https://fonts.googleapis.com/css2?${params}&display=swap`;
    document.head.appendChild(link);
  }, []);

  const makeImage = (overrideName?: string) =>
    renderCard(canvasRef.current!, selectedDesign.gradient,
      mainText, mainFont, mainSize, mainColor, mainPosY,
      overrideName ?? nameText, nameFont, nameSize, nameColor, namePosY);

  const handleDownload = () => {
    const url = makeImage();
    const a = document.createElement("a");
    a.href=url; a.download=`card-${nameText||mainText||"بطاقة"}.png`; a.click();
    incrementCount();
  };

  const handleShare = async () => {
    const url = makeImage();
    const blob = await (await fetch(url)).blob();
    const file = new File([blob],"card.png",{type:"image/png"});
    if (navigator.share) { await navigator.share({files:[file],title:"عيد سعيد"}); incrementCount(); }
    else { await navigator.clipboard.writeText(window.location.href); alert("تم نسخ الرابط!"); }
  };

  const handleBulkGenerate = async () => {
    const names = namesInput.split("\n").map((n)=>n.trim()).filter(Boolean);
    if (!names.length) return alert("أدخل أسماء أولاً");
    setBulkLoading(true); setBulkPreviews([]);
    const canvas = document.createElement("canvas");
    setBulkPreviews(names.map((name) => ({
      name,
      url: renderCard(canvas, selectedDesign.gradient,
        mainText, mainFont, mainSize, mainColor, mainPosY,
        name, nameFont, nameSize, nameColor, namePosY),
    })));
    setBulkLoading(false);
  };

  const handleDownloadZip = async () => {
    if (!bulkPreviews.length) return;
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      bulkPreviews.forEach(({name,url}) => zip.file(`${name}.png`, url.split(",")[1], {base64:true}));
      const blob = await zip.generateAsync({type:"blob"});
      const a = document.createElement("a");
      a.href=URL.createObjectURL(blob); a.download="eid-cards.zip"; a.click();
    } catch { alert("تأكد من تثبيت jszip: npm install jszip"); }
  };

  const bulkNames = namesInput.split("\n").map((n)=>n.trim()).filter(Boolean);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap');
        body{font-family:'Tajawal',sans-serif;direction:rtl;margin:0;background:#0f0c1e;}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        @keyframes fadeSlide{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .shimmer{background:linear-gradient(90deg,#c8a84b,#f0e6c8,#c8a84b);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 3s linear infinite;}
        .fade-in{animation:fadeSlide .3s ease;}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(200,168,75,.3);border-radius:99px}
        input[type=color]{-webkit-appearance:none;border:none;padding:0;}
        input[type=color]::-webkit-color-swatch-wrapper{padding:0}
        input[type=color]::-webkit-color-swatch{border:none;border-radius:6px}
      `}</style>

      {/* خلفية */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0" style={{background:"#0f0c1e"}}/>
        <div className="absolute inset-0" style={{background:"radial-gradient(ellipse at 15% 20%,rgba(98,32,105,.45) 0%,transparent 50%),radial-gradient(ellipse at 85% 80%,rgba(193,143,20,.3) 0%,transparent 50%)"}}/>
      </div>

      <div className="relative z-10 min-h-screen px-4 py-10 max-w-6xl mx-auto">

        {/* زر الرئيسية — يمين الصفحة */}
        <div className="flex justify-start mb-4">
          <button
            suppressHydrationWarning
            onClick={() => window.location.href = "/"}
            className="cursor-pointer transition-all hover:-translate-y-0.5 inline-flex items-center gap-1.5"
            style={{
              padding:"8px 16px", borderRadius:"12px",
              background:"rgba(255,255,255,.07)",
              border:"1px solid rgba(255,255,255,.12)",
              color:"rgba(240,230,200,.7)",
              fontFamily:"Tajawal,sans-serif",
              fontSize:"14px", fontWeight:700,
            }}>
            ← الرئيسية
          </button>
        </div>

        {/* عنوان */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs mb-3"
            style={{background:"rgba(193,143,20,.15)",border:"1px solid rgba(193,143,20,.3)",color:"#c8a84b"}}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#c8a84b]" style={{animation:"pulse 2s infinite"}}/>
            تخصيص البطاقة
          </div>
          <h1 className="text-4xl font-black shimmer mb-1">صمّم بطاقتك</h1>
        </div>

        {/* تبويب الوضع */}
        <div className="flex justify-center mb-7">
          <div className="flex gap-1 p-1 rounded-2xl" style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.08)"}}>
            {([["single","🎴 بطاقة واحدة"],["bulk","🎁 إهداء جماعي"]] as [Mode,string][]).map(([m,lbl])=>(
              <button key={m} onClick={()=>setMode(m)}
                className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer"
                style={{
                  background:mode===m?"linear-gradient(135deg,#622069,#8b2d95)":"transparent",
                  color:mode===m?"#fff":"rgba(240,230,200,.5)",
                  boxShadow:mode===m?"0 4px 16px rgba(98,32,105,.4)":"none",
                  fontFamily:"Tajawal,sans-serif",
                }}>
                {lbl}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_390px] gap-5">

          {/* يسار: الإعدادات */}
          <div className="flex flex-col gap-4">

            {/* اختيار التصميم */}
            <div className="rounded-2xl p-5" style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)"}}>
              <h2 className="text-sm font-bold mb-3" style={{color:"rgba(240,230,200,.7)"}}>🖼 اختر التصميم</h2>
              <div className="grid grid-cols-3 gap-2">
                {CARD_DESIGNS.map((d)=>(
                  <div key={d.id} onClick={()=>setSelectedId(d.id)}
                    className="cursor-pointer rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1"
                    style={{
                      border:`2px solid ${selectedId===d.id?"#c8a84b":"rgba(255,255,255,.08)"}`,
                      boxShadow:selectedId===d.id?"0 0 0 2px rgba(200,168,75,.3),0 8px 24px rgba(0,0,0,.4)":undefined,
                      transform:selectedId===d.id?"translateY(-3px) scale(1.03)":undefined,
                    }}>
                    <div className="relative" style={{paddingBottom:"160%",background:d.gradient}}>
                      <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full" style={{background:"rgba(255,255,255,.07)"}}/>
                      <div className="absolute inset-0 flex items-end justify-center pb-1.5">
                        <span style={{fontSize:"10px",fontWeight:700,color:d.accent,textShadow:"0 1px 4px rgba(0,0,0,.5)"}}>{d.label}</span>
                      </div>
                      {selectedId===d.id && (
                        <div className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center font-black"
                          style={{background:"#c8a84b",color:"#1a1a2e",fontSize:"10px"}}>✓</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* النص الرئيسي */}
            <div className="rounded-2xl p-5" style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(200,168,75,.18)"}}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full" style={{background:"#c8a84b"}}/>
                <h2 className="text-sm font-bold" style={{color:"rgba(240,230,200,.8)"}}>النص الرئيسي</h2>
                <span className="text-xs px-2 py-0.5 rounded-full mr-auto" style={{background:"rgba(200,168,75,.12)",color:"#c8a84b"}}>يظهر فوق</span>
              </div>
              <input suppressHydrationWarning type="text" placeholder="مثال: عيد مبارك وسعيد..." value={mainText}
                onChange={(e)=>setMainText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-right text-base outline-none transition-all"
                style={{background:"rgba(255,255,255,.07)",border:"1px solid rgba(200,168,75,.2)",color:"#f0e6c8",fontFamily:`'${mainFont}',Tajawal,sans-serif`}}
                onFocus={(e)=>{e.target.style.borderColor="rgba(200,168,75,.6)";e.target.style.boxShadow="0 0 0 3px rgba(200,168,75,.12)";}}
                onBlur={(e)=>{e.target.style.borderColor="rgba(200,168,75,.2)";e.target.style.boxShadow="none";}}
              />
              <div className="flex gap-2 mt-3">
                <span className="text-xs self-center" style={{color:"rgba(240,230,200,.4)"}}>الموضع:</span>
                {[{label:"أعلى",v:0.18},{label:"وسط علوي",v:0.38},{label:"وسط",v:0.5},{label:"أسفل",v:0.82}].map((p)=>(
                  <button key={p.v} onClick={()=>setMainPosY(p.v)}
                    className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    style={{
                      background:mainPosY===p.v?"rgba(200,168,75,.2)":"rgba(255,255,255,.04)",
                      border:`1px solid ${mainPosY===p.v?"rgba(200,168,75,.5)":"rgba(255,255,255,.08)"}`,
                      color:mainPosY===p.v?"#c8a84b":"rgba(240,230,200,.55)",
                      fontFamily:"Tajawal,sans-serif",
                    }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <FontControls font={mainFont} setFont={setMainFont} size={mainSize} setSize={setMainSize}
              color={mainColor} setColor={setMainColor} label="النص الرئيسي" accentColor="#c8a84b"/>

            {/* الاسم */}
            <div className="rounded-2xl p-5" style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(167,139,250,.18)"}}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full" style={{background:"#a78bfa"}}/>
                <h2 className="text-sm font-bold" style={{color:"rgba(240,230,200,.8)"}}>
                  {mode==="single" ? "الاسم" : "أسماء المُهدى إليهم"}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full mr-auto" style={{background:"rgba(167,139,250,.12)",color:"#a78bfa"}}>يظهر تحت</span>
              </div>
              {mode==="single" ? (
                <input suppressHydrationWarning type="text" placeholder="مثال: محمد العمري" value={nameText}
                  onChange={(e)=>setNameText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-right text-base outline-none transition-all"
                  style={{background:"rgba(255,255,255,.07)",border:"1px solid rgba(167,139,250,.2)",color:"#f0e6c8",fontFamily:`'${nameFont}',Tajawal,sans-serif`}}
                  onFocus={(e)=>{e.target.style.borderColor="rgba(167,139,250,.6)";e.target.style.boxShadow="0 0 0 3px rgba(167,139,250,.12)";}}
                  onBlur={(e)=>{e.target.style.borderColor="rgba(167,139,250,.2)";e.target.style.boxShadow="none";}}
                />
              ) : (
                <>
                  <textarea placeholder={"محمد العمري\nسارة الأحمدي\nعبدالله الزهراني"}
                    value={namesInput} onChange={(e)=>{setNamesInput(e.target.value);setBulkPreviews([]);}}
                    rows={4} className="w-full px-4 py-3 rounded-xl text-right text-base outline-none resize-none transition-all"
                    style={{background:"rgba(255,255,255,.07)",border:"1px solid rgba(167,139,250,.2)",color:"#f0e6c8",fontFamily:"Tajawal,sans-serif"}}
                    onFocus={(e)=>{e.target.style.borderColor="rgba(167,139,250,.6)";e.target.style.boxShadow="0 0 0 3px rgba(167,139,250,.12)";}}
                    onBlur={(e)=>{e.target.style.borderColor="rgba(167,139,250,.2)";e.target.style.boxShadow="none";}}
                  />
                  {bulkNames.length>0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]"/>
                      <span className="text-xs" style={{color:"#a78bfa"}}>{bulkNames.length} أسماء</span>
                    </div>
                  )}
                </>
              )}
              <div className="flex gap-2 mt-3">
                <span className="text-xs self-center" style={{color:"rgba(240,230,200,.4)"}}>الموضع:</span>
                {[{label:"أعلى",v:0.18},{label:"وسط",v:0.5},{label:"وسط سفلي",v:0.62},{label:"أسفل",v:0.82}].map((p)=>(
                  <button key={p.v} onClick={()=>setNamePosY(p.v)}
                    className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    style={{
                      background:namePosY===p.v?"rgba(167,139,250,.2)":"rgba(255,255,255,.04)",
                      border:`1px solid ${namePosY===p.v?"rgba(167,139,250,.5)":"rgba(255,255,255,.08)"}`,
                      color:namePosY===p.v?"#a78bfa":"rgba(240,230,200,.55)",
                      fontFamily:"Tajawal,sans-serif",
                    }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <FontControls font={nameFont} setFont={setNameFont} size={nameSize} setSize={setNameSize}
              color={nameColor} setColor={setNameColor} label="الاسم" accentColor="#a78bfa"/>
          </div>

          {/* يمين: المعاينة */}
          <div>
            <div className="rounded-2xl p-5 sticky top-6" style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)"}}>
              <h2 className="text-sm font-bold mb-4" style={{color:"rgba(240,230,200,.7)"}}>
                {mode==="single" ? "👁 المعاينة الفورية" : "🎁 الإهداء الجماعي"}
              </h2>
              <div className="mb-4">
                <CardPreview design={selectedDesign}
                  mainText={mainText} mainFont={mainFont} mainSize={mainSize} mainColor={mainColor} mainPosY={mainPosY}
                  nameText={mode==="single" ? nameText : (bulkNames[0] || "الاسم الأول")}
                  nameFont={nameFont} nameSize={nameSize} nameColor={nameColor} namePosY={namePosY}
                />
                <div className="flex gap-4 justify-center mt-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{background:"#c8a84b"}}/>
                    <span className="text-xs" style={{color:"rgba(240,230,200,.4)"}}>النص (فوق)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{background:"#a78bfa"}}/>
                    <span className="text-xs" style={{color:"rgba(240,230,200,.4)"}}>الاسم (تحت)</span>
                  </div>
                </div>
              </div>

              {mode==="single" && (
                <div className="grid grid-cols-2 gap-2.5">
                  <button suppressHydrationWarning onClick={handleDownload}
                    className="flex items-center justify-center gap-1.5 py-3.5 rounded-xl font-bold text-sm text-white cursor-pointer transition-all hover:-translate-y-0.5 active:scale-95"
                    style={{background:"linear-gradient(135deg,#622069,#8b2d95)",boxShadow:"0 4px 16px rgba(98,32,105,.4)",fontFamily:"Tajawal,sans-serif"}}>
                    ⬇ تحميل
                  </button>
                  <button suppressHydrationWarning onClick={handleShare}
                    className="flex items-center justify-center gap-1.5 py-3.5 rounded-xl font-bold text-sm cursor-pointer transition-all hover:-translate-y-0.5 active:scale-95"
                    style={{background:"rgba(200,168,75,.12)",border:"1px solid rgba(200,168,75,.3)",color:"#c8a84b",fontFamily:"Tajawal,sans-serif"}}>
                    🔗 مشاركة
                  </button>
                </div>
              )}

              {mode==="bulk" && (
                <>
                  <button suppressHydrationWarning onClick={handleBulkGenerate} disabled={bulkLoading||bulkNames.length===0}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base text-white cursor-pointer transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed mb-4"
                    style={{background:"linear-gradient(135deg,#622069,#8b2d95)",boxShadow:"0 4px 20px rgba(98,32,105,.5)",fontFamily:"Tajawal,sans-serif"}}>
                    {bulkLoading?"⏳ جاري التوليد...":`✨ توليد ${bulkNames.length>0?bulkNames.length+" ":""}بطاقات`}
                  </button>
                  {bulkPreviews.length>0 && (
                    <div className="fade-in">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold" style={{color:"#c8a84b"}}>✅ {bulkPreviews.length} بطاقة</span>
                        <button suppressHydrationWarning onClick={handleDownloadZip}
                          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                          style={{background:"linear-gradient(135deg,#1a7a45,#22a05a)",color:"#fff",fontFamily:"Tajawal,sans-serif"}}>
                          📦 تحميل ZIP
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                        {bulkPreviews.map(({name,url})=>(
                          <div key={name}
                            className="group relative cursor-pointer rounded-xl overflow-hidden transition-all hover:scale-[1.03]"
                            style={{border:"1px solid rgba(255,255,255,.08)"}}
                            onClick={()=>{const a=document.createElement("a");a.href=url;a.download=`${name}.png`;a.click();incrementCount();}}>
                            <img src={url} alt={name} className="w-full block"/>
                            <div className="absolute inset-0 flex flex-col items-center justify-end pb-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{background:"linear-gradient(to top,rgba(0,0,0,.75) 0%,transparent 60%)"}}>
                              <p className="text-white text-xs font-bold">{name}</p>
                              <p className="text-xs" style={{color:"rgba(200,168,75,.9)"}}>⬇ تحميل</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {!bulkLoading&&bulkPreviews.length===0 && (
                    <div className="text-center py-8">
                      <p className="text-3xl mb-2">👥</p>
                      <p className="text-sm" style={{color:"rgba(240,230,200,.3)"}}>
                        {bulkNames.length===0?"أدخل الأسماء في الحقل":`اضغط توليد لإنشاء ${bulkNames.length} بطاقة`}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* فوتر */}
      <footer className="w-full mt-12 py-6 px-4"
        style={{borderTop:"1px solid rgba(255,255,255,.07)",background:"rgba(0,0,0,.25)",backdropFilter:"blur(10px)"}}>
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-3">
          <a href="https://hafcode.com/" target="_blank" rel="noopener noreferrer">
            <img
              src="/logo.png"
              alt="Half Code"
              width={50}
              height={50}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              className="rounded-lg object-contain"
            />
          </a>
          <p className="text-xs text-center" style={{color:"rgba(240,230,200,.35)",direction:"rtl"}}>
            جميع الحقوق محفوظة © هاف كود ٢٠٢٦
          </p>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
            style={{fontFamily:"Tajawal,sans-serif",fontSize:"12px",color:"rgba(167,243,208,.5)",textDecoration:"none",direction:"rtl"}}>
            تواصل معنا عبر واتساب ↗
          </a>
        </div>
      </footer>

      <canvas ref={canvasRef} style={{display:"none"}}/>
    </>
  );
}