import multer from "multer"
import {fileTypeFromBuffer} from "file-type"
const ALLOWED = ["image/jpeg", "image/png", "image/webp"]
const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, files: 1
    },
    fileFilter: (req, file, cb) => {
        if (!ALLOWED.includes(file.mimetype)) {
            const error = new Error(
                "Only JPG, PNG or WebP images are allowed"
            );
            error.status = 400;
            return cb(error)
        }
        cb(null, true)
    }

})

export const verifyImage = async (req, res, next) => {
    try {
        if (!req.file) return next();

        const type = await fileTypeFromBuffer(req.file.buffer);

        if (!type || !ALLOWED.includes(type.mime)) {
            const error = new Error("Only JPG, PNG or WebP images are allowed");
            error.status = 400;
            return next(error);
        }
        next();
    } catch (err) {
        next(err);
    }
};
