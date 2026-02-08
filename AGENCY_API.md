# Agency OS - API Documentation

## Overview
Backend API for managing Clients, Projects, and Tasks in your Digital Marketing Agency.

## Base URL
`http://localhost:4000/api`

---

## 🏢 Clients

### Create Client
**POST** `/organizations/:orgId/clients`

**Body:**
```json
{
  "name": "Nike Inc.",
  "email": "contact@nike.com",
  "phone": "+1-555-0123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Nike Inc.",
    "email": "contact@nike.com",
    "phone": "+1-555-0123",
    "status": "active",
    "organizationId": "uuid",
    "createdAt": "2026-01-16T...",
    "updatedAt": "2026-01-16T..."
  }
}
```

### Get All Clients
**GET** `/organizations/:orgId/clients`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Nike Inc.",
      "_count": { "projects": 3 }
    }
  ]
}
```

### Update Client
**PATCH** `/clients/:clientId`

**Body:**
```json
{
  "name": "Nike Corporation",
  "status": "archived"
}
```

---

## 📁 Projects

### Create Project
**POST** `/clients/:clientId/projects`

**Body:**
```json
{
  "name": "Summer Campaign 2026",
  "description": "Social media campaign for Q2"
}
```

### Get Projects
**GET** `/clients/:clientId/projects`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Summer Campaign 2026",
      "description": "...",
      "status": "active",
      "_count": { "tasks": 12 }
    }
  ]
}
```

---

## ✅ Tasks

### Create Task
**POST** `/projects/:projectId/tasks`

**Body:**
```json
{
  "title": "Design Instagram Post",
  "description": "Create 3 variations for A/B testing",
  "priority": "HIGH",
  "assigneeId": "user-uuid"
}
```

### Get Tasks
**GET** `/projects/:projectId/tasks`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Design Instagram Post",
      "status": "TODO",
      "priority": "HIGH",
      "assignee": {
        "id": "uuid",
        "fullName": "John Doe",
        "email": "john@agency.com"
      }
    }
  ]
}
```

### Update Task (Move Status)
**PATCH** `/tasks/:taskId`

**Body:**
```json
{
  "status": "IN_PROGRESS"
}
```

**Valid Statuses:**
- `TODO`
- `IN_PROGRESS`
- `REVIEW`
- `DONE`

### Delete Task
**DELETE** `/tasks/:taskId`

---

## 🔐 Authentication
All endpoints require:
- **Header:** `Authorization: Bearer <access_token>`
- **Permission:** `org:read` (minimum)

---

## Next Steps
1. Build Frontend Clients Page
2. Build Kanban Board UI
3. Add drag-and-drop for tasks
