# Data Loader Faker

Generate massive amounts of realistic fake CSV data for [Data Loader](https://github.com/bullhorn/dataloader)

### Usage

Given a template file and a location of an output file to generate, this method will generate
 an output file based on the provided template that contains the number of rows desired. 

```
npm install
npm start -- --template path/to/templateFile.csv --output generatedOutputFile.csv --rows 1000
```

### Template File Format

A template file contains two rows:
 1. Column header with column names that will be copied from the template to the generated output file.
 2. The data to generate for each row, including any replacements to make the data unique per row.

#### Replacements

 - `{{<faker.dataType>}}` = replace with [Faker.js](https://github.com/marak/Faker.js/) generated data. 
     See [faker docs](http://marak.github.io/faker.js/#toc9__anchor) for available options.
     - Example: `{{name.lastName}}, {{name.firstName}} {{name.suffix}}` will generate random values for each row,
       formatted as: `Corkery, Chaya Jr.`, `Rippin, Tevin II`, etc.
 - `{{i}}` = replace with row number
     - Example: `candidate-{{i}}` will generate `candidate-1`, `candidate-2`, etc.
 - `${<otherColumnName>}` = replace with the value of another column, allowing columns to contain values 
     from one or more generated columns.
     - Example: `${firstName} ${middleName} ${lastName}` will format three generated columns into one resulting column.
 - `[[Option A|Option B|Option C|Option D]]` = replace with one of the given options in the vertical bar 
     separated double bracket list. Simply cycles through the options on each row for an even distribution.
     
### Examples

The templates directory contains an entire corporation full of fake data. Each entity will reference other entities in
the same directory, same as the [dataloader examples](https://github.com/bullhorn/dataloader/tree/master/examples).
Each entity file should contain the same number of rows as the other entities, and they can all be generated together
by providing the number of desired rows. Lookup entities are the exception - there are only 10 of each generated.

```
// generate 10,000 records along with lookup entities
npm run generate 10000
```

```
// follow-on generation of 10,000 additional records, starting with id: 10001
npm start -- -t templates -o generated -r 10000 -s 10001
```

When provided the number of rows = `n`, this will generate:

 - `n` Companies
 - `n` Contacts, one per company
 - `n` Jobs, one per company
 - `n` Candidates
 - `3n` Job Submissions, three per Candidate at one Job
 - `n` Placements, one per Candidate at one Job
 - `n` Locations, one per Company
 - `n` Invoice terms, one per Company
 - `n` Billing Profiles, one per Company
 - 10 General Ledger Accounts
 - 10 Invoice Statement Message Templates

To load all of these records into a test corp, point Data Loader at the directory:

```
dataloader load ../path/to/generated
```
