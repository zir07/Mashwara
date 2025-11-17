# Windows Setup Guide - Mashwara Database

This guide will help you set up Docker, PostgreSQL, and seed the database on your Windows PC.

## Prerequisites

Your project location: `E:\Mashwara App\mashwara`

## Step 1: Install Docker Desktop for Windows

### Download and Install

1. **Download Docker Desktop:**
   - Visit: https://www.docker.com/products/docker-desktop/
   - Click "Download for Windows"
   - Download the installer (Docker Desktop Installer.exe)

2. **Run the Installer:**
   - Double-click the installer
   - Follow the installation wizard
   - Check "Use WSL 2 instead of Hyper-V" (recommended)
   - Complete the installation

3. **Restart Your Computer** (if prompted)

4. **Start Docker Desktop:**
   - Launch Docker Desktop from Start Menu
   - Wait for Docker to start (whale icon in system tray)
   - Accept the service agreement

5. **Verify Installation:**
   Open PowerShell or Command Prompt and run:
   ```powershell
   docker --version
   docker compose version
   ```
   You should see version numbers for both.

### Troubleshooting Docker Installation

**If you get WSL 2 errors:**
1. Open PowerShell as Administrator
2. Run: `wsl --install`
3. Restart your computer
4. Start Docker Desktop again

**If Docker won't start:**
- Make sure virtualization is enabled in BIOS
- Check if Hyper-V is enabled in Windows Features

## Step 2: Navigate to Project Directory

Open PowerShell or Command Prompt:

```powershell
cd "E:\Mashwara App\mashwara"
```

## Step 3: Start PostgreSQL with Docker

Run this command:

```powershell
docker compose up -d
```

This will:
- Download PostgreSQL 16 image (first time only)
- Download pgAdmin image (first time only)
- Start both containers in the background

**Verify containers are running:**
```powershell
docker compose ps
```

You should see:
- `mashwara-postgres` - running on port 5432
- `mashwara-pgadmin` - running on port 5050

**View logs (optional):**
```powershell
docker compose logs postgres
```

## Step 4: Install Node Dependencies

If you haven't installed dependencies yet:

```powershell
npm install
```

## Step 5: Generate Prisma Client

```powershell
npm run prisma:generate
```

You should see:
```
✔ Generated Prisma Client
```

## Step 6: Run Database Migration

This creates all the tables in PostgreSQL:

```powershell
npm run prisma:migrate
```

When prompted for migration name, type:
```
init
```

You should see:
```
Your database is now in sync with your schema.
✔ Generated Prisma Client
```

## Step 7: Seed the Database

Populate with test data (Karachi institutions, teachers, students, reviews):

```powershell
npm run prisma:seed
```

You should see output like:
```
🌱 Starting database seed...
🧹 Cleaning existing data...
🏫 Creating institutions...
✅ Created 3 institutions
📚 Creating departments...
✅ Created 8 departments
👥 Creating users...
✅ Created 5 users (1 admin, 4 students)
👨‍🏫 Creating teachers...
✅ Created 10 teachers
⭐ Creating reviews...
✅ Created 6 reviews
📊 Updating teacher ratings...
✅ Updated teacher ratings

✅ Database seeded successfully!
```

## Step 8: Verify Database Setup

### Option 1: Prisma Studio (Recommended)

```powershell
npm run prisma:studio
```

This opens a browser at `http://localhost:5555` where you can:
- Browse all tables
- View seeded data
- See institutions, users, teachers, reviews

### Option 2: pgAdmin Web Interface

1. Open browser: `http://localhost:5050`
2. Login credentials:
   - Email: `admin@mashwara.local`
   - Password: `admin`

3. Add server connection:
   - Right-click "Servers" → "Register" → "Server"
   - General tab:
     - Name: `Mashwara Local`
   - Connection tab:
     - Host: `postgres` (use the container name)
     - Port: `5432`
     - Database: `mashwara_db`
     - Username: `mashwara`
     - Password: `mashwara_dev_password`
   - Click "Save"

