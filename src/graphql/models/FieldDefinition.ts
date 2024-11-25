import { gql } from 'graphql-tag';
export const fieldDefinitionTypeDefs = gql`
  type FieldDefinition {
    id:Int
    name: String
    type: String
    description: String
    tableDefinitionId: Int
    ownerId: Int
    tableDefinition:TableDefinition
    owner:User
  }
  input FieldDefinitionWhereInput {
    AND: [FieldDefinitionWhereInput!]
    OR: [FieldDefinitionWhereInput!]
    NOT: [FieldDefinitionWhereInput!]
    id:IntFilter
    name: StringFilter
    type: StringFilter
    description: StringFilter
    tableDefinitionId: IntFilter
    ownerId: IntFilter
    tableDefinition:TableDefinitionRelationFilter
    owner:UserRelationFilter
  }
  input FieldDefinitionInclude {
     tableDefinition:Boolean
     owner:Boolean
    _count: Boolean 
  }
  type Query {
    fieldDefinitions(where: FieldDefinitionWhereInput,take:Int,skip:Int,include:FieldDefinitionInclude): [FieldDefinition!]!
    getFieldDefinitionById(id:Int): FieldDefinition
  }
  type Mutation {
    createFieldDefinition(name: String,type: String,description: String,tableDefinitionId: Int,ownerId: Int): FieldDefinition!
    updateFieldDefinition(id:Int,name: String,type: String,description: String,tableDefinitionId: Int,ownerId: Int): FieldDefinition!
    deleteFieldDefinition(id:Int): FieldDefinition!
  }

`;