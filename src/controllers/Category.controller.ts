import validator from "validator";
import { NextFunction, Request, Response } from 'express';

// User model
// import Product from '../models/Product.model';
// error
import TypeGuardError from '../errors/TypeGuardError.error';

// User interfaces
import {
    CategoryEdit, 
    CategoryCreate, 
    ICategoryRepository, 
} from '../interfaces/Category.interface';

// utils
import { sanitizeObject } from '../utils/helpers';
import logger from '../config/logger.config';
import { 
    isCategoryEdit,
    isCategoryCreate,
} from "../validators/Categories.typeguard";

/**
 * @class ProductController
 * @desc Responsible for handling API requests for the
 * /categories and /admin/categories routes.
 **/
class CategoryController {
    protected CategoriesRepository: ICategoryRepository;

    constructor(repository: ICategoryRepository) {
        // super(repository);
        this.CategoriesRepository = repository;
    };

    public readonly getAllCategories = async (_req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        logger.info('In [GET] - /categories');
        try {
            const categories = await this.CategoriesRepository.getAllCategories();
            return res.status(200).send({ categories });
        } catch (error: unknown) {
            next(error);
        }
    };

    public readonly getCategoryInfo = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        logger.info('In [GET] - /categories/:id');

        try {
            const id: string = req.params?.id;
            if (!id || !validator.isUUID(id)) return res.sendStatus(400);

            const category = await this.CategoriesRepository.getCategoryById(id);
            if (!category) return res.sendStatus(404);

            return res.status(200).send({ category });
        } catch (error: unknown) {
            next(error);
        }
    };
    
    public readonly addNewCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        logger.info('In [POST] - /categories');
        try {
            const newCategory: CategoryCreate = req.body;
            if (!newCategory || !isCategoryCreate(newCategory)) {
                throw new TypeGuardError("Create Categories - Request body payload wrong type!");
            }
            sanitizeObject(newCategory);

            const category = await this.CategoriesRepository.createCategory(newCategory);
            if (!category) return res.sendStatus(404);

            return res.status(201).send({ ...category.get() });
        } catch (error: unknown) {
            next(error);
        }
    };

    public readonly editCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        logger.info('In [PUT] - /categories/:id');

        try {
            const id: string = req.params?.id;
            const newCategoryData: CategoryEdit = req.body;
            if (!id || !validator.isUUID(id)) {
                throw new TypeGuardError("Edit Categories - Request ID param wrong type or missing!");
            };
            if ( !isCategoryEdit(newCategoryData) ) {
                throw new TypeGuardError("Edit Categories - Request body payload wrong type!");
            };
            sanitizeObject(newCategoryData);

            const category = await this.CategoriesRepository.updateCategory(id, newCategoryData);
            if (!category) return res.sendStatus(404);

            return res.status(200).send({ ...category.get() });
        } catch (error: unknown) {
            next(error);
        }
    };

    public readonly deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        logger.info('In [DELETE] - /categories/:id');

        try {
            const id: string = req.params?.id;
            if (!id || !validator.isUUID(id)) {
                throw new TypeGuardError("Delete Categories - Request ID param wrong type or missing!");
            };

            const result = await this.CategoriesRepository.deleteCategory( id );
            if(!result) return res.sendStatus(404);

            return res.sendStatus(204);
        } catch (error: unknown) {
            next(error);
        }  
    };
};

export default CategoryController;