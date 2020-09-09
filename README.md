# Codelane utils
Codelane's private NPM modules repository, containing the following libraries:
- express-http-error
- logger
- config-factory

## Manual usage

Before installing, ensure that you have set @code-lane's registry in your npm configuration:
```bash
npm config set @code-lane:registry https://npm.pkg.github.com
```

You must also be logged in with appropriate credentials.
```bash
npm login --registry=https://npm.pkg.github.com
> Username: USERNAME
> Password: TOKEN/PASSWORD
> Email: PUBLIC-EMAIL-ADDRESS
```

Once this is done, you can proceed to install it like any npm package:
```bash
npm install @code-lane/<package-name>
```

## CI-CD pipelines

Two options:
1. If you are using GitHub Actions for your pipeline, just use a GITHUB_TOKEN to authenticate.

2. If you are using another pipeline/CI-CD framework, Place the following content in an ```.npmrc``` file in the same directory as your ```package.json```, replacing <GITHUB_ACCESS_TOKEN> with the corresponding value:

    ```
    //npm.pkg.github.com/:_authToken=<GITHUB_ACCESS_TOKEN>
    registry=https://registry.npmjs.org
    @code-lane:registry=https://npm.pkg.github.com/code-lane
    ```
