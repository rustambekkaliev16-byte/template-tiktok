import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BRAND, MotionKind } from "./config";
import { FONT } from "./fonts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const useSpring = (delay = 0, damping = 14) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping } });
};

export const LightBg: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at 50% 30%, #ffffff 0%, #E6FFFB 45%, #C9F4EE 100%)`,
    }}
  />
);

export const DarkBg: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at 50% 30%, #1B2638 0%, ${BRAND.dark} 70%)`,
    }}
  />
);

const Card: React.FC<{
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ style, children }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 36,
      boxShadow: "0 30px 80px rgba(11,18,32,0.18)",
      fontFamily: FONT,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Logo: React.FC<{ size?: number; color?: string }> = ({
  size = 120,
  color = BRAND.dark,
}) => {
  if (BRAND.logo) {
    return <Img src={staticFile(BRAND.logo)} style={{ height: size * 1.6 }} />;
  }
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: size * 0.25,
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size * 0.5,
        color,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.3,
          background: BRAND.accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: size * 0.55,
        }}
      >
        AI
      </div>
      {BRAND.agencyName}
    </div>
  );
};

// ---------- Боль 2: график падает ----------
const ChartDown: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 45], [0, 1], clamp);
  const pts = Array.from({ length: 12 }, (_, i) => {
    const x = 80 + i * 75;
    const y = 200 + i * 38 + random(`d${i}`) * 70 - (i === 3 ? 60 : 0);
    return [x, y];
  });
  const visible = Math.max(2, Math.floor(progress * pts.length));
  const d = pts
    .slice(0, visible)
    .map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`)
    .join(" ");
  const shake = Math.sin(frame * 1.7) * 3;
  return (
    <AbsoluteFill>
      <DarkBg />
      <Card
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 260,
          height: 760,
          background: "#111A2B",
          border: "2px solid #22304A",
          transform: `translateX(${shake}px)`,
        }}
      >
        <div
          style={{
            padding: "40px 50px 0",
            color: "#94A3B8",
            fontSize: 38,
            fontWeight: 700,
          }}
        >
          Заявки с рекламы
        </div>
        <div
          style={{
            padding: "0 50px",
            color: BRAND.danger,
            fontSize: 110,
            fontWeight: 900,
          }}
        >
          −{Math.round(progress * 64)}%
        </div>
        <svg
          width="960"
          height="560"
          style={{ position: "absolute", top: 180 }}
        >
          <path
            d={d}
            stroke={BRAND.danger}
            strokeWidth={12}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Card>
    </AbsoluteFill>
  );
};

// ---------- Поворот: glitch → частицы собираются в логотип ----------
const Turn: React.FC = () => {
  const frame = useCurrentFrame();
  const glitch = frame < 8;
  const gather = interpolate(frame, [6, 40], [0, 1], {
    ...clamp,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const logoIn = useSpring(34, 12);
  return (
    <AbsoluteFill>
      <LightBg />
      {Array.from({ length: 90 }, (_, i) => {
        const sx = random(`x${i}`) * 1080;
        const sy = random(`y${i}`) * 1920;
        const a = (i / 90) * Math.PI * 2;
        const tx = 540 + Math.cos(a) * 440;
        const ty = 640 + Math.sin(a) * 190;
        const x = interpolate(gather, [0, 1], [sx, tx]);
        const y = interpolate(gather, [0, 1], [sy, ty]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 14,
              height: 14,
              borderRadius: 7,
              background: i % 3 ? BRAND.accent : BRAND.accentSoft,
              opacity: 1 - logoIn * 0.8,
              boxShadow: `0 0 20px ${BRAND.accentSoft}`,
            }}
          />
        );
      })}
      <AbsoluteFill
        style={{
          alignItems: "center",
          top: 565,
          transform: `scale(${logoIn})`,
          opacity: logoIn,
        }}
      >
        <Logo size={150} />
      </AbsoluteFill>
      {glitch && (
        <AbsoluteFill
          style={{
            background:
              frame % 2
                ? "linear-gradient(0deg, rgba(20,184,166,0.8) 0 20%, transparent 20% 45%, rgba(239,68,68,0.6) 45% 50%, transparent 50%)"
                : "linear-gradient(0deg, transparent 0 30%, rgba(94,234,212,0.9) 30% 38%, transparent 38% 70%, rgba(11,18,32,0.9) 70% 80%, transparent 80%)",
            transform: `translateX(${(random(`g${frame}`) - 0.5) * 80}px)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// ---------- Фирменный стиль: логотип, палитра, шрифт, шаблоны веером ----------
