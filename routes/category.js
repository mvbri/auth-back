const Category = require("../schema/category");
const Product = require("../schema/product");


const index = async (req, res) => {
    try {
        const data = await Category.find();
        return res.status(200).json({ data: data });
    } catch (error) {
        console.error(error);

        res.status(500).json({ message: "error getting category" });

    }
};

const show = async (req, res) => {
    try {
        const category = await Category.findOne({slug : req.params.slug});

        const product = await Product.find({ category: { $in: [category._id] } }).populate(['images']);       

        return res.status(200).json({ data: category, products: product });
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: error });
    }
};


module.exports = { index, show };

