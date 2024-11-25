import { GraphQLError } from 'graphql';
import { getProductById,getAllProduct,createProduct,updateProduct,deleteProduct } from 'src/repositories/productRepository';
export const productResolver = {
    Query: {
      products: async (parent:any, args:any, context:any, info:any) => {
        return await getAllProduct(args)
      },
      getProductById: async (parent:any, args:{id:number}, context:any, info:any) => {
        return await getProductById(args.id)
      }
    },
    Mutation: {
      createProduct: async(parent:any, args: {name: string,description: string,price: number,expiredDate: Date,ownerId: number}) =>
      {
         return await createProduct(args.name,args.description,args.price,args.expiredDate,args.ownerId)
      },
      updateProduct: async(parent:any, args: {id:number,name: string,description: string,price: number,expiredDate: Date,ownerId: number}) =>
      {
        return await updateProduct(args.id,args.name,args.description,args.price,args.expiredDate,args.ownerId)
      },
      deleteProduct: async(parent:any, args: {id:number}) =>
      {
         if(args.id === 1)
         {
          throw new GraphQLError('can not delete admin user')
         }
         return await deleteProduct(args.id);
      }
  }
}


