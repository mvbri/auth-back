const fs = require('fs');
const pdf = require('pdf-creator-node');
const path = require("path");
const Order = require("../schema/order");

const show = async (req, res) => {
  try {
    const options = {
      format: "A4",
      orientation: "landscape",
      border: "10mm", // Mantén el borde
      header: {
        height: "30mm", // Aumenta la altura del header
        contents: '<div style="text-align: center;"> <h1 class="text-center mb-4">Reporte de Ventas</h1></div>',
      },
      footer: {
        height: "5mm", // Aumenta la altura del footer
        contents: {
          default: '<span style="color: #444;">{{page}}</span> de <span>{{pages}}</span>', // fallback value
        },
      },
    };

    const data = await Order.find().populate(['customer', 'voucher.payment']);

    const orders = data.map((item) => {
      const date = new Date(item.voucher.date);
      return {
        date: new Intl.DateTimeFormat('es-VE').format(date),
        reference: item.voucher.reference,
        customer: item.customer.name,
        status: item.status,
        total: item.total
      }
    });

    for (let index = 0; index < 100; index++) {
      orders.push(orders[0]);
    }

    // Read the HTML template
    const html = fs.readFileSync(path.join(__dirname, '..', 'templates', 'template.html'), 'utf8');

    const document = {
      html: html,
      data: {
        orders: orders,
      },
      type: "buffer"

    };

    const pdfBuffer = await pdf.create(document, options);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte.pdf"');
    res.send(pdfBuffer);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating PDF');
  }



};

module.exports = { show };