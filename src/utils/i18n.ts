import { parse } from "cookie";
import { TranslationKeyType } from "src/enums/SharedEnums";
import { isSucc } from "src/models/ApiResponse";
import { Language } from "src/models/Language";
import { TranslationText } from "src/models/SharedModels";
import { translationTextService } from "flexlists-api";

export const getTranslation = (
  key: string,
  translations: TranslationText[]
) => {
  if (!key || typeof key !== "string") {
    return key;
  }

  let translation: string = key;
  if (!translations || translations.length == 0) {
    return translation;
  }
  var translationText = translations.find(
    (item: any) => item.translationKey == key
  );
  if (translationText) {
    switch (translationText.translationKeyType) {
      case TranslationKeyType.Text:
      case TranslationKeyType.Html:
      case TranslationKeyType.Markdown:
        translation = translationText.translation;
        break;
      case TranslationKeyType.Image:
        translation = translationText.translation
          ? `${
              process.env.NEXT_PUBLIC_FLEXLIST_CMS_API ??
              process.env.NEXT_PUBLIC_FLEXLIST_API_URL ??
              ""
            }/api/contentManagement/downloadFile?id=${
              translationText.translation
            }`
          : "";
        break;
      default:
        translation = translationText.translation;
        break;
    }
  } else {
    // So this key is not here, let's get the page name:
    const pageName = translations.find(
      (item: any) => item.translationKey == "___pageName"
    );

    // warning ; we don't need to await this... we don't care about the
    // result or anything
    if (process.env.NEXT_PUBLIC_CMS_ADD_MISSING === "true") {
      setTimeout(async () => {
        await translationTextService.putMissingTranslation(
          pageName!.translation,
          key
        );
      }, 1);
    }

    // add the key to the translations, so it won't keep posting , thank you
    translations.push({
      translationKey: key,
      translation: key,
      translationKeyType: TranslationKeyType.Text,
    } as TranslationText);
    return key;
  }

  // if (translation?.trim().length === 0) {
  //   return key;
  // }

  return translation;
};

let whatnot: { [key: string]: string } = {};
export const getTranslations = async (
  pageName: string,
  context: any
): Promise<any> => {
  const { req } = context;
  const cookies = parse(req.headers.cookie || "");
  const language = cookies.language;

  const key = `${pageName}_${language}`;
  if (whatnot[key]) {
    return whatnot[key];
  }
  let translations: any[] = [];
  try {
    const response = await translationTextService.getTranslationTexts(
      language ?? "en-Us",
      pageName
    );
    if (isSucc(response) && response.data && response.data.length > 0) {
      translations = response.data;
    }
    // TODO: this is an internal hack because we need to know what
    // page we are to report missing pages
    translations.push({
      translationKey: "___pageName",
      translation: pageName,
    });
    // Pass data to the page via props
    return { props: { translations } };
  } catch (error) {
    console.log("error", error);
    return { props: { translations } };
  }
  return { props: { translations } };
};
