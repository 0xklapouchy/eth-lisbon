const { create } = require("ipfs");
const { createInstance } = require("orbit-db");
const { spawn } = require("child_process");
console.log(process.cwd());
const orbit_address =
  "/orbitdb/zdpuAw41fJitfCYiWXjm5rD3siBxujTrLFsRcbHAwurmRXwFG/kyc3";

const output = (user) => {
  if (!user) return;

  let output = ``;
  output += `----------------------\n`;
  output += `User\n`;
  output += `----------------------\n`;
  output += `Id: ${user.id}\n`;
  output += `Age: ${user.age}\n`;
  output += `Country: ${user.country}\n`;
  output += `Timestamp: ${user.timestamp}\n`;
  output += `----------------------\n`;
  console.log(output);
};

async function main() {
  const ipfsOptions = {
    repo: "./orbitdb/data3",
    start: true,
    EXPERIMENTAL: {
      pubsub: true,
    },
  };
  const ipfs = await create(ipfsOptions);
  const orbitdb = await createInstance(ipfs, {
    directory: "./kyc3",
  });

  const db2 = await orbitdb.open(orbit_address);
  await db2.load();

  const user = db2.get("0x000000000000000000000000000000000000F2eD");
  output(user);

  await orbitdb.disconnect();
  await ipfs.stop();
}

main();
