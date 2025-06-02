const { MongoTransferer, MongoDBDuplexConnector, LocalFileSystemDuplexConnector } = require('mongodb-snapshot') ;

async function dumpMongo2Localfile(path) {
    const mongo_connector = new MongoDBDuplexConnector({
        connection: {
            uri: process.env.DB_CONNECTION_URL,
            dbname: process.env.DB_CONNECTION_NAME,
        },
    });

    const localfile_connector = new LocalFileSystemDuplexConnector({
        connection: {
            path: path,
        },
    });

    const transferer = new MongoTransferer({
        source: mongo_connector,
        targets: [localfile_connector],
    });

    for await (const { total, write } of transferer) {
        console.log(`remaining bytes to write: ${total - write}`);
    }
}

async function restoreLocalfile2Mongo(path) {
    const mongo_connector = new MongoDBDuplexConnector({
        connection: {
            uri: process.env.DB_CONNECTION_URL,
            dbname: process.env.DB_CONNECTION_NAME,
        },
    });

    const localfile_connector = new LocalFileSystemDuplexConnector({
        connection: {
            path: path,
        },
    });

    const transferer = new MongoTransferer({
        source: localfile_connector,
        targets: [mongo_connector],
    });

    for await (const { total, write } of transferer) {
        console.log(`remaining bytes to write: ${total - write}`);
    }
}

module.exports = { dumpMongo2Localfile,restoreLocalfile2Mongo };