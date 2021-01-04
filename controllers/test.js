const test = (db) => async (req, res) => {
  db('reparaciones')
    .select('*')
    .then((data) => res.json(data))
    .catch((err) => res.status(200).json(err));
};

module.exports = { test: test };
