"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)(); //Creazione server con express  
const cors_1 = __importDefault(require("cors"));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.listen(3000, '0.0.0.0', () => {
    mongoose_1.default.connect("mongodb://localhost:27016").then(() => {
        console.log("sono in ascolto ");
    })
        .catch(() => {
        console.log("Errore");
    });
});
