import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Patch,
  Delete,
  BadRequestException,
  Param,
  Put,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { RiderService } from "./rider.service";

import { AuthGuard } from "../auth/auth.guard";
import { Vendor } from "../auth/auth.decorator";
import { RiderDto } from "./dto";
import { UploadInterceptor } from "src/utils/upload.interceptor";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";

@UseGuards(AuthGuard)
@Controller("vendor/riders")
export class RiderController {
  constructor(
    private readonly ridersService: RiderService,
    private readonly cloudinary: CloudinaryService
  ) {}

  @Post()
  @UseInterceptors(UploadInterceptor("image", "riders"))
  async create(
    @Vendor("id") vendorId: number,
    @Body() data: RiderDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    let imageUrl = "";
    let cloudId = "";

    if (file) {
      try {
        const uploaded = await this.cloudinary.uploadFile(
          file,
          `riders`,
          `rider_${vendorId}_${Date.now()}`
        );
        imageUrl = uploaded.secure_url;
        cloudId = uploaded.public_id;
      } catch (error) {
        throw new BadRequestException("File upload Failed: ", error.message);
      }
    }
    const riderData = await this.ridersService.createRider(data, vendorId, imageUrl, cloudId);
    return { data: riderData };
  }

  @Get()
  async getAll(@Vendor("id") vendorId: number) {
    const riders = await this.ridersService.getRiders(vendorId);
    return { data: riders };
  }

  @Put("/:id")
  @UseInterceptors(UploadInterceptor("image", "riders"))
  async update(
    @Vendor("id") vendorId: number,
    @Param("id") riderId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() data: RiderDto
  ) {
    if (!riderId) throw new BadRequestException("id is required");

    let imageUrl = "";
    let cloudId = "";

    if (file) {
      const uploaded = await this.cloudinary.uploadFile(
        file,
        `riders`,
        `rider_${vendorId}_${riderId}_${Date.now()}`
      );
      imageUrl = uploaded.secure_url;
      cloudId = uploaded.public_id;
    }

    const updatedRider = await this.ridersService.updateRider(
      data,
      Number(riderId),
      vendorId,
      imageUrl,
      cloudId
    );
    return { data: updatedRider };
  }

  @Delete("/:id")
  async delete(@Vendor("id") vendorId: number, @Param("id") id: string) {
    if (!id) throw new BadRequestException("id is required");

    const deletedData = await this.ridersService.deleteRider(
      vendorId,
      Number(id)
    );
    return { data: deletedData };
  }
}
