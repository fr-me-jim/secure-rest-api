import validator from "validator";
import { NextFunction, Request, Response } from 'express';

// error
import TypeGuardError from '../errors/TypeGuardError.error';

// Order interfaces
import {
    OrderEdit, 
    OrderCreate, 
    // OrderSearch,
    IOrderRepository,
    OrderEditClient,
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
    isOrderItemRequest
} from "../validators/OrderItem.typeguards";
import { 
    isOrderCreate,
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

            return res.status(200).send({ order });
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
        const client_id: string = req.user!.id!;
        const orderItems: OrderItemRequest[] = req.body;
        if (!client_id || !validator.isUUID(client_id) || orderItems.length === 0) return res.sendStatus(400);

        let orderID: string = "";
        let itemsCreated: string[] = [];
        try {
            const orderData: OrderCreate = {
                status: "pending",
                client_id
            };
            const order = await this.OrdersRepository.createOrder(orderData);
            if (!order) return res.sendStatus(409);
            orderID = order.id;
            
            for (let i = 0; i < orderItems.length; i++) {
                const item: OrderItemCreate = { ...orderItems[i], order_id: order.id };
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
        const id: string = req.params?.id;
        const newOrderData: OrderEditClient = req.body;
        console.log('[New Order]', newOrderData)
        if ( !id || !validator.isUUID(id) || !newOrderData) return res.sendStatus(400);

        try {
            const order = await this.OrdersRepository.updateOrder(id, newOrderData, req.user!.id!);
            if (!order) return res.sendStatus(409);

            return res.status(200).send({ ...order.get() });
        } catch (error: unknown) {
            next(error);
        }
    };

    public readonly editOrder = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        logger.info("In [PUT] - /admin/orders/:id");
        const id: string = req.params?.id;
        const newOrderData: OrderEdit = req.body;
        if ( !id || !validator.isUUID(id) || !newOrderData) return res.sendStatus(400);

        try {
            const order = await this.OrdersRepository.updateOrder(id, newOrderData);
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
            if(!id || !validator.isUUID(id)) return res.sendStatus(400);

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
            if(!id || !validator.isUUID(id)) return res.sendStatus(400);

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