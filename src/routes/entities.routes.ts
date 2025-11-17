// src/routes/entities.routes.ts
import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { EntityModel } from '../entities/EntityModel';
import { Archetype } from '../entities/Archetype';

export const entitiesRouter = Router();

// GET /entities
entitiesRouter.get('/', async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(EntityModel);

    const { archetypeSlug, status, page = '1', pageSize = '20' } = req.query;

    const pageNum = Number(page);
    const sizeNum = Number(pageSize);

    const qb = repo
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.archetype', 'a')
      .orderBy('e.created_at', 'DESC')
      .skip((pageNum - 1) * sizeNum)
      .take(sizeNum);

    if (status) {
      qb.andWhere('e.status = :status', { status });
    }

    if (archetypeSlug) {
      qb.andWhere('a.slug = :slug', { slug: archetypeSlug });
    }

    const [items, total] = await qb.getManyAndCount();

    return res.json({
      items,
      page: pageNum,
      pageSize: sizeNum,
      total,
    });
  } catch (err) {
    console.error('Error listing entities', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /entities
entitiesRouter.post('/', async (req, res) => {
  try {
    const { archetypeId, title, status = 'draft' } = req.body;

    const repo = AppDataSource.getRepository(EntityModel);
    const archetypeRepo = AppDataSource.getRepository(Archetype);

    const archetype = await archetypeRepo.findOne({
      where: { id: String(archetypeId) },
    });
    if (!archetype) {
      return res.status(400).json({ message: 'Invalid archetypeId' });
    }

    const now = new Date();

    const entity = repo.create({
      archetypeId: String(archetypeId),
      title,
      status,
      ownerUserId: null,
      uuid: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    });

    const saved = await repo.save(entity);
    return res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating entity', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /entities/:id
entitiesRouter.get('/:id', async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(EntityModel);
    const entity = await repo.findOne({
      where: { id: req.params.id },
      relations: ['archetype', 'attributes'],
    });

    if (!entity) {
      return res.status(404).json({ message: 'Not found' });
    }

    return res.json(entity);
  } catch (err) {
    console.error('Error fetching entity', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// PATCH /entities/:id
entitiesRouter.patch('/:id', async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(EntityModel);
    const entity = await repo.findOne({
      where: { id: req.params.id },
    });

    if (!entity) {
      return res.status(404).json({ message: 'Not found' });
    }

    const { title, status } = req.body;

    if (title !== undefined) entity.title = title;
    if (status !== undefined) entity.status = status;

    entity.updatedAt = new Date();

    const saved = await repo.save(entity);
    return res.json(saved);
  } catch (err) {
    console.error('Error updating entity', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
