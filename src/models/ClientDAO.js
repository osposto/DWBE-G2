const fs = require('fs/promises');
const path = require('path');
const Cliente = require('./Client');

/**
 * Ruta al archivo de almacenamiento local clients.json
 */
const RUTA_ARCHIVO_CLIENTES = path.join(__dirname, '../../data/clients.json');

/**
 * Clase ClienteDAO (Data Access Object)
 * Maneja la persistencia y lectura de clientes agropecuarios en el archivo JSON.
 */
class ClienteDAO {
  /**
   * Lee el archivo JSON y lo convierte a un array de objetos.
   * @private
   * @returns {Promise<Array<Object>>}
   */
  static async _leerDatos() {
    try {
      const contenido = await fs.readFile(RUTA_ARCHIVO_CLIENTES, 'utf-8');
      return JSON.parse(contenido || '[]');
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw new Error(`Error al leer el archivo de clientes: ${error.message}`);
    }
  }

  /**
   * Escribe el array de clientes en el archivo JSON de forma segura.
   * @private
   * @param {Array<Object>} datos
   */
  static async _escribirDatos(datos) {
    try {
      await fs.writeFile(RUTA_ARCHIVO_CLIENTES, JSON.stringify(datos, null, 2), 'utf-8');
    } catch (error) {
      throw new Error(`Error al escribir en el archivo de clientes: ${error.message}`);
    }
  }

  /**
   * Obtiene todos los clientes registrados.
   * @returns {Promise<Array<Cliente>>}
   */
  static async obtenerTodos() {
    const registros = await this._leerDatos();
    return registros.map(registro => new Cliente(registro));
  }

  /**
   * Busca un cliente por su número de cuenta único.
   * @param {string} numeroCuenta
   * @returns {Promise<Cliente|null>}
   */
  static async buscarPorNumeroCuenta(numeroCuenta) {
    const registros = await this._leerDatos();
    const codigoBuscado = String(numeroCuenta).trim().toLowerCase();
    const registroEncontrado = registros.find(
      reg => String(reg.numeroCuenta).trim().toLowerCase() === codigoBuscado
    );
    return registroEncontrado ? new Cliente(registroEncontrado) : null;
  }

  /**
   * Guarda un nuevo cliente en el archivo JSON.
   * @param {Cliente|Object} cliente
   * @returns {Promise<Cliente>}
   */
  static async guardar(cliente) {
    const registros = await this._leerDatos();
    const nuevoCliente = cliente instanceof Cliente ? cliente : new Cliente(cliente);

    const yaExiste = registros.some(
      reg => String(reg.numeroCuenta).trim().toLowerCase() === nuevoCliente.numeroCuenta.toLowerCase()
    );

    if (yaExiste) {
      throw new Error(`Ya existe una cuenta registrada con el número ${nuevoCliente.numeroCuenta}.`);
    }

    registros.push(nuevoCliente.aObjetoJSON());
    await this._escribirDatos(registros);
    return nuevoCliente;
  }

  /**
   * Actualización total (PUT): reemplaza la información completa de la cuenta.
   * @param {string} numeroCuenta
   * @param {Object} nuevosDatos
   * @returns {Promise<Cliente|null>}
   */
  static async actualizarTotal(numeroCuenta, nuevosDatos) {
    const registros = await this._leerDatos();
    const codigoBuscado = String(numeroCuenta).trim().toLowerCase();
    const indice = registros.findIndex(
      reg => String(reg.numeroCuenta).trim().toLowerCase() === codigoBuscado
    );

    if (indice === -1) {
      return null;
    }

    const clienteActualizado = new Cliente({
      ...nuevosDatos,
      numeroCuenta: registros[indice].numeroCuenta,
      fechaCreacion: registros[indice].fechaCreacion
    });

    registros[indice] = clienteActualizado.aObjetoJSON();
    await this._escribirDatos(registros);
    return clienteActualizado;
  }

  /**
   * Actualización parcial (PATCH): modifica únicamente los campos indicados.
   * @param {string} numeroCuenta
   * @param {Object} datosParciales
   * @returns {Promise<Cliente|null>}
   */
  static async actualizarParcial(numeroCuenta, datosParciales) {
    const registros = await this._leerDatos();
    const codigoBuscado = String(numeroCuenta).trim().toLowerCase();
    const indice = registros.findIndex(
      reg => String(reg.numeroCuenta).trim().toLowerCase() === codigoBuscado
    );

    if (indice === -1) {
      return null;
    }

    const registroActual = registros[indice];
    const clienteModificado = new Cliente({
      numeroCuenta: registroActual.numeroCuenta,
      nombreCliente: datosParciales.nombreCliente !== undefined ? datosParciales.nombreCliente : registroActual.nombreCliente,
      cuit: datosParciales.cuit !== undefined ? datosParciales.cuit : registroActual.cuit,
      tipoContrato: datosParciales.tipoContrato !== undefined ? datosParciales.tipoContrato : registroActual.tipoContrato,
      agronomoAsignado: datosParciales.agronomoAsignado !== undefined ? datosParciales.agronomoAsignado : registroActual.agronomoAsignado,
      fechaCreacion: registroActual.fechaCreacion
    });

    registros[indice] = clienteModificado.aObjetoJSON();
    await this._escribirDatos(registros);
    return clienteModificado;
  }

  /**
   * Eliminación (DELETE): remueve la cuenta del archivo JSON.
   * @param {string} numeroCuenta
   * @returns {Promise<Cliente|null>}
   */
  static async eliminar(numeroCuenta) {
    const registros = await this._leerDatos();
    const codigoBuscado = String(numeroCuenta).trim().toLowerCase();
    const indice = registros.findIndex(
      reg => String(reg.numeroCuenta).trim().toLowerCase() === codigoBuscado
    );

    if (indice === -1) {
      return null;
    }

    const [registroEliminado] = registros.splice(indice, 1);
    await this._escribirDatos(registros);
    return new Cliente(registroEliminado);
  }
}

module.exports = ClienteDAO;
