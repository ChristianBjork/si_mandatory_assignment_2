import express from 'express';

import { 
    test,
    createUser,
    readUser, 
    updateUser,
    deleteUser,
    createSkatYear_UserYear,
    readYear,
    updateYear,
    deleteYear,
    payTaxes 
} 
    from '../controller/skatController.js';

const router = express.Router();

router.get('/test', test);
router.post('/createUser', createUser);
router.get('/readUser/:id', readUser);
router.patch('/updateUser/:id', updateUser);
router.delete('/deleteUser/:id', deleteUser);
router.post('/createSkatYear_UserYear', createSkatYear_UserYear)
router.get('/readYear/:id', readYear);
router.patch('/updateYear/:id', updateYear);
router.delete('/deleteYear/:id', deleteYear);
router.post('/pay-taxes', payTaxes);

export default router;