//Requires
var express= require('express');
var mongoose = require('mongoose');
var bodyParser= require('body-parser');


// inicializar variables

var app= express();


// CORS
app.use(function(req, res, next) {
  //res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods","POST,GET,PUT,DELETE,OPTIONS");
  next();
});



//BODY PARSER
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


//conexion a base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',(err,res)=>{

	if(err) throw err;

	console.log('base de datos','online');

});

/*
// Server index config
var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads'));
*/


//importar rutas
var appRoutes= require('./routes/app');
var usuarioRoutes= require('./routes/usuario');
var loginRoutes= require('./routes/login');
var hospitalRoutes= require('./routes/hospital');
var medicoRoutes= require('./routes/medico');
var busquedaRoutes= require('./routes/busqueda');
var uploadRoutes= require('./routes/upload');
var imagenesRoutes= require('./routes/imagenes');


app.use('/img',imagenesRoutes);
app.use('/upload',uploadRoutes);
app.use('/busqueda',busquedaRoutes);
app.use('/usuario',usuarioRoutes);
app.use('/medico',medicoRoutes);
app.use('/hospital',hospitalRoutes);
app.use('/login',loginRoutes);
app.use('/',appRoutes);



// excuchar peticiones


app.listen(3000,()=>{
	console.log('express server puerto 3000:','online');
})
