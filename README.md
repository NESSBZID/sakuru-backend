# Sakuru-BackEnd

Current project structure:
```sh
sakuru-next-back/
├── README.md
├── apps
│   ├── api
│   │   ├── src
│   │   │   ├── app.module.ts
│   │   │   ├── app.service.ts
│   │   │   ├── global.state.ts
│   │   │   ├── http
│   │   │   │   ├── http.constants.ts
│   │   │   │   ├── http.module.ts
│   │   │   │   ├── http.servce.ts
│   │   │   │   └── interfaces
│   │   │   │       └── index.ts
│   │   │   ├── main.ts
│   │   │   ├── utils.ts
│   │   │   └── v1
│   │   │       ├── auth
│   │   │       │   ├── auth.controller.ts
│   │   │       │   ├── auth.module.ts
│   │   │       │   ├── auth.service.ts
│   │   │       │   ├── jwt.strategy.ts
│   │   │       │   └── local.strategy.ts
│   │   │       ├── dto
│   │   │       ├── enums
│   │   │       │   ├── ModeFilter.enum.ts
│   │   │       │   └── ModsFilter.enum.ts
│   │   │       ├── interfaces
│   │   │       ├── statistics
│   │   │       │   ├── statistics.controller.ts
│   │   │       │   ├── statistics.module.ts
│   │   │       │   └── statistics.service.ts
│   │   │       ├── twitch
│   │   │       │   ├── twitch.controller.ts
│   │   │       │   ├── twitch.module.ts
│   │   │       │   └── twitch.service.ts
│   │   │       ├── users
│   │   │       │   ├── users.controller.ts
│   │   │       │   ├── users.decorator.ts
│   │   │       │   ├── users.module.ts
│   │   │       │   └── users.service.ts
│   │   │       ├── v1.controller.ts
│   │   │       ├── v1.module.ts
│   │   │       └── v1.service.ts
│   │   └── tsconfig.app.json
│   ├── avatars
│   │   ├── src
│   │   │   ├── avatars.controller.spec.ts
│   │   │   ├── avatars.controller.ts
│   │   │   ├── avatars.module.ts
│   │   │   ├── avatars.service.ts
│   │   │   └── main.ts
│   │   └── tsconfig.app.json
│   └── statistics
│       ├── src
│       │   ├── app.controller.ts
│       │   ├── app.module.ts
│       │   ├── app.service.ts
│       │   ├── main.ts
│       │   └── tasks
│       │       ├── tasks.module.ts
│       │       └── tasks.service.ts
│       └── tsconfig.app.json
├── libs
│   └── shared
│       ├── src
│       │   ├── entities
│       │   │   ├── index.ts
│       │   │   └── mapRequests.ts
│       │   ├── index.ts
│       │   ├── shared.module.ts
│       │   └── shared.service.ts
│       └── tsconfig.lib.json
├── nest-cli.json
├── ormconfig.json
├── package.json
├── tsconfig.build.json
├── tsconfig.json
└── yarn.lock
```
