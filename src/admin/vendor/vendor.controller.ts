import { Controller, Post, Body, Put, Param, Delete, ParseIntPipe } from '@nestjs/common'
import { VendorService } from './vendor.service'
import { CreateVendorDto, UpdateVendorDto } from './dto'

@Controller('admin/vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  // CREATE VENDOR
  @Post()
  createVendor(@Body() dto: CreateVendorDto) {
    return this.vendorService.createVendor(dto)
  }

  // UPDATE VENDOR (NO PASSWORD ALLOWED)
  @Put(':id')
  updateVendor(@Param('id', ParseIntPipe) vendorId: number, @Body() dto: UpdateVendorDto) {
    return this.vendorService.updateVendor(vendorId, dto)
  }

  // DELETE VENDOR
  @Delete(':id')
  deleteVendor(@Param('id', ParseIntPipe) vendorId: number) {
    return this.vendorService.deleteVendor(vendorId)
  }
}
