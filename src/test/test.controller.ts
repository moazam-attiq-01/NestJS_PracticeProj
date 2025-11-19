import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UploadInterceptor } from 'src/utils/upload.interceptor';

@Controller('test')
export class TestController {
  constructor(private readonly cloudinary: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(UploadInterceptor('file', 'test'))
  async uploadTest(@UploadedFile() file: Express.Multer.File) {
    if (!file) return { message: 'No file uploaded' };

    try {
      const uploaded = await this.cloudinary.uploadFile(file, 'test', `test_${Date.now()}`);
      return {
        message: 'Upload successful',
        url: uploaded.secure_url,
        cloudId: uploaded.public_id,
      };
    } catch (err) {
      return { message: 'Upload failed', error: err.message };
    }
  }
}
