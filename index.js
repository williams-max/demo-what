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

const showRoutes = require("./routes/index.js");
server.use("/api", showRoutes(server));
server.get("/", async (req, res) => {
  res.send("funciona");
});

const { Client, LocalAuth } = require("whatsapp-web.js");

var client = new Client({
  authStrategy: new LocalAuth(),
});

//const { Client } = require('whatsapp-web.js');
const qrCode = require("qrcode-terminal");
//const client = new Client();

/*
client.on('qr', (qr) => {

  qrCode.generate(qr,{small:true})
  console.log('QR RECEIVED', qr);
});
*/
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
    // const client = new Client(...)
    //elimina la  seccion
    //client = new Client();

    //metodo envia qr
    let qrRes = await new Promise((resolve, reject) => {
      client.once("qr", (qr) => resolve(qr));
      setTimeout(() => {
        reject(new Error("QR event wasn't emitted in 15 seconds."));
      }, 60000 * 10); //15000
    });
    console.log(qrRes);
   // const jsonContent = JSON.stringify(qr);
   // res.send(jsonContent);
    res.send({ qr: qrRes });
  } catch (err) {
    res.send(err.message);
  }
});

server.get("/send-message", async (req, res) => {
  //console.log("req param ",req.params)
  console.log ("reciendo datos ",req.query)
   //console.log ("reciendo datos ",req.body)
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

server.get("/delete-carp", async (req, res) => {
  const filePath = ".wwebjs_auth/session/Default";
  fs.access(filePath, (error) => {
    if (!error) {
      fs.unlinkSync(filePath);
    } else {
      console.error("Error occured:", error);
    }
  });
  res.send("funciona");
});

server.get("/ok", async (req, res) => {
  //  76997086  //59176997086
  client.isRegisteredUser("59176997086@c.us").then(function (isRegistered) {
    if (isRegistered) {
      client.sendMessage("59176997086@c.us", "hello");
    }
  });
  res.send("funciona");
});

//client.initialize();

function handleErrors(err, req, res, next) {
  console.log(err);

  res.status(500).send("An internal server error occurred");
}

server.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`> Ready on ${PORT}`);
});

//metodos axios
/*
const loadQrApi = async () => {
  try {
    const urlQrShare = "http://localhost:4000/send-qr";
    //local  http://localhost:4000/send-qr

    const reponseQr = await axios.get(urlQrShare);
    console.log("response Qr ", reponseQr.data);
  } catch (error) {}
};

const sendMessageApi = async () => {
  try {
    const urlMessageShare = "http://localhost:4000/send-message";
    //local  http://localhost:4000/send-qr

    const reponseMessage = await axios.post(urlMessageShare, {
      code: "591",
      number: "76997086",
      message: "hola como estas",
    });
    console.log("response message ", reponseMessage.data);
  } catch (error) {}
};
*/