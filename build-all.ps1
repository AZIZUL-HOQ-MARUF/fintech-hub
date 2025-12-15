# Build script for Fintech Expense App

Write-Host "Building Fintech Common..."
cd backend/fintech-common
mvn clean install -DskipTests
cd ../..

Write-Host "Building Discovery Service..."
cd backend/discovery-service
mvn clean package -DskipTests
cd ../..

Write-Host "Building Gateway Service..."
cd backend/gateway-service
mvn clean package -DskipTests
cd ../..

Write-Host "Building Identity Service..."
cd backend/identity-service
mvn clean package -DskipTests
cd ../..

Write-Host "Building Expense Service..."
cd backend/expense-service
mvn clean package -DskipTests
cd ../..

Write-Host "Building Notification Service..."
cd backend/notification-service
mvn clean package -DskipTests
cd ../..

Write-Host "Build Complete!"
