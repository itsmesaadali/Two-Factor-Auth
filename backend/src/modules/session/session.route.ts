import { Router } from "express";
import { sessionController } from "./session.module";


const sessionRoutes = Router();

sessionRoutes.get('/all', sessionController.getAllSession);

export default sessionRoutes;