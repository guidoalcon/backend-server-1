
var express= require('express');
var bcrypt= require('bcryptjs');

//var jwt= require('jsonwebtoken');
//var SEED= require('../config/config').SEED;

var mdAutenticacion= require('../middlewares/autenticacion');

var app = express();

var Medico= require('../models/medico');

//obtener todos los medicos
app.get('/',(req,res,next)=>{

    var desde= req.query.desde || 0 ;
    desde= Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario','nombre email')
        .populate('hospital')
        .exec(
        (err,medicos)=>{

        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando medicoes',
                errors: err
            });
        }

         Medico.count({},(err,conteo)=>{

            res.status(200).json({
            ok: true,
             medicos:medicos,
            total:conteo
            
        });

        });

       
    });

    

});

// obtener  medico


app.get('/:id', (req,res)=>{

    var id= req.params.id;

    Medico.findById( id )
            .populate('usuario','nombre email img')
            .populate('hospital')
            .exec((err, medico)=>{

            if(err){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar medico',
                    errors: err
                });
            }

            if( !medico){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El medico con id no existe',
                    errors: {message: 'no existe un medico con ese id'}
                });
            } 

            return res.status(200).json({
                    ok: true,
                    medico: medico
                });  

            });



});
//actualizar medico

app.put('/:id',mdAutenticacion.verificaToken,(req,res)=>{

    var id= req.params.id;
    var body= req.body;

    Medico.findById(id,(err,medico)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }

        if( !medico){
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con id no existe',
                errors: {message: 'no existe un medico con ese id'}
            });
        }


        medico.nombre= body.nombre;
        medico.usuario= req.usuario._id;
        medico.hospital= body.hospital;

        medico.save((err,medicoGuardado)=>{


            if(err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medicos',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico:medicoGuardado
                
            });




        });

        

    });

  

});

//crear un nuevo medico

app.post('/',mdAutenticacion.verificaToken,(req,res)=>{

    var body= req.body;

    var medico= new Medico({
        nombre: body.nombre,
        usuario:req.usuario._id,
        hospital:body.hospital
    });

    medico.save((err,medicoGuardado)=>{

        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error crear medicos',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico:medicoGuardado,
            
            
        });


    });


    


});

//eliminar medico

app.delete('/:id',mdAutenticacion.verificaToken,(req,res)=>{

    var id= req.params.id;
    Medico.findByIdAndRemove(id,(err,medicoBorrado)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar medicos',
                errors: err
            });
        }
        if(! medicoBorrado){
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe medicos con ese id',
                errors: {message:"No existe medico"}
            });
        }

        res.status(200).json({
            ok: true,
            medico:medicoBorrado
            
        });
    })

})


module.exports= app;
