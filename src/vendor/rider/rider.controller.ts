import { Controller, Get, Post, Body, UseGuards, Patch, Delete, Query, BadRequestException } from '@nestjs/common'
import { RiderService } from './rider.service'

import { AuthGuard } from '../auth/auth.guard'
import { Vendor } from '../auth/auth.decorator'
import { RiderDto } from './dto'

@UseGuards(AuthGuard)
@Controller('vendor/riders')
export class RiderController {
  constructor(private readonly ridersService: RiderService) {}

  @Post()
  create(@Vendor('id') vendorId: number, @Body() data: RiderDto) {
    return { data: this.ridersService.createRider(data, vendorId) }
  }

  @Get()
  getAll(@Vendor('id') vendorId: number) {
    return { data: this.ridersService.getRiders(vendorId) }
  }

  @Patch()
  update(@Vendor('id') vendorId: number, @Body() data: RiderDto) {
    if (!data.id) throw new BadRequestException('id is required')
    return { data: this.ridersService.updateRider(data, vendorId) }
  }

  @Delete()
  delete(@Vendor('id') vendorId: number, @Query('id') id: string) {
    if (!id) throw new BadRequestException('id is required')
    return { data: this.ridersService.deleteRider(vendorId, Number(id)) }
  }
}
