const grpc = require('@grpc/grpc-js');
const path = require('path');
const protoLoader = require('@grpc/proto-loader');
const products = require('./products.json');

const packageDefinition = protoLoader.loadSync('proto/inventory.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
});

const inventoryProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

const productsFilePath = path.join(__dirname, 'products.json');

// implementa os métodos do InventoryService
server.addService(inventoryProto.InventoryService.service, {
    searchAllProducts: (_, callback) => {
        callback(null, {
            products: products,
        });
    },

    SearchProductByID: (payload, callback) => {
        callback(
            null,
            products.find((product) => product.id == payload.request.id)
        );
    },

    InsertProduct: (call, callback) => {
        const newProduct = call.request;

        newProduct.id = products.length ? products[products.length - 1].id + 1 : 1;

        products.push(newProduct);

        fs.writeFile(productsFilePath, JSON.stringify(products, null, 4), (err) => {
            if (err) {
                console.error("Erro ao salvar o produto: ", err);
                return callback({ code: grpc.status.INTERNAL, message: "Erro ao salvar o produto"});
            }
            callback(null, newProduct);
        })
    }
});

server.bindAsync('127.0.0.1:3002', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Inventory Service running at http://127.0.0.1:3002');
    server.start();
});
