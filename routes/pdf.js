const path = require("path");
const Order = require("../schema/order");
const User = require("../schema/user");
const Payment = require("../schema/payment");

const PDFDocument = require('pdfkit');

const orderPdf = async (req, res) => {
  const { status, payment, customer, delivery } = req.query;
  const { startDate, endDate } = req.params;

  let startDate_format = new Date(startDate);
  let endDate_format = new Date(endDate);

  const filters = {
    'voucher.date': { $gte: startDate_format, $lte: endDate_format }
  }

  if (typeof (status) !== 'undefined') filters.status = status;
  if (typeof (payment) !== 'undefined') Object.assign(filters, { 'voucher.payment': payment });
  if (typeof (customer) !== 'undefined') filters.customer = customer;
  if (typeof (delivery) !== 'undefined') filters.delivery = delivery;

  try {
    const data = await Order.find(filters
    ).populate(['customer', 'delivery', 'voucher.payment']);

    const orders = data.map((item) => {
      const date = new Date(item.voucher.date);
      return [
        new Intl.DateTimeFormat('es-VE').format(date),
        item.voucher.payment.type,
        item.voucher.reference,
        item.voucher.payment.bank,
        item.voucher.payment.number,
        `${item.total} Bs`,
        item.customer.name,
        item.status,
        typeof (item.delivery) !== 'undefined' ? item.delivery.name : "N/A"
      ]
    })

    const doc = new PDFDocument({ size: [792, 612] });

    res.setHeader('Content-disposition', `attachment; filename=Reporte de ordenes desde ${Intl.DateTimeFormat('es-VE').format(startDate_format)} hasta ${Intl.DateTimeFormat('es-VE').format(endDate_format)}.pdf`);
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);

    // Ruta del logo
    const logoPath = path.join(__dirname, '..', 'public/images/logo.png');
    doc.image(logoPath, 50, 20, { width: 50 });

    doc.fontSize(14).text('Reporte de ordenes desde ' + Intl.DateTimeFormat('es-VE').format(startDate_format) + ' hasta ' + Intl.DateTimeFormat('es-VE').format(endDate_format), {
      align: 'center',
    });
    doc.moveDown();

    // Configuración de la tabla
    orders.unshift([
      'Fecha de pago',
      'Tipo de pago',
      'Referencia',
      'Banco receptor',
      'Número receptor',
      'Total pagado',
      'Cliente',
      'Estatus',
      'Delivery'
    ])

    // Añadir la tabla al documento
    doc.fontSize(12).table({ data: orders });
    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).send('Error generando el PDF');
  }
};

const order = async (req, res) => {
  const { startDate, endDate, status, payment, customer, delivery } = req.body;

  console.log(req.body);


  try {
    let startDate_format = new Date(startDate);
    let endDate_format = new Date(endDate);

    const filters = {
      'voucher.date': { $gte: startDate_format, $lte: endDate_format }
    }

    if ( status !== '') filters.status = status;
    if (payment !== '') Object.assign(filters, { 'voucher.payment': payment });
    if (customer !== '') filters.customer = customer;
    if (delivery !== '') filters.delivery = delivery;

    const data = await Order.find(filters
    ).populate(['customer', 'delivery', 'voucher.payment']);

    const orders = data.map((item) => {
      const date = new Date(item.voucher.date);
      return {
        date: new Intl.DateTimeFormat('es-VE').format(date),
        reference: item.voucher.reference,
        type: item.voucher.payment.type,
        bank: item.voucher.payment.bank,
        number: item.voucher.payment.number,
        total: `${item.total} Bs`,
        customer: item.customer.name,
        status: item.status,
        delivery: typeof (item.delivery) !== 'undefined' ? item.delivery.name : "N/A"
      }
    })

    return res.status(200).json({ orders: orders });

  } catch (error) {
    console.error(error);
    res.status(500).json('Error generando el PDF');
  }
};

const dataReport = async (req, res) => {
  try {
    const delivery = await User.find({ role: "delivery", status: true }).select(['_id', 'name', 'email', 'phone']);
    const customers = await User.find({ role: "customer", status: true }).select(['_id', 'name', 'email', 'phone']);
    const payments = await Payment.find({ status: true });

    return res.status(200).json({ delivery: delivery, customers: customers, payments });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error consultado datos');
  }
}

module.exports = { orderPdf, order, dataReport };