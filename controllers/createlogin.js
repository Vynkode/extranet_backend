const handleCreateLogin = (db, bcrypt) => async (req, res) => {
  try {
    const login = await db('clientes_direcciones as cd').select('cd.email', 'cd.telefono1').join('clientes as c', 'c.nombre', '=', 'cd.nombre').orderBy('cd.email');
    const users = login
      .filter((user) => {
        if (!user.email || !user.telefono1) {
          return false;
        } else {
          return true;
        }
      })
      .map((user) => ({
        email: user.email.trim(),
        hash: bcrypt.hashSync(user.telefono1),
      }));
    // await db('login').insert({ email: 'kevin@gmail.com', hash: 'asdaisdjaiosda' });
    // users.map((user) => {
    //   const hash = bcrypt.hashSync(user.telefono1);
    //   db('login').insert({ email: user.email, hash: hash });
    //   console.log(['hecho', user.email, hash]);
    // });
    await db('login').insert(users).onConflict('email').ignore();

    console.log(users);
    return res.status(200).json(users);
  } catch (err) {
    return res.status(400).json(err);
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

module.exports = {
  handleCreateLogin: handleCreateLogin,
};
