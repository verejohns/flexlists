import React, { useCallback, useEffect, useRef, useState } from "react";
import CustomLayout from "src/sections/@layout/customLayout/CustomLayout";
import ApplicationDetailPanel from "src/sections/@application/ApplicationDetailPanel";
import WidgetList from "src/components/widgetList/WidgetList";
import Header from "src/sections/@layout/header/Header";
import LayoutDialog from "src/sections/@layout/layoutDialog";
import { styled } from "@mui/material/styles";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import {
  setSelectedId,
  setOpenPanel,
} from "src/redux/actions/applicationActions";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { applicationService } from "flexlists-api";
import { isSucc } from "src/models/ApiResponse";
import { setFlashMessage } from "src/redux/actions/authAction";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import { Box } from "@mui/material";
import {
  drawerWidthLeft,
  drawerWidthRight,
  WIDGETITEMS,
  WIDGETLAYOUTS,
} from "src/constants/widget";

const { HTMLToJSON } = require("html-to-json-parser");

const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "openLeft" && prop !== "openRight",
})<{
  openLeft?: boolean;
  openRight?: boolean;
}>(({ theme, openLeft, openRight }) => ({
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `${drawerWidthLeft}px`,
  marginRight: `${drawerWidthRight}px`,

  ...(openRight && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  }),

  ...(openLeft && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

type GridRefType = {
  elementRef: React.RefObject<HTMLElement>;
};

const pageLayoutStyles = {
  marginBottom: "20px",
  marginRight: "auto",
  marginLeft: "auto",
  padding: "80px 20px 20px 20px",
  width: "1167px",
  background: "#fff",
  border: "1px solid rgba(0, 0, 0, 0.12)",
};

type PageLayoutProps = {
  translations: TranslationText[];
  applicationId: number;
  openPanel: boolean;
  openWidget: boolean;
  setOpenPanel: (value: boolean) => void;
  setSelectedId: (id: number) => void;
  setFlashMessage: (message: FlashMessageModel) => void;
};

const PageLayout = ({
  translations,
  applicationId,
  openPanel,
  openWidget,
  setOpenPanel,
  setSelectedId,
  setFlashMessage,
}: PageLayoutProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const router = useRouter();
  const gridRef = useRef<GridRefType | null>(null);

  const [customLayoutKey, setCustomLayoutKey] = useState(0);

  useEffect(() => {
    setOpenPanel(true);

    if (!applicationId) {
      setSelectedId(parseInt(localStorage.getItem("SELECTED_ID") || ""));
    }

    if (router.isReady) {
      console.log(router.query.id, "router.query");
    }
  }, []);

  const widgetsNameId = {
    widgetItemsPage: `${WIDGETITEMS}-${router.query.id}`,
    widgetLayoutsPage: `${WIDGETLAYOUTS}-${router.query.id}`,
  };

  const customLayoutComponent = (
    <CustomLayout key={customLayoutKey} {...widgetsNameId} innerRef={gridRef} />
  );

  const handleSubmit = useCallback(async () => {
    const gridElement = gridRef.current?.elementRef.current;

    if (gridElement) {
      const jsonLayout = await HTMLToJSON(gridElement, true);

      const response = await applicationService.updateApplicationMenuPage(
        parseInt(router.query.id as string),
        applicationId,
        jsonLayout
      );

      if (isSucc(response) && response.data) {
        setFlashMessage({
          message: "Updated menu page successfully",
          type: "success",
        });
      } else {
        setFlashMessage({ message: response?.data?.message, type: "error" });
      }
    }
  }, []);

  return (
    <>
      <Header
        translations={translations}
        handleSubmit={handleSubmit}
        {...widgetsNameId}
      />
      <WidgetList translations={translations} />
      <Main openRight={!openPanel} openLeft={!openWidget}>
        <Box style={pageLayoutStyles}>{customLayoutComponent}</Box>
      </Main>
      <ApplicationDetailPanel translations={translations} />
      <LayoutDialog
        translations={translations}
        handleSubmit={handleSubmit}
        setCustomLayoutKey={setCustomLayoutKey}
      >
        {customLayoutComponent}
      </LayoutDialog>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  applicationId: state.application.selectedId,
  openWidget: state.application.openWidget,
  openPanel: state.application.openPanel,
});

const mapDispatchToProps = {
  setSelectedId,
  setOpenPanel,
  setFlashMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(PageLayout);
