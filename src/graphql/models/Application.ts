import { gql } from 'graphql-tag';
export const applicationTypeDefs = gql`
  type Application {
    id:Int
    name: String
    description: String
    ownerId: Int
    owner:User
    relTableDefinitionApplication:[RelTableDefinitionApplication]
  }
  input ApplicationWhereInput {
    AND: [ApplicationWhereInput!]
    OR: [ApplicationWhereInput!]
    NOT: [ApplicationWhereInput!]
    id:IntFilter
    name: StringFilter
    description: StringFilter
    ownerId: IntFilter
    owner:UserRelationFilter
    relTableDefinitionApplication:RelTableDefinitionApplicationListRelationFilter
  }
  input ApplicationInclude {
     owner:Boolean
     relTableDefinitionApplication:Boolean
    _count: Boolean 
  }
  type Query {
    applications(where: ApplicationWhereInput,take:Int,skip:Int,include:ApplicationInclude): [Application!]!
    getApplicationById(id:Int): Application
  }
  type Mutation {
    createApplication(name: String,description: String,ownerId: Int): Application!
    updateApplication(id:Int,name: String,description: String,ownerId: Int): Application!
    deleteApplication(id:Int): Application!
  }

`;