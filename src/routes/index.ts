import { Router } from "express";
import passport, { PassportStatic } from 'passport';

// config 
import PassportConfig from "../auth/passport";

// interfaces
import { IUserRepository } from "../interfaces/User.interface";
import { ITokenRepositories } from "../interfaces/Token.interface";
import { IProductRepository } from "../interfaces/Product.interface";
import { ICategoryRepository } from "../interfaces/Category.interface";

// repositories
import UserRepositories from '../repositories/User.repositories';
import TokenRepositories from '../repositories/Token.repositories';
import ProductRepositories from '../repositories/Product.repositories';
import CategoryRepositories from "../repositories/Category.repositories";

// middlewares
import { 
    isAdminUser,
    isSuperAdminUser,
    isTokenBlacklisted 
} from '../middlewares/auth.middlewares';

// routes
import AuthRouter from './Auth.routes';
import UserRouter from './User.routes';
import ProductRouter from "./Product.routes";
import CategoryRouter from "./Category.routes";
import SuperAdminRouter from "./SuperAdmin.routes";
import AdminProductRouter from "./AdminProduct.routes";

export default class RouterAPI {
    private router: Router;
    public readonly strategy: PassportStatic;
    public readonly middlewares: { (): void }[];

    public readonly UserRepository: IUserRepository;
    public readonly TokenRepository: ITokenRepositories;
    public readonly ProductRepository: IProductRepository;
    public readonly CategoryRepository: ICategoryRepository;

    private AuthRouter: Router;
    private UserRouter: Router;
    private ProductRouter: Router;
    private CategoryRouter: Router;

    private SuperAdminRouter: Router;
    private AdminProductRouter: Router;

    constructor() {
        this.router = Router();
        
        this.UserRepository = new UserRepositories();
        this.TokenRepository = new TokenRepositories();
        this.ProductRepository = new ProductRepositories();
        this.CategoryRepository = new CategoryRepositories();

        this.strategy = new PassportConfig(passport, this.UserRepository).SetStrategy();

        this.middlewares = [ 
            this.strategy.authenticate('jwt', { session: false }), 
            isTokenBlacklisted 
        ];

        this.AuthRouter = new AuthRouter(this).SetRoutes();    
        this.UserRouter = new UserRouter(this).SetRoutes();
        this.ProductRouter = new ProductRouter(this).SetRoutes();
        this.CategoryRouter = new CategoryRouter(this).SetRoutes();

        this.SuperAdminRouter = new SuperAdminRouter(this).SetRoutes();
        this.AdminProductRouter = new AdminProductRouter(this).SetRoutes();
    };

    public readonly InitializeRouter = (): Router => {

        this.router.use('/', this.AuthRouter);
        this.router.use('/users', ...this.middlewares, this.UserRouter);
        this.router.use('/products', ...this.middlewares, this.ProductRouter);
        this.router.use('/categories', ...this.middlewares, this.CategoryRouter);

        this.router.use('/admin/users', ...this.middlewares, isSuperAdminUser, this.SuperAdminRouter);
        this.router.use('/admin/products', ...this.middlewares, isAdminUser, this.AdminProductRouter);
        this.router.use('/admin/categories', ...this.middlewares, isAdminUser, this.AdminProductRouter);

        return this.router;
    };
};