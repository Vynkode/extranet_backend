const moment = require('moment');

const { sendComment } = require('./emailsHandlers');

const handleComment = async (req, res) => {
  try {
    const { numero, mensaje } = req.body;
    await sendComment({
      subject: `Comentario sobre la reparación ${numero}`,
      message: mensaje,
    });
    res
      .status(201)
      .json(`Su comentario de la reparación ${numero} ha sido enviado`);
  } catch (e) {
    res.status(401).json(e);
  }
};

module.exports = { handleComment };
