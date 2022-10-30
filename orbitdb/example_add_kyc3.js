"use strict";

const IPFS = require("ipfs");
const OrbitDB = require("orbit-db");

const userId = "0x000000000000000000000000000000000000F2eD";
const id = "0x49c5da5136ffbedd28f8bc40bf982362ae0cd843f2c858aec93e1e2d8f62f2b4";
const age = 24;
const country = 1;
const timestamp = 1667080800;

const output = (user) => {
  if (!user) return;

  let output = ``;
  output += `----------------------\n`;
  output += `User ${userId}\n`;
  output += `----------------------\n`;
  output += `Id: ${user.id}\n`;
  output += `Age: ${user.age}\n`;
  output += `Country: ${user.country}\n`;
  output += `Timestamp: ${user.timestamp}\n`;
  output += `----------------------\n`;
  console.log(output);
};

console.log("Starting...");

async function main() {
  let db;

  try {
    const ipfsOptions = {
      repo: "./orbitdb/data3",
      start: true,
      EXPERIMENTAL: {
        pubsub: true,
      },
    };
    const ipfs = await IPFS.create(ipfsOptions);

    const orbitdb = await OrbitDB.createInstance(ipfs, {
      directory: "./kyc3",
    });

    db = await orbitdb.kvstore("kyc3", { overwrite: true });
    await db.load();
    // Query immediately after loading
    const user = db.get(userId);
    output(user);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  const query = async () => {
    // Set the key to the newly selected avatar and update the timestamp
    await db.put(userId, {
      id: id,
      age: age,
      country: country,
      timestamp: timestamp,
    });

    // Get the value of the key
    const user = db.get(userId);

    // Display the value
    output(user);
  };

  await query();
}
main();
