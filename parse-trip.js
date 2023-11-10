const fs = require("fs");
const oracledb = require("oracledb");

var pickupAttributes = {},
  deliveryAttributes = {};

async function updateDB() {
  var aDBconn = {
    user: "RTD",
    password: "RTD",
    connectString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=192.168.85.140)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=RTD21PDB)))",
  };

  var connection;

  try {
    connection = await oracledb.getConnection(aDBconn);
    var puSQLQry = `
      DECLARE
        pCount INTEGER := :pCount;
        pStopType VARCHAR2(50) := :pStopType;
      BEGIN
        ITMS8_OSRM.UpdateTripsTable( pCount, pStopType, 
          ITMS8_OSRM.DATE_ARRAY(`+JSON.stringify(pickupAttributes.TravelDate).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`), 
          ITMS8_OSRM.VAR_ARRAY(`+JSON.stringify(pickupAttributes.id).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`), 
          ITMS8_OSRM.VAR_ARRAY(`+JSON.stringify(pickupAttributes.SuggResNum).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`), 
          ITMS8_OSRM.VAR_ARRAY(`+JSON.stringify(pickupAttributes.ResNum).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`), 
          ITMS8_OSRM.NUM_ARRAY(`+JSON.stringify(pickupAttributes.pIndex).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`), 
          ITMS8_OSRM.NUM_ARRAY(`+JSON.stringify(pickupAttributes.stopNumber).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`), 
          ITMS8_OSRM.NUM_ARRAY(`+JSON.stringify(pickupAttributes.perftime).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`), 
          ITMS8_OSRM.NUM_ARRAY(`+JSON.stringify(pickupAttributes.eta).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`), 
          ITMS8_OSRM.NUM_ARRAY(`+JSON.stringify(pickupAttributes.etd).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`), 
          ITMS8_OSRM.NUM_ARRAY(`+JSON.stringify(pickupAttributes.pAmbOcc).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`), 
          ITMS8_OSRM.NUM_ARRAY(`+JSON.stringify(pickupAttributes.pWcOcc).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`), 
          ITMS8_OSRM.NUM_ARRAY(`+JSON.stringify(pickupAttributes.PDistToNextStop).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`), 
          ITMS8_OSRM.NUM_ARRAY(`+JSON.stringify(pickupAttributes.PTimeToNextStop).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`), 
          ITMS8_OSRM.VAR_ARRAY(`+JSON.stringify(pickupAttributes.psystemuser).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`), 
          ITMS8_OSRM.VAR_ARRAY(`+JSON.stringify(pickupAttributes.POperId).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`), 
          ITMS8_OSRM.NUM_ARRAY(`+JSON.stringify(pickupAttributes.pDriverWait).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`), 
          ITMS8_OSRM.NUM_ARRAY(`+JSON.stringify(pickupAttributes.pPassengerWait).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`)
        );
      END;
    `;
    var doSQLQry = `
      DECLARE
        pCount INTEGER := :pCount;
        pStopType VARCHAR2(50) := :pStopType;
      BEGIN
        ITMS8_OSRM.UpdateTripsTable( pCount, pStopType, 
          ITMS8_OSRM.DATE_ARRAY(`+JSON.stringify(deliveryAttributes.TravelDate).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`), 
          ITMS8_OSRM.VAR_ARRAY(`+JSON.stringify(deliveryAttributes.id).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`), 
          ITMS8_OSRM.VAR_ARRAY(`+JSON.stringify(deliveryAttributes.SuggResNum).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`), 
          ITMS8_OSRM.VAR_ARRAY(`+JSON.stringify(deliveryAttributes.ResNum).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`), 
          ITMS8_OSRM.NUM_ARRAY(`+JSON.stringify(deliveryAttributes.pIndex).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`), 
          ITMS8_OSRM.NUM_ARRAY(`+JSON.stringify(deliveryAttributes.stopNumber).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`), 
          ITMS8_OSRM.NUM_ARRAY(`+JSON.stringify(deliveryAttributes.perftime).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`), 
          ITMS8_OSRM.NUM_ARRAY(`+JSON.stringify(deliveryAttributes.eta).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`), 
          ITMS8_OSRM.NUM_ARRAY(`+JSON.stringify(deliveryAttributes.etd).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`), 
          ITMS8_OSRM.NUM_ARRAY(`+JSON.stringify(deliveryAttributes.pAmbOcc).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`), 
          ITMS8_OSRM.NUM_ARRAY(`+JSON.stringify(deliveryAttributes.pWcOcc).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`), 
          ITMS8_OSRM.NUM_ARRAY(`+JSON.stringify(deliveryAttributes.PDistToNextStop).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`), 
          ITMS8_OSRM.NUM_ARRAY(`+JSON.stringify(deliveryAttributes.PTimeToNextStop).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`), 
          ITMS8_OSRM.VAR_ARRAY(`+JSON.stringify(deliveryAttributes.psystemuser).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`), 
          ITMS8_OSRM.VAR_ARRAY(`+JSON.stringify(deliveryAttributes.POperId).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`), 
          ITMS8_OSRM.NUM_ARRAY(`+JSON.stringify(deliveryAttributes.pDriverWait).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`), 
          ITMS8_OSRM.NUM_ARRAY(`+JSON.stringify(deliveryAttributes.pPassengerWait).replaceAll("\"","'").replaceAll("[","").replaceAll("]","")+`)
        );
      END;
    `;
    var puDataParams_Temp = {
        pCount: pickupAttributes.id.length,
        pStopType: 'P'
      };
    var doDataParams_Temp = {
      pCount: deliveryAttributes.id.length,
      pStopType: 'D'
    };  
    console.log("puSQLQry: " + puSQLQry);
    await connection.execute(puSQLQry, puDataParams_Temp);
    await connection.commit();
    console.log("doSQLQry: " + doSQLQry);
    await connection.execute(doSQLQry, doDataParams_Temp);
    await connection.commit();
    console.log("Stored procedure executed successfully.");
  } catch (err) {
    console.error("Error calling stored procedure:", err);
  } finally {
    // Release the connection
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing the connection:", err);
      }
    }
  }
}

