# Data Loader Faker

Generate massive amounts of realistic fake CSV data for [Data Loader](https://github.com/bullhorn/dataloader)

### Get Started

This branch creates large amounts of data that can generate associated index events by modifying a watched field
on an entity to trigger a known amount of associated events. 

Generate all data:

```
npm install
npm start
```

Loading of data will take a while. This command will load all data at once, but that is risky. It's probably best
to upload individual files at a time, from small to very large.

```
dataloader load ../path/to/generated
```

### The Template File Format

A template file contains two rows:
 1. Column header with column names that will be copied from the template to the generated output file.
 2. The data to generate for each row, including any replacements to make the data unique per row.

#### Replacements

 - `{{<faker.dataType>}}` = replace with [faker-js](https://fakerjs.dev/) generated data.
     See [faker-js docs](https://fakerjs.dev/guide/) for available options.
     - Example: `{{name.lastName}}, {{name.firstName}} {{name.suffix}}` will generate random values for each row,
       formatted as: `Corkery, Chaya Jr.`, `Rippin, Tevin II`, etc.
 - `{{i}}` = replace with row number
     - Example: `candidate-{{i}}` will generate `candidate-1`, `candidate-2`, etc.
 - `${<otherColumnName>}` = replace with the value of another column, allowing columns to contain values
     from one or more generated columns.
     - Example: `${firstName} ${middleName} ${lastName}` will format three generated columns into one resulting column.
 - `[[Option A|Option B|Option C|Option D]]` = replace with one of the given options in the vertical bar
     separated double bracket list. Simply cycles through the options on each row for an even distribution.
