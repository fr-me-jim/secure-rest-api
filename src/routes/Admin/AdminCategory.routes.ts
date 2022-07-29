import { Router } from "express";

// main RouterAPI
import RouterAPI from "../";

// controllers
import CategoryController from '../../controllers/Category.controller';

export default class AdminCategoryRouter {
    private router: Router;

    private routerAPI: RouterAPI;
    private categoryController: CategoryController;

    constructor(routerAPI: RouterAPI) {
        this.router = Router();

        this.routerAPI = routerAPI;
        this.categoryController = new CategoryController(this.routerAPI.CategoryRepository);
    };


    public readonly SetRoutes = (): Router => {
        this.router.post("/", this.categoryController.addNewCategory);
        this.router.put("/:id", this.categoryController.editCategory);
        this.router.delete("/:id", this.categoryController.deleteCategory);

        return this.router;
    };
};
