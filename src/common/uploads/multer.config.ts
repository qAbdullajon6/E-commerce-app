import { diskStorage } from "multer";
import { extname } from "path";

export const multerConfig = {
    storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
            const uniqueName = Date.now() + "-" + extname(file.originalname)
            cb(null, uniqueName)
        }
    }),
    fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype.match(/image\/(jpg|jpeg|png|gif|webp)/)) {
            cb(null, true)
        } else {
            cb(null, false)
        }
    },
    limits: { fileSize: 2 * 1024 * 1024 }
}