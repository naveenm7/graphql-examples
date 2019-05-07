"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_services_1 = require("./../services/user-services");
const error_constants_1 = require("../constants/error-constants");
const apollo_server_errors_1 = require("apollo-server-errors");
const authentication_middleware_1 = require("../middlewares/authentication-middleware");
exports.typeDefs = `
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
exports.middlewares = {
    Mutation: {
        createToDoMessage: authentication_middleware_1.authenticate
    },
    Query: {
        getToDoMessages: authentication_middleware_1.authenticate
    }
};
exports.resolvers = {
    Query: {
        getToDoMessages(parent, args, context, info) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let prisma = context.prisma;
                    let authHeader = context.request.get("Authorization");
                    let decodedToken = user_services_1.UserServices.decodeToken(authHeader);
                    if (decodedToken.id !== args.userId) {
                        throw new apollo_server_errors_1.ApolloError(error_constants_1.ErrorConstants.AUTH_ERROR.DESCRIPTION, error_constants_1.ErrorConstants.AUTH_ERROR.CODE);
                    }
                    let user = yield prisma.user({ id: args.userId });
                    if (user) {
                        // let response = await prisma.toDoMessages({ where: { user: { id: user.id } } });
                        let prismaResponse = yield prisma.user({ id: args.userId }).toDoMessages();
                        let response = prismaResponse.map((toDoMessage) => {
                            return {
                                id: toDoMessage.id,
                                description: toDoMessage.description,
                                status: toDoMessage.status
                            };
                        });
                        return response;
                    }
                    throw new apollo_server_errors_1.ApolloError(error_constants_1.ErrorConstants.INVALID_INPUT_DATA.DESCRIPTION, error_constants_1.ErrorConstants.INVALID_INPUT_DATA.CODE);
                }
                catch (err) {
                    if (err instanceof apollo_server_errors_1.ApolloError) {
                        throw err;
                    }
                    console.log(err);
                    throw new apollo_server_errors_1.ApolloError(error_constants_1.ErrorConstants.APP_ERROR.DESCRIPTION, error_constants_1.ErrorConstants.APP_ERROR.CODE);
                }
            });
        }
    },
    Mutation: {
        createToDoMessage(parent, args, context, info) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let prisma = context.prisma;
                    let authHeader = context.request.get("Authorization");
                    let decodedToken = user_services_1.UserServices.decodeToken(authHeader);
                    if (decodedToken.id !== args.userId) {
                        throw new apollo_server_errors_1.ApolloError(error_constants_1.ErrorConstants.AUTH_ERROR.DESCRIPTION, error_constants_1.ErrorConstants.AUTH_ERROR.CODE);
                    }
                    let user = yield prisma.user({ id: args.userId });
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
                        let response = yield prisma.createToDoMessage(payload);
                        let toDoMessage = {
                            id: response.id,
                            description: response.description,
                            status: response.status,
                        };
                        return toDoMessage;
                    }
                    throw new apollo_server_errors_1.ApolloError(error_constants_1.ErrorConstants.INVALID_INPUT_DATA.DESCRIPTION, error_constants_1.ErrorConstants.INVALID_INPUT_DATA.CODE);
                }
                catch (err) {
                    if (err instanceof apollo_server_errors_1.ApolloError) {
                        throw err;
                    }
                    console.log(err);
                    throw new apollo_server_errors_1.ApolloError(error_constants_1.ErrorConstants.APP_ERROR.DESCRIPTION, error_constants_1.ErrorConstants.APP_ERROR.CODE);
                }
            });
        },
        updateToDoMessage(parent, args, context, info) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let prisma = context.prisma;
                    let authHeader = context.request.get("Authorization");
                    let decodedToken = user_services_1.UserServices.decodeToken(authHeader);
                    if (decodedToken.id !== args.userId) {
                        throw new apollo_server_errors_1.ApolloError(error_constants_1.ErrorConstants.AUTH_ERROR.DESCRIPTION, error_constants_1.ErrorConstants.AUTH_ERROR.CODE);
                    }
                    let user = yield prisma.toDoMessage({ id: args.toDoMessageId }).user();
                    if (user && user.id === args.userId) {
                        let payload = {
                            description: args.description,
                            status: args.status
                        };
                        let response = yield prisma.updateToDoMessage({ data: payload, where: { id: args.toDoMessageId } });
                        let toDoMessage = {
                            id: response.id,
                            description: response.description,
                            status: response.status
                        };
                        return toDoMessage;
                    }
                    throw new apollo_server_errors_1.ApolloError(error_constants_1.ErrorConstants.INVALID_INPUT_DATA.DESCRIPTION, error_constants_1.ErrorConstants.INVALID_INPUT_DATA.CODE);
                }
                catch (err) {
                    if (err instanceof apollo_server_errors_1.ApolloError) {
                        throw err;
                    }
                    console.log(err);
                    throw new apollo_server_errors_1.ApolloError(error_constants_1.ErrorConstants.APP_ERROR.DESCRIPTION, error_constants_1.ErrorConstants.APP_ERROR.CODE);
                }
            });
        }
    }
};
//# sourceMappingURL=to-do-message.js.map