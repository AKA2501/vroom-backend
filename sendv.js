const fs = require('fs');
const axiosInstance = require('axios').default;
const filepath = './input-auto.json';

async function readJSONFile(filePath) {
  const data = await fs.promises.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

async function sendPOSTRequest(url, jsonData, headers) {
  try {
    const response = await axiosInstance.post(url, jsonData, { headers });
    if (response.status === 200) {
      console.log('Post request successful!');
      console.log(JSON.stringify(response.data));
      await fs.promises.writeFile('./out.json', JSON.stringify(response.data));
    } else {
      console.log('Post request failed');
      console.log(response.statusText);
    }
  } catch (error) {
    console.log('Error:', error);
  }
}

async function main() {
  const jsonData = await readJSONFile(filepath);
  const headers = {
    'Content-Type': 'application/json',
  };

  await sendPOSTRequest('http://localhost:3000', jsonData, headers);
}

main(); // Call the main function to start the asynchronous tasks

