import multer from "multer"

const ALLOWED = ["image/jpeg", "image/png", "image/webp"]
const storage = multer.memoryStorage();

const upload = multer({
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
export default upload