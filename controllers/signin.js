const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('incorrect form submission');
  }

  db.select('*')
    .from('clientes_direcciones as cd')
    .where('cd.email', '=', email)
    .join('clientes as c', 'cd.nombre', '=', 'c.nombre')
    .then((user) => {
      res.json(user);
    })
    .catch((err) => res.status(400).json(['wrong credentials', err]));

  //   db.select('email', 'hash')
  //     .from('login')
  //     .where('email', '=', email)
  //     .then((data) => {
  //       const isValid = bcrypt.compareSync(password, data[0].hash);
  //       if (isValid) {
  //         return db
  //           .select('*')
  //           .from('clientes_direcciones as cd')
  //           .where('email', '=', email)
  //           .then((user) => {
  //             res.json(user[0]);
  //           })
  //           .catch((err) => res.status(400).json('unable to get user'));
  //       } else {
  //         res.status(400).json('wrong credentials');
  //       }
  //     })
  //     .catch((err) => res.status(400).json('wrong credentials'));
};

module.exports = {
  handleSignin: handleSignin,
};