const Brand: React.FC = () => {
  const s = useSpring(0);
  const fan = useSpring(18, 13);
  const colors = [BRAND.accent, BRAND.accentSoft, BRAND.dark, "#E2E8F0"];
  return (
    <AbsoluteFill>
      <LightBg />
      <AbsoluteFill style={{ alignItems: "center", top: 170 }}>
        <div style={{ transform: `scale(${s})` }}>
          <Logo size={110} />
        </div>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 370,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: 26,
        }}
      >
        {colors.map((c, i) => {
          const p = interpolate(s, [0, 1], [0, 1]) * (1 - i * 0.05);
          return (
            <div
              key={c}
              style={{
                width: 130,
                height: 130,
                borderRadius: 65,
                background: c,
                transform: `scale(${p})`,
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              }}
            />
          );
        })}
      </div>
      {[-1, 0, 1].map((k) => (
        <Card
          key={k}
          style={{
            position: "absolute",
            left: 540 - 170,
            top: 580,
            width: 340,
            height: 440,
            transformOrigin: "50% 120%",
            transform: `rotate(${k * 16 * fan}deg) translateY(${(1 - fan) * 300}px)`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: 250,
              background:
                k === 0
                  ? BRAND.accent
                  : k < 0
                    ? BRAND.dark
                    : `linear-gradient(135deg, ${BRAND.accentSoft}, ${BRAND.accent})`,
            }}
          />
          <div style={{ padding: 26 }}>
            <div
              style={{
                height: 26,
                width: "80%",
                background: "#CBD5E1",
                borderRadius: 13,
                marginBottom: 16,
              }}
            />
            <div
              style={{
                height: 26,
                width: "55%",
                background: "#E2E8F0",
                borderRadius: 13,
              }}
            />
          </div>
        </Card>
      ))}
    </AbsoluteFill>
  );
};

// ---------- Реклама растёт ----------
const AdsUp: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 70], [0, 1], clamp);
  const bars = [0.25, 0.32, 0.3, 0.45, 0.52, 0.6, 0.72, 0.85, 1];
  return (
    <AbsoluteFill>
      <LightBg />
      <Card
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 580,
          height: 460,
          padding: 50,
        }}
      >
        <div style={{ color: "#64748B", fontSize: 38, fontWeight: 700 }}>
          Заявки за неделю
        </div>
        <div style={{ color: BRAND.accent, fontSize: 120, fontWeight: 900 }}>
          +{Math.round(progress * 182)}%
        </div>
        <div
          style={{
            position: "absolute",
            left: 50,
            right: 50,
            bottom: 50,
            height: 180,
            display: "flex",
            alignItems: "flex-end",
            gap: 18,
          }}
        >
          {bars.map((b, i) => {
            const h = interpolate(
              progress,
              [i * 0.07, i * 0.07 + 0.35],
              [0, b],
              clamp,
            );
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h * 100}%`,
                  borderRadius: 16,
                  background:
                    i === bars.length - 1 ? BRAND.accent : BRAND.accentSoft,
                }}
              />
            );
          })}
        </div>
      </Card>
    </AbsoluteFill>
  );
};

// ---------- Сетка Instagram заполняется ----------
const Grid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const labels = ["Продающий", "Эксперт", "Имидж"];
  return (
    <AbsoluteFill>
      <LightBg />
      <Card
        style={{
          position: "absolute",
          left: 190,
          width: 700,
          top: 120,
          height: 920,
          borderRadius: 70,
          border: `14px solid ${BRAND.dark}`,
          padding: "70px 18px 18px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridAutoRows: 250,
          gap: 8,
          overflow: "hidden",
        }}
      >
        {Array.from({ length: 9 }, (_, i) => {
          const s = spring({
            frame: frame - i * 5,
            fps,
            config: { damping: 13 },
          });
          return (
            <div
              key={i}
              style={{
                borderRadius: 12,
                transform: `scale(${s})`,
                background: [
                  `linear-gradient(160deg, ${BRAND.accent}, ${BRAND.dark})`,
                  `linear-gradient(160deg, ${BRAND.accentSoft}, ${BRAND.accent})`,
                  `linear-gradient(160deg, #E2E8F0, ${BRAND.accentSoft})`,
                ][i % 3],
                display: "flex",
                alignItems: "flex-end",
                padding: 12,
                color: "#fff",
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              ▶ {labels[i % 3]}
            </div>
          );
        })}
      </Card>
    </AbsoluteFill>
  );
};

