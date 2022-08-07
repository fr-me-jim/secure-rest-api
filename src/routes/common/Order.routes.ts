import { Router } from "express";

// main RouterAPI
import RouterAPI from "../";

// controllers
import OrderController from '../../controllers/Order.controller';

export default class OrderRouter {
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
        this.router.get("/own", this.orderController.getAllClientOrders);
        this.router.get("/own/:id", this.orderController.getClientOrderInfo);
        this.router.get("/own/:id/items", this.orderController.getItemsByOrder);

        this.router.put("/own/:id", this.orderController.editClientOrder);
        this.router.put("/own/:id/cancellation", this.orderController.cancelOrder);
        this.router.post("/own/place-order", this.orderController.addNewOrder); 

        return this.router;
    };
};
