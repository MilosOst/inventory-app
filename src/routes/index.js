import express from 'express';
import {index} from '../controllers/homeController.js';

const router = express.Router();

/* GET home page. */
router.get('/', index)

export default router;