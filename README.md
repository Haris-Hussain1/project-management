# Project Management System

A full-stack project management platform designed to help teams organize projects, manage tasks, collaborate with members, and track work from a centralized workspace.

The system provides a structured foundation for project and team workflows, including authentication, project membership, role-based permissions, task management, task assignments, and notifications.

## Overview

The Project Management System is built as a modern web application using **Django REST Framework** for the backend and **React + TypeScript** for the frontend.

The platform allows users to:

* Create and manage projects
* Manage project members
* Assign project roles and permissions
* Create and organize tasks
* Track task status and priorities
* Assign tasks to project members
* Set task due dates
* Search and filter tasks
* Receive task-related notifications
* Manage project and task activity from a centralized workspace

Authorization and business rules are enforced primarily by the backend, while the frontend provides a responsive interface for interacting with the system.

## Core Features

### Authentication

The platform provides authenticated user workflows with token-based API authentication.

Users can access protected project and task functionality while the backend validates their identity and permissions for protected operations.

### Project Management

Projects provide the primary organizational structure for the workspace.

Each project contains:

* Project information
* Owner information
* Project members
* Member roles
* Project-specific tasks
* Related project resources

Projects can be accessed individually through dedicated project views.

### Project Membership & Roles

Projects support membership-based access control.

Users can belong to projects with different roles, including:

* **Owner**
* **Admin**
* **Member**
* **Viewer**

Project membership is used throughout the backend authorization layer to determine whether a user can access or modify project-related resources.

### Team Management

The team workspace aggregates members across the projects that the authenticated user can access.

It provides:

* Team member information
* Member roles
* Associated projects
* Project counts
* Member search
* Role visibility
* Project membership information

A user appearing in multiple projects is represented as a single team member while their project memberships and roles are aggregated.

### Task Management

Tasks represent individual pieces of work within a project.

Each task supports:

* Title
* Description
* Project association
* Status
* Priority
* Creator
* Assignee
* Due date
* Creation timestamp
* Last updated timestamp

Supported task statuses:

* **To Do**
* **In Progress**
* **Completed**

Supported priorities:

* **Low**
* **Medium**
* **High**

### Task Assignment

Tasks can be assigned to project members.

The backend validates assignment relationships to ensure that users assigned to tasks belong to the associated project.

Tasks can therefore be created and assigned within the appropriate project context.

### Task Filtering & Search

The task workspace provides tools for managing larger task lists efficiently.

Users can:

* Search tasks by title
* Search tasks by description
* Filter by status
* Filter by priority
* Filter by project
* Filter by assignee
* View task counts
* Identify overdue tasks
* Refresh task data

### Project-Scoped Tasks

Each project has its own task workspace.

Opening a project allows users to view tasks belonging specifically to that project and create new tasks directly within the project context.

Project tasks display relevant information such as:

* Title
* Description
* Status
* Priority
* Assignee
* Due date

### Task Permissions

Task operations are protected through project membership and authorization rules.

The system controls:

* Who can access project tasks
* Who can create tasks
* Who can update tasks
* Who can delete tasks
* Who can assign tasks
* Who can modify task information

Project owners and administrators have elevated permissions for project and task management, while appropriate controls are applied to members and other project roles.

### Notifications

The application includes an integrated notification system for important task events.

Notifications can be generated when:

* A task is assigned
* A task is reassigned
* A task status changes

Notifications can reference the associated project and task so users can connect activity directly to the relevant workspace context.

## Frontend

The frontend is built with:

* React
* TypeScript
* Vite
* Tailwind CSS
* Lucide React

The frontend follows a feature-based architecture with reusable components, hooks, API services, and shared types.

### Frontend Structure

```text
frontend/
└── src/
    ├── app/
    ├── components/
    ├── features/
    │   ├── auth/
    │   ├── comments/
    │   ├── dashboard/
    │   ├── notifications/
    │   ├── projects/
    │   ├── settings/
    │   ├── tasks/
    │   └── team/
    ├── hooks/
    ├── layouts/
    ├── lib/
    ├── services/
    ├── styles/
    ├── types/
    ├── App.tsx
    └── main.tsx
```

The feature-based structure keeps project, task, authentication, team, notification, and collaboration functionality organized while allowing shared services and hooks to be reused across the application.

### Task Workspace

The task interface provides a focused workspace for managing current work.

It includes:

* Task summary cards
* Search
* Status filtering
* Priority filtering
* Project selection
* Task creation
* Task deletion
* Task status visualization
* Priority indicators
* Assignment information
* Due-date tracking
* Overdue indicators
* Loading states
* Error handling
* Empty states

The interface uses responsive layouts and reusable UI patterns for a consistent application experience.

## Backend

The backend is built with:

