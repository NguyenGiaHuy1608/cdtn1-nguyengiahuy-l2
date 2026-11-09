# Deployment Guide – Hệ thống quản lý bảo hành

## 1. Environment Requirements

The following software is required to run the system:

- Docker Desktop.
- Docker Compose.

Verify that Docker is installed by running:

```powershell
docker --version
docker compose version
```

## 2. Running the Application

Open a terminal at the root directory of the project and run:

```powershell
docker compose up --build
```

Docker will build the application image and start the warranty management system.

After the container starts successfully, the application can be accessed at:

```text
http://127.0.0.1:5000
```

## 3. Stopping the Application

To stop the running application, press:

```text
Ctrl + C
```

Alternatively, run the following command in another terminal:

```powershell
docker compose down
```

## 4. Deployment Files

The Docker deployment configuration includes the following files:

- `Dockerfile`: Defines the Docker image for the Flask application.
- `docker-compose.yml`: Defines and runs the application container.
- `.dockerignore`: Excludes unnecessary files from the Docker build context.

## 5. Verifying the Deployment

The deployment is considered successful when:

1. The Docker image is built successfully.
2. The application container starts without errors.
3. The application can be opened at `http://127.0.0.1:5000`.
4. The main functions of the warranty management system are displayed and accessible.