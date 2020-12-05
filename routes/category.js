const express = require('express')
const router = express.Router()

const { isAdmin, requireSignin, isAuth } = require('../controller/auth')
const {create,read,remove,list,update,categoryById} = require('../controller/category')
const { userById } = require('../controller/user')

router.get('/category/:categoryId',read)
router.post('/category/create/:userId',requireSignin,isAuth,isAdmin,create)
router.put('/category/:categoryId/:userId',requireSignin,isAuth,isAdmin,update)
router.delete('/category/:categoryId/:userId',requireSignin,isAuth,isAdmin,remove)
router.get('/category/',list)


router.param("userId",userById)
router.param("categoryId",categoryById)


module.exports = router