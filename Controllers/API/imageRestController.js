const multer = require('multer');
const path = require('path');
const fs = require('fs');
const imageService = require('../../Service/imageUploadService'); 

// Configure multer storage for multiple files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../../public/uploads/');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});


const upload = multer({ storage }).array('images', 5); // limit to 5

/**
 * Process uploaded images and log them to DB
 * @param {*} req
 * @param {*} res
 */
async function processUpload(req, res) {
    try {
        const usuario_carga = req.user?.id;
        if (!usuario_carga) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized: user ID not found in token'
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'No images uploaded'
            });
        }

        
        for (const file of req.files) {
            const logResult = await imageService.uploadedImageLog({
                name: file.filename,
                usuario_carga
            });

            if (!logResult.status) {
                console.error(`Failed to log image ${file.filename}`);
            }
        }

        return res.status(200).json({
            status: 'success',
            message: 'Images uploaded and logged successfully',
            files: req.files.map(f => f.filename)
        });

    } catch (err) {
        console.error("Image upload error:", err);
        return res.status(500).json({
            status: 'error',
            message: 'Server error during image upload'
        });
    }
}

async function getUserProfileImage(req, res) {
    try {
        const {userId} = req.params;

        if(!userId) {
            return res.status(400).json({
                status: "error",
                message: "ID de usuario requerido"
            });
        }

        const result = await imageService.getUserProfileImage(userId);
        if(result.getStatus() && result.getRows().length > 0) {
            const imageName = result.getRows()[0].nombreImagen;

            return res.status(200).json({
                status: "success",
                imageName: imageName,
                imageUrl: `/uploads/${imageName}`
            });
        } else {
            return res.status(404).json({
                status: "error",
                message: "No se encontro imagen de perfil"
            });
        }
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: err.message
        });
    }
}


module.exports = {
    upload,
    processUpload,
    getUserProfileImage
};