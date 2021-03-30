const moment = require('moment');

const reparaciones = (db) => async (req, res) => {
  const { email } = req.params;

  try {
    const repairs = await db('reparaciones as r')
      .select(
        'r.numero',
        'r.su_referencia',
        'r.foto_entrada',
        'r.tipo_reparacion',
        'r.fecha_compra',
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
        'r.modelo_sustutucion',
        'r.reparacion',
        'r.f_base_imponible',
        'r.agencia',
        'r.f_entrega',
        'r.proceso',
        'r.estado'
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
        element.fecha_compra = null
      } else if (element.tipo_reparacion === '2') {
        element.tipo_reparacion = 'Garantía';
        element.fecha_compra = moment(element.fecha_compra).format('DD/MM/YY');
      } else if (element.tipo_reparacion === '3') {
        element.tipo_reparacion = 'Reclamación';
        element.fecha_compra = null
      }

      element.f_entrada = moment(element.f_entrada).format('DD/MM/YY');

      const averiaString = element.averia ? element.averia.toString() : '';
      if (averiaString) {
        element.averia = averiaString[0].toUpperCase() + averiaString.slice(1).toLowerCase();
      } else {
        element.averia = '';
      }

      const observacionesString = element.observaciones ? element.observaciones.toString() : '';
      if (observacionesString) {
        element.observaciones =  observacionesString[0].toUpperCase() + observacionesString.slice(1).toLowerCase();
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

      const presupuestoString = element.presupuesto ? element.presupuesto.toString() : '';
      if (presupuestoString) {
        element.presupuesto = presupuestoString[0].toUpperCase() + presupuestoString.slice(1).toLowerCase();
      } else {
        element.presupuesto = '';
      }

      element.p_base_imponible = parseFloat(element.p_base_imponible).toFixed(2);

      if (element.f_reparacion) {
        element.f_reparacion = moment(element.f_reparacion).format('DD/MM/YY');
      } else {
        element.f_reparacion = null;
      }

      const reparacionString = element.reparacion ? element.reparacion.toString() : '';
      if (reparacionString) {
        element.reparacion = reparacionString[0].toUpperCase() + reparacionString.slice(1).toLowerCase();
      } else {
        element.reparacion = '';
      }

      element.f_base_imponible = parseFloat(element.f_base_imponible).toFixed(2);

      if (element.agencia === 'SEUR' || element.agencia === 'CORREOS' || element.agencia === 'ENVIALIA' || element.agencia === 'SUS MEDIOS' || element.agencia === 'SUS MEDI') {
        element.agencia = 'ENVÍO';
      } else {
        element.agencia = 'RECOGIDA';
      }

      if (element.f_entrega) {
        element.f_entrega = moment(element.f_entrega).format('DD/MM/YY');
      } else {
        element.f_entrega = null;
      }
    });
    return res.status(200).json([count, repairs]);
  } catch (error) {
    console.log(error);
    return res.status(400).json(['No se han encontrado reparaciones', error]);
  }
};

// const reparaciones = (db) => (req, res) => {
//   const obs = [];
//   db('reparaciones')
//     .select('*')
//     // .where('numero', '=', '1240300')
//     .limit(100)
//     .then((data) => {
//       data.forEach(d => {
//
//       const accesorios = [
//         d.accesorio1 ? d.accesorio1 : '',
//         d.accesorio2 ? d.accesorio2 : '',
//         d.accesorio3 ? d.accesorio3 : '',
//         d.accesorio4 ? d.accesorio4 : '',
//         d.accesorio5 ? d.accesorio5 : '' ]
//
//
//       // const date = moment(data[0].f_reparacion).format('DD/MM/YY');
//       d.accesorios = accesorios;
//       })
//       res.status(200).json(data)
//     })
//       // if(data[0].observaciones) {
//       //   console.log(data);
//       //   res.status(200).json([data[0].numero, 'Hay datos', data[0].observaciones])
//       // } else {
//       //   console.log(data);
//       //   res.status(200).json([data[0].numero, 'No hay datos', data[0].observaciones])
//       // }
//
//       // data.forEach(d => {
//       //   if(d.observaciones) {
//       //     console.log(d.numero);
//       //     const str = d.observaciones.toString().toLowerCase();
//       //     const upper = str[0].toUpperCase() + str.slice(1);
//       //     console.log(upper);
//       //     obs.push(upper);
//       //   }
//       // })
//       // res.status(200).json(data);
//     // })
//     .catch((err) => {
//       console.log(err);
//       res.status(400).json(err)});
// };

const clientes = (db) => (req, res) => {
  db('clientes')
    .select('*')
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json(err));
};

const direcciones = (db) => (req, res) => {
  const { email } = req.params;
  db('clientes_direcciones')
    .select('*')
    .where('email', '=', email)
    .then((data) => res.json([data[0], email]))
    .catch((err) => res.status(400).json(err));
};

module.exports = {
  reparaciones: reparaciones,
  clientes: clientes,
  direcciones: direcciones,
};
