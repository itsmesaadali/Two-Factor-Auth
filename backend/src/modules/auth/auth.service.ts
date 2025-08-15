import { ErrorCode } from "../../common/enums/error-code.enum";
import { VerificationEnum } from "../../common/enums/verification-code.enum";
import { LoginDto, RegisterDto } from "../../common/interface/auth.interface";
import {
  BadRequestException,
  UnauthorizedException,
} from "../../common/utils/catch-errors";
import {
  calculateExpirationDate,
  fortyFiveMinutedFromNow,
  ONE_DAY_IN_MS,
} from "../../common/utils/date-time";
import SessionModel from "../../database/models/session.model";
import UserModel from "../../database/models/user.model";
import VerifiactionCodeModel from "../../database/models/verification.model";
import {
  refreshTokenSignOptions,
  RefreshTPayload,
  signJwtToken,
  verifyJwtToken,
} from "../../common/utils/jwt";
import { config } from "../../config/app.config";

export class AuthService {
  public async register(registerData: RegisterDto) {
    const { name, email, password } = registerData;

    const existingUser = await UserModel.exists({
      email,
    });

    if (existingUser) {
      throw new BadRequestException(
        "User already exists with this email",
        ErrorCode.AUTH_EMAIL_ALREADY_EXISTS
      );
    }

    const newUser = await UserModel.create({
      name,
      email,
      password,
    });

    const userId = newUser._id;

    const verifiactionCode = await VerifiactionCodeModel.create({
      userId,
      type: VerificationEnum.EMAIL_VERIFICATION,
      expiredAt: fortyFiveMinutedFromNow(),
    });

    // sending verification email link

    return {
      user: newUser,
    };
  }

  public async login(loginData: LoginDto) {
    const { email, password, userAgent } = loginData;

    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      throw new BadRequestException(
        "Invalid email or password provided",
        ErrorCode.AUTH_NOT_FOUND
      );
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new BadRequestException(
        "Invalid email or password provided",
        ErrorCode.AUTH_NOT_FOUND
      );
    }

    // check if the user enable 2fa return user = null
    const session = await SessionModel.create({
      userId: user._id,
      userAgent,
    });

    const accessToken = signJwtToken({
      userId: user._id,
      sessionId: session._id,
    });

    const refreshToken = signJwtToken(
      {
        sessionId: session._id,
      },
      refreshTokenSignOptions
    );

    return {
      user,
      accessToken,
      refreshToken,
      mfaRequired: false,
    };
  }

  public async refreshToken(refreshToken: string) {
    const { payload } = verifyJwtToken<RefreshTPayload>(refreshToken, {
      secret: refreshTokenSignOptions.secret,
    });

    if (!payload) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const session = await SessionModel.findById(payload.sessionId);
    const now = Date.now();

    if (!session) {
      throw new UnauthorizedException("Session does not exist");
    }

    if (session.expiredAt.getTime() <= now) {
      throw new UnauthorizedException("Session expired");
    }

    const sessionRequiresRefresh =
      session.expiredAt.getTime() - now <= ONE_DAY_IN_MS;

    let newRefreshToken: string | undefined = undefined;
    if (sessionRequiresRefresh) {
      session.expiredAt = calculateExpirationDate(
        config.JWT.REFRESH_TOKEN_EXPIRY
      );
      await session.save();

      newRefreshToken = signJwtToken(
        { sessionId: session._id },
        refreshTokenSignOptions
      );
    }

    const accessToken = signJwtToken({
      userId: session.userId,
      sessionId: session._id,
    });

    return { accessToken, newRefreshToken };
  }
}
