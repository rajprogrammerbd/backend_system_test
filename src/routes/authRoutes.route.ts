import express from 'express';
const router = express.Router();
import authControllers from "../controllers/auth.controllers";

router.post('/register', authControllers.registerUsers);

export default router;
