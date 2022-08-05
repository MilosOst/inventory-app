import express from "express";

import * as brandController from '../controllers/brandController.js';

const router = express.Router();

router.get('/', brandController.index);

router.get('/add', brandController.brand_create_get);

router.post('/add', brandController.brand_create_post);


export default router;