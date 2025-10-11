import express from 'express'
import mongoose from 'mongoose';
import User from './db';
import crypto from 'crypto'
import passport from 'passport';
import { BasicStrategy } from 'passport-http';
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

app.post("/registrazione",(req,res)=>{
    let salt=crypto.randomBytes(16).toString('hex');
    let digest=crypto.createHmac('sha512',salt).update(req.body.password).digest('hex');
    User.create({email:req.body.email,digest:req.body.password,citta:req.body.città,salt:salt})
    .then((user)=>{
       
        user.save();
       res.json({message:"Utente Creato"})
    })
    .catch((err)=>{
      res.status(409).json({message:"Errore durante la creazione del tuo profilo ,dati già in uso "});
    })
})
//ROTTA per l'autenticazione: Uso di basic senza sessione che verrà gestita dai jwt.: ENDPOINT -> /login
Rotta.post("/login", passport.authenticate('basic', { session: false }), (req, res) => {
  let user=<User>req.user
   Users_DB.findOne({email:user.email})
        .then((User) => {
            if(User!=null){
        })
        .catch((err)=>{
            res.status(500).json({ message: "Errore interno durante la ricerca dell'utente" })
        })
})


//Implemento strategia Basic che verrà usata nel login
passport.use(new BasicStrategy(
    (email, password, done) => {
     User.findOne({email:email})
        .then((user)=> {
          if (!user) {
            // Nessun utente trovato con questa email
            return done(null, false);
          }
  
          if () {
            // Password corretta
            return done(null, user);
          } else {
            // Password errata
            return done(null, false);
          }
        })
        .catch((err) => {
          // Errore nel database
          return done(err);
        });
    }
  ));
