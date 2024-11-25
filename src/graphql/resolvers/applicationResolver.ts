import { GraphQLError } from 'graphql';
import { getApplicationById,getAllApplication,createApplication,updateApplication,deleteApplication } from 'src/repositories/applicationRepository';
export const applicationResolver = {
    Query: {
      applications: async (parent:any, args:any, context:any, info:any) => {
        return await getAllApplication(args)
      },
      getApplicationById: async (parent:any, args:{id:number}, context:any, info:any) => {
        return await getApplicationById(args.id)
      }
    },
    Mutation: {
      createApplication: async(parent:any, args: {name: string,description: string,ownerId: number}) =>
      {
         return await createApplication(args.name,args.description,args.ownerId)
      },
      updateApplication: async(parent:any, args: {id:number,name: string,description: string,ownerId: number}) =>
      {
        return await updateApplication(args.id,args.name,args.description,args.ownerId)
      },
      deleteApplication: async(parent:any, args: {id:number}) =>
      {
         if(args.id === 1)
         {
          throw new GraphQLError('can not delete admin user')
         }
         return await deleteApplication(args.id);
      }
  }
}


