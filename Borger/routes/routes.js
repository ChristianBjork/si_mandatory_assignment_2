import express from 'express';

import { 
    test,
    createBorger,
    readBorger, 
    updateBorger,
    deleteBorger,
    createAddress,
    readAddress,
    updateAddress,
    deleteAddress 
} 
    from '../controller/borgerController.js';

const router = express.Router();

router.get('/test', test);
router.post('/createBorger', createBorger);
router.get('/readBorger', readBorger);
router.patch('/updateBorger/:id', updateBorger);
router.delete('/deleteBorger/:id', deleteBorger);
router.post('/createAddress', createAddress);
router.get('/readAddress', readAddress);
router.patch('/updateAddress/:id', updateAddress);
router.delete('/deleteAddress/:id', deleteAddress);
export default router;