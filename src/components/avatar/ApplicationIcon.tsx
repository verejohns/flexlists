import { Box } from '@mui/material';
import { downloadFileUrl } from "src/utils/flexlistHelper";
import { useTheme } from "@mui/material/styles";

type ApplicationIconProps = {
  application: any;
  size: number;
};

const ApplicationIcon = (props: ApplicationIconProps) => {
  const { application, size } = props;
  const theme = useTheme();

  return (
    application.icon ? <Box
      component="img"
      src={downloadFileUrl(application.icon)}
      sx={{
        width: size,
        height: size,
        borderRadius: 50,
        backgroundColor: application.color || theme.palette.palette_style.background.calendarItem,
        color: theme.palette.palette_style.text.white,
        cursor: "pointer",
      }}
    /> :
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: 50,
        backgroundColor: application.color || theme.palette.palette_style.background.calendarItem,
        color: theme.palette.palette_style.text.white,
        cursor: "pointer",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textTransform: 'uppercase',
        fontSize: 18
      }}
    >
      {application.name.charAt(0)}
    </Box>
  );
};

export default ApplicationIcon;
