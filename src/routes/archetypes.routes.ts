// src/routes/archetypes.routes.ts
import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Archetype } from '../entities/Archetype';

export const archetypesRouter = Router();

// GET /archetypes
archetypesRouter.get('/', async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Archetype);
    const items = await repo.find();
    return res.json(items);
  } catch (err) {
    console.error('Error listing archetypes', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /archetypes
archetypesRouter.post('/', async (req, res) => {
  try {
    const { name, slug, description } = req.body;

    const repo = AppDataSource.getRepository(Archetype);

    const existing = await repo.findOne({ where: { slug } });
    if (existing) {
      return res.status(400).json({ message: 'Slug already in use' });
    }

    const archetype = repo.create({
      name,
      slug,
      description,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const saved = await repo.save(archetype);
    return res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating archetype', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /archetypes/:id
archetypesRouter.get('/:id', async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Archetype);
    const archetype = await repo.findOne({
      where: { id: req.params.id },
    });

    if (!archetype) {
      return res.status(404).json({ message: 'Not found' });
    }

    return res.json(archetype);
  } catch (err) {
    console.error('Error fetching archetype', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// PATCH /archetypes/:id
archetypesRouter.patch('/:id', async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Archetype);
    const archetype = await repo.findOne({
      where: { id: req.params.id },
    });

    if (!archetype) {
      return res.status(404).json({ message: 'Not found' });
    }

    const { name, description, isActive } = req.body;

    if (name !== undefined) archetype.name = name;
    if (description !== undefined) archetype.description = description;
    if (isActive !== undefined) archetype.isActive = isActive;

    archetype.updatedAt = new Date();

    const saved = await repo.save(archetype);
    return res.json(saved);
  } catch (err) {
    console.error('Error updating archetype', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
