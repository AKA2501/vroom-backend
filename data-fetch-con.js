//import fs from 'fs';
//import oracledb from 'oracledb';
const oracledb = require('oracledb');
const fs=require('fs');
//var oracledb = require( 'oracledb' );
//var fs=require('fs');
const sqlQuery1 = `
SELECT t.*,veh_start + (veh_end-veh_start)/2 AS BRK_START, veh_start + (veh_end-veh_start)/2+t.BRK_DURATION AS BRK_END FROM (
    SELECT s.segmentid, s.OPER_ID,
    CASE
	    WHEN v.VEH_ID LIKE '%4'  AND s.oper_id <> 'TND' THEN 'RTD4'
	    WHEN v.VEH_ID LIKE '%6'  AND s.oper_id <> 'TND' THEN 'RTD5'
	    WHEN v.VEH_ID LIKE '%TA3'  AND s.oper_id = 'TND' THEN 'AMB3'
	    WHEN v.VEH_ID LIKE '%TA5'  AND s.oper_id = 'TND' THEN 'AMB5'	   
    ELSE 'TEST' END AS VEH_TYPE,
    a.GRIDLONG VEH_START_LONG ,a.GRIDLAT VEH_START_LAT, b.GRIDLONG VEH_END_LONG,b.GRIDLAT VEH_END_LAT,
    START_TIME *60 VEH_START, end_time*60 VEH_END,
    CASE
    WHEN (end_time-start_time) > 659 THEN 90*60
    WHEN (end_time-start_time) BETWEEN 480 AND 659 THEN 60*60
    WHEN (end_time-start_time) BETWEEN 390 AND 479 THEN 30*60
    WHEN (end_time-start_time) < 389 THEN 0 END AS BRK_DURATION
    FROM itms_segment s, itms_vehicle v, ITMS_ALIAS a, itms_alias b
    WHERE  s.travel_date = '27-SEP-2050' AND s.DISPOSITION ='T' AND s.vehicleid = v.VEH_ID
    AND s.ALIAS_START = a.ALIAS AND s.ALIAS_END = b.alias
    ) t WHERE VEH_CODE <> 'TEST'
`;
const sqlQuery2 = `
SELECT TRIPID,
NAME ||' '|| NAME2 ||'~'|| a.address1 || ' ' || a.address2 || ', ' || a.CITYTOWN || ', ' || a.STATEPRO AS PU_DESC, a.GRIDLONG AS PU_LONG, a.GRIDLAT AS PU_LAT,
NAME ||' '|| NAME2 ||'~'|| b.address1 || ' ' || b.address2 || ', ' || b.CITYTOWN || ', ' || b.STATEPRO AS DO_DESC, b.GRIDLONG AS DO_LONG, b.GRIDLAT AS DO_LAT,
substr(S_LOCATION3,1,instr(S_LOCATION3,'-')-1)*60 AS PU_START,
substr(S_LOCATION3,instr(S_LOCATION3,'-')+1)*60 AS PU_END,
(END_TIME-30)*60 AS DO_START,
(END_TIME)*60 AS DO_END, a.CITYTOWN AS PU_CITYTOWN, b.CITYTOWN AS DO_CITYTOWN,
 DEV.ITMS7_CHECKMOBILITY(t.MOBILITY_LIST, 'WC') AS IS_WC
FROM ITMS_TRIPS t, ITMS_ALIAS a, itms_alias b
where travel_date = '27-SEP-2050' AND t.DISPOSITION ='T' AND t.ALIAS_S = a.ALIAS AND t.ALIAS_E = b.alias
AND trip_type <> 'BRK'
`;
var connection = await oracledb.getConnection({
    user: 'RTD',
    password: 'RTD',
    connectString: '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=192.168.85.140)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=RTD21PDB)))'
  });
