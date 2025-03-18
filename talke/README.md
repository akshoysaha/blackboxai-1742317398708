# Talke - Matrix-based Chat Application

A modern chat application built with Remix, TypeScript, and Matrix Protocol integration.

## Prerequisites

- Node.js >= 20.0.0
- npm >= 9.0.0
- Docker (for running Synapse locally)

## Local Development Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Setting up Synapse Locally

Synapse is the reference Matrix homeserver implementation. Here's how to set it up locally:

1. Install Docker if you haven't already: [Docker Installation Guide](https://docs.docker.com/get-docker/)

2. Create a directory for Synapse data:
```bash
mkdir synapse-data
```

3. Generate the Synapse configuration:
```bash
docker run -it --rm \
    -v $(pwd)/synapse-data:/data \
    -e SYNAPSE_SERVER_NAME=localhost \
    -e SYNAPSE_REPORT_STATS=no \
    matrixdotorg/synapse:latest generate
```

4. Start Synapse server:
```bash
docker run -d --name synapse \
    -v $(pwd)/synapse-data:/data \
    -p 8008:8008 \
    matrixdotorg/synapse:latest
```

5. Create a new user account (replace username and password):
```bash
docker exec -it synapse register_new_matrix_user \
    http://localhost:8008 \
    -c /data/homeserver.yaml \
    -u yourusername \
    -p yourpassword \
    -a
```

## Connecting Talke to Synapse

1. In the Talke application, use the following homeserver URL:
```
http://localhost:8008
```

2. Log in using the credentials you created in step 5 of the Synapse setup.

## Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Configure your environment variables in `.env`:
```env
# Required: Matrix homeserver URL
MATRIX_HOMESERVER_URL=http://localhost:8008

# Required: Session configuration
SESSION_SECRET=your-secret-key-min-32-chars

# Optional: Default credentials for development
# MATRIX_USER=your_username
# MATRIX_PASSWORD=your_password

# Optional: Development configuration
# NODE_ENV=development
```

The application uses several key configurations:
- Matrix client (`app/config/matrix.ts`): Handles connection to your Synapse server
- Session management (`app/utils/session.server.ts`): Manages user authentication state
- Matrix service (`app/services/matrix.server.ts`): Provides Matrix protocol interactions

Make sure to set a secure SESSION_SECRET in production (minimum 32 characters).

## Features

- Real-time chat using Matrix Protocol
- End-to-end encryption
- File sharing
- User presence
- Room management
- Direct messaging

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint

## Project Structure

```
talke/
├── app/
│   ├── components/    # Reusable UI components
│   ├── routes/        # Application routes
│   ├── services/      # Business logic and API calls
│   ├── styles/        # Global styles and Tailwind config
│   └── utils/         # Helper functions and utilities
├── public/           # Static assets
└── tests/           # Test files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
