import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND } from "./config";
import { FONT } from "./fonts";

// Титр: слова выпрыгивают по очереди, *слово* подсвечивается акцентом.
// Стоит чуть выше нижней трети, чтобы не попадать под интерфейс Reels.
export const Title: React.FC<{ text: string; onMedia: boolean }> = ({
  text,
  onMedia,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tokens: { word: string; hl: boolean }[] = [];
  text.split(/(\*[^*]+\*)/).forEach((part) => {
    if (!part) return;
    const hl = part.startsWith("*");
    part
      .replace(/\*/g, "")
      .split(" ")
      .filter(Boolean)
      .forEach((word) => tokens.push({ word, hl }));
  });

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
        const y = interpolate(s, [0, 1], [60, 0]);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `translateY(${y}px) scale(${interpolate(s, [0, 1], [0.7, 1])})`,
              opacity: s,
              color: t.hl
                ? onMedia
                  ? BRAND.accentSoft
                  : BRAND.accent
                : onMedia
                  ? "#fff"
                  : BRAND.dark,
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
