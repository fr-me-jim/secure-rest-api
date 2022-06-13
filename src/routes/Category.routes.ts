import { Router } from "express";

// main RouterAPI
import RouterAPI from ".";

// controllers
import CategoryController from '../controllers/Category.controller';

export default class CategoryRouter {
    private router: Router;

    private routerAPI: RouterAPI;
    private categoryController: CategoryController;

    constructor(routerAPI: RouterAPI) {
        this.router = Router();

        this.routerAPI = routerAPI;
        this.categoryController = new CategoryController(this.routerAPI.CategoryRepository);
    };


    public readonly SetRoutes = (): Router => {
        this.router.get("/", this.categoryController.getAllCategories);
        this.router.get("/:id", this.categoryController.getCategoryInfo);

        return this.router;
    };
};
