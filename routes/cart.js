const Address = require("../schema/address");
const Cart = require("../schema/cart");
const Product = require("../schema/product");

const delivery = 150;

const getCart = async (req, res) => {
    const { _id } = req.body;
    try {
        if (typeof _id !== "undefined") {
            const cart = await Cart.findOne({ _id: _id, ordered: false }).populate(['detail.product']);

            // Obtener los IDs de todos los productos en el carrito
            const productIds = cart.detail.map(item => item.product);

            // Consultar todos los productos del carrito en una sola consulta
            const productsInCart = await Product.find({ _id: { $in: productIds } }).populate(['images', 'category']);

            // Crear un mapa de productos para facilitar el acceso
            const productMap = productsInCart.reduce((acc, item) => {
                acc[item._id.toString()] = item; // Guardamos el producto con su ID como clave
                return acc;
            }, {});


            // Recalcular totales
            let totalProducts = 0;
            let totalIVA = 0;
            let totalQuantity = 0;

            for (const item of cart.detail) {

                const productDetail = productMap[item.product._id.toString()]; // Acceder al producto del mapa

                totalQuantity += item.quantity

                totalProducts += productDetail.price * item.quantity;
                totalIVA += productDetail.priceIVA * item.quantity;

                // Añadir las imágenes al objeto del producto en el carrito
                item.product = {
                    ...productDetail.toObject(), // Convertimos el documento Mongoose a objeto JavaScript
                    images: productDetail.images, // Mapeamos las URLs de las imágenes
                };
            }

            // Actualizamos el carrito con los nuevos totales
            cart.total_products = totalProducts;
            cart.total_iva = totalIVA;
            cart.total = totalIVA + delivery;
            cart.total_delivery = delivery;
            cart.total_quantity = totalQuantity; // Actualizar cantidad total


            const addresses = await Address.find({ user_id: req.user._id });

            await cart.save();

            return res.status(200).json({ data: cart, addresses: addresses });
        } else {
            const cart = await Cart.findOne({ customer: req.user._id, ordered: false }).sort({ _id: -1 }).populate(['detail.product']);

            if (cart !== null) {
                // Obtener los IDs de todos los productos en el carrito
                const productIds = cart.detail.map(item => item.product);

                // Consultar todos los productos del carrito en una sola consulta
                const productsInCart = await Product.find({ _id: { $in: productIds } }).populate(['images', 'category']);

                // Crear un mapa de productos para facilitar el acceso
                const productMap = productsInCart.reduce((acc, item) => {
                    acc[item._id.toString()] = item; // Guardamos el producto con su ID como clave
                    return acc;
                }, {});


                // Recalcular totales
                let totalProducts = 0;
                let totalIVA = 0;
                let totalQuantity = 0;

                for (const item of cart.detail) {

                    const productDetail = productMap[item.product._id.toString()]; // Acceder al producto del mapa


                    totalProducts += productDetail.price * item.quantity;
                    totalIVA += productDetail.priceIVA * item.quantity;

                    // Añadir las imágenes al objeto del producto en el carrito
                    item.product = {
                        ...productDetail.toObject(), // Convertimos el documento Mongoose a objeto JavaScript
                        images: productDetail.images, // Mapeamos las URLs de las imágenes
                    };
                }

                // Actualizamos el carrito con los nuevos totales
                cart.total_products = totalProducts;
                cart.total_iva = totalIVA;
                cart.total = totalIVA + delivery;
                cart.total_delivery = delivery;
                cart.total_quantity = totalQuantity; // Actualizar cantidad total

                await cart.save();

                return res.status(200).json({ data: cart });

            } else {

                const newCart = new Cart({
                    customer: req.user._id,
                    detail: [],
                    total_delivery: delivery,
                    total_products: 0,
                    total_iva: 0,
                    total: 0 + delivery,
                    total_quantity: 0
                });

                await newCart.save();

                const addresses = await Address.find({ user_id: req.user._id });

                return res.status(200).json({ data: newCart, addresses: addresses });
            }

        }
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: error });
    }
};

