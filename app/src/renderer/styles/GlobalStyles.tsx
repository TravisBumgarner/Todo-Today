import { GlobalStyles } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { BORDER_RADIUS, SPACING } from "../styles/consts";

export const AppGlobalStyles = () => {
  const theme = useTheme();

  return (
    <GlobalStyles
      styles={{
        body: {
          padding: `${SPACING.MEDIUM.PX}`,
        },
        "*::-webkit-scrollbar": {
          width: "1em",
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
        "html, body, #root": {
          height: "100%",
        },
      }}
    />
  );
};
