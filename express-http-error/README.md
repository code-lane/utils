# @code-lane/express-http-error
NPM module with the necessary middleware for HTTP error handling in Express projects using Typescript.

## Installation
Ensure you have followed the configuration steps described in thhe repository's [README](https://github.com/code-lane/utils/blob/master/README.md).

```bash
npm install @code-lane/express-http-error
```

## Usage
Setting up the error middleware:
```typescript
// src/index.ts
import express = require('express')
import { errorMiddleware } from '@code-lane/express-http-error'

const app = express()

// set up all middleware first
app.use(cors())

// then import all your routes
app.use('/api', api)

// finally, apply the error middleware LAST
app.use(errorMiddleware)

app.listen(8080, '127.0.0.1')

```

Throwing HTTP errors within an endpoint logic:
```typescript
// /src/api/yourEndpoint.ts
import * as express from 'express'
import { HttpError } from '@code-lane/express-http-error'

iam.get('/:exampleParam', async (req: express.Request, res: express.Response) => {
  if (req.params.exampleParam === 'hello') {
      res.send('Hello World!')
  }
  throw new HttpError(400, 'Only parameter "hello" is accepted.')
})

```

The allowed arguments for the <code>HttpError</code> function are:
- **httpCode** {number} => A valid HTTP code.
- **message** {string} => The error message you want to display in the response.
- **error** {Error} (optional) => In case you want to pass the error manually.
- **name** {string} (optional) => Name of the error (default: "httpError")
