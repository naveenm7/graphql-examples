"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
class UserServices {
    static hashPassword(password) {
        try {
            return new Promise((resolve, reject) => {
                return bcrypt.hash(password, 10, ((err, hash) => {
                    if (hash) {
                        return resolve(hash);
                    }
                    return reject(err);
                }));
            });
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
    static compareHashWithPassword(hash, password) {
        try {
            return bcrypt.compare(password, hash);
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
    static getToken(data, key) {
        try {
            return jwt.sign(data, key);
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
    static verifyToken(token, key) {
        try {
            let value = jwt.verify(token, key);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    static decodeToken(token) {
        try {
            let data = jwt.decode(token);
            return data;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
}
exports.UserServices = UserServices;
//# sourceMappingURL=user-services.js.map