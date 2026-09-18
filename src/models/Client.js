/**
 * Clase de Dominio: Cliente
 * Representa una cuenta de cliente agropecuario dentro del Proceso P1.
 */
class Cliente {
  /**
   * Constructor de la entidad Cliente.
   * @param {Object} datos - Datos de la cuenta agropecuaria.
   */
  constructor({
    numeroCuenta,
    nombreCliente,
    cuit,
    tipoContrato,
    agronomoAsignado,
    fechaCreacion
  }) {
    this.numeroCuenta = String(numeroCuenta || '').trim();
    this.nombreCliente = String(nombreCliente || '').trim();
    this.cuit = String(cuit || '').trim();
    this.tipoContrato = String(tipoContrato || 'anual').toLowerCase().trim();
    this.agronomoAsignado = String(agronomoAsignado || '').trim();
    this.fechaCreacion = fechaCreacion || new Date().toISOString();
  }

  /**
   * Convierte la entidad a un objeto plano serializable.
   * @returns {Object}
   */
  aObjetoJSON() {
    return {
      numeroCuenta: this.numeroCuenta,
      nombreCliente: this.nombreCliente,
      cuit: this.cuit,
      tipoContrato: this.tipoContrato,
      agronomoAsignado: this.agronomoAsignado,
      fechaCreacion: this.fechaCreacion
    };
  }

  // Método estándar para JSON.stringify()
  toJSON() {
    return this.aObjetoJSON();
  }
}

module.exports = Cliente;
