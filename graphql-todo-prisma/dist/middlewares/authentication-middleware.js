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
const apollo_server_errors_1 = require("apollo-server-errors");
const app_constants_1 = require("./../constants/app-constants");
const user_services_1 = require("./../services/user-services");
const error_constants_1 = require("../constants/error-constants");
function authenticate(resolve, parent, args, context, info) {
    return __awaiter(this, void 0, void 0, function* () {
        let authentication = context.request.get("Authorization");
        if (user_services_1.UserServices.verifyToken(authentication, app_constants_1.AppConstants.SECRET_KEY)) {
            return yield resolve(parent, args, context, info);
        }
        throw new apollo_server_errors_1.ApolloError(error_constants_1.ErrorConstants.AUTH_ERROR.DESCRIPTION, error_constants_1.ErrorConstants.AUTH_ERROR.CODE);
    });
}
exports.authenticate = authenticate;
//# sourceMappingURL=authentication-middleware.js.map