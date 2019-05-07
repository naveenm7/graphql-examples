const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

export class UserServices {

    public static hashPassword(password: string): Promise<string> {
        try {
            return new Promise((resolve, reject) => {
                return bcrypt.hash(password, 10, ((err: any, hash: string) => {
                    if (hash) {
                        return resolve(hash);
                    }
                    return reject(err);
                }));
            });
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    public static compareHashWithPassword(hash: string, password: string): Promise<boolean> {
        try {
            return bcrypt.compare(password, hash);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    public static getToken(data: any, key: string): string {
        try {
            return jwt.sign(data, key);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    public static verifyToken(token: string, key: string): boolean {
        try {
            let value = jwt.verify(token, key);
            return true;
        } catch (err) {
            return false;
        }
    }

    public static decodeToken(token: string): any {
        try {
            let data = jwt.decode(token);
            return data;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

}