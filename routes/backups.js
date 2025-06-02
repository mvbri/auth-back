const { dumpMongo2Localfile, restoreLocalfile2Mongo } = require("../lib/backup");

const fs = require('fs');

const path = require('path');

const index = (req, res) => {

    const backupDir = path.join(__dirname, '../', 'backups/');

    fs.readdir(backupDir, (err, files) => {
        if (err) {
            console.error(`Error leyendo el directorio: ${err.message}`);
            return res.status(500).json({ message: 'Error al acceder al directorio de backups.' });
        }
        const tarFiles = files.filter(file => path.extname(file) === '.tar');

        res.status(200).json({ data: tarFiles });
    });

}

const restore = async (req, res) => {

    const { file } = req.body;

    try {
        const date = new Date();

        await dumpMongo2Localfile(`./backups/${date.getFullYear()}_${date.getMonth()}_${date.getUTCDay()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}_backup.tar`);


        await restoreLocalfile2Mongo(`${backupDir}/${file}`);

        return index(req, res);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "error restoring backup" });

    }

}


const generate = async (req, res) => {


    try {
        const date = new Date();

        await dumpMongo2Localfile(`./backups/${date.getFullYear()}_${date.getMonth()}_${date.getUTCDay()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}_backup.tar`);

        return index(req, res);

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
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.error(`Archivo no encontrado: ${filename}`);
                return res.status(404).send('Archivo no encontrado.');
            }
            // Enviar el archivo para descargar
            res.download(filePath, (err) => {
                if (err) {
                    console.error(`Error en la descarga: ${err.message}`);
                    return res.status(500).send('Error al descargar el archivo.');
                }
            });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "error downloading backup" });

    }

}

const destroy = async (req, res) => {

    const { file } = req.body;

    try {

        fs.unlink(`./backups/${file}`, (err) => {
            if (err) {
                console.error(`Error removing file: ${err}`);
                return;
            }
            console.log(`File ${image.url} has been successfully removed.`);
        });

        return index(req, res);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "error deleting backup" });

    }

}



module.exports = { download, index, generate, restore, destroy };