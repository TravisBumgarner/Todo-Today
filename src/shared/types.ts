export const CHANNEL = {
  WEE_WOO: "WEE_WOO",
} as const;

export type FromRenderer = {
  [CHANNEL.WEE_WOO]: { id: number };
};

export type FromMain = {
  [CHANNEL.WEE_WOO]: { ok: boolean; id: number };
};

export type Invokes = {
  [CHANNEL.WEE_WOO]: {
    args: { payload: { name: string } };
    result: { success: boolean };
  };
};
export * from "./sync-message-types";
export * from "./async-message-types";
