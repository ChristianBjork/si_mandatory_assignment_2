import express from 'express'

import {createBorger } from '../controllers/borgerControllers.js'

const router = express.Router();

// router.get('/',getBorger);
// router.get('/all',getAllBorger);
router.post('/', createBorger);
// router.patch('/:id', updateBorger)
// router.delete('/:id', deleteBorger)
export default router;