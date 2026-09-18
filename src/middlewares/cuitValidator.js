/**
 * Middleware: cuitValidator
 * Intercepta las solicitudes de alta de cuenta (POST /clientes).
 * Valida la presencia de los campos requeridos y el formato del CUIT (XX-XXXXXXXX-X).
 */
const validarCuitYCampos = (req, res, next) => {
  const {
    accountNumber,
    numeroCuenta,
    clientName,
    nombreCliente,
    cuit,
    contractType,
    tipoContrato,
    assignedAgronomist,
    agronomoAsignado
  } = req.body;

  const cuenta = (accountNumber || numeroCuenta || '').trim();
  const nombre = (clientName || nombreCliente || '').trim();
  const cuitLimpio = (cuit || '').trim();
  const contrato = (contractType || tipoContrato || '').trim().toLowerCase();
  const agronomo = (assignedAgronomist || agronomoAsignado || '').trim();

  const errores = [];

  // 1. Validación de campos obligatorios
  if (!cuenta) {
    errores.push('El número de cuenta es obligatorio.');
  }

  if (!nombre) {
    errores.push('La razón social o nombre del productor es obligatorio.');
  }

  if (!cuitLimpio) {
    errores.push('El CUIT es obligatorio.');
  }

  if (!agronomo) {
    errores.push('El agrónomo referente asignado es obligatorio.');
  }

  // 2. Validación de tipo de contrato
  const tiposValidos = ['mensual', 'anual', 'quinquenal'];
  if (!contrato || !tiposValidos.includes(contrato)) {
    errores.push(`El tipo de contrato debe ser uno de los siguientes: ${tiposValidos.join(', ')}.`);
  }

  // 3. Validación de formato de CUIT (XX-XXXXXXXX-X)
  // Admite formato estándar argentino con guiones (2 dígitos - 8 dígitos - 1 dígito)
  const patronCuit = /^\d{2}-\d{8}-\d{1}$/;
  if (cuitLimpio && !patronCuit.test(cuitLimpio)) {
    errores.push('El CUIT ingresado no tiene un formato fiscal válido. Formato requerido: XX-XXXXXXXX-X (ejemplo: 30-71234567-8).');
  }

  // Si hay errores, emitir respuesta 400 Bad Request
  if (errores.length > 0) {
    // Si la petición viene de un formulario HTML tradicional
    if (!req.xhr && !req.headers.accept?.includes('application/json')) {
      return res.status(400).render('client-form', {
        title: 'Alta de Cuenta - Error de Validación',
        description: 'Corrija los campos señalados para continuar con el alta comercial.',
        errores,
        valoresPrevios: req.body
      });
    }

    // Si es una petición API / Thunder Client
    return res.status(400).json({
      error: 'Error de validación en alta comercial (Proceso P1)',
      status: 400,
      detalles: errores
    });
  }

  next();
};

module.exports = validarCuitYCampos;
