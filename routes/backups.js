const { dumpMongo2Localfile, restoreLocalfile2Mongo } = require("../lib/backup");

const fs = require('fs').promises;

const path = require('path');

const index = async (req, res) => {
    try {

        const backupDir = path.join(__dirname, '../', 'backups/');
        const files = await fs.readdir(backupDir); // Lee los archivos utilizando promesas
        const tarFiles = files.filter(file => path.extname(file) === '.tar');
        const resfiles = tarFiles.map(item => ({ name: item }));
        res.status(200).json({ data: resfiles });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "error getting backups" });
    }

}

const restore = async (req, res) => {

    const { file } = req.body;

    try {
        const date = new Date();

        const backupDir = path.join(__dirname, '../', 'backups/');

        await dumpMongo2Localfile(`./backups/${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}_${date.getHours().toString().padStart(2, "0")}-${date.getMinutes().toString().padStart(2, "0")}-${date.getSeconds().toString().padStart(2, "0")}_backup.tar`);

        await restoreLocalfile2Mongo(`${backupDir}/${file}`);

        return await index(req, res);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "error restoring backup" });
    }

}


const generate = async (req, res) => {

    try {
        const date = new Date();

        await dumpMongo2Localfile(`./backups/${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}_${date.getHours().toString().padStart(2, "0")}-${date.getMinutes().toString().padStart(2, "0")}-${date.getSeconds().toString().padStart(2, "0")}_backup.tar`);

        return await index(req, res);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "error generating backup" });

    }

}

const download = async (req, res) => {

    const { file } = req.query;

    try {
        const filePath = path.join(__dirname, '../', 'backups/', file);
        // Verifica si el archivo existe antes de intentar descargarlo
        await fs.access(filePath); // Usa fs.promises para verificar la existencia del archivo
        // Enviar el archivo para descargar
        res.download(filePath, (err) => {
            if (err) {
                console.error(`Error en la descarga: ${err.message}`);
                return res.status(500).send('Error al descargar el archivo.');
            }
        });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        if (error.code === 'ENOENT') {
            // El archivo no existe
            return res.status(404).send('Archivo no encontrado.');
        }
        // Otro tipo de error
        res.status(500).send('Error al procesar la solicitud.');
    }

}

const destroy = async (req, res) => {

    const { file } = req.body;

    try {
        await fs.unlink(`./backups/${file}`); // Espera a que se elimine el archivo

        console.log(`File ${file} has been successfully removed.`);
        // Llama a index, pero no devuelve la respuesta directamente
        return index(req, res);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "error deleting backup" });

    }

}



module.exports = { download, index, generate, restore, destroy };