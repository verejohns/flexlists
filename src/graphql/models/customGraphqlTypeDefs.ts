import { gql } from 'graphql-tag';
export const customGraphqlTypeDefs = gql`
  input StringFilter {
    equals: String
    in: [String]
    notIn: [String]
    lt: String
    lte: String
    gt: String
    gte: String
    contains: String
    startsWith: String
    endsWith: String
    not: NestedStringFilter
  }
  input NestedStringFilter {
    equals: String
    in: [String]
    notIn: [String]
    lt: String
    lte: String
    gt: String
    gte: String
    contains: String
    startsWith: String
    endsWith: String
    not: NestedStringFilter 
  }
  input IntFilter {
    equals: Int
    in: [Int]
    notIn: [Int]
    lt: Int
    lte: Int
    gt: Int
    gte: Int
    not: NestedIntFilter
  }
  input NestedIntFilter {
    equals: Int
    in: [Int]
    notIn: [Int]
    lt: Int
    lte: Int
    gt: Int
    gte: Int
    not: NestedIntFilter
  }
  input DateTimeFilter {
    equals: String
    in: [String]
    notIn: [String]
    lt: String
    lte: String
    gt: String
    gte: String
    not: NestedDateTimeFilter
  }
  input NestedDateTimeFilter {
    equals: String
    in: [String]
    notIn: [String]
    lt: String
    lte: String
    gt: String
    gte: String
    not: NestedDateTimeFilter
  }
  input DecimalFilter {
    equals: Decimal
    in: [Decimal]
    notIn: [Decimal]
    lt: Decimal
    lte: Decimal
    gt: Decimal
    gte: Decimal
    not: NestedDecimalFilter
  }
  input NestedDecimalFilter {
    equals: Decimal
    in: [Decimal]
    notIn: [Decimal]
    lt: Decimal
    lte: Decimal
    gt: Decimal
    gte: Decimal
    not: NestedDecimalFilter
  }
  input BufferFilter {
    equals: String
    in: [String]
    notIn: [String]
    not: NestedBufferFilter
  }
  input NestedBufferFilter {
    equals: String
    in: [String]
    notIn: [String]
    not: NestedBufferFilter
  }
`;