const express = require('express');


const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

//===========================
// Obtener Prodcutos
//===========================
app.get('/productos', verificaToken, (req, res) => {
    
    let desde = Number(req.query.desde || 0);
    let limite = Number(req.query.limite || 5);

    Producto.find( {disponible: true} )
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
    

            Producto.count({disponible: true}, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    registros: conteo
                });
            });

        });

});


//===========================
// Obtener un producto por ID
//===========================
app.get('/productos/:id', (req, res) => {
    // usar populate: usuario categoria
    let id = req.params.id;

    Producto.findById( id )
    .populate('categoria', 'descripcion')
    .populate('usuario', 'nombre')
    .exec((err, productosDB) => {
       
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productosDB) {
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'El ID no es válido'
                }
            });
        }

            res.json({
                ok: true,
               producto: productosDB
            });

    });    
});


//===========================
// Buscar productos
//===========================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
let termino = req.params.termino;
let regex = new RegExp(termino, 'i');

    Producto.find({ nombre : regex})
                    .populate('categoria', 'nombre')
                    .exec( (err, productos) => {

                        if(err){
                            return res.status(500).json({
                                ok: false,
                                err
                            });
                        }

                        res.json({
                            ok: true,
                            productos
                        });

                    });

});



//===========================
// Crear un producto 
//===========================
app.post('/productos', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });
 
    producto.save((err, productoDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });


    });
    
});


//===========================
// Actualizar un producto
//===========================
app.put('/productos/:id', (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id , (err, productoDB) =>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'El ID no es válido'
                }
            });
        }

        productoDB.name = body.name;
        productoDB.precioUni = body.precioUni;
        productoDB.descripcion = body.descripcion;
        productoDB.disponible = body.disponible;
        productoDB.categoria = body.categoria;

        productoDB.save( (err, productoGuardado) => {
            if(err){
                return res.status(401).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });

        });


    });
    
});


//===========================
// Actualizar un producto
//===========================
app.delete('/productos/:id', (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) =>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(401).json({
                ok: false,
                err:{
                    message: 'El ID no es válido'
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save( (err, productoBorrado) => {
            
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                message: 'Producto Borrado'
            });
            
        });

    });
    
});



module.exports = app;