import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useResponsive from "../../hooks/useResponsive";
import { format } from "date-fns";

type Props = {
  hours: string[];
  currentDate: Date;
  windowHeight: number;
  getData: (date: Date, flag: string) => any[];
  handleData: (data: any, date: any) => void;
  getFieldData: (data: any, field: string) => string;
  getDataStatus: (item: any, data: any, field: string) => string;
};

const DailyView = ({
  hours,
  currentDate,
  windowHeight,
  getData,
  handleData,
  getFieldData,
  getDataStatus,
}: Props) => {
  const theme = useTheme();
  const isDesktop = useResponsive("up", "md");

  const getCurrentDateString = (date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  return (
    <Box
      sx={{
        overflow: 'auto',
        height: {xs: `${windowHeight - 290}px`, md: `${windowHeight - 250}px`},
        display: "grid",
        gridTemplateColumns: `${isDesktop ? "64px" : "24px"} repeat(1, 1fr)`
      }}
    >
      <Box
        sx={{
          width: { xs: "24px", md: "64px" },
          fontSize: { xs: "12px", md: "16px" },
        }}
      >
        <Box
          sx={{
            height: { xs: "60px", md: "98px" },
            p: 1,
            textAlign: "right",
            marginBottom: 0.8,
          }}
        ></Box>
        {hours.map((hour: string) => (
          <Box
            key={`${hour}-left`}
            sx={{
              height: { xs: "88px", md: "98px" },
              p: { xs: 0.5, md: 1 },
              textAlign: "right",
            }}
          >
            {isDesktop ? hour : hour.split(":")[0]}
          </Box>
        ))}
      </Box>
      <Box sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}>
        <Box
          sx={{
            fontSize: { xs: "18px", md: "24px" },
            height: { xs: "60px", md: "98px" },
            px: 2,
            display: "flex",
            alignItems: "center",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            marginBottom: 0.8,
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
          <Box sx={{ mx: 2 }}>{format(currentDate, "EEEE")}</Box>
        </Box>
        {hours.map((hour: string) => (
          <Box
            key={`${hour}-right`}
            sx={{
              height: { xs: "88px", md: "98px" },
              border: "1px solid rgba(0, 0, 0, 0.1)",
              px: { xs: 0.3, md: 1 },
              py: 0.5,
              cursor: "pointer",
            }}
            onClick={(e: any) => {
              if (!e.target.classList.contains("edit_row"))
                handleData(
                  {
                    date:
                      getCurrentDateString(currentDate) + " " + hour + ":00",
                  },
                  currentDate
                );
            }}
          >
            {getData(
              new Date(getCurrentDateString(currentDate) + " " + hour + ":00"),
              "hour"
            ).map((data: any) => (
              <Box
                key={`${data.id}-week`}
                className="edit_row"
                sx={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  display: "flex",
                  cursor: "pointer",
                  "&:hover": {
                    color: theme.palette.palette_style.text.selected,
                  },
                  //borderRadius: "20px",
                  backgroundColor: "#FFB7B7",
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
                      backgroundColor: getFieldData(data, "color") || "#FFB7B7",
                      marginTop: 0.5,
                      marginRight: 0.5,
                    }}
                    className="edit_row"
                  ></Box>
                  <Box className="edit_row">
                    {getDataStatus(
                      data,
                      new Date(
                        getCurrentDateString(currentDate) + " " + hour + ":00"
                      ),
                      "hour"
                    ) === "begin"
                      ? getFieldData(data, "begin").split(" ")[1]
                      : hour}
                  </Box>
                  <Box sx={{ marginLeft: 0.5 }} className="edit_row">
                    {getFieldData(data, "title")}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default DailyView;
