const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount");
const tuoteData = require("./tuotteet").data;
// const osastot = require("./tuotteet").osastot;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ostokset.firebaseio.com",
});
const db = admin.firestore();

const app = express();
exports.app = functions.https.onRequest(app);

app.get("/lista", (req, res) => {
  admin
    .firestore()
    .collection("products")
    .orderBy("date", "desc")
    .limit(1) // Fetch only the latest shopping list. OrderBy orders lists by the date-field.
    .get()
    .then((data) => {
      let products = [];
      data.forEach((doc) => {
        products.push(doc.data());
      });

      let kosmetiikkaHTML = "";
      let kodinhoitoHTML = "";
      let heViHTML = "";
      let sipsitHTML = "";
      let voiMunatHTML = "";
      let juomatHTML = "";
      let eineksetHTML = "";
      let maitoHTML = "";
      let lihaKalaHTML = "";
      let leipaHTML = "";
      let kuivatuotteetHTML = "";
      let hillotSailykkeetHTML = "";
      let makeisetHTML = "";
      let pakasteetHTML = "";

      // Fetching keys and values to separate tables
      var avaimet = Object.keys(products[0]);
      var arvot = Object.values(products[0]);

      // Iterating through products and choosing those with values
      for (index = 0; index < avaimet.length; index++) {
        if (arvot[index] > 0 && arvot[index] < 1000) {
          // < 1000 excludes the date-value

          for (tuote of tuoteData) {
            if (avaimet[index] === tuote[0]) {
              // creating HTML-code for products
              let div =
                "<div><input type='checkbox'> " +
                tuote[1] +
                ": " +
                arvot[index] +
                "</div>";

              // Inserting HTML under the correct division
              if (tuote[2] === "Kosmetiikka") {
                kosmetiikkaHTML += div;
              }
              if (tuote[2] === "Kodinhoito") {
                kodinhoitoHTML += div;
              }
              if (tuote[2] === "Hedelmät ja vihannekset") {
                heViHTML += div;
              }
              if (tuote[2] === "Sipsit, pähkinät") {
                sipsitHTML += div;
              }
              if (tuote[2] === "Voi, kananmunat") {
                voiMunatHTML += div;
              }
              if (tuote[2] === "Juomat") {
                juomatHTML += div;
              }
              if (tuote[2] === "Einekset, juustot, makkarat") {
                eineksetHTML += div;
              }
              if (tuote[2] === "Maitotuotteet") {
                maitoHTML += div;
              }
              if (tuote[2] === "Liha ja kala") {
                lihaKalaHTML += div;
              }
              if (tuote[2] === "Leipä") {
                leipaHTML += div;
              }
              if (tuote[2] === "Kuivatuotteet") {
                kuivatuotteetHTML += div;
              }
              if (tuote[2] === "Hillot ja säilykkeet") {
                hillotSailykkeetHTML += div;
              }
              if (tuote[2] === "Makeiset") {
                makeisetHTML += div;
              }
              if (tuote[2] === "Pakasteet") {
                pakasteetHTML += div;
              }
            }
          }
        }
      }

      // Muut ostokset
      let muutaHTML = "";
      if (products[0].otherProducts !== "") {
        muutaHTML =
          "<div style='white-space:pre'>" +
          products[0].otherProducts +
          "</div>";
      }

      let allHTML = [
        [kosmetiikkaHTML, "Kosmetiikka"],
        [kodinhoitoHTML, "Kodinhoito"],
        [heViHTML, "Hedelmät ja vihannekset"],
        [sipsitHTML, "Sipsit, pähkinät"],
        [voiMunatHTML, "Voi, kananmunat"],
        [juomatHTML, "Juomat"],
        [eineksetHTML, "Einekset, juustot, makkarat"],
        [maitoHTML, "Maitotuotteet"],
        [lihaKalaHTML, "Liha ja kala"],
        [leipaHTML, "Leipä"],
        [kuivatuotteetHTML, "Kuivatuotteet"],
        [hillotSailykkeetHTML, "Hillot ja säilykkeet"],
        [makeisetHTML, "Makeiset"],
        [pakasteetHTML, "Pakasteet"],
        [muutaHTML, "Muuta"],
      ];

      var htmlList =
        "<!DOCTYPE html><html><head><meta charset='utf-8' />" +
        "<link href='styles/style.css' rel='stylesheet' /><link href='https://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' />" +
        "<meta name='viewport' content='width=device-width, initial-scale=1' />" +
        "<title>Ostokset</title></head>" +
        "<body><div class=basicDiv><h1>OSTOSLISTA</h1><div>";

      //Iterating throught the table and creating HTML-code. Adding title and products, if division has at least one product.
      allHTML.forEach((element) => {
        if (element[0] !== "") {
          htmlList += "<h2>" + element[1] + "</h2>" + element[0];
        }
      });

      htmlList += "</div></div></body></html>";

      return res.send(htmlList);
    })
    .catch((err) => console.error(err));
});

