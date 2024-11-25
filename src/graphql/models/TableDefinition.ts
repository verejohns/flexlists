import { gql } from 'graphql-tag';
export const tableDefinitionTypeDefs = gql`
  type TableDefinition {
    id:Int
    name: String
    description: String
    database: String
    server: String
    icon: String
    ownerId: Int
    owner:User
    tableMigrations:[TableMigration]
    fieldDefinitions:[FieldDefinition]
    accessKeys:[AccessKey]
    relTableDefinitionApplication:[RelTableDefinitionApplication]
  }
  input TableDefinitionWhereInput {
    AND: [TableDefinitionWhereInput!]
    OR: [TableDefinitionWhereInput!]
    NOT: [TableDefinitionWhereInput!]
    id:IntFilter
    name: StringFilter
    description: StringFilter
    database: StringFilter
    server: StringFilter
    icon: BufferFilter
    ownerId: IntFilter
    owner:UserRelationFilter
    tableMigrations:TableMigrationListRelationFilter
    fieldDefinitions:FieldDefinitionListRelationFilter
    accessKeys:AccessKeyListRelationFilter
    relTableDefinitionApplication:RelTableDefinitionApplicationListRelationFilter
  }
  input TableDefinitionInclude {
     owner:Boolean
     tableMigrations:Boolean
     fieldDefinitions:Boolean
     accessKeys:Boolean
     relTableDefinitionApplication:Boolean
    _count: Boolean 
  }
  type Query {
    tableDefinitions(where: TableDefinitionWhereInput,take:Int,skip:Int,include:TableDefinitionInclude): [TableDefinition!]!
    getTableDefinitionById(id:Int): TableDefinition
  }
  type Mutation {
    createTableDefinition(name: String,description: String,database: String,server: String,icon: String,ownerId: Int): TableDefinition!
    updateTableDefinition(id:Int,name: String,description: String,database: String,server: String,icon: String,ownerId: Int): TableDefinition!
    deleteTableDefinition(id:Int): TableDefinition!
  }

`;