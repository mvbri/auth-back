const Cart = require("../schema/cart");
const Order = require("../schema/order");
const Product = require("../schema/product");
const Image = require("../schema/image");
const Address = require("../schema/address");
const User = require("../schema/user");
const Payment = require("../schema/payment");
const Category = require("../schema/category");



const delivery = 150;

const store = async (req, res) => {
    const { reference, date, payment, address, _id } = req.body;
    const file = req.file;
    try {
        const cart = await Cart.findById(_id).populate(['detail.product']);
        const order = await new Order({});
        order.customer = req.user.id;

        order.status = "En verificación de pago";
        order.address = address;
        order.voucher = {
            reference: reference,
            date: date,
            payment: payment

        };

        order.cart = cart._id;
        order.total_delivery = cart.total_delivery;
        order.total_products = cart.total_products;
        order.total_iva = cart.total_iva;
        order.total = cart.total;
        cart.detail.forEach((item) => {
            order.detail.push({
                product: item.product._id,
                quantity: item.quantity,
                price_unit: item.product.price,
                price_unit_iva: item.product.priceIVA,
                price_total: item.product.price * item.quantity,
                price_total_iva: item.product.priceIVA * item.quantity,
            })

        })

        await order.save();

        if (typeof (file) !== "undefined") {

            const newImage = new Image({
                url: file.filename,
                order: order._id,
            });

            await newImage.save();

            order.voucher.image = newImage._id;

            await order.save();

        }

        cart.ordered = true;

        await cart.save();


        await Promise.all(cart.detail.map(async (item) => {

            let product = await Product.findById(item.product._id);

            product.stock = product.stock - item.quantity;

            await product.save();

        }));



        const newCart = new Cart({
            customer: req.user.id,
            detail: [],
            total_delivery: delivery,
            total_products: 0,
            total_iva: 0,
            total: 0 + delivery,
            total_quantity: 0
        });

        await newCart.save();

        return res.status(200).json({ data: order, cart: newCart });


    } catch (error) {
        console.error(error);
        res.status(422).json({ message: error });
    }

}

const index = async (req, res) => {
    try {
        const data = await Order.find().populate(['customer', 'voucher.payment', 'voucher.image']);
        return res.status(200).json({ data: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "error getting orders" });

    }

}

const update = async (req, res) => {
    const _id = req.params.orderId;
    const { delivery, status } = req.body;

    try {

        const filters = { status: status }

        if (typeof (delivery) !== "undefined") filters.delivery = delivery

        const data = await Order.findByIdAndUpdate(_id, filters);

        return res.status(200).json({ data: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "error getting orders" });

    }

}

const show = async (req, res) => {
    const _id = req.params.orderId;

    try {
        const data = await Order.findOne({ customer: req.user.id, _id: _id }).populate(['delivery', 'voucher.payment', 'voucher.image', 'detail.product', 'address']);

        const productIds = data.detail.map(item => item.product);

        const productsInCart = await Product.find({ _id: { $in: productIds } }).populate(['images', 'category']);

        const productMap = productsInCart.reduce((acc, item) => {
            acc[item._id.toString()] = item; // Guardamos el producto con su ID como clave
            return acc;
        }, {});


        for (const item of data.detail) {

            const productDetail = productMap[item.product._id.toString()]; // Acceder al producto del mapa

            item.product = {
                ...productDetail.toObject(), // Convertimos el documento Mongoose a objeto JavaScript
                images: productDetail.images, // Mapeamos las URLs de las imágenes
            };
        }

        return res.status(200).json({ data: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "error getting orders" });

    }

}

const adminShow = async (req, res) => {
    const _id = req.params.orderId;

    try {
        const data = await Order.findById(_id).populate(['customer', 'delivery', 'voucher.payment', 'voucher.image', 'detail.product', 'address']);

        const delivery = await User.find({ role: "delivery" });

        const productIds = data.detail.map(item => item.product);

        const productsInCart = await Product.find({ _id: { $in: productIds } }).populate(['images', 'category']);

        const productMap = productsInCart.reduce((acc, item) => {
            acc[item._id.toString()] = item; // Guardamos el producto con su ID como clave
            return acc;
        }, {});


        for (const item of data.detail) {

            if (item.product) {
                const productDetail = productMap[item.product._id.toString()]; // Acceder al producto del mapa

                item.product = {
                    ...productDetail.toObject(), // Convertimos el documento Mongoose a objeto JavaScript
                    images: productDetail.images, // Mapeamos las URLs de las imágenes
                };
            }
        }



        return res.status(200).json({ data: data, delivery: delivery });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "error getting orders" });

    }

}

const customerIndex = async (req, res) => {

    try {
        const data = await Order.find({ customer: req.user.id }).populate(['delivery', 'voucher.payment']);
        return res.status(200).json({ data: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "error getting orders" });

    }
}

const deliveryIndex = async (req, res) => {

    try {
        const data = await Order.find({ delivery: req.user.id }).populate(['customer', 'voucher.payment', 'voucher.image', 'detail.product', 'address']);
        return res.status(200).json({ data: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "error getting orders" });

    }
}


const checkout = async (req, res) => {

    try {

        const addresses = await Address.find({ customer: req.user.id });

        const payments = await Payment.find({ status: true });

        return res.status(200).json({ addresses: addresses, payments: payments });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }

}

const getOrdersData = async (req, res) => {
    let year = new Date();
    year = year.getFullYear()

    try {
        // Generar un array con todos los months del año
        const months = Array.from({ length: 12 }, (_, i) => {
            return { month: `${String(i + 1).padStart(2, '0')}`, totalOrders: 0 };
        });
        const resultado = await Order.aggregate([
            {
                $match: {
                    'voucher.date': { $exists: true, $ne: null, $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%m', date: '$voucher.date' } },
                    totalOrders: { $sum: 1 },
                },
            },
            {
                $sort: {
                    _id: 1,
                },
            },
            {
                $project: {
                    month: '$_id',
                    totalOrders: 1,
                    _id: 0,
                },
            },
        ]);
        // Convertir el resultado a un objeto para mayor facilidad de manejo
        const dataMap = resultado.reduce((acc, item) => {
            acc[item.month] = item.totalOrders;
            return acc;
        }, {});
        // Combinar los months con los resultados, asegurando que todos los months están presentes
        const data = months.map(month => {
            return dataMap[month.month] || 0 // Usa 0 si no hay pedidos
        });

        const customers = await User.find({ role: "customer" }).countDocuments()

        const orders = await Order.find().countDocuments()
        const products = await Product.find().countDocuments()
        const category = await Category.find().countDocuments()

        return res.status(200).json({ data: data, orders, customers, category, products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }
}

module.exports = { deliveryIndex, store, update, customerIndex, index, checkout, show, adminShow, getOrdersData };

