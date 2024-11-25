import { gql } from 'graphql-tag';
export const accessKeyTypeDefs = gql`
  type AccessKey {
    id:Int
    key: String
    description: String
    tableDefinitionId: Int
    roleId: Int
    ownerId: Int
    tableDefinition:TableDefinition
    role:Role
    owner:User
  }
  input AccessKeyWhereInput {
    AND: [AccessKeyWhereInput!]
    OR: [AccessKeyWhereInput!]
    NOT: [AccessKeyWhereInput!]
    id:IntFilter
    key: StringFilter
    description: StringFilter
    tableDefinitionId: IntFilter
    roleId: IntFilter
    ownerId: IntFilter
    tableDefinition:TableDefinitionRelationFilter
    role:RoleRelationFilter
    owner:UserRelationFilter
  }
  input AccessKeyInclude {
     tableDefinition:Boolean
     role:Boolean
     owner:Boolean
    _count: Boolean 
  }
  type Query {
    accessKeys(where: AccessKeyWhereInput,take:Int,skip:Int,include:AccessKeyInclude): [AccessKey!]!
    getAccessKeyById(id:Int): AccessKey
  }
  type Mutation {
    createAccessKey(key: String,description: String,tableDefinitionId: Int,roleId: Int,ownerId: Int): AccessKey!
    updateAccessKey(id:Int,key: String,description: String,tableDefinitionId: Int,roleId: Int,ownerId: Int): AccessKey!
    deleteAccessKey(id:Int): AccessKey!
  }

`;