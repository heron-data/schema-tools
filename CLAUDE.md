# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based JSON Schema Builder tool that allows users to create and edit JSON schemas with a visual interface. The application features two-way editing between a tree view editor and raw JSON schema text.

## Commands

```bash
# Development
pnpm install           # Install dependencies
pnpm dev              # Start development server on port 3001
pnpm build            # Build for production
pnpm serve            # Preview production build
pnpm typecheck        # Run TypeScript type checking

# Alternative start command
pnpm start            # Same as pnpm dev
```

## Architecture

### Core JSON Schema System
- **Types**: Located in `src/lib/json-schema/types.ts` - Defines TypeScript types for JSON schema elements (StringType, NumberType, BooleanType, ArrayType, ObjectType)
- **State Management**: `src/lib/json-schema/state.ts` - Converts between JSON schema and internal PropertyBuilderState representation
- **Builder**: `src/lib/json-schema/builder.ts` - Core logic for schema manipulation including add/remove/update operations with localStorage persistence
- **Context**: `src/lib/json-schema/context.tsx` - React context provider using useSyncExternalStore for state management

### UI Components
- **Main Editor**: `src/components/json-schema-editor/JSONSchemaEditor.tsx` - Split-pane layout with tree view and text editor
- **Properties Tree**: `src/components/json-schema-editor/PropertiesTree.tsx` - Tree view for editing schema properties
- **Property Builder**: `src/components/json-schema-editor/PropertyBuilderDialog.tsx` and `PropertyBuilderForm.tsx` - Modal forms for editing individual properties
- **Schema Text Viewer**: `src/components/json-schema-editor/SchemaTextViewer.tsx` - JSON text editor with syntax highlighting

### UI Foundation
- **Shadcn/UI**: Component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library

### Key Features
- **Persistent State**: Uses localStorage to save schema edits
- **Two-way Editing**: Changes in tree view reflect in JSON text and vice versa
- **Validation Support**: Built-in support for JSON schema validation constraints
- **Nested Objects**: Full support for complex nested object structures

### Build Configuration
- **Vite**: Build tool with React plugin and TanStack Router
- **Path Alias**: `@/` maps to `src/` directory
- **TypeScript**: Strict type checking enabled

### State Management Pattern
The application uses a custom state management system with:
- External store pattern with `useSyncExternalStore`
- Immutable state updates
- Automatic localStorage persistence
- Property key-based navigation for nested structures

## Development Notes

- The application runs on port 3001 by default
- Uses pnpm as the package manager
- State is automatically persisted to localStorage under the key 'json-schema-builder'
- The initial schema includes a sample nested structure for demonstration