import { Router } from "express";

// main RouterAPI
import RouterAPI from "../";

// controllers
import ProductController from '../../controllers/Product.controller';

export default class AdminProductRouter {
    private router: Router;

    private routerAPI: RouterAPI;
    private productController: ProductController;

    constructor(routerAPI: RouterAPI) {
        this.router = Router();

        this.routerAPI = routerAPI;
        this.productController = new ProductController(this.routerAPI.ProductRepository);
    };


    public readonly SetRoutes = (): Router => {
        this.router.post("/", this.productController.addNewProduct);
        this.router.put("/:id", this.productController.editProduct);
        this.router.delete("/:id", this.productController.deleteProduct);

        return this.router;
    };
};
