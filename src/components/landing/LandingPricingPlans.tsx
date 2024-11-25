import { useState } from "react";
import { Icon } from "@iconify/react";
import checkmarkFill from "@iconify/icons-eva/checkmark-fill";
import { useTheme, styled } from "@mui/material/styles";
import {
  Box,
  Grid,
  Card,
  Stack,
  Switch,
  Button,
  Divider,
  Container,
  Typography,
} from "@mui/material";
import {
  varFadeInUp,
  MotionInView,
  varFadeInDown,
} from "src/components/animate";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { isNumber } from "src/utils/validateUtils";
import { UserProfile } from "src/models/UserProfile";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import { SubscriptionDto } from "src/models/SubscriptionDto";
import { useRouter } from "next/router";
import { PATH_AUTH } from "src/routes/paths";
import { subscriptionService } from "flexlists-api";
import { FlexlistsError, isSucc } from "src/utils/responses";
import { getStripe } from "src/utils/stripe";
import { setReturnUrl } from "src/redux/actions/adminAction";
import { setFlashMessage } from "src/redux/actions/authAction";
import { connect } from "react-redux";

const RootStyle = styled("div")(({ theme }) => ({
  position: "relative",
  // color: "white",
  // background: "linear-gradient(294.81deg, #3A7EC5 -87.58%, #54A6FB 89.78%)",
  paddingTop: theme.spacing(5),
  paddingBottom: theme.spacing(5),
  [theme.breakpoints.up("md")]: {
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(15),
  },
}));

type LandingPricingPlansProps = {
  translations: TranslationText[];
  isExisting?: boolean;
  openComparison: () => void;
  userProfile: UserProfile | undefined;
  setReturnUrl: (returnUrl: any) => void;
  setFlashMessage: (message: FlashMessageModel) => void;
  userSubscription: SubscriptionDto | undefined;
};
enum PeriodType {
  Monthly,
  Yearly,
}
enum PlanId {
  Free = 0,
  PremiumMonthly = 1,
  PremiumYearly = 3,
  EnterpriseMonthly = 2,
  EnterpriseYearly = 4,
  ExistingPremiumMonthly = 5,
  ExistingPremiumYearly = 7,
  ExistingEnterpriseMonthly = 6,
  ExistingEnterpriseYearly = 8,
}

