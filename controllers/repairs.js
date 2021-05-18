const moment = require('moment');

const handleRepairs = db => async (req, res) => {
  // console.log(req.query);
  let { codigo, dir, status } = req.query;
  // status = Number(status);
  // console.log(status);
  let find;
  if (status === '8') find = '=';
  if (status === '0') find = '!=';
  // console.log(`proceso ${find} 8`);

  try {
    const repairs = await db('reparaciones as r')
      // .leftJoin('tipos_de_aparatos as ta', 'r.tipo_aparato', 'ta.tipo_aparato')
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
        'r.p_liquido',
        'r.f_reparacion',
        'r.modelo_sustutucion',
        'r.reparacion',
        'r.f_liquido',
        'r.agencia',
        'r.f_entrega',
        'r.proceso',
        'r.estado',
        'r.accesorio1 as acc1',
        'r.accesorio2 as acc2',
        'r.accesorio3 as acc3',
        'r.accesorio4 as acc4',
        'r.accesorio5 as acc5'
        // 'ta.accesorio1',
        // 'ta.accesorio2',
        // 'ta.accesorio3',
        // 'ta.accesorio4',
        // 'ta.accesorio5'
      )
      .where(builder => {
        builder
          .where('r.codigo_contable', '=', codigo)
          .where('r.codigo_envio', '=', dir)
          .whereRaw('(r.operario != ? or r.operario is null)', 'INMA')
          .where('r.proceso', find, 8);
      })
      .limit(100)
      .orderBy('r.f_entrada', 'desc');

    const count = repairs.length;
    console.log(count);
    if (!count) return res.status(202).json([count, repairs]);
    repairs.forEach(element => {
      if (element.foto_entrada) {
        element.foto_entrada = Buffer.from(element.foto_entrada).toString(
          'base64'
        );
      }

      if (element.tipo_reparacion === '1') {
        element.tipo_reparacion = 'No Garantía';
        element.fecha_compra = null;
      }
      if (element.tipo_reparacion === '2') {
        element.tipo_reparacion = 'Garantía';
        element.fecha_compra = moment(element.fecha_compra).format('DD/MM/YY');
      }
      if (element.tipo_reparacion === '3') {
        element.tipo_reparacion = 'Reclamación';
        element.fecha_compra = null;
      }

      element.f_entrada = moment(element.f_entrada).format('DD/MM/YY');

      const averiaString = element.averia ? element.averia.toString() : '';
      if (averiaString) {
        element.averia =
          averiaString[0].toUpperCase() + averiaString.slice(1).toLowerCase();
      } else {
        element.averia = '';
      }

      const observacionesString = element.observaciones
        ? element.observaciones.toString()
        : '';
      if (observacionesString) {
        element.observaciones =
          observacionesString[0].toUpperCase() +
          observacionesString.slice(1).toLowerCase();
      } else {
        element.observaciones = '';
      }

      if (
        element.presupuestar === '' ||
        element.presupuestar === 'N' ||
        !element.presupuestar
      ) {
        element.presupuestar = 'No';
      } else {
        element.presupuestar = 'Sí';
      }

      if (element.f_presupuesto) {
        element.f_presupuesto = moment(element.f_presupuesto).format(
          'DD/MM/YY'
        );
      } else {
        element.f_presupuesto = null;
      }

      if (element.f_respuesta_ppto) {
        element.f_respuesta_ppto = moment(element.f_respuesta_ppto).format(
          'DD/MM/YY'
        );
      } else {
        element.f_respuesta_ppto = null;
      }

      if (
        element.rechazado === '' ||
        element.rechazado === 'N' ||
        !element.rechazado
      ) {
        element.rechazado = 'No';
      } else {
        element.rechazado = 'Sí';
      }

      const presupuestoString = element.presupuesto
        ? element.presupuesto.toString()
        : '';
      if (presupuestoString) {
        element.presupuesto =
          presupuestoString[0].toUpperCase() +
          presupuestoString.slice(1).toLowerCase();
      } else {
        element.presupuesto = '';
      }

      // element.p_base_imponible = parseFloat(element.p_base_imponible).toFixed(2);
      element.p_liquido = parseFloat(element.p_liquido).toFixed(2);

      if (element.f_reparacion) {
        element.f_reparacion = moment(element.f_reparacion).format('DD/MM/YY');
        // element.accesorios = [];
        // if (element.acc1 && element.accesorio1)
        //   element.accesorios.push(element.accesorio1);
        // if (element.acc2 && element.accesorio2)
        //   element.accesorios.push(element.accesorio2);
        // if (element.acc3 && element.accesorio3)
        //   element.accesorios.push(element.accesorio3);
        // if (element.acc4 && element.accesorio4)
        //   element.accesorios.push(element.accesorio4);
        // if (element.acc5 && element.accesorio5)
        //   element.accesorios.push(element.accesorio5);
      } else {
        element.f_reparacion = null;
      }
      ['acc1', 'acc2', 'acc3', 'acc4', 'acc5'].forEach(k => delete element[k]);
      [
        'accesorio1',
        'accesorio2',
        'accesorio3',
        'accesorio4',
        'accesorio5',
      ].forEach(k => delete element[k]);

      const reparacionString = element.reparacion
        ? element.reparacion.toString()
        : '';
      if (reparacionString) {
        element.reparacion =
          reparacionString[0].toUpperCase() +
          reparacionString.slice(1).toLowerCase();
      } else {
        element.reparacion = '';
      }

      // element.f_base_imponible = parseFloat(element.f_base_imponible).toFixed(2);
      element.f_liquido = parseFloat(element.f_liquido).toFixed(2);

      if (
        element.agencia === 'SEUR' ||
        element.agencia === 'CORREOS' ||
        element.agencia === 'ENVIALIA' ||
        element.agencia === 'SUS MEDIOS' ||
        element.agencia === 'SUS MEDI'
      ) {
        element.agencia = 'ENVÍO';
      } else {
        element.agencia = 'RECOGIDA';
      }

      if (element.f_entrega) {
        element.f_entrega = moment(element.f_entrega).format('DD/MM/YY');
      } else {
        element.f_entrega = null;
      }
      if (
        element.proceso === 1 ||
        element.proceso === 4 ||
        element.proceso === 7
      )
        element.procesoEstado = 'EN REPARACIÓN';
      if (element.proceso === 2) element.procesoEstado = 'PTO DISPONIBLE';
      if (element.proceso === 3) element.procesoEstado = 'PDTE RESPUESTA';
      if (element.proceso === 5 || element.proceso === 9)
        element.procesoEstado = 'PDTE MATERIAL';
      if (element.proceso === 6)
        element.procesoEstado = 'REPARACION FINALIZADA';
      if (element.proceso === 8 && element.estado === 99)
        element.procesoEstado = 'PDTE RECOGER';
      if (element.proceso === 8 && element.estado === 102)
        element.procesoEstado = 'ENTREGADO CLIENTE';
      if (element.proceso === 8 && element.estado === 103)
        element.procesoEstado = 'ENVIADO AGENCIA';
      if (element.proceso === 8 && element.estado === 105)
        element.procesoEstado = 'PDTE ENVIO';
    });
    return res.status(200).json([count, repairs]);
  } catch (error) {
    console.log(error);
    return res.status(400).json(['No se han encontrado reparaciones', error]);
  }
};

module.exports = {
  handleRepairs: handleRepairs,
};
