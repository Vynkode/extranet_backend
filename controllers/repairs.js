// const stream = require('stream');
const moment = require('moment');

const handleWorkshopRepairs = (db) => async (req, res) => {
  const { email } = req.params;

  try {
    const repairs = await db('reparaciones as r')
      .select(
        'r.numero',
        'r.su_referencia',
        'r.foto_entrada',
        'r.tipo_reparacion',
        'r.f_entrada',
        'r.marca',
        'r.modelo',
        'r.tipo_aparato',
        'r.averia',
        'r.observaciones',
        'r.presupuestar',
        'r.f_presupuesto',
        'r.f_respuesta_ppto',
        'r.rechazado',
        'r.presupuesto',
        'r.p_base_imponible',
        'r.f_reparacion',
        'r.reparacion',
        'r.f_base_imponible',
        'r.proceso'
      )
      .join('clientes_direcciones as cd', function () {
        this.on('cd.codigo', '=', 'r.codigo_envio').andOn('cd.nombre', '=', 'r.nombre');
      })
      .where((builder) => {
        builder.where('cd.email', '=', email).where('r.operario', '!=', 'INMA').whereNull('r.f_reparacion');
      })
      .orderBy('r.f_entrada', 'desc');

    const count = repairs.length;
    console.log(count);

    repairs.forEach((element) => {
      if (element.foto_entrada) {
        element.foto_entrada = Buffer.from(element.foto_entrada).toString('base64');
      }

      if (element.tipo_reparacion === '1') {
        element.tipo_reparacion = 'No Garantía';
      } else if (element.tipo_reparacion === '2') {
        element.tipo_reparacion = 'Garantía';
      } else if (element.tipo_reparacion === '3') {
        element.tipo_reparacion = 'Reclamación';
      }

      element.f_entrada = moment(element.f_entrada).format('DD/MM/YY');

      if (element.f_reparacion) {
        element.f_reparacion = moment(element.f_reparacion).format('DD/MM/YY');
      } else {
        element.f_reparacion = null;
      }

      if (element.averia) {
        element.averia = element.averia.toLowerCase();
      } else {
        element.averia = '';
      }

      if (element.observaciones) {
        element.observaciones = element.observaciones.toLowerCase();
      } else {
        element.observaciones = '';
      }

      if (element.presupuestar === '' || element.presupuestar === 'N' || !element.presupuestar) {
        element.presupuestar = 'No';
      } else {
        element.presupuestar = 'Sí';
      }

      if (element.f_presupuesto) {
        element.f_presupuesto = moment(element.f_presupuesto).format('DD/MM/YY');
      } else {
        element.f_presupuesto = null;
      }

      if (element.f_respuesta_ppto) {
        element.f_respuesta_ppto = moment(element.f_respuesta_ppto).format('DD/MM/YY');
      } else {
        element.f_respuesta_ppto = null;
      }

      if (element.rechazado === '' || element.rechazado === 'N' || !element.rechazado) {
        element.rechazado = 'No';
      } else {
        element.rechazado = 'Sí';
      }

      if (element.presupuesto) {
        element.presupuesto = element.presupuesto.toLowerCase();
      } else {
        element.presupuesto = '';
      }

      element.p_base_imponible = parseFloat(element.p_base_imponible).toFixed(2);

      if (element.f_reparacion) {
        element.f_reparacion = moment(element.f_reparacion).format('DD/MM/YY');
      } else {
        element.f_reparacion = null;
      }

      if (element.reparacion) {
        element.reparacion = element.reparacion.toString().toLowerCase();
      } else {
        element.reparacion = '';
      }

      element.f_base_imponible = parseFloat(element.f_base_imponible).toFixed(2);
    });
    return res.status(200).json([count, repairs]);
  } catch (error) {
    console.log(error);
    return res.status(400).json(['No se han encontrado reparaciones', error]);
  }
};

const handleClosedRepairs = (db) => async (req, res) => {
  const { email } = req.params;

  try {
    const repairs = await db('reparaciones as r')
      .select(
        'r.numero',
        'r.su_referencia',
        'r.foto_entrada',
        'r.tipo_reparacion',
        'r.f_entrada',
        'r.marca',
        'r.modelo',
        'r.tipo_aparato',
        'r.averia',
        'r.observaciones',
        'r.presupuestar',
        'r.f_presupuesto',
        'r.f_respuesta_ppto',
        'r.rechazado',
        'r.presupuesto',
        'r.p_base_imponible',
        'r.f_reparacion',
        'r.reparacion',
        'r.f_base_imponible',
        'r.proceso'
      )
      .join('clientes_direcciones as cd', function () {
        this.on('cd.codigo', '=', 'r.codigo_envio').andOn('cd.nombre', '=', 'r.nombre');
      })
      .where((builder) => {
        builder.where('cd.email', '=', email).where('r.operario', '!=', 'INMA').whereNotNull('r.f_reparacion');
      })
      .orderBy('r.f_entrada', 'desc');

    const count = repairs.length;
    console.log(count);

    repairs.forEach((element) => {
      if (element.foto_entrada) {
        element.foto_entrada = Buffer.from(element.foto_entrada).toString('base64');
      }

      if (element.tipo_reparacion === '1') {
        element.tipo_reparacion = 'No Garantía';
      } else if (element.tipo_reparacion === '2') {
        element.tipo_reparacion = 'Garantía';
      } else if (element.tipo_reparacion === '3') {
        element.tipo_reparacion = 'Reclamación';
      }

      element.f_entrada = moment(element.f_entrada).format('DD/MM/YY');

      if (element.f_reparacion) {
        element.f_reparacion = moment(element.f_reparacion).format('DD/MM/YY');
      } else {
        element.f_reparacion = null;
      }

      if (element.averia) {
        element.averia = element.averia.toLowerCase();
      } else {
        element.averia = '';
      }

      if (element.observaciones) {
        element.observaciones = element.observaciones.toLowerCase();
      } else {
        element.observaciones = '';
      }

      if (element.presupuestar === '' || element.presupuestar === 'N' || !element.presupuestar) {
        element.presupuestar = 'No';
      } else {
        element.presupuestar = 'Sí';
      }

      if (element.f_presupuesto) {
        element.f_presupuesto = moment(element.f_presupuesto).format('DD/MM/YY');
      } else {
        element.f_presupuesto = null;
      }

      if (element.f_respuesta_ppto) {
        element.f_respuesta_ppto = moment(element.f_respuesta_ppto).format('DD/MM/YY');
      } else {
        element.f_respuesta_ppto = null;
      }

      if (element.rechazado === '' || element.rechazado === 'N' || !element.rechazado) {
        element.rechazado = 'No';
      } else {
        element.rechazado = 'Sí';
      }

      if (element.presupuesto) {
        element.presupuesto = element.presupuesto.toLowerCase();
      } else {
        element.presupuesto = '';
      }

      element.p_base_imponible = parseFloat(element.p_base_imponible).toFixed(2);

      if (element.f_reparacion) {
        element.f_reparacion = moment(element.f_reparacion).format('DD/MM/YY');
      } else {
        element.f_reparacion = null;
      }

      if (element.reparacion) {
        element.reparacion = element.reparacion.toLowerCase();
      } else {
        element.reparacion = '';
      }

      element.f_base_imponible = parseFloat(element.f_base_imponible).toFixed(2);
    });
    return res.status(200).json([count, repairs]);
  } catch (error) {
    console.log(error);
    return res.status(400).json(['No se han encontrado reparaciones']);
  }
};

module.exports = {
  handleWorkshopRepairs: handleWorkshopRepairs,
  handleClosedRepairs: handleClosedRepairs,
};
