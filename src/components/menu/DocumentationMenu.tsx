import * as React from "react";
import { Box, Link, Typography, Divider } from "@mui/material";
import { OndemandVideo as TutorialsIcon } from "@mui/icons-material/";
import { Topic as DocsIcon } from "@mui/icons-material/";
import { CoPresent as WebinarsIcon } from "@mui/icons-material/";
import { Newspaper as BlogIcon } from "@mui/icons-material/";
import {Route as RoadmapIcon} from '@mui/icons-material/';
import { GetServerSideProps } from "next";
import { validateToken } from "src/utils/tokenUtils";
import { getTranslations, getTranslation } from "src/utils/i18n";
import { TranslationText } from "src/models/SharedModels";
import { useRouter } from "next/router";
import { getMenuItems } from "src/layouts/docs/MainNavbar";
import { useTheme } from "@mui/material/styles";

type DocumentationMenuProps = {
  translations: TranslationText[];
};

const DocumentationMenu = ({ translations }: DocumentationMenuProps) => {
  const theme = useTheme();
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };

  const router = useRouter();

  const menuItems = getMenuItems(t);

  const docs = menuItems.docs
    .filter((item) => !item.ignore)
    .map((item) => {
      return {
        name: item.title,
        link: item.path,
      };
    });

  const tutorials = menuItems.tutorials
    .filter((item) => !item.ignore)
    .map((item) => {
      return {
        name: item.title,
        link: item.path,
      };
    });
  const webinars = menuItems.webinars
    .filter((item) => !item.ignore)
    .map((item) => {
      return {
        name: item.title,
        link: item.path,
      };
    });
  const blogs = menuItems.blogs
    .filter((item) => !item.ignore)
    .map((item) => {
      return {
        name: item.title,
        link: item.path,
      };
    });
  const roadmap = menuItems.roadmap
    .filter((item) => !item.ignore)
    .map((item) => {
      return {
        name: item.title,
        link: item.path,
      };
    });

  const styles = {
    docsWrapper: {
      display: "flex",
      gap: 4,
      flexDirection: { xs: "column", lg: "row" },
    },
    docsTitle: {
      textTransform: "uppercase",
      color: theme.palette.palette_style.text.primary,
      letterSpacing: "2px",
    },
    docsLink: {
      textDecoration: "none",
      color: theme.palette.palette_style.text.primary,
      py: 0.5,
      "&:hover": {
        opacity: 0.75,
      },
    },
  };

  return (
    <Box sx={styles?.docsWrapper}>
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <DocsIcon sx={{ color: "#903cde" }} />
          <Typography variant="subtitle2" sx={styles?.docsTitle}>
            {t("Docs")}
          </Typography>
        </Box>
        <Divider light sx={{ my: 2 }}></Divider>
        {docs.map((doc) => (
          <Link
            key={doc.name + "-doc"}
            sx={styles?.docsLink}
            onClick={async () => {
              await router.push({
                pathname: doc.link,
              });
            }}
            href="#"
          >
            {t(doc.name)}
          </Link>
        ))}
        {/* <Link
          sx={styles?.docsLink}
          onClick={async () => {
            await router.push({
              pathname: "/documentation/docs/adding_new_list",
            });
          }}
          href="#"
        >
          {t("Adding New List")}
        </Link>
        <Link
          sx={styles?.docsLink}
          href="/documentation/docs/inviting_users"
        >
          {t("Inviting Users")}
        </Link>
        <Link
          sx={styles?.docsLink}
          href="/documentation/docs/inviting_groups"
        >
          {t("Inviting Groups")}
        </Link>
        <Link
          sx={styles?.docsLink}
          href="/documentation/docs/key_sharing"
        >
          {t("Key Sharing")}
        </Link>
        <Link
          sx={styles?.docsLink}
          href="/documentation/docs/creating_new_view"
        >
          {t("Creating New View")}
        </Link>
        <Link
          sx={styles?.docsLink}
          href="/documentation/docs/view_permissions"
        >
          {t("View Permissions")}
        </Link>
        <Link
          sx={styles?.docsLink}
          href="/documentation/docs/comments_section"
        >
          {t("Comments Section")}
        </Link> */}
      </Box>
      {/* <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TutorialsIcon sx={{ color: "#deb33c" }} />
          <Typography variant="subtitle2" sx={styles?.docsTitle}>
            {t("Tutorials")}
          </Typography>
        </Box>
        <Divider light sx={{ my: 2 }}></Divider>
        {tutorials.map((doc) => (
          <Link
            key={doc.name + "-tutorials"}
            sx={styles?.docsLink}
            onClick={async () => {
              await router.push({
                pathname: doc.link,
              });
            }}
            href="#"
          >
            {t(doc.name)}
          </Link>
        ))}
        <Link
          sx={styles?.docsLink}
          href="/documentation/tutorials/adding_new_list"
        >
          {t("Adding New List")}
        </Link>
        <Link
          sx={styles?.docsLink}
          href="/documentation/tutorials/inviting_users"
        >
          {t("Inviting Users")}
        </Link>
        <Link
          sx={styles?.docsLink}
          href="/documentation/tutorials/inviting_groups"
        >
          {t("Inviting Groups")}
        </Link>
        <Link
          sx={styles?.docsLink}
          href="/documentation/tutorials/key_sharing"
        >
          {t("Key Sharing")}
        </Link>
        <Link
          sx={styles?.docsLink}
          href="/documentation/tutorials/list_sharing"
        >
          {t("List Sharing")}
        </Link>
      </Box> */}
      {/* <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WebinarsIcon sx={{ color: "#3c8dde" }} />
          <Typography variant="subtitle2" sx={styles?.docsTitle}>
            {t("Webinars")}
          </Typography>
        </Box>
        <Divider light sx={{ my: 2 }}></Divider>
        {webinars.map((doc) => (
          <Link
            key={doc.name + "-webinars"}
            sx={styles?.docsLink}
            onClick={async () => {
              await router.push({
                pathname: doc.link,
              });
            }}
            href="#"
          >
            {t(doc.name)}
          </Link>
        ))}
         <Link
          sx={styles?.docsLink}
          href="/documentation/webinars/adding_new_list"
        >
          {t("Adding New List")}
        </Link>
        <Link
          sx={styles?.docsLink}
          href="/documentation/webinars/inviting_users"
        >
          {t("Inviting Users")}
        </Link>
        <Link
          sx={styles?.docsLink}
          href="/documentation/webinars/inviting_groups"
        >
          {t("Inviting Groups")}
        </Link>
        <Link
          sx={styles?.docsLink}
          href="/documentation/webinars/key_sharing"
        >
          {t("Key Sharing")}
        </Link>
        <Link
          sx={styles?.docsLink}
          href="/documentation/webinars/list_sharing"
        >
          {t("List Sharing")}
        </Link> 
      </Box> */}
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <BlogIcon sx={{ color: "#de3c3c" }} />
          <Typography variant="subtitle2" sx={styles?.docsTitle}>
            {t("Blogs")}
          </Typography>
        </Box>
        <Divider light sx={{ my: 2 }}></Divider>
        {blogs.map((doc) => (
          <Link
            key={doc.name + "-blogs"}
            sx={styles?.docsLink}
            onClick={async () => {
              await router.push({
                pathname: doc.link,
              });
            }}
            href="#"
          >
            {t(doc.name)}
          </Link>
        ))}
        {/* <Link
            sx={styles?.docsLink}
            href="/documentation/blogs/adding_new_list"
          >
            {t("Adding New List")}
          </Link>
          <Link
            sx={styles?.docsLink}
            href="/documentation/blogs/inviting_users"
          >
            {t("Inviting Users")}
          </Link>
          <Link
            sx={styles?.docsLink}
            href="/documentation/blogs/inviting_groups"
          >
            {t("Inviting Groups")}
          </Link>
          <Link
            sx={styles?.docsLink}
            href="/documentation/blogs/key_sharing"
          >
            {t("Key Sharing")}
          </Link>
          <Link
            sx={styles?.docsLink}
            href="/documentation/blogs/list_sharing"
          >
            {t("List Sharing")}
          </Link> */}
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <RoadmapIcon sx={{ color: "#0d0dd9" }} />
          <Typography variant="subtitle2" sx={styles?.docsTitle}>
            {t("Roadmap")}
          </Typography>
        </Box>
        <Divider light sx={{ my: 2 }}></Divider>
        {roadmap.map((doc) => (
          <Link
            key={doc.name + "-blogs"}
            sx={styles?.docsLink}
            onClick={async () => {
              await router.push({
                pathname: doc.link,
              });
            }}
            href="#"
          >
            {t(doc.name)}
          </Link>
        ))}
        {/* <Link
            sx={styles?.docsLink}
            href="/documentation/blogs/adding_new_list"
          >
            {t("Adding New List")}
          </Link>
          <Link
            sx={styles?.docsLink}
            href="/documentation/blogs/inviting_users"
          >
            {t("Inviting Users")}
          </Link>
          <Link
            sx={styles?.docsLink}
            href="/documentation/blogs/inviting_groups"
          >
            {t("Inviting Groups")}
          </Link>
          <Link
            sx={styles?.docsLink}
            href="/documentation/blogs/key_sharing"
          >
            {t("Key Sharing")}
          </Link>
          <Link
            sx={styles?.docsLink}
            href="/documentation/blogs/list_sharing"
          >
            {t("List Sharing")}
          </Link> */}
      </Box>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const verifyToken = await validateToken(context);

  if (verifyToken) {
    return verifyToken;
  }

  return await getTranslations("documentation menu", context);
};

export default DocumentationMenu;
