var jwt= require('jsonwebtoken');
var SEED= require('../config/config').SEED;
//verificar token

exports.verificaToken= function(req,res,next){


    var token = req.query.token;

    jwt.verify(token, SEED,(err,decoded)=>{

        if(err){
            return res.status(401).json({
                ok: false,
                mensaje: 'token incorrecto',
                errors: err
            });
        }

        req.usuario= decoded.usuario;

        next();


    });
}

/// verifica admin

exports.verificaADMIN_ROLE= function(req,res,next){


    var usuario = req.usuario;

    if( usuario.role === 'ADMIN_ROLE'){
        next();
        return;
    }else{

           return res.status(401).json({
                ok: false,
                mensaje: 'No es adminitrador',
                errors: {message: ' No es administrador , no puede hacer eso'}
            });


    }


   
}

/// verifica admin

exports.verificaADMIN_o_MismoUsuario= function(req,res,next){


    var usuario = req.usuario;
    var id = req.params.id;

    if( usuario.role === 'ADMIN_ROLE' || usuario._id===id ){
        next();
        return;
    }else{

           return res.status(401).json({
                ok: false,
                mensaje: 'No es adminitrador, ni es el mismo usuario',
                errors: {message: ' No es administrador ni es el mismo usuario , no puede hacer eso'}
            });


    }


   
}

