import { SystemRole } from "src/enums/SystemRole";

export type AuthValidate = {
    isUserValidated: boolean;
    isKeyValidated: boolean;
    user?: { userId: number, userName: string,email:string,firstName:string,lastName:string ; systemRole: SystemRole};
};