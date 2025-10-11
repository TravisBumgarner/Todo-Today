import { GlobalStyles } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { BORDER_RADIUS, SCROLLBAR_WIDTH_PX } from "../styles/consts";

export const AppGlobalStyles = () => {
  const theme = useTheme();

  return (
    <GlobalStyles
      styles={{
        html: {
          height: "100%",
          scrollbarGutter: "stable",
        },
        body: {
          height: "100%",
          overflowY: "scroll", // ✅ Always show vertical scrollbar
          padding: `${SCROLLBAR_WIDTH_PX} 0 ${SCROLLBAR_WIDTH_PX} ${SCROLLBAR_WIDTH_PX}`,
          margin: 0,
        },
        "#root": {
          height: "100%",
        },
        "*::-webkit-scrollbar": {
          width: SCROLLBAR_WIDTH_PX,
        },
        "*::-webkit-scrollbar-track": {
          border: `solid 3px ${theme.palette.background.default}`,
          borderRadius: BORDER_RADIUS.ZERO.PX,
        },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: theme.palette.primary.main,
          border: `solid 3px ${theme.palette.background.default}`,
          borderRadius: BORDER_RADIUS.ZERO.PX,
        },
      }}
    />
  );
};
