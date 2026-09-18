const express = require('express');
const router = express.Router();
const ClienteControlador = require('../controllers/clientController');
const validarCuitYCampos = require('../middlewares/cuitValidator');

/**
 * Enrutador modular para cuentas agropecuarias (/clientes)
 */

// GET /clientes - Listado general de cuentas activas
router.get('/', ClienteControlador.listarClientes);

// GET /clientes/nuevo - Formulario de alta comercial (Proceso P1)
router.get('/nuevo', ClienteControlador.mostrarFormularioNuevo);

// POST /clientes - Alta de cuenta con validación fiscal de CUIT
router.post('/', validarCuitYCampos, ClienteControlador.crearCliente);

// GET /clientes/:accountNumber - Ficha técnica individual (Ruta dinámica)
router.get('/:accountNumber', ClienteControlador.obtenerDetalleCliente);

// PUT /clientes/:accountNumber - Actualización total de la cuenta
router.put('/:accountNumber', ClienteControlador.actualizarClienteTotal);

// PATCH /clientes/:accountNumber - Actualización parcial (agrónomo o contrato)
router.patch('/:accountNumber', ClienteControlador.actualizarClienteParcial);

// DELETE /clientes/:accountNumber - Eliminación de cuenta
router.delete('/:accountNumber', ClienteControlador.eliminarCliente);

module.exports = router;
