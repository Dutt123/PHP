import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Pincode } from "../models/Pincode";

@Entity("locations")
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  location_id: string;

  @Column({ unique: true })
  warehouse: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Pincode, (pincode) => pincode.location)
  @JoinColumn({ referencedColumnName: "warehouse" })
  pincodes: Pincode[];
}
