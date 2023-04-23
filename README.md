<p align="center">
    <a href="https://www.codefactor.io/repository/github/osu-sakuru/sakuru-backend">
        <img src="https://www.codefactor.io/repository/github/osu-sakuru/sakuru-backend/badge" alt="CodeFactor" />
    </a>
</p>

# Sakuru-BackEnd

I will **NOT** provide any help nor advices how to use this on your project, I made this repo public because I feel like some people might use structure, or general idea of my project for their own projects.

**IF YOU DECIDE TO USE THIS, YOU ARE SOLELY RESPONSIBLE FOR IT.**

Current project structure:
```bash
├── CODEOWNERS
├── LICENSE
├── README.md
├── apps
│   ├── api
│   │   ├── src
│   │   │   ├── api
│   │   │   │   └── v1
│   │   │   ├── app.module.ts
│   │   │   ├── app.service.ts
│   │   │   ├── global.state.ts
│   │   │   ├── main.ts
│   │   │   └── v1
│   │   │       ├── auth
│   │   │       │   ├── auth.controller.ts
│   │   │       │   ├── auth.module.ts
│   │   │       │   ├── auth.service.ts
│   │   │       │   ├── jwt.strategy.ts
│   │   │       │   └── local.strategy.ts
│   │   │       ├── dto
│   │   │       ├── interfaces
│   │   │       ├── statistics
│   │   │       │   ├── statistics.controller.ts
│   │   │       │   ├── statistics.module.ts
│   │   │       │   └── statistics.service.ts
│   │   │       ├── twitch
│   │   │       │   ├── twitch.controller.ts
│   │   │       │   ├── twitch.module.ts
│   │   │       │   └── twitch.service.ts
│   │   │       ├── users
│   │   │       │   ├── users.controller.ts
│   │   │       │   ├── users.decorator.ts
│   │   │       │   ├── users.module.ts
│   │   │       │   └── users.service.ts
│   │   │       ├── v1.controller.ts
│   │   │       ├── v1.module.ts
│   │   │       ├── v1.service.ts
│   │   │       └── verification
│   │   │           ├── verification.gateway.ts
│   │   │           ├── verification.module.ts
│   │   │           └── verification.service.ts
│   │   └── tsconfig.app.json
│   ├── avatars
│   │   ├── src
│   │   │   ├── avatars.controller.ts
│   │   │   ├── avatars.module.ts
│   │   │   ├── avatars.service.ts
│   │   │   └── main.ts
│   │   └── tsconfig.app.json
│   ├── statistics
│   │   ├── src
│   │   │   ├── global.state.ts
│   │   │   ├── interfaces
│   │   │   ├── main.ts
│   │   │   ├── statistics.controller.ts
│   │   │   ├── statistics.module.ts
│   │   │   ├── statistics.service.ts
│   │   │   └── tasks
│   │   │       ├── tasks.module.ts
│   │   │       └── tasks.service.ts
│   │   └── tsconfig.app.json
│   └── twitch
│       ├── src
│       │   ├── global.state.ts
│       │   ├── interfaces
│       │   ├── main.ts
│       │   ├── tasks
│       │   │   ├── tasks.module.ts
│       │   │   └── tasks.service.ts
│       │   ├── twitch.controller.ts
│       │   ├── twitch.module.ts
│       │   └── twitch.service.ts
│       └── tsconfig.app.json
├── libs
│   └── shared
│       ├── src
│       │   ├── decorators
│       │   │   └── match.decorator.ts
│       │   ├── entities
│       │   │   └── index.ts
│       │   ├── enums
│       │   │   ├── GameModes.enum.ts
│       │   │   ├── ModeFilter.enum.ts
│       │   │   └── ModsFilter.enum.ts
│       │   ├── filters
│       │   │   └── rpc-exception.filter.ts
│       │   ├── guards
│       │   │   └── recaptcha.guard.ts
│       │   ├── http
│       │   │   ├── http.constants.ts
│       │   │   ├── http.module.ts
│       │   │   ├── http.servce.ts
│       │   │   └── interfaces
│       │   │       └── index.ts
│       │   ├── index.ts
│       │   ├── interfaces
│       │   │   ├── messages
│       │   │   └── responses
│       │   ├── shared.module.ts
│       │   ├── shared.service.ts
│       │   ├── shared.utils.ts
│       │   └── tcp-client
│       │       └── customClient.ts
│       └── tsconfig.lib.json
├── nest-cli.json
├── ormconfig.json
├── package.json
├── pm2-apps.json
├── tsconfig.build.json
├── tsconfig.json
└── yarn.lock
```
