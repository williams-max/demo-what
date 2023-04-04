const express = require("express");
const router = express.Router();
const fs = require("fs");
var axios = require("axios");
var qs = require("qs");

function routes(app) {
  const enviandoSms = async () => {
    var data = qs.stringify({
      token: "s04jhafvhlh2v576",
      to: "+59176997086",
      body: "test",
    });

    var config = {
      method: "post",
      url: "https://api.ultramsg.com/instance41852/messages/chat",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  router.get("/test", async (req, res) => {
    for (let i = 0; i < 2; i++) {
      await enviandoSms();
    }

    console.log("hola ");
    res.send("enviando hola");
  });

  router.get("/send", async (req, res) => {
    console.log("hola ");
    res.send("enviando hola");
  });

  return router;
}

module.exports = routes;
