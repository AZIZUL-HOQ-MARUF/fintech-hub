Write-Host "Starting Fintech Expense App in Development Mode..."

# 1. Start Discovery Service
Write-Host "Starting Discovery Service..."
Start-Process mvn -ArgumentList "spring-boot:run" -WorkingDirectory ".\backend\discovery-service"
Start-Sleep -Seconds 10

# 2. Start Gateway Service
Write-Host "Starting Gateway Service..."
Start-Process mvn -ArgumentList "spring-boot:run" -WorkingDirectory ".\backend\gateway-service"
Start-Sleep -Seconds 5

# 3. Start Identity Service
Write-Host "Starting Identity Service..."
Start-Process mvn -ArgumentList "spring-boot:run" -WorkingDirectory ".\backend\identity-service"
Start-Sleep -Seconds 5

# 4. Start Expense Service
Write-Host "Starting Expense Service..."
Start-Process mvn -ArgumentList "spring-boot:run" -WorkingDirectory ".\backend\expense-service"

# 5. Start Notification Service
Write-Host "Starting Notification Service..."
Start-Process mvn -ArgumentList "spring-boot:run" -WorkingDirectory ".\backend\notification-service"

Write-Host "All services started. Press Ctrl+C in each window to stop."
