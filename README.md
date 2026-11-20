# Management Portal

An Angular participant-management application. It provides login, participant listing, participant creation, editing, deletion, and logo upload pages.

## Prerequisites

Before starting the app, install:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) with npm
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) with Docker Compose enabled
- A terminal and a modern web browser
- The backend API, running at `http://localhost:9081` for Tasks 7 through 12

Use a current Node.js LTS release. Angular CLI is included with the project and can be run through npm scripts, so installing it globally is not required.

Docker Desktop must be running before starting the backend. Docker Compose is normally included with Docker Desktop; verify it with `docker compose version`.

## Choose the correct task branch

The frontend repository and backend repository use separate branch mappings:

| Frontend task | Backend branch | Backend required? |
|---|---|---|
| Tasks 1-6 | No backend branch | No; it is a static SPA |
| Tasks 7-8 | `branch1-no-auth-no-logo` | Yes |
| Task 9 | `branch2-no-auth-with-logo` | Yes |
| Tasks 10-12 | `branch3-auth-with-logo` | Yes |

Before setup, switch the frontend repository to the branch for the task you are working on, and check out the matching backend branch from the table above.

## Download from GitHub

### Option 1: Clone with Git

From a terminal:

```bash
git clone https://github.com/Pix3l-Guy21/participant-management-portal.git
cd participant-management-portal
```

### Option 2: Download a ZIP

1. Open https://github.com/Pix3l-Guy21/participant-management-portal.
2. Click **Code**, then **Download ZIP**.
3. Extract the ZIP file.
4. Open a terminal in the extracted project folder.

## Set up the backend

The backend is required only for Tasks 7 through 12. The backend has separate code branches for each stage.

### 1. Download the backend

Clone the backend repository:

```bash
git clone https://github.com/Yibarek/participant-bank-backend.git
cd participant-bank-backend
```

Alternatively, open https://github.com/Yibarek/participant-bank-backend, click **Code**, then **Download ZIP**, and extract the result.

Check out the branch matching the frontend task:

```bash
# Tasks 7-8
git checkout branch1-no-auth-no-logo

# Task 9
# git checkout branch2-no-auth-with-logo

# Tasks 10-12
# git checkout branch3-auth-with-logo
```

Only one branch should be checked out at a time.

### 2. Start the Docker container

Make sure Docker Desktop is running, then run this command from the backend repository directory:

```bash
docker compose -p "project-name" up --build -d
```

Replace `project-name` with a name for this backend project, for example:

```bash
docker compose -p "participant-bank-backend" up --build -d
```

Docker Compose builds the images and starts the backend services in the background.

#### Fix for a Gradle wrapper path error

If the build reports that it cannot find `gradlew`, open the backend `Dockerfile` and replace line 17 with:

```dockerfile
RUN sed -i 's/\r$//' gradlew && chmod +x gradlew && ./gradlew bootJar -x test --no-daemon
```

This normalizes Windows line endings for `gradlew`, makes it executable, and builds the application.

Then rebuild the container:

```bash
docker compose -p "participant-bank-backend" up --build -d
```

### 3. Verify the backend

After the Docker build finishes, open:

```text
http://localhost:9081/swagger-ui.html
```

If Swagger UI loads successfully, the backend is ready. If this URL does not load, confirm Docker Desktop is running and inspect the container logs:

```bash
docker compose -p "participant-bank-backend" ps
docker compose -p "participant-bank-backend" logs
```

To stop the backend:

```bash
docker compose -p "participant-bank-backend" down
```

## Install dependencies

In the project directory, run:

```bash
npm install
```

This reads `package.json` and creates the `node_modules` directory.

## Configure the backend URL

The development and production environment files both use:

```text
http://localhost:9081/api/v1
```

If the backend runs somewhere else, update `apiUrl` in:

- `src/environments/environment.ts`
- `src/environments/environment.development.ts`

The backend must be running before login and participant operations can work.

## Run locally

Start the Angular development server:

```bash
npm start
```

Or run Angular CLI directly:

```bash
npm run ng -- serve
```

After the build completes, open:

```text
http://localhost:4200/
```

The application redirects to `http://localhost:4200/login`. Development mode reloads the page automatically after source changes.

To make the server available on the local network:

```bash
npm start -- --host 0.0.0.0
```

## Login

The default backend credentials are:

```text
Username: admin
Password: Password@123
```

A successful login redirects to `http://localhost:4200/participants`.

## Build

Create a production build:

```bash
npm run build
```

The generated files are placed in `dist/management-portal`.

## Run tests

Run the unit test suite once:

```bash
npm test -- --watch=false
```

Run tests in watch mode:

```bash
npm test
```

## Project structure

```text
src/
  app/
    guards/             Authentication route guard
    interceptors/       Authentication and error interceptors
    pages/              Login and participant pages
    services/           Authentication and participant API services
    shared/             Shared UI components
  environments/         Backend API environment settings
public/                 Static images and icons
```
