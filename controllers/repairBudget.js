const moment = require('moment');

const handleAcceptBudget = (db, bcrypt) => async (req, res) => {
  const { numero } = req.body;
  const date = moment().format('YYYY-MM-DD');
  try {
    const repair = await db('reparaciones')
      .where('numero', '=', numero)
      .update({
        f_respuesta_ppto: date,
        estado: 4,
      })
      .returning(['numero', 'f_respuesta_ppto']);
    if (!repair.length)
      throw new Error('No se ha podido actualizar correctamente la reparación');
    return res
      .status(200)
      .json(
        `El presupuesto ${repair[0].numero} se ha aceptado a fecha ${date}`
      );
  } catch (e) {
    return res.status(400).json(e.message);
  }
};

const handleRejectBudget = (db, bcrypt) => async (req, res) => {
  const { numero } = req.body;
  const date = moment().format('YYYY-MM-DD');
  try {
    const repair = await db('reparaciones')
      .where('numero', '=', numero)
      .update({
        f_respuesta_ppto: date,
        rechazado: 'S',
        estado: 3,
      })
      .returning(['numero', 'f_respuesta_ppto', 'rechazado']);
    if (!repair.length)
      throw new Error('No se ha podido actualizar correctamente la reparación');
    return res
      .status(200)
      .json(
        `El presupuesto ${repair[0].numero} se ha rechazado a fecha ${date}`
      );
  } catch (e) {
    return res.status(400).json(e.message);
  }
};

module.exports = {
  handleAcceptBudget: handleAcceptBudget,
  handleRejectBudget: handleRejectBudget,
};
