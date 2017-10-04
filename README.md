# pack-lambda

## Leverages npm's pack cmd to create a lambda zip

### Install
```
npm i --save-dev pack-lambda
```

### Setup

package.json
```
"scripts": {
    "build": "pack-lambda"
}
...
"bundledDependencies": [
    "aws-sdk"
]
```

.npmignore
```
*
!node_modules/**
!index.js
```

### Run
```
npm run build
```

### Run with path mappings
Moves any files inside the `build/` directories up to the root.
```
npm run build -m build/:
```

Moves any files inside the `build/` into a `dist/` directory.
```
npm run build -m build/:dist/
```

Multiple mappings.
```
npm run build -m build/:dist/ -m conf/:config/
```
