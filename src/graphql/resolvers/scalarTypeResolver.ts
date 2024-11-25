import { GraphQLScalarType, Kind } from 'graphql';
export const scalarTypeResolver = {
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'A date and time, represented as an ISO-8601 string',
    serialize(value: any): string {
      return value.toISOString();
    },
    parseValue(value: any): Date {
      return new Date(value);
    },
    parseLiteral(ast): Date | null {
      if (ast.kind === Kind.STRING) {
        return new Date(ast.value);
      }
      return null;
    },
  }),
  Decimal: new GraphQLScalarType({
    name: 'Decimal',
    description: 'A decimal value represented as a string',
    serialize(value: any): string {
      return value.toString();
    },
    parseValue(value: any): number {
      return parseFloat(value);
    },
    parseLiteral(ast): number | null {
      if (ast.kind === Kind.FLOAT || ast.kind === Kind.INT) {
        return parseFloat(ast.value);
      }
      return null;
    },
  })
}


