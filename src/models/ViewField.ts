import { Field } from "./SharedModels"

export type ViewField = Field & {
    viewFieldColor?: string,
    viewFieldName?: string,
    viewFieldVisible?: boolean
    viewFieldOrdering?: number
    viewFieldDetailsOnly?: boolean
}