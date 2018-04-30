#!/usr/bin/env node

const { spawn } = require('child_process');
const tarToZip = require('tar-to-zip');
const fs = require('fs');
const { stdout } = process;
const argv = require('minimist')(process.argv.slice(2));

const PACKAGE_ROOT = 'package/';
const DEFAULT_MAPPINGS = {
    [PACKAGE_ROOT]: ''
};

const getMappings = argv => {
    const mappingArgs = argv['m'] && (Array.isArray(argv['m']) ? argv['m'] : [argv['m']]) || [];
    return mappingArgs.reduce((map, mapping) => {
        const [from, to] = mapping.split(':');
        map[from] = to;
        return map;
    }, DEFAULT_MAPPINGS);
};

const getNameParts = () => {
    const { npm_package_name, npm_package_version } = process.env;

    const nameParts = npm_package_name.replace('@', '').split('/');
    const scope = nameParts.slice(0, -1);
    const name = nameParts.slice(-1);
    const version = npm_package_version;

    return { scope, name, version };
};

const getFullName = () => {
    const { scope, name, version } = getNameParts();
    return [].concat(scope, name, version).join('-');
};

const getName = () => {
    const { scope, name, version } = getNameParts();
    let nameParts = [];

    if (!argv['exclude-scope']) {
        nameParts = nameParts.concat(scope);
    }

    nameParts = nameParts.concat(name);

    if (!argv['exclude-version']) {
        nameParts = nameParts.concat(version);
    }

    return nameParts.join('-');
};

const mappings = getMappings(argv);

const pack = spawn('npm', ['pack']);

pack.on('close', _ => {
    const { npm_package_name, npm_package_version } = process.env;
    const name = `${npm_package_name}-${npm_package_version}`;
    const tarName = `${getFullName()}.tgz`;
    const zipName = `${getName()}.zip`;

    const zip = fs.createWriteStream(zipName);
    const progress = true;

    tarToZip(tarName, {
        filter: ({ name }) => name.substr(0, PACKAGE_ROOT.length) === PACKAGE_ROOT,
        map: ({ name }) => {
            return {
                name: Object.keys(mappings).reduce((mapped, key) => mapped.replace(key, mappings[key]), name)
            };
        }
    })
        .on('error', error => console.log(error))
        .getStream()
        .pipe(zip)
        .on('finish', _ => fs.unlinkSync(tarName));
});
