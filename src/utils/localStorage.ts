import { View } from "src/models/SharedModels";
import { LocalStorageConst } from "../constants/StorageConsts";

export function storeLanguage(language: string) {
  localStorage.setItem(LocalStorageConst.Language, language);
}

export function getLanguage() {
  return localStorage.getItem(LocalStorageConst.Language);
}

export function removeLanguage() {
  return localStorage.removeItem(LocalStorageConst.Language);
}

export function setViewReadContent(
  viewId: number,
  contentId: number
): number[] {
  let readContents = localStorage.getItem(`${viewId}_readContents`);
  let readContentsArray: number[] = [];

  if (readContents) {
    readContentsArray = JSON.parse(readContents) as number[];

    if (!readContentsArray.includes(contentId)) {
      readContentsArray.push(contentId);
      localStorage.setItem(
        `${viewId}_readContents`,
        JSON.stringify(readContentsArray)
      );
    }
  } else {
    localStorage.setItem(`${viewId}_readContents`, JSON.stringify([contentId]));
    readContentsArray.push(contentId);
  }

  return readContentsArray;
}

export function getViewReadContents(viewId: number) {
  let readContents = localStorage.getItem(`${viewId}_readContents`);

  if (readContents) {
    return JSON.parse(readContents) as number[];
  }

  return [];
}

export function removeViewReadContent(
  viewId: number,
  contentId: number
): number[] {
  let readContents = localStorage.getItem(`${viewId}_readContents`);
  let readContentsArray: number[] = [];

  if (readContents) {
    readContentsArray = JSON.parse(readContents) as number[];

    if (readContentsArray.includes(contentId)) {
      readContentsArray.splice(readContentsArray.indexOf(contentId), 1);
      localStorage.setItem(
        `${viewId}_readContents`,
        JSON.stringify(readContentsArray)
      );
    }
  }

  return readContentsArray;
}

export function setIsExistingFlow(isExistingFlow: boolean) {
  sessionStorage?.setItem("isExisting", isExistingFlow ? "true" : "false");
}

export function getIsExistingFlow() {
  return sessionStorage?.getItem("isExisting") === "true";
}

export const saveSettings = (viewId: number, key: string, value: any) => {
  const oldSettings = localStorage.getItem(`${viewId}_viewSettings`);
  let newSettings: any = {};

  if (oldSettings) newSettings = JSON.parse(oldSettings);
  newSettings[key] = value;

  localStorage.setItem(`${viewId}_viewSettings`, JSON.stringify(newSettings));
};

export const saveViewFilterStorage = (viewId: number, value: any) => {
  saveSettings(viewId, "filter", value);
  saveSettings(viewId, "isFilterChange", true);
};
export const saveViewSortStorage = (viewId: number, value: any) => {
  saveSettings(viewId, "sort", value);
  saveSettings(viewId, "isSortChange", true);
};
export const saveViewQueryStorage = (viewId: number, value: any) => {
  saveSettings(viewId, "query", value);
  saveSettings(viewId, "isQueryChange", true);
};
export const saveViewFieldsStorage = (viewId: number, value: any) => {
  saveSettings(viewId, "field", value);
  saveSettings(viewId, "isFieldChange", true);
};
export const saveViewPageStorage = (viewId: number, value: any) => {
  saveSettings(viewId, "page", value);
};
export const saveViewLimitStorage = (viewId: number, value: any) => {
  saveSettings(viewId, "limit", value);
  saveSettings(viewId, "isLimitChange", true);
};
export const saveViewPresetStorage = (viewId: number, value: any) => {
  saveSettings(viewId, "preset", value);
};
export const initViewStorage = (
  viewId: number,
  filter: any,
  sort: any,
  query: any,
  fields: any,
  page: any,
  limit: any,
  preset?: any
) => {
  saveSettings(viewId, "filter", filter);
  saveSettings(viewId, "isFilterChange", false);
  saveSettings(viewId, "sort", sort);
  saveSettings(viewId, "isSortChange", false);
  saveSettings(viewId, "query", query);
  saveSettings(viewId, "isQueryChange", false);
  saveSettings(viewId, "field", fields);
  saveSettings(viewId, "isFieldChange", false);
  saveSettings(viewId, "limit", limit);
  saveSettings(viewId, "isLimitChange", false);
  saveSettings(viewId, "preset", preset);
  saveViewPageStorage(viewId, page);
};
export const saveOrGetViewSettingsStorage = (
  currentView: View,
  setFilterChanged: (value: boolean) => void,
  setSortChanged: (value: boolean) => void,
  setQueryChanged: (value: boolean) => void,
  setFieldChanged: (value: boolean) => void,
  setLimitChanged: (value: boolean) => void
): boolean => {
  const viewSetting = getViewSettingsStorage(currentView.id);
  if (viewSetting) {
    currentView.conditions = viewSetting.filter;
    setFilterChanged(viewSetting.isFilterChange ?? false);
    currentView.order = viewSetting.sort;
    setSortChanged(viewSetting.isSortChange ?? false);
    currentView.query = viewSetting.query;
    setQueryChanged(viewSetting.isQueryChange ?? false);
    currentView.fields = viewSetting.field;
    setFieldChanged(viewSetting.isFieldChange ?? false);
    setLimitChanged(viewSetting.isLimitChange ?? false);
    currentView.page = viewSetting.page;
    currentView.limit = viewSetting.limit;
    return true;
  } else {
    initViewStorage(
      currentView.id,
      currentView.conditions,
      currentView.order,
      currentView.query,
      currentView.fields,
      currentView.page,
      currentView.limit
    );
    return false;
  }
};
export const getViewSettingsStorage = (
  viewId: number
): ViewStorageModel | undefined => {
  const settings = localStorage.getItem(`${viewId}_viewSettings`);

  return settings ? JSON.parse(settings) : undefined;
};

export const removeSettings = (viewId: number) => {
  if (localStorage.getItem(`${viewId}_viewSettings`)) {
    const newSettings: any = {};
    const oldSettings = JSON.parse(
      localStorage.getItem(`${viewId}_viewSettings`) || ""
    );

    newSettings.page = 0;
    newSettings.limit = oldSettings.limit || 25;

    localStorage.removeItem(`${viewId}_viewSettings`);

    localStorage.setItem(`${viewId}_viewSettings`, JSON.stringify(newSettings));
  }
};
export type ViewStorageModel = {
  filter: any;
  isFilterChange?: boolean;
  sort: any;
  isSortChange?: boolean;
  query: any;
  isQueryChange?: boolean;
  field: any;
  isFieldChange?: boolean;
  isLimitChange?: boolean;
  page: any;
  limit: any;
  preset: any;
};
