import validator from "validator";
import { NextFunction, Request, Response } from 'express';

// User model
// import Product from '../models/Product.model';
import { sanitizeString } from "../utils/helpers";

// User interfaces
import {
    ProductEdit, 
    ProductCreate, 
    IProductRepository,
    ProductSearch,
} from '../interfaces/Product.interface';

/**
 * @class ProductController
 * @desc Responsible for handling API requests for the
 * /products and /admin/products routes.
 **/
class ProductController {
    protected ProductsRepository: IProductRepository;

    constructor(repository: IProductRepository) {
        // super(repository);
        this.ProductsRepository = repository;
    };

    public readonly getAllProducts = async (_req: Request, res: Response): Promise<Response> => {
        try {
            const products = await this.ProductsRepository.getAllProducts();
            return res.status(200).send({ products });
        } catch (error: unknown) {
            res.sendStatus(500);
            throw error;
        }
    };

    public readonly getProductsByCategory = async (req: Request, res: Response): Promise<Response> => {
        const category: string | undefined = req.params.category_name && sanitizeString(req.params.category_name); 
        if (!category || !validator.isAlpha(category)) return res.sendStatus(400);
        try {
            const products = await this.ProductsRepository.getProductsByCategory(category);
            return res.status(200).send({ products });
        } catch (error: unknown) {
            res.sendStatus(500);
            throw error;
        }
    };

    public readonly getFilteredProducts = async (req: Request, res: Response): Promise<Response> => {
        const productFilter: ProductSearch | undefined = req.body.filter; 
        if (!productFilter || !Object.keys(productFilter).length) return res.sendStatus(400);
        console.log(productFilter)
        try {
            const products = await this.ProductsRepository.getProductsByAttributes(productFilter);
            return res.status(200).send({ products });
        } catch (error: unknown) {
            res.sendStatus(500);
            throw error;
        }
    };

    public readonly getProductInfo = async (req: Request, res: Response): Promise<Response> => {
        const id: string | undefined = req.params?.id;
        if (!id || !validator.isUUID(id)) return res.sendStatus(400);

        try {
            const product = await this.ProductsRepository.getProductById(id);
            if (!product) return res.sendStatus(404);

            return res.status(200).send({ product });
        } catch (error: unknown) {
            res.sendStatus(500);
            throw error;
        }
    };
    
    public readonly addNewProduct = async (req: Request, res: Response): Promise<Response> => {
        const newProduct: ProductCreate | undefined = req.body;
        if (!newProduct) return res.sendStatus(400);

        try {
            const product = await this.ProductsRepository.createProduct(newProduct);
            if (!product) return res.sendStatus(404);

            return res.status(201).send({ ...product.get() });
        } catch (error: unknown) {
            res.sendStatus(500);
            throw error;
        }
    };

    public readonly editProduct = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const id: string | undefined = req.params?.id;
        const newProductData: ProductEdit | undefined = req.body;
        if ( !id || !validator.isUUID(id) || !newProductData) return res.sendStatus(400);

        try {
            const product = await this.ProductsRepository.updateProduct(id, newProductData);
            if (!product) return res.sendStatus(404);

            return res.status(200).send({ ...product.get() });
        } catch (error: unknown) {
            // res.sendStatus(500);
            next(error);
        }
    };

    public readonly deleteProduct = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id: string | undefined = req.params?.id;
            if(!id || !validator.isUUID(id)) return res.sendStatus(400);

            const result = await this.ProductsRepository.deleteProduct( id );
            if(!result) return res.sendStatus(404);

            return res.sendStatus(204);
        } catch (error: any) {
            res.sendStatus(500);
            throw new Error(error);
        }  
    };
};

export default ProductController;