import { Request, Response } from 'express';

// User model
// import Product from '../models/Product.model';

// User interfaces
import {
    CategoryEdit, 
    CategoryCreate, 
    ICategoryRepository, 
} from '../interfaces/Category.interface';

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

    public readonly getAllCategories = async (_req: Request, res: Response): Promise<Response> => {
        try {
            const categories = await this.CategoriesRepository.getAllCategories();
            return res.status(200).send({ categories });
        } catch (error: unknown) {
            res.sendStatus(500);
            throw error;
        }
    };

    public readonly getCategoryInfo = async (req: Request, res: Response): Promise<Response> => {
        const id: string | undefined = req.params?.id;
        if (!id) return res.sendStatus(400);

        try {
            const category = await this.CategoriesRepository.getCategoryById(id);
            if (!category) return res.sendStatus(404);

            return res.status(200).send({ category });
        } catch (error: unknown) {
            res.sendStatus(500);
            throw error;
        }
    };
    
    public readonly addNewCategory = async (req: Request, res: Response): Promise<Response> => {
        const newCategory: CategoryCreate | undefined = req.body;
        if (!newCategory) return res.sendStatus(400);

        try {
            const category = await this.CategoriesRepository.createCategory(newCategory);
            if (!category) return res.sendStatus(404);

            return res.status(201).send({ ...category.get() });
        } catch (error: unknown) {
            res.sendStatus(500);
            throw error;
        }
    };

    public readonly editCategory = async (req: Request, res: Response): Promise<Response> => {
        const id: string | undefined = req.params?.id;
        const newCategoryData: CategoryEdit | undefined = req.body;
        if ( !id || !newCategoryData) return res.sendStatus(400);

        try {
            const category = await this.CategoriesRepository.updateCategory(id, newCategoryData);
            if (!category) return res.sendStatus(404);

            return res.status(200).send({ ...category.get() });
        } catch (error: unknown) {
            res.sendStatus(500);
            throw error;
        }
    };

    public readonly deletecategory = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id: string | undefined = req.params?.id;
            if(!id) return res.sendStatus(400);

            const result = await this.CategoriesRepository.deleteCategory( id );
            if(!result) return res.sendStatus(404);

            return res.sendStatus(204);
        } catch (error: any) {
            res.sendStatus(500);
            throw new Error(error);
        }  
    };
};

export default CategoryController;