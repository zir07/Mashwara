# Quick Setup Instructions

## For Windows Users

### Automated Setup (Recommended)

1. **Install Docker Desktop:**
   - Download from: https://www.docker.com/products/docker-desktop/
   - Install and restart your computer
   - Start Docker Desktop

2. **Open PowerShell** in your project directory:
   ```powershell
   cd "E:\Mashwara App\mashwara"
   ```

3. **Run the setup script:**
   ```powershell
   .\setup-database.ps1
   ```

   If you get an error about script execution, run this first:
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   .\setup-database.ps1
   ```

4. **When prompted for migration name**, type: `init`

### Manual Setup

If you prefer to run commands manually, follow these steps:

```powershell
# 1. Start PostgreSQL
docker compose up -d

# 2. Generate Prisma Client
npm run prisma:generate

# 3. Run migrations (when prompted, name it "init")
npm run prisma:migrate

# 4. Seed database
npm run prisma:seed

# 5. Open Prisma Studio to view data
npm run prisma:studio
```

## For macOS/Linux Users

```bash
# 1. Start PostgreSQL
docker compose up -d

# 2. Generate Prisma Client
npm run prisma:generate

# 3. Run migrations (when prompted, name it "init")
npm run prisma:migrate

# 4. Seed database
npm run prisma:seed

# 5. Open Prisma Studio to view data
npm run prisma:studio
```

## Verify Setup

### Check Database with Prisma Studio
```powershell
npm run prisma:studio
```
Visit http://localhost:5555 to browse:
- 3 institutions (IBA, NEDUET, KU)
- 8 departments
- 5 users (1 admin + 4 students)
- 10 teachers
- 6 reviews

### Check Database with pgAdmin
1. Open http://localhost:5050
2. Login: `admin@mashwara.local` / `admin`
3. Add server with connection details from `.env`

## Test Credentials

**Admin:**
- Email: `admin@mashwara.pk`
- Password: `password123`

**Students:**
- Email: `ahmed.khan@iba.edu.pk` / Password: `password123`
- Email: `fatima.ali@iba.edu.pk` / Password: `password123`
- Email: `hassan.raza@neduet.edu.pk` / Password: `password123`
- Email: `ayesha.malik@uok.edu.pk` / Password: `password123`

## Troubleshooting

### Port 5432 already in use
Stop local PostgreSQL or change port in `docker-compose.yml` to `5433:5432`

### Docker not starting
- Ensure virtualization is enabled in BIOS
- Try restarting Docker Desktop

### Prisma errors
```powershell
npm run prisma:generate
```

### Reset database (deletes all data)
```powershell
npm run prisma:reset
```

## Detailed Documentation

- **Windows Setup:** [docs/windows-setup-guide.md](docs/windows-setup-guide.md)
- **Database Schema:** [docs/database-schema.md](docs/database-schema.md)
- **Prisma Guide:** [docs/prisma-guide.md](docs/prisma-guide.md)
- **Docker Setup:** [docs/docker-setup.md](docs/docker-setup.md)

## Next Steps

1. Start the API: `nx serve api`
2. Start mobile app: `nx start mobile`
3. Begin Week 2: API development (authentication, CRUD endpoints)