// Read the JSON file
function readJsonFile() {
  console.log("readJsonFile() starts");
  fs.readFile("out.json", "utf8", async (err, data) => {
    console.log("read json file starts");
    if (err) {
      console.error("Error reading the JSON file:", err);
      return;
    }

    try {
      const jsonData = JSON.parse(data);

      // Initialize arrays to store pickup and delivery data
      const pickupData = [];
      const deliveryData = [];

      // Iterate through the "routes"
      for (
        let routeIndex = 0;
        routeIndex < jsonData.routes.length;
        routeIndex++
      ) {
        const route = jsonData.routes[routeIndex];
        const tripDetails = route.steps;

        // Initialize variables for stop number, previous step's distance, and previous step's duration
        let stopNumber = 5;
        let prevStepDistance = 0;
        let prevStepDuration = 0;

        // Iterate through trip details to find pickup and delivery information
        for (let stepIndex = 0; stepIndex < tripDetails.length; stepIndex++) {
          const step = tripDetails[stepIndex];

          if (step.type === "pickup") {
            pickupData.push({
              stopNumber,
              id: 'T' + String(step.job),
              address: step.description,
              eta: Math.ceil(parseFloat(step.arrival) / 60), // Convert to minutes
              type: "P",
              perftime: Math.ceil(
                (parseFloat(step.arrival) + parseFloat(step.service)) / 60
              ), // Convert to minutes
              etd: Math.ceil(
                (parseFloat(step.arrival) + parseFloat(step.service)) / 60
              ), // Convert to minutes
              pDriverWait: Math.ceil(step.waiting_time / 60), // Convert to minutes
              PDistToNextStop:
                stepIndex === tripDetails.length - 1
                  ? 0
                  : Math.ceil(
                      (parseFloat(tripDetails[stepIndex + 1].distance) -
                        parseFloat(step.distance)) /
                        1609.34
                    ), // Convert to miles
              PTimeToNextStop:
                stepIndex === tripDetails.length - 1
                  ? 0
                  : Math.ceil(
                      (parseFloat(tripDetails[stepIndex + 1].duration) -
                        parseFloat(step.duration)) /
                        60
                    ), // Convert to minutes
              psystemuser: "VROOM",
              POperId: "TD",
              TravelDate: "27-SEP-2050",
              ResNum: 'S' + String(route.vehicle),
              SuggResNum: 'S' + String(route.vehicle),
              pAmbOcc: 0,
              pWcOcc: 0,
              pPassengerWait: 0,
              pIndex: 0,
              // Include other parameters as needed
            });

            // Update previous step's distance and duration for the next iteration
            prevStepDistance = parseFloat(step.distance);
            prevStepDuration = parseFloat(step.duration);

            stopNumber += 5;
          } else if (step.type === "delivery") {
            deliveryData.push({
              stopNumber,
              id: 'T' + String(step.job),
              address: step.description,
              eta: Math.floor(parseFloat(step.arrival) / 60), // Convert to minutes
              type: "D",
              perftime: Math.floor(
                (parseFloat(step.arrival) + parseFloat(step.service)) / 60
              ), // Convert to minutes
              etd: Math.floor(
                (parseFloat(step.arrival) + parseFloat(step.service)) / 60
              ), // Convert to minutes
              pDriverWait: Math.floor(step.waiting_time / 60), // Convert to minutes
              PDistToNextStop:
                stepIndex === tripDetails.length - 1
                  ? 0
                  : Math.floor(
                      (parseFloat(tripDetails[stepIndex + 1].distance) -
                        parseFloat(step.distance)) /
                        1609.34
                    ), // Convert to miles
              PTimeToNextStop:
                stepIndex === tripDetails.length - 1
                  ? 0
                  : Math.floor(
                      (parseFloat(tripDetails[stepIndex + 1].duration) -
                        parseFloat(step.duration)) /
                        60
                    ), // Convert to minutes
              psystemuser: "VROOM",
              POperId: "TD",
              TravelDate: "27-SEP-2050",
              ResNum: 'S' + String(route.vehicle),
              SuggResNum: 'S' + String(route.vehicle),
              pAmbOcc: 0,
              pWcOcc: 0,
              pPassengerWait: 0,
              pIndex: 0,
              // Include other parameters as needed
            });

            prevStepDistance = parseFloat(step.distance);
            prevStepDuration = parseFloat(step.duration);

            stopNumber += 5;
          }
        }
      }

      // Separate arrays for all attributes of pickup and delivery
      pickupAttributes = {
        stopNumber: pickupData.map((item) => item.stopNumber),
        id: pickupData.map((item) => item.id),
        address: pickupData.map((item) => item.address),
        eta: pickupData.map((item) => item.eta),
        type: pickupData.map((item) => item.type),
        perftime: pickupData.map((item) => item.perftime),
        etd: pickupData.map((item) => item.etd),
        pDriverWait: pickupData.map((item) => item.pDriverWait),
        PDistToNextStop: pickupData.map((item) => item.PDistToNextStop),
        PTimeToNextStop: pickupData.map((item) => item.PTimeToNextStop),
        psystemuser: pickupData.map((item) => item.psystemuser),
        POperId: pickupData.map((item) => item.POperId),
        TravelDate: pickupData.map((item) => item.TravelDate),
        ResNum: pickupData.map((item) => item.ResNum),
        SuggResNum: pickupData.map((item) => item.SuggResNum),
        pAmbOcc: pickupData.map((item) => item.pAmbOcc),
        pWcOcc: pickupData.map((item) => item.pWcOcc),
        pPassengerWait: pickupData.map((item) => item.pPassengerWait),
        pIndex: pickupData.map((item) => item.pIndex),
      };

      deliveryAttributes = {
        stopNumber: deliveryData.map((item) => item.stopNumber),
        id: deliveryData.map((item) => item.id),
        address: deliveryData.map((item) => item.address),
        eta: deliveryData.map((item) => item.eta),
        type: deliveryData.map((item) => item.type),
        perftime: deliveryData.map((item) => item.perftime),
        etd: deliveryData.map((item) => item.etd),
        pDriverWait: deliveryData.map((item) => item.pDriverWait),
        PDistToNextStop: deliveryData.map((item) => item.PDistToNextStop),
        PTimeToNextStop: deliveryData.map((item) => item.PTimeToNextStop),
        psystemuser: deliveryData.map((item) => item.psystemuser),
        POperId: deliveryData.map((item) => item.POperId),
        TravelDate: deliveryData.map((item) => item.TravelDate),
        ResNum: deliveryData.map((item) => item.ResNum),
        SuggResNum: deliveryData.map((item) => item.SuggResNum),
        pAmbOcc: deliveryData.map((item) => item.pAmbOcc),
        pWcOcc: deliveryData.map((item) => item.pWcOcc),
        pPassengerWait: deliveryData.map((item) => item.pPassengerWait),
        pIndex: deliveryData.map((item) => item.pIndex),
      };

      // Print only the arrays
      // console.log('Pickup Attributes:', pickupAttributes);
      // console.log('Delivery Attributes:', deliveryAttributes);
      /* console.log("type of pickupAttributes.stopNumber is " + ( typeof pickupAttributes.stopNumber ) + ", type of pickupAttributes.stopNumber[0] is " + ( typeof pickupAttributes.stopNumber[0] ) + ", values are " + JSON.stringify(pickupAttributes.stopNumber));
      console.log("type of pickupAttributes.id is " + ( typeof pickupAttributes.id ) + ", type of pickupAttributes.id[0] is " + ( typeof pickupAttributes.id[0] ) + ", values are " + JSON.stringify(pickupAttributes.id));
      console.log("type of pickupAttributes.eta is " + ( typeof pickupAttributes.eta ) + ", type of pickupAttributes.eta[0] is " + ( typeof pickupAttributes.eta[0] ) + ", values are " + JSON.stringify(pickupAttributes.eta));
      console.log("type of pickupAttributes.perftime is " + ( typeof pickupAttributes.perftime ) + ", type of pickupAttributes.perftime[0] is " + ( typeof pickupAttributes.perftime[0] ) + ", values are " + JSON.stringify(pickupAttributes.perftime));
      console.log("type of pickupAttributes.etd is " + ( typeof pickupAttributes.etd ) + ", type of pickupAttributes.etd[0] is " + ( typeof pickupAttributes.etd[0] ) + ", values are " + JSON.stringify(pickupAttributes.etd));
      console.log("type of pickupAttributes.pDriverWait is " + ( typeof pickupAttributes.pDriverWait ) + ", type of pickupAttributes.pDriverWait[0] is " + ( typeof pickupAttributes.pDriverWait[0] ) + ", values are " + JSON.stringify(pickupAttributes.pDriverWait));
      console.log("type of pickupAttributes.PDistToNextStop is " + ( typeof pickupAttributes.PDistToNextStop ) + ", type of pickupAttributes.PDistToNextStop[0] is " + ( typeof pickupAttributes.PDistToNextStop[0] ) + ", values are " + JSON.stringify(pickupAttributes.PDistToNextStop));
      console.log("type of pickupAttributes.PTimeToNextStop is " + ( typeof pickupAttributes.PTimeToNextStop ) + ", type of pickupAttributes.PTimeToNextStop[0] is " + ( typeof pickupAttributes.PTimeToNextStop[0] ) + ", values are " + JSON.stringify(pickupAttributes.PTimeToNextStop));
      console.log("type of pickupAttributes.psystemuser is " + ( typeof pickupAttributes.psystemuser ) + ", type of pickupAttributes.psystemuser[0] is " + ( typeof pickupAttributes.psystemuser[0] ) + ", values are " + JSON.stringify(pickupAttributes.psystemuser));
      console.log("type of pickupAttributes.POperId is " + ( typeof pickupAttributes.POperId ) + ", type of pickupAttributes.POperId[0] is " + ( typeof pickupAttributes.POperId[0] ) + ", values are " + JSON.stringify(pickupAttributes.POperId));
      console.log("type of pickupAttributes.TravelDate is " + ( typeof pickupAttributes.TravelDate ) + ", type of pickupAttributes.TravelDate[0] is " + ( typeof pickupAttributes.TravelDate[0] ) + ", values are " + JSON.stringify(pickupAttributes.TravelDate));
      console.log("type of pickupAttributes.ResNum is " + ( typeof pickupAttributes.ResNum ) + ", type of pickupAttributes.ResNum[0] is " + ( typeof pickupAttributes.ResNum[0] ) + ", values are " + JSON.stringify(pickupAttributes.ResNum));
      console.log("type of pickupAttributes.SuggResNum is " + ( typeof pickupAttributes.SuggResNum ) + ", type of pickupAttributes.SuggResNum[0] is " + ( typeof pickupAttributes.SuggResNum[0] ) + ", values are " + JSON.stringify(pickupAttributes.SuggResNum));
      console.log("type of pickupAttributes.pAmbOcc is " + ( typeof pickupAttributes.pAmbOcc ) + ", type of pickupAttributes.pAmbOcc[0] is " + ( typeof pickupAttributes.pAmbOcc[0] ) + ", values are " + JSON.stringify(pickupAttributes.pAmbOcc));
      console.log("type of pickupAttributes.pWcOcc is " + ( typeof pickupAttributes.pWcOcc ) + ", type of pickupAttributes.pWcOcc[0] is " + ( typeof pickupAttributes.pWcOcc[0] ) + ", values are " + JSON.stringify(pickupAttributes.pWcOcc));
      console.log("type of pickupAttributes.pPassengerWait is " + ( typeof pickupAttributes.pPassengerWait ) + ", type of pickupAttributes.pPassengerWait[0] is " + ( typeof pickupAttributes.pPassengerWait[0] ) + ", values are " + JSON.stringify(pickupAttributes.pPassengerWait));
      console.log("type of pickupAttributes.pIndex is " + ( typeof pickupAttributes.pIndex ) + ", type of pickupAttributes.pIndex[0] is " + ( typeof pickupAttributes.pIndex[0] ) + ", values are " + JSON.stringify(pickupAttributes.pIndex)); */
      await updateDB();
    } catch (err) {
      console.error("Error parsing JSON:", err);
    }
    console.log("read json file ends");
    return;
  });
  console.log("readJsonFile() ends");
}

async function main() {
  console.log("main() starts");
 // await get_pooling();
  readJsonFile();
  console.log("main() ends");
}

main();

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};
