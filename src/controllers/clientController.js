const ClienteDAO = require('../models/ClientDAO');

/**
 * Controlador de Clientes Agropecuarios (clientController)
 * Coordina la lógica de negocio entre el DAO de datos y las vistas Pug o respuestas JSON.
 */
class ClienteControlador {
  /**
   * GET /clientes
   * Lista todos los clientes registrados.
   */
  static async listarClientes(req, res, next) {
    try {
      const clientes = await ClienteDAO.obtenerTodos();

      // Si la petición solicita JSON (Thunder Client o API)
      if (req.xhr || req.headers.accept?.includes('application/json') || req.query.format === 'json') {
        return res.status(200).json({
          total: clientes.length,
          clientes: clientes.map(c => c.aObjetoJSON())
        });
      }

      // Renderiza vista en Pug
      res.render('clients-list', {
        title: 'Cuentas Agropecuarias Activas - DWBE Agro',
        description: 'Gestión técnica y comercial de clientes agropecuarios registrados (Proceso P1).',
        clientes
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /clientes/nuevo
   * Muestra el formulario de alta comercial (Proceso P1).
   */
  static mostrarFormularioNuevo(req, res) {
    res.render('client-form', {
      title: 'Alta Comercial de Cuenta Agropecuaria (P1)',
      description: 'Formulario de registro y validación fiscal para productores y cuentas del agro.'
    });
  }

  /**
   * POST /clientes
   * Procesa el alta de un nuevo cliente.
   */
  static async crearCliente(req, res, next) {
    try {
      const nuevoCliente = await ClienteDAO.guardar(req.body);

      // Si es una petición API / Thunder Client
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(201).json({
          mensaje: 'Cuenta agropecuaria registrada exitosamente.',
          cliente: nuevoCliente.aObjetoJSON()
        });
      }

      // Si es envío desde formulario HTML web, redirige a la lista
      res.redirect(302, '/clientes');
    } catch (error) {
      // Si el número de cuenta ya existía
      if (error.message.includes('Ya existe una cuenta')) {
        if (req.xhr || req.headers.accept?.includes('application/json')) {
          return res.status(400).json({ error: error.message });
        }
        return res.status(400).render('client-form', {
          title: 'Error de Registro',
          description: 'El número de cuenta ya se encuentra registrado.',
          errores: [error.message],
          valoresPrevios: req.body
        });
      }
      next(error);
    }
  }

  /**
   * GET /clientes/:accountNumber
   * Muestra el detalle técnico y comercial de una cuenta específica (Ruta dinámica).
   */
  static async obtenerDetalleCliente(req, res, next) {
    try {
      const { accountNumber } = req.params;
      const cliente = await ClienteDAO.buscarPorNumeroCuenta(accountNumber);

      if (!cliente) {
        if (req.xhr || req.headers.accept?.includes('application/json')) {
          return res.status(404).json({
            error: 'Cliente no encontrado',
            mensaje: `No existe ninguna cuenta agropecuaria con el número ${accountNumber}.`,
            status: 404
          });
        }

        return res.status(404).render('404', {
          title: 'Cuenta No Encontrada',
          description: 'No se encontró la ficha técnica para la cuenta ingresada.',
          mensajeError: `No se encontró ninguna cuenta registrada con el número ${accountNumber}.`
        });
      }

      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(200).json({
          cliente: cliente.aObjetoJSON()
        });
      }

      res.render('client-detail', {
        title: `Ficha Técnica: ${cliente.clientName} (${cliente.accountNumber})`,
        description: `Información técnica, contrato y agrónomo referente asignado a ${cliente.clientName}.`,
        cliente
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /clientes/:accountNumber
   * Actualización total de los datos de la cuenta comercial.
   */
  static async actualizarClienteTotal(req, res, next) {
    try {
      const { accountNumber } = req.params;
      const clienteActualizado = await ClienteDAO.actualizarTotal(accountNumber, req.body);

      if (!clienteActualizado) {
        return res.status(404).json({
          error: 'Cliente no encontrado',
          mensaje: `No se encontró la cuenta ${accountNumber} para actualizar.`
        });
      }

      res.status(200).json({
        mensaje: 'Cuenta agropecuaria actualizada exitosamente.',
        cliente: clienteActualizado.aObjetoJSON()
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /clientes/:accountNumber
   * Actualización parcial de campos específicos (ej. cambio de agrónomo o tipo de contrato).
   */
  static async actualizarClienteParcial(req, res, next) {
    try {
      const { accountNumber } = req.params;
      const clienteModificado = await ClienteDAO.actualizarParcial(accountNumber, req.body);

      if (!clienteModificado) {
        return res.status(404).json({
          error: 'Cliente no encontrado',
          mensaje: `No se encontró la cuenta ${accountNumber} para modificar.`
        });
      }

      res.status(200).json({
        mensaje: 'Cuenta agropecuaria modificada parcialmente con éxito.',
        cliente: clienteModificado.aObjetoJSON()
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /clientes/:accountNumber
   * Eliminación o baja de la cuenta agropecuaria.
   */
  static async eliminarCliente(req, res, next) {
    try {
      const { accountNumber } = req.params;
      const clienteEliminado = await ClienteDAO.eliminar(accountNumber);

      if (!clienteEliminado) {
        return res.status(404).json({
          error: 'Cliente no encontrado',
          mensaje: `No se encontró la cuenta ${accountNumber} para eliminar.`
        });
      }

      res.status(200).json({
        mensaje: 'Cuenta agropecuaria eliminada exitosamente de clients.json.',
        cliente: clienteEliminado.aObjetoJSON()
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ClienteControlador;
