import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { MfaService } from "./mfa.service";
import { HTTPSTATUS } from "../../config/http.config";
import {
  verifyMFAForLoginSchema,
  verifyMfaSchema,
} from "../../common/validators/mfa.validator";
import { setAuthenticationCookies } from "../../common/utils/cookie";

export class MfaController {
  private mfaService: MfaService;

  constructor(mfaService: MfaService) {
    this.mfaService = mfaService;
  }

  public generateMFASetup = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const { secret, qrImageUrl, message } =
        await this.mfaService.generateMFASetup(req);

      return res.status(HTTPSTATUS.OK).json({
        message,
        secret,
        qrImageUrl,
      });
    }
  );

  public verifyMFASetup = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const { code, secretKey } = verifyMfaSchema.parse({
        ...req.body,
      });

      const { userPreferences, message } = await this.mfaService.verifyMFASetup(
        req,
        code,
        secretKey
      );

      return res.status(HTTPSTATUS.OK).json({
        message: message,
        userPreferences: userPreferences,
      });
    }
  );

  public revokeMFA = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const { message, userPreferences } = await this.mfaService.revokeMFA(req);

      return res.status(HTTPSTATUS.OK).json({
        message,
        userPreferences,
      });
    }
  );

  public verifyMFAForLogin = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const { code, email, userAgent } = verifyMFAForLoginSchema.parse({
        ...req.body,
        userAgent: req.headers["user-agent"],
      });
      const { user, accessToken, refreshToken } =
        await this.mfaService.verifyMFAForLogin(code, email, userAgent);

      return setAuthenticationCookies({ res, accessToken, refreshToken })
        .status(HTTPSTATUS.OK)
        .json({
          message: "Verified & login successfully",
          user,
        });
    }
  );
}
