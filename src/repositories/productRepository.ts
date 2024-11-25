import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();
async function createProduct(name:string,description:string,price:number,expiredDate:Date,ownerId:number) {
  const product = await prisma.product.create({
    data: {
          name,
          description,
          price,
          expiredDate,
          ownerId,
          createdAt:new Date(),
          updatedAt:new Date()
    },
  });
  return product;


}
async function updateProduct(id:number,name:string,description:string,price:number,expiredDate:Date,ownerId:number) {
  const product = await prisma.product.update({
    where: {
          id:id
    },
    data: {
          name,
          description,
          price,
          expiredDate,
          ownerId,
          updatedAt:new Date()
    },
  });
  return product;


}
async function getProductById(id:number) {
  const product = await prisma.product.findUnique({
    where: {
    id:id
    }
  });
  return product;


}
async function getProduct(query:any) {
  const product = await prisma.product.findFirst(query);
  return product;


}
async function getAllProduct(query:any) {

  const products = await prisma.product.findMany(query);
  return products;

}
async function deleteProduct(id:number) {


  const product = await prisma.product.delete({
    where: {
          id:id
    }
  });
  return product;
}

export { createProduct,updateProduct,getProductById,getProduct,getAllProduct,deleteProduct };