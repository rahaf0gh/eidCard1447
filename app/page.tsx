"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, onValue, runTransaction } from "firebase/database";
import Link from "next/link";

// ── Firebase config ──────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyCIGMdnGQQyxpDf_AnVQTcbLwAl3wBp3fI",
  authDomain: "eid1447-627fc.firebaseapp.com",
  databaseURL: "https://eid1447-627fc-default-rtdb.firebaseio.com",
  projectId: "eid1447-627fc",
  storageBucket: "eid1447-627fc.firebasestorage.app",
  messagingSenderId: "116647763860",
  appId: "1:116647763860:web:53917aae32bcac0fa2b981",
  measurementId: "G-0QN9NXC2YX",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db  = getDatabase(app);

// ── رابط الواتساب المباشر ──────────────────────────────────────────
const WHATSAPP_NUMBER = "966580589199";
const WHATSAPP_MSG    = encodeURIComponent("أهلاً، أريد تخصيص تهنئة العيد");
const WHATSAPP_URL    = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;

// ── بيانات البطاقات ───────────────────────────────────────────────
const cards = [
  { id: 1 }, { id: 2 }, { id: 3 },
  { id: 4 }, { id: 5 }, { id: 6 },
];

const cardTextConfig: Record<number, { x: number; y: number; color: string; fontSize: number }> = {
  1: { x: 0.5, y: 0.80, color: "#e4afaf", fontSize: 38 },
  2: { x: 0.5, y: 0.74, color: "#692527", fontSize: 38 },
  3: { x: 0.5, y: 0.62, color: "#692527", fontSize: 38 },
  4: { x: 0.5, y: 0.80, color: "#d25f26", fontSize: 38 },
  5: { x: 0.5, y: 0.78, color: "#692527", fontSize: 38 },
  6: { x: 0.5, y: 0.60, color: "#819aa1", fontSize: 38 },
};

function formatCount(n: number): string {
  return n.toLocaleString("ar-SA");
}

// ── بانر إعلاني ───────────────────────────────────────────────────
function PromoBanner() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full"
      style={{ textDecoration: "none" }}
    >
      <div
        className="w-full flex items-center justify-center gap-3 py-3 px-4 cursor-pointer transition-all hover:brightness-110 active:scale-[.99]"
        style={{
          background: "linear-gradient(90deg,#0d4d3a 0%,#1a7a5e 40%,#25a06e 60%,#0d4d3a 100%)",
          backgroundSize: "200% auto",
          animation: "bannerShimmer 4s linear infinite",
          borderBottom: "1px solid rgba(37,160,110,.4)",
        }}
      >
        {/* أيقونة واتساب */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#25d366" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>

        <span style={{
          fontFamily: "Tajawal, sans-serif",
          fontSize: "14px",
          fontWeight: 700,
          color: "#fff",
          textShadow: "0 1px 4px rgba(0,0,0,.3)",
          direction: "rtl",
        }}>
          هل تريد تصميم بطاقات مخصصة بشعار مؤسستك أو شركتك؟
        </span>

        <span style={{
          fontFamily: "Tajawal, sans-serif",
          fontSize: "13px",
          fontWeight: 800,
          color: "#a7f3d0",
          whiteSpace: "nowrap",
          borderBottom: "1px dashed rgba(167,243,208,.5)",
        }}>
          تواصل معنا ←
        </span>
      </div>
    </a>
  );
}

// ── فوتر ──────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      className="w-full mt-12 py-6 px-4"
      style={{
        borderTop: "1px solid rgba(255,255,255,.07)",
        background: "rgba(0,0,0,.25)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="max-w-[680px] mx-auto flex flex-col items-center gap-3">

        <div className="flex items-center gap-2">
          <a
          href="https://hafcode.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "Tajawal, sans-serif",
            fontSize: "12px",
            color: "rgba(167,243,208,.5)",
            textDecoration: "none",
            direction: "rtl",
          }}
        >
          <img
            src="/logo.png"
            alt="HalCode"
            width={50}
            height={50}
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            style={{ borderRadius: "8px", objectFit: "contain" }}
          />
        </a>
        </div>
        <p style={{
          fontFamily: "Tajawal, sans-serif",
          fontSize: "13px",
          color: "rgba(240,230,200,.35)",
          textAlign: "center",
          direction: "rtl",
        }}>
          جميع الحقوق محفوظة © هاف كود ٢٠٢٦
        </p>
      </div>
    </footer>
  );
}

