export class ErrorConstants {
    public static APP_ERROR = {
        CODE: "ERR_APP_ERROR",
        DESCRIPTION: "An internal error occurred"
    };
    public static INVALID_INPUT_DATA = {
        CODE: "ERR_INVALID_INPUT_DATA",
        DESCRIPTION: "Invalid inputs"
    };
    public static BAD_REQUEST = {
        CODE: "BAD_REQUEST",
        DESCRIPTION: "Request format not supported"
    };
    public static INVALID_CREDENTIALS = {
        CODE: "INVALID_CREDENTIALS",
        DESCRIPTION: "Credentials provided are invalid"
    };
    public static AUTH_ERROR = {
        CODE: "AUTH_ERROR",
        DESCRIPTION: "Unable to Authenticate user"
    };
    public static INVALID_DATA = {
        CODE: "INVALID_DATA",
        DESCRIPTION: "Invalid Data"
    };
    public static EMAIL_EXISTS = {
        CODE: "EMAIL_EXISTS",
        DESCRIPTION: "E-mail ID already exists"
    };
}
