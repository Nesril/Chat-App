function localVariable(req, res, next){
    req.app.locals = {
        OTP : null,
        resetSession : false,
        online:false,
        User:null,
    }
    next()
}

module.exports={localVariable}