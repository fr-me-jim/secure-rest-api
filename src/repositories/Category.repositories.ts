// models
import Category from '../models/Category.model';

// interfaces
import { 
    CategoryType,
    CategoryEdit,
    CategoryCreate,
    ICategoryRepository,
} from '../interfaces/Category.interface';

export default class CategoryRepositories implements ICategoryRepository {
    private readonly _model = Category; 

    constructor() {};

    public readonly getAllCategories = async (): Promise<Category[]> => { 
        try {
            const categories: Category[] = await this._model.findAll({ raw: true });
            return categories;
        } catch (error: unknown) {
            throw error;
        }
    };

    public readonly getCategoryById = async (id: string): Promise<Category | null> => { 
        if (!id) throw new Error("Required Id must be a non-empty string");

        try {
            const category = await this._model.findOne({ 
                where: { id }, 
                raw: true 
            });

            return category;
        } catch (error: unknown) {
            throw error;
        }
    };

    public readonly getCategoryByName = async (name: string): Promise<Category | null> => { 
        if (!name) throw new Error("Required name must be a non-empty string");

        try {
            const category = await this._model.findOne({ 
                where: { name }, 
                raw: true 
            });

            return category;
        } catch (error: unknown) {
            throw error;
        }
    };

    public readonly getCategorysByAttributes = async (categoryAttributes: CategoryType): Promise<Category[]> => { 
        if (!categoryAttributes) throw new Error("Required Object with attributes to search");

        try {
            const categories = await this._model.findAll({ 
                where: { ...categoryAttributes }, 
                raw: true 
            });

            return categories;
        } catch (error: unknown) {
            throw error;
        }
    };

    public readonly createCategory = async (newCategory: CategoryCreate): Promise<Category | null> => { 
        if (!newCategory) throw new Error("Required Object with attributes to search");

        try {
            const category = await this._model.create({ ...newCategory }, {
                returning: true,
                raw: true
            });
            if (!category) return null;

            return category;
        } catch (error: unknown) {
            throw error;
        }
    };

    public readonly updateCategory = async (id: string, newCategoryData: CategoryEdit): Promise<Category | null> => { 
        if (!id || !newCategoryData) throw new Error("Required Object with attributes to search");

        try {
            const [affectedRows, [category]] = await this._model.update({ ...newCategoryData }, {
                where: { id },
                returning: true
            });
            if (!affectedRows) return null;

            return category;
        } catch (error: unknown) {
            throw error;
        }
    };

    public readonly deleteCategory = async (id: string): Promise<number | null> => { 
        if (!id) throw new Error("Required Object with attributes to search");

        try {
            return await this._model.destroy({ where: { id } });
        } catch (error) {
            throw error;
        }
    };
};