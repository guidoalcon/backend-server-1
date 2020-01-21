
var express= require('express');
var bcrypt= require('bcryptjs');

//var jwt= require('jsonwebtoken');
//var SEED= require('../config/config').SEED;

var mdAutenticacion= require('../middlewares/autenticacion');

var app = express();

var Usuario= require('../models/usuario');

//obtener todos los usuarios
app.get('/',(req,res,next)=>{

    Usuario.find({},
        'nombre email img role')
        .exec(
        (err,usuarios)=>{

        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando usuarios',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            usuarios:usuarios
            
        });
    });

	

});

//verificar token
/*
app.use('/',(req,res,next)=>{

    var token = req.query.token;

    jwt.verify(token, SEED,(err,decoded)=>{

        if(err){
            return res.status(401).json({
                ok: false,
                mensaje: 'token incorrecto',
                errors: err
            });
        }

        next();


    });




});
*/

//actualizar usuario

app.put('/:id',mdAutenticacion.verificaToken,(req,res)=>{

    var id= req.params.id;
    var body= req.body;

    Usuario.findById(id,(err,usuario)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            });
        }

        if( !usuario){
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con id no existe',
                errors: {message: 'no existe un usuario con ese id'}
            });
        }


        usuario.nombre= body.nombre;
        usuario.email= body.email;
        usuario.role= body.role;

        usuario.save((err,usuarioGuardado)=>{


            if(err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuarios',
                    errors: err
                });
            }

            usuarioGuardado.password= ':)';
            res.status(200).json({
                ok: true,
                usuario:usuarioGuardado
                
            });




        });

        

    });

  

});

//crear un nuevo usuario

app.post('/',mdAutenticacion.verificaToken,(req,res)=>{

    var body= req.body;

    var usuario= new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password),
        img: body.img,
        role:body.role
    });

    usuario.save((err,usuarioGuardado)=>{

        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error crear usuarios',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario:usuarioGuardado,
            usuariotoken:req.usuario
            
        });


    });


    


});

//eliminar usuario

app.delete('/:id',mdAutenticacion.verificaToken,(req,res)=>{

    var id= req.params.id;
    Usuario.findByIdAndRemove(id,(err,usuarioBorrado)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar usuarios',
                errors: err
            });
        }
        if(! usuarioBorrado){
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe usuarios con ese id',
                errors: {message:"No existe usuario"}
            });
        }

        res.status(200).json({
            ok: true,
            usuario:usuarioBorrado
            
        });
    })

})


module.exports= app;