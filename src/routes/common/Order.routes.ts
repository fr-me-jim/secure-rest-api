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
        this.router.get("/:id/own", this.orderController.getClientOrderInfo);
        this.router.get("/clients/:client_id", this.orderController.getAllClientOrders);

        this.router.put("/:id/edit", this.orderController.editClientOrder);
        this.router.put("/:id/cancelation", this.orderController.cancelOrder);
        this.router.post("/:client_id/place-order", this.orderController.addNewOrder); 

        return this.router;
    };
};
