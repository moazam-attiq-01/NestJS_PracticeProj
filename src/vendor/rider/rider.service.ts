import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { DB_CONNECTION } from "../../db/db.module";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { RiderDto } from "./dto";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";

@Injectable()
export class RiderService {
  constructor(
    @Inject(DB_CONNECTION) private db: PostgresJsDatabase<typeof schema>,
    private readonly cloudinary: CloudinaryService
  ) {}

  async createRider(
    data: RiderDto,
    vendorId: number,
    imageUrl: string,
    cloudId: string
  ) {
    const [insertedRider] = await this.db
      .insert(schema.rider)
      .values({
        username: data.username,
        email: data.email,
        password: data.password,
        phone: data.phone,
        available: data.available ?? true,
        status: data.status ?? 1,
        vendor_id: vendorId,
        image: imageUrl ?? null,
        cloud_id: cloudId ?? null,
      })
      .returning({
        id: schema.rider.id,
        username: schema.rider.username,
        email: schema.rider.email,
        phone: schema.rider.phone,
        available: schema.rider.available,
        status: schema.rider.status,
        image: schema.rider.image,
      });

    return insertedRider;
  }

  async getRiders(vendorId: number) {
    const riders = await this.db
      .select()
      .from(schema.rider)
      .where(eq(schema.rider.vendor_id, vendorId));
    return riders;
  }

  async updateRider(
    data: RiderDto,
    riderId: number,
    vendorId: number,
    imageUrl?: string,
    cloudId?: string
  ) {
    const [r] = await this.db
      .select()
      .from(schema.rider)
      .where(
        and(eq(schema.rider.id, riderId), eq(schema.rider.vendor_id, vendorId))
      );

    if (!r) {
      throw new BadRequestException("Rider not found or not owned by vendor");
    }

    if (imageUrl !== "" && r.cloud_id) {
      await this.cloudinary.deleteFile(r.cloud_id);
    }

    const updatedRider = await this.db
      .update(schema.rider)
      .set({
        username: data.username ?? r.username,
        email: data.email ?? r.email,
        password: data.password ?? r.password,
        phone: data.phone ?? r.phone,
        available: data.available ?? r.available,
        status: data.status ?? r.status,
        image: imageUrl !== '' ? imageUrl : r.image,
        cloud_id: cloudId !== '' ? cloudId : r.cloud_id,
      })
      .where(eq(schema.rider.id, riderId))
      .returning({
        id: schema.rider.id,
        username: schema.rider.username,
        email: schema.rider.email,
        phone: schema.rider.phone,
        available: schema.rider.available,
        status: schema.rider.status,
        image: schema.rider.image,
      });

    return updatedRider[0];
  }

  async deleteRider(vendorId: number, riderId: number) {
    const [riderToBeDeleted] = await this.db
      .select()
      .from(schema.rider)
      .where(and(eq(schema.rider.id, riderId), eq(schema.rider.vendor_id, vendorId)))

    if (!riderToBeDeleted) throw new BadRequestException('Rider not found or not owned by vendor')

    if (riderToBeDeleted.cloud_id) {
      await this.cloudinary.deleteFile(riderToBeDeleted.cloud_id)
    }

    await this.db
      .delete(schema.rider)
      .where(
        and(eq(schema.rider.vendor_id, vendorId), eq(schema.rider.id, riderId))
      );

    return { message: "Rider deleted successfully!" };
  }
}
