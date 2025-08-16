import { Request } from "express";
import speakeasy from "speakeasy";
import qrcode from 'qrcode'
import { UnauthorizedException } from "../../common/utils/catch-errors";

export class MfaService {
  public async generateMFASetup(req: Request) {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException("User not authorized");
    }

    if (user.userPreferences.enable2FA) {
      return {
        message: "MFA already enabled",
      };
    }

    let secretKey = user.userPreferences.twoFactorSecret;
    if (!secretKey) {
      const secret = speakeasy.generateSecret({ name: "SAAD 2FA" });
      secretKey = secret.base32;
      user.userPreferences.twoFactorSecret = secretKey;
      await user.save();
    }

    const url = speakeasy.otpauthURL({
        secret:secretKey,
        label:`${user.name}`,
        issuer:'saad.com',
        encoding:'base32'
    });

    const qrImageUrl = await qrcode.toDataURL(url);

    return {
        message:'Scan th QR code or use to setup key',
        secret: secretKey,
        qrImageUrl,
    }
  }
}
