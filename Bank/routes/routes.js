import express from 'express'

import {postAccount, testBankApi, postBankUser , addDeposit,getOneDeposit,createLoan,payLoan} from '../controller/bankController.js'


const router = express.Router();

router.post('/account',postAccount)
router.post('/bankUser',postBankUser)
router.post('/addDeposit',addDeposit)
router.post('/createLoan',createLoan)
router.patch('/payLoan/:id',payLoan)
router.get('/test',testBankApi)
router.get('/getDepoist/:id',getOneDeposit)


export default router;