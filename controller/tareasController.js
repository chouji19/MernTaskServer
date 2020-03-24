
const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearTarea = async (req, res) => {

    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({error: errores.array()})
    }
    try {
        const {proyecto} = req.body;
        let existeProyecto = await Proyecto.findById(proyecto)
        if(!existeProyecto)
            return res.status(400).json({msg: 'Proyecto no encontrado'})
        //Revisar si el proyecto pertenece al usuario
        if(existeProyecto.creador.toString()!== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'})
        }

        const tarea = new Tarea(req.body);

        await tarea.save();
        res.json(tarea);
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'hubo un error'})
    }
}

//Obtiene todos los tareas del usuario actual
exports.obtenerTareas = async (req,res)=>{
    try {

        const {proyecto} = req.query;
        let existeProyecto = await Proyecto.findById(proyecto)
        if(!existeProyecto)
            return res.status(400).json({msg: 'Proyecto no encontrado'})
        //Revisar si el proyecto pertenece al usuario
        if(existeProyecto.creador.toString()!== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'})
        }

        const tareas = await Tarea.find({proyecto}).sort({creado: -1});
        res.json({tareas});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'hubo un error'})
    }
}

//Actualiza un tarea
exports.actualizarTarea = async (req,res)=>{

    const errores = validationResult(req);
    if(!errores.isEmpty()){
        res.status(400).json({error: errores.array()})
    }


    try {

        const {proyecto, nombre, estado } = req.body;
        let existeProyecto = await Proyecto.findById(proyecto)
        //Revisar si el proyecto pertenece al usuario
        //Revisar el ID
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea){
            return res.status(404).json({msg: 'Tarea no encontrada'})
        }

        if(existeProyecto.creador.toString()!== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'})
        }

        let nuevaTarea = {};
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;


        //Actualizar
        tarea = await Tarea.findByIdAndUpdate({_id: req.params.id}, { $set : nuevaTarea }, { new: true});

        res.json({tarea});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'hubo un error en el servidor'})
    }
}

exports.eliminarTarea = async (req, res)=>{

    try {       

        const {proyecto} = req.query;
         let existeProyecto = await Proyecto.findById(proyecto)
         if(existeProyecto.creador.toString()!== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'})
        }
        //Revisar el ID
        let tarea = await Tarea.findById(req.params.id);
        //Valdiar si existe
        if(!tarea){
            return res.status(404).json({msg: 'Tarea no encontrada'})
        }


        await Tarea.findOneAndRemove({_id: req.params.id})
        res.json({msg: 'Tarea eliminada'})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'hubo un error en el servidor'})
    }
}