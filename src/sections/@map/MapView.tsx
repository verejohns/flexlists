import { useState, useEffect } from "react";
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { connect } from 'react-redux';
import { fetchRows } from '../../redux/actions/viewActions';
import ViewFooter from '../../components/view-footer/ViewFooter';
import GoogleMapReact from 'google-map-react';
import LocationPin from "./LocationPin";
import { TranslationText, View } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import Head from 'next/head';
import { setFlashMessage } from "src/redux/actions/authAction";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { getDefaultValues } from 'src/utils/flexlistHelper';
import { ViewField } from 'src/models/ViewField';
import useResponsive from "../../hooks/useResponsive";
import { useRouter } from "next/router";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_FLEXLIST_GOOGLE_MAPS_API_KEY;

type Location = {
  lat: number;
  lng: number;
};

type MapViewProps = {
  rows: any;
  translations: TranslationText[];
  refresh: Boolean;
  currentView: View;
  columns: ViewField[];
  fetchRows: () => void;
  clearRefresh: () => void;
  setFlashMessage: (message: FlashMessageModel | undefined) => void;
};

const MapView = (props: MapViewProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const { rows, translations, refresh, currentView, columns, fetchRows, clearRefresh, setFlashMessage } = props;
  const router = useRouter();
  const theme = useTheme();
  const isDesktop = useResponsive("up", "md");
  const [visibleAddRowPanel, setVisibleAddRowPanel] = useState(false);
  const [rowData, setRowData] = useState<any>(null);
  const [center, setCenter] = useState<Location>();
  const [windowHeight, setWindowHeight] = useState(0);
  const [mode, setMode] = useState<"view" | "create" | "update" | "comment">("view");
  const [address, setAddress] = useState('');
  const [isLoadScriptDone, setIsLoadScriptDone] = useState(false);
  const [zoom, setZoom] = useState<number>(10);
  // const [isGoogleMapScriptLoaded, setIsGoogleMapScriptLoaded] = useState(false);

  const searchBarStyle = {
    width: isDesktop ? '300px' : 'calc(100vw - 75px)',
    backgroundColor: theme.palette.palette_style.background.paper,
    color: theme.palette.palette_style.text.primary,
    borderRadius: '20px',
    paddingLeft: '8px',
    height: '45px',
    border: 'none',
    boxShadow: '0 0 5px 5px rgba(0, 0, 0, 0.1)',
    padding: '0 16px',
    outline: 'none'
  };

  useEffect(() => {
    if(!isLoadScriptDone)
    {
      const script = document.createElement('script');

      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=Function.prototype`;
      document.body.appendChild(script);
      script.onload = () => {
        setIsLoadScriptDone(true);
      };

      return () => {
        document.body.removeChild(script);
      };
    }    
  }, []);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     const googleMapScriptExists =  document.querySelector(`script[src*="https://maps.googleapis.com/maps/api/js"]`);

  //     if (googleMapScriptExists) {
  //       setIsGoogleMapScriptLoaded(true);
  //       clearInterval(intervalId);
  //     } 

  //   }, 1000);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [router.isReady]);

  useEffect(() => {
    if (refresh) fetchRows();
  }, [refresh]);

  useEffect(() => {
    clearRefresh();
  }, [rows]);

  useEffect(() => {
    fetchRows();
    setWindowHeight(window.innerHeight);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setCenter({ lat, lng });
      }, (error) => {
        setFlashMessage({ type: "error", message: error.message });
      });
    } else {
      setFlashMessage({ type: "error", message: 'Geolocation is not supported by your browser.' });
    }
  }, []);

  const setLocation = (row: any, pos: any) => {
    // setCenter({ lat: row[currentView.config.latId], lng: row[currentView.config.lngId] });

    if (row) {
      setRowData(row);
      setMode("view");
    } else newRowWithPos(pos.lat, pos.lng);

    setVisibleAddRowPanel(true);
  };

  const getZoomLevelFromAddressComponents = (addressComponents: any) => {
    let zoomLevel = 10;

    switch (addressComponents[0].types[0]) {
      case 'country': // Country
        zoomLevel = 5;
        break;
      case 'administrative_area_level_1': // State or Province
        zoomLevel = 7;
        break;
      case 'administrative_area_level_2': // County or District
        zoomLevel = 9;
        break;
      case 'locality': // City
        zoomLevel = 11;
        break;
      case 'sublocality': // Suburb or Neighborhood
        zoomLevel = 13;
        break;
      case 'route': // Street
        zoomLevel = 15;
        break;
      case 'street_number': // Building number
        zoomLevel = 17;
        break;
      // Add more cases for other address components if needed
      default:
        break;
    }

    return zoomLevel;
  };

  const handleSelect = async (selectedAddress: any) => {
    try {
      const results = await geocodeByAddress(selectedAddress);
      const latLng = await getLatLng(results[0]);
      const zoomLevel = getZoomLevelFromAddressComponents(results[0].address_components);
      
      setAddress(selectedAddress);
      setCenter(latLng);
      setZoom(zoomLevel);
    } catch (error) {
      console.error('Error selecting address', error);
    }
  };

  const handleMapClick = ({ x, y, lat, lng, event }: any) => {
    newRowWithPos(lat, lng);
    setVisibleAddRowPanel(true);
  };

  const newRowWithPos = (lat: number, lng: number) => {
    const newRow: any = getDefaultValues(columns);

    newRow[currentView.config?.latId] = lat;
    newRow[currentView.config?.lngId] = lng;

    setRowData(newRow);
    setMode("create");
  };

  return (
    <Box sx={{  }}>
      <Head>
        <title>{t("Map Page Title")}</title>
        <meta name="description" content={t("Map Meta Description")} />
        <meta name="keywords" content={t("Map Meta Keywords")} />
      </Head>
      <Box sx={{ height: {xs: `${windowHeight - 242}px`, md: `${windowHeight - 193}px`} }}>
        {/* { center && <GoogleMapReact */}
        { isLoadScriptDone && center && <GoogleMapReact
          bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY as string, libraries: 'places' }}
          center={center}
          zoom={zoom}
          onClick={handleMapClick}
        >
          <LocationPin
            key={`map-0`}
            lat={center.lat}
            lng={center.lng}
            setLocation={setLocation}
          />
          {rows.map((row: any) => (
            <LocationPin
              key={`map-${row.id}`}
              lat={row[currentView.config.latId]}
              lng={row[currentView.config.lngId]}
              row={row}
              setLocation={setLocation}
            />
          ))}
        </GoogleMapReact>}
      </Box>

      <Box sx={{ position: 'absolute', left: {xs: '8px', md: '75px'}, top: {xs: '201px', md: '154px'}, zIndex: 1 }}>
        {/* {isGoogleMapScriptLoaded && <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}> */}
        {isLoadScriptDone && <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <Box>
              <input {...getInputProps({ placeholder: t('Search Google Maps') })} style={searchBarStyle} />
              <Box sx={{ backgroundColor: theme.palette.palette_style.background.paper, maxWidth: '300px', overflow: 'auto', marginTop: 0.5, borderRadius: '5px' }}>
                {loading && <Box>{t('Loading')}...</Box>}
                {suggestions.map((suggestion: any) => (
                  <Box key={suggestion.placeId} sx={{ cursor: 'pointer', px: 1, py: 0.2 }}>
                    <Box {...getSuggestionItemProps(suggestion)}>
                      {suggestion.description}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </PlacesAutocomplete>}
      </Box>

      <ViewFooter translations={translations} visibleAddRowPanel={visibleAddRowPanel} rowData={rowData} setVisibleAddRowPanel={setVisibleAddRowPanel} setRowData={setRowData} mode={mode} setMode={setMode} />
    </Box>
  );
};

const mapStateToProps = (state: any) => ({
  rows: state.view.rows,
  currentView: state.view.currentView,
  columns: state.view.columns
});

const mapDispatchToProps = {
  fetchRows,
  setFlashMessage
};

export default connect(mapStateToProps, mapDispatchToProps)(MapView);
