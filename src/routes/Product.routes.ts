import { Router } from "express";

// main RouterAPI
import RouterAPI from ".";

// controllers
import ProductController from '../controllers/Product.controller';

export default class ProductRouter {
    private router: Router;

    private routerAPI: RouterAPI;
    private productController: ProductController;

    constructor(routerAPI: RouterAPI) {
        this.router = Router();

        this.routerAPI = routerAPI;
        this.productController = new ProductController(this.routerAPI.ProductRepository);
    };


    public readonly SetRoutes = (): Router => {
        this.router.get("/", this.productController.getAllProducts);
        this.router.get("/:id", this.productController.getProductInfo);

        return this.router;
    };
};
