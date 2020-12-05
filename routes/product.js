const express = require('express')
const router = express.Router()

const { isAdmin, requireSignin, isAuth } = require('../controller/auth')
const { userById } = require('../controller/user')
const { 
    create, 
    read, 
    remove, 
    update, 
    productById, 
    list, 
    listRelated, 
    listCategories, 
    listBySearch,
    photo

    } = require('../controller/product')

router.get('/product/:productId', read)
router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create)
router.delete('/product/:productId/:userId', requireSignin, isAuth, isAdmin, remove)
router.put('/product/:productId/:userId', requireSignin, isAuth, isAdmin, update)

router.get('/products', list)
router.get('/products/categories', listCategories)
router.get('/product/related/:productId', listRelated)
router.post('/products/by/search', listBySearch)
router.get('/product/photo/:productId', photo)


router.param("userId", userById)
router.param("productId", productById)

module.exports = router