import {
  createTheme,
  darken,
  lighten,
  type Theme,
  type ThemeOptions,
} from "@mui/material/styles";
import merge from "lodash/merge";
import { ETaskStatus } from "../types";

/**
 * Ten selectable themes. Each ThemeSpec captures the axes that give a theme its
 * personality — palette, type, corner radius, border weight/style, button
 * weight and shadow — and buildTheme() turns a spec (plus a density) into a MUI
 * theme. Per-theme extras that MUI's palette can't express (status colors, the
 * hairline color, secondary fonts, decorative shadows) ride along on
 * `theme.app`, declared via module augmentation below.
 */

export type EDensity = "compact" | "comfortable";

export enum EThemeId {
  GRAPHITE = "graphite",
  RECEIPT = "receipt",
  NEON = "neon",
  BLUEPRINT = "blueprint",
  BRUTALIST = "brutalist",
  PASTEL = "pastel",
  TODAY = "today",
}

export const DEFAULT_THEME_ID = EThemeId.TODAY;
export const DEFAULT_DENSITY: EDensity = "compact";

type StatusColors = Record<ETaskStatus, string>;

export interface AppTokens {
  line: string;
  /** Fully-resolved row border shorthand, e.g. "1px solid #274d78" or "none". */
  border: string;
  /** A calm surface a hair off the background — for large fills (settings
   * sections, panels) that shouldn't shout with the loud card color. */
  panel: string;
  muted: string;
  faint: string;
  surface2: string;
  accentInk: string;
  fontHead: string;
  fontMeta: string;
  cardShadow: string;
  labelTransform: "none" | "uppercase";
  labelSpacing: string;
  statusColors: StatusColors;
  density: {
    rowPadY: number;
    rowGap: number;
    itemGap: number;
    titleSize: number;
  };
}

// Extend the MUI theme with our custom token bag so components can read
// theme.app.* with full typing.
declare module "@mui/material/styles" {
  interface Theme {
    app: AppTokens;
  }
  interface ThemeOptions {
    app?: AppTokens;
  }
}

export interface ThemeSpec {
  id: EThemeId;
  name: string;
  blurb: string;
  mode: "light" | "dark";
  swatches: [string, string, string];
  colors: {
    bg: string;
    paper: string;
    surface2: string;
    text: string;
    muted: string;
    faint: string;
    line: string;
    accent: string;
    accentInk: string;
    secondary: string;
    warning: string;
    error: string;
    status: StatusColors;
  };
  radius: number;
  borderWidth: number;
  borderStyle: "solid" | "dashed" | "none";
  fontBody: string;
  fontHead: string;
  fontMeta: string;
  buttonWeight: number;
  buttonRadius: number;
  buttonTransform: "none" | "uppercase";
  labelTransform: "none" | "uppercase";
  labelSpacing: string;
  buttonShadow: string;
  cardShadow: string;
}

// --- Font stacks. Electron on macOS gives us a rich set of system faces; the
// fallbacks keep other platforms sane. ---
const MONO = 'ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace';
const GROTESK = 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const ROUNDED = '"Comfortaa", "Quicksand", "Varela Round", "Trebuchet MS", system-ui, sans-serif';
const BLACK = '"Arial Black", "Helvetica Neue", Impact, system-ui, sans-serif';

const DENSITIES: Record<EDensity, AppTokens["density"]> = {
  compact: { rowPadY: 6, rowGap: 4, itemGap: 6, titleSize: 15 },
  comfortable: { rowPadY: 12, rowGap: 9, itemGap: 10, titleSize: 19 },
};

const status = (
  neu: string,
  prog: string,
  done: string,
  block: string,
  cancel: string
): StatusColors => ({
  [ETaskStatus.NEW]: neu,
  [ETaskStatus.IN_PROGRESS]: prog,
  [ETaskStatus.COMPLETED]: done,
  [ETaskStatus.BLOCKED]: block,
  [ETaskStatus.CANCELED]: cancel,
});

