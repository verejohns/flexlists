import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();
async function createTableDefinition(name:string,description:string,database:string,server:string,icon:Buffer,ownerId:number) {
  const tableDefinition = await prisma.tableDefinition.create({
    data: {
          name,
          description,
          database,
          server,
          icon,
          ownerId,
          createdAt:new Date(),
          updatedAt:new Date()
    },
  });
  return tableDefinition;


}
async function updateTableDefinition(id:number,name:string,description:string,database:string,server:string,icon:Buffer,ownerId:number) {
  const tableDefinition = await prisma.tableDefinition.update({
    where: {
          id:id
    },
    data: {
          name,
          description,
          database,
          server,
          icon,
          ownerId,
          updatedAt:new Date()
    },
  });
  return tableDefinition;


}
async function getTableDefinitionById(id:number) {
  const tableDefinition = await prisma.tableDefinition.findUnique({
    where: {
    id:id
    }
  });
  return tableDefinition;


}
async function getTableDefinition(query:any) {
  const tableDefinition = await prisma.tableDefinition.findFirst(query);
  return tableDefinition;


}
async function getAllTableDefinition(query:any) {

  const tableDefinitions = await prisma.tableDefinition.findMany(query);
  return tableDefinitions;

}
async function deleteTableDefinition(id:number) {


  const tableDefinition = await prisma.tableDefinition.delete({
    where: {
          id:id
    }
  });
  return tableDefinition;
}

export { createTableDefinition,updateTableDefinition,getTableDefinitionById,getTableDefinition,getAllTableDefinition,deleteTableDefinition };