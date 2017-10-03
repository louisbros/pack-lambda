#!/usr/bin/env node

const { spawn } = require('child_process');
const tarToZip = require('tar-to-zip');
const fs = require('fs');
const { stdout } = process;

const PACKAGE_ROOT = 'package/';

const pack = spawn('npm', ['pack']);

pack.on('close', _ => {
    const { npm_package_name, npm_package_version } = process.env;
    const name = `${npm_package_name}-${npm_package_version}`;
    const tarName = `${name}.tgz`;
    const zipName = `${name}.zip`;

    const zip = fs.createWriteStream(zipName);
    const progress = true;

    tarToZip(tarName, {
        filter: ({ name }) => name.substr(0, PACKAGE_ROOT.length) === PACKAGE_ROOT,
        map: ({ name }) => {
            return {
                name: name.substr(PACKAGE_ROOT.length)
            };
        }
    })
        .on('error', error => console.log(error))
        .getStream()
        .pipe(zip)
        .on('finish', _ => fs.unlinkSync(tarName));
});
