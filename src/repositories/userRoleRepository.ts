import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();
async function createUserRole(roleId:number,userId:number) {
  const userRole = await prisma.userRole.create({
    data: {
          roleId,
          userId,
          createdAt:new Date(),
          updatedAt:new Date()
    },
  });
  return userRole;


}
async function updateUserRole(id:number,roleId:number,userId:number) {
  const userRole = await prisma.userRole.update({
    where: {
          id:id
    },
    data: {
          roleId,
          userId,
          updatedAt:new Date()
    },
  });
  return userRole;


}
async function getUserRoleById(id:number) {
  const userRole = await prisma.userRole.findUnique({
    where: {
    id:id
    }
  });
  return userRole;


}
async function getUserRole(query:any) {
  const userRole = await prisma.userRole.findFirst(query);
  return userRole;


}
async function getAllUserRole(query:any) {

  const userRoles = await prisma.userRole.findMany(query);
  return userRoles;

}
async function deleteUserRole(id:number) {


  const userRole = await prisma.userRole.delete({
    where: {
          id:id
    }
  });
  return userRole;
}

export { createUserRole,updateUserRole,getUserRoleById,getUserRole,getAllUserRole,deleteUserRole };