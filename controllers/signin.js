const handleSignin = (db, bcrypt) => async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('incorrect form submission');
  }
  // SIGNIN TEST
  // try {
  //   const user = await db
  //     .select(
  //       'cd.codigo',
  //       'c.codigo_contable',
  //       'cd.nombre',
  //       'c.razon_social',
  //       'c.nif',
  //       'cd.email',
  //       'cd.telefono1',
  //       'cd.calle',
  //       'cd.distrito',
  //       'cd.ciudad',
  //       'cd.provincia',
  //       'cd.contacto',
  //       'cd.fax',
  //       'c.distribuidor'
  //     )
  //     .from('clientes_direcciones as cd')
  //     .where('cd.email', '=', email)
  //     .join('clientes as c', 'cd.nombre', '=', 'c.nombre');
  //   user[0].id = `${user[0].codigo_contable}${user[0].codigo}`;
  //   delete user[0].codigo;
  //   delete user[0].codigo_contable;
  //   return res.status(200).json(user[0]);
  // } catch (err) {
  //   return res.status(400).json(['wrong credentials', err]);
  // }
  // SIGNIN LOGIN_EXTRANET
  try {
    const [login] = await db
      .select('codigo_contable', 'email', 'codigo', 'hash')
      .from('login_extranet')
      .where('email', '=', email);
    console.log(login);
    if (!login.email) throw new Error();
    const isValid = bcrypt.compareSync(password, login.hash);
    let user;
    if (isValid) {
      try {
        const [data] = await db
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
            'cd.fax',
            'c.distribuidor'
          )
          .from('clientes_direcciones as cd')
          .where('cd.email', '=', email)
          .andWhere('cd.codigo', '=', login.codigo)
          .andWhere('c.codigo_contable', '=', login.codigo_contable)
          .join('clientes as c', 'cd.nombre', '=', 'c.nombre');
        data.id = `${data.codigo_contable}${data.codigo}`;
        delete data.codigo;
        delete data.codigo_contable;
        console.log(data);
        user = data;
      } catch (e) {
        return res.status(400).json('unable to get user');
      }
    } else {
      return res.status(400).json('wrong credentials');
    }
    return res.status(205).json(user);
  } catch (e) {
    return res.status(400).json('wrong credentials');
  }
};

module.exports = {
  handleSignin: handleSignin,
};
