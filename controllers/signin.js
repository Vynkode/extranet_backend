const handleSignin = (db, bcrypt) => async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('incorrect form submission');
  }

  try {
    const user = await db
      .select(
        'cd.codigo',
        'c.codigo_contable',
        'cd.nombre',
        'c.razon_social',
        'c.nif',
        'cd.email',
        'cd.telefono1',
        'cd.calle',
        'cd.distrito',
        'cd.ciudad',
        'cd.provincia',
        'cd.contacto',
        'cd.fax'
      )
      .from('clientes_direcciones as cd')
      .where('cd.email', '=', email)
      .join('clientes as c', 'cd.nombre', '=', 'c.nombre');
    // .then((user) => {
    //   res.json(user);
    // })
    // .catch((err) => res.status(400).json(['wrong credentials', err]));
    // user.id = `${user.codigo_contable}/${user.codigo}`;
    // user[prueba] = 'hola';
    return res.status(200).json(user);
  } catch (err) {
    return res.status(400).json(err);
  }

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
