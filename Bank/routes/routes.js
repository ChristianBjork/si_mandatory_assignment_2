import express from 'express'

import {postAccount,getAllAccounts,updateAccount, getOneAccount, deleteAccount, testBankApi, postBankUser , addDeposit,getOneDeposit,createLoan,payLoan,listLoans} from '../controller/bankController.js'


const router = express.Router();
// account routes
router.post('/account/post',postAccount)
router.delete('/account/delete/:id',deleteAccount)
router.get('/account/getOne/:id',getOneAccount)
router.get('/account/getAll',getAllAccounts)
router.patch('/account/update/:id',updateAccount)



router.post('/bankUser',postBankUser)
router.post('/addDeposit',addDeposit)
router.post('/createLoan',createLoan)
router.patch('/payLoan/:id',payLoan)
router.get('/test',testBankApi)
router.get('/getDepoist/:id',getOneDeposit)
router.get('/getListLoans/:id',listLoans)


export default router;