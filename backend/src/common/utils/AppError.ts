import { HTTPSTATUS, HttpStatusCode } from "../../config/http.config";
import { ErrorCode } from "../enums/error-code.enum";

export class AppError extends Error {
    public  statusCode: HttpStatusCode;
    public  errorCode?: ErrorCode;
    
    constructor( message: string , statusCode = HTTPSTATUS.INTERNAL_SERVER_ERROR) {
        
    }
}