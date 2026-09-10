# Configuración de Ambientes y Variables para GitHub Actions

El pipeline gestiona el despliegue de **Backend en Cloud Run** (vía Docker Hub) y **Frontend en Cloudflare Pages** utilizando **GitHub Environments** para `TESTING` y `PROD`.

Crea los ambientes en GitHub (**Settings -> Environments**):
1. `TESTING` (asociado a la rama `testing`)
2. `PROD` (asociado a la rama `main`)

---

## 1. Secrets Globales del Repositorio (`Settings -> Secrets and variables -> Actions`)
* `DOCKERHUB_USERNAME`: Nombre de usuario de Docker Hub.
* `DOCKERHUB_TOKEN`: Personal Access Token (PAT) de Docker Hub.
* `CLOUDFLARE_API_TOKEN`: API Token de Cloudflare con permisos para Cloudflare Pages.
* `CLOUDFLARE_ACCOUNT_ID`: Account ID de la cuenta de Cloudflare.
* `CLOUDFLARE_PROJECT`: Nombre del proyecto en Cloudflare Pages.

---

## 2. Secrets por Ambiente (`TESTING` y `PROD`)
Configura cada una de estas variables dentro del ambiente correspondiente (**Environment Secrets**):

### Google Cloud Platform & Cloud Run (Backend)
* `GCP_WORKLOAD_IDENTITY_PROVIDER`: Proveedor de Workload Identity para el ambiente.
* `GCP_SERVICE_ACCOUNT`: Email de la Service Account de GCP para el ambiente.
* `GCP_PROJECT_ID`: ID del proyecto GCP del ambiente.
* `GCP_REGION`: Región de GCP (ej. `us-central1` o `southamerica-east1`).

### Backend Application Secrets
* `DATABASE_URL`: String de conexión PostgreSQL del ambiente.
* `JWT_SECRET`: Clave secreta JWT del ambiente.
* `JWT_ACCESS_EXPIRATION_MINUTES`: Minutos de expiración del token JWT (ej. `15`).
* `ALLOWED_ORIGINS`: Dominios permitidos para CORS (ej. `https://mi-app.pages.dev`).
* `INITIAL_ADMIN_EMAIL`: Email del usuario administrador inicial.
* `FIREBASE_PROJECT_ID`: ID del proyecto Firebase del ambiente.
* `FIREBASE_CREDENTIALS_JSON`: Contenido del JSON de credenciales de Firebase.
