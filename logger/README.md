# @code-lane/logger
An NPM package containing a modification of the Winston logger for Codelane's Express-Typescript projects.

## Installation
Before installing, ensure that you have set @code-lane's registry in your npm configuration:

```bash
npm config set @code-lane:registry https://npm.pkg.github.com
```
You must also be logged in with appropriate credentials. Once this is done, you can proceed to install it like any npm package:

```bash
npm install @code-lane/logger
```

## Usage
```typescript
// /src/index.ts
import express = require('express')
import * as ewinston from 'express-winston'
import logger from '@code-lane/logger'
import { errorMiddleware } from '@code-lane/express-http-error'
import config from './config'
import { api } from './api'

// The logger can be set up to log errors anywhere
process.on('uncaughtException', (err) => {
  logger.error('Unhandled Exception:', { err: err, stack: err.stack })
})

// It can also be used to print information
logger.info('Config loaded: ', config)

// The logger can also be set up with any external packages, for example redis
redisClient.on('error', (e: Error) => logger.error('Redis Error: ', e)) 

const app = express()

// Load it with your middleware with express-winston ...
app.use(ewinston.logger({ winstonInstance: logger, expressFormat: true }))

// ... and now it can be used in endpoints too!
iam.get('/:exampleParam', async (req: express.Request, res: express.Response) => {
  try {
    if (req.params.exampleParam === 'hello') {
      logger.warn('Careful, a request was made with the secret word "hello"!')
      res.status(200).send('Hello World!')
    }
  } catch (e) {
    logger.error(e)
    res.status(400).send('Nop, that\'s not it!')
  }
})

app.listen(8080, '127.0.0.1')

```
