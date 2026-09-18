const fs = require('fs/promises');
const path = require('path');
const Cliente = require('./Client');

/**
 * Ruta absoluta hacia el archivo de almacenamiento local clients.json
 */
const RUTA_ARCHIVO_CLIENTES = path.join(__dirname, '../../data/clients.json');

/**
 * Clase ClienteDAO (Data Access Object)
 * Encapsula todas las operaciones asincrónicas de lectura y escritura sobre clients.json
 * utilizando el módulo nativo fs/promises para garantizar persistencia no bloqueante.
 */
class ClienteDAO {
  /**
   * Lee y parsea el archivo de datos JSON.
   * @private
   * @returns {Promise<Array<Object>>} Lista de objetos crudos almacenados.
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
   * Escribe y formatea atómicamente la lista de clientes en el archivo JSON.
   * @private
   * @param {Array<Object>} datos - Lista a persistir.
   */
  static async _escribirDatos(datos) {
    try {
      await fs.writeFile(RUTA_ARCHIVO_CLIENTES, JSON.stringify(datos, null, 2), 'utf-8');
    } catch (error) {
      throw new Error(`Error al guardar en el archivo de clientes: ${error.message}`);
    }
  }

  /**
   * Obtiene todos los clientes registrados como instancias de la clase Cliente.
   * @returns {Promise<Array<Cliente>>}
   */
  static async obtenerTodos() {
    const registros = await this._leerDatos();
    return registros.map(reg => new Cliente(reg));
  }

  /**
   * Busca un cliente por su número de cuenta.
   * @param {string} numeroCuenta - Identificador único de la cuenta.
   * @returns {Promise<Cliente|null>} Instancia de Cliente o null si no existe.
   */
  static async buscarPorNumeroCuenta(numeroCuenta) {
    const registros = await this._leerDatos();
    const codigoBuscado = String(numeroCuenta).trim().toLowerCase();
    const encontrado = registros.find(
      reg => String(reg.accountNumber).trim().toLowerCase() === codigoBuscado
    );
    return encontrado ? new Cliente(encontrado) : null;
  }

  /**
   * Guarda un nuevo cliente en el archivo JSON.
   * @param {Cliente|Object} cliente - Instancia o datos del cliente.
   * @returns {Promise<Cliente>} Cliente guardado.
   */
  static async guardar(cliente) {
    const registros = await this._leerDatos();
    const nuevoCliente = cliente instanceof Cliente ? cliente : new Cliente(cliente);

    // Verificamos si ya existe una cuenta con ese número
    const yaExiste = registros.some(
      reg => String(reg.accountNumber).trim().toLowerCase() === nuevoCliente.accountNumber.toLowerCase()
    );

    if (yaExiste) {
      throw new Error(`Ya existe una cuenta registrada con el número ${nuevoCliente.accountNumber}.`);
    }

    registros.push(nuevoCliente.aObjetoJSON());
    await this._escribirDatos(registros);
    return nuevoCliente;
  }

  /**
   * Actualización total (PUT): reemplaza todos los datos de la cuenta.
   * @param {string} numeroCuenta - Número de cuenta a actualizar.
   * @param {Object} nuevosDatos - Nuevos valores para la cuenta.
   * @returns {Promise<Cliente|null>} Cliente actualizado o null si no existe.
   */
  static async actualizarTotal(numeroCuenta, nuevosDatos) {
    const registros = await this._leerDatos();
    const codigoBuscado = String(numeroCuenta).trim().toLowerCase();
    const indice = registros.findIndex(
      reg => String(reg.accountNumber).trim().toLowerCase() === codigoBuscado
    );

    if (indice === -1) {
      return null;
    }

    const clienteActualizado = new Cliente({
      ...nuevosDatos,
      numeroCuenta: registros[indice].accountNumber, // Mantiene el identificador
      fechaCreacion: registros[indice].createdAt
    });

    registros[indice] = clienteActualizado.aObjetoJSON();
    await this._escribirDatos(registros);
    return clienteActualizado;
  }

  /**
   * Actualización parcial (PATCH): modifica únicamente los campos recibidos.
   * @param {string} numeroCuenta - Número de cuenta a modificar.
   * @param {Object} datosParciales - Campos a actualizar.
   * @returns {Promise<Cliente|null>} Cliente modificado o null si no existe.
   */
  static async actualizarParcial(numeroCuenta, datosParciales) {
    const registros = await this._leerDatos();
    const codigoBuscado = String(numeroCuenta).trim().toLowerCase();
    const indice = registros.findIndex(
      reg => String(reg.accountNumber).trim().toLowerCase() === codigoBuscado
    );

    if (indice === -1) {
      return null;
    }

    const actual = registros[indice];
    const clienteModificado = new Cliente({
      accountNumber: actual.accountNumber,
      clientName: datosParciales.clientName !== undefined ? datosParciales.clientName : (datosParciales.nombreCliente || actual.clientName),
      cuit: datosParciales.cuit !== undefined ? datosParciales.cuit : actual.cuit,
      contractType: datosParciales.contractType !== undefined ? datosParciales.contractType : (datosParciales.tipoContrato || actual.contractType),
      assignedAgronomist: datosParciales.assignedAgronomist !== undefined ? datosParciales.assignedAgronomist : (datosParciales.agronomoAsignado || actual.assignedAgronomist),
      createdAt: actual.createdAt
    });

    registros[indice] = clienteModificado.aObjetoJSON();
    await this._escribirDatos(registros);
    return clienteModificado;
  }

  /**
   * Eliminación (DELETE): remueve la cuenta del archivo JSON.
   * @param {string} numeroCuenta - Número de cuenta a eliminar.
   * @returns {Promise<Cliente|null>} Cliente eliminado o null si no existía.
   */
  static async eliminar(numeroCuenta) {
    const registros = await this._leerDatos();
    const codigoBuscado = String(numeroCuenta).trim().toLowerCase();
    const indice = registros.findIndex(
      reg => String(reg.accountNumber).trim().toLowerCase() === codigoBuscado
    );

    if (indice === -1) {
      return null;
    }

    const [eliminado] = registros.splice(indice, 1);
    await this._escribirDatos(registros);
    return new Cliente(eliminado);
  }

  // Alias para mantener compatibilidad con las nomenclaturas del outline
  static findAll() {
    return this.obtenerTodos();
  }

  static findByAccountNumber(numeroCuenta) {
    return this.buscarPorNumeroCuenta(numeroCuenta);
  }

  static save(cliente) {
    return this.guardar(cliente);
  }

  static update(numeroCuenta, datos) {
    return this.actualizarTotal(numeroCuenta, datos);
  }

  static patch(numeroCuenta, datos) {
    return this.actualizarParcial(numeroCuenta, datos);
  }

  static delete(numeroCuenta) {
    return this.eliminar(numeroCuenta);
  }
}

module.exports = ClienteDAO;
