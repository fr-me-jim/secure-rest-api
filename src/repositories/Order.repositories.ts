import validator from "validator";

// models
import Order from '../models/Order.model';

// interfaces
import { 
    OrderEdit,
    OrderCreate,
    IOrderRepository,
    OrderEditClient,
} from '../interfaces/Order.interface';

export default class OrderRepositories implements IOrderRepository {
    private readonly _model = Order; 

    constructor() {};

    public readonly getAllOrders = async (): Promise<Order[]> => { 
        try {
            const orders = await this._model.findAll({ raw: true });
            return orders;
        } catch (error: unknown) {
            throw error;
        }
    };

    public readonly getOrderById = async (id: string, client_id?: string): Promise<Order | null> => { 
        if (!id || !validator.isUUID(id)) throw new Error("Required Id must be a non-empty string");

        try {
            const order = await this._model.findOne({ 
                where: { id, client_id }, 
                raw: true 
            });

            return order;
        } catch (error: unknown) {
            throw error;
        }
    };

    public readonly getOrdersByClientId = async (client_id: string): Promise<Order[]> => {
        if (!client_id || !validator.isUUID(client_id)) throw new Error("Required ID must be a non-empty string");

        try {
            const orders = await this._model.findAll({ 
                where: { client_id }, 
                raw: true 
            });

            return orders;
        } catch (error: unknown) {
            throw error;
        }
    };

    public readonly createOrder = async (newOrder: OrderCreate): Promise<Order | null> => { 
        if (!newOrder) throw new Error("Required Object with attributes to create");

        try {
            const order = await this._model.create({ ...newOrder }, {
                returning: true,
                raw: true
            });
            if (!order) return null;

            return order;
        } catch (error: unknown) {
            throw error;
        }
    };

    public readonly updateOrder = async (id: string, newOrderData: OrderEdit | OrderEditClient, client_id?: string): Promise<Order | null> => { 
        if (!id || !validator.isUUID(id) || !newOrderData) throw new Error("Required Object with attributes to search");

        try {
            const [affectedRows, [orden]] = await this._model.update({ ...newOrderData }, {
                where: { id, client_id },
                returning: true
            });
            if (!affectedRows) return null;

            return orden;
        } catch (error: unknown) {
            throw error;
        }
    };

    public readonly deleteOrder = async (id: string): Promise<number | null> => { 
        if (!id) throw new Error("Required Object with attributes to search");

        try {
            return await this._model.destroy({ where: { id } });
        } catch (error) {
            throw error;
        }
    };
};