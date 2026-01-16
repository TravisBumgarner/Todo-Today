// export const CHANNEL = {
//   WEE_WOO: "WEE_WOO",
// } as const;

// export type FromRenderer = {
//   [CHANNEL.WEE_WOO]: { id: number };
// };

// export type FromMain = {
//   [CHANNEL.WEE_WOO]: { ok: boolean; id: number };
// };

export interface StoreSchema {
  changelogLastSeenVersion: string | null
}