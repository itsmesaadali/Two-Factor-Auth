import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import { SessionDocument } from "../../database/models/session.model";
import { UserDocument } from "../../database/models/user.model";
import { config } from "../../config/app.config";


function parseExpiry(value: string): number | `${number}${"s" | "m" | "h" | "d"}` {
    return /^\d+$/.test(value) ? Number(value) : value as `${number}${"s" | "m" | "h" | "d"}`;
}

export type AccessTPayload = {
    userId: UserDocument['_id'];
    sessionId: SessionDocument['_id'];
};

export type RefreshTPayload = {
    sessionId: SessionDocument['_id'];
};

type SignOptsAndSecret = SignOptions & {
    secret: string;
};

const signDefaults: SignOptions = {
    audience: ['user']
};

const verifyDefaults: VerifyOptions = {
    audience: ['user'] as [string]
};


export const accessTokenSignOptions: SignOptsAndSecret = {
    expiresIn: parseExpiry(config.JWT.ACCESS_TOKEN_EXPIRY),
    secret: config.JWT.ACCESS_TOKEN_SECRET
};

export const refreshTokenSignOptions: SignOptsAndSecret = {
    expiresIn: parseExpiry(config.JWT.REFRESH_TOKEN_EXPIRY),
    secret: config.JWT.REFRESH_TOKEN_SECRET
};




export const signJwtToken = (
    payload: AccessTPayload | RefreshTPayload,
    options?: SignOptsAndSecret
) => {
    const { secret, ...opts } = options || accessTokenSignOptions;
    return jwt.sign(payload, secret, {
        ...signDefaults,
        ...opts
    });
};

export const verifyJwtToken = <TPayload extends object = AccessTPayload>(
    token: string, 
    options?: VerifyOptions & { secret: string }
) => {
    try {
        const { secret = config.JWT.ACCESS_TOKEN_SECRET, ...opts } = options || {};
        const payload = jwt.verify(token, secret, {
            ...verifyDefaults,
            ...opts
        }) as TPayload;
        return { payload };
    } catch (error: any) {
        return error.message;
    }
};
