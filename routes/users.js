const User = require("../schema/user");
const getUserInfo = require("../lib/getUserInfo");

const getDeliveries = async (req, res) => {

  try {
    const data = await User.find({ role: "delivery" });
    return res.status(200).json({ data: data });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "error getting category" });

  }

}

const getCustomers = async (req, res) => {

  try {
    const data = await User.find({ role: "customer" });
    return res.status(200).json({ data: data });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "error getting category" });

  }

}

const getAdmins = async (req, res) => {

  try {
    const data = await User.find({ role: "admin" });
    return res.status(200).json({ data: data });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "error getting category" });

  }

}

const getUser = async (req, res) => {
  const _id = req.params.userId
  try {
    const data = await User.findOne({ _id: _id });
    return res.status(200).json({ data: data });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "error getting category" });

  }

}

const createCustomer = async (req, res) => {
  const { name, email, password, phone, question, answer, status } = req.body;

  const role = 'customer';


  try {
    const exists = await User.findOne({ email: email });

    if (exists) {
      return res.status(400).json(
        {
          error: "Email already exists",
        }
      );
    }

    const newUser = new User({ name, email, password, role, phone, question, answer, status });

    await newUser.save();

    res
      .status(200)
      .json({ data: newUser, message: "User Created successfully" });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "error getting customer" });
  }

}

const createAdmin = async (req, res) => {
  const { name, email, password, phone, question, answer, status } = req.body;

  const role = 'admin';


  try {
    const exists = await User.findOne({ email: email });

    if (exists) {
      return res.status(400).json(
        {
          error: "Email already exists",
        }
      );
    }

    const newUser = new User({ name, email, password, role, phone, question, answer, status });

    await newUser.save();

    res
      .status(200)
      .json({ data: newUser, message: "User Created successfully" });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "error getting customer" });
  }

}

const createDelivery = async (req, res) => {
  const { name, email, password, phone, question, answer, status } = req.body;

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

    const newUser = new User({ name, email, password, role, phone, question, answer, status });

    await newUser.save();

    res
      .status(200)
      .json({ data: newUser, message: "User Created successfully" });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "error getting category" });
  }



}


const updateUser = async (req, res) => {
  const _id = req.params.userId

  const { name, email, password, question, answer, phone, status } = req.body;


  try {
    const data = {
      name, email, question, phone, status
    }
    if (answer !== "") data.answer = answer;

    if (password !== "") data.password = password;

    const user = await User.findByIdAndUpdate(_id, data)

    if (typeof answer !== 'undefined') user.answer = answer;

    if (typeof password !== 'undefined') user.password = password;

    await user.save();
    
    return res.status(201).json({ data: user });

  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "error getting category" });
  }

}



const deleteUser = async (req, res) => {
  const _id = req.params.userId

  try {
    const user = await User.findByIdAndDelete(_id);

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

module.exports = { passwordReset, updateSession, getDeliveries, getCustomers, getAdmins, getUser, createDelivery, createAdmin, deleteUser, updateUser, createCustomer };