# GCP Cloud Function - Keyless Caching & AI Scanner

This directory contains the Node.js serverless Cloud Function for DSE Insight Pro. It operates 100% keylessly by utilizing the attached Google Cloud Service Account credentials to query Firestore and Vertex AI.

## 🚀 Deployment Instructions

To deploy this backend endpoint using the GCP CLI (`gcloud`), run the following command in this directory:

```bash
gcloud functions deploy analyze \
  --runtime=nodejs18 \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point=analyze \
  --region=us-central1 \
  --service-account=dse-analyst-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

*Note: Replace `YOUR_PROJECT_ID` with your actual Google Cloud Project ID.*
*Make sure the Service Account has the roles **Datastore User** (for Firestore caching) and **Vertex AI User** (for Gemini Vertex AI).*
