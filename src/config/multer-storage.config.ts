import fs from 'fs';
import path from 'path';
import multer from "multer";


const storage = multer.diskStorage({
    destination: (req, _file, cb): void => {
        if (!req.user) return cb(new Error('User not authorized'), "");

        const fullPath = path.resolve(`${__dirname}/public`);

        if (!fs.existsSync(fullPath)) {
            fs.mkdir(fullPath, { recursive: true }, err => {
                if (err) cb(err, fullPath);
            });
        }

        cb(null, fullPath);
    },
    filename: (req, file, cb): void => {
        if (!req.user)  return cb(new Error('User not authorized'), "");

        try {
            return cb(null, `${Date.now()}-${file.originalname}`);
        } catch (error: unknown) {
            throw error;
        }
    }
});

export default storage;
