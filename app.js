//Requires
var express= require('express');
var mongoose = require('mongoose');
var bodyParser= require('body-parser');


// inicializar variables

var app= express();



//BODY PARSER
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


//conexion a base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',(err,res)=>{

	if(err) throw err;

	console.log('base de datos','online');

});



//importar rutas
var appRoutes= require('./routes/app');
var usuarioRoutes= require('./routes/usuario');
var loginRoutes= require('./routes/login');


app.use('/usuario',usuarioRoutes);
app.use('/login',loginRoutes);
app.use('/',appRoutes);

// excuchar peticiones


app.listen(3000,()=>{
	console.log('express server puerto 3000:','online');
})
