var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');
var glob = require('glob');
var args = require('minimist')(process.argv);


glob('dist/**/*.css', (err, files) => {

    files.forEach(file => {
        fs.readFile(file, 'utf8', (err, data) => {

            let lessfile = file.replace('.css', '.less');

            data = `.uk-noconflict {\n${data}\n}`;

            fs.writeFile(lessfile, data.replace(/(uk-([a-z\d\-]+))/g, `uk-$2`), err => {

                if (err) {
                    return console.log(err);
                }

                exec(`lessc ${lessfile} > ${file}`, (error, stdout, stderr) => {

                    if (stderr) {
                        console.log(`Error building: ${file}`, stderr);
                    } else {

                        fs.readFile(file, 'utf8', (err, data) => {

                            data = data.replace(/\.uk-noconflict {(.*)}/m, '')
                                       .replace(`.uk-noconflict html`, `.uk-noconflict`)
                                       .replace(/\.uk-noconflict\s(\.(uk-(drag|modal-page)))/g, '$1');

                            fs.writeFile(file, data);
                        });

                        console.log(`${file} build `);
                    }

                    fs.unlink(lessfile);
                });
            });
        });
    });
});