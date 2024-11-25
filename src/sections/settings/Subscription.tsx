import { Button, Box, Grid } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { connect } from "react-redux";
import YesNoDialog from "src/components/dialog/YesNoDialog";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import { TranslationText } from "src/models/SharedModels";
import {
  SubscriptionDto,
  SubscriptionStatus,
} from "src/models/SubscriptionDto";
import { UserProfile } from "src/models/UserProfile";
import { setFlashMessage } from "src/redux/actions/authAction";
import { setUserSubscription } from "src/redux/actions/userActions";
import { ROOT_PATH } from "src/routes/paths";
import { subscriptionService } from "flexlists-api";
import { getLocalDateTimeFromString } from "src/utils/convertUtils";
import { getTranslation } from "src/utils/i18n";
import { FlexlistsError, isSucc } from "src/utils/responses";

type ProfileSettingProps = {
  userSubscription: SubscriptionDto | undefined;
  translations: TranslationText[];
  userProfile: UserProfile | undefined;
  setFlashMessage: (mesage: FlashMessageModel) => void;
  setUserSubscription: (subscription: SubscriptionDto | undefined) => void;
};

const Subscription = ({
  userSubscription,
  translations,
  userProfile,
  setFlashMessage,
  setUserSubscription,
}: ProfileSettingProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const router = useRouter();
  const [openCancelSubscriptionDialog, setOpenCancelSubscriptionDialog] =
    useState(false);

  const onAddSubscription = async () => {
    router.push({
      pathname: userProfile?.isLegacyUser
        ? ROOT_PATH.existingPricing
        : ROOT_PATH.pricing,
    });
  };

  const onUpdateSubscription = async () => {
    router.push({
      pathname: userProfile?.isLegacyUser
        ? ROOT_PATH.existingPricing
        : ROOT_PATH.pricing,
    });
  };

  const cancelSubscription = async () => {
    if (
      userSubscription &&
      userSubscription.status !== SubscriptionStatus.Cancel
    ) {
      const cancelSubscriptionResponse =
        await subscriptionService.cancelUserSubscription(userSubscription?.id);

      if (isSucc(cancelSubscriptionResponse)) {
        let newSubscription = Object.assign({}, userSubscription);
        newSubscription.status = SubscriptionStatus.Cancel;
        newSubscription.cancelDate = new Date();

        setUserSubscription(newSubscription);
        setFlashMessage({
          type: "success",
          message: "Subscription cancelled successfully.",
        });
      } else {
        setFlashMessage({
          type: "error",
          message: (cancelSubscriptionResponse as FlexlistsError).message,
        });
      }
    }
  };

  return (
    <>
      <Box mt={4}>
        <Grid container alignItems={"center"}>
          <Grid item xs={12} md={8}>
            {userSubscription
              ? userSubscription.status !== SubscriptionStatus.Cancel
                ? `You are currently on the ${userSubscription?.name}($${
                    userSubscription?.price
                  }) plan. 
                start date: ${getLocalDateTimeFromString(
                  userSubscription?.startDate?.toString()
                )} end date: ${getLocalDateTimeFromString(
                    userSubscription?.endDate?.toString()
                  )}`
                : `You have cancelled your subscription ${
                    userSubscription?.cancelDate
                      ? `at ${getLocalDateTimeFromString(
                          userSubscription?.startDate?.toString()
                        )}`
                      : ""
                  }, however you still can use this plan until ${getLocalDateTimeFromString(
                    userSubscription?.endDate?.toString()
                  )}.`
              : "You are not currently subscribed to any plan."}
          </Grid>

          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: "flex",
              justifyContent: { xs: "flex-start", md: "flex-end" },
              alignItems: "center",
              mt: { xs: 1, md: 0 },
            }}
          >
            {/* <Button
              sx={{ mt: 2 ,mr:2}}
              variant="contained"
              onClick={() => {
        
              }}
            >
              Edit Payment Method
            </Button> */}
            {userSubscription &&
            userSubscription.status !== SubscriptionStatus.Cancel ? (
              <Button
                // sx={{ mt: 2 ,mr:2}}
                variant="contained"
                onClick={() => {
                  onUpdateSubscription();
                }}
              >
                {t("Update plan")}
              </Button>
            ) : (
              <Button
                // sx={{ mt: 2 ,mr:2}}
                variant="contained"
                onClick={() => {
                  onAddSubscription();
                }}
              >
                {t("Upgrade plan")}
              </Button>
            )}
            {userSubscription &&
              userSubscription.status !== SubscriptionStatus.Cancel && (
                <Button
                  // sx={{ mt: 2, mr: 2 }}
                  variant="contained"
                  onClick={() => {
                    setOpenCancelSubscriptionDialog(true);
                  }}
                >
                  {t("Cancel Plan")}
                </Button>
              )}
          </Grid>
        </Grid>
        {/* <Grid container spacing={2}>
          <Grid item xs={8} sm={8}>
          </Grid>

        </Grid> */}
      </Box>
      <YesNoDialog
        title={t("Cancel Subscription")}
        submitText={t("Cancel")}
        message={t("Are you sure you want to cancel your subscription?")}
        open={openCancelSubscriptionDialog}
        translations={translations}
        handleClose={() => setOpenCancelSubscriptionDialog(false)}
        onSubmit={cancelSubscription}
      />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  userSubscription: state.user.userSubscription,
  userProfile: state.user.userProfile,
});

const mapDispatchToProps = {
  setFlashMessage,
  setUserSubscription,
};

export default connect(mapStateToProps, mapDispatchToProps)(Subscription);
