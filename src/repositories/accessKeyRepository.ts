import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();
async function createAccessKey(key:string,description:string,tableDefinitionId:number,roleId:number,ownerId:number) {
  const accessKey = await prisma.accessKey.create({
    data: {
          key,
          description,
          tableDefinitionId,
          roleId,
          ownerId,
          createdAt:new Date(),
          updatedAt:new Date()
    },
  });
  return accessKey;


}
async function updateAccessKey(id:number,key:string,description:string,tableDefinitionId:number,roleId:number,ownerId:number) {
  const accessKey = await prisma.accessKey.update({
    where: {
          id:id
    },
    data: {
          key,
          description,
          tableDefinitionId,
          roleId,
          ownerId,
          updatedAt:new Date()
    },
  });
  return accessKey;


}
async function getAccessKeyById(id:number) {
  const accessKey = await prisma.accessKey.findUnique({
    where: {
    id:id
    }
  });
  return accessKey;


}
async function getAccessKey(query:any) {
  const accessKey = await prisma.accessKey.findFirst(query);
  return accessKey;


}
async function getAllAccessKey(query:any) {

  const accessKeys = await prisma.accessKey.findMany(query);
  return accessKeys;

}
async function deleteAccessKey(id:number) {


  const accessKey = await prisma.accessKey.delete({
    where: {
          id:id
    }
  });
  return accessKey;
}

export { createAccessKey,updateAccessKey,getAccessKeyById,getAccessKey,getAllAccessKey,deleteAccessKey };