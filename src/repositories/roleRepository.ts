import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();
async function createRole(name:string,ownerId:number) {
  const role = await prisma.role.create({
    data: {
          name,
          ownerId,
          createdAt:new Date(),
          updatedAt:new Date()
    },
  });
  return role;


}
async function updateRole(id:number,name:string,ownerId:number) {
  const role = await prisma.role.update({
    where: {
          id:id
    },
    data: {
          name,
          ownerId,
          updatedAt:new Date()
    },
  });
  return role;


}
async function getRoleById(id:number) {
  const role = await prisma.role.findUnique({
    where: {
    id:id
    }
  });
  return role;


}
async function getRole(query:any) {
  const role = await prisma.role.findFirst(query);
  return role;


}
async function getAllRole(query:any) {

  const roles = await prisma.role.findMany(query);
  return roles;

}
async function deleteRole(id:number) {


  const role = await prisma.role.delete({
    where: {
          id:id
    }
  });
  return role;
}

export { createRole,updateRole,getRoleById,getRole,getAllRole,deleteRole };