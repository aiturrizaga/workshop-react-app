# Sistema de Ventas e Inventario — Frontend

Frontend del proyecto de referencia para el curso de React: consume el backend
REST real (NestJS + PostgreSQL) del **Sistema de Ventas e Inventario**.

No es un mockup: inicia sesión, gestiona productos y clientes, y registra
ventas reales contra la base de datos a través de la API.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS 4
- React Router 7
- Lucide React (iconos)
- Context API (sesión / autenticación)
- Fetch API (sin librerías HTTP externas)
- sonner (toasts de feedback)
- Backend: NestJS + Prisma + PostgreSQL (ver `../workshop-react-api`)

## Requisitos

- Node.js 20+
- El backend corriendo (por defecto en `http://localhost:3000/api`)

## Instalación

```bash
npm install
```

## Variables de entorno

```bash
cp .env.example .env
```

| Variable | Ejemplo | Descripción |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3000/api` | URL base del backend REST |

`VITE_API_URL` es la **única** fuente de la URL del API (`src/shared/api/apiClient.ts`
la lee con `import.meta.env.VITE_API_URL`); ningún service escribe la URL a mano.
Recuerda: toda variable `VITE_*` queda embebida en el bundle del navegador, así
que nunca debe contener secretos — solo información pública como esta URL.

## Ejecutar

```bash
npm run dev      # http://localhost:5173
npm run build    # type-check (tsc -b) + build de producción a dist/
npm run lint     # ESLint
npm run preview  # sirve el build de producción localmente
```

## Arquitectura

Feature-Based Architecture: cada funcionalidad de negocio vive en su propia
carpeta bajo `features/`, con sus propios tipos, servicio HTTP, hooks,
componentes y páginas.

```
src/
├── app/                  App.tsx, router.tsx, providers/
├── components/
│   ├── ui/                Button, Input, Select, Card, Badge, Modal, Drawer,
│   │                      Table, Spinner, EmptyState, Alert, Pagination, ConfirmDialog
│   ├── layout/            Sidebar, Header, UserMenu, MobileMenu, PageHeader
│   └── feedback/          Toaster, toast()
├── features/
│   ├── auth/              login, /me, AuthContext, ProtectedRoute, GuestRoute
│   ├── dashboard/         métricas + ventas recientes + stock bajo
│   ├── products/          CRUD de productos
│   ├── customers/        CRUD de clientes
│   ├── sales/             listado de ventas + "nueva venta" (POS)
│   └── users/             CRUD de usuarios (solo ADMIN)
├── layouts/               AuthLayout, DashboardLayout
├── shared/
│   ├── api/                apiClient.ts (única puerta de entrada HTTP), apiError.ts
│   ├── constants/         roles, claves de localStorage, nombre de eventos
│   ├── hooks/             useDebouncedValue
│   ├── types/              PaginatedResponse, ApiResponse, PaginationMeta
│   └── utils/              cn, formatCurrency, formatDate
├── main.tsx
└── index.css
```

Cada feature sigue el mismo flujo, de punta a punta:

```
Page  →  Hook (useProducts, useCustomers, useSales, useUsers, useAuth)
      →  Service (productsService, customersService, salesService, ...)
      →  apiClient (fetch + Authorization + manejo de errores)
      →  Backend REST
