# Product Chatbot

## 🛠️ Built with

- NestJS
- TypeScript
- Swagger
- Docker
- Jest

## ✅ Prerequisites

Before starting, make sure you have the following applications installed:

- ✅ [*Git*](https://git-scm.com/)
- ✅ [*Docker* y Docker Compose](https://www.docker.com/get-started) installed and running

## 📥 Get the project

Clone the repository:

```bash
#Clone the repository
git clone https://github.com/jeisonrojasm/product-chatbot-backend.git
cd product-chatbot-backend
```

## 🚀 Execute

### 1. **`.env` file required**

The `.env` file contains sensitive variables required to run the project (such as credentials, tokens, and service URLs).
For security reasons, **it is not included in the repository**.

> 🔐 **In the email you received, you will find the `.env` file required for the backend to run correctly.**

Once you have the `.env` file, place it in the root of the project.

### 2. Setting up the development environment with Docker

Due this application is fully Dockerized, you don't need to manually install Node.js or any dependencies on your computer. Simply run the following command from the project root to build the image and launch the backend container:

```bash
docker-compose up -d --build
```

This command will perform the following actions:

- It will build the Docker image defined in the `Dockerfile`, using `node:24-alpine` as a base.
- It will automatically install all dependencies declared in `package.json`.

Once the process is complete, the backend will be available at:

```arduino
http://localhost:3000
```

## ✅ Ready-to-use application

Once the previous steps are completed:

- The backend server will be running at `http://localhost:3000`.
- You will be able to consume the defined REST endpoints.
- And interactive documentation will be available in Swagger.

> 🧪 You can now test the endpoints using **Postman** or any HTTP client like **Insomnia**.
