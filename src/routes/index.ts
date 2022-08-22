import csurf from 'csurf';
import multer, { Multer } from "multer";
import { Router } from "express";
import passport, { PassportStatic } from 'passport';

// config 
import PassportConfig from "../config/passport.config";

// interfaces
import { IUserRepository } from "../interfaces/User.interface";
import { IOrderRepository } from "../interfaces/Order.interface";
import { ITokenRepositories } from "../interfaces/Token.interface";
import { IProductRepository } from "../interfaces/Product.interface";
import { ICategoryRepository } from "../interfaces/Category.interface";
import { IOrderItemRepository } from "../interfaces/OrderItem.interface";

// repositories
import UserRepositories from '../repositories/User.repositories';
import OrderRepositories from "../repositories/Order.repositories";
import TokenRepositories from '../repositories/Token.repositories';
import ProductRepositories from '../repositories/Product.repositories';
import CategoryRepositories from "../repositories/Category.repositories";
import OrderItemRepositories from "../repositories/OrderItem.repositories";

// middlewares
import { 
    isAdminUser,
    isSuperAdminUser,
    isTokenBlacklisted 
} from '../middlewares/auth.middlewares';

// utils
import { checkAllowedFiles } from "../utils/helpers";

// config
import storage from "../config/multer-storage.config";

// routes
import AuthRouter from './common/Auth.routes';
import UserRouter from './common/User.routes';
import OrderRouter from './common/Order.routes';
import ProductRouter from "./common/Product.routes";
import CategoryRouter from "./common/Category.routes";

import SuperAdminRouter from "./Admin/SuperAdmin.routes";
import AdminOrderRouter from "./Admin/AdminOrder.routes";
import AdminProductRouter from "./Admin/AdminProduct.routes";
import AdminCategoryRouter from "./Admin/AdminCategory.routes";


export default class RouterAPI {
    private router: Router;
    public readonly upload: Multer;
    public readonly strategy: PassportStatic;
    public readonly middlewares: { (): void }[];

    public readonly UserRepository: IUserRepository;
    public readonly OrderRepository: IOrderRepository;
    public readonly TokenRepository: ITokenRepositories;
    public readonly ProductRepository: IProductRepository;
    public readonly CategoryRepository: ICategoryRepository;
    public readonly OrderItemRepository: IOrderItemRepository;

    private AuthRouter: Router;
    private UserRouter: Router;
    private OrderRouter: Router;
    private ProductRouter: Router;
    private CategoryRouter: Router;

    private SuperAdminRouter: Router;
    private AdminOrderRouter: Router;
    private AdminProductRouter: Router;
    private AdminCategoryRouter: Router;

    constructor() {
        this.router = Router();
        this.upload = multer({ storage, fileFilter: checkAllowedFiles });
        
        this.UserRepository = new UserRepositories();
        this.TokenRepository = new TokenRepositories();
        this.OrderRepository = new OrderRepositories();
        this.ProductRepository = new ProductRepositories();
        this.CategoryRepository = new CategoryRepositories();
        this.OrderItemRepository = new OrderItemRepositories();

        this.strategy = new PassportConfig(passport, this.UserRepository).SetStrategy();

        const csrfProtection = csurf({ 
            cookie: {
                path: '/',
                httpOnly: true,
                key: 'XSRF-TOKEN',
                domain: 'tfm.jediupc.com',
                secure: process.env.NODE_ENV === 'production',
                signed: process.env.NODE_ENV === 'production',
            } 
        })
        this.middlewares = [ 
            csrfProtection,
            this.strategy.authenticate('jwt', { session: false }), 
            isTokenBlacklisted 
        ];

        this.AuthRouter = new AuthRouter(this).SetRoutes();    
        this.UserRouter = new UserRouter(this).SetRoutes();
        this.OrderRouter = new OrderRouter(this).SetRoutes();
        this.ProductRouter = new ProductRouter(this).SetRoutes();
        this.CategoryRouter = new CategoryRouter(this).SetRoutes();

        this.SuperAdminRouter = new SuperAdminRouter(this).SetRoutes();
        this.AdminOrderRouter = new AdminOrderRouter(this).SetRoutes();
        this.AdminProductRouter = new AdminProductRouter(this).SetRoutes();
        this.AdminCategoryRouter = new AdminCategoryRouter(this).SetRoutes();
    };

    public readonly InitializeRouter = (): Router => {

        this.router.use('/auth', this.AuthRouter);
        this.router.use('/users', ...this.middlewares, this.UserRouter);
        this.router.use('/orders', ...this.middlewares, this.OrderRouter);
        this.router.use('/products', ...this.middlewares, this.ProductRouter);
        this.router.use('/categories', ...this.middlewares, this.CategoryRouter);

        this.router.use('/admin/users', ...this.middlewares, isSuperAdminUser, this.SuperAdminRouter);
        this.router.use('/admin/orders', ...this.middlewares, isAdminUser, this.AdminOrderRouter);
        this.router.use('/admin/products', ...this.middlewares, isAdminUser, this.AdminProductRouter);
        this.router.use('/admin/categories', ...this.middlewares, isAdminUser, this.AdminCategoryRouter);

        return this.router;
    };
};