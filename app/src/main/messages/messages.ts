import { typedIpcMain } from "./index";
import { CHANNEL } from "../../shared/types";

typedIpcMain.handle(CHANNEL.WEE_WOO, async (_event, params) => {
  console.log("WEE WOO", params);
  return {
    success: true,
    data: "WEE WOO RECEIVED",
  };
});
