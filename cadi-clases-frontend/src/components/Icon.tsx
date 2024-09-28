import { ColorProp } from "@/types/theme";
import { Icon as Iconify } from "@iconify/react";
import { useTheme } from "@mui/material";

interface IconProps {
  icon: string;
  color?: ColorProp;
  fontSize?: string;
}
export default function Icon({ icon, color, fontSize }: IconProps) {
  const theme = useTheme();

  return (
    <Iconify
      icon={icon}
      color={
        color === undefined || color === "primary"
          ? theme.palette.primary.main
          : color === "secondary"
          ? theme.palette.secondary.main
          : color
      }
      fontSize={fontSize ?? "24px"}
    />
  );
}
