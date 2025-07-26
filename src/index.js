// src/index.ts
import "dotenv/config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { resolvers } from "./resolvers";
import typeDefs from "./schema";
import { createContext } from "./context";

async function start() {
  const app = express();
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
    context: createContext,
  });
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  const port = process.env.PORT || 4000;
  app.listen(port, () =>
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
  );
}

start();
