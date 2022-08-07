import validator from 'validator';
import { 
    OrderCreate,
    OrderStatus,
    OrderEditRequest,
    OrderSearchRequest,
} from "../interfaces/Order.interface";

export const isValidStatus = (status: OrderStatus): boolean => {
    const orderStatus: OrderStatus[] = ["pending", "payed", "shipped", "delivered", "cancelled"];

    return orderStatus.includes(status);
};

export const isOrderCreate = (instance: OrderCreate): instance is OrderCreate => {
    if (Object.keys(instance).length === 0) return false;

    const mandatoryTemplate: number = 2;
    const template: OrderCreate = {
        client_id: "templateString",
        status: "pending",  
    };

    let isTemplate: boolean = true;
    let mandatoryAmount: number = 0;
    Object.keys(instance).find(key => {
        // if property does not exists
        if (template[key as keyof OrderCreate] === undefined) {
            isTemplate = false;
            return true; // break loop
        }

        mandatoryAmount++;

        if (typeof instance[key as keyof OrderCreate] !== typeof template[key as keyof OrderCreate]) {
            isTemplate = false;
            return true; // break loop
        }

        if (key === "client_id" && !validator.isUUID(instance["client_id"])) {
            isTemplate = false;
            return true; // break loop
        }

        if (key === "status" && !isValidStatus(instance["status"])) {
            isTemplate = false;
            return true; // break loop
        }

        return false;
    });

    if (mandatoryAmount !== mandatoryTemplate) return false;

    return isTemplate;
};

export const isOrderEditRequest = (instance: OrderEditRequest): instance is OrderEditRequest => {
    if (Object.keys(instance).length === 0) return false;

    const templateOptional: OrderEditRequest = {
        date: "templateString",
        client_id: "templateString",
        status: "pending",
    };

    let isTemplate: boolean = true;
    Object.keys(instance).find(key => {
        // if property does not exists
        if (templateOptional[key as keyof OrderEditRequest] === undefined) {
            isTemplate = false;
            return true; // break loop
        }

        if (typeof instance[key as keyof OrderEditRequest] !== typeof templateOptional[key as keyof OrderEditRequest]) {
            isTemplate = false;
            return true; // break loop
        }

        if (key === "date" && isNaN(Date.parse(instance["date"]!))) {
            isTemplate = false;
            return true; // break loop
        }

        if (key === "client_id" && !validator.isUUID(instance["client_id"]!)) {
            isTemplate = false;
            return true; // break loop
        }


        if (key === "status" && !isValidStatus(instance["status"]!)) {
            isTemplate = false;
            return true; // break loop
        }

        return false;
    });

    return isTemplate;
};

export const isOrderSearch = (instance: OrderSearchRequest): instance is OrderSearchRequest => {
    if (Object.keys(instance).length === 0) return false;

    const templateOptional: OrderSearchRequest = {
        date: "templateString",
        client_id: "templateString",
        status: "pending",
    };

    let isTemplate: boolean = true;
    Object.keys(instance).find(key => {
        // if property does not exists
        if (templateOptional[key as keyof OrderSearchRequest] === undefined) {
            isTemplate = false;
            return true; // break loop
        }

        if (typeof instance[key as keyof OrderSearchRequest] !== typeof templateOptional[key as keyof OrderSearchRequest]) {
            isTemplate = false;
            return true; // break loop
        }

        if (key === "date" && isNaN(Date.parse(instance["date"]!))) {
            isTemplate = false;
            return true; // break loop
        }

        if (key === "client_id" && !validator.isUUID(instance["client_id"]!)) {
            isTemplate = false;
            return true; // break loop
        }


        if (key === "status" && !isValidStatus(instance["status"]!)) {
            isTemplate = false;
            return true; // break loop
        }

        return false;
    });

    return isTemplate;
};