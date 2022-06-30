import { Router } from "express";

// main RouterAPI
import RouterAPI from "../";

// controllers
import OrderController from '../../controllers/Order.controller';

export default class AdminOrderRouter {
    private router: Router;

    private routerAPI: RouterAPI;
    private orderController: OrderController;

    constructor(routerAPI: RouterAPI) {
        this.router = Router();

        this.routerAPI = routerAPI;
        this.orderController = new OrderController (
            this.routerAPI.OrderRepository,
            this.routerAPI.OrderItemRepository
        );
    };


    public readonly SetRoutes = (): Router => {
        this.router.get("/", this.orderController.getAllOrders);
        this.router.get("/:id", this.orderController.getOrderInfo);

        this.router.put("/:id", this.orderController.editOrder);
        this.router.delete("/:id", this.orderController.deleteOrder);

        return this.router;
    };
};
