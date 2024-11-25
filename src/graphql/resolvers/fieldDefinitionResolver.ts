import { GraphQLError } from 'graphql';
import { getFieldDefinitionById,getAllFieldDefinition,createFieldDefinition,updateFieldDefinition,deleteFieldDefinition } from 'src/repositories/fieldDefinitionRepository';
export const fieldDefinitionResolver = {
    Query: {
      fieldDefinitions: async (parent:any, args:any, context:any, info:any) => {
        return await getAllFieldDefinition(args)
      },
      getFieldDefinitionById: async (parent:any, args:{id:number}, context:any, info:any) => {
        return await getFieldDefinitionById(args.id)
      }
    },
    Mutation: {
      createFieldDefinition: async(parent:any, args: {name: string,type: string,description: string,tableDefinitionId: number,ownerId: number}) =>
      {
         return await createFieldDefinition(args.name,args.type,args.description,args.tableDefinitionId,args.ownerId)
      },
      updateFieldDefinition: async(parent:any, args: {id:number,name: string,type: string,description: string,tableDefinitionId: number,ownerId: number}) =>
      {
        return await updateFieldDefinition(args.id,args.name,args.type,args.description,args.tableDefinitionId,args.ownerId)
      },
      deleteFieldDefinition: async(parent:any, args: {id:number}) =>
      {
         if(args.id === 1)
         {
          throw new GraphQLError('can not delete admin user')
         }
         return await deleteFieldDefinition(args.id);
      }
  }
}


