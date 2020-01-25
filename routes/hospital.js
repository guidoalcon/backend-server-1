


var express= require('express');
var bcrypt= require('bcryptjs');

//var jwt= require('jsonwebtoken');
//var SEED= require('../config/config').SEED;

var mdAutenticacion= require('../middlewares/autenticacion');

var app = express();

var Hospital= require('../models/hospital');

//obtener todos los Hospitals
app.get('/',(req,res,next)=>{


    var desde= req.query.desde || 0 ;
    desde= Number(desde);

    Hospital.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario','nombre email')
        .exec(
        (err,hospitales)=>{

        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando hospitales',
                errors: err
            });
        }

        Hospital.count({},(err,conteo)=>{

            res.status(200).json({
            ok: true,
            hospitales:hospitales,
            total:conteo
            
        });

        });

        
    });

    

});


//actualizar Hospital

app.put('/:id',mdAutenticacion.verificaToken,(req,res)=>{

    var id= req.params.id;
    var body= req.body;

    Hospital.findById(id,(err,hospital)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        if( !hospital){
            return res.status(400).json({
                ok: false,
                mensaje: 'El Hospital con id no existe',
                errors: {message: 'no existe un hospital con ese id'}
            });
        }


        hospital.nombre= body.nombre;
        hospital.usuario= req.usuario._id;

        hospital.save((err,hospitalGuardado)=>{


            if(err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar Hospitals',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital:hospitalGuardado
                
            });




        });

        

    });

  

});

//crear un nuevo Hospital

app.post('/',mdAutenticacion.verificaToken,(req,res)=>{

    var body= req.body;

    var hospital= new Hospital({
        nombre: body.nombre,
        usuario:req.usuario._id
    });

    hospital.save((err,hospitalGuardado)=>{

        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error crear hospitals',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital:hospitalGuardado,
            
            
        });


    });


    


});

//eliminar Hospital

app.delete('/:id',mdAutenticacion.verificaToken,(req,res)=>{

    var id= req.params.id;
    Hospital.findByIdAndRemove(id,(err,hospitalBorrado)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar hospitals',
                errors: err
            });
        }
        if(! hospitalBorrado){
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe Hospitals con ese id',
                errors: {message:"No existe Hospital"}
            });
        }

        res.status(200).json({
            ok: true,
            hospital:hospitalBorrado
            
        });
    })

})


module.exports= app;