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

### Options
Moves any files inside the `build/` directory up to the root.
```
pack-lambda -m build/:
```

Moves any files inside `build/` into a `dist/` directory.
```
pack-lambda -m build/:dist/
```

Multiple mappings.
```
pack-lambda -m build/:dist/ -m conf/:config/
```

Exclude version from output filename
```
pack-lambda --exclude-output-version
```
