import { Stack } from "@mui/material";

const ButtonWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Stack mt={2} spacing={1} direction="row">
      {children}
    </Stack>
  );
};

export default ButtonWrapper;
