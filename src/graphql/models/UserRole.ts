import { gql } from 'graphql-tag';
export const userRoleTypeDefs = gql`
  type UserRole {
    id:Int
    roleId: Int
    userId: Int
    role:Role
    user:User
  }
  input UserRoleWhereInput {
    AND: [UserRoleWhereInput!]
    OR: [UserRoleWhereInput!]
    NOT: [UserRoleWhereInput!]
    id:IntFilter
    roleId: IntFilter
    userId: IntFilter
    role:RoleRelationFilter
    user:UserRelationFilter
  }
  input UserRoleInclude {
     role:Boolean
     user:Boolean
    _count: Boolean 
  }
  type Query {
    userRoles(where: UserRoleWhereInput,take:Int,skip:Int,include:UserRoleInclude): [UserRole!]!
    getUserRoleById(id:Int): UserRole
  }
  type Mutation {
    createUserRole(roleId: Int,userId: Int): UserRole!
    updateUserRole(id:Int,roleId: Int,userId: Int): UserRole!
    deleteUserRole(id:Int): UserRole!
  }

`;