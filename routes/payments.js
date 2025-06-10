const Payment = require("../schema/payment");

const index = async (req, res) => {
    try {
        const data = await Payment.find();
        return res.status(200).json({ data: data });
    } catch (error) {
        console.error(error);

        res.status(500).json({ message: "error getting payment" });

    }
};

const create = async (req, res) => {

    const { name, document, bank, number, type , status} = req.body;

    try {
        const payment = new Payment({ name, document, bank, number, type , status});

        const savedPayment = await payment.save();


        return res.status(201).json({ data: savedPayment });

    } catch (error) {

        console.error(error);

        res.status(500).json({ message: "error creating payment" });
    }
};

const show = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.paymentId);

        return res.status(200).json({ data: payment });
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: error });
    }
};
const update = async (req, res) => {

    const { name, document, bank, number, type, status } = req.body;
    const id_ = req.params.paymentId

    try {
        const savedPayment = await Payment.findByIdAndUpdate(id_, { name, document, bank, number, type, status });

        return res.status(200).json({ data: savedPayment });

    } catch (error) {

        console.error(error);

        res.status(500).json({ message: "error updating payment" });
    }
};


const destroy = async (req, res) => {

    try {

        const payment = await Payment.findByIdAndDelete(req.params.paymentId);

        return res.status(200).json({ data: payment });
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: error });
    }

};


module.exports = {destroy,update, show, create, index };