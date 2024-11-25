import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { listService } from "flexlists-api";

const YourComponent: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (router.query.key) {
        window.location.href = `/key/${router.query.key}`;
        return;
      }
      try {
        // get the id from the query input, it's list_id in the query
        const id = router.query.list_id;
        if (!id) {
          window.location.href = "/existing";
          return;
        }
        const response = await listService.getLegacyId(parseInt(id as string));
        if (response?.isSuccess) {
          // Redirect to the URL in the response
          window.location.href = response.data.url; // Redirect with a 302 HTTP status
        } else {
          // Redirect to home if isSuccess is false
          window.location.href = "/existing";
        }
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
