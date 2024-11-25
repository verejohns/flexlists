import { UserStatus, MembershipLevel } from "src/enums/SharedEnums";
import { FileImpl } from "flexlists-api";

export type UserProfile = {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string | FileImpl;
  systemRole: string;
  status: UserStatus;
  membershipLevel: MembershipLevel;
  isLegacyUser: boolean;
  color?: string;
  language?: string;
};
