# Prisma Configuration

This directory contains the Prisma ORM configuration for the Mashwara API.

## Files

- **schema.prisma**: Database schema definition
- **seed.ts**: Database seeding script with test data
- **migrations/**: Migration history (created after running migrations)

## Initial Setup

After cloning the repository, follow these steps:

### 1. Start the Database

```bash
# From project root
docker compose up -d
```

### 2. Generate Prisma Client

```bash
# From project root
npm run prisma:generate

# OR from apps/api
npx prisma generate
```

### 3. Create and Apply Initial Migration

```bash
# From project root
npm run prisma:migrate

# OR from apps/api
npx prisma migrate dev --name init
```

When prompted, enter a migration name like "init" or "initial_schema".

This will:
- Create the `migrations/` directory
- Generate SQL migration files
- Apply the migration to your database
- Create all tables, indexes, and constraints

### 4. Seed the Database

```bash
# From project root
npm run prisma:seed

# OR from apps/api
npx prisma db seed
```

## What Gets Created

### Institutions (3)
- Institute of Business Administration (IBA)
- NED University of Engineering and Technology (NEDUET)
- University of Karachi (KU)

### Departments (8)
- IBA: Computer Science, Business Administration, Economics
- NEDUET: Computer Science, Electrical Engineering, Mechanical Engineering
- KU: Computer Science, Mathematics

### Users (5)
- 1 Admin: admin@mashwara.pk
- 4 Students from different institutions
- All passwords: `password123` (hashed with bcrypt)

### Teachers (10)
- Distributed across institutions and departments
- With realistic Pakistani names and titles (Dr., Professor, Engr.)

### Reviews (6)
- 3 Approved reviews (contributing to teacher ratings)
- 2 Pending reviews (awaiting moderation)
- 1 Rejected review (with moderation notes)

## Making Schema Changes

1. Edit `schema.prisma`
2. Run migration:
   ```bash
   npx prisma migrate dev --name descriptive_name
   ```
3. Commit the migration files to Git

## Useful Commands

```bash
# Open Prisma Studio (visual database editor)
npx prisma studio

# Format schema file
npx prisma format

# Validate schema
npx prisma validate

# View migration status
npx prisma migrate status

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Schema Overview

```
Institution (1) -> (Many) Department
Institution (1) -> (Many) Teacher
Institution (1) -> (Many) User

Department (1) -> (Many) Teacher

User (1) -> (Many) Review (as author)
Teacher (1) -> (Many) Review

Review (1) -> (Many) ReviewFlag
```

## Environment Variables Required

```env
DATABASE_URL="postgresql://mashwara:mashwara_dev_password@localhost:5432/mashwara_db?schema=public"
```

## Next Steps After Setup

1. Test the API endpoints with seeded data
2. Verify authentication with test credentials
3. Test review creation and moderation workflow
4. Check teacher rating calculations

For more details, see [Prisma Guide](../../../docs/prisma-guide.md)
