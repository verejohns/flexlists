import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useResponsive from "../../hooks/useResponsive";
import { format, isSameMonth, isSameDay, addDays, startOfWeek } from "date-fns";

type Props = {
  days: any[];
  currentDate: Date;
  cycleStart: Date;
  windowHeight: number;
  getData: (date: Date, flag: string) => any[];
  handleData: (data: any, date: any) => void;
  getFieldData: (data: any, field: string) => string;
  getDataStatus: (item: any, data: any, field: string) => string;
};

const MonthlyView = ({
  days,
  currentDate,
  cycleStart,
  windowHeight,
  getData,
  handleData,
  getFieldData,
  getDataStatus,
}: Props) => {
  const theme = useTheme();
  const isDesktop = useResponsive("up", "md");

  const calculateOrderPosition = (data: any, day: any, index: number) => {
    if (getFieldData(data, "end") !== "") {
      const startDate = startOfWeek(day);
      let maxIndex = 0;

      for (let i = 1; i <= 7; i++) {
        const weekData = getData(new Date(format(addDays(startDate, i), "MM/dd/yyyy")), "day");
        const weekIndex = weekData.findIndex((el: any) => data.id === el.id);

        if (weekIndex > maxIndex) maxIndex = weekIndex;
      }

      return `${(maxIndex - index) * 25}px`;
    }

    return '';
  };

  return (
    <Box
      sx={{
        overflow: 'auto',
        height: {xs: `${windowHeight - 347}px`, md: `100%`},
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gridTemplateRows: "repeat(6, 1fr)",
      }}
    >
      {days.map((day: any, index: number) => (
        <Box
          key={`${index}-month`}
          sx={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            height: { xs: "54px", md: "inherit" },
            cursor: "pointer",
          }}
          onClick={(e: any) => {
            if (!e.target.classList.contains("edit_row"))
              handleData(
                { date: `${format(day, "MM/dd/yyyy")} 00:00:00` },
                day
              );
          }}
        >
          <Box
            sx={{
              width: "100%",
              opacity: isSameMonth(day, cycleStart) ? 1 : 0.3,
            }}
          >
            <Box
              sx={{
                color: isSameDay(day, currentDate) ? "white" : "",
                display: "flex",
                justifyContent: "center",
                padding: "2px 0",
              }}
            >
              <Box
                sx={{
                  p: "2px",
                  borderRadius: "50%",
                  width: "28px",
                  backgroundColor: isSameDay(day, currentDate)
                    ? "rgb(26,115,232)"
                    : "",
                  textAlign: "center",
                }}
              >
                {format(day, "d")}
              </Box>
            </Box>
            {getData(new Date(format(day, "MM/dd/yyyy")), "day").map(
              (data: any, index: number) => (
                <Box
                  key={`${data.id}-month`}
                  sx={{
                    color: theme.palette.palette_style.text.white,
                    fontWeight: 500,
                    width: "100%",
                    display: "flex",
                    cursor: "pointer",
                    "&:hover": {
                      // color: theme.palette.palette_style.text.selected,
                      opacity: 0.8,
                    },
                    fontSize: "12px",
                    marginBottom: "2px",
                  }}
                  onClick={() => handleData(data, day)}
                  className="edit_row"
                >
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",
                      px: 1,
                      py: 0.2,
                      borderBottomLeftRadius:
                        getDataStatus(
                          data,
                          new Date(format(day, "MM/dd/yyyy")),
                          "day"
                        ) === "begin"
                          ? "10px"
                          : "",
                      borderTopLeftRadius:
                        getDataStatus(
                          data,
                          new Date(format(day, "MM/dd/yyyy")),
                          "day"
                        ) === "begin"
                          ? "10px"
                          : "",
                      borderTopRightRadius:
                        //getFieldData(data, "end") === "" ||
                        getDataStatus(
                          data,
                          new Date(format(day, "MM/dd/yyyy")),
                          "day"
                        ) === "end"
                          ? "10px"
                          : "",
                      borderBottomRightRadius:
                        //getFieldData(data, "end") === "" ||
                        getDataStatus(
                          data,
                          new Date(format(day, "MM/dd/yyyy")),
                          "day"
                        ) === "end"
                          ? "10px"
                          : "",
                      textTransform: "capitalize",
                      backgroundColor:
                        getFieldData(data, "end") === "" && false
                          ? theme.palette.palette_style.background.calendarItem
                          : getFieldData(data, "color") === ""
                          ? theme.palette.palette_style.background.calendarItem
                          : getFieldData(data, "color"),
                      height: "23px",
                      marginTop: calculateOrderPosition(data, day, index)
                    }}
                    className="edit_row"
                  >
                    {getDataStatus(
                      data,
                      new Date(format(day, "MM/dd/yyyy")),
                      "day"
                    ) === "begin" && (
                      <>
                        {getFieldData(data, "end") === "" && false && (
                          <Box
                            sx={{
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              backgroundColor:
                                getFieldData(data, "color") || "#FFB7B7",
                              marginTop: 0.6,
                              marginRight: 0.5,
                            }}
                            className="edit_row"
                          ></Box>
                        )}
                        {getFieldData(data, "end") === "" && (
                          <Box className="edit_row" sx={{ marginLeft: 0.5 }}>
                            {getFieldData(data, "begin").split(" ")[1]}
                          </Box>
                        )}
                        <Box className="edit_row" sx={{ marginLeft: 0.5 }}>
                          {getFieldData(data, "title")}
                        </Box>
                      </>
                    )}
                  </Box>
                </Box>
              )
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default MonthlyView;
