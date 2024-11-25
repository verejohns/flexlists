import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();
async function createTableMigration(before:string,after:string,action:string,status:string,tableDefinitionId:number,ownerId:number) {
  const tableMigration = await prisma.tableMigration.create({
    data: {
          before,
          after,
          action,
          status,
          tableDefinitionId,
          ownerId,
          createdAt:new Date(),
          updatedAt:new Date()
    },
  });
  return tableMigration;


}
async function updateTableMigration(id:number,before:string,after:string,action:string,status:string,tableDefinitionId:number,ownerId:number) {
  const tableMigration = await prisma.tableMigration.update({
    where: {
          id:id
    },
    data: {
          before,
          after,
          action,
          status,
          tableDefinitionId,
          ownerId,
          updatedAt:new Date()
    },
  });
  return tableMigration;


}
async function getTableMigrationById(id:number) {
  const tableMigration = await prisma.tableMigration.findUnique({
    where: {
    id:id
    }
  });
  return tableMigration;


}
async function getTableMigration(query:any) {
  const tableMigration = await prisma.tableMigration.findFirst(query);
  return tableMigration;


}
async function getAllTableMigration(query:any) {

  const tableMigrations = await prisma.tableMigration.findMany(query);
  return tableMigrations;

}
async function deleteTableMigration(id:number) {


  const tableMigration = await prisma.tableMigration.delete({
    where: {
          id:id
    }
  });
  return tableMigration;
}

export { createTableMigration,updateTableMigration,getTableMigrationById,getTableMigration,getAllTableMigration,deleteTableMigration };