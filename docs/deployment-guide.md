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

## 2. Environment Variables

The project uses environment variables for local configuration.

| Variable | Description | Example Value |
|---|---|---|
| `DATABASE_PATH` | Path to the SQLite database file. | `data/warranty.db` |
| `PORT` | Port used to run the Flask application. | `5000` |
| `SECRET_KEY` | Secret key used for application security and token signing. | `change-this-local-secret` |
| `DEMO_USERNAME` | Demo username used for authentication. | `demo` |
| `DEMO_PASSWORD` | Demo password used for authentication. | `<demo-password-from-local-env>` |

A sample configuration is provided in `.env.example`. For local development, copy the sample file and create a `.env` file if custom configuration is required.

## 3. Sample Data

The application uses SQLite for local data storage.

The sample database is located at:

```text
data/warranty.db
```

The system includes sample data for the main functions, including:

- Customers.
- Devices.
- Issue categories.
- Warranty tickets.

When running the application, the existing sample database is used to support demonstration and testing of the warranty management functions.

## 4. Running the Application

Open a terminal at the root directory of the project and run:

```powershell
docker compose up --build
```

Docker Compose will build the application image and start the warranty management system.

After the container starts successfully, the application can be accessed at:

```text
http://127.0.0.1:5000
```

The application container also includes a health check that verifies the API health endpoint.

## 5. Stopping the Application

To stop the running application, press:

```text
Ctrl + C
```

Alternatively, run the following command in another terminal:

```powershell
docker compose down
```

## 6. Deployment Files

The Docker deployment configuration includes the following files:

- `Dockerfile`: Defines the Docker image for the Flask application.
- `docker-compose.yml`: Defines and runs the application container and its health check.
- `.dockerignore`: Excludes unnecessary files from the Docker build context.

## 7. Verifying the Deployment

The deployment is considered successful when:

1. The Docker image is built successfully.
2. The application container starts without errors.
3. The application can be opened at `http://127.0.0.1:5000`.
4. The health check reports that the application is running correctly.
5. The main functions of the warranty management system are displayed and accessible.

The API health endpoint can also be checked at:

```text
http://127.0.0.1:5000/api/health
```

A successful response confirms that the API is available and responding correctly.