import { Prisma } from './../generated/prisma-client/index';
import { UserServices } from './../services/user-services';
import { ErrorConstants } from "../constants/error-constants";
import { ApolloError, AuthenticationError } from "apollo-server-errors";
import { authenticate } from "../middlewares/authentication-middleware";

export const typeDefs = `
type ToDoMessage {
    id: ID!
    description: String
    status: String
    user: User!
}
type ToDoMessageResponse {
    id: ID!
    description: String
    status: String
}
extend type Mutation {
    createToDoMessage(description: String, status: String, userId: String!): ToDoMessageResponse
    updateToDoMessage(toDoMessageId: String!, userId: String!, description: String, status: String): ToDoMessageResponse
}
extend type Query {
    getToDoMessages(userId: String!): [ToDoMessageResponse!]!
}
`;

export const middlewares = {
    Mutation: {
        createToDoMessage: authenticate
    },
    Query: {
        getToDoMessages: authenticate
    }
}

export const resolvers = {
    Query: {
        async getToDoMessages(parent: any, args: any, context: any, info: any) {
            try {
                let prisma: Prisma = context.prisma;
                let authHeader = context.request.get("Authorization");
                let decodedToken = UserServices.decodeToken(authHeader);
                if (decodedToken.id !== args.userId) {
                    throw new ApolloError(ErrorConstants.AUTH_ERROR.DESCRIPTION, ErrorConstants.AUTH_ERROR.CODE);
                }
                let user = await prisma.user({ id: args.userId });
                if (user) {
                    // let response = await prisma.toDoMessages({ where: { user: { id: user.id } } });
                    let prismaResponse = await prisma.user({ id: args.userId }).toDoMessages();
                    let response = prismaResponse.map((toDoMessage: any) => {
                        return {
                            id: toDoMessage.id,
                            description: toDoMessage.description,
                            status: toDoMessage.status
                        };
                    });
                    return response;
                }
                throw new ApolloError(ErrorConstants.INVALID_INPUT_DATA.DESCRIPTION, ErrorConstants.INVALID_INPUT_DATA.CODE);
            } catch (err) {
                if (err instanceof ApolloError) {
                    throw err;
                }
                console.log(err);
                throw new ApolloError(ErrorConstants.APP_ERROR.DESCRIPTION, ErrorConstants.APP_ERROR.CODE);
            }
        }
    },
    Mutation: {
        async createToDoMessage(parent: any, args: any, context: any, info: any) {
            try {
                let prisma: Prisma = context.prisma;
                let authHeader = context.request.get("Authorization");
                let decodedToken = UserServices.decodeToken(authHeader);
                if (decodedToken.id !== args.userId) {
                    throw new ApolloError(ErrorConstants.AUTH_ERROR.DESCRIPTION, ErrorConstants.AUTH_ERROR.CODE);
                }
                let user = await prisma.user({ id: args.userId });
                if (user) {
                    let payload = {
                        description: args.description,
                        status: args.status,
                        user: {
                            connect: {
                                id: user.id
                            }
                        }
                    };
                    let response = await prisma.createToDoMessage(payload);
                    let toDoMessage = {
                        id: response.id,
                        description: response.description,
                        status: response.status,
                    };
                    return toDoMessage;
                }
                throw new ApolloError(ErrorConstants.INVALID_INPUT_DATA.DESCRIPTION, ErrorConstants.INVALID_INPUT_DATA.CODE);
            } catch (err) {
                if (err instanceof ApolloError) {
                    throw err;
                }
                console.log(err);
                throw new ApolloError(ErrorConstants.APP_ERROR.DESCRIPTION, ErrorConstants.APP_ERROR.CODE);
            }

        },


        async updateToDoMessage(parent: any, args: any, context: any, info: any) {
            try {
                let prisma: Prisma = context.prisma;
                let authHeader = context.request.get("Authorization");
                let decodedToken = UserServices.decodeToken(authHeader);
                if (decodedToken.id !== args.userId) {
                    throw new ApolloError(ErrorConstants.AUTH_ERROR.DESCRIPTION, ErrorConstants.AUTH_ERROR.CODE);
                }
                let user = await prisma.toDoMessage({ id: args.toDoMessageId }).user();
                if (user && user.id === args.userId) {
                    let payload = {
                        description: args.description,
                        status: args.status
                    };
                    let response = await prisma.updateToDoMessage({ data: payload, where: { id: args.toDoMessageId } });
                    let toDoMessage = {
                        id: response.id,
                        description: response.description,
                        status: response.status
                    };
                    return toDoMessage;
                }
                throw new ApolloError(ErrorConstants.INVALID_INPUT_DATA.DESCRIPTION, ErrorConstants.INVALID_INPUT_DATA.CODE);
            } catch (err) {
                if (err instanceof ApolloError) {
                    throw err;
                }
                console.log(err);
                throw new ApolloError(ErrorConstants.APP_ERROR.DESCRIPTION, ErrorConstants.APP_ERROR.CODE);
            }
        }

    }
};