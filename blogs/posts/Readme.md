# How to Create a TypeScript REST API with Express and Deploy to Vercel

This documentation outlines the process of setting up a TypeScript-based Express API server and deploying it to Vercel.

## Introduction

We're creating a simple REST API using Express with TypeScript that:

- Manages a collection of blog posts in memory
- Provides endpoints to:
  - Create new posts
  - Retrieve all posts
- Includes proper TypeScript typing
- Is configured for easy deployment to Vercel

The API demonstrates modern backend development practices including:

- Type safety with TypeScript
- Environment variable configuration
- Proper project structure
- Development tooling
- Deployment configuration

## Project Setup

### 1. Initialize Node.js Project

```bash
npm init -y
```

This creates a `package.json` file with default values. The `-y` flag accepts all defaults.

### 2. Install Runtime Dependencies

```bash
npm i express cors axios body-parser dotenv
```

- **express**: Web framework for Node.js
- **cors**: Middleware for enabling CORS
- **axios**: HTTP client for making requests
- **body-parser**: Middleware for parsing request bodies
- **dotenv**: Loads environment variables from .env file

### 3. Install Development Dependencies

```bash
npm i -D typescript ts-node-dev nodemon @types/express @types/node
```

- **typescript**: TypeScript compiler
- **ts-node-dev**: Runs TypeScript files directly with hot reload
- **nodemon**: Watches for file changes and restarts server
- **@types/express**: Type definitions for Express
- **@types/node**: Type definitions for Node.js

### 4. Initialize TypeScript Configuration

```bash
npx tsc --init --rootDir src --outDir dist
```

Creates `tsconfig.json` with:

- `rootDir`: Source files location (`src`)
- `outDir`: Compiled JavaScript output location (`dist`)

## Project Structure

```
project-root/
├── src/
│   └── index.ts        # Main application file
├── .env                # Environment variables
├── package.json        # Project configuration
├── tsconfig.json       # TypeScript configuration
└── vercel.json         # Vercel deployment configuration
```

## Key Files Explained

### 1. tsconfig.json

```json
{
  "compilerOptions": {
    /* Language and Environment */
    "target": "es2016" /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */,

    /* Modules */
    "module": "commonjs" /* Specify what module code is generated. */,
    "rootDir": "src" /* Specify the root folder within your source files. */,

    // "outFile": "./",                                  /* Specify a file that bundles all outputs into one JavaScript file. If 'declaration' is true, also designates a file that bundles all .d.ts output. */
    "outDir": "dist" /* Specify an output folder for all emitted files. */,

    "esModuleInterop": true /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. */,
    // "preserveSymlinks": true,                         /* Disable resolving symlinks to their realpath. This correlates to the same flag in node. */
    "forceConsistentCasingInFileNames": true /* Ensure that casing is correct in imports. */,

    /* Type Checking */
    "strict": true /* Enable all strict type-checking options. */,
    // "skipDefaultLibCheck": true,                      /* Skip type checking .d.ts files that are included with TypeScript. */
    "skipLibCheck": true /* Skip type checking all .d.ts files. */
  },

  "include": ["src"], // which files to compile
  "exclude": ["node_modules"] // which files to skip
}
```

The TypeScript configuration file specifies:

- Target ECMAScript version (es2016)
- Module system (CommonJS)
- Source and output directories
- Strict type checking
- ES module interoperability

### 2. package.json Scripts

```json
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only --exit-child src/index.ts"
}
```

- `dev`: Runs the server in development mode with:
  - `--respawn`: Restarts on file changes
  - `--transpile-only`: Faster compilation (no type checking)
  - `--exit-child`: Properly exits on termination

### 3. src/index.ts

```typescript
import express, { Request, Response, Application } from "express";
import { randomBytes } from "crypto";
import bodyParser from "body-parser";
import dotenv from "dotenv";

// Configuration
dotenv.config();
const PORT = process.env.PORT || 4000;

// Types
interface Post {
  id: string;
  title: string;
}

interface Posts {
  [key: string]: Post;
}

// App State
const posts: Posts = {};

// Express App Setup
const app: Application = express();
app.use(bodyParser.json());

// Helper Functions
const generateId = (): string => randomBytes(4).toString("hex");

// Controllers
const getRoot = (req: Request, res: Response) => {
  res.send("Assalamualikum");
};

const getAllPosts = (req: Request, res: Response) => {
  res.json(posts);
};

const createPost = (req: Request, res: Response) => {
  const id = generateId();
  const { title } = req.body;

  if (!title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }

  posts[id] = { id, title };
  res.status(201).json(posts[id]);
};

// Routes
app.get("/", getRoot);
app.get("/posts", getAllPosts);
app.post("/posts", createPost);

// Server Initialization
const startServer = async (): Promise<void> => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
      // Logger.logger.info(`Server is running on port: ${PORT}`); // if you have logging
    });
  } catch (error) {
    console.error(`Failed to start server: ${error}`);
    // Logger.errorLogger.error(`Failed to start server: ${error}`); // if you have logging
    process.exit(1); // Exit with failure code
  }
};

startServer();
```

The main application file contains:

#### Configuration

- Loads environment variables
- Sets default port (4000)

#### Types

- Defines `Post` and `Posts` interfaces for type safety

#### State

- In-memory store for posts (for demonstration)

#### Express Setup

- Creates Express app
- Adds JSON body parser middleware

#### Routes

- GET `/`: Root endpoint
- GET `/posts`: Get all posts
- POST `/posts`: Create new post

#### Server Initialization

- Starts server with error handling

### 4. vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.ts"
    }
  ]
}
```

Vercel deployment configuration:

- Specifies the entry point (`src/index.ts`)
- Routes all requests to the Express app
- Uses `@vercel/node` builder for Node.js applications

## Development Workflow

1. Create `.env` file with:

   ```bash
   PORT=4000
   ```

2. Start development server:

   ```bash
   npm run dev
   ```

3. The server will:
   - Start on specified port
   - Restart on file changes
   - Show logs in console

## Deployment to Vercel

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Verify Installation

```bash
npx vercel --version
```

### 3. Login to Vercel

```bash
npx vercel login
```

### 4. Deploy to Vercel

For preview deployment:

```bash
npx vercel
```

For production deployment:

```bash
npx vercel --prod
```

## API Endpoints

### GET /

- **Description**: Root endpoint
- **Response**: "Assalamualikum"

### GET /posts

- **Description**: Get all posts
- **Response**: JSON object of all posts

### POST /posts

- **Description**: Create new post
- **Body**: `{ "title": "Post Title" }`
- **Response**: Created post with generated ID

## Type Safety

The application uses TypeScript interfaces to ensure type safety:

```typescript
interface Post {
  id: string;
  title: string;
}

interface Posts {
  [key: string]: Post;
}
```

This provides:

- Autocompletion in IDEs
- Compile-time type checking
- Clear data structure documentation
