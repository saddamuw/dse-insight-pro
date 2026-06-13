#!/bin/bash
echo "==================================================="
echo "    DSE Insight Pro - GCP Cloud Function Deploy"
echo "==================================================="
echo ""

read -p "Enter Google Cloud Project ID: " PROJECT_ID
if [ -z "$PROJECT_ID" ]; then
    echo "Error: Google Cloud Project ID is required."
    exit 1
fi

read -p "Enter GCP Region [default: us-central1]: " REGION
REGION=${REGION:-us-central1}

read -p "Enter Service Account Email [default: dse-analyst-sa@${PROJECT_ID}.iam.gserviceaccount.com]: " SA_EMAIL
SA_EMAIL=${SA_EMAIL:-dse-analyst-sa@${PROJECT_ID}.iam.gserviceaccount.com}

echo ""
echo "Deploying \"analyze\" Cloud Function to Google Cloud..."
echo "Region: $REGION"
echo "Service Account: $SA_EMAIL"
echo "Project: $PROJECT_ID"
echo ""

cd "$(dirname "$0")/gcp-backend"
gcloud functions deploy analyze \
  --runtime=nodejs20 \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point=analyze \
  --region=$REGION \
  --service-account=$SA_EMAIL \
  --project=$PROJECT_ID

echo ""
echo "==================================================="
echo "Deployment attempt complete."
echo "==================================================="
