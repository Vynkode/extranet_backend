const moment = require('moment');
const jwt = require('jsonwebtoken');

const reparaciones = db => (req, res) => {
  const obs = [];
  db('reparaciones')
    .select('codigo_contable', 'codigo_envio', 'proceso', 'numero')
    .where('proceso', '=', '8')
    .where('operario', '!=', 'INMA')
    .where('codigo_envio', '=', '00')
    .where('codigo_contable', '=', '43000014')
    .orderBy('codigo_contable')
    // .where('numero', '=', '1240300')
    // .limit(100)
    .then(data => {
      // data.forEach(d => {
      //   const accesorios = [
      //     d.accesorio1 ? d.accesorio1 : '',
      //     d.accesorio2 ? d.accesorio2 : '',
      //     d.accesorio3 ? d.accesorio3 : '',
      //     d.accesorio4 ? d.accesorio4 : '',
      //     d.accesorio5 ? d.accesorio5 : '',
      //   ];
      //
      //   // const date = moment(data[0].f_reparacion).format('DD/MM/YY');
      //   d.accesorios = accesorios;
      // });
      res.status(200).json([data.length, data]);
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
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
};

const clientes = db => (req, res) => {
  db('clientes')
    .select('*')
    .then(data => res.json(data))
    .catch(err => res.status(400).json(err));
};

const direcciones = db => (req, res) => {
  const { email, codigo } = req.body;
  db('clientes_direcciones as cd')
    .select('cd.email', 'cd.telefono1', 'c.nombre')
    // .where('cd.email', '=', email)
    .where('cd.email', '=', email)
    .join('clientes as c', 'cd.nombre', '=', 'c.nombre')
    .then(data => res.json([data[0], email]))
    .catch(err => res.status(400).json(err));
};

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
      console.log(user.nombre);
      console.log(`${date}: Acceso correcto del usuario ${user.id}`);
      const token = jwt.sign({ id: user.id }, 'secretmgvsecret');
      return res.status(200).json({ user, token });
    } else {
      console.log(`${date}: Acceso erroneo del usuario ${user.id}`);
      return res.status(400).json('wrong credentials');
    }
  } catch (e) {
    return res.status(400).json('wrong credentials');
  }
};

module.exports = {
  reparaciones: reparaciones,
  clientes: clientes,
  direcciones: direcciones,
  pruebaSignin: handleSignin,
};
