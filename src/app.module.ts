import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './vendor/auth/auth.module'
import { DbModule } from './db/db.module'
import { MenuModule } from './vendor/menu/menu.module'
import { OrdersModule } from './vendor/orders/orders.module'
import { RiderModule } from './vendor/rider/rider.module'
import { VendorModule } from './admin/vendor/vendor.module'
import { ProfileModule } from './vendor/profile/profile.module'
import * as path from 'node:path'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: path.resolve(process.cwd(), '.env') }),
    AuthModule,
    DbModule,
    MenuModule,
    OrdersModule,
    RiderModule,
    VendorModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
