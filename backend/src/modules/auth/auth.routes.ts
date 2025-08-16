import { Router } from "express";
import { authController } from "./auth.module";
import { authenticationJWT } from "../../common/strategies/jwt.strategy";


const authRoutes = Router()

authRoutes.post('/register',authController.register);
authRoutes.post('/login',authController.login);
authRoutes.post('/verify/email', authController.verifyEmail);
authRoutes.post('/password/forgot', authController.forgotPassword);
authRoutes.post('/password/reset', authController.passwordReset);
authRoutes.post('/logout',authenticationJWT ,authController.logout);

authRoutes.get('/refresh',authController.refreshToken);

export default authRoutes;