// ---------- Календарь публикаций ----------
const Calendar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rows = [
    ["Пн 10:00", "Reels: имплантация"],
    ["Ср 12:30", "Сторис: отзыв пациента"],
    ["Пт 18:00", "Пост: акция на чистку"],
    ["Вс 11:00", "Reels: врач-эксперт"],
  ];
  return (
    <AbsoluteFill>
      <LightBg />
      <div style={{ position: "absolute", left: 70, right: 70, top: 220 }}>
        {rows.map(([time, label], i) => {
          const s = spring({
            frame: frame - i * 8,
            fps,
            config: { damping: 14 },
          });
          const done = frame > 20 + i * 14;
          return (
            <Card
              key={i}
              style={{
                height: 170,
                marginBottom: 26,
                display: "flex",
                alignItems: "center",
                padding: "0 40px",
                gap: 30,
                transform: `translateX(${(1 - s) * 900}px)`,
              }}
            >
              <div style={{ fontSize: 60 }}>{done ? "✅" : "⏰"}</div>
              <div>
                <div
                  style={{ color: "#64748B", fontSize: 34, fontWeight: 700 }}
                >
                  {time}
                </div>
                <div
                  style={{ color: BRAND.dark, fontSize: 44, fontWeight: 900 }}
                >
                  {label}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Коннекторы ----------
const Connect: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nodes = [
    { label: "CRM", x: 540, y: 300 },
    { label: "WhatsApp", x: 220, y: 520 },
    { label: "Telegram", x: 860, y: 520 },
    { label: "Instagram", x: 260, y: 860 },
    { label: "Сайт", x: 820, y: 860 },
  ];
  const hub = { x: 540, y: 640 };
  return (
    <AbsoluteFill>
      <DarkBg />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {nodes.map((n, i) => {
          const p = interpolate(frame, [10 + i * 6, 30 + i * 6], [0, 1], clamp);
          return (
            <line
              key={i}
              x1={hub.x}
              y1={hub.y}
              x2={hub.x + (n.x - hub.x) * p}
              y2={hub.y + (n.y - hub.y) * p}
              stroke={BRAND.accentSoft}
              strokeWidth={8}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 12px ${BRAND.accent})` }}
            />
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          left: hub.x - 110,
          top: hub.y - 110,
          width: 220,
          height: 220,
          borderRadius: 110,
          background: BRAND.accent,
          boxShadow: `0 0 ${60 + Math.sin(frame / 4) * 20}px ${BRAND.accentSoft}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 80,
        }}
      >
        AI
      </div>
      {nodes.map((n, i) => {
        const s = spring({
          frame: frame - i * 5,
          fps,
          config: { damping: 12 },
        });
        return (
          <div
            key={n.label}
            style={{
              position: "absolute",
              left: n.x - 140,
              top: n.y - 55,
              width: 280,
              height: 110,
              borderRadius: 55,
              background: "#16233A",
              border: `3px solid ${BRAND.accent}`,
              color: "#fff",
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${s})`,
            }}
          >
            {n.label}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- CTA ----------
const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useSpring(0, 12);
  const btn = useSpring(12, 10);
  const pulse = 1 + Math.sin(frame / 5) * 0.04;
  return (
    <AbsoluteFill>
      <LightBg />
      <AbsoluteFill style={{ alignItems: "center", top: 380 }}>
        <div style={{ transform: `scale(${s})` }}>
          <Logo size={140} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", top: 1380 }}>
        <div
          style={{
            transform: `scale(${btn * pulse})`,
            background: BRAND.accent,
            color: "#fff",
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 64,
            padding: "36px 90px",
            borderRadius: 80,
            boxShadow: `0 0 0 ${18 + Math.sin(frame / 5) * 10}px rgba(20,184,166,0.25), 0 20px 60px rgba(20,184,166,0.5)`,
          }}
        >
          Написать в директ
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const MOTIONS: Record<MotionKind, React.FC> = {
  chartDown: ChartDown,
  turn: Turn,
  brand: Brand,
  adsUp: AdsUp,
  grid: Grid,
  calendar: Calendar,
  connect: Connect,
  cta: Cta,
};
