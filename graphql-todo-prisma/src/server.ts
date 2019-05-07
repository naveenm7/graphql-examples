import { merge } from "lodash";
import { prisma } from "./generated/prisma-client";
import { typeDefs as userTypeDefs, resolvers as userResolvers, middlewares as userMiddlewares } from "./modules/user";
import { typeDefs as toDoMessageTypeDefs, resolvers as toDoMessageResolvers, middlewares as toDoMessageMiddlewares } from "./modules/to-do-message";
const { GraphQLServer } = require('graphql-yoga');

const typeDefs = `
    type Query {
        info: String
    }
    type Mutation {
        _empty: String
    }
`;

const resolvers = {
    Query: {
        info() {
            return "This is a to-do application";
        }
    }
};

const server = new GraphQLServer({
    typeDefs: [typeDefs, userTypeDefs, toDoMessageTypeDefs],
    resolvers: merge(resolvers, userResolvers, toDoMessageResolvers),
    middlewares: [toDoMessageMiddlewares, userMiddlewares],
    context: (request: any) => {
        return {
            ...request,
            prisma
        };
    }
});

server.start(() => console.log(`Server is running on http://localhost:4000`));