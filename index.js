const argv = require('yargs')
    .usage('Usage: $0 [options]')
    .example('$0 -t templateFile.csv -o outputFile.csv -c 1000', 'generates 1000 lines of fake data into the outputFile based on the templateFile')
    .example('$0 --template templateFile.csv --output outputFile.csv --rows 50', 'generates 50 lines of fake data into the outputFile based on the templateFile')
    .alias('t', 'template')
    .alias('o', 'output')
    .alias('r', 'rows')
    .nargs('t', 1)
    .nargs('o', 1)
    .nargs('r', 1)
    .describe('t', 'the template file which describes what data is to be faked')
    .describe('o', 'the output file which points to the file to create as the output of this script')
    .describe('r', 'the number of records to fake')
    .demandOption(['t', 'o', 'r'])
    .help('h')
    .alias('h', 'help')
    .argv;
const csv = require('fast-csv');
const faker = require('faker');
const fs = require('fs');
const path = require('path');

// Handle directory or single file
if (fs.lstatSync(argv.t).isDirectory()) {
    const dir = fs.opendirSync(argv.t);
    let dirEntry = null;
    while ((dirEntry = dir.readSync()) !== null) {
        if (dirEntry.isFile()) {
            parseTemplateAndGenerate(path.join(dir.path, dirEntry.name), path.join(argv.o, dirEntry.name), argv.r);
        }
    }
    dir.closeSync();
} else {
    parseTemplateAndGenerate(argv.t, argv.o, argv.r);
}

function parseTemplateAndGenerate(templateFile, outputFile, rows) {
    let template = null;
    csv.parseFile(templateFile, { headers: true, strictColumnHandling: true, trim: true })
        .on('data', (row) => {
            if (!template) {
                template = row;
            }
        })
        .on('end', () => {
            generate(template, outputFile, rows);
        })
        .on('error', (err) => {
            console.error(err);
        });
}

function generate(template, outputFile, rows) {
    let generatedRows = [];
    for (let i = 0; i < rows; i++) {
        const row = {};
        // Replace row number, options and faker
        Object.keys(template).forEach(key => {
            row[key] = template[key]
                .replace(/{{i}}/ig, i + 1)
                .replace(/{{.+}}/ig, (match) => faker.fake(match))
                .replace(/\[\[(.+)]]/ig, (match, $1) => {
                    const options = $1.split('|');
                    return options[i % options.length];
                });
        });
        // Replace column names with values of other columns
        Object.keys(row).forEach(key => {
            row[key] = row[key].replace(/\${(.+)}/ig, (match, $1) => row[$1] ? row[$1] : '');
        });
        generatedRows.push(row);
    }
    if (!fs.existsSync(path.dirname(outputFile))) {
        fs.mkdirSync(path.dirname(outputFile));
    }
    csv.writeToPath(outputFile, generatedRows, { headers: true });
    console.log('Wrote', rows, 'lines to:', outputFile);
}
