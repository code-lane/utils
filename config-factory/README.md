# @code-lane/config-factory
An NPM package containing a configuration factory that allows the usage of multiple decorators.

## Installation
Before installing, ensure you have followed the configuration steps described in the repository's [README](https://github.com/code-lane/utils/blob/master/README.md)

```bash
npm install @code-lane/config-factory
```

## Usage
```typescript
// config/index.ts
import { Env, Secret, loadConfig } from '@code-lane/config-factory'

type EnvValType = string | number | boolean | undefined | null

// Optional: If you have a .env file in your directory, you can load it here
import * as dotenv from 'dotenv'
dotenv.config()

export class Config {
  [key: string]: EnvValType
  
  // Default type is string, so no need to specify
  // If no environment variable is found with the specified name, 
  // then the value assigned here will be used
  @Env()
  NODE_ENV = 'development'
  
  // But you can declare different types
  @Env({ type: 'boolean' })
  IS_TRUE = true

  @Env({ type: 'number' })
  PORT = 8001

  // Using the secret decorator is easy, just add it on top
  @Secret()
  @Env()
  SECRET = 'Atscg3#$fs7dRB@9gn%2Ep8'

  // Remember, if you set a variable to undefined, it will be undefined unless it is found in the environment
  @Env()
  SOME_ENV_VAR = undefined

}

// And finally, we need to LOAD and export the configuration:
export default loadConfig(Config)

```
