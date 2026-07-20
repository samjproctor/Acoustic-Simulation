# Acoustic Simulation

Welcome to the Acoustic Simulation project repository. This project establishes a modern, modular, and fault-isolated architecture combining a React UI with a 3D visualization engine.

## Documentation

Comprehensive documentation is available in the `docs/` directory:

- [User Guide](docs/USER_GUIDE.md): Instructions on installation, setup, running the application, and executing tests.
- [Architecture Document](docs/ARCHITECTURE.md): Detailed information on the technology stack, modularization strategy, state management, and fault isolation mechanisms.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run QA test suite
npm run test
```

## Structure Overview

This project implements strict separation of concerns, ensuring the 3D Visualization Layer remains entirely decoupled from the Core UI Layer. Communication between layers is strictly mediated by a centralized Zustand state store and strict TypeScript contracts.
