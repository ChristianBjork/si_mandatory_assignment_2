import express from 'express'

import { getBorgers, createBorger, updateBorger,deleteBorger } from '../controllers/borgerControllers.js'

const router = express.Router();

router.get('/',getBorger);
router.post('/', createBorger);
router.patch('/:id', updateBorger)
router.delete('/:id', deleteBorger)
export default router;