const User = require("../schema/user");
const getUserInfo = require("../lib/getUserInfo");

const getDeliveries = async (req, res) => {

  try {
    const data = await User.find({ role: "delivery", status: true });
    return res.status(200).json({ data: data });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "error getting category" });

  }

}

const getDelivery = async (req, res) => {
  const _id = req.params.userId
  try {
    const data = await User.findOne({ role: "delivery", _id: _id, status: true });
    return res.status(200).json({ data: data });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "error getting category" });

  }

}

const createDelivery = async (req, res) => {
  const { name, email, password, phone, question, answer } = req.body;

  const role = 'delivery';


  try {
    const exists = await User.findOne({ email: email });

    if (exists) {
      return res.status(400).json(
        {
          error: "Email already exists",
        }
      );
    }

    const newUser = new User({ name, email, password, role, phone, question, answer });

    newUser.save();

    res
      .status(200)
      .json({ message: "User Created successfully" });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "error getting category" });
  }



}

const updateDelivery = async (req, res) => {
  const _id = req.params.userId

  const { name, email, password } = req.body;


  try {
    const user = await findByIdAndUpdate(_id, { name, email, password })

    user.save();
    return res.status(201).json({ data: user });

  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "error getting category" });
  }

}

const deleTeDelivery = async (req, res) => {
  const _id = req.params.userId

  try {
    const user = await findByIdAndUpdate(_id, { status: false })

    user.save();
    return res.status(201).json({ data: user });

  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "error getting category" });
  }

}

const updateSession = async (req, res) => {

  const _id = req.user.id
  const { name, password, newPassword, question, answer, phone } = req.body;

  try {
    const data = await User.findOne({ _id, status: true }).select('+password')

    if (data == null)
      throw "Error al Actualizar";

    const correctPassword = await data.comparePassword(password, data.password);

    if (correctPassword) {

      data.name = name
      data.phone = phone
      data.question = question

      if (answer !== "") data.answer = answer;
      if (newPassword !== "") data.password = newPassword;

      await data.save();

      const accessToken = data.createAccessToken();
      const refreshToken = await data.createRefreshToken();

      res.status(200).json({
        user: getUserInfo(data),
        accessToken,
        refreshToken,
      });


    } else {
      throw "Contraseña Incorrecta";
    }

  } catch (error) {
    console.error(error);

    res.status(500).json({ message: error });
  }

}

const passwordReset = async (req, res) => {
  const { email, password, answer } = req.body;
  const { step } = req.params;

  try {
    let data = null
    let correctAnswer = false

    switch (step) {


      case "1":

        data = await User.findOne({ email, status: true })

        if (data == null) throw "Email no encontrado";

        return res.status(200).json({ data: data });

      case "2":

        data = await User.findOne({ email, status: true }).select('+answer')

        correctAnswer = await data.comparePassword(answer, data.answer);

        if (data == null) throw "Email no encontrado";

        if (correctAnswer) {
          data.answer = answer;
          return res.status(200).json({ data: data });
        } else throw "Respuesta Incorrecta";

      case "3":

        data = await User.findOne({ email, status: true }).select('+answer')

        correctAnswer = await data.comparePassword(answer, data.answer);

        if (data == null) throw "Email no encontrado";

        if (correctAnswer) {
          data.password = password;
          await data.save()
          return res.status(200).json({ data: data });
        } else throw "Respuesta Incorrecta";




      default:
        throw "pruebs no encontrado";

        break;


    }

  } catch (error) {
    console.error(error);


    res.status(500).json({ message: error });
  }

}

module.exports = { passwordReset, updateSession, getDeliveries, getDelivery, createDelivery, deleTeDelivery, updateDelivery };