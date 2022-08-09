import { Op } from 'sequelize';

// models
import Product from '../models/Product.model';

// interfaces
import { 
    ProductSearch,
    ProductCreate,
    IProductRepository,
    ProductEdit,
} from '../interfaces/Product.interface';

export default class ProductRepositories implements IProductRepository {
    private readonly _model = Product; 

    constructor() {};

    public readonly getAllProducts = async (): Promise<Product[]> => { 
        try {
            const products: Product[] = await this._model.findAll({ raw: true });
            return products;
        } catch (error: unknown) {
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
        } catch (error: unknown) {
            throw error;
        }
    };

    public readonly getProductsByCategory = async (category: string): Promise<Product[]> => { 
        if (!category) throw new Error("Required Object with attributes to search");

        try {
            const products = await this._model.findAll({ 
                where: { category }, 
                raw: true 
            });

            return products;
        } catch (error: unknown) {
            throw error;
        }
    };

    public readonly getProductsByAttributes = async (productAttributes: ProductSearch): Promise<Product[]> => { 
        if (!productAttributes) throw new Error("Required Object with attributes to search");

        const conditionMap = Object.keys(productAttributes).map( key => {
            if (key === 'name'|| key === 'category' || key === 'description') {
                return { 
                    [key]: {
                        [Op.iLike]: productAttributes[key as keyof ProductSearch] 
                    }
                };
            }

            return { [key]: productAttributes[key as keyof ProductSearch] };
        });
        try {
            const products = await this._model.findAll({ 
                where: { [Op.or]: conditionMap }, 
                raw: true 
            });

            return products;
        } catch (error: unknown) {
            throw error;
        }
    };

    public readonly createProduct = async (newProduct: ProductCreate): Promise<Product | null> => { 
        if (!newProduct) throw new Error("Required Object with attributes to search");

        try {
            const product = await this._model.create({ ...newProduct }, {
                returning: true,
                raw: true
            });
            if (!product) return null;

            return product;
        } catch (error: unknown) {
            throw error;
        }
    };

    public readonly updateProduct = async (id: string, newProductData: ProductEdit): Promise<Product | null> => { 
        if (!id || !newProductData) throw new Error("Required Object with attributes to search");

        try {
            const [affectedRows, [product]] = await this._model.update({ ...newProductData }, {
                where: { id },
                returning: true
            });
            if (!affectedRows) return null;

            return product;
        } catch (error: unknown) {
            throw error;
        }
    };

    public readonly deleteProduct = async (id: string): Promise<number | null> => { 
        if (!id) throw new Error("Required Object with attributes to search");

        try {
            return await this._model.destroy({ where: { id } });
        } catch (error) {
            throw error;
        }
    };
};