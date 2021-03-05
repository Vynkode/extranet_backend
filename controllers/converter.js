const converterImage = (db) => async (req, res) => {
  const repairs = await db('reparaciones as r').select('r.averia').where('r.numero', '=', '999999');
  // const repairsString = repairs[0].averia.toLowerCase();
  // const buffer = Buffer.from(repairs[0].averia);
  // console.log(buffer);
  return res.status(200).json(repairs[0]);
};

module.exports = {
  converterImage: converterImage,
};
