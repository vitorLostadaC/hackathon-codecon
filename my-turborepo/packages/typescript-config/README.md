# @repo/typescript-config

Shared TypeScript configurations for the turborepo monorepo.

## Architecture

```
base.json (minimal shared settings)
├── node.json (Node.js/backend)
├── web.json (vanilla web/browser)
├── react.json (React applications)
├── react-library.json (React libraries with declarations)
├── nextjs.json (Next.js applications)
├── electron-node.json (Electron main process)
└── electron-web.json (Electron renderer)
```
