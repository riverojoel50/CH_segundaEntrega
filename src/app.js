import express from 'express';
import {engine} from "express-handlebars"
import {Server} from "socket.io"
import { router as vistasRouter } from './routes/vistasRouter.js';
import { ProductsManager } from "./dao/ProductsManager.js";
import { join } from 'path';
import __dirname from './utils.js';

const PORT = 8080;
let rutaData = join(__dirname, '\data','\products.json')
ProductsManager.setPath(rutaData)
let products = await ProductsManager.getProducts()

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./src/public"))
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")

app.use("/", vistasRouter)


const server=app.listen(PORT,()=>{   // server HTTP
    console.log(`Server escuchando en puerto ${PORT}`);
});

const io=new Server(server) 


io.on("connection", socket=>{

    socket.emit("productos", products);

    socket.on("agregarProducto", async (producto) => {

        let newProducts = await ProductsManager.insertProduct(producto) 
        io.emit("productoAgregado", newProducts);
    });

    socket.on("eliminarProducto", async (id) => {
        console.log("delete id:", id)
        await ProductsManager.deleteProduct(id);
        io.emit("productoEliminado", id); 
    });

})