export const THEMES: Record<EThemeId, ThemeSpec> = {
  [EThemeId.GRAPHITE]: {
    id: EThemeId.GRAPHITE,
    name: "Graphite",
    blurb: "IDE-tight monospace on slate. Hairline borders, ghost buttons.",
    mode: "dark",
    swatches: ["#0f1216", "#6cb6ff", "#57ab5a"],
    colors: {
      bg: "#0f1216", paper: "#161b22", surface2: "#1b212a", text: "#d7dde5",
      muted: "#7d8794", faint: "#3b444f", line: "#242b34", accent: "#6cb6ff",
      accentInk: "#08121f", secondary: "#57ab5a", warning: "#e0a33a", error: "#e5534b",
      status: status("#8b95a1", "#6cb6ff", "#57ab5a", "#e0a33a", "#5a636d"),
    },
    radius: 5, borderWidth: 1, borderStyle: "solid",
    fontBody: MONO, fontHead: MONO, fontMeta: MONO,
    buttonWeight: 500, buttonRadius: 5, buttonTransform: "none",
    labelTransform: "uppercase", labelSpacing: "0.08em",
    buttonShadow: "none", cardShadow: "none",
  },
  [EThemeId.RECEIPT]: {
    id: EThemeId.RECEIPT,
    name: "Receipt",
    blurb: "Thermal paper. Dashed rules, ink only, nothing filled.",
    mode: "light",
    swatches: ["#f4f1e9", "#1c1a17", "#8a5a1e"],
    colors: {
      bg: "#f4f1e9", paper: "#f4f1e9", surface2: "#ece7db", text: "#1c1a17",
      muted: "#7a746a", faint: "#c3bcac", line: "#c8c1b1", accent: "#1c1a17",
      accentInk: "#f4f1e9", secondary: "#3e5c3a", warning: "#8a5a1e", error: "#8a2b1e",
      status: status("#5b564d", "#1c1a17", "#3e5c3a", "#8a5a1e", "#a9a294"),
    },
    radius: 0, borderWidth: 1, borderStyle: "dashed",
    fontBody: MONO, fontHead: MONO, fontMeta: MONO,
    buttonWeight: 600, buttonRadius: 0, buttonTransform: "uppercase",
    labelTransform: "uppercase", labelSpacing: "0.1em",
    buttonShadow: "none", cardShadow: "none",
  },
  [EThemeId.NEON]: {
    id: EThemeId.NEON,
    name: "Neon Arcade",
    blurb: "Late-night glow. Magenta + cyan, pill buttons, soft light.",
    mode: "dark",
    swatches: ["#0a0512", "#ff3df0", "#22f0e0"],
    colors: {
      bg: "#0a0512", paper: "#150b24", surface2: "#22123a", text: "#f2e9ff",
      muted: "#9a86c4", faint: "#5a3a8f", line: "#6a2fb0", accent: "#ff3df0",
      accentInk: "#12001a", secondary: "#22f0e0", warning: "#ffd23d", error: "#ff4d6d",
      status: status("#8f7fd6", "#22f0e0", "#39ff9e", "#ffd23d", "#6b5a91"),
    },
    radius: 12, borderWidth: 1.5, borderStyle: "solid",
    fontBody: MONO, fontHead: MONO, fontMeta: MONO,
    buttonWeight: 700, buttonRadius: 999, buttonTransform: "uppercase",
    labelTransform: "uppercase", labelSpacing: "0.1em",
    buttonShadow: "none", cardShadow: "none",
  },
  [EThemeId.BLUEPRINT]: {
    id: EThemeId.BLUEPRINT,
    name: "Blueprint",
    blurb: "Engineering drawing. Navy ground, cyan hairlines, right angles.",
    mode: "dark",
    swatches: ["#0c2036", "#4db8ff", "#48d6a0"],
    colors: {
      bg: "#0c2036", paper: "#102843", surface2: "#143152", text: "#d4e9ff",
      muted: "#6f97c4", faint: "#2f5a86", line: "#274d78", accent: "#4db8ff",
      accentInk: "#04121f", secondary: "#48d6a0", warning: "#ffb454", error: "#ff6b6b",
      status: status("#7fa8d6", "#4db8ff", "#48d6a0", "#ffb454", "#5b7ba3"),
    },
    radius: 2, borderWidth: 1, borderStyle: "solid",
    fontBody: MONO, fontHead: MONO, fontMeta: MONO,
    buttonWeight: 600, buttonRadius: 2, buttonTransform: "uppercase",
    labelTransform: "uppercase", labelSpacing: "0.09em",
    buttonShadow: "none", cardShadow: "none",
  },
  [EThemeId.BRUTALIST]: {
    id: EThemeId.BRUTALIST,
    name: "Brutalist",
    blurb: "Structural, dialed back. Bold borders and a soft offset shadow.",
    mode: "light",
    swatches: ["#f4f1e8", "#1a1a1a", "#4d3dff"],
    colors: {
      bg: "#f4f1e8", paper: "#ffffff", surface2: "#ece9dd", text: "#1a1a1a",
      muted: "#6a6a6a", faint: "#c4c1b5", line: "#1a1a1a", accent: "#4d3dff",
      accentInk: "#ffffff", secondary: "#0a8a4a", warning: "#d2600f", error: "#cc2233",
      status: status("#4a4a4a", "#4d3dff", "#0a8a4a", "#d2600f", "#8a8a8a"),
    },
    radius: 2, borderWidth: 2, borderStyle: "solid",
    fontBody: GROTESK, fontHead: BLACK, fontMeta: MONO,
    buttonWeight: 800, buttonRadius: 2, buttonTransform: "uppercase",
    labelTransform: "uppercase", labelSpacing: "0.04em",
    buttonShadow: "2px 2px 0 #1a1a1a", cardShadow: "2px 2px 0 rgba(26,26,26,0.16)",
  },
  [EThemeId.PASTEL]: {
    id: EThemeId.PASTEL,
    name: "Pastel Cloud",
    blurb: "Soft and forgiving. Big pill radii, generous air, muted periwinkle.",
    mode: "light",
    swatches: ["#f7f5ff", "#9b8cff", "#ff9ec4"],
    colors: {
      bg: "#f7f5ff", paper: "#ffffff", surface2: "#f0ecff", text: "#3f3a57",
      muted: "#9d98b8", faint: "#ddd7f0", line: "#ece7fb", accent: "#9b8cff",
      accentInk: "#ffffff", secondary: "#ff9ec4", warning: "#ffab6b", error: "#ff7a90",
      status: status("#8fa0c9", "#7c9dff", "#68cfa0", "#ffab6b", "#c3bdd6"),
    },
    radius: 18, borderWidth: 1, borderStyle: "solid",
    fontBody: ROUNDED, fontHead: ROUNDED, fontMeta: GROTESK,
    buttonWeight: 600, buttonRadius: 999, buttonTransform: "none",
    labelTransform: "none", labelSpacing: "0.02em",
    buttonShadow: "none", cardShadow: "0 4px 16px rgba(120,105,220,0.1)",
  },
  [EThemeId.TODAY]: {
    id: EThemeId.TODAY,
    name: "Todo Today",
    blurb: "The house style. Rounded Comfortaa, the app's blue-and-teal palette.",
    mode: "light",
    swatches: ["#eaf9ff", "#4c7da5", "#18bda2"],
    colors: {
      bg: "#eaf9ff", paper: "#dceff6", surface2: "#cfe4ec", text: "#43494c",
      muted: "#7e94a0", faint: "#a9c3cf", line: "#bcdae6", accent: "#4c7da5",
      accentInk: "#ffffff", secondary: "#18bda2", warning: "#e48e0c", error: "#f1282e",
      status: status("#6f8ea0", "#4c7da5", "#18bda2", "#e48e0c", "#9fb4bf"),
    },
    radius: 9, borderWidth: 1, borderStyle: "solid",
    fontBody: ROUNDED, fontHead: ROUNDED, fontMeta: GROTESK,
    buttonWeight: 600, buttonRadius: 8, buttonTransform: "none",
    labelTransform: "none", labelSpacing: "0.02em",
    buttonShadow: "none", cardShadow: "none",
  },
};

