# Rival.io Task Manager (Frontend)

Rival.io is a modern, real-time, responsive task management application. This repository houses the frontend client built using Next.js, Redux, Tailwind CSS, and WebSockets.

---

## Technical Overview & Architecture

The application is structured as a client-side SPA with routing and layout configurations powered by **Next.js 16 (App Router)**. Here is an overview of how the frontend satisfies the core requirements of the developer assessment:

### Core Tasks Implementation

- **Task Management & API Interactivity**
  - Consumes REST API endpoints using modular Axios services ([task.service.ts](file:///c:/Users/IVKU/Desktop/Job%20Tasks/rival_task_fe/services/task.service.ts)).
  - Renders tabular list structures on desktop and responsive grid cards on mobile ([TaskTable.tsx](file:///c:/Users/IVKU/Desktop/Job%20Tasks/rival_task_fe/components/feature/TaskTable.tsx)).
  - Supports clean page navigation mapped to database pagination sizes of `10` tasks.

- **Authentication, Authorization & State Persistence**
  - Implements state persistence via `localStorage` ([auth.provider.tsx](file:///c:/Users/IVKU/Desktop/Job%20Tasks/rival_task_fe/providers/auth.provider.tsx)). A gateway layout validates the active JSON Web Token (JWT) on load or reload, ensuring users remain logged in across page refreshes.
  - Enforces frontend security logic by checking task ownership to conditionally show edit/delete triggers, aligning with backend scoped security rules.

- **Client-Side Validation & Responsive UI**
  - Input forms perform validation before request dispatch. The update form submit button is dynamically disabled if no changes are detected (`!isFormChanged()`).
  - Gracefully displays loading, empty, and error states using animated skeleton loaders, placeholder text blocks, and descriptive error banners.
  - Fully responsive layouts tailored to mobile, tablet, and desktop viewports using mobile-first Tailwind utility classes.

- **Consolidated Filtering, Search & Sorting**
  - Features consolidated state controls where text search, sorting fields, status filters, and active pagination values are combined into a single API request flow, utilizing debounced user input triggers.


- **Role-Based Access Control (RBAC)**:
  - Dynamically renders administrative badges (`By You` vs `By Other`) on the task grids for users with the `admin` role, letting them inspect tasks created by any user while restricting standard users to their own dashboard.

- **Real-Time WebSockets Sync**:
  - A singleton Socket manager ([socket.ts](file:///c:/Users/IVKU/Desktop/Job%20Tasks/rival_task_fe/lib/socket.ts)) connects to the server and listens for task mutations (`task:created`, `task:updated`, `task:deleted`). Redux slices are updated in real-time.
- Modified tasks receive a pulsing background highlight animation and a yellow `"new"` badge for exactly 20 seconds.


- **State Highlighting & Optimistic UI**:
  - Optimistically prepends new or updated tasks to the top of the Redux state list.

- **Task Attachments**:
  - Integrates file upload mechanics allowing up to 5 attachments (images and PDFs up to 5MB each) utilizing ImageKit.
  - Renders inline loading skeletons with live spinners inside the attachment grid while files are uploading.

- **Activity Log History**:
  - Queries task history logs and presents user actions in a vertical timeline, showing specific field updates (e.g. `Status: todo → in progress`) inside an accordion component.

---

## Technologies Used

- **Framework**: Next.js 16 (React 19, App Router)
- **Language**: TypeScript
- **Global State**: Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **HTTP Client**: Axios (custom interception wrapper supporting bearer tokens)
- **Styling**: Tailwind CSS v4 (with PostCSS configurations and custom CSS keyframes)
- **Real-Time Layer**: Socket.io-client

---

## Folder Structure

Below is an overview of the frontend directory layout:

```text
rival_task_fe/
├── app/                      # Next.js App Router (Routing and Pages)
│   ├── (auth)/               # Auth Router Group
│   │   ├── (main)/dashboard/ # Dashboard component page (Task lists, stats, modals, pagination)
│   │   └── layout.tsx        # Auth gate layout (Validates JWT tokens and user profile state)
│   ├── login/                # Login form view
│   ├── signup/               # Signup registration form view
│   ├── globals.css           # Tailwind v4 configuration, theme variables, and custom keyframes
│   └── layout.tsx            # Main HTML wrapper (Wraps providers and configures base fonts)
├── components/               # React UI Components
│   ├── common/               # Reusable atomic UI elements (Badge, Button, Input, Modal, Select, Pagination, NotificationPopup)
│   └── feature/              # Domain-specific components (TaskTable containing desktop list and mobile card views)
├── constants/                # Configuration constants (Priority variables, sort constants, etc.)
├── hooks/                    # Custom React hooks (e.g. useAdminNotifications for Socket.io listener management)
├── lib/                      # Setup utilities (Socket client instance and connection helper, event mapping constants)
├── providers/                # Client contexts and providers (Redux provider, Auth gate, and Admin Notifications listener gate)
├── services/                 # Backend API service layers (auth.service, task.service, imagekit.service)
├── store/                    # Redux store configuration
│   ├── auth.slice.ts         # Authentication state slice
│   ├── task.slice.ts         # Task management list state slice (with optimistic prepend and 10-item cap)
│   ├── notification.slice.ts # WebSocket notification queue and 20s highlighting lists
│   └── hooks.ts              # Typed Redux Hooks (useAppDispatch, useAppSelector)
├── utils/                    # Utility scripts (JWT local storage and cookie token managers)
└── public/                   # Static assets (favicons, images, logos)
```

---

## Post-Pull Startup Guide

Follow these steps to set up and start the application after pulling the latest repository changes.

### 1. Prerequisites
Verify that you have installed:
- **Node.js** (v18.x or above recommended)
- **NPM** (v9.x or above)

### 2. Environment Configuration
Create a `.env` file in the root of the project to match the API and ImageKit configurations.

```env
# URL where backend REST endpoints are hosted
NEXT_PUBLIC_API_URL=http://localhost:5001/api

# URL of Socket.io Server ( the backend base url)
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001

# Public credentials for ImageKit uploads
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

### 3. Installation & Run
Run the following commands in sequence inside the frontend directory:

```bash
# 1. Clean install dependencies
npm install

# 2. Start the local developer server
npm run dev
```

The application will launch at [http://localhost:3000](http://localhost:3000).

---

## Building for Production

To create an optimized production bundle:

```bash
# Compile and build Next.js application
npm run build

# Start the built production server
npm run start
```