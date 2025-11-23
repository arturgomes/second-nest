# Blog Monorepo

A full-stack blog application with NestJS API backend and Next.js frontend.

## 📁 Project Structure

```
blog-monorepo/
├── packages/
│   ├── api/          # NestJS backend (TypeScript)
│   └── web/          # Next.js frontend (TypeScript + Tailwind)
└── package.json      # Workspace configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ 
- npm v7+ (for workspaces support)

### Installation

```bash
# Install all dependencies for both packages
npm install
```

### Development

```bash
# Run both API and web concurrently
npm run dev

# Or run individually:
npm run dev:api    # API on http://localhost:3000
npm run dev:web    # Web on http://localhost:3001
```

### Build

```bash
# Build both packages
npm run build

# Or build individually:
npm run build:api
npm run build:web
```

### Testing

```bash
# Run API tests
npm run test:api

# Run E2E tests
npm run test:e2e
```

## 📦 Packages

### API (packages/api)

NestJS REST API with:
- **Authentication** - JWT-based auth
- **Users** - User management
- **Posts** - Blog post CRUD
- **Comments** - Post comments
- **Likes** - Post likes
- **Database** - SQLite with Prisma ORM

**Endpoints:**
- `POST /auth/login` - User login
- `GET /posts` - List posts (paginated)
- `GET /posts/:id` - Get post details
- `POST /posts` - Create post (auth required)
- `PATCH /posts/:id` - Update post (auth required)
- `DELETE /posts/:id` - Delete post (auth required)
- And more...

### Web (packages/web)

Next.js frontend with:
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling
- **App Router** - Next.js 13+ routing
- **API Integration** - Type-safe API client
- **Authentication** - JWT token management
- **Mocked Components** - Ready for styling

**Pages:**
- `/` - Home (posts list)
- `/login` - Login page
- `/posts/[id]` - Post detail
- `/posts/new` - Create post

## 🔧 Configuration

### Environment Variables

#### API (.env in packages/api)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
PORT=3000
```

#### Web (.env.local in packages/web)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🏗️ Architecture

### API Integration Layer

The frontend includes a complete API integration layer:

- **Types** (`lib/api/types.ts`) - TypeScript definitions matching backend
- **Client** (`lib/api/client.ts`) - Axios instance with interceptors
- **Services** (`lib/api/services/`) - Type-safe API functions
  - `authService` - Authentication
  - `postsService` - Posts CRUD
  - `usersService` - Users CRUD

### Authentication Flow

1. User logs in via `LoginForm`
2. Token stored in localStorage
3. `AuthContext` manages auth state
4. API client automatically adds token to requests
5. Protected routes check auth status

## 🎨 Frontend Implementation

The frontend has **mocked components** with clear structure and TODO comments. You should implement:

- **Styling** - Add Tailwind CSS classes
- **Loading States** - Skeleton loaders, spinners
- **Error Handling** - Better error UI
- **Forms** - Validation, rich text editor
- **Features** - Comments, likes, search, filters

## 📚 Learning Resources

### Key Files to Study

**API Integration:**
- `packages/web/src/lib/api/types.ts` - Type definitions
- `packages/web/src/lib/api/client.ts` - API client setup
- `packages/web/src/lib/api/services/` - Service functions

**State Management:**
- `packages/web/src/contexts/AuthContext.tsx` - Authentication context

**Components:**
- `packages/web/src/components/` - Mocked UI components

**Backend:**
- `packages/api/src/main.ts` - API entry point
- `packages/api/src/*/controllers.ts` - API endpoints

## 🛠️ Available Scripts

### Root Level
- `npm run dev` - Run both API and web
- `npm run dev:api` - Run API only
- `npm run dev:web` - Run web only
- `npm run build` - Build both packages
- `npm run test:api` - Run API tests
- `npm run lint` - Lint both packages

### Package Level
```bash
# Run scripts in specific package
npm run <script> --workspace=@blog/api
npm run <script> --workspace=@blog/web
```

## 🔐 API Authentication

Protected endpoints require JWT token in Authorization header:

```typescript
Authorization: Bearer <token>
```

The frontend API client handles this automatically.

## 📝 Next Steps

1. **Style the components** - Add Tailwind CSS to mocked components
2. **Add features** - Implement comments, likes, search
3. **Improve UX** - Loading states, error handling, notifications
4. **Add tests** - Frontend tests with Jest/React Testing Library
5. **Deploy** - Set up CI/CD and deployment

## 🤝 Contributing

This is a learning project. Feel free to:
- Implement the mocked components
- Add new features
- Improve the architecture
- Add tests



**Happy coding!** 🚀 Start by implementing the UI components in `packages/web/src/components/`.
