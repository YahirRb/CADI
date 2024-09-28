import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Icon from "@/components/Icon";

interface NavItemProps {
  text: string;
  icon: string;
  color?: "primary";
  iconFontSize?: string;
}
export default function NavItem({
  text,
  icon,
  color,
  iconFontSize,
}: NavItemProps) {
  return (
    <ListItem disablePadding disableGutters>
      <ListItemButton sx={{ whiteSpace: "nowrap" }}>
        <ListItemIcon>
          <Icon icon={icon} color={color} fontSize={iconFontSize} />
        </ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
}
