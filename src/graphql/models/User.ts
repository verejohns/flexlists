import { gql } from 'graphql-tag';
export const userTypeDefs = gql`
  type User {
    id:Int
    userName: String
    firstName: String
    lastName: String
    phoneNumber: String
    password: String
    passwordSalt: String
    ownerId: Int
    owner:User
    users:[User]
    roles:[Role]
    userRoles:[UserRole]
    permissions:[Permission]
    applications:[Application]
    tableDefinitions:[TableDefinition]
    tableMigrations:[TableMigration]
    fieldDefinitions:[FieldDefinition]
    accessKeys:[AccessKey]
    products:[Product]
  }
  input UserWhereInput {
    AND: [UserWhereInput!]
    OR: [UserWhereInput!]
    NOT: [UserWhereInput!]
    id:IntFilter
    userName: StringFilter
    firstName: StringFilter
    lastName: StringFilter
    phoneNumber: StringFilter
    password: StringFilter
    passwordSalt: StringFilter
    ownerId: IntFilter
    owner:UserRelationFilter
    users:UserListRelationFilter
    roles:RoleListRelationFilter
    userRoles:UserRoleListRelationFilter
    permissions:PermissionListRelationFilter
    applications:ApplicationListRelationFilter
    tableDefinitions:TableDefinitionListRelationFilter
    tableMigrations:TableMigrationListRelationFilter
    fieldDefinitions:FieldDefinitionListRelationFilter
    accessKeys:AccessKeyListRelationFilter
    products:ProductListRelationFilter
  }
  input UserInclude {
     owner:Boolean
     users:Boolean
     roles:Boolean
     userRoles:Boolean
     permissions:Boolean
     applications:Boolean
     tableDefinitions:Boolean
     tableMigrations:Boolean
     fieldDefinitions:Boolean
     accessKeys:Boolean
     products:Boolean
    _count: Boolean 
  }
  type Query {
    users(where: UserWhereInput,take:Int,skip:Int,include:UserInclude): [User!]!
    getUserById(id:Int): User
  }
  type Mutation {
    createUser(userName: String,firstName: String,lastName: String,phoneNumber: String,password: String,ownerId: Int): User!
    updateUser(id:Int,userName: String,firstName: String,lastName: String,phoneNumber: String,password: String,ownerId: Int): User!
    deleteUser(id:Int): User!
  }

`;