var vehicles = [];
async function getData_segments(){
	var result1 = await connection.execute(sqlQuery1);
	var rows1 = result1.rows;
	vehicles = [];

	rows1.forEach((row) => 
	{let capacity;
        const vehType = row[result1.metaData.findIndex((m) => m.name === "VEH_TYPE")];
        const operId = row[result1.metaData.findIndex((m) => m.name === "OPER_ID")];
        switch (vehType) {
          case 'RTD5':
            capacity = [8, 3, 10];
            break;
          case 'RTD4':
            capacity = [4, 1, 5];
            break;
          case 'AMB3':
            capacity = [3, 0, 3];
            break;
          case 'AMB5':
            capacity = [5, 0, 5];
            break;
          
        }
        let skills;
  switch (operId) {
    case 'TND':
      skills = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];
      break;
    case 'MTM':
      skills = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 29, 30, 31, 32, 33, 34, 35, 36, 37];
      break;
    case 'TD':
      skills = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];
      break;
  }
		const brkStartIndex = result1.metaData.findIndex((m) => m.name === "BRK_START");
    const brkEndIndex = result1.metaData.findIndex((m) => m.name === "BRK_END");
		const brkStart = parseFloat(row[brkStartIndex]);
    const brkEnd = parseFloat(row[brkEndIndex]);
		vehicles.push({
		  id: Number(row[result1.metaData.findIndex( (m) => m.name === "SEGMENTID" )].replace('S', '')),
		  start: [row[result1.metaData.findIndex( (m) => m.name === "VEH_START_LONG" )], row[result1.metaData.findIndex( (m) => m.name === "VEH_START_LAT" )]],
		  end: [row[result1.metaData.findIndex( (m) => m.name === "VEH_END_LONG" )], row[result1.metaData.findIndex( (m) => m.name === "VEH_END_LAT" )]],
          description: row[result2.metaData.findIndex( (m) => m.name === "OPER_ID" )],
          skills:skills,
      capacity:capacity,
		  time_window: [row[result1.metaData.findIndex( (m) => m.name === "VEH_START" )], row[result1.metaData.findIndex( (m) => m.name === "VEH_END" )]],
		  breaks: [{
	id:Number(row[result1.metaData.findIndex( (m) => m.name === "SEGMENTID" )].replace('S','')),			  
        max_load:[0],
	time_windows: [[brkStart, brkEnd]],
        duration: toString(brkStart-brkEnd)
      }]
		});
	});
console.log(JSON.stringify(vehicles));
}
var shipments = [];
async function getData_shipments(){

	var result2 = await connection.execute(sqlQuery2);
	var rows2 = result2.rows;
	shipments = [];
    const cityTownMapping = {
        "DENVER": 1,
        "AURORA": 2,
        "BOW MAR": 3,
        "COLUMBINE": 4,
        "ENGLEWOOD": 5,
        "GOLDEN": 6,
        "GREENWOOD VILLAGE": 7,
        "KEN CARYL": 8,
        "LAKEWOOD": 9,
        "LITTLETON": 10,
        "SHERIDAN": 11,
        "ARVADA": 12,
        "BRIGHTON": 13,
        "COMMERCE CITY": 14,
        "DUPONT": 15,
        "EDGEWATER": 16,
        "FEDERAL HEIGHTS": 17,
        "HENDERSON": 18,
        "NORTHGLENN": 19,
        "THORNTON": 20,
        "WESTMINSTER": 21,
        "WHEAT RIDGE": 22,
        "CENTENNIAL": 23,
        "HIGHLANDS RANCH": 24,
        "HOLLY HILLS": 25,
        "LONE TREE": 26,
        "PARKER": 27,
        "STONEGATE": 28,
        "BOULDER": 29,
        "BROOMFIELD": 30,
        "ERIE": 31,
        "GUNBARREL": 32,
        "LAFAYETTE": 33,
        "LONGMONT": 34,
        "LOUISVILLE": 35,
        "NIWOT": 36,
        "SUPERIOR": 37,
    };
	rows2.forEach((row) => 
	{
        let isWC = row[result2.metaData.findIndex((m) => m.name === "IS_WC")];
        let amountArray = isWC === 'Y' ? [0, 1, 2] : [1, 0, 1];
        let puCityNumber = cityTownMapping[row[result2.metaData.findIndex((m) => m.name === "PU_CITYTOWN")]];
        let doCityNumber = cityTownMapping[row[result2.metaData.findIndex((m) => m.name === "DO_CITYTOWN")]];
		shipments.push({
      amount: amountArray,
      skills: [puCityNumber, doCityNumber],
		  pickup: {
        id: Number(row[result2.metaData.findIndex( (m) => m.name === "TRIPID" )].replace('T', '')),
        service: 300,
        description: row[result2.metaData.findIndex( (m) => m.name === "PU_DESC" )],
        location: [row[result2.metaData.findIndex( (m) => m.name === "PU_LONG" )], row[result2.metaData.findIndex( (m) => m.name === "PU_LAT" )]],
        time_windows: [[row[result2.metaData.findIndex( (m) => m.name === "PU_START" )], row[result2.metaData.findIndex( (m) => m.name === "PU_END" )]]]
      },
      delivery: {
        id: Number(row[result2.metaData.findIndex( (m) => m.name === "TRIPID" )].replace('T','')),
        service: 300,
        description: row[result2.metaData.findIndex( (m) => m.name === "DO_DESC" )],
        location: [row[result2.metaData.findIndex( (m) => m.name === "DO_LONG" )], row[result2.metaData.findIndex( (m) => m.name === "DO_LAT" )]],
        time_windows: [[row[result2.metaData.findIndex( (m) => m.name === "DO_START" )], row[result2.metaData.findIndex( (m) => m.name === "DO_END" )]]]
      }
		});
	});

console.log(JSON.stringify(shipments));
}
const options = {
  g: true
};

async function main(){
	await getData_segments();
  await getData_shipments();
  const jsonData = {
   vehicles: vehicles,
    shipments: shipments,
    options: options
  };
  
  // Write the input.json object to a file
  fs.writeFileSync('./input-auto.json', JSON.stringify(jsonData, null, 2));
}

main();
