import { GlobalStyles } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export const AppGlobalStyles = () => {
  const theme = useTheme();

  return (
    <GlobalStyles
      styles={{
        "*::-webkit-scrollbar": {
          width: "1em",
        },
        "*::-webkit-scrollbar-track": {
          border: `solid 3px ${theme.palette.background.default}`,
          borderRadius: "10px",
        },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: theme.palette.primary.main,
          border: `solid 3px ${theme.palette.background.default}`,
          borderRadius: "10px",
        },
        "html, body, #root": {
          height: "100%",
        },
      }}
    />
  );
};
