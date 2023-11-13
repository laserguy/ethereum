const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

/*
In previous contracts we wrote, we were compiling everytime we deployed, we don't want that to happen everytime.
Therefore in this project, we will create a build folder which will save the compiled contracts and when we deploy
the compiled contract is used and not built again unless we compile explicitly.
We store the compiled contract info in build folder, and if we run this file(compile.js, compile explicitly again)
This build folder is removed when we compile again, and once compilation is finished, compiled contracts info is stored in
new build directory which is created.
*/

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "Campaign.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  "Campaign.sol"
];

fs.ensureDirSync(buildPath); // check if folder exists, other create build folder

for (let contract in output) {
  fs.outputJSONSync(
    path.resolve(buildPath, contract + ".json"),
    output[contract]
  );
}
