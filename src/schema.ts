import { gql } from "apollo-server-express";

export default gql`
  scalar JSON
  scalar DateTime

  type Shop {
    id: ID!
    name: String!
    timeZone: String!
    settings: JSON!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type AppUser {
    id: ID!
    username: String!
    role: String!
    email: String
    phone: String
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Category {
    id: ID!
    name: String!
    position: Int!
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Item {
    id: ID!
    name: String!
    description: String
    imageUrl: String
    priceCents: Int!
    position: Int!
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    me: AppUser
    shops: [Shop!]!
    categories(shopId: ID!): [Category!]!
    items(categoryId: ID!): [Item!]!
  }

  type AuthPayload {
    token: String!
    user: AppUser!
  }

  type Mutation {
    signup(shopId: ID!, username: String!, password: String!): AuthPayload!
    login(username: String!, password: String!): AuthPayload!

    createCategory(shopId: ID!, name: String!): Category!
    updateCategory(id: ID!, name: String, position: Int, isActive: Boolean): Category!
    deleteCategory(id: ID!): Boolean!

    createItem(categoryId: ID!, name: String!, priceCents: Int!): Item!
    updateItem(id: ID!, name: String, priceCents: Int, position: Int, isActive: Boolean): Item!
    deleteItem(id: ID!): Boolean!
  }
`;
