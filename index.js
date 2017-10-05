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

const getOutputName = argv => {
    const { npm_package_name, npm_package_version } = process.env;

    return argv['exclude-output-version'] ?
        `${npm_package_name}.zip` :
        `${npm_package_name}-${npm_package_version}.zip`
};

getOutputName(argv);

const mappings = getMappings(argv);

const pack = spawn('npm', ['pack']);

pack.on('close', _ => {
    const { npm_package_name, npm_package_version } = process.env;
    const name = `${npm_package_name}-${npm_package_version}`;
    const tarName = `${name}.tgz`;
    const zipName = getOutputName(argv);

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
