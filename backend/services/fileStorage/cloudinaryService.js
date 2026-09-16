const cloudinary = require("../../config/cloudinary");

const uploadFile = (fileBuffer, originalName) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "raw",
                folder: "devmentor-ai/project-documents",
                public_id: `${Date.now()}-${originalName}`,
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                    resourceType: result.resource_type,
                });
            }
        );

        uploadStream.end(fileBuffer);
    });
};

const deleteFile = async (publicId) => {
    return cloudinary.uploader.destroy(publicId, {
        resource_type: "raw",
    });
};

module.exports = {
    uploadFile,
    deleteFile,
};