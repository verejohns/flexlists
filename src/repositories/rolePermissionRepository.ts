import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();
async function createRolePermission(entityID:string,permissionId:number,roleId:number) {
  const rolePermission = await prisma.rolePermission.create({
    data: {
          entityID,
          permissionId,
          roleId,
          createdAt:new Date(),
          updatedAt:new Date()
    },
  });
  return rolePermission;


}
async function updateRolePermission(id:number,entityID:string,permissionId:number,roleId:number) {
  const rolePermission = await prisma.rolePermission.update({
    where: {
          id:id
    },
    data: {
          entityID,
          permissionId,
          roleId,
          updatedAt:new Date()
    },
  });
  return rolePermission;


}
async function getRolePermissionById(id:number) {
  const rolePermission = await prisma.rolePermission.findUnique({
    where: {
    id:id
    }
  });
  return rolePermission;


}
async function getRolePermission(query:any) {
  const rolePermission = await prisma.rolePermission.findFirst(query);
  return rolePermission;


}
async function getAllRolePermission(query:any) {

  const rolePermissions = await prisma.rolePermission.findMany(query);
  return rolePermissions;

}
async function deleteRolePermission(id:number) {


  const rolePermission = await prisma.rolePermission.delete({
    where: {
          id:id
    }
  });
  return rolePermission;
}

export { createRolePermission,updateRolePermission,getRolePermissionById,getRolePermission,getAllRolePermission,deleteRolePermission };