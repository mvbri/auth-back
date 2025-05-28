const Category = require("../schema/category");
const Product = require("../schema/product");
const Image = require("../schema/image");
const fs = require('fs');

const index = async (req, res) => {
    try {
        const data = await Category.find().populate(['image']);
        return res.status(200).json({ data: data });
    } catch (error) {
        console.error(error);

        res.status(500).json({ message: "error getting category" });

    }
};

const create = async (req, res) => {

    const { name, description, menu } = req.body;
    
    const file = req.file;

    try {
        const category = new Category({ name, description, menu });

        const savedCategory = await category.save();

        if (typeof (file) !== "undefined") {
            const newImage = new Image({
                url: file.filename,
                category: savedCategory._id,
            });

            await newImage.save();


            savedCategory.image = newImage._id;

            await savedCategory.save();

        }

        return res.status(201).json({ data: savedCategory });

    } catch (error) {
        if (typeof (file) !== "undefined") {
            fs.unlink(file.path, (err) => {
                if (err) {
                    console.error(`Error removing file: ${err}`);
                    return;
                }
                console.log(`File ${file.path} has been successfully removed.`);
            });
        }
        console.error(error);

        res.status(500).json({ message: "error creating category" });
    }
};

const show = async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.categoryId }).populate(['image']);

        return res.status(200).json({ data: category });
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: error });
    }
};

const showBySlug = async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug }).populate(['image']);

        const product = await Product.find({ status: true, category: { $in: [category._id] } }).populate(['images']);

        return res.status(200).json({ data: category, products: product });
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: error });
    }
};

const update = async (req, res) => {

    const { name, description, menu } = req.body;
    const file = req.file;
    const id_ = req.params.categoryId

    try {
        const savedCategory = await Category.findByIdAndUpdate(id_, { name, description, menu });


        if (typeof (file) !== "undefined") {

            const oldImage = typeof (savedCategory.image) !== "undefined" ? savedCategory.image : false;

            const newImage = new Image({
                url: file.filename,
                category: savedCategory._id,
            });

            await newImage.save();

            savedCategory.image = newImage._id;

            await savedCategory.save();

            if (oldImage) {
                const oldImageDelete = await Image.findByIdAndDelete(oldImage);
                fs.unlink(`./public/images/category/${oldImageDelete.url}`, (err) => {
                    if (err) {
                        console.error(`Error removing file: ${err}`);
                        return;
                    }
                    console.log(`File ${oldImageDelete.url} has been successfully removed.`);
                });
            }

        }

        return res.status(200).json({ data: savedCategory });

    } catch (error) {
        if (typeof (file) !== "undefined") {
            fs.unlink(file.path, (err) => {
                if (err) {
                    console.error(`Error removing file: ${err}`);
                    return;
                }
                console.log(`File ${file.path} has been successfully removed.`);
            });
        }
        console.error(error);

        res.status(500).json({ message: "error updating category" });
    }
};


const destroy = async (req, res) => {


    try {
        const product = await Product.find({ category: { $in: [req.params.categoryId] } });

        if (product) {
            return res.status(422).json({ message: "La categoría posee productos asociados" });
        }

        const category = await Category.findByIdAndDelete(req.params.categoryId);

        if (typeof (category.image) !== 'undefined') {
            const imageDelete = await Image.findByIdAndDelete(category.image);

            fs.unlink(`./public/images/category/${imageDelete.url}`, (err) => {
                if (err) {
                    console.error(`Error removing file: ${err}`);
                    return;
                }
                console.log(`File ${imageDelete.url} has been successfully removed.`);
            });
        }

        return res.status(200).json({ data: category });
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: error });
    }

};



module.exports = { index, show, showBySlug, create, update, destroy };

