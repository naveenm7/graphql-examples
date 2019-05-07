import { Prisma } from './../generated/prisma-client/index';
import { AppConstants } from './../constants/app-constants';
import { ApolloError, AuthenticationError } from "apollo-server-errors";
import { ErrorConstants } from "../constants/error-constants";
import { UserServices } from "../services/user-services";
import { authenticate } from '../middlewares/authentication-middleware';

export const typeDefs = `
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

export const middlewares = {
    Query: {
        getUser: authenticate
    }
}

export const resolvers = {
    Query: {
        async login(parent: any, args: any, context: any, info: any) {
            try {
                let prisma: Prisma = context.prisma;
                let email: string = args.email;
                let response: any = await prisma.users({ where: { email } });
                if (response[0]) {
                    let passwordMatch = await UserServices.compareHashWithPassword(response[0].password, args.password);
                    if (passwordMatch) {
                        let user = {
                            id: response[0].id,
                            email: response[0].email,
                            name: response[0].name
                        };
                        let token = UserServices.getToken({ id: user.id }, AppConstants.SECRET_KEY);
                        return {
                            token,
                            user
                        };
                    }
                }
                throw new AuthenticationError("Invalid email or password");
            } catch (err) {
                if (err instanceof ApolloError) {
                    throw err;
                }
                console.log(err);
                throw new ApolloError(ErrorConstants.APP_ERROR.DESCRIPTION, ErrorConstants.APP_ERROR.CODE);
            }
        },
        async getUser(parent: any, args: any, context: any, info: any) {
            try {
                let prisma: Prisma = context.prisma;
                let authHeader = context.request.get("Authorization");
                let decodedToken = UserServices.decodeToken(authHeader);
                if (decodedToken.id !== args.id) {
                    throw new ApolloError(ErrorConstants.AUTH_ERROR.DESCRIPTION, ErrorConstants.AUTH_ERROR.CODE);
                }
                let user = await prisma.user({ id: args.id });
                if (user) {
                    return user;
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
        async register(parent: any, args: any, context: any, info: any) {
            try {
                let prisma: Prisma = context.prisma;
                let name = args.name;
                let email = args.email;
                let accountsWithEmail: any = await prisma.users({ where: { email } });
                if (accountsWithEmail.length === 0) {
                    let password = await UserServices.hashPassword(args.password);
                    try {
                        let response = await prisma.createUser({ name, email, password });
                        let user = {
                            id: response.id,
                            name: response.name,
                            email: response.email,
                        }
                        return user;
                    } catch (err) {
                        console.log(err);
                        throw new ApolloError(ErrorConstants.APP_ERROR.DESCRIPTION, ErrorConstants.APP_ERROR.CODE);
                    }
                }
                throw new ApolloError(ErrorConstants.EMAIL_EXISTS.DESCRIPTION, ErrorConstants.EMAIL_EXISTS.CODE);
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