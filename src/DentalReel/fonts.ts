import { continueRender, delayRender, staticFile } from "remotion";

export const FONT = "InterReel";

let started = false;

export const loadReelFonts = () => {
  if (started || typeof document === "undefined") {
    return;
  }
  started = true;
  const handle = delayRender("Loading Inter");
  const faces = [
    new FontFace(FONT, `url('${staticFile("fonts/Inter-Medium.otf")}')`, {
      weight: "500",
    }),
    new FontFace(FONT, `url('${staticFile("fonts/Inter-Bold.otf")}')`, {
      weight: "700",
    }),
    new FontFace(FONT, `url('${staticFile("fonts/Inter-Black.otf")}')`, {
      weight: "900",
    }),
  ];
  Promise.all(faces.map((f) => f.load()))
    .then((loaded) => {
      loaded.forEach((f) => document.fonts.add(f));
      continueRender(handle);
    })
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
};
