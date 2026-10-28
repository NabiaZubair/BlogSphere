import cloudinary from "../config/cloudinary.js";

export const uploadImage = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "blog/covers",
                resource_type: "image",
                transformation: [
                    { width: 1600, crop: "limit" },
                    { quality: "auto", fetch_format: "auto" },
                ],
            },
            (error, result) => {
                if (error) {
                    return reject(error)
                }
                resolve({ url: result.secure_url, publicId: result.public_id })
            }
        )
        stream.end(buffer)
    });
}
export const deleteImage = async (publicId) => {
    if (!publicId) return;
    try {
        await cloudinary.uploader.destroy(publicId)
    } catch (error) {
        console.error("cloudinary delete failed:", publicId, error.message
        )
    }
}
