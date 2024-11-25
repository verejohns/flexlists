import { TranslationKeyType } from "src/enums/SharedEnums";

export type ContentManagementTranslationKeyDto = {  
    id: number,
    name: string,
    type: TranslationKeyType,
    contentManagementId: number,
    config?: any
}