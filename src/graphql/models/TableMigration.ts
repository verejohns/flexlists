import { gql } from 'graphql-tag';
export const tableMigrationTypeDefs = gql`
  type TableMigration {
    id:Int
    before: String
    after: String
    action: String
    status: String
    tableDefinitionId: Int
    ownerId: Int
    tableDefinition:TableDefinition
    owner:User
  }
  input TableMigrationWhereInput {
    AND: [TableMigrationWhereInput!]
    OR: [TableMigrationWhereInput!]
    NOT: [TableMigrationWhereInput!]
    id:IntFilter
    before: StringFilter
    after: StringFilter
    action: StringFilter
    status: StringFilter
    tableDefinitionId: IntFilter
    ownerId: IntFilter
    tableDefinition:TableDefinitionRelationFilter
    owner:UserRelationFilter
  }
  input TableMigrationInclude {
     tableDefinition:Boolean
     owner:Boolean
    _count: Boolean 
  }
  type Query {
    tableMigrations(where: TableMigrationWhereInput,take:Int,skip:Int,include:TableMigrationInclude): [TableMigration!]!
    getTableMigrationById(id:Int): TableMigration
  }
  type Mutation {
    createTableMigration(before: String,after: String,action: String,status: String,tableDefinitionId: Int,ownerId: Int): TableMigration!
    updateTableMigration(id:Int,before: String,after: String,action: String,status: String,tableDefinitionId: Int,ownerId: Int): TableMigration!
    deleteTableMigration(id:Int): TableMigration!
  }

`;