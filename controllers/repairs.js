// const stream = require('stream');
const moment = require('moment');

const handleWorkshopRepairs = (db) => async (req, res) => {
  const { email } = req.params;
  // if (!email || !password) {
  //   return res.status(400).json('incorrect form submission');
  // }

  try {
    const repairs = await db('reparaciones as r')
      .select(
        'r.numero',
        'r.su_referencia',
        'r.f_entrada',
        'r.marca',
        'r.modelo',
        'r.tipo_aparato',
        'r.tipo_reparacion',
        'r.presupuestar',
        'r.f_reparacion',
        'r.f_base_imponible',
        'r.proceso',
        'r.observaciones',
        'r.averia',
        'r.reparacion',
        'r.foto_entrada'
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
      element.f_entrada = moment(element.f_entrada).format('DD/MM/YY');
      if (element.f_reparacion) {
        element.f_reparacion = moment(element.f_reparacion).format('DD/MM/YY');
      } else {
        element.f_reparacion = null;
      }

      element.f_base_imponible = parseFloat(element.f_base_imponible).toFixed(2);

      if (element.tipo_reparacion === '1') {
        element.tipo_reparacion = 'No Garantía';
      } else if (element.tipo_reparacion === '2') {
        element.tipo_reparacion = 'Garantía';
      } else if (element.tipo_reparacion === '3') {
        element.tipo_reparacion = 'Reclamación';
      }

      if (element.presupuestar === '' || element.presupuestar === 'N') {
        element.presupuestar = 'No';
      } else {
        element.presupuestar = 'Sí';
      }
      if (element.averia) {
        element.averia = element.averia.toString().toLowerCase();
      } else {
        element.averia = '';
      }
      // element.averia = Buffer.from(element.averia).toString();
      if (element.observaciones) {
        element.observaciones = element.observaciones.toString().toLowerCase();
      } else {
        element.observaciones = '';
      }
      if (element.reparacion) {
        element.reparacion = element.reparacion.toString().toLowerCase();
      } else {
        element.reparacion = '';
      }
      if (element.foto_entrada) {
        element.foto_entrada = Buffer.from(element.foto_entrada).toString('base64');
      }
      // element.reparacion = Buffer.from(element.reparacion).toString();
      // element.foto_entrada = new Buffer(element.foto.entrada, 'binary').toString('base64');
    });
    return res.status(200).json([count, repairs]);
  } catch (error) {
    console.log(error);
    return res.status(400).json(['No se han encontrado reparaciones', error]);
  }
};

const handleClosedRepairs = (db) => async (req, res) => {
  const { email } = req.params;
  // if (!email || !password) {
  //   return res.status(400).json('incorrect form submission');
  // }

  try {
    const repairs = await db('reparaciones as r')
      .select(
        'r.numero',
        'r.su_referencia',
        'r.f_entrada',
        'r.marca',
        'r.modelo',
        'r.tipo_aparato',
        'r.tipo_reparacion',
        'r.presupuestar',
        'r.f_reparacion',
        'r.f_base_imponible',
        'r.proceso',
        'r.observaciones',
        'r.averia',
        'r.reparacion',
        'r.foto_entrada'
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
      element.f_entrada = moment(element.f_entrada).format('DD/MM/YY');
      if (element.f_reparacion) {
        element.f_reparacion = moment(element.f_reparacion).format('DD/MM/YY');
      } else {
        element.f_reparacion = null;
      }

      element.f_base_imponible = parseFloat(element.f_base_imponible).toFixed(2);

      if (element.tipo_reparacion === '1') {
        element.tipo_reparacion = 'No Garantía';
      } else if (element.tipo_reparacion === '2') {
        element.tipo_reparacion = 'Garantía';
      } else if (element.tipo_reparacion === '3') {
        element.tipo_reparacion = 'Reclamación';
      }

      if (element.presupuestar === '' || element.presupuestar === 'N' || !element.presupuestar) {
        element.presupuestar = 'No';
      } else {
        element.presupuestar = 'Sí';
      }
      if (element.averia) {
        element.averia = element.averia.toLowerCase();
      } else {
        element.averia = '';
      }
      // element.averia = Buffer.from(element.averia).toString();
      if (element.observaciones) {
        element.observaciones = element.observaciones.toString().toLowerCase();
      } else {
        element.observaciones = '';
      }
      if (element.reparacion) {
        element.reparacion = element.reparacion.toString().toLowerCase();
      } else {
        element.reparacion = '';
      }
      if (element.foto_entrada) {
        element.foto_entrada = Buffer.from(element.foto_entrada).toString('base64');
      }
      // element.reparacion = Buffer.from(element.reparacion).toString();
      // element.foto_entrada = new Buffer(element.foto.entrada, 'binary').toString('base64');
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
