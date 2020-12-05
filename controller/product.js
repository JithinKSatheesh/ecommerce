const Product = require('../model/product')
const formidable = require('formidable')
const fs = require('fs')
const _ = require('lodash')
// const { result } = require('lodash')
const { errorHandler } = require('../helpers/dbErrorHandler')
const product = require('../model/product')



exports.productById = (req,res,next,id)=>{
    Product.findById(id).exec((err,product)=>{
        if(err||!product){
            return res.json({
                error:"product not found"
            })
        }
        req.product = product
        next()
    })
}

exports.read = (req,res)=>{
    req.product.photo = undefined
    return res.json(req.product)
}

exports.remove = (req,res)=>{
    let product =  req.product
    product.remove((err,deletedProduct)=>{
        if(err){
            return res.status(400).json({
                error:errorHandler(err)
            })
        }
        res.json({
            "message":"product deleted successfully"
        })
    })
}

exports.update =(req,res)=>{
    const form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(400).json({
                error:"Image could not be uploaded"
            })
        }
        // checking all fields are present
        const {name,description,price,category,quantity,shipping} = fields
        if(!name||!description||!price||!category||!quantity||!shipping){
            return res.status(400).json({
                error:"All field are required!"
            })
        }

         let product = req.product
         product = _.extend(product,fields)
        
        
        // checking photo file size
        if(files.photo){
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error:"Image should be less 1Mb "
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }
        // saving to database
        product.save((err,result)=>{
            if(err){
                
                return res.status(400).json({
                    error:errorHandler(err)
                })
            }
            res.json(result)

        })
    })

}

exports.create = (req,res)=>{
    console.log("here")
    const form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(400).json({
                error:"Image could not be uploaded"
            })
        }
        // checking all fields are present
        const {name,description,price,category,quantity,shipping} = fields
        if(!name||!description||!price||!category||!quantity||!shipping){
            return res.status(400).json({
                error:"All field are required!"
            })
        }

        let product = new Product(fields)
        
        
        // checking photo file size
        if(files.photo){
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error:"Image should be less 1Mb "
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }
        // saving to database
        product.save((err,result)=>{
            if(err){
                
                return res.status(400).json({
                    error:errorHandler(err)
                })
            }
            res.json(result)

        })
    })

}

// ============


exports.list = (req,res)=>{
    let order = req.query.order?req.query.order: 'asc'
    let sortBy = req.query.sortBy?req.query.sortBy: '_id'
    let limit = req.query.limit?parseInt(req.query.limit): 6

    Product.find()
        .select("-photo")
        .populate('category')
        .sort([[sortBy,order]])
        .limit(limit)
        .exec((err,products)=>{
            if(err){
                return res.status(400).json({
                    error:'Product not found'
                })
            }
            res.send(products)
        })
}

exports.listRelated = (req,res)=>{
    let limit = req.query.limit?parseInt(req.query.limit): 6

    Product.find({'_id':{$ne:req.product},category : req.product.category})
        .limit(limit)
        .populate("category","_id name")
        .exec((err,products)=>{
            if(err){
                return res.status(400).json({
                    error:"product not found"
                })
            }
            res.json(products)
        })
 
}

exports.listCategories = (req,res)=>{
    Product.distinct("category",{},(err,categories)=>{
        if(err){
            return res.status(400).json({
                error:"categories not found"
            })
        }
        res.json(categories)
    })
}

exports.listBySearch =(req,res)=>{
    let order = req.query.order?req.query.order: 'asc'
    let sortBy = req.query.sortBy?req.query.sortBy: '_id'
    let limit = req.query.limit?parseInt(req.query.limit): 100
    let skip = parseInt(req.body.skip)
    let findArgs = {}

    for(let key in req.body.filters){
        if(req.body.filters[key].length > 0){
            if(key === "price"){
                findArgs[key] = {
                    $gte:req.body.filters[key][0],
                    $lte:req.body.filters[key][1]
                }
            }else{
                findArgs[key] = req.body.filters[key]
            }
        }
    }

    Product.find(findArgs)
        .select("-photo")
        .populate('category')
        .sort([[sortBy,order]])
        .skip(skip)
        .limit(limit)
        .sort([[sortBy, order]])
        .exec((err,data)=>{
            if(err){
                return res.status(400).send(err)
            }
            res.json({
                size:data.length,
                data
            })
        })
}

exports.photo =(req,res,next)=>{
    if(req.product.photo.data){
        res.set('Content-Type',req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()

}