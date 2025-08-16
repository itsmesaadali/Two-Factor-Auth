import { Router } from "express";
import { mfaController } from "./mfa.module";
import { authenticateJWT } from "../../common/strategies/jwt.strategy";


const mfaRoutes = Router();

mfaRoutes.get('/setup', authenticateJWT, mfaController.generateMFASetup)

export default mfaRoutes;