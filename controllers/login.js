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
    // const login = await db('clientes_direcciones as cd')
    //   .select('c.codigo_contable', 'cd.codigo', 'cd.email')
    //   .join('clientes as c', 'c.nombre', '=', 'cd.nombre')
    //   .orderBy('cd.codigo_contable');
    // console.log(login.length);
    //
    // const goodUsers = login.filter(user => {
    //   if (!user.email) {
    //     return false;
    //   } else {
    //     return true;
    //   }
    // });
    // console.log(goodUsers.length);
    //
    // // return res.status(200).json(goodUsers);
    // const loginData = goodUsers.map((user, index) => {
    //   const email = user.email.trim();
    //   const hash = bcrypt.hashSync(user.telefono1, saltRounds);
    //   console.log(
    //     `Usuario ${index + 1} creado => email: ${email}, hash: ${hash} (${
    //       hash.length
    //     })`
    //   );
    //   return {
    //     email,
    //     hash,
    //   };
    // });
    // users.map(user => {
    //   const hash = bcrypt.hashSync(user.telefono1);
    //   db('login').insert({ email: user.email, hash: hash });
    //   console.log(['hecho', user.email, hash]);
    // });
    // return res.status(200).json([loginData.length, loginData]);
    // users.forEach(user => console.log(user[hash].length()));
    // return res.status(200).json([
    //   { hash, length: hash.length, login },
    //   { hash, length: hash.length, login2 },
    // ]);
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
      .status(200)
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

module.exports = {
  handleCreateLogin: handleCreateLogin,
  handleUpdateLogin: handleUpdateLogin,
  handleUpdatePasswordLogin: handleUpdatePasswordLogin,
};
