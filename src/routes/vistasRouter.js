import { Router } from 'express';
import { ProductsManager } from "../dao/ProductsManager.js";
import __dirname from '../utils.js';
import { join } from 'path';

export const router=Router()

let rutaData = join(__dirname, '\data','\products.json')

ProductsManager.setPath(rutaData)
let products = await ProductsManager.getProducts()

router.get('/', (req,res)=>{
    res.render("home", {products})
})

router.get('/realtimeproducts',(req,res)=>{
    res.render("realTimeProducts",{products})
})

