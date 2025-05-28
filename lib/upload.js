const multer = require('multer');

const path = require('path'); // Importar path para trabajar con extensiones de archivo

const storageCategory = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images/category/'); // Carpeta donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Genera un sufijo único
    const ext = path.extname(file.originalname); // Obtiene la extensión del archivo
    cb(null, uniqueSuffix + ext); // Devuelve el nombre del archivo modificado
  },
});


const storageProduct = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images/products/'); // Carpeta donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Genera un sufijo único
    const ext = path.extname(file.originalname); // Obtiene la extensión del archivo
    cb(null, uniqueSuffix + ext); // Devuelve el nombre del archivo modificado
  },
});


const storageSlider = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images/slider/'); // Carpeta donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Genera un sufijo único
    const ext = path.extname(file.originalname); // Obtiene la extensión del archivo
    cb(null, uniqueSuffix + ext); // Devuelve el nombre del archivo modificado
  },
});

const storageVoucher = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images/voucher/'); // Carpeta donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Genera un sufijo único
    const ext = path.extname(file.originalname); // Obtiene la extensión del archivo
    cb(null, uniqueSuffix + ext); // Devuelve el nombre del archivo modificado
  },
});

const uploadCategory = multer({
  storage: storageCategory
});

const uploadVoucher = multer({ storage: storageVoucher });
const uploadProducts = multer({ storage: storageProduct });

const uploadSlider = multer({ storage: storageSlider });

module.exports = { uploadCategory,uploadProducts, uploadSlider, uploadVoucher };