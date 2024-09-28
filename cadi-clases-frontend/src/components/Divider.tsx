import {
  Divider as MuiDivider,
  type DividerProps as MuiDividerProps,
  useTheme,
} from "@mui/material";

interface DividerProps extends MuiDividerProps {
  width?: number;
  opacity?: number;
}
export default function Divider(props: DividerProps) {
  const theme = useTheme();
  return (
    <MuiDivider
      {...props}
      sx={{
        ...props,
        borderColor: theme.palette.primary.main,
        borderWidth: props.width ? `${props.width}px` : "thin",
        opacity: props.opacity ?? "1",
      }}
    />
  );
}