```

Ningún componente hace `fetch` directamente: siempre pasa por un hook y un
service. Esto es intencional para poder explicarlo capa por capa en clase.

## Autenticación

`POST /api/auth/login` devuelve `{ accessToken, user }`. El frontend:

1. Guarda `accessToken` en `localStorage`.
2. Guarda `user` en `AuthContext` (`features/auth/context`).
3. Redirige a `/dashboard`.

Al recargar la página, `AuthProvider` valida el token guardado llamando a
`GET /api/auth/me`; si falla (token vencido/corrupto), limpia la sesión y
manda a `/login`. Si cualquier petición del `apiClient` recibe `401`, se
dispara un evento (`UNAUTHORIZED_EVENT`) que `AuthProvider` escucha para
cerrar la sesión automáticamente — sin acoplar `apiClient` a React ni al router.

`ProtectedRoute` envuelve las rutas privadas y redirige a `/login` si no hay
sesión; `GuestRoute` hace lo inverso para `/login`. El logout es conceptual
(JWT stateless): solo se borra el token del cliente.

## Roles (RBAC en frontend)

`ProtectedRoute allowedRoles={['ADMIN']}` protege `/users`, y el sidebar oculta
esa opción para `SELLER`. Las páginas también ocultan botones de escritura
(crear/editar/eliminar) según el rol. **Esto es solo UX**: la autoridad real
sigue siendo el backend (`RolesGuard` de NestJS), que rechaza igualmente
cualquier petición no autorizada aunque alguien manipule el frontend.

## Flujo de una venta

`/sales/new` es una pantalla estilo POS con dos columnas:

- **Izquierda**: busca productos activos (`GET /products?search=&active=true`)
  y los agrega a un carrito local.
- **Derecha**: selecciona el cliente, muestra el carrito y un total de
  referencia (calculado en el cliente solo para mostrarlo mientras se arma
  la venta).

Al confirmar, el frontend envía **exactamente** el contrato que espera el
backend:

```json
{ "customerId": "...", "items": [{ "productId": "...", "quantity": 2 }] }
```

Nunca se envían precios ni stock: el backend los determina, valida el stock
real y calcula el total dentro de una transacción (ver README del backend).
La respuesta ya trae el total y los precios reales, que reemplazan cualquier
cálculo hecho en el cliente.

## Componentes reutilizables

`components/ui/`: `Button`, `Input`, `Select`, `Label`, `Card`, `Badge`, `Modal`,
`Drawer`, `Table` (+ `THead/TBody/TR/TH/TD`), `Spinner`, `EmptyState`, `Alert`,
`Pagination`, `ConfirmDialog`.

`components/layout/`: `Sidebar`, `SidebarItem`, `Header`, `UserMenu`,
`MobileMenu`, `PageHeader`.

Cada feature reutiliza estos componentes en vez de reinventarlos (por ejemplo,
`ProductForm`, `CustomerForm` y `UserForm` comparten `Input`/`Select`/`Label`/`Button`).

## Estados de interfaz

Todas las páginas que consumen la API contemplan **loading / error / empty /
success** (`Spinner`, `Alert`, `EmptyState`) — nunca se deja una pantalla en blanco.

## Manejo de errores

`apiClient` centraliza el parseo de errores del backend
(`{ statusCode, message, error }`) en una clase `ApiError`. `401` dispara logout
automático; el resto de códigos (400/403/404/409/422/500) se muestran con el
mensaje que envía el backend, sin exponer stack traces.

## Paginación y filtros

`Pagination.tsx` es el único componente de paginación, reutilizado por
Productos, Clientes, Ventas y Usuarios, y consume el `meta` que ya entrega el
backend (`page`, `limit`, `total`, `totalPages`). Los filtros (búsqueda,
estado activo) viven como estado en cada página y se pasan a los hooks;
la búsqueda usa `useDebouncedValue` para no disparar una petición por cada tecla.

## Funcionalidades

- Login / logout / sesión persistente
- Dashboard (métricas + ventas recientes + productos con stock bajo)
- Productos: listar, buscar, filtrar por estado, crear, editar, desactivar
- Clientes: listar, buscar, crear, editar, desactivar
- Ventas: listar (todas para ADMIN, propias para SELLER), ver detalle, registrar venta
- Usuarios (solo ADMIN): listar, crear, editar, desactivar

## Backend

Este frontend no depende de NestJS específicamente: consume un contrato REST
convencional (JSON, códigos HTTP estándar, `{ data }` / `{ data, meta }` /
`{ statusCode, message, error }`). Para apuntar a otro backend que respete el
mismo contrato (por ejemplo, uno hecho en Spring Boot), basta con cambiar
`VITE_API_URL` — no se toca ningún componente.
