import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import MainLayout from "src/layouts/view/MainLayout";
import Header from "src/sections/@list/Header";
import MenuBar from "src/sections/@list/MenuBar";
import DataTable from "src/sections/@list/DataTable";
import { useRouter } from "next/router";
import { View } from "src/models/SharedModels";
import { connect } from "react-redux";
import {
  fetchColumns,
  getCurrentView,
  getViewUsers,
  getAllViewUsers,
  setCurrentView,
  setFilterChanged,
  setSortChanged,
  setQueryChanged,
  setFieldChanged,
  setLimitChanged,
} from "src/redux/actions/viewActions";
import { isInteger } from "src/utils/validateUtils";
import { convertToNumber } from "src/utils/convertUtils";
import { ViewType } from "src/enums/SharedEnums";
import CalendarView from "src/sections/@calendar/CalendarView";
import { ViewField } from "src/models/ViewField";
import KanbanView from "src/sections/@kanban/KanbanView";
import GalleryView from "src/sections/@gallery/GalleryView";
import TimelineView from "src/sections/@timeline/TimelineView";
import GanttView from "src/sections/@gantt/GanttView";
import MapView from "src/sections/@map/MapView";
import SpreadsheetView from "src/sections/@spreadsheet/SpreadsheetView";
import ChartView from "src/sections/@chart/ChartView";
import { GetServerSideProps } from "next";
import { getTranslations } from "src/utils/i18n";
import { TranslationText } from "src/models/SharedModels";
import { PATH_MAIN } from "src/routes/paths";
import {
  saveOrGetViewSettingsStorage,
  saveViewFilterStorage,
  saveViewSortStorage,
  saveViewQueryStorage,
  saveViewFieldsStorage,
  saveViewPageStorage,
  saveViewLimitStorage,
} from "src/utils/localStorage";

type ListProps = {
  translations: TranslationText[];
  currentView: View;
  columns: ViewField[];
  users: any[];
  allViewUsers: any[];
  filterChanged: boolean;
  sortChanged: boolean;
  queryChanged: boolean;
  fieldChanged: boolean;
  limitChanged: boolean;
  getCurrentView: (viewId: number) => void;
  fetchColumns: (viewId: number) => void;
  getViewUsers: (viewId: number) => void;
  getAllViewUsers: (viewId: number) => void;
  setCurrentView: (view: View) => void;
  setFilterChanged: (value: boolean) => void;
  setSortChanged: (value: boolean) => void;
  setQueryChanged: (value: boolean) => void;
  setFieldChanged: (value: boolean) => void;
  setLimitChanged: (value: boolean) => void;
};

