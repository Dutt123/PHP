import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Location } from "../models/Location";

@Entity("pincodes")
export class Pincode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pincode: number;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  warehouse: string;

  @ManyToOne(() => Location, (location) => location.pincodes)
  @JoinColumn({ name: "warehouse", referencedColumnName: "warehouse" })
  location: Location;

  @Column()
  serviceable: boolean;

  @Column()
  delivery_days: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;
}
