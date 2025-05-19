
const index = async (req, res) => {
    try {
        const data = await Address.find({user_id : req.user._id});
        return res.status(200).json({ data: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "error getting address" });

    }
};


const adminIndex = async (req, res) => {
    try {
        const data = await Address.find().populate('user');
        return res.status(200).json({ data: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "error getting address" });

    }
};

const create = async (req, res) => {

    const { firstname, lastname, parish, address, phone } = req.body;

    const customer = req.user.id;

    try {
        const savedAddress = new Address({ firstname, lastname, parish,address, phone, customer });

          await savedAddress.save();

        return res.status(201).json({ data: savedAddress });

    } catch (error) {

        console.error(error);

        res.status(500).json({ message: "error creating address" });
    }
};

const show = async (req, res) => {
    try {
        const data = await Address.findOne({_id : req.params.addressId});
        return res.status(200).json({ data: data });
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: error });
    }
};

const update = async (req, res) => {

    const { firstname, lastname, parish, address, phone } = req.body;
    const id_ = req.params.addressId

    try {
        const savedAddress = await Address.findByIdAndUpdate(id_,{ firstname, lastname, parish, address, phone });

        await savedAddress.save();

        return res.status(201).json({ data: savedAddress });

    } catch (error) {

        console.error(error);

        res.status(500).json({ message: "error updating address" });
    }

};

const destroy = async (req, res) => {

    try {
        const data = await Address.findByIdAndDelete(req.params.addressId);
      
        return res.status(200).json({ data: data });
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: error });
    }

};



module.exports = { index, adminIndex, create, show ,update, destroy };
