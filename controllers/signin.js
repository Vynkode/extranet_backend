const moment = require('moment');

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
      .select('codigo_contable', 'email', 'codigo', 'hash', 'first_time')
      .from('login_extranet')
      .where('email', '=', email);
    if (!login.email) throw new Error();
    const isValid = bcrypt.compareSync(password, login.hash);
    // let user;
    if (isValid) {
      const [user] = await db
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
      user.id = `${user.codigo_contable}${user.codigo}`;
      delete user.codigo;
      delete user.codigo_contable;
      user.first_time = login.first_time;
      if (!user.distribuidor) user.name = user.name.split('-')[0].trim();
      console.log(
        `${moment().format(
          'YYYY-MM-DD hh:mm:ss.SSS'
        )}: Acceso correcto del usuario ${user.id}`
      );
      return res.status(200).json(user);
    } else {
      console.log(
        `${moment().format(
          'YYYY-MM-DD hh:mm:ss.SSS'
        )}: Acceso erroneo del usuario ${user.id}`
      );
      return res.status(400).json('wrong credentials');
    }
  } catch (e) {
    return res.status(400).json('wrong credentials');
  }
};

module.exports = {
  handleSignin: handleSignin,
};
