// models
import Product from '../models/Product.model';

// interfaces
import { 
    // UserEdit,
    // UserCreate,
    ProductAttributes,
    // IUserRepository
} from '../interfaces/Product.interface';

export default class ProductRepositories {
    private readonly _model = Product; 

    constructor() {};

    public readonly getAllProducts = async (): Promise<Product[]> => { 
        try {
            const products: Product[] = await this._model.findAll({ raw: true });
            return products;
        } catch (error) {
            throw error;
        }
    };

    public readonly getProductById = async (id: string): Promise<Product | null> => { 
        if (!id) throw new Error("Required Id must be a non-empty string");

        try {
            const product = await this._model.findOne({ 
                where: { id }, 
                raw: true 
            });

            return product;
        } catch (error) {
            throw error;
        }
    };

    public readonly getProductByAttributes = async (productAttributes: ProductAttributes): Promise<Product[] | null> => { 
        if (!productAttributes) throw new Error("Required Object with attributes to search");

        try {
            const product = await this._model.findAll({ 
                where: { ...productAttributes }, 
                raw: true 
            });

            return product;
        } catch (error) {
            throw error;
        }
    };
};