const handleCreateAllLogin = (db, bcrypt, saltRounds) => async (req, res) => {
  try {
    console.log('Empezando a pasar users');
    const allUsers = await db('clientes_direcciones as cd')
      .select('c.codigo_contable', 'cd.codigo', 'cd.email')
      .join('clientes as c', 'c.nombre', '=', 'cd.nombre')
      .orderBy('c.codigo_contable');
    console.log(allUsers.length);

    const users = allUsers.reduce(function (filtered, user) {
      if (
        user.email &&
        user.codigo_contable &&
        user.codigo_contable !== 'Uso Interno'
      ) {
        const hash = bcrypt.hashSync(user.codigo_contable, saltRounds);
        const newUser = {
          codigo_contable: user.codigo_contable,
          codigo: user.codigo,
          email: user.email.trim(),
          hash: hash,
          first_time: true,
        };
        console.log(
          `${newUser.codigo_contable}${newUser.codigo}: ${newUser.email} => ${newUser.hash} `
        );
        filtered.push(newUser);
      }
      return filtered;
    }, []);

    console.log(users.length);
    console.log(users);
    const data = await db('login_extranet')
      .insert(users)
      .onConflict(['codigo_contable', 'codigo'])
      .ignore()
      .returning('*');

    return res.status(200).json(['Fin pasar users', data]);
  } catch (err) {
    console.log(err);
    return res.status(400).json('No se ha podido crear los usuarios');
  }
};
