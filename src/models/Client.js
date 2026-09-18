/**
 * Clase de Dominio: Cliente (Client)
 * Representa una cuenta de cliente agropecuario dentro del Proceso P1.
 */
class Cliente {
  /**
   * Constructor de la entidad Cliente.
   * @param {Object} datos - Datos iniciales de la cuenta.
   */
  constructor({
    numeroCuenta,
    accountNumber,
    nombreCliente,
    clientName,
    cuit,
    tipoContrato,
    contractType,
    agronomoAsignado,
    assignedAgronomist,
    fechaCreacion,
    createdAt
  }) {
    this.accountNumber = String(numeroCuenta || accountNumber || '').trim();
    this.clientName = String(nombreCliente || clientName || '').trim();
    this.cuit = String(cuit || '').trim();
    this.contractType = String(tipoContrato || contractType || 'anual').toLowerCase().trim();
    this.assignedAgronomist = String(agronomoAsignado || assignedAgronomist || '').trim();
    this.createdAt = fechaCreacion || createdAt || new Date().toISOString();
  }

  // Getters en español para facilitar la lectura didáctica del código
  get numeroCuenta() {
    return this.accountNumber;
  }

  get nombreCliente() {
    return this.clientName;
  }

  get tipoContrato() {
    return this.contractType;
  }

  get agronomoAsignado() {
    return this.assignedAgronomist;
  }

  get fechaCreacion() {
    return this.createdAt;
  }

  /**
   * Devuelve la representación en objeto plano para serialización en JSON.
   * @returns {Object}
   */
  aObjetoJSON() {
    return {
      accountNumber: this.accountNumber,
      clientName: this.clientName,
      cuit: this.cuit,
      contractType: this.contractType,
      assignedAgronomist: this.assignedAgronomist,
      createdAt: this.createdAt
    };
  }

  // Alias estándar para JSON.stringify()
  toJSON() {
    return this.aObjetoJSON();
  }
}

module.exports = Cliente;
