import express from 'express';
const router = express.Router();
import appControllers from "../controllers/app.controllers"

router.post('/deposit', appControllers.deposit_amount);
router.post('/withdraw', appControllers.withDraw_amount)

export default router;