const add = async (req, res) => {
    const { _id, product_id, quantity } = req.body;

    try {
        // Obtener el producto junto con las imágenes
        const product = await Product.findById(product_id).populate(['images', 'category']);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Verificar si el carrito existe
        if (typeof _id !== "undefined" && _id !== null) {
            const cart = await Cart.findOne({ _id: _id, ordered: false }).populate('detail.product'); // Poblamos el detalle del carrito

            if (!cart) {
                return res.status(404).json({ message: 'Carrito no encontrado' });
            }

            // Buscar si el producto ya está en el carrito
            const existingProduct = cart.detail.find(item => item.product._id.toString() === product_id);

            if (existingProduct) {
                // Si existe, sumar la cantidad
                existingProduct.quantity += quantity;
            } else {
                // Si no existe, añadir el producto al carrito
                cart.detail.push({
                    product: product_id,
                    quantity: quantity,
                });
            }

            // Obtener los IDs de todos los productos en el carrito
            const productIds = cart.detail.map(item => item.product);

            // Consultar todos los productos del carrito en una sola consulta
            const productsInCart = await Product.find({ _id: { $in: productIds } }).populate(['images', 'category']);

            // Crear un mapa de productos para facilitar el acceso
            const productMap = productsInCart.reduce((acc, item) => {
                acc[item._id.toString()] = item; // Guardamos el producto con su ID como clave
                return acc;
            }, {});


            // Recalcular totales
            let totalProducts = 0;
            let totalIVA = 0;
            let totalQuantity = 0;

            for (const item of cart.detail) {

                const productDetail = productMap[item.product._id.toString()]; // Acceder al producto del mapa

                totalQuantity += item.quantity

                totalProducts += productDetail.price * item.quantity;
                totalIVA += productDetail.priceIVA * item.quantity;

                // Añadir las imágenes al objeto del producto en el carrito
                item.product = {
                    ...productDetail.toObject(), // Convertimos el documento Mongoose a objeto JavaScript
                    images: productDetail.images, // Mapeamos las URLs de las imágenes
                };
            }

            // Actualizamos el carrito con los nuevos totales
            cart.total_products = totalProducts;
            cart.total_iva = totalIVA;
            cart.total = totalIVA + delivery;
            cart.total_delivery = delivery;
            cart.total_quantity = totalQuantity; // Actualizar cantidad total

            await cart.save();

            // Retornar el carrito junto con los detalles
            return res.status(200).json({ data: cart });
        } else {
            // Crear un nuevo carrito si no existe
            const newCart = new Cart({
                customer: req.user._id,
                detail: [{
                    product: product_id,
                    quantity: quantity,
                }],
                total_delivery: delivery,
                total_products: product.price * quantity,
                total_iva: product.priceIVA * quantity,
                total: (product.priceIVA * quantity) + delivery,
                total_quantity: quantity
            });

            // Añadimos las imágenes del producto nuevo
            newCart.detail[0].product = {
                ...product.toObject(), // Convertimos a objeto
                images: product.images, // Mapeamos las URLs de las imágenes
            };

            await newCart.save();

            // Retornar el nuevo carrito junto con los detalles
            return res.status(200).json({ data: newCart });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


const updateQuantity = async (req, res) => {
    const { _id, product_id, quantity } = req.body;

    try {
        // Obtener el producto junto con las imágenes
        const product = await Product.findById(product_id).populate(['images', 'category']);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Verificar si el carrito existe
        if (typeof _id !== "undefined") {
            const cart = await Cart.findOne({ _id: _id, ordered: false }).populate('detail.product'); // Poblamos el detalle del carrito

            if (!cart) {
                return res.status(404).json({ message: 'Carrito no encontrado' });
            }

            // Buscar si el producto ya está en el carrito
            const existingProduct = cart.detail.find(item => item.product._id.toString() === product_id);

            if (existingProduct) {
                existingProduct.quantity = quantity;
            } else {
                // Si no existe, añadir el producto al carrito
                cart.detail.push({
                    product: product_id,
                    quantity: quantity,
                });
            }

            // Obtener los IDs de todos los productos en el carrito
            const productIds = cart.detail.map(item => item.product);

            // Consultar todos los productos del carrito en una sola consulta
            const productsInCart = await Product.find({ _id: { $in: productIds } }).populate(['images', 'category']);

            // Crear un mapa de productos para facilitar el acceso
            const productMap = productsInCart.reduce((acc, item) => {
                acc[item._id.toString()] = item; // Guardamos el producto con su ID como clave
                return acc;
            }, {});


            // Recalcular totales
            let totalProducts = 0;
            let totalIVA = 0;
            let totalQuantity = 0;

            for (const item of cart.detail) {

                const productDetail = productMap[item.product._id.toString()]; // Acceder al producto del mapa

                totalQuantity += item.quantity

                totalProducts += productDetail.price * item.quantity;
                totalIVA += productDetail.priceIVA * item.quantity;

                // Añadir las imágenes al objeto del producto en el carrito
                item.product = {
                    ...productDetail.toObject(), // Convertimos el documento Mongoose a objeto JavaScript
                    images: productDetail.images, // Mapeamos las URLs de las imágenes
                };
            }

            // Actualizamos el carrito con los nuevos totales
            cart.total_products = totalProducts;
            cart.total_iva = totalIVA;
            cart.total = totalIVA + delivery;
            cart.total_delivery = delivery;
            cart.total_quantity = totalQuantity; // Actualizar cantidad total

            await cart.save();

            // Retornar el carrito junto con los detalles
            return res.status(200).json({ data: cart });
        } else {
            // Crear un nuevo carrito si no existe
            const newCart = new Cart({
                customer: req.user._id,
                detail: [{
                    product: product_id,
                    quantity: quantity,
                }],
                total_delivery: delivery,
                total_products: product.price * quantity,
                total_iva: product.priceIVA * quantity,
                total: (product.priceIVA * quantity) + delivery,
                total_quantity: quantity
            });

            // Añadimos las imágenes del producto nuevo
            newCart.detail[0].product = {
                ...product.toObject(), // Convertimos a objeto
                images: product.images, // Mapeamos las URLs de las imágenes
            };

            await newCart.save();

            // Retornar el nuevo carrito junto con los detalles
            return res.status(200).json({ data: newCart });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const remove = async (req, res) => {
    const { _id, product_id } = req.body;

    try {
        // Verificar si el carrito existe
        const cart = await Cart.findOne({ _id: _id, ordered: false }).populate('detail.product');
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        // Buscar el índice del producto en el detalle
        const productIndex = cart.detail.findIndex(item => item.product._id.toString() === product_id);

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }

        // Eliminar el producto del detalle
        cart.detail.splice(productIndex, 1);

        // Obtener los IDs de todos los productos en el carrito
        const productIds = cart.detail.map(item => item.product);

        // Consultar todos los productos del carrito en una sola consulta
        const productsInCart = await Product.find({ _id: { $in: productIds } }).populate(['images', 'category']);

        // Crear un mapa de productos para facilitar el acceso
        const productMap = productsInCart.reduce((acc, item) => {
            acc[item._id.toString()] = item; // Guardamos el producto con su ID como clave
            return acc;
        }, {});

        // Recalcular totales
        let totalProducts = 0;
        let totalQuantity = 0;
        let totalIVA = 0;
        const delivery = cart.total_delivery; // Mantener el costo de entrega

        // Recalcular totales solo si el carrito tiene productos restantes
        if (cart.detail.length > 0) {
            for (const item of cart.detail) {
                const productDetail = productMap[item.product._id.toString()]; // Acceder al producto del mapa
                totalQuantity += item.quantity
                totalProducts += productDetail.price * item.quantity;
                totalIVA += productDetail.priceIVA * item.quantity;

                // Añadir las imágenes al objeto del producto en el carrito
                item.product = {
                    ...productDetail.toObject(), // Convertimos el documento Mongoose a objeto JavaScript
                    images: productDetail.images, // Mapeamos las URLs de las imágenes
                };
            }
        }

        // Actualizar totales del carrito
        cart.total_products = totalProducts;
        cart.total_iva = totalIVA;
        cart.total = totalIVA + delivery; // Incluye el delivery
        cart.detail = cart.detail; // Actualizar el detalle
        cart.total_quantity = totalQuantity; // Actualizar cantidad total


        // Guardar los cambios en el carrito
        await cart.save();

        // Retornar el carrito actualizado
        return res.status(200).json({ data: cart });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const removeAll = async (req, res) => {
    const { _id } = req.body;

    try {
        // Verificar si el carrito existe
        const cart = await Cart.findOne({ _id: _id, ordered: false });
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        const cart_detail = cart.detail


        cart_detail.forEach((item, index) => {
            cart.detail.splice(index);
        })


        // Recalcular totales
        let totalProducts = 0;
        let totalIVA = 0;
        const delivery = cart.total_delivery; // Mantener el costo de entrega



        // Actualizar totales del carrito
        cart.total_products = totalProducts;
        cart.total_iva = totalIVA;
        cart.total = totalIVA + delivery; // Incluye el delivery
        cart.detail = cart.detail; // Actualizar el detalle
        cart.total_quantity = 0; // Actualizar cantidad total

        // Guardar los cambios en el carrito
        await cart.save();

        // Retornar el carrito actualizado
        return res.status(200).json({ data: cart });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};



module.exports = { getCart, add, updateQuantity, remove, removeAll };