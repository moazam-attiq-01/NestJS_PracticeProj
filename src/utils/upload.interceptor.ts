import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { join, extname } from 'path'
import * as fs from 'fs'

/**
 * Reusable UploadInterceptor
 * @param fieldName The field name in FormData ('image', 'avatar', etc.)
 * @param folder Folder inside /uploads/ to store the files
 */
export function UploadInterceptor(fieldName: string, folder: string) {
  return FileInterceptor(fieldName, {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = join(__dirname, `../../uploads/${folder}`)
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true })
        }
        cb(null, uploadPath)
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, uniqueSuffix + extname(file.originalname))
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false)
      }
      cb(null, true)
    },
  })
}
