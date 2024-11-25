import * as React from "react";

import {
  Box,
  Typography,
  Tabs,
  Tab,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";

// ICONS----------------------------------------------
import SettingsIcon from "@mui/icons-material/Settings";
import CookieIcon from "@mui/icons-material/Cookie";
import HandshakeIcon from "@mui/icons-material/Handshake";
import GavelIcon from "@mui/icons-material/Gavel";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import GradingIcon from "@mui/icons-material/Grading";
import PaymentIcon from "@mui/icons-material/Payment";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      style={{ width: "100%", overflowY: "scroll" }}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles({
  hideLabelOnMobile: {
    "& .MuiTab-wrapper": {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  },
});

export default function TermsTabs() {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        display: "flex",
        height: "100%",
        width: "100%",
        overflow: "scroll",
      }}
    >
      {/* <Tabs
        orientation="vertical"
        variant="scrollable"
        scrollButtons={false}
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{
          borderRight: 1,
          borderColor: "divider",
          maxHeight: "100%",
          width: { xs: "15%", md: "25%" },
          alignItems: "center",
        }}
      >
        <Tab
          label={isMobile ? "" : "General Terms"}
          className={isMobile ? classes.hideLabelOnMobile : ""}
          {...a11yProps(0)}
          icon={<SettingsIcon sx={{ mr: { xs: 0, md: 1 } }} />}
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: { xs: "center", md: "flex-start" },

            py: { xs: 3, md: 2 },
            px: { xs: 1, md: 2 },
          }}
        />
        <Tab
          label={isMobile ? "" : "Cookies"}
          className={isMobile ? classes.hideLabelOnMobile : ""}
          {...a11yProps(1)}
          icon={<CookieIcon sx={{ mr: { xs: 0, md: 1 } }} />}
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: { xs: "center", md: "flex-start" },
            py: { xs: 3, md: 2 },
            px: { xs: 1, md: 2 },
          }}
        />

        <Tab
          label={isMobile ? "" : "Acceptance of Terms"}
          className={isMobile ? classes.hideLabelOnMobile : ""}
          {...a11yProps(2)}
          icon={<GradingIcon sx={{ mr: { xs: 0, md: 1 } }} />}
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: { xs: "center", md: "flex-start" },

            py: { xs: 3, md: 2 },
            px: { xs: 1, md: 2 },
          }}
        />
        <Tab
          label={isMobile ? "" : "User Obligations"}
          className={isMobile ? classes.hideLabelOnMobile : ""}
          {...a11yProps(3)}
          icon={<HandshakeIcon sx={{ mr: { xs: 0, md: 1 } }} />}
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: { xs: "center", md: "flex-start" },

            py: { xs: 3, md: 2 },
            px: { xs: 1, md: 2 },
          }}
        />
        <Tab
          label={isMobile ? "" : "Intellectual Property Rights"}
          className={isMobile ? classes.hideLabelOnMobile : ""}
          {...a11yProps(4)}
          icon={<GavelIcon sx={{ mr: { xs: 0, md: 1 } }} />}
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: { xs: "center", md: "flex-start" },

            py: { xs: 3, md: 2 },
            px: { xs: 1, md: 2 },
          }}
        />
        <Tab
          label={isMobile ? "" : "Privacy and Data Collection"}
          className={isMobile ? classes.hideLabelOnMobile : ""}
          {...a11yProps(5)}
          icon={<PrivacyTipIcon sx={{ mr: { xs: 0, md: 1 } }} />}
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: { xs: "center", md: "flex-start" },

            py: { xs: 3, md: 2 },
            px: { xs: 1, md: 2 },
          }}
        />
        <Tab
          label={isMobile ? "" : "Payment Terms"}
          className={isMobile ? classes.hideLabelOnMobile : ""}
          {...a11yProps(6)}
          icon={<PaymentIcon sx={{ mr: { xs: 0, md: 1 } }} />}
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: { xs: "center", md: "flex-start" },

            py: { xs: 3, md: 2 },
            px: { xs: 1, md: 2 },
          }}
        />
      </Tabs> */}
      <TabPanel value={value} index={0}>
        <Typography variant="h4">General Terms</Typography>
        <Divider light sx={{ my: 4 }}></Divider>
        <Box className="term-wrapper" mt={4}>
          <Box mt={4}>
            <Typography variant="h5">Introduction</Typography>
          </Box>
          <Box mt={2}>
            Welcome to Flexlists.com! These terms and conditions outline the
            rules and regulations for the use of Flexlists.com&apos;s services.
            Flexlists.com is an Appsalad Pvt Australia product.
          </Box>
        </Box>
        <Box className="term-wrapper" mt={4}>
          <Box mt={4}>
            <Typography variant="h5">Privacy and Data Protection</Typography>
          </Box>
          <Box mt={2}>
            <p>
              a. Data Usage: At Flexlists.com, we value your privacy and data
              security. We do not abuse your data in any form. Your data is used
              solely to provide and improve the services offered by
              Flexlists.com.
            </p>
            <p>
              b. No Resale of Data: We commit to not selling or reselling any
              user data collected through our platform. Your information is
              strictly for internal use and to enhance your user experience.
            </p>
            <p>
              c. No User Tracking: Flexlists.com does not engage in tracking
              users across third-party websites. Our goal is to respect your
              privacy and digital footprint.
            </p>
          </Box>
        </Box>
        <Box className="term-wrapper" mt={4}>
          <Box mt={4}>
            <Typography variant="h5">GDPR Compliance</Typography>
          </Box>
          <Box mt={2}>
            Flexlists.com is committed to compliance with the General Data
            Protection Regulation (GDPR). We adhere to the highest standards of
            data protection and privacy as outlined in this regulation.
            <p>
              a. User Rights: Under GDPR, users have the right to access,
              rectify, delete, and restrict processing of their personal data.
              Flexlists.com provides tools and settings to manage these rights
              effectively.
            </p>
            <p>
              b. Data Security: We implement robust security measures to protect
              your personal data from unauthorized access, alteration,
              disclosure, or destruction.
            </p>
          </Box>
        </Box>
        <Box className="term-wrapper" mt={4}>
          <Box mt={4}>
            <Typography variant="h5">User Responsibilities</Typography>
          </Box>
          <Box mt={2}>
            Users of Flexlists.com are expected to respect the terms of service,
            including not engaging in illegal activities, respecting the
            intellectual property rights of others, and adhering to our data
            usage policies.
          </Box>
        </Box>
        <Box className="term-wrapper" mt={4}>
          <Box mt={4}>
            <Typography variant="h5">Modification of Terms</Typography>
          </Box>
          <Box mt={2}>
            Flexlists.com reserves the right to modify these terms and
            conditions at any time. Users will be notified of significant
            changes and encouraged to review the updated terms periodically.
          </Box>
        </Box>
        <Box className="term-wrapper" mt={4}>
          <Box mt={4}>
            <Typography variant="h5">Governing Law</Typography>
          </Box>
          <Box mt={2}>
            These terms shall be governed by and construed in accordance with
            the laws of Australia (AU), without regard to its conflict of law
            provisions.
          </Box>
        </Box>
        <Box className="term-wrapper" mt={4}>
          <Box mt={4}>
            <Typography variant="h5">Contact Us</Typography>
          </Box>
          <Box mt={2}>
            For any questions or concerns regarding these terms and conditions,
            please contact us at legal@appsalad.com.
          </Box>
        </Box>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Typography variant="h4">Cookies</Typography>
        <Divider light sx={{ my: 4 }}></Divider>

        <Box className="term-wrapper" mt={4}>
          <Box mt={4}>
            <Typography variant="h5">Terms title</Typography>
          </Box>
          <Box mt={2}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima nemo
            molestiae fuga adipisci. At aspernatur soluta sed fugit assumenda,
            saepe possimus nobis voluptatem vel mollitia! Alias debitis
            accusamus perferendis odit in quo quaerat autem unde maiores velit.
            A porro recusandae repellendus eius, deleniti aperiam asperiores,
            excepturi, vitae accusamus voluptatibus blanditiis! Facilis expedita
            quod quisquam minima iste perferendis sequi quaerat officiis
            quibusdam corporis possimus dolor maiores minus cum quam esse
            aliquam aut deleniti, explicabo labore? Molestias similique, quos,
            perspiciatis facilis quidem alias vero tempora natus architecto
            eaque doloremque fuga, possimus iusto doloribus ea odio atque
            laboriosam optio culpa? Eligendi, explicabo ad!{" "}
          </Box>
        </Box>
        <Box className="term-wrapper" mt={4}>
          <Box mt={4}>
            <Typography variant="h5">Terms title</Typography>
          </Box>
          <Box mt={2}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima nemo
            molestiae fuga adipisci. At aspernatur soluta sed fugit assumenda,
            saepe possimus nobis voluptatem vel mollitia! Alias debitis
            accusamus perferendis odit in quo quaerat autem unde maiores velit.
            A porro recusandae repellendus eius, deleniti aperiam asperiores,
            excepturi, vitae accusamus voluptatibus blanditiis! Facilis expedita
            quod quisquam minima iste perferendis sequi quaerat officiis
            quibusdam corporis possimus dolor maiores minus cum quam esse
            aliquam aut deleniti, explicabo labore? Molestias similique, quos,
            perspiciatis facilis quidem alias vero tempora natus architecto
            eaque doloremque fuga, possimus iusto doloribus ea odio atque
            laboriosam optio culpa? Eligendi, explicabo ad!{" "}
          </Box>
        </Box>
        <Box className="term-wrapper" mt={4}>
          <Box mt={4}>
            <Typography variant="h5">Terms title</Typography>
          </Box>
          <Box mt={2}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima nemo
            molestiae fuga adipisci. At aspernatur soluta sed fugit assumenda,
            saepe possimus nobis voluptatem vel mollitia! Alias debitis
            accusamus perferendis odit in quo quaerat autem unde maiores velit.
            A porro recusandae repellendus eius, deleniti aperiam asperiores,
            excepturi, vitae accusamus voluptatibus blanditiis! Facilis expedita
            quod quisquam minima iste perferendis sequi quaerat officiis
            quibusdam corporis possimus dolor maiores minus cum quam esse
            aliquam aut deleniti, explicabo labore? Molestias similique, quos,
            perspiciatis facilis quidem alias vero tempora natus architecto
            eaque doloremque fuga, possimus iusto doloribus ea odio atque
            laboriosam optio culpa? Eligendi, explicabo ad!{" "}
          </Box>
        </Box>
        <Box className="term-wrapper" mt={4}>
          <Box mt={4}>
            <Typography variant="h5">Terms title</Typography>
          </Box>
          <Box mt={2}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima nemo
            molestiae fuga adipisci. At aspernatur soluta sed fugit assumenda,
            saepe possimus nobis voluptatem vel mollitia! Alias debitis
            accusamus perferendis odit in quo quaerat autem unde maiores velit.
            A porro recusandae repellendus eius, deleniti aperiam asperiores,
            excepturi, vitae accusamus voluptatibus blanditiis! Facilis expedita
            quod quisquam minima iste perferendis sequi quaerat officiis
            quibusdam corporis possimus dolor maiores minus cum quam esse
            aliquam aut deleniti, explicabo labore? Molestias similique, quos,
            perspiciatis facilis quidem alias vero tempora natus architecto
            eaque doloremque fuga, possimus iusto doloribus ea odio atque
            laboriosam optio culpa? Eligendi, explicabo ad!{" "}
          </Box>
        </Box>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Typography variant="h4">Acceptance of Terms</Typography>
        <Divider light sx={{ my: 4 }}></Divider>

        <Box className="term-wrapper" mt={4}>
          <Box mt={4}>
            <Typography variant="h5">Terms title</Typography>
          </Box>
          <Box mt={2}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima nemo
            molestiae fuga adipisci. At aspernatur soluta sed fugit assumenda,
            saepe possimus nobis voluptatem vel mollitia! Alias debitis
            accusamus perferendis odit in quo quaerat autem unde maiores velit.
            A porro recusandae repellendus eius, deleniti aperiam asperiores,
            excepturi, vitae accusamus voluptatibus blanditiis! Facilis expedita
            quod quisquam minima iste perferendis sequi quaerat officiis
            quibusdam corporis possimus dolor maiores minus cum quam esse
            aliquam aut deleniti, explicabo labore? Molestias similique, quos,
            perspiciatis facilis quidem alias vero tempora natus architecto
            eaque doloremque fuga, possimus iusto doloribus ea odio atque
            laboriosam optio culpa? Eligendi, explicabo ad!{" "}
          </Box>
        </Box>
        <Box className="term-wrapper" mt={4}>
          <Box mt={4}>
            <Typography variant="h5">Terms title</Typography>
          </Box>
          <Box mt={2}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima nemo
            molestiae fuga adipisci. At aspernatur soluta sed fugit assumenda,
            saepe possimus nobis voluptatem vel mollitia! Alias debitis
            accusamus perferendis odit in quo quaerat autem unde maiores velit.
            A porro recusandae repellendus eius, deleniti aperiam asperiores,
            excepturi, vitae accusamus voluptatibus blanditiis! Facilis expedita
            quod quisquam minima iste perferendis sequi quaerat officiis
            quibusdam corporis possimus dolor maiores minus cum quam esse
            aliquam aut deleniti, explicabo labore? Molestias similique, quos,
            perspiciatis facilis quidem alias vero tempora natus architecto
            eaque doloremque fuga, possimus iusto doloribus ea odio atque
            laboriosam optio culpa? Eligendi, explicabo ad!{" "}
          </Box>
        </Box>
        <Box className="term-wrapper" mt={4}>
          <Box mt={4}>
            <Typography variant="h5">Terms title</Typography>
          </Box>
          <Box mt={2}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima nemo
            molestiae fuga adipisci. At aspernatur soluta sed fugit assumenda,
            saepe possimus nobis voluptatem vel mollitia! Alias debitis
            accusamus perferendis odit in quo quaerat autem unde maiores velit.
            A porro recusandae repellendus eius, deleniti aperiam asperiores,
            excepturi, vitae accusamus voluptatibus blanditiis! Facilis expedita
            quod quisquam minima iste perferendis sequi quaerat officiis
            quibusdam corporis possimus dolor maiores minus cum quam esse
            aliquam aut deleniti, explicabo labore? Molestias similique, quos,
            perspiciatis facilis quidem alias vero tempora natus architecto
            eaque doloremque fuga, possimus iusto doloribus ea odio atque
            laboriosam optio culpa? Eligendi, explicabo ad!{" "}
          </Box>
        </Box>
        <Box className="term-wrapper" mt={4}>
          <Box mt={4}>
            <Typography variant="h5">Terms title</Typography>
          </Box>
          <Box mt={2}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima nemo
            molestiae fuga adipisci. At aspernatur soluta sed fugit assumenda,
            saepe possimus nobis voluptatem vel mollitia! Alias debitis
            accusamus perferendis odit in quo quaerat autem unde maiores velit.
            A porro recusandae repellendus eius, deleniti aperiam asperiores,
            excepturi, vitae accusamus voluptatibus blanditiis! Facilis expedita
            quod quisquam minima iste perferendis sequi quaerat officiis
            quibusdam corporis possimus dolor maiores minus cum quam esse
            aliquam aut deleniti, explicabo labore? Molestias similique, quos,
            perspiciatis facilis quidem alias vero tempora natus architecto
            eaque doloremque fuga, possimus iusto doloribus ea odio atque
            laboriosam optio culpa? Eligendi, explicabo ad!{" "}
          </Box>
        </Box>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Typography variant="h4">User Obligations</Typography>
        <Divider light sx={{ my: 4 }}></Divider>
        <Box className="term-wrapper" mt={4}>
          <Box mt={4}>
            <Typography variant="h5">Terms title</Typography>
          </Box>
          <Box mt={2}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima nemo
            molestiae fuga adipisci. At aspernatur soluta sed fugit assumenda,
            saepe possimus nobis voluptatem vel mollitia! Alias debitis
            accusamus perferendis odit in quo quaerat autem unde maiores velit.
            A porro recusandae repellendus eius, deleniti aperiam asperiores,
            excepturi, vitae accusamus voluptatibus blanditiis! Facilis expedita
            quod quisquam minima iste perferendis sequi quaerat officiis
            quibusdam corporis possimus dolor maiores minus cum quam esse
            aliquam aut deleniti, explicabo labore? Molestias similique, quos,
            perspiciatis facilis quidem alias vero tempora natus architecto
            eaque doloremque fuga, possimus iusto doloribus ea odio atque
            laboriosam optio culpa? Eligendi, explicabo ad!{" "}
          </Box>
        </Box>
        <Box className="term-wrapper" mt={4}>
          <Box mt={4}>
            <Typography variant="h5">Terms title</Typography>
          </Box>
          <Box mt={2}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima nemo
            molestiae fuga adipisci. At aspernatur soluta sed fugit assumenda,
            saepe possimus nobis voluptatem vel mollitia! Alias debitis
            accusamus perferendis odit in quo quaerat autem unde maiores velit.
            A porro recusandae repellendus eius, deleniti aperiam asperiores,
            excepturi, vitae accusamus voluptatibus blanditiis! Facilis expedita
            quod quisquam minima iste perferendis sequi quaerat officiis
            quibusdam corporis possimus dolor maiores minus cum quam esse
            aliquam aut deleniti, explicabo labore? Molestias similique, quos,
            perspiciatis facilis quidem alias vero tempora natus architecto
            eaque doloremque fuga, possimus iusto doloribus ea odio atque
            laboriosam optio culpa? Eligendi, explicabo ad!{" "}
          </Box>
        </Box>
        <Box className="term-wrapper" mt={4}>
          <Box mt={4}>
            <Typography variant="h5">Terms title</Typography>
          </Box>
          <Box mt={2}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima nemo
            molestiae fuga adipisci. At aspernatur soluta sed fugit assumenda,
            saepe possimus nobis voluptatem vel mollitia! Alias debitis
            accusamus perferendis odit in quo quaerat autem unde maiores velit.
            A porro recusandae repellendus eius, deleniti aperiam asperiores,
            excepturi, vitae accusamus voluptatibus blanditiis! Facilis expedita
            quod quisquam minima iste perferendis sequi quaerat officiis
            quibusdam corporis possimus dolor maiores minus cum quam esse
            aliquam aut deleniti, explicabo labore? Molestias similique, quos,
            perspiciatis facilis quidem alias vero tempora natus architecto
            eaque doloremque fuga, possimus iusto doloribus ea odio atque
            laboriosam optio culpa? Eligendi, explicabo ad!{" "}
          </Box>
        </Box>
        <Box className="term-wrapper" mt={4}>
          <Box mt={4}>
            <Typography variant="h5">Terms title</Typography>
          </Box>
          <Box mt={2}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima nemo
            molestiae fuga adipisci. At aspernatur soluta sed fugit assumenda,
            saepe possimus nobis voluptatem vel mollitia! Alias debitis
            accusamus perferendis odit in quo quaerat autem unde maiores velit.
            A porro recusandae repellendus eius, deleniti aperiam asperiores,
            excepturi, vitae accusamus voluptatibus blanditiis! Facilis expedita
            quod quisquam minima iste perferendis sequi quaerat officiis
            quibusdam corporis possimus dolor maiores minus cum quam esse
            aliquam aut deleniti, explicabo labore? Molestias similique, quos,
            perspiciatis facilis quidem alias vero tempora natus architecto
            eaque doloremque fuga, possimus iusto doloribus ea odio atque
            laboriosam optio culpa? Eligendi, explicabo ad!{" "}
          </Box>
        </Box>{" "}
      </TabPanel>
      <TabPanel value={value} index={4}>
        <Typography variant="h4">Intellectual Property rights</Typography>
        <Divider light sx={{ my: 4 }}></Divider>
        <Box className="term-wrapper" mt={4}>
          <Box mt={4}>
            <Typography variant="h5">Terms title</Typography>
          </Box>
          <Box mt={2}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima nemo
            molestiae fuga adipisci. At aspernatur soluta sed fugit assumenda,
            saepe possimus nobis voluptatem vel mollitia! Alias debitis
            accusamus perferendis odit in quo quaerat autem unde maiores velit.
            A porro recusandae repellendus eius, deleniti aperiam asperiores,
            excepturi, vitae accusamus voluptatibus blanditiis! Facilis expedita
            quod quisquam minima iste perferendis sequi quaerat officiis
            quibusdam corporis possimus dolor maiores minus cum quam esse
            aliquam aut deleniti, explicabo labore? Molestias similique, quos,
            perspiciatis facilis quidem alias vero tempora natus architecto
            eaque doloremque fuga, possimus iusto doloribus ea odio atque
            laboriosam optio culpa? Eligendi, explicabo ad!{" "}
          </Box>
        </Box>
        <Box className="term-wrapper" mt={4}>
          <Box mt={4}>
            <Typography variant="h5">Terms title</Typography>
          </Box>
          <Box mt={2}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima nemo
            molestiae fuga adipisci. At aspernatur soluta sed fugit assumenda,
            saepe possimus nobis voluptatem vel mollitia! Alias debitis
            accusamus perferendis odit in quo quaerat autem unde maiores velit.
            A porro recusandae repellendus eius, deleniti aperiam asperiores,
            excepturi, vitae accusamus voluptatibus blanditiis! Facilis expedita
            quod quisquam minima iste perferendis sequi quaerat officiis
            quibusdam corporis possimus dolor maiores minus cum quam esse
            aliquam aut deleniti, explicabo labore? Molestias similique, quos,
            perspiciatis facilis quidem alias vero tempora natus architecto
            eaque doloremque fuga, possimus iusto doloribus ea odio atque
            laboriosam optio culpa? Eligendi, explicabo ad!{" "}
          </Box>
        </Box>
        <Box className="term-wrapper" mt={4}>
          <Box mt={4}>
            <Typography variant="h5">Terms title</Typography>
          </Box>
          <Box mt={2}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima nemo
            molestiae fuga adipisci. At aspernatur soluta sed fugit assumenda,
            saepe possimus nobis voluptatem vel mollitia! Alias debitis
            accusamus perferendis odit in quo quaerat autem unde maiores velit.
            A porro recusandae repellendus eius, deleniti aperiam asperiores,
            excepturi, vitae accusamus voluptatibus blanditiis! Facilis expedita
            quod quisquam minima iste perferendis sequi quaerat officiis
            quibusdam corporis possimus dolor maiores minus cum quam esse
            aliquam aut deleniti, explicabo labore? Molestias similique, quos,
            perspiciatis facilis quidem alias vero tempora natus architecto
            eaque doloremque fuga, possimus iusto doloribus ea odio atque
            laboriosam optio culpa? Eligendi, explicabo ad!{" "}
          </Box>
        </Box>
        <Box className="term-wrapper" mt={4}>
          <Box mt={4}>
            <Typography variant="h5">Terms title</Typography>
          </Box>
          <Box mt={2}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima nemo
            molestiae fuga adipisci. At aspernatur soluta sed fugit assumenda,
            saepe possimus nobis voluptatem vel mollitia! Alias debitis
            accusamus perferendis odit in quo quaerat autem unde maiores velit.
            A porro recusandae repellendus eius, deleniti aperiam asperiores,
            excepturi, vitae accusamus voluptatibus blanditiis! Facilis expedita
            quod quisquam minima iste perferendis sequi quaerat officiis
            quibusdam corporis possimus dolor maiores minus cum quam esse
            aliquam aut deleniti, explicabo labore? Molestias similique, quos,
            perspiciatis facilis quidem alias vero tempora natus architecto
            eaque doloremque fuga, possimus iusto doloribus ea odio atque
            laboriosam optio culpa? Eligendi, explicabo ad!{" "}
          </Box>
        </Box>{" "}
      </TabPanel>
      <TabPanel value={value} index={5}>
        <Typography variant="h4">Privacy and Data collection</Typography>
        <Divider light sx={{ my: 4 }}></Divider>
        <Box className="term-wrapper" mt={4}>
          <Box mt={4}>
            <Typography variant="h5">Terms title</Typography>
          </Box>
          <Box mt={2}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima nemo
            molestiae fuga adipisci. At aspernatur soluta sed fugit assumenda,
            saepe possimus nobis voluptatem vel mollitia! Alias debitis
            accusamus perferendis odit in quo quaerat autem unde maiores velit.
            A porro recusandae repellendus eius, deleniti aperiam asperiores,
            excepturi, vitae accusamus voluptatibus blanditiis! Facilis expedita
            quod quisquam minima iste perferendis sequi quaerat officiis
            quibusdam corporis possimus dolor maiores minus cum quam esse
            aliquam aut deleniti, explicabo labore? Molestias similique, quos,
            perspiciatis facilis quidem alias vero tempora natus architecto
            eaque doloremque fuga, possimus iusto doloribus ea odio atque
            laboriosam optio culpa? Eligendi, explicabo ad!{" "}
          </Box>
        </Box>
        <Box className="term-wrapper" mt={4}>
          <Box mt={4}>
            <Typography variant="h5">Terms title</Typography>
          </Box>
          <Box mt={2}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima nemo
            molestiae fuga adipisci. At aspernatur soluta sed fugit assumenda,
            saepe possimus nobis voluptatem vel mollitia! Alias debitis
            accusamus perferendis odit in quo quaerat autem unde maiores velit.
            A porro recusandae repellendus eius, deleniti aperiam asperiores,
            excepturi, vitae accusamus voluptatibus blanditiis! Facilis expedita
            quod quisquam minima iste perferendis sequi quaerat officiis
            quibusdam corporis possimus dolor maiores minus cum quam esse
            aliquam aut deleniti, explicabo labore? Molestias similique, quos,
            perspiciatis facilis quidem alias vero tempora natus architecto
            eaque doloremque fuga, possimus iusto doloribus ea odio atque
            laboriosam optio culpa? Eligendi, explicabo ad!{" "}
          </Box>
        </Box>
        <Box className="term-wrapper" mt={4}>
          <Box mt={4}>
            <Typography variant="h5">Terms title</Typography>
          </Box>
          <Box mt={2}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima nemo
            molestiae fuga adipisci. At aspernatur soluta sed fugit assumenda,
            saepe possimus nobis voluptatem vel mollitia! Alias debitis
            accusamus perferendis odit in quo quaerat autem unde maiores velit.
            A porro recusandae repellendus eius, deleniti aperiam asperiores,
            excepturi, vitae accusamus voluptatibus blanditiis! Facilis expedita
            quod quisquam minima iste perferendis sequi quaerat officiis
            quibusdam corporis possimus dolor maiores minus cum quam esse
            aliquam aut deleniti, explicabo labore? Molestias similique, quos,
            perspiciatis facilis quidem alias vero tempora natus architecto
            eaque doloremque fuga, possimus iusto doloribus ea odio atque
            laboriosam optio culpa? Eligendi, explicabo ad!{" "}
          </Box>
        </Box>
        <Box className="term-wrapper" mt={4}>
          <Box mt={4}>
            <Typography variant="h5">Terms title</Typography>
          </Box>
          <Box mt={2}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima nemo
            molestiae fuga adipisci. At aspernatur soluta sed fugit assumenda,
            saepe possimus nobis voluptatem vel mollitia! Alias debitis
            accusamus perferendis odit in quo quaerat autem unde maiores velit.
            A porro recusandae repellendus eius, deleniti aperiam asperiores,
            excepturi, vitae accusamus voluptatibus blanditiis! Facilis expedita
            quod quisquam minima iste perferendis sequi quaerat officiis
            quibusdam corporis possimus dolor maiores minus cum quam esse
            aliquam aut deleniti, explicabo labore? Molestias similique, quos,
            perspiciatis facilis quidem alias vero tempora natus architecto
            eaque doloremque fuga, possimus iusto doloribus ea odio atque
            laboriosam optio culpa? Eligendi, explicabo ad!{" "}
          </Box>
        </Box>{" "}
      </TabPanel>
      <TabPanel value={value} index={6}>
        <Typography variant="h4">Payment terms</Typography>
        <Divider light sx={{ my: 4 }}></Divider>
        <Box className="term-wrapper" mt={4}>
          <Box mt={4}>
            <Typography variant="h5">Terms title</Typography>
          </Box>
          <Box mt={2}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima nemo
            molestiae fuga adipisci. At aspernatur soluta sed fugit assumenda,
            saepe possimus nobis voluptatem vel mollitia! Alias debitis
            accusamus perferendis odit in quo quaerat autem unde maiores velit.
            A porro recusandae repellendus eius, deleniti aperiam asperiores,
            excepturi, vitae accusamus voluptatibus blanditiis! Facilis expedita
            quod quisquam minima iste perferendis sequi quaerat officiis
            quibusdam corporis possimus dolor maiores minus cum quam esse
            aliquam aut deleniti, explicabo labore? Molestias similique, quos,
            perspiciatis facilis quidem alias vero tempora natus architecto
            eaque doloremque fuga, possimus iusto doloribus ea odio atque
            laboriosam optio culpa? Eligendi, explicabo ad!{" "}
          </Box>
        </Box>
        <Box className="term-wrapper" mt={4}>
          <Box mt={4}>
            <Typography variant="h5">Terms title</Typography>
          </Box>
          <Box mt={2}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima nemo
            molestiae fuga adipisci. At aspernatur soluta sed fugit assumenda,
            saepe possimus nobis voluptatem vel mollitia! Alias debitis
            accusamus perferendis odit in quo quaerat autem unde maiores velit.
            A porro recusandae repellendus eius, deleniti aperiam asperiores,
            excepturi, vitae accusamus voluptatibus blanditiis! Facilis expedita
            quod quisquam minima iste perferendis sequi quaerat officiis
            quibusdam corporis possimus dolor maiores minus cum quam esse
            aliquam aut deleniti, explicabo labore? Molestias similique, quos,
            perspiciatis facilis quidem alias vero tempora natus architecto
            eaque doloremque fuga, possimus iusto doloribus ea odio atque
            laboriosam optio culpa? Eligendi, explicabo ad!{" "}
          </Box>
        </Box>
        <Box className="term-wrapper" mt={4}>
          <Box mt={4}>
            <Typography variant="h5">Terms title</Typography>
          </Box>
          <Box mt={2}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima nemo
            molestiae fuga adipisci. At aspernatur soluta sed fugit assumenda,
            saepe possimus nobis voluptatem vel mollitia! Alias debitis
            accusamus perferendis odit in quo quaerat autem unde maiores velit.
            A porro recusandae repellendus eius, deleniti aperiam asperiores,
            excepturi, vitae accusamus voluptatibus blanditiis! Facilis expedita
            quod quisquam minima iste perferendis sequi quaerat officiis
            quibusdam corporis possimus dolor maiores minus cum quam esse
            aliquam aut deleniti, explicabo labore? Molestias similique, quos,
            perspiciatis facilis quidem alias vero tempora natus architecto
            eaque doloremque fuga, possimus iusto doloribus ea odio atque
            laboriosam optio culpa? Eligendi, explicabo ad!{" "}
          </Box>
        </Box>
        <Box className="term-wrapper" mt={4}>
          <Box mt={4}>
            <Typography variant="h5">Terms title</Typography>
          </Box>
          <Box mt={2}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima nemo
            molestiae fuga adipisci. At aspernatur soluta sed fugit assumenda,
            saepe possimus nobis voluptatem vel mollitia! Alias debitis
            accusamus perferendis odit in quo quaerat autem unde maiores velit.
            A porro recusandae repellendus eius, deleniti aperiam asperiores,
            excepturi, vitae accusamus voluptatibus blanditiis! Facilis expedita
            quod quisquam minima iste perferendis sequi quaerat officiis
            quibusdam corporis possimus dolor maiores minus cum quam esse
            aliquam aut deleniti, explicabo labore? Molestias similique, quos,
            perspiciatis facilis quidem alias vero tempora natus architecto
            eaque doloremque fuga, possimus iusto doloribus ea odio atque
            laboriosam optio culpa? Eligendi, explicabo ad!{" "}
          </Box>
        </Box>{" "}
      </TabPanel>
    </Box>
  );
}
