const User = require('../model/user')

exports.userById = (req,res,next,id)=>{
    User.findById(id).exec((err,user)=>{
        if(err||!user){
            return res.status(400).json({
                error:"USER not found"
            })
        }
        req.profile = user;
        next()
    })
}

exports.read =(req,res)=>{
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}

exports.update =(req,res)=>{
    console.log("ivideee")
    console.log(req.profile._id)
    User.findOneAndUpdate(
        { _id: req.profile._id},
        {$set : req.body},
        {new:true},
        (err,user)=>{
            if(err){
                return res.status(400).json({
                    error:'You are not authorised'
                })
            }
            req.profile.hashed_password = undefined
            req.profile.salt = undefined
            res.json(user)
        }
    )
}