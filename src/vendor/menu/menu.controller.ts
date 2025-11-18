import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Patch,
  Delete,
  Query,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common'
import { MenuService } from './menu.service'
import { DealDto, ItemDto } from './dto'
import { AuthGuard } from '../auth/auth.guard'
import { Vendor } from '../auth/auth.decorator'
import { UploadInterceptor } from '../../utils/upload.interceptor'

@UseGuards(AuthGuard)
@Controller('vendor/menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('items')
  @UseInterceptors(UploadInterceptor('image', 'items'))
  async createItem(@UploadedFile() file: Express.Multer.File, @Vendor('id') vendorId: number, @Body() data: ItemDto) {
    if (typeof data.available === 'string') {
      data.available = data.available === 'true'
    }
    if (typeof data.discount === 'string') {
      try {
        data.discount = JSON.parse(data.discount)
      } catch {
        data.discount = eval('(' + data.discount + ')')
      }
    }
    
    const item = await this.menuService.createItem(data, file, vendorId)
    return { item }
  }

  @Put('items/:id')
  async updateItem(@Vendor('id') vendorId: number,@Param('id', ParseIntPipe) itemId: number, @Body() data: ItemDto) {
    const response = await this.menuService.updateItem(data, vendorId, itemId)
    return { data: response }
  }

  @Get('items') async getItems(@Vendor('id') vendorId: number) {
    const items = await this.menuService.getItems(vendorId)
    return { items }
  }

  @Delete('items/:id')
  async deleteItem(@Vendor('id') vendorId: number, @Param('id', ParseIntPipe) itemId: number) {
    const result = await this.menuService.deleteItem(vendorId, itemId)
    return { data: result }
  }

  // deal routes
  @Post('deals')
  @UseInterceptors(UploadInterceptor('image', 'deals'))
  async createDeal(@UploadedFile() file: Express.Multer.File, @Vendor('id') vendorId: number,  @Body() data: DealDto) {
    if (typeof data.available === 'string') {
      data.available = data.available === 'true'
    }
    if (typeof data.price === 'string') {
      data.price = Number(data.price)
    }
    const deal = await this.menuService.createDeal(data, file, vendorId)
    
    return { data: deal }
  }

  @Get('deals')
  async getDeals(@Vendor('id') vendorId: number) {
    const deals = await this.menuService.getDeals(vendorId)
    console.log(deals);
    
    return { data: deals }
  }

  @Put('deals')
  updateDeal(@Vendor('id') vendorId: number, @Body() data: DealDto) {
    const result = this.menuService.updateDeal(data, vendorId)
    return { data: result }
  }

  @Delete('deals/:id')
  async deleteDeal(@Vendor('id') vendorId: number, @Param('id', ParseIntPipe) dealId: number) {
    const result = await this.menuService.deleteDeal(vendorId, dealId)

    return { data: result }
  }
}
