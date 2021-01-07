# WDP Projekt von Wenzelhuemer Andreas (1910307106) 
# WDP Projekt von Florian Weingartshofer (1910307103)

* Projekt-Name: spotify-analyzer
* Projekt-Typ: Webapp
* Externe JS/CSS Bibliotheken: 
  * Client
    * Typescript (v4.1.3)
    * Parcel-Bundler
    * Moment.JS
    * Chart.JS
    * material-icons
    * montserrat
  * Server
    * ExpressJS
    * CORS
    * MongoDB
    * Mongoose
    * node-fetch
    * winston
    * nodemon
    * ts-node
    * source-map-support
* Zeitaufwand (h): 70
* Getting started:
  1. Neue App auf Spotify erstellen: https://developer.spotify.com/dashboard/applications
  2. Client ID und Client Secret aus der Seite in das aktuelle Terminal, wo danach der Server gestartet wird, kopieren.
    * Windows (powershell)
      * $env:SPOTIFY_CLIENT_SECRET = _xxx_
      * $env:SPOTIFY_CLIENT_ID = _xxx_
    * Linux:
      * TODO @Florian Weingartshofer
  3. ```npm install``` für server, client & common folder ausführen.
  4. Docker Container für Mongo Datenbank starten (docker-compose.yml).
  5. Mongo DB Connection String beim Server Terminal setzen.
    * Windows (powershell)
      * $env:MONGODB_CONNECTION_STRING = "mongodb://root:example@localhost:27017/"
    * Linux:
      * TODO @Florian Weingartshofer
  6. Server starten mit ```npm start```
  7. Client starten mit ```npm run dev:watch```
  8. http://localhost:1234/index.html mit dem Browser öffnen. Mit __LOG IN__ gelangt man dann zur App.
