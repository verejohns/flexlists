import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { listService } from "flexlists-api";
import { isErr } from "src/utils/responses";

const YourComponent: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // get the id from the query input, it's list_id in the query
        // const id = router.query.list_id;
        // const format = router.query.format;
        // const offset = router.query.offset;
        // const num_items = router.query.num_items;
        // const key = router.query.key;
        // const pcid = router.query.pcid;
        // const dir = router.query.dir;
        // const query = router.query.query;

        const queryString = router.query
          ? Object.keys(router.query)
              .map((q) => `${q}=${router.query[q]}`)
              .join("&")
          : "";

        // -> /api/export/${props.secret}.json?fields=true
        if (router.query.key) {
          let format = "json";
          switch (router.query.format) {
            case "CSV":
              format = "csv";
              break;
            case "RSS":
              format = "rss";
              break;
            case "Excel":
              format = "xlsx";
              break;
            case "JSHTML":
              format = "html";
              break;
            default:
              break;
          }
          const url =
            process.env.NEXT_PUBLIC_FLEXLIST_API_URL +
            `/api/export/${router.query.key}.${format}`;

          // fetch the url from the server;
          const response = await fetch(url);
          const data = await response.json();
          if (isErr(data)) {
            window.location.href = "/existing";
            return;
          }
          window.location.href = url;
          return;
        }
        console.log(queryString);
        window.location.href = `https://v1.flexlists.com/listdata.php?${queryString}`;
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
