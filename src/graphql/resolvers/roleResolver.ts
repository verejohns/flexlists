import { GraphQLError } from 'graphql';
import { getRoleById,getAllRole,createRole,updateRole,deleteRole } from 'src/repositories/roleRepository';
export const roleResolver = {
    Query: {
      roles: async (parent:any, args:any, context:any, info:any) => {
        return await getAllRole(args)
      },
      getRoleById: async (parent:any, args:{id:number}, context:any, info:any) => {
        return await getRoleById(args.id)
      }
    },
    Mutation: {
      createRole: async(parent:any, args: {name: string,ownerId: number}) =>
      {
         return await createRole(args.name,args.ownerId)
      },
      updateRole: async(parent:any, args: {id:number,name: string,ownerId: number}) =>
      {
        return await updateRole(args.id,args.name,args.ownerId)
      },
      deleteRole: async(parent:any, args: {id:number}) =>
      {
         if(args.id === 1)
         {
          throw new GraphQLError('can not delete admin user')
         }
         return await deleteRole(args.id);
      }
  }
}


