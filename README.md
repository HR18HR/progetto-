Eseguire prima
ng build --->fa il build del progetto 
npx cap copy ----> copia i file del build di angular nella cartella android 
npx cap open android --> apre android studio e mostra l'app

Una volta apaerto android studio eseguire questo comando      adb reverse tcp:3000 tcp:3000 che permette ad Android di comunicare conn il localhost.
Il comando ritorna la porta quando vede che anadroid studio è stato eseguito sennò non ritona niente. Quindi eseguire il comando solo quando si andorid studio
viene eseguito in modo da vedere la porta.
