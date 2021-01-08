# WDP Projekt von Florian Weingartshofer (1910307103)
<!--# WDP Projekt von Wenzelhuemer Andreas (1910307106)-->

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
    * Windows (powershell):
      * ```$env:SPOTIFY_CLIENT_SECRET = "{xxx}"```
      * ```$env:SPOTIFY_CLIENT_ID = "{xxx}"```
    * Linux:
      * ```export SPOTIFY_CLIENT_SECRET = "{xxx}"```
      * ```export SPOTIFY_CLIENT_ID = "{xxx}"```

  3. ```npm install``` für server, client & common folder ausführen.
  4. Docker Container für Mongo Datenbank starten (docker-compose.yml).
  5. Mongo DB Connection String beim Server Terminal setzen.
    * Windows (powershell):
      * ```$env:MONGODB_CONNECTION_STRING = "{CONNECTION_STRING}"```
    * Linux:
      * ```export MONGODB_CONNECTION_STRING = "{CONNECTION_STRING}"```
  6. Client URl und Server URL angeben. Momentant sollte der Client auf Port 1234 und der Server auf Port 3000 laufen. Es wird auch davon ausgegangen dass Back- und Frontend auf der selben Maschine laufen.
    * Windows (powershell):
      * ```$env:CLIENT_URL = "{BASE_URL}"```
      * ```$env:SERVER_URL = "{BASE_URL}"```
    * Linux:
      * ```export CLIENT_URL = "{BASE_URL}"```
      * ```export SERVER_URL = "{BASE_URL}"```
  7. Server starten mit ```npm start```
  8. Client starten mit ```npm run dev:watch```
  9. http://localhost:1234/index.html mit dem Browser öffnen. Mit __LOG IN__ gelangt man dann zur App.
