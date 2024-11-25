import { hashPassword } from "src/utils/bcryptUtils";
import { GraphQLError } from 'graphql';
import { getUserById,getAllUser,createUser,updateUser,deleteUser } from 'src/repositories/userRepository';
export const userResolver = {
    Query: {
      users: async (parent:any, args:any, context:any, info:any) => {
        return await getAllUser(args)
      },
      getUserById: async (parent:any, args:{id:number}, context:any, info:any) => {
        return await getUserById(args.id)
      }
    },
    Mutation: {
      createUser: async(parent:any, args: {userName: string,firstName: string,lastName: string,phoneNumber: string,password: string,ownerId: number}) =>
      {
          var hashResult = await hashPassword(args.password as string);
          var passwordHash = hashResult.hashedPassword;
          var passwordSalt = hashResult.salt;
         return await createUser(args.userName,args.firstName,args.lastName,args.phoneNumber,passwordHash,passwordSalt,args.ownerId)
      },
      updateUser: async(parent:any, args: {id:number,userName: string,firstName: string,lastName: string,phoneNumber: string,password: string,ownerId: number}) =>
      {
        var hashResult = await hashPassword(args.password as string);
        var passwordHash = hashResult.hashedPassword;
        var passwordSalt = hashResult.salt;
        return await updateUser(args.id,args.userName,args.firstName,args.lastName,args.phoneNumber,passwordHash,passwordSalt,args.ownerId)
      },
      deleteUser: async(parent:any, args: {id:number}) =>
      {
         if(args.id === 1)
         {
          throw new GraphQLError('can not delete admin user')
         }
         return await deleteUser(args.id);
      }
  }
}