async function insertFormData(request) {
  const writeResult = await admin
    .firestore()
    .collection("products")
    .add({
      shampoo: request.body.shampoo,
      saippua: request.body.saippua,
      hammastahna: request.body.hammastahna,
      siniLiinat: request.body.siniLiinat,
      pakastepussit: request.body.pakastepussit,
      kirjopesuaine: request.body.kirjopesuaine,
      valkopesuaine: request.body.valkopesuaine,
      astianpesuaine: request.body.astianpesuaine,
      vessapaperi: request.body.vessapaperi,
      talouspaperi: request.body.talouspaperi,
      kosteaVessapaperi: request.body.kosteaVessapaperi,
      taiteltuTalouspaperi: request.body.taiteltuTalouspaperi,
      vaipat: request.body.vaipat,
      vauvanruoka: request.body.vauvanruoka,
      kurkku: request.body.kurkku,
      peruna: request.body.peruna,
      sipuli: request.body.sipuli,
      tomaatti: request.body.tomaatti,
      kirsikkatomaatti: request.body.kirsikkatomaatti,
      salaatti: request.body.salaatti,
      mansikka: request.body.mansikka,
      mustikka: request.body.mustikka,
      banaani: request.body.banaani,
      paaryna: request.body.paaryna,
      omena: request.body.omena,
      viinirypaleet: request.body.viinirypaleet,
      sitruna: request.body.sitruna,
      avokado: request.body.avokado,
      sipsit: request.body.sipsit,
      cashew: request.body.cashew,
      kananmunat: request.body.kananmunat,
      margariini: request.body.margariini,
      voi: request.body.voi,
      majoneesi: request.body.majoneesi,
      vesi: request.body.vesi,
      pikkuvichy: request.body.pikkuvichy,
      isovicy: request.body.isovicy,
      appelsiinimehu: request.body.appelsiinimehu,
      pepsi: request.body.pepsi,
      isoPepsi: request.body.isoPepsi,
      jaffa: request.body.jaffa,
      olut: request.body.olut,
      siideri: request.body.siideri,
      makaronilaatikko: request.body.makaronilaatikko,
      maksalaatikko: request.body.maksalaatikko,
      lihapullat: request.body.lihapullat,
      kotkot: request.body.kotkot,
      nakit: request.body.nakit,
      kanafilee: request.body.kanafilee,
      juusto: request.body.juusto,
      feta: request.body.feta,
      tuorejuusto: request.body.tuorejuusto,
      alpro: request.body.alpro,
      actimel: request.body.actimel,
      turkkilainenJogu: request.body.turkkilainenJogu,
      raejuusto: request.body.raejuusto,
      maitorahka: request.body.maitorahka,
      cremeFraiche: request.body.cremeFraiche,
      maito: request.body.maito,
      kerma: request.body.kerma,
      kanankoivet: request.body.kanankoivet,
      jauheliha: request.body.jauheliha,
      lohi: request.body.lohi,
      kylmasavulohi: request.body.kylmasavulohi,
      herkkuleipa: request.body.herkkuleipa,
      ruispalat: request.body.ruispalat,
      gluteenitonLeipa: request.body.gluteenitonLeipa,
      riisipiirakka: request.body.riisipiirakka,
      tee: request.body.tee,
      kahvi: request.body.kahvi,
      finmix: request.body.finmix,
      grovmix: request.body.grovmix,
      pasta: request.body.pasta,
      riisi: request.body.riisi,
      perunamuussi: request.body.perunamuussi,
      dominokeksit: request.body.dominokeksit,
      muumikeksit: request.body.muumikeksit,
      suklaakeksit: request.body.suklaakeksit,
      digestiivit: request.body.digestiivit,
      sokeri: request.body.sokeri,
      hyyteloSokeri: request.body.hyyteloSokeri,
      karpalomehu: request.body.karpalomehu,
      mansikkamehu: request.body.mansikkamehu,
      sinappi: request.body.sinappi,
      ketsuppi: request.body.ketsuppi,
      mansikkahillo: request.body.mansikkahillo,
      oliivit: request.body.oliivit,
      suolakurkut: request.body.suolakurkut,
      tonnikala: request.body.tonnikala,
      sirkusAakkoset: request.body.sirkusAakkoset,
      suklaarusinat: request.body.suklaarusinat,
      cocktailPiirakat: request.body.cocktailPiirakat,
      pakastePizza: request.body.pakastePizza,
      katkaravut: request.body.katkaravut,
      pinaatti: request.body.pinaatti,
      ranskalaiset: request.body.ranskalaiset,
      vaniljajaatelo: request.body.vaniljajaatelo,
      kinuskiJaatelo: request.body.kinuskiJaatelo,
      jaatelopuikot: request.body.jaatelopuikot,
      otherProducts: request.body.otherProducts,
      date: Date.now(), // tagging date for sorting purposes (biggest number first)
    })
    .then(function () {
      console.log("Document successfully written!");
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });
}

const htmlContent =
  "<!DOCTYPE html><html><head><meta charset='utf-8' />" +
  "<link href='styles/style.css' rel='stylesheet' /><link href='https://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' />" +
  "<title>Ostokset</title></head>" +
  "<meta name='viewport' content='width=device-width, initial-scale=1' />" +
  "<title>Ostoslista</title></head>" +
  "<body><div class=basicDiv><h1>Kiitos!</h1>" +
  "<a href='./lista'>Ostoslista</a></body></br>" +
  "<a href='#' onclick='window.history.back();return false;'>Takaisin lomakkeelle</a><div></html>";

app.post("/valmis", async (req, res) => {
  var insert = await insertFormData(req);
  res.send(htmlContent);
});

exports.api = functions.https.onRequest(app);
