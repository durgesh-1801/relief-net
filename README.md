# Disaster Response Coordination Backend

Simple hackathon-ready Node.js + Express backend with MongoDB.

## Tech

- Express.js
- MongoDB + Mongoose
- dotenv

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and update values:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/disaster_response_db
```

3. Run the server:

```bash
npm run dev
```

or

```bash
npm start
```

## API Endpoints

### 1) Create report

- `POST /api/reports`
- Body:

```json
{
  "type": "Flood",
  "location": "Sector 21",
  "description": "Water level rising quickly"
}
```

Priority is auto-assigned:
- Flood/Fire => High
- Earthquake/Landslide => Medium
- Others => Low

### 2) Get all reports

- `GET /api/reports`

### 3) Register volunteer

- `POST /api/volunteers`
- Body:

```json
{
  "name": "Asha",
  "role": "Medic"
}
```

### 4) List volunteers

- `GET /api/volunteers`

### 5) Assign volunteer to report

- `POST /api/assign`
- Body:

```json
{
  "reportId": "REPORT_OBJECT_ID",
  "volunteerId": "VOLUNTEER_OBJECT_ID"
}
```

Creates a task and updates report status to `Assigned`.

### 6) Update report status

- `PATCH /api/report/:id`
- Body:

```json
{
  "status": "Completed"
}
```

Allowed status values: `Pending`, `Assigned`, `Completed`.
