import validator from "validator";
import { NextFunction, Request, Response } from 'express';

// User model
// import Order from '../models/Order.model';
// import { sanitizeString } from "../utils/helpers";

// Order interfaces
import {
    OrderEdit, 
    OrderCreate, 
    // OrderSearch,
    IOrderRepository,
} from '../interfaces/Order.interface';
import {
    // OrderItemEdit, 
    OrderItemCreate, 
    // OrderItemSearch,
    IOrderItemRepository,
} from '../interfaces/OrderItem.interface';
import Product from "src/models/Product.model";

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
        try {
            const orders = await this.OrdersRepository.getAllOrders();
            return res.status(200).send({ orders });
        } catch (error: unknown) {
            next(error);
        }
    };

    public readonly getOrderInfo = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const id: string | undefined = req.params?.id;
        if (!id || !validator.isUUID(id)) return res.sendStatus(400);

        try {
            const order = await this.OrdersRepository.getOrderById(id);
            if (!order) return res.sendStatus(404);

            return res.status(200).send({ order });
        } catch (error: unknown) {
            next(error);
        }
    };

    public readonly getItemsByOrder = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const id: string | undefined = req.params?.id;
        if (!id || !validator.isUUID(id)) return res.sendStatus(400);

        try {
            const items = await this.OrderItemRepository.getOrderItemsByOrderId(id);
            if (!items) return res.sendStatus(404);

            return res.status(200).send({ items });
        } catch (error: unknown) {
            next(error);
        }
    };
    
    public readonly addNewOrder = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const orderItems: Product[] = req.body;
        const client_id: string | undefined = req.params.client_id;
        if (!client_id || !validator.isUUID(client_id) || orderItems.length === 0) return res.sendStatus(400);

        try {
            const orderData: OrderCreate = {
                status: "pending",
                client_id
            };
            const order = await this.OrdersRepository.createOrder(orderData);
            if (!order) return res.sendStatus(404);

            const itemsMap: Map<string, OrderItemCreate> = new Map<string, OrderItemCreate>();
            orderItems.forEach( item => {
                let previousItem = itemsMap.get(item.id);
                if (previousItem) itemsMap.set(item.id, { ...previousItem, quantity: previousItem.quantity + 1  });
                else {
                    const itemInfo: OrderItemCreate = {
                        order_id: order.id,
                        product_id: item.id,
                        quantity: 1,
                        price: item.price
                    };
                    itemsMap.set(item.id, itemInfo);
                }
                
            });
            
            itemsMap.forEach( async (item) => {
                try {
                    const result = await this.OrderItemRepository.createOrderItem(item)
                    if (!result) {
                        await this.OrdersRepository.deleteOrder(order.id);
                        throw new Error("Error adding OrderItems");
                    }
                } catch (error) {
                    await this.OrdersRepository.deleteOrder(order.id);
                    throw error;
                }
            });

            return res.status(201).send({ ...order.get() });
        } catch (error: unknown) {
            next(error);
        }
    };

    public readonly editOrder = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const id: string | undefined = req.params?.id;
        const newOrderData: OrderEdit | undefined = req.body;
        if ( !id || !validator.isUUID(id) || !newOrderData) return res.sendStatus(400);

        try {
            const order = await this.OrdersRepository.updateOrder(id, newOrderData);
            if (!order) return res.sendStatus(404);

            return res.status(200).send({ ...order.get() });
        } catch (error: unknown) {
            next(error);
        }
    };

    public readonly deleteOrder = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const id: string | undefined = req.params?.id;
            if(!id || !validator.isUUID(id)) return res.sendStatus(400);

            const result = await this.OrdersRepository.deleteOrder( id );
            if(!result) return res.sendStatus(404);

            return res.sendStatus(204);
        } catch (error: any) {
            next(error);
        }  
    };
};

export default OrderController;