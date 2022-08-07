import validator from 'validator';
import { 
    OrderEdit,
    OrderCreate,
    OrderSearch,
    OrderStatus,
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

export const isOrderEdit = (instance: OrderEdit): instance is OrderEdit => {
    if (Object.keys(instance).length === 0) return false;

    const templateOptional: OrderEdit = {
        date: "templateString",
        client_id: "templateString",
        status: "pending",
    };

    let isTemplate: boolean = true;
    Object.keys(instance).find(key => {
        // if property does not exists
        if (templateOptional[key as keyof OrderEdit] === undefined) {
            isTemplate = false;
            return true; // break loop
        }

        if (typeof instance[key as keyof OrderEdit] !== typeof templateOptional[key as keyof OrderEdit]) {
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

export const isOrderSearch = (instance: OrderSearch): instance is OrderSearch => {
    if (Object.keys(instance).length === 0) return false;

    const templateOptional: OrderSearch = {
        date: "templateString",
        client_id: "templateString",
        status: "pending",
    };

    let isTemplate: boolean = true;
    Object.keys(instance).find(key => {
        // if property does not exists
        if (templateOptional[key as keyof OrderSearch] === undefined) {
            isTemplate = false;
            return true; // break loop
        }

        if (typeof instance[key as keyof OrderSearch] !== typeof templateOptional[key as keyof OrderSearch]) {
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