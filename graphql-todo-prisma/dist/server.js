"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const prisma_client_1 = require("./generated/prisma-client");
const user_1 = require("./modules/user");
const to_do_message_1 = require("./modules/to-do-message");
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
    typeDefs: [typeDefs, user_1.typeDefs, to_do_message_1.typeDefs],
    resolvers: lodash_1.merge(resolvers, user_1.resolvers, to_do_message_1.resolvers),
    middlewares: [to_do_message_1.middlewares, user_1.middlewares],
    context: (request) => {
        return Object.assign({}, request, { prisma: prisma_client_1.prisma });
    }
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
//# sourceMappingURL=server.js.map