export const THEME_LIST: ThemeSpec[] = Object.values(THEMES);

export const resolveThemeId = (id: string | null | undefined): EThemeId =>
  id && (Object.values(EThemeId) as string[]).includes(id)
    ? (id as EThemeId)
    : DEFAULT_THEME_ID;

export const resolveDensity = (d: string | null | undefined): EDensity =>
  d === "compact" || d === "comfortable" ? d : DEFAULT_DENSITY;

/** Structural (non-color) component behaviors carried over from the app's
 * original theme. Colors and radii are layered on per-spec in buildTheme. */
const structuralOptions: ThemeOptions = {
  components: {
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: "36px" },
        indicator: { display: "none" },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minWidth: 0,
          textTransform: "none",
          minHeight: "36px",
          height: "36px",
          "&.Mui-selected": { fontWeight: 900 },
          "&:hover": { fontWeight: 900 },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: { display: "list-item", margin: 0, padding: "4px" },
      },
    },
    MuiList: { styleOverrides: { root: { listStyleType: "square" } } },
  },
};

const px = (n: number) => `${n}px`;

export const buildTheme = (spec: ThemeSpec, density: EDensity): Theme => {
  const c = spec.colors;
  const border = spec.borderStyle === "none"
    ? "none"
    : `${px(spec.borderWidth)} ${spec.borderStyle} ${c.line}`;
  // A gentle raised surface derived from the background, so panels read as
  // "grouped" without slapping the loud card color across large areas.
  const panel = spec.mode === "dark" ? lighten(c.bg, 0.05) : darken(c.bg, 0.04);

  const specOptions: ThemeOptions = {
    palette: {
      mode: spec.mode,
      primary: { main: c.accent, contrastText: c.accentInk },
      secondary: { main: c.secondary },
      info: { main: c.muted },
      warning: { main: c.warning },
      error: { main: c.error },
      background: { default: c.bg, paper: c.paper },
      text: { primary: c.text, secondary: c.muted },
      divider: c.line,
      action: { disabled: c.faint },
    },
    shape: { borderRadius: spec.radius },
    typography: {
      fontFamily: spec.fontBody,
      h1: { fontFamily: spec.fontHead, fontWeight: 800, fontSize: "22px", color: c.text },
      h2: { fontFamily: spec.fontHead, fontWeight: 700, fontSize: "18px", color: c.text },
      h3: { fontFamily: spec.fontHead, fontWeight: 700, fontSize: "14px", color: c.text },
      body1: { fontSize: "14px", color: c.text },
      body2: { fontSize: "12px", color: c.muted },
    },
    components: {
      MuiButton: {
        defaultProps: { size: "small", disableElevation: true },
        styleOverrides: {
          root: {
            textTransform: spec.buttonTransform,
            borderRadius: px(spec.buttonRadius),
            fontFamily: spec.fontHead,
            fontWeight: spec.buttonWeight,
            fontSize: "12.5px",
            lineHeight: 1.35,
            minWidth: "unset",
            minHeight: 0,
            padding: "4px 10px",
            boxShadow: spec.buttonShadow,
            cursor: "pointer",
            "&:hover": { boxShadow: spec.buttonShadow },
            "&:disabled": { cursor: "not-allowed" },
          },
          contained: {
            fontWeight: spec.buttonWeight,
            backgroundColor: c.accent,
            color: c.accentInk,
            "&:hover": { backgroundColor: c.accent },
          },
          outlined: {
            fontWeight: spec.buttonWeight,
            color: c.text,
            borderColor: c.line,
            borderWidth: px(Math.max(1, spec.borderWidth)),
            "&:hover": { backgroundColor: c.surface2, borderColor: c.accent },
          },
          text: { color: c.text, "&:hover": { backgroundColor: c.surface2 } },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: px(spec.radius),
            color: c.text,
            fontSize: "13px",
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: c.accent },
            // For multiline the padding lives on the root (the textarea is
            // padded to 0), so set it here to avoid it stacking with the
            // single-line `input` rule below.
            "&.MuiInputBase-multiline": { padding: "5px 10px" },
            "&.MuiInputBase-multiline .MuiOutlinedInput-input": { padding: 0 },
          },
          input: { padding: "6px 10px" },
          notchedOutline: { borderColor: c.line },
        },
      },
      MuiTextField: { styleOverrides: { root: { borderRadius: px(spec.radius) } } },
      MuiInputBase: { styleOverrides: { input: { fontSize: "13px" } } },
      MuiSelect: {
        styleOverrides: {
          select: {
            paddingTop: "6px",
            paddingBottom: "6px",
            minHeight: "unset",
            fontSize: "13px",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            minHeight: "auto",
            fontSize: "13px",
            paddingTop: "5px",
            paddingBottom: "5px",
          },
        },
      },
      MuiTooltip: {
        styleOverrides: { tooltip: { borderRadius: px(Math.min(spec.radius, 6)) } },
      },
      MuiIconButton: {
        styleOverrides: { root: { borderRadius: px(Math.min(spec.radius, 8)), color: c.muted } },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            border: 0,
            borderRadius: px(Math.min(spec.radius, 8)),
            fontSize: "12px",
            padding: "5px 12px",
            lineHeight: 1.4,
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            color: c.faint,
            "&.Mui-checked": { color: c.accent },
            "&.Mui-checked + .MuiSwitch-track": { backgroundColor: c.accent },
          },
          track: { backgroundColor: c.faint, borderRadius: 999 },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            color: c.muted,
            "&.Mui-selected": { backgroundColor: c.surface2, color: c.text },
            "&:hover": { backgroundColor: c.surface2, color: c.text },
          },
        },
      },
      MuiLink: { styleOverrides: { root: { color: c.accent } } },
      MuiCssBaseline: {
        styleOverrides: {
          body: { backgroundColor: c.bg },
          "::selection": { backgroundColor: c.accent, color: c.accentInk },
        },
      },
    },
    app: {
      line: c.line,
      border,
      panel,
      muted: c.muted,
      faint: c.faint,
      surface2: c.surface2,
      accentInk: c.accentInk,
      fontHead: spec.fontHead,
      fontMeta: spec.fontMeta,
      cardShadow: spec.cardShadow,
      labelTransform: spec.labelTransform,
      labelSpacing: spec.labelSpacing,
      statusColors: c.status,
      density: DENSITIES[density],
    },
  };

  return createTheme(merge({}, structuralOptions, specOptions));
};
