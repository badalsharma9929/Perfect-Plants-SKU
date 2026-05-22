# API Surface

The production API lives in `backend/src`. This folder is intentionally kept as a deployment bridge location for platforms that expect an `api/` directory.

Primary routes:

- `POST /offers/match`
- `POST /analytics/impression`
- `POST /analytics/click`
- `POST /analytics/purchase`
- `GET /campaigns`
- `POST /campaigns`
- `PUT /campaigns/:id`
- `DELETE /campaigns/:id`
- `POST /webhooks/app/uninstalled`
- `POST /webhooks/orders/create`
- `POST /webhooks/orders/paid`
