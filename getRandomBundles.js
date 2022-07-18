var fs = require("fs");
const request = require('request');

let bundleAmount = process.argv[2]|| 10;
let arweaveGateway = "https://arweave.net"
let query = `query($owners: [String!], $first: Int) {
  transactions(owners: $owners, first: $first) {
    pageInfo {
      hasNextPage
    }
    edges {
      cursor
      node {
        id
        owner { address }
        tags {
          name
          value
        }
        data {
          size
          type
        }
      }
    }
  }
}`;
let variables = {
  first: bundleAmount * 100,
  owners: ["OXcT1sVRSA5eGwt2k6Yuz8-3e3g9WJi5uSE99CWqsBs"]
}
let data = { query, variables }

const downloadFile = (url, path) => {
  fs.closeSync(fs.openSync(path, 'w'));
  request(url).pipe(fs.createWriteStream(path))
};

console.log(`Downloading ${bundleAmount} random bundles:`);
fetch(`${arweaveGateway}/graphql/`, {
  method: 'POST', // or 'PUT'
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data) 
})
  .then(response => response.json())
  .then(data =>{ 
    let randomBundles = Array.from({length: bundleAmount}, () => Math.floor(Math.random() * variables.first));
    let allBundlesIds = data.data.transactions.edges.map(edge => edge.node.id);

    for(bundle in randomBundles) {
      let id = allBundlesIds[bundle];
      downloadFile(`${arweaveGateway}/${id}`, `./files/random/${id}`);
      console.log(`Downloading ./files/random/${id}`);
    }
  })