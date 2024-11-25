import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { Autocomplete, Box, IconButton, MenuItem } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { isSucc } from "src/models/ApiResponse";
import { fetchRowsByPage, setCurrentView, setQueryChanged } from "src/redux/actions/viewActions";
import { listViewService } from "flexlists-api";
import { debounce } from "lodash";
import { SearchTypeModel, View } from "src/models/SharedModels";
import { PATH_MAIN } from "src/routes/paths";
import ClearIcon from "@mui/icons-material/Clear";

const StyledSearchBarMin = styled("div")(({ theme }) => ({
  display: "flex",
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
  [theme.breakpoints.up("lg")]: {
    justifyContent: "center",
    alignItems: "center",
  },
}));

type SearchBarMinProps = {
  currentView: View;
  searchTypes: SearchTypeModel[];
  fetchRowsByPage: (page?: number, limit?: number, query?: string) => void;
  setCurrentView: (view: View) => void;
  setQueryChanged: (value: boolean) => void;
};

const SearchBarMin = ({
  currentView,
  searchTypes,
  fetchRowsByPage,
  setCurrentView,
  setQueryChanged
}: SearchBarMinProps) => {
  const theme = useTheme();
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const [searchType, setSearchType] = useState<string>();
  const [currentSearchTypes, setCurrentSearchTypes] = useState<
    SearchTypeModel[]
  >([]);
  const [searchOptions, setSearchOptions] = useState<any[]>([]);
  const [clearSearchVisible, setClearSearchVisible] = useState<boolean>(false);

  useEffect(() => {
    if (router.isReady && searchTypes) {
      if (router.query.viewId || router.query.defaultListViewId) {
        setCurrentSearchTypes(searchTypes);
        //if (currentSearchTypes.find((x) => x.name === "CurrentView")) {
        setSearchType("CurrentView");
        //}
        setSearch(currentView?.query ?? "");
      } else {
        setCurrentSearchTypes(
          searchTypes.filter((x) => x.name !== "CurrentView")
        );
        //if (currentSearchTypes.find((x) => x.name === "CurrentView")) {
        setSearchType("AllViews");
        // }
      }
    }
  }, [router.isReady, searchTypes]);

  useEffect(() => {
    if (router.query.viewId || router.query.defaultListViewId) {
      setSearch(currentView?.query ?? "");
    }
  }, [currentView?.query]);

  const handleSearchTypeChange = async (event: SelectChangeEvent) => {
    const searchType = event.target.value as string;

    setSearchType(searchType);
    setSearch("");
  };

  const handleKeyPress = async (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      if (searchType === "CurrentView") {
        let newView: View = Object.assign({}, currentView);

        newView.query = search && search !== "" ? search : undefined;
        newView.page = 0;

        setCurrentView(newView);
        fetchRowsByPage(0, newView.limit ?? 25);

        if (!(!currentView.query && search === '') && currentView.query !== search) setQueryChanged(true);
      }
    }
  };

  const handleClearSearch = async () => {
    let newView: View = Object.assign({}, currentView);

    newView.query = undefined;
    newView.conditions = undefined;
    newView.page = 0;

    setCurrentView(newView);
    setSearch("");
    setClearSearchVisible(false);
    fetchRowsByPage(0, newView.limit ?? 25);
  };

  const fetchViews = async (searchTerm: string) => {
    try {
      const response = await listViewService.searchViews(searchTerm);

      if (isSucc(response) && response.data) {
        setSearchOptions(response.data.views);
      }
    } catch (error) {
      console.error("Error fetching views:", error);
    }
  };

  const debouncedFetchOptions = debounce(fetchViews, 500);

  const handleSearchViewInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const searchTerm = event.target.value;
    
    debouncedFetchOptions(searchTerm);
  };

  const handleSelectView = async (view: any) => {
    if (view && view.id) {
      if (view.isDefaultView) {
        await router.push({ pathname: `${PATH_MAIN.lists}/${view.id}` });
      } else {
        await router.push({ pathname: `${PATH_MAIN.views}/${view.id}` });
      }

      if (currentView && currentView.id) {
        router.reload();
      }
    }
  };

  return (
    <StyledSearchBarMin>
      <Box
        sx={{
          // border: `1px solid ${theme.palette.palette_style.border.default}`,
          display: "flex",
          alignItems: "center",
          borderRadius: "12px",
          width: { xs: "100%", sm: "85%", md: 500, lg: 800 },
        }}
      >
        {searchType && (
          <Select
            id="lst_type"
            value={
              currentSearchTypes.find((x) => x.name === searchType)
                ? searchType
                : ""
            }
            onChange={(e) => handleSearchTypeChange(e)}
            size="small"
            sx={{
              boxShadow: "none",
              ".MuiOutlinedInput-notchedOutline": { border: 0 },
            }}
            MenuProps={{
              sx: {
                "& .MuiList-root": {
                  background: theme.palette.palette_style.background.paper,
                },
              },
            }}
          >
            {currentSearchTypes.map((x) => {
              return (
                <MenuItem key={x.name} value={x.name}>
                  {x.text}
                </MenuItem>
              );
            })}
          </Select>
        )}
        {searchType === "CurrentView" && (
          <TextField
            fullWidth
            size="small"
            key={searchType}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setClearSearchVisible(e.target.value !== "");
            }}
            onKeyDown={(e) => handleKeyPress(e)}
            InputProps={{
              endAdornment: (
                <IconButton
                  sx={{ visibility: clearSearchVisible ? "visible" : "hidden" }}
                  onClick={() => handleClearSearch()}
                >
                  <ClearIcon />
                </IconButton>
              ),
            }}
            sx={{ input: { color: currentView?.query ?
              theme.palette.palette_style.text.selected :
              theme.palette.palette_style.text.primary
            } }}
          />
        )}
        {searchType === "AllViews" && (
          <Autocomplete
            id="free-solo-2-name"
            fullWidth
            size="small"
            options={searchOptions}
            getOptionLabel={(option) => option.name}
            onChange={(event: any, newValue: any) => {
              handleSelectView(newValue);
            }}
            sx={{
              width: "100%",
              // height: 32,
              boxShadow: "none",
              // ".MuiOutlinedInput-notchedOutline": { border: 0 },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                // label="Search..."
                onChange={handleSearchViewInputChange}
              />
            )}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.id}>
                  {option.name}
                </li>
              );
            }}
            // renderOption={(props, option, { selected }) => (
            //   <li {...props}>
            //     <Box
            //       sx={{
            //         display: 'flex',
            //         justifyContent: 'space-between',
            //         width: '100%',
            //         alignItems: 'center',
            //         py: 1
            //       }}
            //     >
            //       <Box
            //         sx={{
            //           display: 'flex'
            //         }}
            //       >
            //         <Box
            //           component="span"
            //           className="svg-color"
            //           sx={{
            //             width: 18,
            //             height: 18,
            //             display: 'inline-block',
            //             bgcolor: '#D3D3D3',
            //             mask: `url(/assets/icons/header/magnify.svg) no-repeat center / contain`,
            //             WebkitMask: `url(/assets/icons/header/magnify.svg) no-repeat center / contain`,
            //             mr: 1,
            //             mt: 0.4
            //           }}
            //         />
            //         <Box
            //           sx={{
            //             width: { xs: '330px', sm: 150, md: 200, lg: 400 },
            //             overflow: 'hidden',
            //             whiteSpace: 'nowrap',
            //             textOverflow: 'ellipsis'
            //           }}
            //         >
            //           {option.label}
            //         </Box>
            //       </Box>
            //       <Box
            //         sx={{
            //           display: {xs: 'none', md: 'flex'},
            //           backgroundColor: '#EDF2F5',
            //           color: '#666',
            //           borderRadius: '6px',
            //           border: '1px solid rgba(102, 102, 102, 0.1)',
            //           px: 1,
            //           py: 0.5
            //         }}
            //       >
            //         <Box>{option.sub1} / </Box>
            //         <Box
            //           component="span"
            //           className="svg-color"
            //           sx={{
            //             width: 18,
            //             height: 18,
            //             display: 'inline-block',
            //             bgcolor: '#666',
            //             mask: `url(/assets/icons/${option.icon}) no-repeat center / contain`,
            //             WebkitMask: `url(/assets/icons/${option.icon}) no-repeat center / contain`,
            //             mx: 0.5,
            //             mt: 0.3
            //           }}
            //         />
            //         <Box>{option.sub2}</Box>
            //       </Box>
            //     </Box>
            //   </li>
            // )}
          />
        )}
      </Box>
    </StyledSearchBarMin>
  );
};

const mapStateToProps = (state: any) => ({
  searchTypes: state.admin.searchTypes,
  currentView: state.view.currentView,
});

const mapDispatchToProps = {
  fetchRowsByPage,
  setCurrentView,
  setQueryChanged
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBarMin);
