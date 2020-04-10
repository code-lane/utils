# @code-lane/config-factory
An NPM package containing a configuration factory that allows the usage of multiple decorators.

## Installation
Before installing, ensure that you have set @code-lane's registry in your npm configuration:

```bash
npm config set @code-lane:registry https://npm.pkg.github.com
```
You must also be logged in with appropriate credentials. Once this is done, you can proceed to install it like any npm package:

```bash
npm install @code-lane/config-factory
```

## Usage
```typescript
// config/index.ts
import { Env, secret, loadConfig } from '@code-lane/config-factory'

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
