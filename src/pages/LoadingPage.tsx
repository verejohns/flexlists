import { useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { connect } from "react-redux";

// ----------------------------------------------------------------------

type LoadingPageProps = {
  children: ReactNode;
  isLoading: boolean;
  apiUrlsLoading: { url: string; expireTime: Date }[];
};

export function LoadingPage({
  children,
  isLoading,
  apiUrlsLoading,
}: LoadingPageProps) {
  const getLoading = () => {
    return (
      isLoading ||
      apiUrlsLoading.filter((x) => x.expireTime > new Date()).length > 0
    );
  };
  return (
    <>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          pointerEvents: "none",
        }}
        open={getLoading()}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div style={{ pointerEvents: getLoading() ? "none" : "auto" }}>
        {children}
      </div>
    </>
  );
}
const mapStateToProps = (state: any) => ({
  isLoading: state.admin.isLoading,
  apiUrlsLoading: state.admin.apiUrlsLoading,
});

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(LoadingPage);
