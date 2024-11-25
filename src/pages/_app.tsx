import { LanguagesProvider } from "src/contexts/LanguageContext";
import "src/styles/globals.css";
import type { AppProps } from "next/app";
import ThemeProvider from "src/theme";
import { StyledChart } from "src/components/chart";
import AuthGuard from "src/guards/AuthGuard";
import { Provider } from "react-redux";
import store from "../redux/store";
import "../styles/globals.css";
import LoadingPage from "./LoadingPage";
import FlashMessage from "src/components/FlashMessage";
import "./admin/test.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <LanguagesProvider>
        {/* <ScrollToTop /> */}
        <StyledChart />
        <Provider store={store}>
          <AuthGuard>
            {/* <LoadingPage> */}
              <FlashMessage />
              <Component {...pageProps} />
            {/* </LoadingPage> */}
          </AuthGuard>
        </Provider>
      </LanguagesProvider>
    </ThemeProvider>
  );
}
