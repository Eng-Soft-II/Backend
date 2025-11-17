// src/entities/EntityAttribute.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EntityModel } from './EntityModel';

@Entity('entity_attributes')
export class EntityAttribute {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ name: 'entity_id', type: 'bigint' })
  entityId!: string;

  @Column({ name: 'attribute_id', type: 'bigint' })
  attributeId!: string;

  @ManyToOne(() => EntityModel, (e) => e.attributes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'entity_id' })
  entity!: EntityModel;

  @Column({ name: 'value_text', type: 'text', nullable: true })
  valueText?: string;

  @Column({ name: 'value_number', type: 'numeric', nullable: true })
  valueNumber?: string;

  @Column({ name: 'value_bool', type: 'boolean', nullable: true })
  valueBool?: boolean;

  @Column({ name: 'value_date', type: 'date', nullable: true })
  valueDate?: string;

  @Column({ name: 'value_json', type: 'jsonb', nullable: true })
  valueJson?: unknown;

  @Column({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
