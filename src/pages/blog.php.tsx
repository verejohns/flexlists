import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { listService } from "flexlists-api";

const YourComponent: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        window.location.href = `/documentation/blogs/welcome-to-the-new-era`;
        return;
        // const response = await listService.getLegacyId(parseInt(id as string));
        // if (response?.isSuccess) {
        //   // Redirect to the URL in the response
        //   window.location.href = response.data.url; // Redirect with a 302 HTTP status
        // } else {
        //   // Redirect to home if isSuccess is false
        //   window.location.href = "/existing";
        // }
      } catch (error) {
        console.error("Error fetching data:", error);
        window.location.href = "/";
      }
    };

    fetchData();
  }, [router]);

  return <div>Loading...</div>;
};

export default YourComponent;
