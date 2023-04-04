const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");


const PORT = process.env.PORT || 4000;

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.use(
  cors({
    origin: "*",
  })
);

server.get("/", async (req, res) => {
  res.send("funciona");
});




const { Client, LocalAuth } = require("whatsapp-web.js");

var client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {

      args: ["--no-sandbox", "--disabled-setupid-sandbox"],
  
	}
});



client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", (msg) => {
  if (msg.body == "!ping") {
    msg.reply("pong");
  }
});

server.get("/send-qr", async (req, res) => {
  try {

    //metodo envia qr
    let qrRes = await new Promise((resolve, reject) => {
      client.once("qr", (qr) => resolve(qr));
      setTimeout(() => {
        reject(new Error("QR event wasn't emitted in 15 seconds."));
      }, 60000 * 10); //15000
    });
    console.log(qrRes);
  
    res.send({ qr: qrRes });
  } catch (err) {
    res.send(err.message);
  }
});

server.get("/send-message", async (req, res) => {

  console.log ("reciendo datos ",req.query)

  const { phone, message } = req.query;

  const codeCountry="591"
  //recbiendo datos  para bolivia
  console.log("datos recibidos ",phone, message);
  if (!codeCountry || !phone || !message) {
    res.send({ message: "todos los campos son requridos" });
  } else {
    //enviamos mensaje
    client
      .isRegisteredUser(`${codeCountry}${phone}@c.us`)
      .then(function (isRegistered) {
        if (isRegistered) {
          client.sendMessage(`${codeCountry}${phone}@c.us`, `${message}`);
        }
      });
    res.send({ success: true });
  }


});

server.post("/send-message", async (req, res) => {
  // console.log ("reciendo datos ",req.body)/Pk
  const { code, number, message } = req.body;
  console.log("datos recibidos ", code, number, message);
  if (!code || !number || !message) {
    res.send({ message: "todos los campos son requridos" });
  } else {
    //enviamos mensaje
    client
      .isRegisteredUser(`${code}${number}@c.us`)
      .then(function (isRegistered) {
        if (isRegistered) {
          client.sendMessage(`${code}${number}@c.us`, `${message}`);
        }
      });
    res.send({ success: true });
  }
});



client.initialize();

function handleErrors(err, req, res, next) {
  console.log(err);

  res.status(500).send("An internal server error occurred");
}

server.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`> Ready on ${PORT}`);
});

