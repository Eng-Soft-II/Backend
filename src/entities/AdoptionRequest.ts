// src/entities/AdoptionRequest.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EntityModel } from './EntityModel';
import { AppUser } from './AppUser';

@Entity('adoption_requests')
export class AdoptionRequest {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ name: 'entity_id', type: 'bigint' })
  entityId!: string;

  @Column({ name: 'requester_user_id', type: 'bigint', nullable: true })
  requesterUserId!: string | null;

  @ManyToOne(() => EntityModel)
  @JoinColumn({ name: 'entity_id' })
  entity!: EntityModel;

  @ManyToOne(() => AppUser)
  @JoinColumn({ name: 'requester_user_id' })
  requesterUser!: AppUser | null;

  @Column({ type: 'text' })
  status!: string;

  @Column({ name: 'form_data_json', type: 'jsonb' })
  formDataJson!: unknown;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
