import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { AuthGuard } from "../auth/auth.guard";
import { Vendor } from "../auth/auth.decorator";
import { CategoryDto } from "./dto";
import { UploadInterceptor } from "../../utils/upload.interceptor";

@UseGuards(AuthGuard)
@Controller("vendor/profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get("category")
  getCategories(@Vendor("id") id: number) {
    return this.profileService.getCategories(id);
  }

  @Post("category")
  @UseInterceptors(UploadInterceptor("image", "categories"))
  addCategory(
    @Vendor("id") id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() data: CategoryDto
  ) {
    return this.profileService.addCategory(id, data, file);
  }

  @Put("category/:id")
  @UseInterceptors(UploadInterceptor("image", "categories"))
  updateCategory(
    @Vendor("id") id: number,
    @Param("id", ParseIntPipe) categoryId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() data: CategoryDto
  ) {
    return this.profileService.updateCategory(id, categoryId, file);
  }
}
