const Usuario = require('../models/Usuario')
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

exports.crearUsuario = async (req, res) => {

    //revisar si hay errores 
    const errores = validationResult(req);
    if(!errores.isEmpty()){
       return res.status(400).json({error: errores.array()})
    }

    const { email, password } = req.body;
    try {
        let usuario = await Usuario.findOne({ email })

        if(usuario) return res.status(400).json({msg: 'user already exists'})

        usuario = new Usuario(req.body);
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        await usuario.save();

        //Crear y Firmar con JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };
        //Firmar el JWT
        jwt.sign(payload, process.env.SECRETA,{
            expiresIn: 3600
        }, (error, token) => {
            if(error) throw error;
            res.json({token})
        }
        )


        // res.json({msg: 'User Created'})
    } catch (error) {
        console.log(error);
        res.status(400).send('There is an Error')
    }
}
