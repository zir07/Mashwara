# Mashwara Database Setup Script for Windows
# Run this script in PowerShell from the project root directory

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Mashwara Database Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
Write-Host "Checking Docker installation..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✓ Docker found: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Docker Desktop for Windows:" -ForegroundColor Yellow
    Write-Host "https://www.docker.com/products/docker-desktop/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "After installing Docker, restart this script." -ForegroundColor Yellow
    exit 1
}

# Check if Docker is running
Write-Host "Checking if Docker is running..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✓ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Step 1: Starting PostgreSQL with Docker Compose..." -ForegroundColor Yellow
docker compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ PostgreSQL started successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to start PostgreSQL" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
Write-Host "✓ PostgreSQL should be ready" -ForegroundColor Green

Write-Host ""
Write-Host "Step 3: Installing npm dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 4: Generating Prisma Client..." -ForegroundColor Yellow
npm run prisma:generate
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Prisma Client generated" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to generate Prisma Client" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 5: Running database migrations..." -ForegroundColor Yellow
Write-Host "When prompted for migration name, use: init" -ForegroundColor Cyan
npm run prisma:migrate
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Migrations completed" -ForegroundColor Green
} else {
    Write-Host "✗ Migrations failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 6: Seeding database with test data..." -ForegroundColor Yellow
npm run prisma:seed
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database seeded successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Seeding failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Setup Complete! ✓" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Database Access:" -ForegroundColor Cyan
Write-Host "  - Prisma Studio: npm run prisma:studio" -ForegroundColor White
Write-Host "    URL: http://localhost:5555" -ForegroundColor Gray
Write-Host ""
Write-Host "  - pgAdmin: http://localhost:5050" -ForegroundColor White
Write-Host "    Email: admin@mashwara.local" -ForegroundColor Gray
Write-Host "    Password: admin" -ForegroundColor Gray
Write-Host ""

Write-Host "Test Credentials:" -ForegroundColor Cyan
Write-Host "  Admin: admin@mashwara.pk / password123" -ForegroundColor White
Write-Host "  Student: ahmed.khan@iba.edu.pk / password123" -ForegroundColor White
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Open Prisma Studio to view data: npm run prisma:studio" -ForegroundColor White
Write-Host "  2. Start the API: nx serve api" -ForegroundColor White
Write-Host "  3. Start mobile app: nx start mobile" -ForegroundColor White
Write-Host ""

Write-Host "For detailed instructions, see: docs/windows-setup-guide.md" -ForegroundColor Yellow
