const express = require("express");
const Expo = require("expo-server-sdk").default;
const cors = require("cors");

const expo = new Expo();
const expressServer = express();

expressServer.use(cors());
expressServer.listen(process.env.PORT, () => {
  console.log("Serveur en écoute sur le port ", process.env.PORT);
});
expressServer.get("/", function(req, res) {
  const token = req.query.token;
  if (!Expo.isExpoPushToken(token)) {
    console.log("Token invalide");
    res.send({ error: "Token invalide" });
  } else {
    let messages = [
      {
        to: token,
        sound: "default",
        body: "Notification test",
        data: { desDonnes: "Voici ma première notification push" }
      }
    ];

    expo
      .sendPushNotificationsAsync(messages)
      .then(ticket => {
        console.log("Ticket recu : ", ticket);
        res.send({ ticket: ticket });
      })
      .catch(err => {
        console.log(" Erreur de notification ", err);
        res.send({ error: err });
      });
  }
});
