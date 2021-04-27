const handleCreateLogin = (db, bcrypt, saltRounds) => async (req, res) => {
  try {
    // const { contable, codigo, email } = req.query;
    // const login = await db('clientes_direcciones as cd')
    //   .select('c.codigo_contable', 'cd.codigo', 'cd.email')
    //   .join('clientes as c', 'c.nombre', '=', 'cd.nombre')
    //   .orderBy('cd.codigo_contable');
    // console.log(login.length);
    // const goodUsers = login.filter(user => {
    //   if (!user.email) {
    //     return false;
    //   } else {
    //     return true;
    //   }
    // });
    // console.log(goodUsers.length);
    // return res.status(200).json(goodUsers);
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
    const hash = bcrypt.hashSync('hola', saltRounds);
    await db('login_extranet').insert({
      codigo_contable: '012345678901',
      codigo: '00',
      email: 'kevin@gmail.com',
      hash: hash,
      first_time: true,
    });
    // users.map(user => {
    //   const hash = bcrypt.hashSync(user.telefono1);
    //   db('login').insert({ email: user.email, hash: hash });
    //   console.log(['hecho', user.email, hash]);
    // });
    // await db('login').insert(users).onConflict('email').ignore();

    // console.log(users);
    // return res.status(200).json([loginData.length, loginData]);
    // users.forEach(user => console.log(user[hash].length()));
    // const hash = bcrypt.hashSync('nazaret', saltRounds);
    // const login = bcrypt.compareSync('nazaret', hash);
    // const login2 = bcrypt.compareSync('malmalmal', hash);

    // return res.status(200).json([
    //   { hash, length: hash.length, login },
    //   { hash, length: hash.length, login2 },
    // ]);
  } catch (err) {
    console.log(err);
    return res.status(400).json('err');
  }

  // db.transaction((trx)=> {
  //     trx.select('cd.email', 'cd.telefono').from('clientes_direcciones as cd').join('clientes as c', 'c.nombre', '=', 'cd.nombre')
  // })
  //   const hash = bcrypt.hashSync(password);
  //   db.transaction((trx) => {
  //     trx
  //       .insert({
  //         hash: hash,
  //         email: email,
  //       })
  //       .into('login')
  //       .returning('email')
  //       .then((loginEmail) => {
  //         return trx('users')
  //           .returning('*')
  //           .insert({
  //             email: loginEmail[0],
  //             name: name,
  //             joined: new Date(),
  //           })
  //           .then((user) => {
  //             res.json(user[0]);
  //           });
  //       })
  //       .then(trx.commit)
  //       .catch(trx.rollback);
  //   }).catch((err) => res.status(400).json('unable to register'));
};

const handleUpdateLogin = db => async (req, res) => {
  try {
    const { contable, codigo, email } = req.params;
    const [user] = await db('login_extranet')
      .where({ codigo_contable: contable, codigo: codigo })
      .insert({ email: email });

    return res.status(200).json(`Usuario actualizado: ${user}`);
  } catch (err) {
    return res.status(401).json('Ha habido un error al actualizar el usuario');
  }
};

module.exports = {
  handleCreateLogin: handleCreateLogin,
  handleUpdateLogin: handleUpdateLogin,
};
