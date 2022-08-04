import validator from "validator";
import { NextFunction, Request, Response } from 'express';

// error
import TypeGuardError from '../errors/TypeGuardError.error';

// User interfaces
import {
    ProductEdit, 
    ProductCreate, 
    IProductRepository,
    ProductSearch,
} from '../interfaces/Product.interface';

// utils
import logger from '../config/logger.config';
import { sanitizeObject, sanitizeString } from '../utils/helpers';
import { 
    isProductEdit,
    isProductCreate,
    isProductSearch,
} from "../validators/Product.typeguard";
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
        logger.info("In [GET] - /products");
        try {
            const products = await this.ProductsRepository.getAllProducts();
            return res.status(200).send({ products });
        } catch (error: unknown) {
            next(error);
        }
    };

    public readonly getProductsByCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        logger.info("In [GET] - /products/filter/:category_name");

        try {
            const category: string = req.params.category_name && sanitizeString(req.params.category_name); 
            if (!category || !!validator.isAlphanumeric(category, undefined, { ignore: "-_" })) {
                throw new TypeGuardError("Filter Products by Category - Request category name param wrong type or missing!");
            }

            const products = await this.ProductsRepository.getProductsByCategory(category);
            return res.status(200).send({ products });
        } catch (error: unknown) {
            next(error);
        }
    };

    public readonly getFilteredProducts = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        logger.info("In [POST] - /products/filter");
        
        try {
            const productFilter: ProductSearch = req.body.filter; 
            if (!productFilter || !isProductSearch(productFilter)) {
                throw new TypeGuardError("Filter Products - Request filter search body wrong type or missing!");
            };  
            sanitizeObject(productFilter);

            const products = await this.ProductsRepository.getProductsByAttributes(productFilter);
            return res.status(200).send({ products });
        } catch (error: unknown) {
            next(error);
        }
    };

    public readonly getProductInfo = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        logger.info("In [GET] - /products/:id");

        try {
            const id: string = req.params?.id;
            if (!id || !validator.isUUID(id)) {
                throw new TypeGuardError("Show Product - Request ID param wrong type or missing!");
            };

            const product = await this.ProductsRepository.getProductById(id);
            if (!product) return res.sendStatus(404);

            return res.status(200).send({ product });
        } catch (error: unknown) {
            next(error);
        }
    };
    
    public readonly addNewProduct = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        logger.info("In [Admin] [POST] - /admin/products");

        try {
            const newProduct: ProductCreate = req.body;
            if (!newProduct || !isProductCreate(newProduct)) {
                throw new TypeGuardError("[Admin] Create Product - Request body payload wrong type!");
            };
            sanitizeObject(newProduct);

            const product = await this.ProductsRepository.createProduct(newProduct);
            if (!product) return res.sendStatus(404);

            return res.status(201).send({ ...product.get() });
        } catch (error: unknown) {
            next(error);
        }
    };

    public readonly editProduct = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        logger.info("In [Admin] [PUT] - /admin/products/:id");

        try {
            const id: string = req.params?.id;
            if ( !id || !validator.isUUID(id)) {
                throw new TypeGuardError("[Admin] Edit Products - Request ID param wrong type or missing!");
            };

            const newProductData: ProductEdit = req.body;
            if (!newProductData || !isProductEdit(newProductData)) {
                throw new TypeGuardError("[Admin] Edit Products - Request body payload wrong type!");
            };
            sanitizeObject(newProductData);

            const product = await this.ProductsRepository.updateProduct(id, newProductData);
            if (!product) return res.sendStatus(404);

            return res.status(200).send({ ...product.get() });
        } catch (error: unknown) {
            next(error);
        }
    };

    public readonly deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        logger.info("In [Admin] [DELETE] - /admin/products/:id");

        try {
            const id: string = req.params?.id;
            if(!id || !validator.isUUID(id)) {
                throw new TypeGuardError("[Admin] Delete Products - Request ID param wrong type or missing!");
            };

            const result = await this.ProductsRepository.deleteProduct( id );
            if(!result) return res.sendStatus(404);

            return res.sendStatus(204);
        } catch (error: unknown) {
            next(error);
        }  
    };
};

export default ProductController;