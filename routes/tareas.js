const express = require('express');
const router = express.Router();
const tareasController = require('../controller/tareasController')
const auth = require('../middleware/auth')
const { check } = require('express-validator');

router.post('/',
    auth,
    [
        check('nombre','El nombre de la Tarea es obligatorio').not().isEmpty(),
        check('proyecto','El proyecto es obligatorio').not().isEmpty()
    ],
    tareasController.crearTarea);

router.get('/',
    auth,
    tareasController.obtenerTareas)

router.put('/:id',
    auth,
    [
        check('nombre','El nombre del Tarea es obligatorio').not().isEmpty()
    ],
    tareasController.actualizarTarea)
    

router.delete('/:id',
    auth,
    tareasController.eliminarTarea)

module.exports = router;