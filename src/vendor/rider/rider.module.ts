import { Module } from '@nestjs/common'
import { RiderService } from './rider.service'
import { RiderController } from './rider.controller'
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module'

@Module({
    imports: [CloudinaryModule], // <- import here
  controllers: [RiderController],
  providers: [RiderService],
})
export class RiderModule {}
