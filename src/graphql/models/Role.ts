import { gql } from 'graphql-tag';
export const roleTypeDefs = gql`
  type Role {
    id:Int
    name: String
    ownerId: Int
    owner:User
    userRoles:[UserRole]
    rolePermissions:[RolePermission]
    accessKeys:[AccessKey]
  }
  input RoleWhereInput {
    AND: [RoleWhereInput!]
    OR: [RoleWhereInput!]
    NOT: [RoleWhereInput!]
    id:IntFilter
    name: StringFilter
    ownerId: IntFilter
    owner:UserRelationFilter
    userRoles:UserRoleListRelationFilter
    rolePermissions:RolePermissionListRelationFilter
    accessKeys:AccessKeyListRelationFilter
  }
  input RoleInclude {
     owner:Boolean
     userRoles:Boolean
     rolePermissions:Boolean
     accessKeys:Boolean
    _count: Boolean 
  }
  type Query {
    roles(where: RoleWhereInput,take:Int,skip:Int,include:RoleInclude): [Role!]!
    getRoleById(id:Int): Role
  }
  type Mutation {
    createRole(name: String,ownerId: Int): Role!
    updateRole(id:Int,name: String,ownerId: Int): Role!
    deleteRole(id:Int): Role!
  }

`;