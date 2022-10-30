var express = require("express");
var router = express.Router();
const { create } = require("ipfs");
const { createInstance } = require("orbit-db");

const jsonFile = require("../Databases.json");
const orbit_address = jsonFile["whitelist3"];

async function get_whitelist(address) {
  const ipfsOptions = {
    repo: "./orbitdb/data3",
    start: true,
    EXPERIMENTAL: {
      pubsub: true,
    },
  };
  const ipfs = await create(ipfsOptions);
  const orbitdb = await createInstance(ipfs, {
    directory: "./whitelist3",
  });

  const db2 = await orbitdb.docs(orbit_address);
  await db2.load();

  const whitelist = db2.get(address);

  await orbitdb.disconnect();
  await ipfs.stop();

  return whitelist;
}

var routes = function () {
  router.route("/").post(function (req, res) {
    get_whitelist(req.body.data.address).then(function (result) {
      res.send(result);
    });
  });

  return router;
};

module.exports = routes;
