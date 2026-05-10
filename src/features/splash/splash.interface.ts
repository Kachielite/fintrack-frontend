export type SplashVisual = "mail" | "globe" | "iris";

export interface SplashSlide {
  visual: SplashVisual;
  title: string;
  sub: string;
}

export const SPLASH_SLIDES: SplashSlide[] = [
  {
    visual: "mail",
    title: "No more\nspreadsheets.",
    sub: "FinTrack reads bank emails for you and turns them into clear, organised transactions.",
  },
  {
    visual: "globe",
    title: "Many banks.\nOne picture.",
    sub: "GTBank, Kuda, Wise, Monzo — across naira, dollars and pounds. Always converted to your reference currency.",
  },
  {
    visual: "iris",
    title: "A friend who\nunderstands money.",
    sub: "Iris, your advisor, points out patterns in plain language. No judgment. No jargon.",
  },
];
