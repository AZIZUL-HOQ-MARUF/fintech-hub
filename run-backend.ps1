# Run all backend services
# This script opens a new PowerShell window for each service.

Write-Host "Starting Discovery Service..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend/discovery-service; java -jar target/discovery-service-0.0.1-SNAPSHOT.jar"
Start-Sleep -Seconds 10

Write-Host "Starting Gateway Service..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend/gateway-service; java -jar target/gateway-service-0.0.1-SNAPSHOT.jar"
Start-Sleep -Seconds 5

Write-Host "Starting Identity Service..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend/identity-service; java -jar target/identity-service-0.0.1-SNAPSHOT.jar"

Write-Host "Starting Expense Service..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend/expense-service; java -jar target/expense-service-0.0.1-SNAPSHOT.jar"

Write-Host "Starting Notification Service..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend/notification-service; java -jar target/notification-service-0.0.1-SNAPSHOT.jar"

Write-Host "All services started (check new windows)."
