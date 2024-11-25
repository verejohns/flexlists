import { gql } from 'graphql-tag';
export const productTypeDefs = gql`
  scalar Decimal
  scalar DateTime
  type Product {
    id:Int
    name: String
    description: String
    price: Decimal
    expiredDate: DateTime
    ownerId: Int
    owner:User
  }
  input ProductWhereInput {
    AND: [ProductWhereInput!]
    OR: [ProductWhereInput!]
    NOT: [ProductWhereInput!]
    id:IntFilter
    name: StringFilter
    description: StringFilter
    price: DecimalFilter
    expiredDate: DateTimeFilter
    ownerId: IntFilter
    owner:UserRelationFilter
  }
  input ProductInclude {
     owner:Boolean
    _count: Boolean 
  }
  type Query {
    products(where: ProductWhereInput,take:Int,skip:Int,include:ProductInclude): [Product!]!
    getProductById(id:Int): Product
  }
  type Mutation {
    createProduct(name: String,description: String,price: Decimal,expiredDate: DateTime,ownerId: Int): Product!
    updateProduct(id:Int,name: String,description: String,price: Decimal,expiredDate: DateTime,ownerId: Int): Product!
    deleteProduct(id:Int): Product!
  }

`;