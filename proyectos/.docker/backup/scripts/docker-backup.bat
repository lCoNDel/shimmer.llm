@echo off
setlocal enabledelayedexpansion

REM Docker Backup Script - Windows Manual Execution
REM Usage: docker-backup.bat

set BACKUP_ROOT=%USERPROFILE%\.docker\backup
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set DATE_SHORT=%%c%%a%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set TIME_SHORT=%%a%%b)
set TIMESTAMP=%DATE_SHORT%_%TIME_SHORT%

for /f "tokens=*" %%a in ('powershell -command "get-date -format 'yyyy-MM-dd HH:mm:ss'"') do set TIMESTAMP_HUMAN=%%a

if not exist "%BACKUP_ROOT%\volumes" mkdir "%BACKUP_ROOT%\volumes"
if not exist "%BACKUP_ROOT%\compose" mkdir "%BACKUP_ROOT%\compose"
if not exist "%BACKUP_ROOT%\configs" mkdir "%BACKUP_ROOT%\configs"
if not exist "%BACKUP_ROOT%\logs" mkdir "%BACKUP_ROOT%\logs"

set LOGFILE=%BACKUP_ROOT%\logs\backup_%TIMESTAMP%.log

(
  echo ===============================================
  echo DOCKER BACKUP - Windows Manual Execution
  echo Timestamp: %TIMESTAMP_HUMAN%
  echo ===============================================
  echo.

  echo [1/3] Backing up Docker Volumes...
  set VOLUME_COUNT=0
  for /f %%v in ('docker volume ls -q') do (
    echo   Backing up volume: %%v
    docker run --rm -v %%v:/data -v "%BACKUP_ROOT%\volumes":/backup alpine tar czf /backup/%%v_%TIMESTAMP%.tar.gz -C / data
    set /a VOLUME_COUNT+=1
  )
  echo   Total volumes backed up: !VOLUME_COUNT!
  echo.

  echo [2/3] Backing up Docker Compose...
  set COMPOSE_DATE=%DATE_SHORT%_%TIME_SHORT%
  if not exist "%BACKUP_ROOT%\compose\%COMPOSE_DATE%" mkdir "%BACKUP_ROOT%\compose\%COMPOSE_DATE%"
  
  set COMPOSE_FOUND=0
  
  REM Buscar compose files en ubicaciones comunes
  set COMPOSE_LOCATIONS=. ..\..\..\compose .docker\compose ..\..\docker\compose
  
  for %%L in (%COMPOSE_LOCATIONS%) do (
    if exist "%%L\docker-compose.yml" (
      copy "%%L\docker-compose.yml" "%BACKUP_ROOT%\compose\%COMPOSE_DATE%\" >nul 2>&1
      echo   docker-compose.yml backed up from %%L
      set COMPOSE_FOUND=1
    )
    if exist "%%L\docker-compose.override.yml" (
      copy "%%L\docker-compose.override.yml" "%BACKUP_ROOT%\compose\%COMPOSE_DATE%\" >nul 2>&1
      echo   docker-compose.override.yml backed up from %%L
    )
  )
  
  REM Respaldar todos los *.yml en .docker/compose
  if exist ".docker\compose\*.yml" (
    copy ".docker\compose\*.yml" "%BACKUP_ROOT%\compose\%COMPOSE_DATE%\" >nul 2>&1
    for %%F in (".docker\compose\*.yml") do (
      echo   Compose file backed up: %%~nxF
      set COMPOSE_FOUND=1
    )
  )
  
  REM Respaldar todos los *.yml en ..\..\..\compose
  if exist "..\..\..\compose\*.yml" (
    copy "..\..\..\compose\*.yml" "%BACKUP_ROOT%\compose\%COMPOSE_DATE%\" >nul 2>&1
    for %%F in ("..\..\..\compose\*.yml") do (
      echo   Compose file backed up: %%~nxF
      set COMPOSE_FOUND=1
    )
  )
  
  if !COMPOSE_FOUND! equ 1 (
    echo   Info: Compose files backed up successfully
  ) else (
    echo   Info: No docker-compose files found in standard locations
  )
  echo.

  echo [3/3] Backing up Container Configurations...
  set CONTAINER_COUNT=0
  for /f "tokens=*" %%c in ('docker ps -aq') do (
    for /f "tokens=*" %%n in ('docker inspect -f {{.Name}} %%c') do (
      set CONTAINER_NAME=%%n
      set CONTAINER_NAME=!CONTAINER_NAME:/=!
      if not exist "%BACKUP_ROOT%\configs\!CONTAINER_NAME!" mkdir "%BACKUP_ROOT%\configs\!CONTAINER_NAME!"
      docker inspect %%c > "%BACKUP_ROOT%\configs\!CONTAINER_NAME!\!CONTAINER_NAME!_%TIMESTAMP%.json" 2>nul
      if exist "%BACKUP_ROOT%\configs\!CONTAINER_NAME!\!CONTAINER_NAME!_%TIMESTAMP%.json" (
        echo   Backed up: !CONTAINER_NAME!
        set /a CONTAINER_COUNT+=1
      )
    )
  )
  echo   Total containers backed up: !CONTAINER_COUNT!
  echo.

  echo ===============================================
  echo BACKUP COMPLETED
  echo ===============================================
  echo Location: %BACKUP_ROOT%
  echo Volumes: !VOLUME_COUNT!
  echo Containers: !CONTAINER_COUNT!
  echo Completion time: %TIMESTAMP_HUMAN%
  echo ===============================================

) > "%LOGFILE%" 2>&1

echo.
echo Backup completed. Log saved to: %LOGFILE%
echo.
pause
