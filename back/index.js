"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = __importDefault(require("./db"));
const crypto_1 = __importDefault(require("crypto"));
const passport_1 = __importDefault(require("passport"));
const passport_http_1 = require("passport-http");
const app = (0, express_1.default)(); //Creazione server con express  
const cors_1 = __importDefault(require("cors"));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.listen(3000, '0.0.0.0', () => {
    mongoose_1.default.connect("mongodb://localhost:27017").then(() => {
        console.log("sono in ascolto ");
    })
        .catch(() => {
        console.log("Errore");
    });
});
app.post("/registrazione", (req, res) => {
    let salt = crypto_1.default.randomBytes(16).toString('hex');
    let digest = crypto_1.default.createHmac('sha512', salt).update(req.body.password).digest('hex');
    db_1.default.create({ email: req.body.email, digest: digest, citta: req.body.citta, salt: salt })
        .then((user) => {
        console.log("Utente Creato");
        res.json({ message: "Utente Creato" });
    })
        .catch((err) => {
        res.status(409).json({ message: "Errore durante la creazione del tuo profilo ,dati già in uso " });
    });
});
//ROTTA per l'autenticazione: Uso di basic senza sessione che verrà gestita dai jwt.: ENDPOINT -> /login
app.post("/login", passport_1.default.authenticate('basic', { session: false }), (req, res) => {
    let user = req.user;
    db_1.default.findOne({ email: user.email })
        .then((User) => {
        if (User != null) {
            console.log("utente loggato");
            res.status(200).json({ message: "ok" });
        }
    })
        .catch((err) => {
        res.status(500).json({ message: "Errore interno durante la ricerca dell'utente" });
    });
});
//Implemento strategia Basic che verrà usata nel login
passport_1.default.use(new passport_http_1.BasicStrategy((email, password, done) => {
    db_1.default.findOne({ email: email })
        .then((user) => {
        if (!user) {
            // Nessun utente trovato con questa email
            return done(null, false);
        }
        if (Checkpass(password, user)) {
            // Password corretta
            return done(null, user);
        }
        else {
            // Password errata
            return done(null, false);
        }
    })
        .catch((err) => {
        // Errore nel database
        return done(err);
    });
}));
//funzione di controllo paassword
let Checkpass = function (password, user) {
    const hmac = crypto_1.default.createHmac('sha512', user.salt);
    hmac.update(password);
    const digest = hmac.digest('hex');
    return user.digest === digest;
};
