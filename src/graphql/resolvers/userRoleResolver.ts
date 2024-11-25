import { GraphQLError } from 'graphql';
import { getUserRoleById,getAllUserRole,createUserRole,updateUserRole,deleteUserRole } from 'src/repositories/userRoleRepository';
export const userRoleResolver = {
    Query: {
      userRoles: async (parent:any, args:any, context:any, info:any) => {
        return await getAllUserRole(args)
      },
      getUserRoleById: async (parent:any, args:{id:number}, context:any, info:any) => {
        return await getUserRoleById(args.id)
      }
    },
    Mutation: {
      createUserRole: async(parent:any, args: {roleId: number,userId: number}) =>
      {
         return await createUserRole(args.roleId,args.userId)
      },
      updateUserRole: async(parent:any, args: {id:number,roleId: number,userId: number}) =>
      {
        return await updateUserRole(args.id,args.roleId,args.userId)
      },
      deleteUserRole: async(parent:any, args: {id:number}) =>
      {
         if(args.id === 1)
         {
          throw new GraphQLError('can not delete admin user')
         }
         return await deleteUserRole(args.id);
      }
  }
}


