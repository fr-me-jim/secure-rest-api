import validator from "validator";
import { NextFunction, Request, Response } from 'express';

// error
import TypeGuardError from '../errors/TypeGuardError.error';

// Order interfaces
import {
    OrderEdit, 
    OrderCreate, 
    // OrderSearch,
    OrderEditRequest,
    IOrderRepository,
} from '../interfaces/Order.interface';
import {
    // OrderItemEdit, 
    OrderItemCreate, 
    // OrderItemSearch,
    OrderItemRequest,
    IOrderItemRepository,
} from '../interfaces/OrderItem.interface';

// utils
import logger from '../config/logger.config';
import { sanitizeObject } from '../utils/helpers';
import { 
    isOrderItemCreate
} from "../validators/OrderItem.typeguards";
import { 
    isOrderEditRequest
} from "../validators/Order.typeguards";

/**
 * @class OrderController
 * @desc Responsible for handling API requests for the
 * /order and /admin/orders routes.
 **/
class OrderController {
    protected OrdersRepository: IOrderRepository;
    protected OrderItemRepository: IOrderItemRepository;

    constructor(ordersRepository: IOrderRepository, orderItemsRepository: IOrderItemRepository) {
        // super(repository);
        this.OrdersRepository = ordersRepository;
        this.OrderItemRepository = orderItemsRepository;
    };

    public readonly getAllOrders = async (_req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        logger.info("In [GET] - /admin/orders");
        try {
            const orders = await this.OrdersRepository.getAllOrders();
            return res.status(200).send({ orders });
        } catch (error: unknown) {
            next(error);
        }
    };

    public readonly getOrderInfo = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        logger.info("In [GET] - /admin/orders/:id");

