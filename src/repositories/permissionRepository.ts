import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();
async function createPermission(name:string,ownerId:number) {
  const permission = await prisma.permission.create({
    data: {
          name,
          ownerId,
          createdAt:new Date(),
          updatedAt:new Date()
    },
  });
  return permission;


}
async function updatePermission(id:number,name:string,ownerId:number) {
  const permission = await prisma.permission.update({
    where: {
          id:id
    },
    data: {
          name,
          ownerId,
          updatedAt:new Date()
    },
  });
  return permission;


}
async function getPermissionById(id:number) {
  const permission = await prisma.permission.findUnique({
    where: {
    id:id
    }
  });
  return permission;


}
async function getPermission(query:any) {
  const permission = await prisma.permission.findFirst(query);
  return permission;


}
async function getAllPermission(query:any) {

  const permissions = await prisma.permission.findMany(query);
  return permissions;

}
async function deletePermission(id:number) {


  const permission = await prisma.permission.delete({
    where: {
          id:id
    }
  });
  return permission;
}

export { createPermission,updatePermission,getPermissionById,getPermission,getAllPermission,deletePermission };