export const ViewDetail = ({
  currentView,
  columns,
  translations,
  users,
  allViewUsers,
  filterChanged,
  sortChanged,
  queryChanged,
  fieldChanged,
  limitChanged,
  getViewUsers,
  getAllViewUsers,
  fetchColumns,
  getCurrentView,
  setCurrentView,
  setFilterChanged,
  setSortChanged,
  setQueryChanged,
  setFieldChanged,
  setLimitChanged,
}: ListProps) => {
  const router = useRouter();
  const theme = useTheme();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (
      router.isReady &&
      router.query.viewId &&
      getCurrentView &&
      isInteger(router.query.viewId)
    ) {
      getCurrentView(convertToNumber(router.query.viewId));

      if (users.length === 0) {
        getViewUsers(convertToNumber(router.query.viewId));
      }

      if (allViewUsers.length === 0) {
        getAllViewUsers(convertToNumber(router.query.viewId));
      }
    }
  }, [router.isReady]);

  useEffect(() => {
    if (
      router.isReady &&
      currentView &&
      router.query.viewId &&
      isInteger(router.query.viewId)
    ) {
      if (currentView.isDefaultView) {
        let l = `${PATH_MAIN.lists}/${currentView.id}?`;
        for (const key in router.query) {
          if (key === "viewId") continue;
          l += `${key}=${router.query[key]}&`;
        }

        window.location.href = l;
        return;
      }
      fetchColumns(convertToNumber(router.query.viewId));

      let newView: View = Object.assign({}, currentView);
      let isViewChange = saveOrGetViewSettingsStorage(
        newView,
        setFilterChanged,
        setSortChanged,
        setQueryChanged,
        setFieldChanged,
        setLimitChanged
      );

      if (router.query.cpid) {
        const cpids =
          typeof router.query.cpid === "string"
            ? router.query.cpid.split("-")
            : router.query.cpid;

        newView.parentViewId = parseInt(cpids[0]);
        newView.parentFieldId = parseInt(cpids[1]);
        newView.parentContentId = parseInt(cpids[2]);
        isViewChange = true;
      }
      if (isViewChange) {
        setCurrentView(newView);
      }
    }
  }, [router.isReady, currentView?.id]);

  useEffect(() => {
    if (currentView) {
      if (filterChanged) {
        saveViewFilterStorage(currentView.id, currentView.conditions);
      }
      if (sortChanged) {
        saveViewSortStorage(currentView.id, currentView.order);
      }
      if (queryChanged) {
        saveViewQueryStorage(currentView.id, currentView.query);
      }
      if (fieldChanged) {
        saveViewFieldsStorage(currentView.id, currentView.fields);
      }
      if (limitChanged) {
        saveViewLimitStorage(currentView.id, currentView.limit || 25);
      }
      saveViewPageStorage(currentView.id, currentView.page || 0);
    }
  }, [
    currentView,
    filterChanged,
    sortChanged,
    queryChanged,
    fieldChanged,
    limitChanged,
  ]);

  const handleRefresh = () => {
    setRefresh(true);
  };

  const clearRefresh = () => {
    setRefresh(false);
  };

  return (
    <MainLayout translations={translations}>
      {currentView && columns && columns.length > 0 && users.length > 0 ? (
        <Box
          sx={{
            backgroundColor: theme.palette.palette_style.background.default,
            boxShadow: "none",
            width: "100%",
            height: { xs: "100%", md: "100%" },
            overflow: "hidden",
          }}
        >
          <Header translations={translations} handleRefresh={handleRefresh} />
          <MenuBar search="" translations={translations} />

          {currentView.type === ViewType.List && (
            <DataTable
              translations={translations}
              refresh={refresh}
              clearRefresh={clearRefresh}
            />
          )}
          {currentView.type === ViewType.Calendar && (
            <CalendarView
              translations={translations}
              refresh={refresh}
              clearRefresh={clearRefresh}
            />
          )}
          {currentView.type === ViewType.KanBan && (
            <KanbanView
              translations={translations}
              refresh={refresh}
              clearRefresh={clearRefresh}
            />
          )}
          {currentView.type === ViewType.Gallery && (
            <GalleryView
              translations={translations}
              refresh={refresh}
              clearRefresh={clearRefresh}
            />
          )}
          {currentView.type === ViewType.TimeLine && (
            <TimelineView
              translations={translations}
              refresh={refresh}
              clearRefresh={clearRefresh}
            />
          )}
          {currentView.type === ViewType.Gantt && (
            <GanttView
              translations={translations}
              refresh={refresh}
              clearRefresh={clearRefresh}
            />
          )}
          {currentView.type === ViewType.Map && (
            <MapView
              translations={translations}
              refresh={refresh}
              clearRefresh={clearRefresh}
            />
          )}
          {currentView.type === ViewType.Spreadsheet && (
            <SpreadsheetView
              translations={translations}
              refresh={refresh}
              clearRefresh={clearRefresh}
            />
          )}
          {currentView.type === ViewType.Chart && (
            <ChartView
              translations={translations}
              refresh={refresh}
              clearRefresh={clearRefresh}
            />
          )}
        </Box>
      ) : (
        <></>
      )}
    </MainLayout>
  );
};

const mapStateToProps = (state: any) => ({
  currentView: state.view.currentView,
  columns: state.view.columns,
  users: state.view.users,
  allViewUsers: state.view.allUsers,
  filterChanged: state.view.filterChanged,
  sortChanged: state.view.sortChanged,
  queryChanged: state.view.queryChanged,
  fieldChanged: state.view.fieldChanged,
  limitChanged: state.view.limitChanged,
});

const mapDispatchToProps = {
  getCurrentView,
  fetchColumns,
  getViewUsers,
  getAllViewUsers,
  setCurrentView,
  setFilterChanged,
  setSortChanged,
  setQueryChanged,
  setFieldChanged,
  setLimitChanged,
};

// TODO: make this work, there is an access issue, so probably it's not passing the JWT token to the request
// when requesting from the server side.
// -> not sure if it's even possible
export const getServerSideProps: GetServerSideProps = async (context) => {
  // const token = getCookieToken(context.req, context.res);
  // var id = context.query.viewId;
  // try {
  //   const response = await listViewService.getView(convertToNumber(id), {
  //     headers: {
  //       Cookie: `token=${token};`
  //     }
  //   });
  //   console.log('response', response)
  // } catch (e: any) {
  //   console.log(e)
  // }

  // const result = {
  //   props: {
  //     //currentView: response.data!,
  //   },
  // }

  return await getTranslations("lists views", context);
};
export default connect(mapStateToProps, mapDispatchToProps)(ViewDetail);
