import { continueRender, delayRender, staticFile } from "remotion";

export const FONT = "InterReel";
export const SERIF = "PlayfairReel";

let started = false;

export const loadReelFonts = () => {
  if (started || typeof document === "undefined") {
    return;
  }
  started = true;
  const handle = delayRender("Loading fonts");
  const inter = (file: string, weight: string) =>
    new FontFace(FONT, `url('${staticFile(`fonts/${file}`)}')`, { weight });
  const faces = [
    inter("Inter-Medium.otf", "500"),
    inter("Inter-SemiBold.otf", "600"),
    inter("Inter-Bold.otf", "700"),
    inter("Inter-Black.otf", "900"),
    new FontFace(
      SERIF,
      `url('${staticFile("fonts/playfair-display-cyrillic-600-italic.woff2")}')`,
      {
        style: "italic",
        weight: "600",
        unicodeRange: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116",
      },
    ),
    new FontFace(
      SERIF,
      `url('${staticFile("fonts/playfair-display-latin-600-italic.woff2")}')`,
      {
        style: "italic",
        weight: "600",
        unicodeRange: "U+0000-00FF, U+2000-206F",
      },
    ),
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
