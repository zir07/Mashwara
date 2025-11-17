# Prisma Setup & Migration Guide

## Overview
This guide covers database setup, migrations, and seeding for the Mashwara project using Prisma ORM.

## Prerequisites
1. Docker and Docker Compose installed
2. Node.js and npm installed
3. `.env` file configured with `DATABASE_URL`

## Quick Start

### 1. Start the Database
```bash
# Start PostgreSQL and pgAdmin
docker compose up -d

# Verify containers are running
docker compose ps
```

### 2. Generate Prisma Client
```bash
npm run prisma:generate
```

### 3. Run Migrations
```bash
npm run prisma:migrate
```

When prompted, name your migration (e.g., "init" for the first migration).

### 4. Seed the Database
```bash
npm run prisma:seed
```

This will populate the database with:
- 3 Karachi institutions (IBA, NEDUET, KU)
- 8 departments
- 5 users (1 admin, 4 students)
- 10 teachers
- 6 sample reviews (approved, pending, and rejected)

## Available Scripts

### From Project Root

```bash
# Generate Prisma Client (after schema changes)
npm run prisma:generate

# Create and run a migration
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Seed database with test data
npm run prisma:seed

# Reset database (WARNING: deletes all data)
npm run prisma:reset
```

### From apps/api Directory

```bash
cd apps/api

# Generate Prisma Client
npx prisma generate

# Create a new migration
npx prisma migrate dev --name <migration-name>

# Apply migrations in production
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio

# Seed database
npx prisma db seed

# Reset database
npx prisma migrate reset

# Format Prisma schema file
npx prisma format
```

## Migration Workflow

### Creating a New Migration

1. **Modify the schema** in `apps/api/prisma/schema.prisma`

2. **Generate migration**
   ```bash
   npm run prisma:migrate
   # OR
   cd apps/api && npx prisma migrate dev --name <descriptive-name>
   ```

3. **Verify migration** was created in `apps/api/prisma/migrations/`

4. **Commit migration** files to Git

### Example: Adding a New Field

```prisma
// apps/api/prisma/schema.prisma

model Teacher {
  // ... existing fields
  bio String? // Add new optional bio field
}
```

```bash
cd apps/api
npx prisma migrate dev --name add_teacher_bio
```

## Seeding Data

### Test Credentials (from seed.ts)

**Admin:**
- Email: `admin@mashwara.pk`
- Password: `password123`

**Students:**
- Email: `ahmed.khan@iba.edu.pk` | Password: `password123`
- Email: `fatima.ali@iba.edu.pk` | Password: `password123`
- Email: `hassan.raza@neduet.edu.pk` | Password: `password123`
- Email: `ayesha.malik@uok.edu.pk` | Password: `password123`

### Customizing Seed Data

Edit `apps/api/prisma/seed.ts` to add or modify seed data, then run:

```bash
npm run prisma:seed
```

## Prisma Studio

Prisma Studio is a visual database browser:

```bash
npm run prisma:studio
```

Open http://localhost:5555 to:
- Browse all tables
- Edit data
- Run queries
- View relationships

## Troubleshooting

### Database Connection Issues

**Check if PostgreSQL is running:**
```bash
docker compose ps
```

**View PostgreSQL logs:**
```bash
docker compose logs postgres
```

**Verify DATABASE_URL in .env:**
```
DATABASE_URL="postgresql://mashwara:mashwara_dev_password@localhost:5432/mashwara_db?schema=public"
```

### Migration Conflicts

**Reset database (WARNING: deletes all data):**
```bash
npm run prisma:reset
```

**Or manually:**
```bash
cd apps/api
npx prisma migrate reset
```

### Prisma Client Not Found

**Regenerate Prisma Client:**
```bash
npm run prisma:generate
```

### Seed Script Errors

**Check seed file:**
```bash
cd apps/api
npx ts-node prisma/seed.ts
```

## Production Deployment

### 1. Environment Variables
Set `DATABASE_URL` in production environment.

### 2. Run Migrations
```bash
cd apps/api
npx prisma migrate deploy
```

**Note:** Use `migrate deploy` (not `migrate dev`) in production. This applies pending migrations without prompting for input.

### 3. Generate Prisma Client
```bash
cd apps/api
npx prisma generate
```

### 4. Optional: Seed Production Data
Only if you want initial data in production:
```bash
cd apps/api
npx prisma db seed
```

## Schema Overview

### Key Models
- **Institution**: Universities, colleges, schools in Karachi
- **Department**: Departments within institutions
- **User**: Students and admins
- **Teacher**: Teachers/professors
- **Review**: Student reviews with moderation workflow
- **ReviewFlag**: Flagged reviews for admin review

### Important Constraints
- One review per student per teacher (`@@unique([userId, teacherId])`)
- Only approved reviews count toward teacher ratings
- All reviews default to PENDING status

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Database Schema Documentation](./database-schema.md)
