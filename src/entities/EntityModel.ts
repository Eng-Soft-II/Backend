// src/entities/EntityModel.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Archetype } from './Archetype';
import { EntityAttribute } from './EntityAttribute';

@Entity('entities')
export class EntityModel {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ type: 'uuid' })
  uuid!: string;

  @Column({ name: 'archetype_id', type: 'bigint' })
  archetypeId!: string;

  @ManyToOne(() => Archetype, (a) => a.entities)
  @JoinColumn({ name: 'archetype_id' })
  archetype!: Archetype;

  @Column({ type: 'text' })
  title!: string;

  @Column({ type: 'text' })
  status!: string;

  @Column({ name: 'owner_user_id', type: 'bigint', nullable: true })
  ownerUserId!: string | null;

  @Column({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany(() => EntityAttribute, (ea) => ea.entity)
  attributes!: EntityAttribute[];
}
