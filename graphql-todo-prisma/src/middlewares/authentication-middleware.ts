import { ApolloError } from 'apollo-server-errors';
import { AppConstants } from './../constants/app-constants';
import { UserServices } from './../services/user-services';
import { ErrorConstants } from '../constants/error-constants';

export async function authenticate(resolve: any, parent: any, args: any, context: any, info: any) {
    let authentication = context.request.get("Authorization");
    if (UserServices.verifyToken(authentication, AppConstants.SECRET_KEY)) {
        return await resolve(parent, args, context, info);
    }
    throw new ApolloError(ErrorConstants.AUTH_ERROR.DESCRIPTION, ErrorConstants.AUTH_ERROR.CODE);
}