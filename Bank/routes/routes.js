import express from 'express'

import {postBankUser, testBankApi } from '../controller/bankController.js'


const router = express.Router();

router.post('/',postBankUser)
router.get('/test',testBankApi)

export default router;