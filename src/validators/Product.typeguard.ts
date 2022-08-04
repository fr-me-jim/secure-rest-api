// import validator from 'validator';
import { 
    ProductEdit,
    ProductSearch,
    ProductCreate,
    ProductCreateOptionals
} from "../interfaces/Product.interface";

export const isPremiumValues = (premium: number): boolean => {
    return premium === 0 || premium === 1;
};

export const isProductCreate = (instance: ProductCreate): instance is ProductCreate => {
    if (Object.keys(instance).length === 0) return false;

    const mandatoryTemplate: number = 6;
    const template: ProductCreate = {
        name: "templateString",
        image: "templateString",
        price: 10,
        stock: 10,
        category: "templateString",
        description: "templateString"
    };

    const templateOptional: ProductCreateOptionals = {
        premium: 0
    };

    let isTemplate: boolean = true;
    let mandatoryAmount: number = 0;
    Object.keys(instance).find(key => {
        // if property does not exists
        if (template[key as keyof ProductCreate] === undefined && templateOptional[key as keyof ProductCreateOptionals] === undefined) {
            isTemplate = false;
            return true; // break loop
        };

        if (template[key as keyof ProductCreate] !== undefined) {
            mandatoryAmount++;

            if (typeof instance[key as keyof ProductCreate] !== typeof template[key as keyof ProductCreate]) {
                isTemplate = false;
                return true; // break loop
            }
        }

        if (templateOptional[key as keyof ProductCreateOptionals] !== undefined) {
            if (typeof instance[key as keyof ProductCreate] !== typeof templateOptional[key as keyof ProductCreateOptionals]) {
                isTemplate = false;
                return true; // break loop
            };

            // if premium property not allowed values 
            if (key === "premium" && !isPremiumValues(instance["premium"]!)) {
                isTemplate = false;
                return true; // break loop
            }

        };

        return false;
    });

    if (mandatoryAmount !== mandatoryTemplate) return false;

    return isTemplate;
};

export const isProductEdit = (instance: ProductEdit): instance is ProductEdit => {
    if (Object.keys(instance).length === 0) return false;

    const templateOptional: ProductEdit = {
        name: "templateString",
        image: "templateString",
        price: 10,
        stock: 10,
        premium: 0,
        category: "templateString",
        description: "templateString"
    };

    let isTemplate: boolean = true;
    Object.keys(instance).find(key => {
        // if property does not exists
        if (templateOptional[key as keyof ProductEdit] === undefined) {
            isTemplate = false;
            return true; // break loop
        };

        if (typeof instance[key as keyof ProductEdit] !== typeof templateOptional[key as keyof ProductEdit]) {
            isTemplate = false;
            return true; // break loop
        }

        // if premium property not allowed values 
        if (key === "premium" && !isPremiumValues(instance["premium"]!)) {
            isTemplate = false;
            return true; // break loop
        }

        return false;
    });

    return isTemplate;
};

export const isProductSearch = (instance: ProductSearch): instance is ProductSearch => {
    if (Object.keys(instance).length === 0) return false;

    const templateOptional: ProductSearch = {
        name: "templateString",
        price: 10,
        stock: 10,
        premium: 0,
        category: "templateString",
        description: "templateString"
    };

    let isTemplate: boolean = true;
    Object.keys(instance).find(key => {
        // if property does not exists
        if (templateOptional[key as keyof ProductSearch] === undefined) {
            isTemplate = false;
            return true; // break loop
        };

        if (typeof instance[key as keyof ProductSearch] !== typeof templateOptional[key as keyof ProductSearch]) {
            isTemplate = false;
            return true; // break loop
        }

        // if premium property not allowed values 
        if (key === "premium" && !isPremiumValues(instance["premium"]!)) {
            isTemplate = false;
            return true; // break loop
        }

        return false;
    });

    return isTemplate;
};