@echo off
title DSE Insight Pro - GCP Deploy Helper
echo ===================================================
echo     DSE Insight Pro - GCP Cloud Function Deploy
echo ===================================================
echo.

set /p PROJECT_ID="Enter Google Cloud Project ID: "
if "%PROJECT_ID%"=="" (
    echo Error: Google Cloud Project ID is required to deploy.
    pause
    exit /b
)

set /p REGION="Enter GCP Region [default: us-central1]: "
if "%REGION%"=="" set REGION=us-central1

set /p SA_EMAIL="Enter Service Account Email [default: dse-analyst-sa@%PROJECT_ID%.iam.gserviceaccount.com]: "
if "%SA_EMAIL%"=="" set SA_EMAIL=dse-analyst-sa@%PROJECT_ID%.iam.gserviceaccount.com

echo.
echo Deploying "analyze" Cloud Function to Google Cloud...
echo Region: %REGION%
echo Service Account: %SA_EMAIL%
echo Project: %PROJECT_ID%
echo.

cd gcp-backend
call gcloud functions deploy analyze ^
  --runtime=nodejs18 ^
  --trigger-http ^
  --allow-unauthenticated ^
  --entry-point=analyze ^
  --region=%REGION% ^
  --service-account=%SA_EMAIL% ^
  --project=%PROJECT_ID%

echo.
echo ===================================================
echo Deployment attempt complete.
echo ===================================================
echo.
pause