const LandingPricingPlans = ({
  translations,
  isExisting,
  openComparison,
  userProfile,
  setReturnUrl,
  setFlashMessage,
  userSubscription,
}: LandingPricingPlansProps) => {
  const router = useRouter();
  const t = (key: string): string => {
    if (!translations) return key;
    return getTranslation(key, translations);
  };

  const [isYearly, setIsYearly] = useState(false);

  const handleSwitchChange = () => {
    setIsYearly((prevIsYearly) => !prevIsYearly);
  };
  const plans = [
    {
      id: PlanId.Free,
      name: t("Free"),
      description: t("Beginner Plan"),
      price: 0,
      features: [
        t("Unlimited Lists"),
        t("Unlimited Rows"),
        t("5 Editors"),
        t("3GB Storage"),
      ],
    },
    {
      id: PlanId.PremiumMonthly,
      name: t("Premium"),
      description: t("Free read/comment users"),
      price: 6,
      periodType: PeriodType.Monthly,
      features: [
        t("3 month trial"),
        t("Unlimited Lists"),
        t("Unlimited Rows"),
        t("6GB Storage"),
      ],
    },
    {
      id: PlanId.PremiumYearly,
      name: t("Premium"),
      description: t("Free read/comment users"),
      price: 60,
      periodType: PeriodType.Yearly,
      features: [
        t("3 month trial"),
        t("Unlimited Lists"),
        t("Unlimited Rows"),
        t("6GB Storage"),
      ],
    },
    {
      id: PlanId.EnterpriseMonthly,
      name: t("Enterprise"),
      description: t("Flat Fee Plan"),
      price: 240,
      periodType: PeriodType.Monthly,
      features: [
        t("Unlimited Users"),
        t("Unlimited Lists"),
        t("Unlimited Rows"),
        t("250GB+250GB Storage"),
      ],
    },
    {
      id: PlanId.EnterpriseYearly,
      name: t("Enterprise"),
      description: t("Flat Fee Plan"),
      price: 2400,
      periodType: PeriodType.Yearly,
      features: [
        t("Unlimited Users"),
        t("Unlimited Lists"),
        t("Unlimited Rows"),
        t("250GB+250GB Storage"),
      ],
    },
    {
      id: PlanId.ExistingPremiumMonthly,
      name: t("Premium"),
      description: t("Premium Plan"),
      price: 4,
      isExisting: true,
      periodType: PeriodType.Monthly,
      features: [
        t("3 month trial"),
        t("Unlimited Lists"),
        t("Unlimited Rows"),
        t("6GB Storage"),
      ],
    },
    {
      id: PlanId.ExistingPremiumYearly,
      name: t("Premium"),
      description: t("Premium Plan"),
      price: 40,
      isExisting: true,
      periodType: PeriodType.Yearly,
      features: [
        t("3 month trial"),
        t("Unlimited Lists"),
        t("Unlimited Rows"),
        t("6GB Storage"),
      ],
    },
    {
      id: PlanId.ExistingEnterpriseMonthly,
      name: t("Enterprise"),
      description: t("Flat Fee Plan"),
      price: 160,
      isExisting: true,
      periodType: PeriodType.Monthly,
      features: [
        t("Unlimited Users"),
        t("Unlimited Lists"),
        t("Unlimited Rows"),
        t("250GB+250GB Storage"),
      ],
    },
    {
      id: PlanId.ExistingEnterpriseYearly,
      name: t("Enterprise"),
      description: t("Flat Fee Plan"),
      price: 1600,
      isExisting: true,
      periodType: PeriodType.Yearly,
      features: [
        t("Unlimited Users"),
        t("Unlimited Lists"),
        t("Unlimited Rows"),
        t("250GB+250GB Storage"),
      ],
    },
  ];

  const onSubmit = async (subscriptionId: number) => {
    if (subscriptionId === PlanId.Free) {
      await router.push({ pathname: PATH_AUTH.register });
      return;
    }
    if (!userProfile) {
      setReturnUrl({
        pathname: router.pathname,
        query: { ...router.query, subscriptionId: subscriptionId },
      });
      await router.push({ pathname: PATH_AUTH.login });
      return;
    }
    let createCheckOut = await subscriptionService.createPaymentCheckoutSession(
      subscriptionId
    );
    if (isSucc(createCheckOut)) {
      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId: createCheckOut.data.sessionId });
    } else {
      setFlashMessage({
        message: (createCheckOut as FlexlistsError).message,
        type: "error",
      });
    }
  };
  const getSubmitText = (plan: any) => {
    if (plan.price === 0) {
      return t("Sign Up");
    }

    if (userProfile && userSubscription?.subscriptionId === plan.id) {
      return t("Current Plan");
    }

    return t("Get Started");
  };
  const getPriceDescription = (plan: any) => {
    if (plan.price === 0) {
      return `$0`;
    }
    if (isNumber(plan.price) && plan.periodType === PeriodType.Monthly) {
      console.log(plan.id.toString());
      if (
        plan.id === PlanId.PremiumMonthly ||
        plan.id === PlanId.PremiumYearly ||
        plan.id === PlanId.ExistingPremiumMonthly ||
        plan.id === PlanId.ExistingPremiumYearly
      ) {
        return `$${plan.price}/person/month`;
      }
      return `$${plan.price}/month`;
    }
    if (isNumber(plan.price) && plan.periodType === PeriodType.Yearly) {
      if (
        plan.id === PlanId.PremiumMonthly ||
        plan.id === PlanId.PremiumYearly ||
        plan.id === PlanId.ExistingPremiumMonthly ||
        plan.id === PlanId.ExistingPremiumYearly
      ) {
        return `$${plan.price}/person/year`;
      }
      return `$${plan.price}/year`;
    }
    return plan.price;
  };
  const isDisableCommitButton = (plan: any) => {
    return (
      (userProfile && plan.id === PlanId.Free) ||
      (userProfile &&
        userSubscription &&
        userSubscription.subscriptionId === plan.id)
    );
  };
  const PlanCard = ({ plan, userSubscription, userProfile }: any) => {
    //console.log("xxxx", plan);
    const theme = useTheme();
    return (
      <Card
        sx={{
          p: 5,
          // boxShadow: (theme) =>
          //   `0px 48px 80px ${alpha(
          //     isLight ? theme.palette.grey[500] : theme.palette.common.black,
          //     0.12
          //   )}`,
          // ...(cardIndex === 1 && {
          //   boxShadow: (theme) =>
          //     `0px 48px 80px ${alpha(
          //       isLight ? theme.palette.grey[500] : theme.palette.common.black,
          //       0.48
          //     )}`,
          // }),
          borderTop:
            theme.palette.mode === "light"
              ? "8px solid #003249"
              : `8px solid ${theme.palette.palette_style.text.selected}`,
          background: theme.palette.palette_style.background.paper,
        }}
      >
        <Stack spacing={5}>
          <Stack spacing={2.5}>
            <div>
              <Typography variant="h4">{plan.name}</Typography>
              <Typography
                variant="overline"
                sx={{ mb: 2, color: "text.disabled", display: "block" }}
              >
                {plan.description}
              </Typography>
            </div>
            <Divider sx={{ borderStyle: "solid", my: 3 }} />
            <Typography variant="h4">{getPriceDescription(plan)}</Typography>

            <Divider sx={{ borderStyle: "solid", my: 3 }} />
            {plan.features.map((f: string, index: number) => (
              <Stack
                key={index}
                spacing={1.5}
                direction="row"
                alignItems="center"
              >
                <Box
                  component={Icon}
                  icon={checkmarkFill}
                  sx={{ color: "primary.main", width: 20, height: 20 }}
                />
                <Typography variant="body2">{f}</Typography>
              </Stack>
            ))}
          </Stack>

          <Button
            size="large"
            fullWidth
            variant={"contained"}
            onClick={() => onSubmit(plan.id)}
            disabled={isDisableCommitButton(plan)}
            // sx={{ background: "#003249" }}
          >
            {getSubmitText(plan)}
          </Button>
          {/* {
            plan.price !== 0 &&
            <Typography variant="body1" textAlign={"center"}>or try it for <Link href="/auth/register">FREE</Link></Typography>
          }
          {
             plan.price === 0 &&
             <Typography variant="body1" textAlign={"center"}>.</Typography>
          } */}
        </Stack>
      </Card>
    );
  };
  return (
    <RootStyle>
      {/* <PriceImgStyle
        alt="overlay"
        src="/assets/home/pricingstyle.png"
        variants={varFadeInUp}
      /> */}
      <Container maxWidth="xl">
        <Box
          sx={{ margin: "auto", my: 10, textAlign: "center", maxWidth: 650 }}
        >
          <MotionInView variants={varFadeInUp}>
            <Typography component="p" variant="overline" sx={{ mb: 2 }}>
              {t("Pricing")}
            </Typography>
          </MotionInView>
          <MotionInView variants={varFadeInDown}>
            <Typography variant="h2" sx={{ mb: 3 }}>
              {t("Pricing Title")}
            </Typography>
          </MotionInView>
          <MotionInView variants={varFadeInDown}>
            <Typography>{t("Pricing Description")}</Typography>
          </MotionInView>
        </Box>
        <Box sx={{ background: "rgba(84, 166, 251,0.1)", py: 4, px: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              pb: 4,
            }}
          >
            Yearly (save 17%)
            <Switch
              onChange={handleSwitchChange}
              checked={!isYearly}
              color="default"
            />
            Monthly
          </Box>
          <Grid container spacing={5} sx={{ justifyContent: "center" }}>
            {plans
              .filter((x: any) => {
                if (
                  isYearly &&
                  x.periodType === PeriodType.Yearly &&
                  x.isExisting === isExisting
                )
                  return true;
                if (
                  !isYearly &&
                  x.periodType === PeriodType.Monthly &&
                  x.isExisting === isExisting
                )
                  return true;
                if (x.periodType === undefined) return true;
              })
              .map((plan, index) => (
                <Grid key={index} item xs={12} md={3}>
                  <PlanCard plan={plan} isYearly={isYearly} />
                </Grid>
              ))}
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 4,
            }}
          >
            <Button variant="outlined" size="large" onClick={openComparison}>
              {t("Compare plans")}
            </Button>
          </Box>
        </Box>
      </Container>
    </RootStyle>
  );
};
const mapStateToProps = (state: any) => ({
  userProfile: state.user.userProfile,
  userSubscription: state.user.userSubscription,
});

const mapDispatchToProps = {
  setReturnUrl,
  setFlashMessage,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LandingPricingPlans);
