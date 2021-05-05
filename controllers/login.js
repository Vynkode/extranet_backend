const handleCreateLogin = (db, bcrypt, saltRounds) => async (req, res) => {
  const { contable, codigo, email } = req.body;
  try {
    const hash = bcrypt.hashSync(contable, saltRounds);
    await db('login_extranet').insert({
      codigo_contable: contable,
      codigo: codigo,
      email: email,
      hash: hash,
      first_time: true,
    });
    return res
      .status(200)
      .json(
        `El login para el ususario ${contable}/${codigo} se ha creado correctamente con el email: ${email}`
      );
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json(
        `No se ha podido crear el login para el usuario ${contable}/${codigo} con email: ${email}`
      );
  }
};

const handleUpdateLogin = db => async (req, res) => {
  const { contable, codigo, email } = req.body;
  try {
    const user = await db('login_extranet')
      .where({ codigo_contable: contable, codigo: codigo })
      .update({ email: email })
      .returning(['codigo_contable', 'codigo', 'email']);
    if (!user.length) throw new Error();
    console.log(user);
    return res
      .status(201)
      .json(
        `El email del usuario ${user[0].codigo_contable}/${user[0].codigo} se ha actualizado correctamente a ${user[0].email}`
      );
  } catch (err) {
    return res
      .status(401)
      .json(
        `No se ha podido actualizar el email: ${email} del usuario ${contable}/${codigo}`
      );
  }
};

const handleUpdatePasswordLogin = (db, bcrypt, saltRounds) => async (
  req,
  res
) => {
  const { contable, codigo, actualPassword, newPassword } = req.body;
  try {
    const user = await db('login_extranet')
      .select('codigo_contable', 'codigo', 'hash')
      .where({ codigo_contable: contable, codigo: codigo });
    if (!user.length) throw new Error('Error al buscar usuario');
    const validActualPassword = bcrypt.compareSync(
      actualPassword,
      user[0].hash
    );
    if (!validActualPassword) throw new Error('Error al validar');
    const hash = bcrypt.hashSync(newPassword, saltRounds);
    const updateUser = await db('login_extranet')
      .where({ codigo_contable: contable, codigo: codigo })
      .update({ hash: hash, first_time: false })
      .returning(['codigo_contable', 'codigo']);
    if (!updateUser.length) throw new Error('Error al actualizar password');
    return res
      .status(202)
      .json(
        `El usuario ${updateUser[0].codigo_contable}/${updateUser[0].codigo}  ha actualizado el password correctamente`
      );
  } catch (e) {
    return res
      .status(401)
      .json(
        `Ha ocurrido un error al actualizar el password del usuario ${contable}/${codigo}`
      );
  }
};

const createUser = async (db, bcrypt, saltRounds, user, i) => {
  const hash = bcrypt.hashSync(user.codigo_contable, saltRounds);
  try {
    console.log(
      `Usuario ${i + 1} creado => email: ${user.email}, hash: ${hash} (${
        hash.length
      })`
    );
    await db('login_extranet').insert({
      codigo_contable: user.codigo_contable,
      codigo: user.codigo,
      email: user.email,
      hash: hash,
      first_time: true,
    });

    return data;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const handleCreateAllLogin = (db, bcrypt, saltRounds) => async (req, res) => {
  try {
    console.log('Empezando a pasar users');
    const allUsers = await db('clientes_direcciones as cd')
      .select('c.codigo_contable', 'cd.codigo', 'cd.email')
      .join('clientes as c', 'c.nombre', '=', 'cd.nombre')
      .orderBy('c.codigo_contable');
    console.log(allUsers.length);
    // console.log(allUsers);

    // const data = allUsers.map((user, i) => {
    //   if (!user.email) return;
    //   const hash = bcrypt.hashSync(user.codigo_contable, saltRounds);
    //   const newUser = {
    //     codigo_contable: user.codigo_contable,
    //     codigo: user.codigo,
    //     email: user.email.trim(),
    //     hash: hash,
    //     first_time: true,
    //   };
    //   console.log(`User ${newUser.email} `);
    //   return db('login_extranet').insert(newUser);
    // });

    const reduced = allUsers.reduce(function (filtered, user) {
      if (user.email && user.codigo_contable) {
        const hash = bcrypt.hashSync(user.codigo_contable, saltRounds);
        const newUser = {
          codigo_contable: user.codigo_contable,
          codigo: user.codigo,
          email: user.email.trim(),
          hash: hash,
          first_time: true,
        };
        console.log(`User ${newUser.email} `);
        filtered.push(newUser);
      }
      return filtered;
    }, []);

    // const goodUsers = allUsers.filter(user => {
    //   if (!user.email) {
    //     return false;
    //   } else {
    //     // const hash = bcrypt.hashSync(user.codigo_contable, saltRounds);
    //     return {
    //       codigo_contable: user.codigo_contable,
    //       codigo: user.codigo,
    //       email: user.email.trim(),
    //       hash: '',
    //       first_time: true,
    //     };
    //   }
    // });
    console.log(reduced.length);
    console.log(reduced);
    // const data = await db('login_extranet').insert(reduced).returning('*');
    // const data = goodUsers.map((user, i) => {
    //   createUser(db, bcrypt, saltRounds, user, i);
    // });

    // return res.status(200).json([loginData.length, loginData]);
    return res.status(200).json(['Fin pasar users', reduced]);
  } catch (err) {
    console.log(err);
    return res.status(400).json('No se ha podido crear los usuarios');
  }
};

module.exports = {
  handleCreateLogin: handleCreateLogin,
  handleUpdateLogin: handleUpdateLogin,
  handleUpdatePasswordLogin: handleUpdatePasswordLogin,
  handleCreateAllLogin: handleCreateAllLogin,
};
