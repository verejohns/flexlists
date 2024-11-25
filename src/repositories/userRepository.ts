import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();
async function createUser(userName:string,firstName:string,lastName:string,phoneNumber:string,password:string,passwordSalt:string,ownerId:number) {
  const user = await prisma.user.create({
    data: {
          userName,
          firstName,
          lastName,
          phoneNumber,
          password,
          passwordSalt,
          ownerId,
          createdAt:new Date(),
          updatedAt:new Date()
    },
  });
  return user;


}
async function updateUser(id:number,userName:string,firstName:string,lastName:string,phoneNumber:string,password:string,passwordSalt:string,ownerId:number) {
  const user = await prisma.user.update({
    where: {
          id:id
    },
    data: {
          userName,
          firstName,
          lastName,
          phoneNumber,
          password,
          passwordSalt,
          ownerId,
          updatedAt:new Date()
    },
  });
  return user;


}
async function getUserById(id:number) {
  const user = await prisma.user.findUnique({
    where: {
    id:id
    }
  });
  return user;


}
async function getUser(query:any) {
  const user = await prisma.user.findFirst(query);
  return user;


}
async function getAllUser(query:any) {

  const users = await prisma.user.findMany(query);
  return users;

}
async function deleteUser(id:number) {


  const user = await prisma.user.delete({
    where: {
          id:id
    }
  });
  return user;
}

export { createUser,updateUser,getUserById,getUser,getAllUser,deleteUser };