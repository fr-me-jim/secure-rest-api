import validator from 'validator';
import {  
    UserEdit,
    UserLogin,
    UserCreate,
    UserPrivileges,
    UserEditProfile,
    UserCreateOptionals
} from "../interfaces/User.interface";

export const isValidPrivilege = (privileges: UserPrivileges): boolean => {
    if (privileges! >= 0 || privileges! <= 2) return true;

    return false;
};

export const isUserLogin = (instance: UserLogin): instance is UserLogin => {
    if (Object.keys(instance).length === 0) return false;

    const mandatoryTemplate: number = 2;
    const template: UserLogin = {
        email: "example@gmail.com",
        password: "templateString"
    };

    let isTemplate: boolean = true;
    let mandatoryAmount: number = 0;
    Object.keys(instance).find(key => {
        // if property does not exists
        if (template[key as keyof UserLogin] === undefined) {
            isTemplate = false;
            return true; // break loop
        }

        mandatoryAmount++;

        if (typeof instance[key as keyof UserLogin] !== typeof template[key as keyof UserLogin]) {
            isTemplate = false;
            return true; // break loop
        }

        if (key === "email" && !validator.isEmail(instance["email"])) {
            isTemplate = false;
            return true; // break loop
        }

        return false;
    });

    if (mandatoryAmount !== mandatoryTemplate) return false;

    return isTemplate;
};

export const isUserCreate = (instance: UserCreate): instance is UserCreate => {
    if (Object.keys(instance).length === 0) return false;

    const mandatoryTemplate: number = 4;
    const template: UserCreate = {
        email: "example@gmail.com",
        password: "templateString",
        firstName: "templateString",
        secondName: "templateString" 
    };

    const templateOptional: UserCreateOptionals = {
        privileges: 0
    };

    let isTemplate: boolean = true;
    let mandatoryAmount: number = 0;
    Object.keys(instance).find( key => {
        // if property does not exists
        if (template[key as keyof UserCreate] === undefined && templateOptional[key as keyof UserCreateOptionals] === undefined) {
            isTemplate = false;
            return true; // break loop
        };

        if (template[key as keyof UserCreate] !== undefined) {
            mandatoryAmount++;
            if (typeof instance[key as keyof UserCreate] !== typeof template[key as keyof UserCreate]) {
                isTemplate = false;
                return true; // break loop
            }

            // if email property not email-like 
            if (key === "email" && !validator.isEmail(instance["email"])) {
                isTemplate = false;
                return true; // break loop
            }

            return false;
        };

        if (templateOptional[key as keyof UserCreateOptionals] !== undefined) {
            if (typeof instance[key as keyof UserCreate] !== typeof templateOptional[key as keyof UserCreateOptionals]) {
                isTemplate = false;
                return true; // break loop
            };

            // if privileges property not allowed values 
            if (key === "privileges" && !isValidPrivilege(instance["privileges"]!)) {
                isTemplate = false;
                return true; // break loop
            };

        };

        return false;
    });

    if (mandatoryAmount !== mandatoryTemplate) return false;

    return isTemplate;
};

export const isUserEdit = (instance: UserEdit): instance is UserEdit => {
    if (Object.keys(instance).length === 0) return false;

    const templateOptional: UserEdit = {
        email: "example@gmail.com",
        firstName: "templateString",
        secondName: "templateString",
        privileges: 0
    };

    let isTemplate: boolean = true;
    Object.keys(instance).find(key => {
        // if property does not exists
        if (templateOptional[key as keyof UserEdit] === undefined) {
            isTemplate = false;
            return true; // break loop
        };

        if (typeof instance[key as keyof UserEdit] !== typeof templateOptional[key as keyof UserEdit]) {
            isTemplate = false;
            return true; // break loop
        }

        if (key === "email" && !validator.isEmail(instance["email"]!)) {
            isTemplate = false;
            return true; // break loop
        }

        // if privileges property not allowed values
        if (key === "privileges" && !isValidPrivilege(instance["privileges"]!)) {
            isTemplate = false;
            return true; // break loop
        };

        return false;
    });

    return isTemplate;
};

export const isUserEditProfile = (instance: UserEditProfile): instance is UserEditProfile => {
    if (Object.keys(instance).length === 0) return false;

    const templateOptional: UserEditProfile = {
        email: "example@gmail.com",
        firstName: "templateString",
        secondName: "templateString",
    };

    let isTemplate: boolean = true;
    Object.keys(instance).find(key => {
        // if property does not exists
        if (templateOptional[key as keyof UserEditProfile] === undefined) {
            isTemplate = false;
            return true; // break loop
        };

        if (typeof instance[key as keyof UserEditProfile] !== typeof templateOptional[key as keyof UserEditProfile]) {
            isTemplate = false;
            return true; // break loop
        }

        if (key === "email" && !validator.isEmail(instance["email"]!)) {
            isTemplate = false;
            return true; // break loop
        }

        return false;
    });

    return isTemplate;
};