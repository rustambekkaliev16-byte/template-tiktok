import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND, TITLE_STYLE } from "./config";
import { FONT, SERIF } from "./fonts";

type Token = { word: string; hl: boolean };

const tokenize = (text: string): Token[] => {
  const tokens: Token[] = [];
  text.split(/(\*[^*]+\*)/).forEach((part) => {
    if (!part) return;
    const hl = part.startsWith("*");
    part
      .replace(/\*/g, "")
      .split(" ")
      .filter(Boolean)
      .forEach((word) => tokens.push({ word, hl }));
  });
  return tokens;
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Титр стоит чуть выше нижней трети, чтобы не попадать под интерфейс Reels.
// Стиль выбирается в config.ts → TITLE_STYLE.
export const Title: React.FC<{ text: string; onMedia: boolean }> = ({
  text,
  onMedia,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tokens = tokenize(text);
  const base = onMedia ? "#fff" : BRAND.dark;
  const shadow = onMedia ? "0 2px 18px rgba(0,0,0,0.45)" : "none";

  // EDITORIAL: как в журнальных Reels. Обычные слова — аккуратный
  // гротеск, ключевое слово — курсивная антиква. Мягкое появление
  // с расфокусом, без прыжков и плашек.
  if (TITLE_STYLE === "editorial") {
    return (
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 1110,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "baseline",
          gap: "0 18px",
          textAlign: "center",
          color: base,
          textShadow: shadow,
        }}
      >
        {tokens.map((t, i) => {
          const start = 3 + i * 2;
          const p = interpolate(frame, [start, start + 9], [0, 1], {
            ...clamp,
            easing: (x) => 1 - Math.pow(1 - x, 3),
          });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: p,
                filter: `blur(${(1 - p) * 10}px)`,
                transform: `translateY(${(1 - p) * 14}px)`,
                fontFamily: t.hl ? SERIF : FONT,
                fontStyle: t.hl ? "italic" : "normal",
                fontWeight: 600,
                fontSize: t.hl ? 92 : 68,
                lineHeight: 1.2,
                letterSpacing: t.hl ? -1 : -1.5,
              }}
            >
              {t.word}
            </span>
          );
        })}
      </div>
    );
  }

  // MINIMAL: маленький текст строчными буквами, появляется сразу
  // целой фразой. Похоже на ручной монтаж в телефоне.
  if (TITLE_STYLE === "minimal") {
    const p = interpolate(frame, [2, 6], [0, 1], clamp);
    return (
      <div
        style={{
          position: "absolute",
          left: 110,
          right: 110,
          top: 1180,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 500,
          fontSize: 56,
          lineHeight: 1.25,
          color: base,
          textShadow: shadow,
          opacity: p,
          textTransform: "lowercase",
        }}
      >
        {tokens.map((t) => t.word).join(" ")}
      </div>
    );
  }

  // BOLD: крупные слова выпрыгивают по очереди (первая версия).
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: 1080,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "6px 22px",
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: 96,
        lineHeight: 1.08,
        textAlign: "center",
        letterSpacing: -2,
      }}
    >
      {tokens.map((t, i) => {
        const s = spring({
          frame: frame - 4 - i * 3,
          fps,
          config: { damping: 12, stiffness: 180 },
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `translateY(${interpolate(s, [0, 1], [60, 0])}px) scale(${interpolate(s, [0, 1], [0.7, 1])})`,
              opacity: s,
              color: t.hl ? (onMedia ? BRAND.accentSoft : BRAND.accent) : base,
              textShadow: onMedia
                ? "0 6px 30px rgba(0,0,0,0.65), 0 2px 6px rgba(0,0,0,0.6)"
                : "none",
            }}
          >
            {t.word}
          </span>
        );
      })}
    </div>
  );
};
