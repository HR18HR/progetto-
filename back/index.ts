import express from 'express';
import { Request, Response, NextFunction } from "express";
import mongoose from 'mongoose';
import User from './models/User';
import Alert from './models/Alert';
import crypto from 'crypto';
import passport from 'passport';
import { BasicStrategy } from 'passport-http';
import cors from 'cors';
const { expressjwt: jwt } = require('express-jwt');
import http = require('http');
import jsonwebtoken = require('jsonwebtoken');




const app = express(); //Creazione server con express

let auth = jwt({ secret: 'mysecretpassword', algorithms: ['HS256'] });

app.use(cors());

app.use(express.json());




app.get('/alerts', async (req, res, next) => {
  Alert.find({})
  .then(alerts => res.status(200).json(alerts))
  .catch(() => res.status(400).json({ message: 'Errore interno'}));
});


app.post('/alerts', auth, (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const type = req.body.type;
  const lat = parseFloat(req.body.lat);
  const lng = parseFloat(req.body.lng);
  let position = { lat: lat, lng: lng };
  User.findById((req as any).auth._id)
  .then((user) => {
    let made_by = user?.nickname;
    let user_email = user?.email;
    return Alert.create({ title: title, description: description, type: type, position: position, made_by: made_by, user_email: user_email })
  })
  .then(() => {
    return res.status(200).json({message:"Segnalazione creata"})
  })
  .catch((err)=>{
      return res.status(500).json({message:"Errore interno"});
    });
});


app.get('/saved-locations', auth, (req, res, next) => {
    User.findById((req as any).auth._id).then((user) => {
      let saved_locations = user?.saved_locations || [];
      return res.status(200).json(saved_locations);
    })
    .catch(() => {
      return res.status(404).json({message:"Utente Non Trovato"})
    });
});


app.post('/saved-locations', auth, (req, res, next) => {
  const label = req.body.label;
  const lat = parseFloat(req.body.lat);
  const lng = parseFloat(req.body.lng);
  let position = { lat: lat, lng: lng };

  User.findById((req as any).auth._id)
  .then((user: any) => {
    if (!user) return res.status(404).json({ message: "Utente non trovato" });
    user.saved_locations.push({ position: position, label: label });
    return user.save();
  })
  .then(() => {
    return res.status(200).json({ message: "Segnalazione creata" });
  })
  .catch((err)=>{
    return res.status(500).json({message:"Errore interno"});
  });
});


app.delete('/saved-locations', auth, async (req, res, next) => {
  const i = parseInt((req as any).query.i);
    const user = await User.findById((req as any).auth._id);
    if(user) {
      user.saved_locations.splice(i, 1);
      await user.save();
      return res.status(200).json({ message: "Posizione eliminata" });
    }
    else {
      return res.status(404).json({ message: "Utente non trovato" });
    }
});


app.get('/users', auth, (req, res, next) => {
    // invia dati user
    User.findById((req as any).auth._id).then((userInfo) => {
      return res.status(200).json(userInfo);
    })
    .catch(() => {
      return res.status(404).json({message:"Utente Non Trovato"})
    });
});


app.post('/users', async (req, res, next) => {
    // registrazione
    const email = req.body.email;
    const nickname = req.body.nickname;
    const password = req.body.password;

    // controlliamo se l'email è già registrata
    let existingUser = await User.findOne({ email: email });
    if(existingUser) return res.status(400).json({ message: "Email già registrata" });
    // se l'email non è già registrata, invece
    let salt=crypto.randomBytes(16).toString('hex');
    let digest=crypto.createHmac('sha512',salt).update(password).digest('hex');
    User.create({email: email, nickname: nickname, salt: salt, digest: digest })
    .then(()=>{
       console.log("Utente Creato")
       return res.status(200).json({message:"Utente Creato"})
    })
    .catch((err)=>{
      return res.status(409).json({message:"Errore durante la creazione del tuo profilo ,dati già in uso "});
    })
});


app.put('/users', auth, async (req, res, next) => {
    // modifica dati user
    const email = req.body.email;
    const nickname = req.body.nickname;
    const password = req.body.password;
    if(email){
      let existingUser = await User.findOne({ email: email });
      if(existingUser) return res.status(400).json({ message: "Email già registrata" });
      await User.findByIdAndUpdate((req as any).auth._id, { email: email });
      return res.status(200).json({message: 'Email Modificata'});
    }
    else if(nickname){
      await User.findByIdAndUpdate((req as any).auth._id, { nickname: nickname });
      return res.status(200).json({message: 'Nickname Modificata'});
    }
    else if(password){
      let salt=crypto.randomBytes(16).toString('hex');
      let digest=crypto.createHmac('sha512',salt).update(password).digest('hex');
      await User.findByIdAndUpdate((req as any).auth._id, { salt: salt, digest: digest });
      return res.status(200).json({message: 'Password Modificata'});
    }
    else return res.status(400).json({ message: "Nessun dato da aggiornare" });
});


app.delete('/users', auth, async (req, res, next) => {
    // elimina account
    const deleted_user = await User.findById((req as any).auth._id);
    if(!deleted_user) return res.status(404).json({ message: 'Utente non trovato' });
    await Alert.deleteMany({ user_email: deleted_user?.email });
    await User.findByIdAndDelete((req as any).auth._id);
    return res.status(200).json({message:"Account Eliminato"});
});


//funzione di controllo password
  let Checkpass=function(password:any,user:any): boolean {
    const hmac = crypto.createHmac('sha512', user.salt);
    hmac.update(password);
    const digest = hmac.digest('hex');
    return user.digest === digest;
  }


//Implemento strategia Basic che verrà usata nel login
passport.use(new BasicStrategy(
  (email, password, done: any) => {
    User.findOne({ email: email })
      .then((user) => {
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
      .catch((err) => {
        return done(err);
      });
  }
));


//ROTTA per l'autenticazione: Uso di basic senza sessione che verrà gestita dai jwt.: ENDPOINT -> /login
app.post("/login", (req, res, next) => {
  passport.authenticate('basic', { session: false }, (err: any, user: any, info: any) => {
    if (err) {
      return res.status(500).json({ message: "Errore interno" });
    }
    if (!user) {
      return res.status(401).json(info);
    }
    const token = jsonwebtoken.sign({ _id: user._id }, 'mysecretpassword', { algorithm: "HS256" });
    return res.status(200).json({ message: "Utente Loggato", token });
  })(req, res, next);
});




app.use( (err: any,req: Request,res: Response,next: NextFunction) => {

  console.log("Request error: " + JSON.stringify(err) );
  return res.status( err.statusCode || 500 ).json( err );

});


mongoose.connect( 'mongodb://localhost:27017')
.then(      
  () => {
    let server = http.createServer(app);
    server.listen(3000, '0.0.0.0', () => console.log("sono in ascolto "));
  }
).catch(
  () => {
    console.log("Errore" );
  }
);