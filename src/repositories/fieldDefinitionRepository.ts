import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();
async function createFieldDefinition(name:string,type:string,description:string,tableDefinitionId:number,ownerId:number) {
  const fieldDefinition = await prisma.fieldDefinition.create({
    data: {
          name,
          type,
          description,
          tableDefinitionId,
          ownerId,
          createdAt:new Date(),
          updatedAt:new Date()
    },
  });
  return fieldDefinition;


}
async function updateFieldDefinition(id:number,name:string,type:string,description:string,tableDefinitionId:number,ownerId:number) {
  const fieldDefinition = await prisma.fieldDefinition.update({
    where: {
          id:id
    },
    data: {
          name,
          type,
          description,
          tableDefinitionId,
          ownerId,
          updatedAt:new Date()
    },
  });
  return fieldDefinition;


}
async function getFieldDefinitionById(id:number) {
  const fieldDefinition = await prisma.fieldDefinition.findUnique({
    where: {
    id:id
    }
  });
  return fieldDefinition;


}
async function getFieldDefinition(query:any) {
  const fieldDefinition = await prisma.fieldDefinition.findFirst(query);
  return fieldDefinition;


}
async function getAllFieldDefinition(query:any) {

  const fieldDefinitions = await prisma.fieldDefinition.findMany(query);
  return fieldDefinitions;

}
async function deleteFieldDefinition(id:number) {


  const fieldDefinition = await prisma.fieldDefinition.delete({
    where: {
          id:id
    }
  });
  return fieldDefinition;
}

export { createFieldDefinition,updateFieldDefinition,getFieldDefinitionById,getFieldDefinition,getAllFieldDefinition,deleteFieldDefinition };