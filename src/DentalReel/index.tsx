import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BRAND, FPS, Scene, SCENES } from "./config";
import { FONT, loadReelFonts } from "./fonts";
import { DarkBg, LightBg, MOTIONS } from "./Motions";
import { Title } from "./Title";

loadReelFonts();

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Заглушка на месте видео: показывает, какой файл сюда положить.
const Placeholder: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const dark = scene.tone === "dark";
  return (
    <AbsoluteFill>
      {dark ? <DarkBg /> : <LightBg />}
      <AbsoluteFill
        style={{
          left: 60,
          right: 60,
          top: 160,
          height: 820,
          width: "auto",
          border: `6px dashed ${dark ? "#334155" : "#94A3B8"}`,
          borderRadius: 40,
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT,
          textAlign: "center",
          padding: 50,
          color: dark ? "#CBD5E1" : "#334155",
        }}
      >
        <div
          style={{ fontSize: 120, opacity: 0.6 + Math.sin(frame / 6) * 0.2 }}
        >
          🎬
        </div>
        <div style={{ fontSize: 44, fontWeight: 700, marginTop: 20 }}>
          {scene.needs}
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 500,
            marginTop: 30,
            opacity: 0.75,
          }}
        >
          public/clips/{scene.id}.mp4
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Всплывающие уведомления «Новая заявка»
const Notifications: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const items = ["Анна, имплантация", "Игорь, чистка", "Мария, брекеты"];
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 90 }}>
      {items.map((name, i) => {
        const s = spring({
          frame: frame - 10 - i * 18,
          fps,
          config: { damping: 13 },
        });
        return (
          <div
            key={name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              background: "rgba(255,255,255,0.96)",
              borderRadius: 30,
              padding: "22px 30px",
              marginBottom: 16,
              boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
              fontFamily: FONT,
              transform: `translateY(${(1 - s) * -200}px)`,
              opacity: s,
            }}
          >
            <div
              style={{
                width: 70,
                height: 70,
                borderRadius: 18,
                background: BRAND.accent,
                color: "#fff",
                fontSize: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✓
            </div>
            <div>
              <div style={{ fontSize: 34, fontWeight: 900, color: BRAND.dark }}>
                Новая заявка
              </div>
              <div style={{ fontSize: 30, fontWeight: 500, color: "#475569" }}>
                {name}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const SceneView: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const duration = (scene.to - scene.from) * FPS;
  const Motion = scene.motion ? MOTIONS[scene.motion] : null;
  // Белый титр поверх видео и тёмных сцен, тёмный на светлой анимации
  const onMedia = Boolean(scene.clip) || scene.tone === "dark";

  // Лёгкий «наезд» камеры и короткая вспышка на входе: даёт ритм.
  const zoom = interpolate(frame, [0, duration], [1.08, 1], clamp);
  const flash = interpolate(frame, [0, 5], [0.5, 0], clamp);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        {scene.clip ? (
          <>
            <OffthreadVideo
              src={staticFile(scene.clip)}
              muted
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {scene.tone === "dark" && (
              <AbsoluteFill style={{ background: "rgba(11,18,32,0.35)" }} />
            )}
          </>
        ) : Motion ? (
          <Motion />
        ) : (
          <Placeholder scene={scene} />
        )}
      </AbsoluteFill>
      {/* Затемнение снизу, чтобы титр читался на видео */}
      {onMedia && (
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, transparent 45%, rgba(11,18,32,0.55) 75%, rgba(11,18,32,0.7) 100%)",
          }}
        />
      )}
      {scene.notifications && <Notifications />}
      <Title text={scene.title} onMedia={onMedia} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </AbsoluteFill>
  );
};

export const DentalReel: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BRAND.dark }}>
      {SCENES.map((scene) => (
        <Sequence
          key={scene.id}
          from={scene.from * FPS}
          durationInFrames={(scene.to - scene.from) * FPS}
          name={scene.id}
        >
          <SceneView scene={scene} />
        </Sequence>
      ))}
      {BRAND.music && <Audio src={staticFile(BRAND.music)} volume={0.35} />}
      {BRAND.voiceover && <Audio src={staticFile(BRAND.voiceover)} />}
    </AbsoluteFill>
  );
};