4. Browse data:
   - Expand: Servers → Mashwara Local → Databases → mashwara_db → Schemas → public → Tables
   - Right-click any table → "View/Edit Data" → "All Rows"

## Step 9: Test Credentials

You can test these credentials once you build the authentication API:

### Admin Account
- **Email:** `admin@mashwara.pk`
- **Password:** `password123`
- **Role:** ADMIN

### Student Accounts
- **Email:** `ahmed.khan@iba.edu.pk` | **Password:** `password123` | **Institution:** IBA
- **Email:** `fatima.ali@iba.edu.pk` | **Password:** `password123` | **Institution:** IBA
- **Email:** `hassan.raza@neduet.edu.pk` | **Password:** `password123` | **Institution:** NEDUET
- **Email:** `ayesha.malik@uok.edu.pk` | **Password:** `password123` | **Institution:** KU

**Note:** Passwords are hashed with bcrypt in the database. The raw password `password123` is only for testing.

## Step 10: Start the NestJS API (Optional)

Test the API with the database:

```powershell
nx serve api
```

The API should start on `http://localhost:3000` and connect to the database.

Test endpoint:
```powershell
# Using curl (if installed)
curl http://localhost:3000/api

# Or open in browser:
http://localhost:3000/api
```

## Common Issues & Solutions

### Issue: Port 5432 already in use

**Solution:** You might have PostgreSQL already installed locally.

**Option A - Stop local PostgreSQL:**
```powershell
# In Services (services.msc), stop "PostgreSQL" service
```

**Option B - Change Docker port:**
Edit `docker-compose.yml`, line 7:
```yaml
ports:
  - '5433:5432'  # Changed from 5432 to 5433
```

Then update `.env`:
```
DATABASE_URL="postgresql://mashwara:mashwara_dev_password@localhost:5433/mashwara_db?schema=public"
```

### Issue: Docker compose command not found

**Solution:** Use `docker compose` (with space) instead of `docker-compose`:
```powershell
docker compose up -d
```

### Issue: Permission denied errors

**Solution:** Run PowerShell as Administrator

### Issue: Prisma Client errors

**Solution:** Regenerate Prisma Client:
```powershell
npm run prisma:generate
```

### Issue: Migration conflicts

**Solution:** Reset database (WARNING: deletes all data):
```powershell
npm run prisma:reset
```

## Useful Docker Commands

### Stop containers:
```powershell
docker compose down
```

### Stop and remove all data (fresh start):
```powershell
docker compose down -v
```

### Restart containers:
```powershell
docker compose restart
```

### View logs:
```powershell
docker compose logs -f postgres
docker compose logs -f pgadmin
```

### Check running containers:
```powershell
docker ps
```

### Access PostgreSQL CLI directly:
```powershell
docker exec -it mashwara-postgres psql -U mashwara -d mashwara_db
```

## Next Steps

Once database is set up and verified:

1. ✅ Build authentication API (JWT, login, register)
2. ✅ Create teacher CRUD endpoints
3. ✅ Implement review submission and moderation
4. ✅ Build mobile app screens
5. ✅ Connect mobile app to API

## Quick Reference

| Service | URL | Credentials |
|---------|-----|-------------|
| API | http://localhost:3000 | - |
| Prisma Studio | http://localhost:5555 | - |
| pgAdmin | http://localhost:5050 | admin@mashwara.local / admin |
| PostgreSQL | localhost:5432 | mashwara / mashwara_dev_password |

## Environment Variables

Your `.env` file should contain:
```env
DATABASE_URL="postgresql://mashwara:mashwara_dev_password@localhost:5432/mashwara_db?schema=public"
NODE_ENV=development
```

---

**Need Help?**
- Check Docker logs: `docker compose logs`
- Verify Docker is running: `docker ps`
- Check Prisma status: `npm run prisma:migrate status`
