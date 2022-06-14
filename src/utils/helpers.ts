// import fs from "fs";
import path from 'path';
import { FileFilterCallback } from 'multer';

// const writeFileToFS = (file: ArrayBufferView): void => {
//     // fs.writeFileSync(`${ __dirname }`, file)
// };

export const checkAllowedFiles = (file: Express.Multer.File, cb: FileFilterCallback): void => {
    // allowed ext
    const whitelist = /jpeg|jpg|png/;

    // check extensions
    const extension = path.extname(file.originalname).toLowerCase();
    const isAllowed = whitelist.test(extension);

    return cb(null, isAllowed);
};
