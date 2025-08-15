import { getEnv } from "../common/utils/get-env";

const appConfig = () => ({
    NODE_ENV: getEnv('NODE_ENV', 'development'),
    APP_ORIGIN: getEnv('APP_ORIGIN', 'localhost'),
    PORT: getEnv('PORT', '3000'),
    BASE_PATH: getEnv('BASE_PATH', '/api/v1'),
    MONGO_URI: getEnv('MONGO_URI'),

    JWT:{
        ACCESS_TOKEN_SECRET: getEnv('ACCESS_TOKEN_SECRET'),
        ACCESS_TOKEN_EXPIRY: getEnv('ACCESS_TOKEN_EXPIRY','1h'),
        REFRESH_TOKEN_SECRET: getEnv('REFRESH_TOKEN_SECRET'),
        REFRESH_TOKEN_EXPIRY: getEnv('REFRESH_TOKEN_EXPIRY','30d')
    },
    MAILER_SENDER: getEnv('MAILER_SENDER'),
    RESEND_API_KEY: getEnv('RESEND_API_KEY') 
})

export const config = appConfig()