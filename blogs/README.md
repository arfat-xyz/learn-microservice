# Microservices Blog Application

This is a modern blog application built using a microservices architecture. The application is composed of multiple independent services that work together to provide a complete blogging platform.

## Services Overview

The application consists of the following microservices:

- **Posts Service**: Handles creation and management of blog posts
- **Comments Service**: Manages comments on blog posts
- **Query Service**: Handles data querying and aggregation
- **Moderation Service**: Manages comment moderation
- **Event Bus**: Manages inter-service communication
- **Client**: React frontend application

## Technology Stack

- **Backend**: Node.js with Express and TypeScript
- **Frontend**: React.js
- **Communication**: Event-driven architecture using a custom event bus
- **Development**: Docker for containerization (optional)

## Prerequisites

Before running the application, make sure you have the following installed:

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

## Installation and Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd blogs
```

2. Install dependencies for each service:

```bash
# Install dependencies for Posts Service
cd posts
npm install

# Install dependencies for Comments Service
cd ../comments
npm install

# Install dependencies for Query Service
cd ../query
npm install

# Install dependencies for Moderation Service
cd ../moderate-comment
npm install

# Install dependencies for Event Bus
cd ../event-bus
npm install

# Install dependencies for Client
cd ../client
npm install
```

## Running the Application

1. Start each service in a separate terminal window:

```bash
# Start Posts Service
cd posts
npm run dev

# Start Comments Service
cd comments
npm run dev

# Start Query Service
cd query
npm run dev

# Start Moderation Service
cd moderate-comment
npm run dev

# Start Event Bus
cd event-bus
npm run dev

# Start Client Application
cd client
npm start
```

The services will be running on the following ports by default:

- Posts Service: http://localhost:4000
- Comments Service: http://localhost:4001
- Query Service: http://localhost:4002
- Moderation Service: http://localhost:4003
- Event Bus: http://localhost:4005
- Client Application: http://localhost:3000

## Architecture Overview

### Service Communication

The application uses an event-driven architecture where services communicate through an event bus. When an action occurs in any service:

1. The service emits an event to the event bus
2. The event bus broadcasts the event to all other services
3. Interested services process the event and update their state accordingly

### Data Consistency

Each service maintains its own database and data consistency is achieved through the event-driven architecture. The Query service maintains a denormalized view of all the data for efficient querying.

### Features

1. **Posts Service**

   - Create new blog posts
   - List all posts
   - Delete posts

2. **Comments Service**

   - Add comments to posts
   - List comments for a post
   - Delete comments

3. **Moderation Service**

   - Moderate comments
   - Filter inappropriate content

4. **Query Service**
   - Provides efficient data querying
   - Maintains synchronized data from all services

## Development Guidelines

### Adding New Features

1. Identify the service responsible for the feature
2. Implement the feature in the service
3. Emit appropriate events through the event bus
4. Update the Query service to handle new events if needed
5. Update the client application to use the new feature

### Error Handling

- Each service should handle errors gracefully
- Services should be resilient to other services being down
- The event bus implements retry mechanisms for failed events

## Troubleshooting

Common issues and solutions:

1. **Service not starting**

   - Check if the port is already in use
   - Verify all dependencies are installed
   - Check for TypeScript compilation errors

2. **Events not propagating**

   - Ensure the event bus service is running
   - Check network connectivity between services
   - Verify event payload format

3. **Client can't connect to services**
   - Verify all services are running
   - Check CORS configuration
   - Verify API endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License.
