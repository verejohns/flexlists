import { FlexlistsError, FlexlistsSuccess, isErr, isSucc, Errors } from 'src/utils/responses'

// now export these so it's backward compatible
export {
    FlexlistsError, FlexlistsSuccess, isErr, isSucc, Errors
}


// export function isErr(x: any): x is FlexlistsError {
//     return typeof x === 'object' && x != null && !(x as any).isSuccess
// }

// export function isSucc(x: any): x is FlexlistsSuccess {
//     return typeof x === 'object' && x != null && (x as any).isSuccess
// }

// export type FlexlistsError = {
//      isSuccess : boolean
//      message: string
//      code: number
//      data: any
//      trace: string
// }

// export type FlexlistsSuccess<T = any> =  {
//     isSuccess : boolean
//     message: string 
//     data: T | undefined
// }