# Run Infrastructure

cd infrastructure
docker-compose up -d
cd ..

Write-Host "Infrastructure (Postgres, Redis, Kafka) started."
Write-Host "You can now run the services via IDE or 'mvn spring-boot:run' in each service directory."
