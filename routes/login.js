var express= require('express');
var bcrypt= require('bcryptjs');
var jwt= require('jsonwebtoken');
var SEED= require('../config/config').SEED;

var app = express();

var Usuario= require('../models/usuario');

//Google

var CLIENT_ID= require('../config/config').CLIENT_ID;
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


var mdAutenticacion= require('../middlewares/autenticacion');


app.get('/renuevatoken',mdAutenticacion.verificaToken,(req,res)=>{

     var token=jwt.sign({usuario: req.usuario}, SEED ,{expiresIn:14400}); // 4 hrs

    return res.status(200).json({
                ok: true,
                usuario: req.usuario,
                token:token
                
            });


});





// utentication google
async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  //const userid = payload['sub'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];

  return {
    nombre:payload.name,
    email:payload.email,
    img: payload.picture,
    google:true,
    //payload
  }
}

app.post('/google',async(err,res)=>{

    var token= req.body.token;
    var googleUser=await verify(token)
    .catch(e=>{
        return res.status(403).json({
                ok: false,
                mensaje: 'Token no valido'
                
            });

    });



    Usuario.findOne({email: googleUser.email},(err,usuarioDB)=>{

        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            });
        }

        if(usuarioDB){
            if(usuarioDB.google === false){
                 return res.status(400).json({
                ok: false,
                mensaje: 'Debe usar su autenticacion normal',
                
            });
            }else{


                var token=jwt.sign({usuario: usuarioDB}, SEED ,{expiresIn:14400}); // 4 hrs

                res.status(200).json({
                    ok: true,
                    usuario:usuarioDB,
                    id:usuarioDB._id,
                    token:token,
                    menu: obtenerMenu(usuarioDB.role)
                    //body:body
                    
                });



            }
        }else{
            // el usuario no existe, crear
            var usuario= new Usuario();
            usuario.nombre= googleUser.nombre;
            usuario.email= googleUser.email;
            usuario.img= googleUser.img;
            usuario.google= true;
            usuario.password= ':)';

            usuario.save((err,usuarioDB)=>{
                var token=jwt.sign({usuario: usuarioDB}, SEED ,{expiresIn:14400}); // 4 hrs

                res.status(200).json({
                    ok: true,
                    usuario:usuarioDB,
                    id:usuarioDB._id,
                    token:token,
                    menu: obtenerMenu(usuarioDB.role)
                    //body:body
                    
                });
            });


        }





    });

    /*
    return res.status(200).json({
                ok: true,
                mensaje: 'Ok',
                googleUser: googleUser
            });
*/
});


// autenticacion normal
app.post('/',(req,res)=>{

    var body= req.body;

    Usuario.findOne({email: body.email},(err, usuarioDB)=>{

        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            });
        }

        if(! usuarioDB){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: err
            });
        }

        if(! bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas ',
                errors: err
            });

        }

        //crear token
        usuarioDB.password=':)';
        var token=jwt.sign({usuario: usuarioDB}, SEED ,{expiresIn:14400}); // 4 hrs



        res.status(200).json({
            ok: true,
            mensaje:'login post correcto',
            usuario:usuarioDB,
            id:usuarioDB.id,
            token:token,
            menu: obtenerMenu(usuarioDB.role)
            //body:body
            
        });

    });

    

});


///para el menu
function obtenerMenu(ROLE){

    var menu=[{
    titulo:'Principal',
    icono: 'mdi mdi-gauge',
    submenu: [
      { titulo:'Dashboard',url:'/dashboard'},
      { titulo:'Progress',url:'/progress'},
      { titulo:'Gráficas',url:'/graficas1'},
      { titulo:'Promesas',url:'/promesas'},
      { titulo:'Rxjs',url:'/rxjs'}
    ]
  },
  {
    titulo:'Mantenimiento',
    icono: 'mdi mdi-folder-lock-open',
    submenu: [
      //{ titulo:'Usuarios',url:'/usuarios'},
      { titulo:'Medicos',url:'/medicos'},
      { titulo:'Hospitales',url:'/hospitales'}
    ]
  }
];

    if( ROLE == 'ADMIN_ROLE'){
        menu[1].submenu.unshift( { titulo:'Usuarios',url:'/usuarios'} );  // unshif lo pone al principio , push lo pone al final
    }

    return menu;
}

module.exports= app;