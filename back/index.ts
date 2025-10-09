import express from 'express'
const app=express(); //Creazione server con express  
import cors from 'cors';
app.use(cors());
app.use(express.json())
app.listen(3000,'0.0.0.0',()=>{
    console.log("sono in ascolto ");
})
app.get("/get",(req,res)=>{
    res.json({data:"ciao"});
})