const moment = require('moment');
const jwt = require('jsonwebtoken');

const handleSignin = (db, bcrypt) => async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('incorrect form submission');
  }
  const date = moment().format('YYYY-MM-DD hh:mm:ss.SSS');
  try {
    const [login] = await db
      .select('codigo_contable', 'email', 'codigo', 'hash', 'first_time')
      .from('login_extranet')
      .where('email', '=', email);
    if (!login.email) throw new Error();
    const isValid = bcrypt.compareSync(password, login.hash);
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
      if (!user.distribuidor) user.nombre = user.nombre.split('-')[0].trim();
      const token = jwt.sign({ id: user.id }, 'secretmgvsecret', {
        expiresIn: '4h',
      });
      console.log(`${date}: Acceso correcto del usuario ${user.id}`);
      return res.status(200).json({ user, token });
    } else {
      console.log(`${date}: Acceso erroneo del usuario ${user.id}`);
      return res.status(400).json('wrong credentials');
    }
  } catch (e) {
    return res.status(400).json('wrong credentials');
  }
};

const handleSigninToken = db => async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const date = moment().format('YYYY-MM-DD hh:mm:ss.SSS');
  if (token) {
    try {
      const validToken = jwt.verify(token, 'secretmgvsecret');
      const [login] = await db
        .select('codigo_contable', 'email', 'codigo', 'hash', 'first_time')
        .from('login_extranet')
        .where('codigo_contable', '=', validToken.id.slice(0, -2))
        .andWhere('codigo', '=', validToken.id.slice(-2));
      if (!login.email) throw new Error();
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
        .where('cd.email', '=', login.email)
        .andWhere('cd.codigo', '=', login.codigo)
        .andWhere('c.codigo_contable', '=', login.codigo_contable)
        .join('clientes as c', 'cd.nombre', '=', 'c.nombre');
      user.id = validToken.id;
      delete user.codigo;
      delete user.codigo_contable;
      user.first_time = login.first_time;
      if (!user.distribuidor) user.nombre = user.nombre.split('-')[0].trim();
      console.log(
        `${date}: Acceso correcto del usuario ${user.id} mediante token`
      );
      return res.status(202).json({ user });
    } catch (e) {
      return res.status(401).json('Invalid token');
    }
  }
};

module.exports = {
  handleSignin: handleSignin,
  handleSigninToken: handleSigninToken,
};
