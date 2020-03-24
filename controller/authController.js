const Usuario = require('../models/Usuario')
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

exports.autenticarUsuario = async (req, res) => {

    //revisar si hay errores 
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        res.status(400).json({error: errores.array()})
    }

    const {email, password} = req.body;

    try {
        
        let usuario = await Usuario.findOne({email})
        if(!usuario){
            return res.status(400).json({msg: 'Invalid username or password'})
        }

        const passCorrecto = await bcryptjs.compare(password, usuario.password)
        if(!passCorrecto)
        {
            res.status(400).json({msg: 'Invalid password or username '})
        }
         const payload = {
            usuario: {
                id: usuario.id
            }
        };
        //Firmar el JWT
        jwt.sign(payload, process.env.SECRETA,{
            expiresIn: 36000
        }, (error, token) => {
            if(error) throw error;
            res.json({token})
        }
        )
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'hubo un error en el servidor'})
    }
}

//obtiene el usuario autenticado
exports.usuarioAutenticado = async (req,res)=>{
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({usuario});
    } catch (error) {
        console.log(error);
        
        res.status(500).json({msg: 'hubo un error en el servidor'})
    }
}