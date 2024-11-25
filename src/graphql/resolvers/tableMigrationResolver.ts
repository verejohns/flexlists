import { GraphQLError } from 'graphql';
import { getTableMigrationById,getAllTableMigration,createTableMigration,updateTableMigration,deleteTableMigration } from 'src/repositories/tableMigrationRepository';
export const tableMigrationResolver = {
    Query: {
      tableMigrations: async (parent:any, args:any, context:any, info:any) => {
        return await getAllTableMigration(args)
      },
      getTableMigrationById: async (parent:any, args:{id:number}, context:any, info:any) => {
        return await getTableMigrationById(args.id)
      }
    },
    Mutation: {
      createTableMigration: async(parent:any, args: {before: string,after: string,action: string,status: string,tableDefinitionId: number,ownerId: number}) =>
      {
         return await createTableMigration(args.before,args.after,args.action,args.status,args.tableDefinitionId,args.ownerId)
      },
      updateTableMigration: async(parent:any, args: {id:number,before: string,after: string,action: string,status: string,tableDefinitionId: number,ownerId: number}) =>
      {
        return await updateTableMigration(args.id,args.before,args.after,args.action,args.status,args.tableDefinitionId,args.ownerId)
      },
      deleteTableMigration: async(parent:any, args: {id:number}) =>
      {
         if(args.id === 1)
         {
          throw new GraphQLError('can not delete admin user')
         }
         return await deleteTableMigration(args.id);
      }
  }
}


