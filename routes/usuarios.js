// Rutas para crear usuarios
const express = require('express')
const router = express.Router();
const usuarioController = require('../controller/usuarioController')
const { check } = require('express-validator')

// api/usuarios
router.post('/',
    [
        check('nombre','Name can nott be empty').not().isEmpty(),
        check('email','insert a valid email').isEmail(),
        check('password','Password should have 6 characters minimum').isLength({min: 6})
    ],
    usuarioController.crearUsuario
);

module.exports = router;