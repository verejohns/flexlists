import { FlashMessageModel } from 'src/models/FlashMessageModel';
// Define the actions

export type LegacyCredentials = {
    username: string,
    password: string,
    email: string,
    legacyId: number,
    session: string,
    lists: any[]
}

export const setLegacyCredentials: any = (credentials: LegacyCredentials) => ({
    type: 'SET_LEGACY_CREDENTIALS',
    payload: credentials
})

export const setMessage = (message: any) => ({
    type: 'SET_MESSAGE',
    payload: message
});
export const setFlashMessage = (message: FlashMessageModel|undefined) => ({
    type: 'SET_FLASH_MESSAGE',
    payload: message
});
