import validator from "validator";

// models
import OrderItem from '../models/OrderItem.model';

// interfaces
import { 
    OrderItemEdit,
    OrderItemCreate,
    IOrderItemRepository,
} from '../interfaces/OrderItem.interface';

export default class OrderItemRepositories implements IOrderItemRepository {
    private readonly _model = OrderItem; 

    constructor() {};

    public readonly getAllOrderItems = async (): Promise<OrderItem[]> => { 
        try {
            const orderItems = await this._model.findAll({ raw: true });
            return orderItems;
        } catch (error: unknown) {
            throw error;
        }
    };

    public readonly getOrderItemById = async (id: string): Promise<OrderItem | null> => { 
        if (!id || !validator.isUUID(id)) throw new Error("Required Id must be a non-empty string");

        try {
            const orderItem = await this._model.findOne({ 
                where: { id }, 
                raw: true 
            });

            return orderItem;
        } catch (error: unknown) {
            throw error;
        }
    };

    public readonly getOrderItemsByOrderId = async (order_id: string): Promise<OrderItem[]> => {
        if (!order_id || !validator.isUUID(order_id)) throw new Error("Required ID must be a non-empty string");

        try {
            const orderItems = await this._model.findAll({ 
                where: { order_id }, 
                raw: true 
            });

            return orderItems;
        } catch (error: unknown) {
            throw error;
        }
    };

    public readonly createOrderItem = async (newOrderItem: OrderItemCreate): Promise<OrderItem | null> => { 
        if (!newOrderItem) throw new Error("Required Object with attributes to search");

        try {
            const orderItem = await this._model.create({ ...newOrderItem }, {
                returning: true,
                raw: true
            });
            if (!orderItem) return null;

            return orderItem;
        } catch (error: unknown) {
            throw error;
        }
    };

    public readonly updateOrderItem = async (id: string, newOrderItemData: OrderItemEdit): Promise<OrderItem | null> => { 
        if (!id || !validator.isUUID(id) || !newOrderItemData) throw new Error("Required Object with attributes to search");

        try {
            const [affectedRows, [orden]] = await this._model.update({ ...newOrderItemData }, {
                where: { id },
                returning: true
            });
            if (!affectedRows) return null;

            return orden;
        } catch (error: unknown) {
            throw error;
        }
    };

    public readonly deleteOrderItem = async (id: string): Promise<number | null> => { 
        if (!id) throw new Error("Required Object with attributes to search");

        try {
            return await this._model.destroy({ where: { id } });
        } catch (error) {
            throw error;
        }
    };
};