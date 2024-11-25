import { gql } from 'graphql-tag';
export const permissionTypeDefs = gql`
  type Permission {
    id:Int
    name: String
    ownerId: Int
    rolePermissions:[RolePermission]
    owner:User
  }
  input PermissionWhereInput {
    AND: [PermissionWhereInput!]
    OR: [PermissionWhereInput!]
    NOT: [PermissionWhereInput!]
    id:IntFilter
    name: StringFilter
    ownerId: IntFilter
    rolePermissions:RolePermissionListRelationFilter
    owner:UserRelationFilter
  }
  input PermissionInclude {
     rolePermissions:Boolean
     owner:Boolean
    _count: Boolean 
  }
  type Query {
    permissions(where: PermissionWhereInput,take:Int,skip:Int,include:PermissionInclude): [Permission!]!
    getPermissionById(id:Int): Permission
  }
  type Mutation {
    createPermission(name: String,ownerId: Int): Permission!
    updatePermission(id:Int,name: String,ownerId: Int): Permission!
    deletePermission(id:Int): Permission!
  }

`;