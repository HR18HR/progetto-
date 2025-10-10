import express from 'express'
import mongoose from 'mongoose';
const app=express(); //Creazione server con express  
import cors from 'cors';
app.use(cors());
app.use(express.json())
app.listen(3000,'0.0.0.0',()=>{
    mongoose.connect("mongodb://localhost:27017").then(()=>{
        console.log("sono in ascolto ");
    })
    .catch(()=>{
        console.log("Errore")
    })
    
})
