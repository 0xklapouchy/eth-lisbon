var express = require("express");
var router = express.Router();
const { create } = require("ipfs");
const { createInstance } = require("orbit-db");

const jsonFile = require("../Databases.json");
const orbit_address = jsonFile["kyc3"];

async function get_kyc(address) {
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

  const db2 = await orbitdb.docs(orbit_address);
  await db2.load();

  const kyc = db2.get(address);

  await orbitdb.disconnect();
  await ipfs.stop();

  return kyc;
}

var routes = function () {
  router.route("/").post(function (req, res) {
    get_kyc(req.body.data.address).then(function (result) {
      res.send(result);
    });
  });

  return router;
};

module.exports = routes;
