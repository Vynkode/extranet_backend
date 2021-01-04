const test = (db) => async (req, res) => {
  db('reparaciones')
    .select('*')
    .then((data) => res.json(data));
};

module.exports = { test: test };
