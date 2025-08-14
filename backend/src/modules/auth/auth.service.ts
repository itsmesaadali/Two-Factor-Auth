import jwt, { SignOptions } from "jsonwebtoken";
import { ErrorCode } from "../../common/enums/error-code.enum";
import { VerificationEnum } from "../../common/enums/verification-code.enum";
import { LoginDto, RegisterDto } from "../../common/interface/auth.interface";
import { BadRequestException } from "../../common/utils/catch-errors";
import { fortyFiveMinutedFromNow } from "../../common/utils/date-time";
import SessionModel from "../../database/models/session.model";
import UserModel from "../../database/models/user.model";
import VerifiactionCodeModel from "../../database/models/verification.model";
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

    const accessToken = jwt.sign(
      { userId: user._id, sessionId: session._id },
      config.JWT.ACCESS_TOKEN_SECRET,
      {
        audience: ["user"], 
        expiresIn: config.JWT.ACCESS_TOKEN_EXPIRY,
      } as SignOptions
    );

    const refreshToken = jwt.sign(
      { sessionId: session._id },
      config.JWT.REFRESH_TOKEN_SECRET,
      {
        audience: ["user"], 
        expiresIn: config.JWT.REFRESH_TOKEN_EXPIRY,
      } as SignOptions
    );

    return {
      user,
      accessToken,
      refreshToken,
      mfaRequired:false,
    }
  }
}
