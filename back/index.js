"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var crypto = require("crypto");
var passport = require("passport");
var cors = require("cors");
var http = require("http");
var jsonwebtoken = require("jsonwebtoken");
var mongoose_1 = require("mongoose");
var User_1 = require("./models/User");
var Alert_1 = require("./models/Alert");
var passport_http_1 = require("passport-http");
var express_jwt_1 = require("express-jwt");
var app = express(); //Creazione server con express
var auth = (0, express_jwt_1.expressjwt)({ secret: 'mysecretpassword', algorithms: ['HS256'] });
app.use(cors());
app.use(express.json());
app.get('/alerts', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        Alert_1.default.find({})
            .then(function (alerts) { return res.status(200).json(alerts); })
            .catch(function () { return res.status(400).json({ message: 'Errore interno' }); });
        return [2 /*return*/];
    });
}); });
app.post('/alerts', auth, function (req, res, next) {
    var title = req.body.title;
    var description = req.body.description;
    var type = req.body.type;
    var lat = parseFloat(req.body.lat);
    var lng = parseFloat(req.body.lng);
    var position = { lat: lat, lng: lng };
    User_1.default.findById(req.auth._id)
        .then(function (user) {
        var made_by = user === null || user === void 0 ? void 0 : user.nickname;
        var user_email = user === null || user === void 0 ? void 0 : user.email;
        return Alert_1.default.create({ title: title, description: description, type: type, position: position, made_by: made_by, user_email: user_email });
    })
        .then(function () {
        return res.status(200).json({ message: "Segnalazione creata" });
    })
        .catch(function (err) {
        return res.status(500).json({ message: "Errore interno" });
    });
});
app.get('/saved-locations', auth, function (req, res, next) {
    User_1.default.findById(req.auth._id).then(function (user) {
        var saved_locations = (user === null || user === void 0 ? void 0 : user.saved_locations) || [];
        return res.status(200).json(saved_locations);
    })
        .catch(function () {
        return res.status(404).json({ message: "Utente Non Trovato" });
    });
});
app.post('/saved-locations', auth, function (req, res, next) {
    var label = req.body.label;
    var lat = parseFloat(req.body.lat);
    var lng = parseFloat(req.body.lng);
    var position = { lat: lat, lng: lng };
    User_1.default.findById(req.auth._id)
        .then(function (user) {
        if (!user)
            return res.status(404).json({ message: "Utente non trovato" });
        user.saved_locations.push({ position: position, label: label });
        return user.save();
    })
        .then(function () {
        return res.status(200).json({ message: "Segnalazione creata" });
    })
        .catch(function (err) {
        return res.status(500).json({ message: "Errore interno" });
    });
});
app.delete('/saved-locations', auth, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var i, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                i = parseInt(req.query.i);
                return [4 /*yield*/, User_1.default.findById(req.auth._id)];
            case 1:
                user = _a.sent();
                if (!user) return [3 /*break*/, 3];
                user.saved_locations.splice(i, 1);
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                return [2 /*return*/, res.status(200).json({ message: "Posizione eliminata" })];
            case 3: return [2 /*return*/, res.status(404).json({ message: "Utente non trovato" })];
        }
    });
}); });
app.get('/users', auth, function (req, res, next) {
    // invia dati user
    User_1.default.findById(req.auth._id).then(function (userInfo) {
        return res.status(200).json(userInfo);
    })
        .catch(function () {
        return res.status(404).json({ message: "Utente Non Trovato" });
    });
});
app.post('/users', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var email, nickname, password, existingUser, salt, digest;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.body.email;
                nickname = req.body.nickname;
                password = req.body.password;
                return [4 /*yield*/, User_1.default.findOne({ email: email })];
            case 1:
                existingUser = _a.sent();
                if (existingUser)
                    return [2 /*return*/, res.status(400).json({ message: "Email già registrata" })];
                salt = crypto.randomBytes(16).toString('hex');
                digest = crypto.createHmac('sha512', salt).update(password).digest('hex');
                User_1.default.create({ email: email, nickname: nickname, salt: salt, digest: digest })
                    .then(function () {
                    console.log("Utente Creato");
                    return res.status(200).json({ message: "Utente Creato" });
                })
                    .catch(function (err) {
                    return res.status(409).json({ message: "Errore durante la creazione del tuo profilo ,dati già in uso " });
                });
                return [2 /*return*/];
        }
    });
}); });
app.put('/users', auth, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var email, nickname, password, existingUser, salt, digest;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.body.email;
                nickname = req.body.nickname;
                password = req.body.password;
                if (!email) return [3 /*break*/, 3];
                return [4 /*yield*/, User_1.default.findOne({ email: email })];
            case 1:
                existingUser = _a.sent();
                if (existingUser)
                    return [2 /*return*/, res.status(400).json({ message: "Email già registrata" })];
                return [4 /*yield*/, User_1.default.findByIdAndUpdate(req.auth._id, { email: email })];
            case 2:
                _a.sent();
                return [2 /*return*/, res.status(200).json({ message: 'Email Modificata' })];
            case 3:
                if (!nickname) return [3 /*break*/, 5];
                return [4 /*yield*/, User_1.default.findByIdAndUpdate(req.auth._id, { nickname: nickname })];
            case 4:
                _a.sent();
                return [2 /*return*/, res.status(200).json({ message: 'Nickname Modificata' })];
            case 5:
                if (!password) return [3 /*break*/, 7];
                salt = crypto.randomBytes(16).toString('hex');
                digest = crypto.createHmac('sha512', salt).update(password).digest('hex');
                return [4 /*yield*/, User_1.default.findByIdAndUpdate(req.auth._id, { salt: salt, digest: digest })];
            case 6:
                _a.sent();
                return [2 /*return*/, res.status(200).json({ message: 'Password Modificata' })];
            case 7: return [2 /*return*/, res.status(400).json({ message: "Nessun dato da aggiornare" })];
        }
    });
}); });
app.delete('/users', auth, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var deleted_user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, User_1.default.findById(req.auth._id)];
            case 1:
                deleted_user = _a.sent();
                if (!deleted_user)
                    return [2 /*return*/, res.status(404).json({ message: 'Utente non trovato' })];
                return [4 /*yield*/, Alert_1.default.deleteMany({ user_email: deleted_user === null || deleted_user === void 0 ? void 0 : deleted_user.email })];
            case 2:
                _a.sent();
                return [4 /*yield*/, User_1.default.findByIdAndDelete(req.auth._id)];
            case 3:
                _a.sent();
                return [2 /*return*/, res.status(200).json({ message: "Account Eliminato" })];
        }
    });
}); });
//funzione di controllo password
var Checkpass = function (password, user) {
    var hmac = crypto.createHmac('sha512', user.salt);
    hmac.update(password);
    var digest = hmac.digest('hex');
    return user.digest === digest;
};
//Implemento strategia Basic che verrà usata nel login
passport.use(new passport_http_1.BasicStrategy(function (email, password, done) {
    User_1.default.findOne({ email: email })
        .then(function (user) {
        if (!user) {
            // Nessun utente trovato con questa email
            return done(null, false, { message: "Email non registrata" });
        }
        if (!Checkpass(password, user)) {
            // Password errata
            return done(null, false, { message: "Password errata" });
        }
        else {
            // Password corretta
            return done(null, user);
        }
    })
        .catch(function (err) {
        return done(err);
    });
}));
//ROTTA per l'autenticazione: Uso di basic senza sessione che verrà gestita dai jwt.: ENDPOINT -> /login
app.post("/login", function (req, res, next) {
    passport.authenticate('basic', { session: false }, function (err, user, info) {
        if (err) {
            return res.status(500).json({ message: "Errore interno" });
        }
        if (!user) {
            return res.status(401).json(info);
        }
        var token = jsonwebtoken.sign({ _id: user._id }, 'mysecretpassword', { algorithm: "HS256" });
        return res.status(200).json({ message: "Utente Loggato", token: token });
    })(req, res, next);
});
app.use(function (err, req, res, next) {
    console.log("Request error: " + JSON.stringify(err));
    return res.status(err.statusCode || 500).json(err);
});
mongoose_1.default.connect('mongodb://localhost:27017')
    .then(function () {
    var server = http.createServer(app);
    server.listen(3000, '0.0.0.0', function () { return console.log("sono in ascolto "); });
}).catch(function () {
    console.log("Errore");
});
