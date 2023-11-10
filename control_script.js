
const process1 = require('./data-fetch-con.js'); 
const process2 = require('./sendv.js'); 
const process3 = require('./parse-trip.js'); 
const process4 = require('./parse-seg.js'); 

async function runProcesses() {
  try {
    console.log('Fetching the Data from the DB');
    await process1(); 
    console.log('Process completed.\n');

    console.log('Sending the data to Vroom');
    await process2();
    console.log('Process completed.\n');

    console.log('Sending the trips data back to DB');
    await process3();
    console.log('Process completed.\n');

    console.log('Sending the segments data back to DB');
    await process4(); 
    console.log('Process 4 completed.\n');

    console.log('All processes completed successfully.');
  } catch (error) {
    console.error('Error in one of the processes:', error);
  }
}


runProcesses();
