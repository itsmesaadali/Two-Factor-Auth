import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { MfaService } from "./mfa.service";
import { HTTPSTATUS } from "../../config/http.config";

export class MfaController {
    private mfaService:MfaService;

    constructor(mfaService: MfaService) {
        this.mfaService = mfaService;
    }

    public generateMFASetup = asyncHandler(
        async(req:Request, res:Response): Promise<any> => {

            const {secret, qrImageUrl, message } = await this.mfaService.generateMFASetup(req);

            return res.status(HTTPSTATUS.OK).json({
                message,
                secret,
                qrImageUrl,
            })
        }
    )
}