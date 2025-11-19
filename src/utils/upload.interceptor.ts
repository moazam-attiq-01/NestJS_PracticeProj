import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';

/**
 * UploadInterceptor for memory storage with folder name
 * @param fieldName Name of the field in FormData
 * @param folder Folder name to organize files (used for naming or Cloudinary)
 */
export function UploadInterceptor(fieldName: string, folder: string) {
  return FileInterceptor(fieldName, {
    storage: multer.memoryStorage(), // Keep in memory for Cloudinary
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
    // Optional: attach folder info to file for later use in Cloudinary
    // You can access it via `file.folder` in controller
    preservePath: true,
  });
}
