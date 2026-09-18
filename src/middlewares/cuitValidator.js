/**
 * Middleware: validadorCuit
 * Valida que los campos obligatorios del alta estén presentes y que el CUIT cumpla el formato XX-XXXXXXXX-X.
 */
const validarCuitYCampos = (req, res, next) => {
  const {
    numeroCuenta,
    nombreCliente,
    cuit,
    tipoContrato,
    agronomoAsignado
  } = req.body;

  const cuenta = (numeroCuenta || '').trim();
  const nombre = (nombreCliente || '').trim();
  const cuitLimpio = (cuit || '').trim();
  const contrato = (tipoContrato || '').trim().toLowerCase();
  const agronomo = (agronomoAsignado || '').trim();

  const errores = [];

  // 1. Campos obligatorios
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

  // 2. Tipo de contrato permitido
  const contratosValidos = ['mensual', 'anual', 'quinquenal'];
  if (!contrato || !contratosValidos.includes(contrato)) {
    errores.push(`El tipo de contrato debe ser: ${contratosValidos.join(', ')}.`);
  }

  // 3. Formato fiscal de CUIT con guiones (XX-XXXXXXXX-X)
  const patronFiscalCuit = /^\d{2}-\d{8}-\d{1}$/;
  if (cuitLimpio && !patronFiscalCuit.test(cuitLimpio)) {
    errores.push('El CUIT ingresado no es válido. Debe tener el formato fiscal XX-XXXXXXXX-X (ejemplo: 30-71234567-8).');
  }

  if (errores.length > 0) {
    // Si viene desde un formulario HTML tradicional
    if (!req.xhr && !req.headers.accept?.includes('application/json')) {
      return res.status(400).render('client-form', {
        title: 'Error de Validación - Alta Comercial',
        description: 'Por favor corrija los campos requeridos.',
        errores,
        valoresPrevios: req.body
      });
    }

    // Si es petición vía API o Thunder Client
    return res.status(400).json({
      error: 'Error de validación en alta de cuenta agropecuaria',
      estado: 400,
      errores
    });
  }

  next();
};

module.exports = validarCuitYCampos;
