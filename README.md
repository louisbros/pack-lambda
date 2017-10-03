# pack-lambda

## Leverages npm's pack cmd to create a lambda zip

### Install
```
npm i --save-dev pack-lambda
```

### Usage

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
