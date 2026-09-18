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

// GET /clientes/:numeroCuenta - Ficha técnica individual (Ruta dinámica)
router.get('/:numeroCuenta', ClienteControlador.obtenerDetalleCliente);

// PUT /clientes/:numeroCuenta - Actualización total de la cuenta
router.put('/:numeroCuenta', ClienteControlador.actualizarClienteTotal);

// PATCH /clientes/:numeroCuenta - Actualización parcial (ej. agrónomo o contrato)
router.patch('/:numeroCuenta', ClienteControlador.actualizarClienteParcial);

// DELETE /clientes/:numeroCuenta - Eliminación de cuenta
router.delete('/:numeroCuenta', ClienteControlador.eliminarCliente);

module.exports = router;
