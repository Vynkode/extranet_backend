const reparaciones = (db) => (req, res) => {
  db('reparaciones')
    .select('*')
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json(err));
};

const clientes = (db) => (req, res) => {
  db('clientes')
    .select('*')
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json(err));
};

const direcciones = (db) => (req, res) => {
  const email = req.params;
  db('clientes_direcciones')
    .select('*')
    .where('email', '=', email)
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json(err));
};

module.exports = {
  reparaciones: reparaciones,
  clientes: clientes,
  direcciones: direcciones,
};
