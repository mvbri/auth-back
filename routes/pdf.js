const path = require("path");
const Order = require("../schema/order");
const PDFDocument = require('pdfkit');

const show = async (req, res) => {
  const { startDate, endDate } = req.params;
  try {
    const orders = await Order.find(
    //   {
    //   voucher: { date: { $gte: new Date(startDate), $lte: new Date(endDate) } }
    // }
  ).populate(['customer', 'delivery', 'voucher.payment']);
    const doc = new PDFDocument();
    doc.addPage({size: 'LETTER'});
    res.setHeader('Content-disposition', 'attachment; filename=report.pdf');
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);
    // Ruta del logo
    const orderImagePath = path.join(__dirname,'..', 'public/images/logo.png');
    doc.image(orderImagePath, 50, 20, { width: 100 });
    doc.fontSize(25).text('Reporte de ordenes desde ' + startDate + ' hasta ' + endDate, {
      align: 'center',
    });
    doc.moveDown();
    // Cabecera de la tabla
    doc.fontSize(12).text('Fecha de pago               Referencia             Banco receptor             Número receptor             Total pagado             Cliente             Estatus             Delivery', {
      underline: true
    });
    orders.forEach(order => {
      doc.text(`${order.voucher.date}                       ${order.voucher.reference}                       ${order.voucher.payment.bank}                       ${order.voucher.payment.number}                       ${order.total}                       ${order.customer.name}                       ${order.status}                       ${order.delivery.name}`);
    });
    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generando el PDF');
  }
};

module.exports = { show };