export default function Home() {
  const [selectedCard, setSelectedCard]   = useState<number | null>(null);
  const [name, setName]                   = useState("");
  const [previewUrl, setPreviewUrl]       = useState<string | null>(null);
  const [showModal, setShowModal]         = useState(false);
  const [downloadCount, setDownloadCount] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ✅ الاستماع للعداد المشترك من Firebase
  useEffect(() => {
    const countRef = ref(db, "downloadCount");
    const unsub = onValue(countRef, (snap) => {
      setDownloadCount(snap.val() ?? 0);
    });
    return () => unsub();
  }, []);

  const incrementCount = () => {
    runTransaction(ref(db, "downloadCount"), (cur) => (cur ?? 0) + 1);
  };

  // توليد الصورة على Canvas
  const generateImage = (callback: (url: string) => void) => {
    if (!selectedCard || !name.trim()) return;
    const config = cardTextConfig[selectedCard];
    const img    = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = `/cards/card${selectedCard}.png`;
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width  = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      ctx.font         = `bold ${config.fontSize}px Arial`;
      ctx.fillStyle    = config.color;
      ctx.textAlign    = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(name, img.width * config.x, img.height * config.y);
      callback(canvas.toDataURL("image/png"));
    };
  };

  const handlePreview = () => {
    if (!selectedCard) return alert("اختر بطاقة أولاً");
    if (!name.trim())  return alert("اكتب اسمك أولاً");
    generateImage((url) => { setPreviewUrl(url); setShowModal(true); });
  };

  const handleDownload = () => {
    if (!selectedCard) return alert("اختر بطاقة أولاً");
    if (!name.trim())  return alert("اكتب اسمك أولاً");
    generateImage((url) => {
      const a = document.createElement("a");
      a.href = url; a.download = `card-${name}.png`; a.click();
      incrementCount();
    });
  };

  const handleShare = async () => {
    if (!selectedCard) return alert("اختر بطاقة أولاً");
    if (!name.trim())  return alert("اكتب اسمك أولاً");
    generateImage(async (url) => {
      const blob = await (await fetch(url)).blob();
      const file = new File([blob], `card-${name}.png`, { type: "image/png" });
      if (navigator.share) {
        await navigator.share({ files: [file], title: "عيد سعيد" });
        incrementCount();
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("تم نسخ الرابط!");
      }
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        body { font-family:'Tajawal',sans-serif; direction:rtl; margin:0; background:#1a1a2e; }

        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%     { opacity:.4; transform:scale(.7); }
        }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp {
          from { opacity:0; transform:translateY(30px) scale(.95) }
          to   { opacity:1; transform:translateY(0) scale(1) }
        }
        @keyframes bannerShimmer {
          0%   { background-position: 200% center }
          100% { background-position: -200% center }
        }
      `}</style>

      {/* ── بانر الإعلان أعلى الصفحة ── */}
      <PromoBanner />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[680px] rounded-[28px] p-8 sm:p-10" style={{
          background:    "rgba(255,255,255,0.04)",
          backdropFilter:"blur(20px)",
          border:        "1px solid rgba(255,255,255,0.08)",
          boxShadow:     "0 0 0 1px rgba(98,32,105,.2),0 32px 80px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.1)",
        }}>

          {/* الهيدر */}
          <div className="text-center mb-8">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs tracking-wider mb-3" style={{
              background:"rgba(193,143,20,.15)",
              border:"1px solid rgba(193,143,20,.3)",
              color:"#c8a84b",
            }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8a84b]"
                    style={{animation:"pulse-dot 2s ease-in-out infinite"}}/>
              بطاقات عيد الفطر 1447
            </div>

            {/* العداد */}
            <div className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl mx-auto w-fit mb-4" style={{
              background:"rgba(255,255,255,0.05)",
              border:"1px solid rgba(255,255,255,0.08)",
            }}>
              <span className="text-xl">🎴</span>
              <span className="text-sm font-medium" style={{color:"rgba(240,230,200,.55)"}}>
                تم استخدام البطاقات
              </span>
              <span className="text-lg font-black tabular-nums" style={{color:"#c8a84b", minWidth:"3ch"}}>
                {downloadCount === null ? "..." : formatCount(downloadCount)}
              </span>
              <span className="text-sm font-medium" style={{color:"rgba(240,230,200,.55)"}}>مرة</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight" style={{
              color:"#f0e6c8",
              textShadow:"0 2px 20px rgba(193,143,20,.3)",
            }}>
              عيد سعيد بالهناء يعود
            </h1>
            <p className="mt-2 text-base" style={{color:"rgba(240,230,200,.5)"}}>
              اختر التصميم المناسب وأضف اسمك
            </p>
          </div>

          {/* شبكة البطاقات */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {cards.map((card) => {
              const sel = selectedCard === card.id;
              return (
                <div key={card.id}
                  onClick={() => setSelectedCard(card.id)}
                  className="relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:opacity-90 hover:-translate-y-1"
                  style={{
                    border:    sel ? "2px solid #c8a84b" : "2px solid transparent",
                    transform: sel ? "translateY(-4px) scale(1.03)" : undefined,
                    boxShadow: sel ? "0 0 0 3px rgba(200,168,75,.3),0 16px 40px rgba(0,0,0,.5)" : undefined,
                  }}>
                  <Image
                    src={`/cards/card${card.id}.png`}
                    alt={`بطاقة ${card.id}`}
                    width={500} height={300}
                    className="w-full h-auto rounded-xl"
                  />
                  {sel && (
                    <span className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
                          style={{background:"#c8a84b", color:"#1a1a2e"}}>✓</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* زر صفحة التخصيص */}
          <Link href="/customize" className="block mb-6">
            <div className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 cursor-pointer"
              style={{
                background:"rgba(255,255,255,.05)",
                border:"1px solid rgba(255,255,255,.1)",
                color:"rgba(240,230,200,.7)",
              }}>
              🎨 صمّم بطاقة مخصصة
            </div>
          </Link>

          {/* فاصل */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{background:"rgba(255,255,255,.07)"}}/>
            <span className="text-xs" style={{color:"rgba(240,230,200,.25)"}}>أضف لمستك</span>
            <div className="flex-1 h-px" style={{background:"rgba(255,255,255,.07)"}}/>
          </div>

          {/* حقل الاسم */}
          <div className="mb-5">
            <label className="block text-sm font-semibold mb-2 text-right tracking-wide"
                   style={{color:"rgba(240,230,200,.6)"}}>
              اكتب اسمك
            </label>
            <input
              suppressHydrationWarning
              type="text"
              placeholder="مثال: محمد العمري"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl text-right text-lg outline-none transition-all duration-200"
              style={{
                background:"rgba(255,255,255,.07)",
                border:"1px solid rgba(255,255,255,.12)",
                color:"#f0e6c8",
                fontFamily:"Tajawal, sans-serif",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(200,168,75,.6)";
                e.target.style.boxShadow   = "0 0 0 3px rgba(200,168,75,.12)";
                e.target.style.background  = "rgba(255,255,255,.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,.12)";
                e.target.style.boxShadow   = "none";
                e.target.style.background  = "rgba(255,255,255,.07)";
              }}
            />
          </div>

          {/* أزرار */}
          <div className="grid grid-cols-2 gap-2.5 mb-2.5">
            <button suppressHydrationWarning onClick={handleDownload}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-base text-white cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
              style={{
                background:"linear-gradient(135deg,#622069,#8b2d95)",
                boxShadow:"0 4px 20px rgba(98,32,105,.5)",
                fontFamily:"Tajawal, sans-serif",
              }}>
              ⬇ تحميل البطاقة
            </button>
            <button suppressHydrationWarning onClick={handlePreview}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-base text-white cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
              style={{
                background:"linear-gradient(135deg,#1a7a45,#22a05a)",
                boxShadow:"0 4px 20px rgba(26,122,69,.5)",
                fontFamily:"Tajawal, sans-serif",
              }}>
              👁 معاينة البطاقة
            </button>
          </div>

          <button suppressHydrationWarning onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-base cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            style={{
              background:"rgba(200,168,75,.12)",
              border:"1px solid rgba(200,168,75,.25)",
              color:"#c8a84b",
              fontFamily:"Tajawal, sans-serif",
            }}>
            🔗 مشاركة الرابط
          </button>

        </div>
      </div>

      {/* ── فوتر ── */}
      <Footer />

      {/* Canvas مخفي */}
      <canvas ref={canvasRef} style={{display:"none"}}/>

      {/* Modal المعاينة */}
      {showModal && previewUrl && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{background:"rgba(0,0,0,.8)", backdropFilter:"blur(8px)", animation:"fadeIn .2s ease"}}
          onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md rounded-2xl p-6"
            style={{
              background:"#1e1e35",
              border:"1px solid rgba(255,255,255,.1)",
              boxShadow:"0 40px 80px rgba(0,0,0,.6)",
              animation:"slideUp .25s cubic-bezier(.34,1.56,.64,1)",
            }}
            onClick={(e) => e.stopPropagation()}>
            <h2 className="text-center font-bold text-lg mb-4" style={{color:"#f0e6c8"}}>
              معاينة البطاقة
            </h2>
            <img src={previewUrl} alt="preview" className="w-full rounded-xl"/>
            <div className="flex gap-2.5 mt-4">
              <button
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = previewUrl; a.download = `card-${name}.png`; a.click();
                  incrementCount();
                }}
                className="flex-1 py-3 rounded-xl font-bold text-white cursor-pointer transition-all hover:-translate-y-0.5"
                style={{background:"linear-gradient(135deg,#622069,#8b2d95)", fontFamily:"Tajawal, sans-serif"}}>
                ⬇ تحميل
              </button>
              <button onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl font-bold cursor-pointer transition-all hover:-translate-y-0.5"
                style={{background:"rgba(255,255,255,.08)", color:"rgba(240,230,200,.7)", fontFamily:"Tajawal, sans-serif"}}>
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}