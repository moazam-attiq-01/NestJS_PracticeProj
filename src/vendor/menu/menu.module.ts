// src/menu/menu.module.ts
import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { DbModule } from '../../db/db.module'; // your DB provider module
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [DbModule, CloudinaryModule], // <- import here
  providers: [MenuService],
  controllers: [MenuController],
})
export class MenuModule {}
