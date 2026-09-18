const ClienteDAO = require('../models/ClientDAO');

/**
 * Controlador de Clientes Agropecuarios
 * Gestiona el flujo entre la capa de datos (ClienteDAO) y las respuestas de la aplicación.
 */
class ClienteControlador {
  /**
   * GET /clientes
   * Lista todas las cuentas agropecuarias registradas.
   */
  static async listarClientes(req, res, next) {
    try {
      const listaClientes = await ClienteDAO.obtenerTodos();

      // Si la petición solicita formato JSON
      if (req.xhr || req.headers.accept?.includes('application/json') || req.query.formato === 'json') {
        return res.status(200).json({
          totalCuentas: listaClientes.length,
          cuentas: listaClientes.map(c => c.aObjetoJSON())
        });
      }

      // Renderiza vista en Pug
      res.render('clients-list', {
        title: 'Cuentas Agropecuarias Activas - AgroGestión P1',
        description: 'Padrón de cuentas de productores agropecuarios registrados en el sistema.',
        clientes: listaClientes
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /clientes/nuevo
   * Muestra la pantalla del formulario de alta comercial.
   */
  static mostrarFormularioNuevo(req, res) {
    res.render('client-form', {
      title: 'Alta de Cuenta Agropecuaria - Proceso P1',
      description: 'Formulario de registro y validación técnica/comercial para productores del agro.'
    });
  }

  /**
   * POST /clientes
   * Registra una nueva cuenta agropecuaria.
   */
  static async crearCliente(req, res, next) {
    try {
      const nuevoCliente = await ClienteDAO.guardar(req.body);

      // Si es una petición API / Thunder Client
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(201).json({
          mensaje: 'Cuenta agropecuaria registrada exitosamente.',
          cuenta: nuevoCliente.aObjetoJSON()
        });
      }

      // Redirección en formulario web
      res.redirect(302, '/clientes');
    } catch (error) {
      if (error.message.includes('Ya existe una cuenta')) {
        if (req.xhr || req.headers.accept?.includes('application/json')) {
          return res.status(400).json({ error: error.message });
        }
        return res.status(400).render('client-form', {
          title: 'Error al Registrar Cuenta',
          description: 'El número de cuenta ya se encuentra registrado.',
          errores: [error.message],
          valoresPrevios: req.body
        });
      }
      next(error);
    }
  }

  /**
   * GET /clientes/:numeroCuenta
   * Ficha técnica dinámica de una cuenta individual.
   */
  static async obtenerDetalleCliente(req, res, next) {
    try {
      const { numeroCuenta } = req.params;
      const clienteEncontrado = await ClienteDAO.buscarPorNumeroCuenta(numeroCuenta);

      if (!clienteEncontrado) {
        if (req.xhr || req.headers.accept?.includes('application/json')) {
          return res.status(404).json({
            error: 'Cuenta no encontrada',
            mensaje: `No existe ninguna cuenta agropecuaria con el identificador ${numeroCuenta}.`,
            estado: 404
          });
        }

        return res.status(404).render('404', {
          title: 'Cuenta No Encontrada',
          description: 'No se encontró la cuenta agropecuaria solicitada.',
          mensajeError: `No se encontró ninguna cuenta registrada con el número ${numeroCuenta}.`
        });
      }

      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(200).json({
          cuenta: clienteEncontrado.aObjetoJSON()
        });
      }

      res.render('client-detail', {
        title: `Ficha Técnica: ${clienteEncontrado.nombreCliente} (${clienteEncontrado.numeroCuenta})`,
        description: `Información técnica, contractual y agrónomo referente asignado a ${clienteEncontrado.nombreCliente}.`,
        cliente: clienteEncontrado
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /clientes/:numeroCuenta/editar
   * Muestra la vista Pug con el formulario para editar una cuenta existente.
   */
  static async mostrarFormularioEdicion(req, res, next) {
    try {
      const { numeroCuenta } = req.params;
      const cliente = await ClienteDAO.buscarPorNumeroCuenta(numeroCuenta);

      if (!cliente) {
        return res.status(404).render('404', {
          title: 'Cuenta No Encontrada',
          description: 'No se encontró la cuenta que desea modificar.',
          mensajeError: `No se encontró la cuenta ${numeroCuenta} para editar.`
        });
      }

      res.render('client-edit', {
        title: `Modificar Cuenta: ${cliente.numeroCuenta}`,
        description: `Formulario de edición para la cuenta de ${cliente.nombreCliente}.`,
        cliente
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /clientes/:numeroCuenta/editar
   * Procesa la modificación desde el formulario web y redirige a la ficha técnica.
   */
  static async procesarEdicionWeb(req, res, next) {
    try {
      const { numeroCuenta } = req.params;
      const clienteActualizado = await ClienteDAO.actualizarTotal(numeroCuenta, req.body);

      if (!clienteActualizado) {
        return res.status(404).render('404', {
          title: 'Cuenta No Encontrada',
          description: 'No se encontró la cuenta para modificar.',
          mensajeError: `No se encontró la cuenta ${numeroCuenta} para modificar.`
        });
      }

      res.redirect(302, `/clientes/${numeroCuenta}`);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /clientes/:numeroCuenta/eliminar
   * Procesa la baja de la cuenta desde el navegador web y redirige al listado general.
   */
  static async procesarEliminacionWeb(req, res, next) {
    try {
      const { numeroCuenta } = req.params;
      const clienteEliminado = await ClienteDAO.eliminar(numeroCuenta);

      if (!clienteEliminado) {
        return res.status(404).render('404', {
          title: 'Cuenta No Encontrada',
          description: 'No se encontró la cuenta que desea eliminar.',
          mensajeError: `No se encontró la cuenta ${numeroCuenta} para eliminar.`
        });
      }

      res.redirect(302, '/clientes');
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /clientes/:numeroCuenta (API)
   * Reemplazo total de los datos de la cuenta.
   */
  static async actualizarClienteTotal(req, res, next) {
    try {
      const { numeroCuenta } = req.params;
      const clienteActualizado = await ClienteDAO.actualizarTotal(numeroCuenta, req.body);

      if (!clienteActualizado) {
        return res.status(404).json({
          error: 'Cuenta no encontrada',
          mensaje: `No se encontró la cuenta ${numeroCuenta} para actualizar.`
        });
      }

      res.status(200).json({
        mensaje: 'Cuenta agropecuaria actualizada exitosamente.',
        cuenta: clienteActualizado.aObjetoJSON()
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /clientes/:numeroCuenta (API)
   * Modificación de campos puntuales de la cuenta.
   */
  static async actualizarClienteParcial(req, res, next) {
    try {
      const { numeroCuenta } = req.params;
      const clienteModificado = await ClienteDAO.actualizarParcial(numeroCuenta, req.body);

      if (!clienteModificado) {
        return res.status(404).json({
          error: 'Cuenta no encontrada',
          mensaje: `No se encontró la cuenta ${numeroCuenta} para modificar.`
        });
      }

      res.status(200).json({
        mensaje: 'Cuenta agropecuaria modificada parcialmente con éxito.',
        cuenta: clienteModificado.aObjetoJSON()
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /clientes/:numeroCuenta (API)
   * Baja o eliminación física de la cuenta.
   */
  static async eliminarCliente(req, res, next) {
    try {
      const { numeroCuenta } = req.params;
      const clienteEliminado = await ClienteDAO.eliminar(numeroCuenta);

      if (!clienteEliminado) {
        return res.status(404).json({
          error: 'Cuenta no encontrada',
          mensaje: `No se encontró la cuenta ${numeroCuenta} para eliminar.`
        });
      }

      res.status(200).json({
        mensaje: 'Cuenta agropecuaria eliminada exitosamente.',
        cuenta: clienteEliminado.aObjetoJSON()
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ClienteControlador;