* Python
* Django
* Django REST Framework
* PostgreSQL
* JWT-based authentication

The backend exposes REST APIs for authentication, projects, members, tasks, comments, and notifications.

### Backend Structure

```text
backend/
├── apps/
│   ├── users/
│   ├── projects/
│   ├── tasks/
│   ├── comments/
│   └── notifications/
├── config/
├── manage.py
└── requirements.txt
```

Each major domain is separated into its own Django application, making the backend easier to maintain and extend.

## API Architecture

The application follows a RESTful API structure.

Representative endpoints include:

```text
/api/auth/
/api/projects/
/api/tasks/
/api/comments/
/api/notifications/
```

### Task API

The task API supports operations such as:

```text
GET    /api/tasks/
POST   /api/tasks/
GET    /api/tasks/<id>/
PATCH  /api/tasks/<id>/
DELETE /api/tasks/<id>/
```

Task listing supports filtering through query parameters such as:

```text
?project=<id>
?status=<status>
?priority=<priority>
?assigned_to=<user_id>
```

## Data Model

The core task relationship can be represented as:

```text
User
 │
 ├── creates ──────────► Task
 │
 └── assigned to ◄───── Task
                          │
                          ▼
                       Project
                          │
                          ▼
                  ProjectMembership
```

A project can contain multiple tasks, while each task belongs to exactly one project.

Project membership provides the authorization relationship between users and projects.

## Security & Authorization

Security is enforced primarily at the backend level.

Protected API operations require authentication, while project-related operations additionally validate membership and role permissions.

The system uses:

* Authenticated API access
* JWT authentication
* Project membership validation
* Role-based project permissions
* Task-level authorization
* Assignment validation
* Protected project resources

This ensures that authorization decisions are not dependent solely on frontend behavior.

## Notifications Architecture

Task activity can trigger notification creation through a dedicated notification service.

For example:

```text
Task Assigned
      │
      ▼
Notification Service
      │
      ▼
Assigned User
```

Status changes can also generate notifications for relevant users:

```text
Task Status Changed
      │
      ├──► Task Creator
      │
      └──► Task Assignee
```

The notification system keeps event-related communication separate from the core task business logic.

## Development

### Backend

Navigate to the backend directory:

```powershell
cd backend
```

Create a Python virtual environment:

```powershell
python -m venv venv
```

Activate it on Windows:

```powershell
venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Run migrations:

```powershell
python manage.py migrate
```

Start the development server:

```powershell
python manage.py runserver
```

The API will typically be available at:

```text
http://127.0.0.1:8000/
```

### Frontend

Navigate to the frontend directory:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

The frontend will typically be available at:

```text
http://localhost:5173/
```

## Environment Configuration

Environment-specific configuration should be stored in environment variables rather than committed directly to the repository.

Typical configuration includes:

```text
DATABASE_URL
SECRET_KEY
DEBUG
ALLOWED_HOSTS
CORS_ALLOWED_ORIGINS
JWT configuration
Frontend API URL
```

Sensitive credentials and production secrets should never be committed to version control.

An environment example file is provided where applicable.

## Project Workflow

A typical workflow looks like:

```text
User Authentication
        │
        ▼
Workspace
        │
        ▼
Create / Open Project
        │
        ▼
Manage Project Members
        │
        ▼
Create Tasks
        │
        ▼
Assign Work
        │
        ▼
Track Status & Priority
        │
        ▼
Monitor Due Dates
        │
        ▼
Receive Notifications
```

This provides a complete workflow from project creation through task execution and progress tracking.

## Design Principles

### Separation of Concerns

Frontend presentation, API communication, business logic, authorization, and data persistence are separated into appropriate layers.

### Backend-Enforced Authorization

Permissions are validated server-side rather than relying on frontend restrictions.

### Feature-Based Frontend Architecture

Related functionality is grouped into feature modules to improve maintainability and scalability.

### Reusable Services & Hooks

API services and React hooks centralize data access and state-related logic.

### Consistent User Experience

The interface uses reusable components, loading states, error states, empty states, responsive layouts, and consistent interaction patterns.

### Extensibility

The architecture provides a foundation for adding additional project-management capabilities without requiring a complete restructuring of the application.

## Future Expansion

Potential future enhancements include:

* Kanban boards
* Drag-and-drop task management
* Task comments
* File attachments
* Activity feeds
* Real-time notifications
* Team dashboards
* Advanced role permissions
* Project analytics
* Task dependencies
* Recurring tasks
* Calendar integration
* Email notifications
* Cross-project search
* Audit logs
* Workspace-level administration

## Status

**Active Development**

The core foundation for authentication, project management, project membership, team management, task management, authorization, and notifications is in place, with additional collaboration and workspace features continuing to be developed.

## License

This project is currently maintained as a private development project.
