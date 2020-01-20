//Requires
var express= require('express');
var mongoose = require('mongoose');


// inicializar variables

var app= express();

//conexion a base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',(err,res)=>{

	if(err) throw err;

	console.log('base de datos','online');

});



//rutas
app.get('/',(req,res,next)=>{

	res.status(200).json({
		ok: true,
		mensaje: 'Peticion realizada correctamente'
	});

});


// excuchar peticiones


app.listen(3000,()=>{
	console.log('express server puerto 3000:','online');
})
