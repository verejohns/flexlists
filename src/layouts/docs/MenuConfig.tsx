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
    title: "Docs item 1",
    icon: <Icon icon={homeFill} {...ICON_SIZE} />,
    path: "/docs1",
  },
  {
    title: "Docs item 2",
    icon: <Icon icon={fileFill} {...ICON_SIZE} />,
    path: "/docs2",
  },
  {
    title: "Docs item 3",
    icon: <Icon icon={fileFill} {...ICON_SIZE} />,
    path: "/docs3",
  },
  {
    title: "Docs item 4",
    icon: <Icon icon={fileFill} {...ICON_SIZE} />,
    path: "/docs4",
  },
];

export default menuConfig;
