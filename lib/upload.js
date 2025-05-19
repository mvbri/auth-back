const multer = require('multer');

const path = require('path'); // Importar path para trabajar con extensiones de archivo


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


const uploadProducts = multer({ storage: storageProduct });
const uploadCategory = multer({ storage: storageCategory });

module.exports = {uploadProducts, uploadCategory};