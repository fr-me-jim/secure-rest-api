import validator from 'validator';
import { 
    CategoryEdit,
    CategoryCreate,
    CategorySearch
} from "../interfaces/Category.interface";

export const isCategoryCreate = (instance: CategoryCreate): instance is CategoryCreate => {
    if (Object.keys(instance).length === 0) return false;

    const mandatoryTemplate: number = 1;
    const template: CategoryCreate = {
        name: "templateString"
    };

    let isTemplate: boolean = true;
    let mandatoryAmount: number = 0;
    Object.keys(instance).find(key => {
        // if property does not exists
        if (template[key as keyof CategoryCreate] === undefined) {
            isTemplate = false;
            return true; // break loop
        }

        mandatoryAmount++;

        if (typeof instance[key as keyof CategoryCreate] !== typeof template[key as keyof CategoryCreate]) {
            isTemplate = false;
            return true; // break loop
        }

        if (key === "name" && !validator.isAlphanumeric(instance["name"], undefined, { ignore: "-_" })) {
            isTemplate = false;
            return true; // break loop
        }

        return false;
    });

    if (mandatoryAmount !== mandatoryTemplate) return false;
    
    return isTemplate;
};

export const isCategoryEdit = (instance: CategoryEdit): instance is CategoryEdit => {
    if (Object.keys(instance).length === 0) return false;

    const templateOptional: CategoryEdit = {
        name: "templateString"
    };

    let isTemplate: boolean = true;
    Object.keys(instance).find(key => {
        // if property does not exists
        if (templateOptional[key as keyof CategorySearch] !== undefined) {
            if (typeof instance[key as keyof CategorySearch] !== typeof templateOptional[key as keyof CategorySearch]) {
                isTemplate = false;
                return true; // break loop
            }

            if (key === "name" && !validator.isAlphanumeric(instance["name"]!, undefined, { ignore: "-_" })) {
                isTemplate = false;
                return true; // break loop
            }

        };

        return false;
    });

    return isTemplate;
};

export const isCategorySearch = (instance: CategorySearch): instance is CategorySearch => {
    if (Object.keys(instance).length === 0) return false;

    const templateOptional: CategorySearch = {
        name: "templateString"
    };

    let isTemplate: boolean = true;
    Object.keys(instance).find(key => {
        if (templateOptional[key as keyof CategorySearch] !== undefined) {
            if (typeof instance[key as keyof CategorySearch] !== typeof templateOptional[key as keyof CategorySearch]) {
                isTemplate = false;
                return true; // break loop
            }

            if (key === "name" && !validator.isAlphanumeric(instance["name"]!, undefined, { ignore: "-_" })) {
                isTemplate = false;
                return true; // break loop
            }

        };

        return false;
    });

    return isTemplate;
};