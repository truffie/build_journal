# Build Journal

Журнал строительных работ — веб-приложение для ведения учёта выполненных работ на строительных объектах.

![alt text](image-1.png)

## Стек

| Слой | Технология |
|------|------------|
| Frontend | Next.js 16, React 19, TanStack Query, Zustand |
| Backend | NestJS 11, Prisma 7 |
| БД | MySQL 8.4 |
| Стили | Tailwind CSS 4, shadcn/ui |
| Монорепо | Turborepo + pnpm workspaces |
| Деплой | Docker Compose + Nginx |

## Требования

Node.js ≥ 20.19, pnpm ≥ 11, Docker.

## Быстрый старт

```bash
git clone <repo> && cd build_journal
pnpm install

cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Секреты для прода: `openssl rand -base64 48` → `JWT_SECRET` и `JWT_REFRESH_SECRET` в `apps/api/.env`.

### дев

```bash
docker compose up -d db --wait
pnpm --filter api prisma:migrate:deploy
pnpm --filter api db:seed
pnpm dev
```

| Сервис | URL |
|--------|-----|
| Frontend | http://localhost:5173 |
| API / Swagger | http://localhost:3000/swagger |


### билд

Те же `apps/api/.env` и `apps/web/.env`:

```bash
docker compose up -d --build
docker compose --profile migrate run --rm migrate
```

### Прод

`apps/api/.env` — реальные JWT и `CORS_ORIGIN`. Домен в `nginx/default.conf`.

```bash
docker compose --profile prod up -d --build
docker compose --profile migrate run --rm migrate
```

## Переменные окружения

| Файл | Назначение |
|------|------------|
| `apps/api/.env` | API, Prisma, Docker `db` / `api` / `migrate` |
| `apps/web/.env` | Frontend (`API_ORIGIN` в Docker подменяется на `http://api:4000`) |

## Сиды

| Команда | Описание |
|---------|----------|
| `pnpm --filter api db:seed` | Полный сид |
| `pnpm --filter api db:seed:foreman` | Только прораб |

## Генерация API-типов

```bash
cd apps/web && pnpm api:generate
```

## Скрипты

| Команда | Описание |
|---------|----------|
| `pnpm dev` | Frontend + API |
| `pnpm build` | Production-сборка |

## Архитектура frontend (FSD)

```
src/
├── app/ → screens/ → widgets/ → features/ → entities/ → shared/
```

Правило импортов: `shared → entities → features → widgets → screens → app`
