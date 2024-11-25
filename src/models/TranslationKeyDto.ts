import { TranslationKeyType } from "src/enums/SharedEnums"

export type TranslationKeyDto = {
    id: number,
    name: string,
    type: TranslationKeyType,
    contentManagementId: number,
    config?: any,
    reusable: boolean
}