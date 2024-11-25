import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useResponsive from "../../hooks/useResponsive";
import { format } from "date-fns";

type Props = {
  days: Date[];
  currentDate: Date;
  windowHeight: number;
  getData: (date: Date, flag: string) => any[];
  handleData: (data: any, date: any) => void;
  getFieldData: (data: any, field: string) => string;
  getDataStatus: (item: any, data: any, field: string) => string;
};

const ListView = ({
  days,
  currentDate,
  windowHeight,
  getData,
  handleData,
  getFieldData,
  getDataStatus,
}: Props) => {
  const theme = useTheme();
  const isDesktop = useResponsive("up", "md");

  return (
    <Box sx={{ overflow: 'auto', height: {xs: `${windowHeight - 290}px`, md: `${windowHeight - 250}px`} }}>
      <Box
        sx={{
          fontSize: { xs: "18px", md: "24px" },
          height: { xs: "60px", md: "98px" },
          px: 2,
          display: "flex",
          alignItems: "center",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          marginBottom: 0.8,
          textTransform: "uppercase",
        }}
      >
        <Box
          sx={{
            backgroundColor: theme.palette.palette_style.text.selected,
            color: "white",
            py: 0.8,
            px: 1,
            borderRadius: "8px",
          }}
        >
          {format(currentDate, "d")}
        </Box>
        <Box sx={{ mx: 2 }}>{format(currentDate, "MMM")}, </Box>
        <Box>{format(currentDate, "iii")}</Box>
      </Box>
      {days.map((day: any) =>
        getData(new Date(format(day, "MM/dd/yyyy")), "day").length ? (
          <Box
            key={`${day}-right`}
            sx={{
              border: "1px solid rgba(0, 0, 0, 0.1)",
              px: { xs: 0.3, md: 1 },
              py: 0.5,
              display: "flex",
            }}
          >
            <Box sx={{ display: "flex", ml: 1, width: "110px" }}>
              <Box sx={{ fontSize: "24px", fontWeight: 900 }}>
                {format(day, "d")}
              </Box>
              <Box sx={{ ml: 1, mt: 1 }}>
                {format(day, "MMM")}, {format(day, "iii")}
              </Box>
            </Box>
            <Box sx={{ ml: 4, display: "flex", alignItems: "center" }}>
              <Box>
                {getData(new Date(format(day, "MM/dd/yyyy")), "day").map(
                  (data: any) => (
                    <Box
                      key={`${data.id}-week`}
                      className="edit_row"
                      sx={{
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        maxWidth: { xs: "200px", lg: "250px" },
                        display: "flex",
                        cursor: "pointer",
                        "&:hover": {
                          color: theme.palette.palette_style.text.selected,
                        },
                        //borderRadius: "20px",
                        marginBottom: { xs: "2px", md: "5px" },
                        fontSize: "12px",
                        borderBottomLeftRadius:
                          getDataStatus(
                            data,
                            new Date(format(currentDate, "MM/dd/yyyy")),
                            "day"
                          ) === "begin"
                            ? "10px"
                            : "",
                        borderTopLeftRadius:
                          getDataStatus(
                            data,
                            new Date(format(currentDate, "MM/dd/yyyy")),
                            "day"
                          ) === "begin"
                            ? "10px"
                            : "",
                        borderTopRightRadius:
                          //getFieldData(data, "end") === "" ||
                          getDataStatus(
                            data,
                            new Date(format(currentDate, "MM/dd/yyyy")),
                            "day"
                          ) === "end"
                            ? "10px"
                            : "",
                        borderBottomRightRadius:
                          //getFieldData(data, "end") === "" ||
                          getDataStatus(
                            data,
                            new Date(format(currentDate, "MM/dd/yyyy")),
                            "day"
                          ) === "end"
                            ? "10px"
                            : "",
                      }}
                      onClick={() => handleData(data, currentDate)}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          width: "100%",
                          px: 1,
                          py: 0.2,
                          borderRadius: 1.5,
                          textTransform: "capitalize",
                          backgroundColor:
                            getFieldData(data, "color") ||
                            theme.palette.palette_style.background.calendarItem,
                          color: theme.palette.palette_style.text.white,
                        }}
                        className="edit_row"
                      >
                        <Box
                          sx={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor:
                              getFieldData(data, "color") || "#FFB7B7",
                            marginTop: 0.5,
                            marginRight: 0.5,
                          }}
                          className="edit_row"
                        ></Box>
                        <Box className="edit_row">
                          {getFieldData(data, "begin")}
                        </Box>
                        <Box sx={{ marginLeft: 0.5 }} className="edit_row">
                          {getFieldData(data, "title")}
                        </Box>
                      </Box>
                    </Box>
                  )
                )}
              </Box>
            </Box>
          </Box>
        ) : (
          <></>
        )
      )}
    </Box>
  );
};

export default ListView;
