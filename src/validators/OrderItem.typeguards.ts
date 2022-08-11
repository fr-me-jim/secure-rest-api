import validator from 'validator';
import { 
    OrderItemEdit,
    OrderItemRequest,
    OrderItemCreate,
    OrderItemSearch
} from "../interfaces/OrderItem.interface";

export const isOrderItemRequest = (instance: OrderItemCreate): instance is OrderItemCreate => {
    if (Object.keys(instance).length === 0) return false;

    const mandatoryTemplate: number = 3;
    const template: OrderItemRequest = {
        product_id: "templateString",
        amount: 10,
        price: 10,  
    };

    let isTemplate: boolean = true;
    let mandatoryAmount: number = 0;
    Object.keys(instance).find(key => {
        // if property does not exists
        if (template[key as keyof OrderItemRequest] === undefined) {
            isTemplate = false;
            return true; // break loop
        }

        mandatoryAmount++;

        if (typeof instance[key as keyof OrderItemRequest] !== typeof template[key as keyof OrderItemRequest]) {
            isTemplate = false;
            return true; // break loop
        }

        if (key === "product_id" && !validator.isUUID(instance["product_id"])) {
            isTemplate = false;
            return true; // break loop
        }

        if (key === "amount" && instance["amount"] <= 0) {
            isTemplate = false;
            return true; // break loop
        }

        return false;
    });

    if (mandatoryAmount !== mandatoryTemplate) return false;

    return isTemplate;
};

export const isOrderItemCreate = (instance: OrderItemCreate): instance is OrderItemCreate => {
    if (Object.keys(instance).length === 0) return false;

    const mandatoryTemplate: number = 4;
    const template: OrderItemCreate = {
        order_id: "templateString",
        product_id: "templateString",
        amount: 10,
        price: 10,  
    };

    let isTemplate: boolean = true;
    let mandatoryAmount: number = 0;
    Object.keys(instance).find(key => {
        // if property does not exists
        if (template[key as keyof OrderItemCreate] === undefined) {
            isTemplate = false;
            return true; // break loop
        }

        mandatoryAmount++;

        if (typeof instance[key as keyof OrderItemCreate] !== typeof template[key as keyof OrderItemCreate]) {
            isTemplate = false;
            return true; // break loop
        }

        if (key === "order_id" && !validator.isUUID(instance["order_id"])) {
            isTemplate = false;
            return true; // break loop
        }

        if (key === "product_id" && !validator.isUUID(instance["product_id"])) {
            isTemplate = false;
            return true; // break loop
        }

        if (key === "amount" && instance["amount"] <= 0) {
            isTemplate = false;
            return true; // break loop
        }

        return false;
    });

    if (mandatoryAmount !== mandatoryTemplate) return false;

    return isTemplate;
};

export const isOrderItemEdit = (instance: OrderItemCreate): instance is OrderItemCreate => {
    if (Object.keys(instance).length === 0) return false;

    const templateOptional: OrderItemEdit = {
        product_id: "templateString",
        amount: 10,
        price: 10,  
    };

    let isTemplate: boolean = true;
    Object.keys(instance).find(key => {
        // if property does not exists
        if (templateOptional[key as keyof OrderItemEdit] === undefined) {
            isTemplate = false;
            return true; // break loop
        }

        if (typeof instance[key as keyof OrderItemEdit] !== typeof templateOptional[key as keyof OrderItemEdit]) {
            isTemplate = false;
            return true; // break loop
        }

        if (key === "product_id" && !validator.isUUID(instance["product_id"])) {
            isTemplate = false;
            return true; // break loop
        }

        if (key === "amount" && instance["amount"] <= 0) {
            isTemplate = false;
            return true; // break loop
        }

        return false;
    });

    return isTemplate;
};

export const isOrderItemSearch = (instance: OrderItemCreate): instance is OrderItemCreate => {
    if (Object.keys(instance).length === 0) return false;

    const templateOptional: OrderItemSearch = {
        order_id: "templateString",
        product_id: "templateString",
        amount: 10,
        price: 10,  
    };

    let isTemplate: boolean = true;
    Object.keys(instance).find(key => {
        // if property does not exists
        if (templateOptional[key as keyof OrderItemSearch] === undefined) {
            isTemplate = false;
            return true; // break loop
        }

        if (typeof instance[key as keyof OrderItemSearch] !== typeof templateOptional[key as keyof OrderItemSearch]) {
            isTemplate = false;
            return true; // break loop
        }


        if (key === "order_id" && !validator.isUUID(instance["order_id"])) {
            isTemplate = false;
            return true; // break loop
        }

        if (key === "product_id" && !validator.isUUID(instance["product_id"])) {
            isTemplate = false;
            return true; // break loop
        }

        if (key === "amount" && instance["amount"] <= 0) {
            isTemplate = false;
            return true; // break loop
        }

        return false;
    });

    return isTemplate;
};