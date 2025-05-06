const User = require("../schema/user");

const getDeliveries = async (req, res) => {

    try {
        const data = await User.find({role: "delivery", status: true});
        return res.status(200).json({ data: data });
    } catch (error) {
        console.error(error);

        res.status(500).json({ message: "error getting category" });

    }

}

const getDelivery = async (req, res) => {
    const _id = req.params.userId
    try {
        const data = await User.findOne({role: "delivery", _id: _id, status: true});
        return res.status(200).json({ data: data });
    } catch (error) {
        console.error(error);

        res.status(500).json({ message: "error getting category" });

    }

}

const createDelivery = async (req, res) => {
    const { name, lastName, email, password } = req.body;

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
    
        const newUser = new User({ name, lastName, email, password, role });
    
        newUser.save();
    
        res
          .status(200)
          .json({message: "User Created successfully"});
      } catch (error) {
        console.error(error);

        res.status(500).json({ message: "error getting category" });
    }

 

}

const updateDelivery = async (req, res) => {
    const _id = req.params.userId

    const { name, lastName, email, password } = req.body;

    
     try {
        const user = await findByIdAndUpdate(_id,{ name, lastName, email, password })
    
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
        const user = await findByIdAndUpdate(_id ,{ status: false })
    
        user.save();
        return res.status(201).json({ data: user });

      } catch (error) {
        console.error(error);

        res.status(500).json({ message: "error getting category" });
    } 

}

module.exports = { getDeliveries, getDelivery, createDelivery, deleTeDelivery, updateDelivery };