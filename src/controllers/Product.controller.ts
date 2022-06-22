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

    public readonly getAllProducts = async (_req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const products = await this.ProductsRepository.getAllProducts();
            return res.status(200).send({ products });
        } catch (error: unknown) {
            next(error);
        }
    };

    public readonly getProductsByCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const category: string | undefined = req.params.category_name && sanitizeString(req.params.category_name); 
        console.log("In Product Controller Category");
        if (!category || !validator.isAlpha(category)) return res.sendStatus(400);
        try {
            const products = await this.ProductsRepository.getProductsByCategory(category);
            return res.status(200).send({ products });
        } catch (error: unknown) {
            next(error);
        }
    };

    public readonly getFilteredProducts = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const productFilter: ProductSearch | undefined = req.body.filter; 
        console.log("In Product Controller");
        console.log(productFilter)
        console.log(req.body)
        if (!productFilter || !Object.keys(productFilter).length) return res.sendStatus(400);
        
        try {
            const products = await this.ProductsRepository.getProductsByAttributes(productFilter);
            return res.status(200).send({ products });
        } catch (error: unknown) {
            next(error);
        }
    };

    public readonly getProductInfo = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const id: string | undefined = req.params?.id;
        if (!id || !validator.isUUID(id)) return res.sendStatus(400);

        try {
            const product = await this.ProductsRepository.getProductById(id);
            if (!product) return res.sendStatus(404);

            return res.status(200).send({ product });
        } catch (error: unknown) {
            next(error);
        }
    };
    
    public readonly addNewProduct = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const newProduct: ProductCreate | undefined = req.body;
        if (!newProduct) return res.sendStatus(400);

        try {
            const product = await this.ProductsRepository.createProduct(newProduct);
            if (!product) return res.sendStatus(404);

            return res.status(201).send({ ...product.get() });
        } catch (error: unknown) {
            next(error);
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
            next(error);;
        }
    };

    public readonly deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const id: string | undefined = req.params?.id;
            if(!id || !validator.isUUID(id)) return res.sendStatus(400);

            const result = await this.ProductsRepository.deleteProduct( id );
            if(!result) return res.sendStatus(404);

            return res.sendStatus(204);
        } catch (error: any) {
            next(error);;
        }  
    };
};

export default ProductController;