const handleCreateLogin = (db, bcrypt, saltRounds) => async (req, res) => {
  try {
    // const { contable, codigo, email } = req.body;
    // const hash = bcrypt.hashSync(contable, saltRounds);
    // await db('login_extranet').insert({
    //   codigo_contable: contable,
    //   codigo: codigo,
    //   email: email,
    //   hash: hash,
    //   first_time: true,
    // });
    // return res
    //   .status(200)
    //   .json([
    //     'El login para el ususario se ha creado correctamente',
    //     { codigo_contable: contable, codigo, email },
    //   ]);
    const login = await db('clientes_direcciones as cd')
      .select('c.codigo_contable', 'cd.codigo', 'cd.email')
      .join('clientes as c', 'c.nombre', '=', 'cd.nombre')
      .orderBy('cd.codigo_contable');
    console.log(login.length);

    const goodUsers = login.filter(user => {
      if (!user.email) {
        return false;
      } else {
        return true;
      }
    });
    console.log(goodUsers.length);

    // return res.status(200).json(goodUsers);
    const loginData = goodUsers.map((user, index) => {
      const email = user.email.trim();
      const hash = bcrypt.hashSync(user.telefono1, saltRounds);
      console.log(
        `Usuario ${index + 1} creado => email: ${email}, hash: ${hash} (${
          hash.length
        })`
      );
      return {
        email,
        hash,
      };
    });
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
      .json(['No se ha podido crear el login para este usuario']);
  }
};

const handleUpdateLogin = db => async (req, res) => {
  try {
    const { contable, codigo, email } = req.body;
    const user = await db('login_extranet')
      .where({ codigo_contable: contable, codigo: codigo })
      .update({ email: email })
      .returning('*');
    return res
      .status(200)
      .json(['El login del usuario se ha actualizado correctamente', user]);
  } catch (err) {
    return res
      .status(401)
      .json(
        'No se ha podido actualizar el login del usuario, vuelva a intentarlo mas tarde'
      );
  }
};

module.exports = {
  handleCreateLogin: handleCreateLogin,
  handleUpdateLogin: handleUpdateLogin,
};
