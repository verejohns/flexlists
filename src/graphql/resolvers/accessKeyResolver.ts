import { GraphQLError } from 'graphql';
import { getAccessKeyById,getAllAccessKey,createAccessKey,updateAccessKey,deleteAccessKey } from 'src/repositories/accessKeyRepository';
export const accessKeyResolver = {
    Query: {
      accessKeys: async (parent:any, args:any, context:any, info:any) => {
        return await getAllAccessKey(args)
      },
      getAccessKeyById: async (parent:any, args:{id:number}, context:any, info:any) => {
        return await getAccessKeyById(args.id)
      }
    },
    Mutation: {
      createAccessKey: async(parent:any, args: {key: string,description: string,tableDefinitionId: number,roleId: number,ownerId: number}) =>
      {
         return await createAccessKey(args.key,args.description,args.tableDefinitionId,args.roleId,args.ownerId)
      },
      updateAccessKey: async(parent:any, args: {id:number,key: string,description: string,tableDefinitionId: number,roleId: number,ownerId: number}) =>
      {
        return await updateAccessKey(args.id,args.key,args.description,args.tableDefinitionId,args.roleId,args.ownerId)
      },
      deleteAccessKey: async(parent:any, args: {id:number}) =>
      {
         if(args.id === 1)
         {
          throw new GraphQLError('can not delete admin user')
         }
         return await deleteAccessKey(args.id);
      }
  }
}


