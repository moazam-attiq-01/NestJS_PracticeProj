import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadFile(
    file: Express.Multer.File,
    folder: string,
    publicId?: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            public_id: publicId,
            overwrite: true,
            resource_type: 'auto',
          },
          (error, result: UploadApiResponse) =>
            error ? reject(error) : resolve(result),
        )
        .end(file.buffer);
    });
  }

  async deleteFile(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
  }
}
