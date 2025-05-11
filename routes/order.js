const Cart = require("../schema/cart");
const Order = require("../schema/order");

const delivery = 150;

const create = async (req, res) => {
    const { _id } = req.body;
    try {
        const cart = await Cart.findById(_id).populate(['detail.product']);
        const order = await new Order({});

        order.status = "En verificación de pago";
        order.cart_id = cart._id;
        order.customer_id = req.user.id;
        order.total_delivery = cart.total_delivery;
        order.total_products = cart.total_products;
        order.total_iva = cart.total_iva;
        order.total = cart.total;

        cart.detail.forEach((item) => {
            order.detail.push({
                product: item.product._id,
                quantity: item.quantity,
                price_unit: item.product.priceIVA,
                price_total: item.product.price * item.quantity,
                price_total_iva: item.product.priceIVA * item.quantity,
            })

        })

        await order.save();
        cart.ordered = true;
        await cart.save();

        const newCart = new Cart({
            customer_id: req.user ? req.user.id : "6819225f509bc921fcb14624",
            detail: [],
            total_delivery: delivery,
            total_products: 0,
            total_iva: 0,
            total: 0 + delivery,
            total_quantity: 0
        });

        await newCart.save();

        return res.status(200).json({ data: order, cart:  newCart });


    } catch (error) {
        console.error(error);
        res.status(412).json({ message: error });
    }

}

module.exports = { create };

