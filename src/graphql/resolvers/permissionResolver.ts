import { GraphQLError } from 'graphql';
import { getPermissionById,getAllPermission,createPermission,updatePermission,deletePermission } from 'src/repositories/permissionRepository';
export const permissionResolver = {
    Query: {
      permissions: async (parent:any, args:any, context:any, info:any) => {
        return await getAllPermission(args)
      },
      getPermissionById: async (parent:any, args:{id:number}, context:any, info:any) => {
        return await getPermissionById(args.id)
      }
    },
    Mutation: {
      createPermission: async(parent:any, args: {name: string,ownerId: number}) =>
      {
         return await createPermission(args.name,args.ownerId)
      },
      updatePermission: async(parent:any, args: {id:number,name: string,ownerId: number}) =>
      {
        return await updatePermission(args.id,args.name,args.ownerId)
      },
      deletePermission: async(parent:any, args: {id:number}) =>
      {
         if(args.id === 1)
         {
          throw new GraphQLError('can not delete admin user')
         }
         return await deletePermission(args.id);
      }
  }
}


