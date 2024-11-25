import { GraphQLError } from 'graphql';
import { getRolePermissionById,getAllRolePermission,createRolePermission,updateRolePermission,deleteRolePermission } from 'src/repositories/rolePermissionRepository';
export const rolePermissionResolver = {
    Query: {
      rolePermissions: async (parent:any, args:any, context:any, info:any) => {
        return await getAllRolePermission(args)
      },
      getRolePermissionById: async (parent:any, args:{id:number}, context:any, info:any) => {
        return await getRolePermissionById(args.id)
      }
    },
    Mutation: {
      createRolePermission: async(parent:any, args: {entityID: string,permissionId: number,roleId: number}) =>
      {
         return await createRolePermission(args.entityID,args.permissionId,args.roleId)
      },
      updateRolePermission: async(parent:any, args: {id:number,entityID: string,permissionId: number,roleId: number}) =>
      {
        return await updateRolePermission(args.id,args.entityID,args.permissionId,args.roleId)
      },
      deleteRolePermission: async(parent:any, args: {id:number}) =>
      {
         if(args.id === 1)
         {
          throw new GraphQLError('can not delete admin user')
         }
         return await deleteRolePermission(args.id);
      }
  }
}


