import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();
async function createApplication(name:string,description:string,ownerId:number) {
  const application = await prisma.application.create({
    data: {
          name,
          description,
          ownerId,
          createdAt:new Date(),
          updatedAt:new Date()
    },
  });
  return application;


}
async function updateApplication(id:number,name:string,description:string,ownerId:number) {
  const application = await prisma.application.update({
    where: {
          id:id
    },
    data: {
          name,
          description,
          ownerId,
          updatedAt:new Date()
    },
  });
  return application;


}
async function getApplicationById(id:number) {
  const application = await prisma.application.findUnique({
    where: {
    id:id
    }
  });
  return application;


}
async function getApplication(query:any) {
  const application = await prisma.application.findFirst(query);
  return application;


}
async function getAllApplication(query:any) {

  const applications = await prisma.application.findMany(query);
  return applications;

}
async function deleteApplication(id:number) {


  const application = await prisma.application.delete({
    where: {
          id:id
    }
  });
  return application;
}

export { createApplication,updateApplication,getApplicationById,getApplication,getAllApplication,deleteApplication };