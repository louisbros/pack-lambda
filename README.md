# pack-lambda

## Leverages npm's pack cmd to create a zip file that can be deployed to AWS Lambda

### Install
```
npm i --save-dev pack-lambda
```

### Setup

#### package.json

Use `bundledDependencies` to include dependencies within the package.

```
"scripts": {
    "package": "pack-lambda -m build/: --exclude-version --exclude-scope"
}
...
"dependencies": {
    "aws-sdk": "2.x.x",
    "node-fetch": "2.x.x"
}
...
"bundledDependencies": [
    "node-fetch"
]
```

#### .npmignore

Use the `.npmignore` file to define what should be packaged within the zip.

```
*
!/node_modules/**
!/build/**
!/package.json
```

### Run
```
npm run build
```

### Options
Move any files inside the `build/` directory up to the root.
```
pack-lambda -m build/:
```

Move any files inside `build/` into a `dist/` directory.
```
pack-lambda -m build/:dist/
```

Multiple mappings.
```
pack-lambda -m build/:dist/ -m conf/:config/
```

Exclude version from output filename
```
pack-lambda --exclude-version
```

Exclude npm scope from output filename. If the package name is `@company/package` then the output zip name will be `package-1.0.0.zip`.
```
pack-lambda --exclude-scope
```
