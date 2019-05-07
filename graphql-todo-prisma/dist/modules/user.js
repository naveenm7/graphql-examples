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
const app_constants_1 = require("./../constants/app-constants");
const apollo_server_errors_1 = require("apollo-server-errors");
const error_constants_1 = require("../constants/error-constants");
const user_services_1 = require("../services/user-services");
const authentication_middleware_1 = require("../middlewares/authentication-middleware");
exports.typeDefs = `
    type User {
        id: ID!
        name: String
        email: String!
    }
    type AuthPayload {
        token: String!
        user: User!
    }
    extend type Query {
        login(email: String!, password: String!): AuthPayload
        getUser(id: String!): User
    }
    extend type Mutation {
        register(name: String, email: String!, password: String!): User
    }
`;
exports.middlewares = {
    Query: {
        getUser: authentication_middleware_1.authenticate
    }
};
exports.resolvers = {
    Query: {
        login(parent, args, context, info) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let prisma = context.prisma;
                    let email = args.email;
                    let response = yield prisma.users({ where: { email } });
                    if (response[0]) {
                        let passwordMatch = yield user_services_1.UserServices.compareHashWithPassword(response[0].password, args.password);
                        if (passwordMatch) {
                            let user = {
                                id: response[0].id,
                                email: response[0].email,
                                name: response[0].name
                            };
                            let token = user_services_1.UserServices.getToken({ id: user.id }, app_constants_1.AppConstants.SECRET_KEY);
                            return {
                                token,
                                user
                            };
                        }
                    }
                    throw new apollo_server_errors_1.AuthenticationError("Invalid email or password");
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
        getUser(parent, args, context, info) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let prisma = context.prisma;
                    let authHeader = context.request.get("Authorization");
                    let decodedToken = user_services_1.UserServices.decodeToken(authHeader);
                    if (decodedToken.id !== args.id) {
                        throw new apollo_server_errors_1.ApolloError(error_constants_1.ErrorConstants.AUTH_ERROR.DESCRIPTION, error_constants_1.ErrorConstants.AUTH_ERROR.CODE);
                    }
                    let user = yield prisma.user({ id: args.id });
                    if (user) {
                        return user;
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
        register(parent, args, context, info) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let prisma = context.prisma;
                    let name = args.name;
                    let email = args.email;
                    let accountsWithEmail = yield prisma.users({ where: { email } });
                    if (accountsWithEmail.length === 0) {
                        let password = yield user_services_1.UserServices.hashPassword(args.password);
                        try {
                            let response = yield prisma.createUser({ name, email, password });
                            let user = {
                                id: response.id,
                                name: response.name,
                                email: response.email,
                            };
                            return user;
                        }
                        catch (err) {
                            console.log(err);
                            throw new apollo_server_errors_1.ApolloError(error_constants_1.ErrorConstants.APP_ERROR.DESCRIPTION, error_constants_1.ErrorConstants.APP_ERROR.CODE);
                        }
                    }
                    throw new apollo_server_errors_1.ApolloError(error_constants_1.ErrorConstants.EMAIL_EXISTS.DESCRIPTION, error_constants_1.ErrorConstants.EMAIL_EXISTS.CODE);
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
//# sourceMappingURL=user.js.map