

const Proyecto = require('../models/Proyecto')
const { validationResult } = require('express-validator')

exports.crearProyecto = async (req, res) => {

    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({error: errores.array()})
    }


    try {
        //
        const proyecto = new Proyecto(req.body);
        //guardar el creador con el JWT
        proyecto.creador = req.usuario.id;

        await proyecto.save();
        res.json(proyecto);
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'hubo un error'})
    }
}

//Obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req,res)=>{
    try {
        const proyectos = await Proyecto.find({creador: req.usuario.id }).sort( {creado: -1});
        res.json({proyectos});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'hubo un error'})
    }
}

//Actualiza un proyecto
exports.actualizarProyecto = async (req,res)=>{

    const errores = validationResult(req);
    if(!errores.isEmpty()){
       return res.status(400).json({error: errores.array()})
    }

    const { nombre }= req.body;
    const nuevoProyecto = {};

    if(nombre){
        nuevoProyecto.nombre = nombre;
    }

    try {
        //Revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);
        //Valdiar si existe
        if(!proyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        //Validar creador
        if(proyecto.creador.toString()!== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'})
        }

        //Actualizar
        proyecto = await Proyecto.findByIdAndUpdate({_id: req.params.id}, { $set : nuevoProyecto }, { new: true});

        res.json({proyecto});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'hubo un error en el servidor'})
    }
}

exports.eliminarProyecto = async (req, res)=>{

    try {
        //Revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);
        //Valdiar si existe
        if(!proyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        //Validar creador
        if(proyecto.creador.toString()!== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'})
        }

        await Proyecto.findOneAndRemove({_id: req.params.id})
        res.json({msg: 'Proyecto eliminado'})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'hubo un error en el servidor'})
    }
}