import { Role } from "src/enums/SharedEnums";

export function hasPermission(role: Role | undefined, permission: 'Create' | 'Read' | 'Update' | 'Delete' | 'All') {
    if (!role) return false
    switch (permission) {
        case 'All':
            return role === Role.FullAccess
        case 'Create':
            return role === Role.FullAccess || role === Role.AddOnly || role === Role.ReadAdd || role === Role.ReadEdit
        case 'Read':
            return role === Role.FullAccess || role === Role.ReadOnly || role === Role.ReadEdit || role === Role.ReadAdd
        case 'Update':
            return role === Role.FullAccess || role === Role.ReadEdit
        case 'Delete':
            return role === Role.FullAccess || role === Role.ReadEdit
        default:
            return false
    }
}