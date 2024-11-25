import { gql } from 'graphql-tag';
export const relTableDefinitionApplicationTypeDefs = gql`
  type RelTableDefinitionApplication {
    id:Int
    applicationId: Int
    tableDefinitionId: Int
    application:Application
    tableDefinition:TableDefinition
  }
  input RelTableDefinitionApplicationWhereInput {
    AND: [RelTableDefinitionApplicationWhereInput!]
    OR: [RelTableDefinitionApplicationWhereInput!]
    NOT: [RelTableDefinitionApplicationWhereInput!]
    id:IntFilter
    applicationId: IntFilter
    tableDefinitionId: IntFilter
    application:ApplicationRelationFilter
    tableDefinition:TableDefinitionRelationFilter
  }
  input RelTableDefinitionApplicationInclude {
     application:Boolean
     tableDefinition:Boolean
    _count: Boolean 
  }
  type Query {
    relTableDefinitionApplications(where: RelTableDefinitionApplicationWhereInput,take:Int,skip:Int,include:RelTableDefinitionApplicationInclude): [RelTableDefinitionApplication!]!
    getRelTableDefinitionApplicationById(id:Int): RelTableDefinitionApplication
  }
  type Mutation {
    createRelTableDefinitionApplication(applicationId: Int,tableDefinitionId: Int): RelTableDefinitionApplication!
    updateRelTableDefinitionApplication(id:Int,applicationId: Int,tableDefinitionId: Int): RelTableDefinitionApplication!
    deleteRelTableDefinitionApplication(id:Int): RelTableDefinitionApplication!
  }

`;