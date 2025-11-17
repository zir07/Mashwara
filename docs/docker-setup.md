# Docker Setup Guide

## Prerequisites
- Docker installed on your system
- Docker Compose installed

## Starting the Database

### 1. Start PostgreSQL and pgAdmin
```bash
docker-compose up -d
```

### 2. Verify containers are running
```bash
docker-compose ps
```

You should see:
- `mashwara-postgres` on port 5432
- `mashwara-pgadmin` on port 5050

### 3. Check PostgreSQL logs
```bash
docker-compose logs postgres
```

## Accessing the Database

### Via Command Line (psql)
```bash
docker exec -it mashwara-postgres psql -U mashwara -d mashwara_db
```

### Via pgAdmin (Web UI)
1. Open browser: http://localhost:5050
2. Login with credentials from `.env`:
   - Email: `admin@mashwara.local`
   - Password: `admin`

3. Add server connection:
   - Host: `postgres` (container name)
   - Port: `5432`
   - Database: `mashwara_db`
   - Username: `mashwara`
   - Password: `mashwara_dev_password`

### Via Application (Connection String)
```
DATABASE_URL="postgresql://mashwara:mashwara_dev_password@localhost:5432/mashwara_db?schema=public"
```

## Useful Commands

### Stop containers
```bash
docker-compose down
```

### Stop and remove volumes (WARNING: deletes all data)
```bash
docker-compose down -v
```

### View logs
```bash
docker-compose logs -f postgres
docker-compose logs -f pgadmin
```

### Restart containers
```bash
docker-compose restart
```

## Troubleshooting

### Port 5432 already in use
If you have PostgreSQL installed locally, either:
1. Stop local PostgreSQL: `sudo systemctl stop postgresql`
2. Change the port mapping in `docker-compose.yml`: `"5433:5432"`

### Reset database
```bash
docker-compose down -v
docker-compose up -d
```

## Data Persistence
Database data is stored in Docker volumes:
- `postgres_data`: PostgreSQL data
- `pgadmin_data`: pgAdmin configuration

These persist even when containers are stopped.
