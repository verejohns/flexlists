import { Icon } from "@iconify/react";
import homeFill from "@iconify/icons-eva/home-fill";
import fileFill from "@iconify/icons-eva/file-fill";

// ----------------------------------------------------------------------

const ICON_SIZE = {
  width: 22,
  height: 22,
};

const menuConfig = [
  {
    title: "Product",
    icon: <Icon icon={homeFill} {...ICON_SIZE} />,
    path: "/product",
  },
  {
    title: "Solutions",
    icon: <Icon icon={fileFill} {...ICON_SIZE} />,
    path: "/solutions",
  },
  {
    title: "Pricing",
    icon: <Icon icon={fileFill} {...ICON_SIZE} />,
    path: "/pricing",
  },
  {
    title: "Marketplace",
    icon: <Icon icon={fileFill} {...ICON_SIZE} />,
    path: "/marketplace",
  },

  {
    title: "Documentation",
    icon: <Icon icon={fileFill} {...ICON_SIZE} />,
    path: "/documentation",
  },
];

export default menuConfig;
