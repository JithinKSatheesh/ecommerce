const { errorHandler } = require('../helpers/dbErrorHandler')
const Category = require('../model/category')

exports.categoryById = (req,res,next,id)=>{
    Category.findById(id).exec((err,category)=>{
        if(err||!category){
            console.log("error happended here")
            return res.status(400).json({
                error:"category does not exist"
            })
        }
        req.category = category
        next()
    })
}

exports.create = (req,res)=>{
    const category = new Category(req.body)
    category.save((err,data)=>{
        if(err){
            return res.status(400).json({
                error:errorHandler(err)
            })
        }
        res.json({data})
    })
}

exports.read=(req,res)=>{
    return res.json(req.category) 
}

exports.update=(req,res)=>{
    const category = req.category
    category.name = req.body.name
    category.save((err,data)=>{
        if(err){
            return req.status(400).json({
                error:errorHandler(err)
            })
        }
        res.json(data)
    })
}

exports.remove=(req,res)=>{
    const category = req.category
    category.remove((err,deletedCategory)=>{
        if(err){
            return res.status(400).json({
                error:errorHandler(err)
            })
        }
        res.json({
            message:"Category deleted"
        })
    })
}

exports.list=(req,res)=>{
    Category.find().exec((err,data)=>{
        if(err){
            return res.json({
                error:errorHandler(err)
            })
        }
        return res.json(data)
    })
    
}