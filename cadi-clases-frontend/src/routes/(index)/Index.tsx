import { Box, useTheme } from "@mui/material";

export default function Index() {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          backgroundColor: theme.palette.background.default,
        }}
      ></Box>
    </>
  );
}
