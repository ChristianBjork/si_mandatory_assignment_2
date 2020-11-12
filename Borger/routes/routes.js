import express from 'express'

import { 
    test,
    createBorger 
    // updateBorger,
    // deleteBorger 
} 
    from '../controller/borgerControllers.js';

const router = express.Router();

// router.get('/',getBorger);
router.post('/createBorger', createBorger);
router.get('/test', test);
// router.patch('/:id', updateBorger);
// router.delete('/:id', deleteBorger);
export default router;