import express from 'express'

import { 
    test,
    createBorger,
    readBorger, 
    updateBorger
    // deleteBorger 
} 
    from '../controller/borgerController.js';

const router = express.Router();

// router.get('/',getBorger);
router.get('/test', test);
router.post('/createBorger', createBorger);
router.get('/readBorger', readBorger);
router.put('/updateBorger/:id', updateBorger);
// router.patch('/:id', updateBorger);
// router.delete('/:id', deleteBorger);
export default router;