        try {
            const id: string = req.params?.id;
            if (!id || !validator.isUUID(id)) {
                throw new TypeGuardError("[Admin] Show Order - Request ID param wrong type or missing!");
            };

            const order = await this.OrdersRepository.getOrderById(id);
            if (!order) return res.sendStatus(404);

            return res.status(200).send({ order });
        } catch (error: unknown) {
            next(error);
        }
    };

    public readonly getClientOrderInfo = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        logger.info("In [GET] - /orders/own/:id");

        try {
            const id: string = req.params?.id;
            if (!id || !validator.isUUID(id)) {
                throw new TypeGuardError("Show Client Order - Request ID param wrong type or missing!");
            };

            const order = await this.OrdersRepository.getOrderById(id, req.user!.id!);
            if (!order) return res.sendStatus(404);
            // order.get()

            const orderItems = await this.OrderItemRepository.getOrderItemsByOrderId( order.id );

            return res.status(200).send({ ...order, items: orderItems });
        } catch (error: unknown) {
            next(error);
        }
    };


    public readonly getAllClientOrders = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        logger.info("In [GET] - /orders/own");
        try {
            const orders = await this.OrdersRepository.getOrdersByClientId(req.user!.id!);
            return res.status(200).send({ orders });
        } catch (error: unknown) {
            next(error);
        }
    };

    public readonly getItemsByOrder = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        logger.info("In [GET] - /orders/own/:id/items");

        try {
            const id: string = req.params?.id;
            if (!id || !validator.isUUID(id)) {
                throw new TypeGuardError("Show Client Order Items - Request ID param wrong type or missing!");
            };

            const items = await this.OrderItemRepository.getOrderItemsByOrderId(id);
            if (!items) return res.sendStatus(409);

            return res.status(200).send({ items });
        } catch (error: unknown) {
            next(error);
        }
    };
    
    public readonly addNewOrder = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        logger.info("In [POST] - /orders/own/place-order");
        
        let orderID: string = "";
        let itemsCreated: string[] = [];
        try {
            const client_id: string = req.user!.id!;
            if (!client_id || !validator.isUUID(client_id)) {
                throw new TypeGuardError("Place Order - Request Client ID param wrong type or missing!");
            };

            const orderItems: OrderItemRequest[] = req.body;
            if (!orderItems.length) {
                throw new TypeGuardError("Place Order - Request body items list is empty!");
            };

            const orderData: OrderCreate = {
                status: "pending",
                client_id
            };
            const order = await this.OrdersRepository.createOrder(orderData);
            if (!order) return res.sendStatus(409);
            orderID = order.id;
            
            for (let i = 0; i < orderItems.length; i++) {
                const item: OrderItemCreate = { ...orderItems[i], order_id: order.id };
                if (!isOrderItemCreate(item)) {
                    this.rollbackOrderCreation(order.id, itemsCreated);
                    throw new TypeGuardError("Place Order - Request Order Item wrong type!");
                };
                sanitizeObject(item);
                const result = await this.OrderItemRepository.createOrderItem(item);
                if (!result) {
                    this.rollbackOrderCreation(order.id, itemsCreated);
                    return res.sendStatus(409);  
                } 
                itemsCreated.push(result.id);
            };

            return res.status(201).send({ ...order.get() });
        } catch (error: unknown) {
            if (orderID) this.rollbackOrderCreation(orderID, itemsCreated);
            next(error);
        }
    };

    public readonly editClientOrder = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        logger.info("In [PUT] - /orders/own/:id");

        try {
            const id: string = req.params?.id;
            if ( !id || !validator.isUUID(id)) {
                throw new TypeGuardError("Edit Client Order - Request ID param wrong type or missing!");
            };

            const newOrderData: OrderEditRequest = req.body;
            console.log('[New Order]', newOrderData)
            if ( !newOrderData || !isOrderEditRequest(newOrderData) ) {
                throw new TypeGuardError("Edit Client Order - Request body payload wrong type! or missing!");
            };

            const newOrderDataEdit: OrderEdit = {
                date: req.body.date && new Date(req.body.date),
                ...req.body
            };
            sanitizeObject(newOrderDataEdit);

            const order = await this.OrdersRepository.updateOrder(id, newOrderDataEdit, req.user!.id!);
            if (!order) return res.sendStatus(409);

            return res.status(200).send({ ...order.get() });
        } catch (error: unknown) {
            next(error);
        }
    };

    public readonly editOrder = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        logger.info("In [PUT] - /admin/orders/:id");

        try {
            const id: string = req.params?.id;
            if ( !id || !validator.isUUID(id)) {
                throw new TypeGuardError("[Admin] Edit Order - Request ID param wrong type or missing!");
            };

            const newOrderData: OrderEditRequest = req.body;
            if ( !newOrderData || !isOrderEditRequest(newOrderData) ) {
                throw new TypeGuardError("[Admin] Edit Order - Request body payload wrong type! or missing!");
            };

            const newOrderDataEdit: OrderEdit = {
                date: req.body.date && new Date(req.body.date),
                ...req.body
            };
            sanitizeObject(newOrderDataEdit);

            const order = await this.OrdersRepository.updateOrder(id, newOrderDataEdit);
            if (!order) return res.sendStatus(409);

            return res.status(200).send({ ...order.get() });
        } catch (error: unknown) {
            next(error);
        }
    };

    public readonly cancelOrder = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        logger.info("In [PUT] - /orders/own/:id/cancellation");

        try {
            const id: string = req.params?.id;
            if ( !id || !validator.isUUID(id)) {
                throw new TypeGuardError("Cancel Client Order - Request ID param wrong type or missing!");
            };

            const order = await this.OrdersRepository.updateOrder(id, { status: "cancelled" }, req.user!.id);
            if (!order) return res.sendStatus(409);

            return res.sendStatus(204);
        } catch (error: any) {
            next(error);
        }  
    };

    public readonly deleteOrder = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        logger.info("In [DELETE] - /admin/orders/:id");

        try {
            const id: string = req.params?.id;
            if ( !id || !validator.isUUID(id)) {
                throw new TypeGuardError("[Admin] Delete Order - Request ID param wrong type or missing!");
            };

            const result = await this.OrdersRepository.deleteOrder( id );
            if(result === 0) return res.sendStatus(404);
            if(result === null) return res.sendStatus(409);

            return res.sendStatus(204);
        } catch (error: any) {
            next(error);
        }  
    };

    private readonly rollbackOrderCreation = async (order_id: string, itemsCreated: string[]): Promise<void> => {
        try {
            if (itemsCreated.length) {
                for (let i = 0; i < itemsCreated.length; i++) {
                    await this.OrderItemRepository.deleteOrderItem(itemsCreated[i]);
                }
            }

            await this.OrdersRepository.deleteOrder(order_id);
        } catch (error: unknown) {
            throw error;
        }
    };
};

export default OrderController;