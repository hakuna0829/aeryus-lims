const { clientServer } = require("actions/api");

// export default ['Serology', 'PCR', 'Antigen', 'PCR - LD', 'PCR - EX'];

let testTypes = [];

if (clientServer === 'prod002')
  testTypes = ['PCR - LD'];
else if (clientServer === 'prod003')
  // testTypes = ['PCR - EX', 'PCR - EX3', 'Antigen'];
  testTypes = ['PCR - EX3', 'Antigen'];
else if (clientServer === 'prod007')
  testTypes = ['Antigen'];
else
  testTypes = ['Antigen', 'PCR - LD', 'PCR - EX'];

export default testTypes;