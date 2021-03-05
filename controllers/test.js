const moment = require('moment');

const reparaciones = (db) => (req, res) => {
  const obs = [];
  db('reparaciones')
    // .select('numero','observaciones', 'f_reparacion').where('numero', '=', '1240300')
    .select('f_reparacion').where('numero', '=', '1240300')
    // .limit(100)
    .then((data) => {
      // const date = moment(data[0].f_reparacion).format('DD/MM/YY');
      res.status(200).json(data)
    })
      // if(data[0].observaciones) {
      //   console.log(data);
      //   res.status(200).json([data[0].numero, 'Hay datos', data[0].observaciones])
      // } else {
      //   console.log(data);
      //   res.status(200).json([data[0].numero, 'No hay datos', data[0].observaciones])
      // }

      // data.forEach(d => {
      //   if(d.observaciones) {
      //     console.log(d.numero);
      //     const str = d.observaciones.toString().toLowerCase();
      //     const upper = str[0].toUpperCase() + str.slice(1);
      //     console.log(upper);
      //     obs.push(upper);
      //   }
      // })
      // res.status(200).json(data);
    // })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err)});
};

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
