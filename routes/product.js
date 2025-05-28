const Product = require("../schema/product");
const fs = require('fs');
const Category = require("../schema/category");
const Image = require("../schema/image");


const index = async (req, res) => {
    try {
        const data = await Product.find().populate(['images', 'category']);
        return res.status(200).json({ data: data });
    } catch (error) {
        console.error(error);

        res.status(500).json({ message: "error getting product" });

    }

};

const create = async (req, res) => {

    const { name, description, stock, price, priceIVA, status } = req.body;
    const files = req.files;

    const category = req.body.category.split(',');

    try {
        const product = new Product({ name, description, stock, price, priceIVA , category, status});

        const savedProduct = await product.save();

        const fileRecords = files.map(file => ({
            url: file.filename,
            product: savedProduct._id,
        }));

        const images = await Promise.all(fileRecords.map(async (imageName) => {
            const newImage = new Image(imageName);
            return await newImage.save();
        }));

        savedProduct.images = images.map(image => image._id);

        await savedProduct.save();

        return res.status(201).json({ data: savedProduct });

    } catch (error) {
        for (const key in files) {
            fs.unlink(files[key].path, (err) => {
                if (err) {
                    console.error(`Error removing file: ${err}`);
                    return;
                }
                console.log(`File ${files[key].path} has been successfully removed.`);
            });
        }

        console.error(error);

        res.status(500).json({ message: "error creating product" });
    }
};


const show = async (req, res) => {
    try {
        const product = await Product.findById({ _id : req.params.productId}).populate(['images']);
        const category = await Category.find();

        return res.status(200).json({ data: product, category : category });
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: error });
    }
};

const showBySlug = async (req, res) => {

    const status = true;
    const slug = req.params.slug;
    
    try {
        const product = await Product.findOne({slug, status }).populate(['images']);

        return res.status(200).json({ data: product });
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: error });
    }
};


const update = async (req, res) => {

    const { name, description, stock, price, priceIVA, status } = req.body;
    const category = req.body.category.split(',');
    const id_ = req.params.productId
    const files = req.files;

    try {
        const savedProduct = await Product.findByIdAndUpdate(id_,{ name, description, stock, price, priceIVA, category, status });

        const fileRecords = files.map(file => ({
            url: file.filename,
            product: savedProduct._id,
        }));

        const images = await Promise.all(fileRecords.map(async (imageName) => {
            const newImage = new Image(imageName);
            return await newImage.save();
        }));
        
        const new_images = images.map(image => image._id)

        savedProduct.images.push(...new_images);

        await savedProduct.save();

        return res.status(201).json({ data: savedProduct });

    } catch (error) {
        for (const key in files) {
            fs.unlink(files[key].path, (err) => {
                if (err) {
                    console.error(`Error removing file: ${err}`);
                    return;
                }
                console.log(`File ${files[key].path} has been successfully removed.`);
            });
        }

        console.error(error);

        res.status(500).json({ message: "error updating product" });
    }

};

const destroy = async (req, res) => {

    try {
        const product = await Product.findByIdAndDelete(req.params.productId);
        const image = await Image.find({ product: req.params.productId });

        for (const key in image) {
            fs.unlink(`./public/images/products/${image[key].url}`, (err) => {
                if (err) {
                    console.error(`Error removing file: ${err}`);
                    return;
                }
                console.log(`File ${image[key].url} has been successfully removed.`);
            });
        }

        const images = await Promise.all(image.map(async (imageName) => {
            const newImage = new Image(imageName);
            return await newImage.deleteOne();
        }));

        return res.status(200).json({ data: product, images: images });
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: error });
    }

};

const destroyImage = async (req, res) => {
    try {
        const image = await Image.findByIdAndDelete(req.params.imageId);

        fs.unlink(`./public/images/products/${image.url}`, (err) => {
            if (err) {
                console.error(`Error removing file: ${err}`);
                return;
            }
            console.log(`File ${image.url} has been successfully removed.`);
        });

        return res.status(200).json({ data: image });
    } catch (error) {
        console.error(error);

        res.status(500).json({ message: "error deleting image" });

    }
};

const search = async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ message: "the parameter q is required" });
      }

      try {
        const products = await Product.find({
          $or: [
            { name: { $regex: q, $options: "i" } }, 
            { description: { $regex: q, $options: "i" } } 
          ], status : true
        }).populate(['images', 'category']);
    
        res.json(products);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error when searching for products." });
      }

}

module.exports = { index, show, create, update, destroy, destroyImage, showBySlug, search };