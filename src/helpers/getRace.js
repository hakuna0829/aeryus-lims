const { clientServer } = require("actions/api");

let race = [];

if (clientServer === 'prod006')
  race = ['African American', 'Asian', 'American Indian/Alaska Native', 'Native Hawaiian/Pacific Islander', 'White', 'Other'];
else
  race = ['White', 'Black', 'Native', 'Asian', 'Hispanic', 'Other'];

export default race;