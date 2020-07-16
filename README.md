# Dashboard-Prototyp
## Produktives deployment
Dieses Kapitel beschreibt, wie die App auf einer produktiven umgebung deployed werden kann.  

Hierfür kann entweder das mitgelieferte docker-compose file genutzt werden oder die Schritte
zum bauen der Anwendung können manuell erfolgen.
### Deployment via docker
Im Stammverzeichnis folgenden Befehl ausführen: ``docker-compose -f docker-compose.prod.yml up -d`` ausführen.  

Dies baut das Frontend und hinterlegt es im verzeichnis für statische ressourcen im Backend.
Im Anschluss wird das Backend gestartet und die anwendung ist auf port 3001 verfügbar.
Es wird empfohlen eine apache- oder nginx reverse proxy vor die anwendung zu hängen

### Manuelles deployment
Zum Durchführen eines manuellen deployments müssen folgende Schritte befolgt werden:
1. In das Verzeichnis Frontend/dashbaord wechseln
1. Den Befehl ``npm i`` ausführen
1. Den Befehl ``npm run-script build`` ausführen  
1. Den Inhalt des dist-Ordners in den Ordner ../../Backend/src/website kopieren. Falls dieser ordner nicht existiert muss er angelegt werden
1. In den Ordner ../../Backend wechseln
1. Den Befehl ``npm i`` ausführen
1. Den Befehl ``npm run-script start`` ausführen

## Aufbau einer lokalen (Entwicklungs)-Umgebung
### Vorbereitung (Für beide vorgehen)
In die github registry einloggen:
- Einen "Github personal access token" erstellen: https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line. Dieser muss mindestens die berechtigung ``read:packages`` haben
- ``docker login docker.pkg.github.com`` in CMD eingeben
- Als Nutzernamen euren Github Benutzernamen nutzen
- Als passwort den "Github personal access token" nutzen
- In den Verzeichnissen ``Frontend/dashbaord`` und ``Backend`` jeweils den Befehl ``npm -i`` ausführen (**Hinweis**: Dieser
Schritt sollte nach jedem pull durchgeführt werden)

### Mit docker
Einfach im root-folder ``docker-compose up --build`` aufrufen. Danach stehen folgende services zur Verfügung:
- ``localhost:8888``: Die gesamte Webanwendung (Unter / das dashboard und unter /data, [...] die API-endpunkte)
- ``localhost:3001``: Das Backend
- ``localhost:5858``: Der debug-Port für das Backend
- ``localhost:8080``: Das Frontend
- ``localhost:5959``: Der debug-Port für das Frontend
- ``localhost:5432``: postgres-Datenbank

Docker liest die dateien direkt von der FFestplatte. Daher sollten live-reload funktionalitäten weiterhin laufen.
Falls es doch einmal nicht funktionieren soll, können folgende befehle zum neustart einzelner Komponenten genutzt werden
(Funktioniert für linux und windows shell):
- backend: ``docker-compose stop backend && (echo "y" | docker-compose rm backend) && docker-compose build backend && docker-compose create backend && docker-compose start backend``
- frontend: ``docker-compose stop dashboard && (echo "y" | docker-compose rm dashboard) && docker-compose build dashboard && docker-compose create dashboard && docker-compose start dashboard``

Alternativ können auch alle Komponenten mit folgendem Befehl neu erstellt werden:
``docker-compose down && docker-compose up --build``

**Hinweis 1:** Das Backend und frontend bracuhen einige Zeit zum starten. Es kann gut ein, dass die Umgebung erst nach 2 oder 3 Minuten bereit ist!

**Hinweis 2:** Die Ordner bzw. Laufwerke in welchen sich das projekt befindet muss unter Windows noch mittels des Docker Dashbaords freigegeben werden! (Einstellungen -> Resources -> Filesharing)

### "Ohne" docker (Alter weg)
- Mittels folgenden Befehl eine Postgres-DB starten: ``docker run -it --rm --network bridge -d -e PGDATA=/postgres --name dashboard_db_postgres -p 5432:5432 -e POSTGRES_PASSWORD=admin docker.pkg.github.com/pniedermeyer/webentwicklung-dashoard/postgres_dashboard:1.3``
- Die Services wie gewohnt starten (npm run / npm serve o.ä.)
- In der Datei Backend/ormconfig.json den Wert "host" von ``db`` auf ``localhost`` setzen

## 8.6. Aufgabe (Corona-Dashboard)
Es soll ein Prototyp für ein Dashboard erstellt werden, das Informationen zur Verbreitung des Corona-Virus in Deutschland anzeigt.

### 8.6.1. Grobe Architektur
Das Frontend (Dashboard) läuft im Browser. Die Kommunikation mit dem Backend erfolgt über eine API. Das Backend läuft auf einem Server. Es bezieht seine Daten von externen Datenquellen und verwaltet diese in einer Datenbank.

### 8.6.2. Einteilung
Je zwei Gruppen erstellen gemeinsam das Frontend und je zwei Gruppen erstellen gemeinsam das Backend. Somit sind vier Gruppen beteiligt. Wir hatten uns geeinigt, dass der Protyp doppelt erstellt wird, so dass insgesamt alle acht Gruppen beteiligt sind.

Die Schnittstelle (API Frontend-Backend) wird von den Backend-Gruppen implementiert. Alle Gruppen sollen aber in die Planung einbezogen werden.

Bitte einigen Sie sich bis Dienstag 9.6.2020, 18 Uhr auf die Zuordnung der Gruppen und teilen Sie mir diese mit.

### 8.6.3. Schnittstelle Frontend-Backend
Die Schnittstelle wird als REST-API erstellt. Dabei soll ein RKI-unabhängiges Format verwendet werden. Es sollte auch eine inhaltliche Trennung der Daten erfolgen (z.B. jeweils eigener Endpunkt für die Bundesländer-Stammdaten und die Infektionszahlen)

Die benutzerspezifischen Einstellungen sollten einerseits als Query-Parameter übertragen werden, andererseits über eine ID verwendet werden können. Es genügt, wenn der Prototyp nur die erste Möglichkeit unterstüzt.

Zitat aus der Umfrage: "Ich glaube, es wäre am sinnvollsten, wenn die Einstellungen auf dem Server gespeichert werden und dort eine GUID erhalten. Die GUID erhält der Nutzer zurück und diese wird automatisch gesetzt und in den Cookies gespeichert. Wenn man nun die Einstellungen auf einem anderen Endgerät laden möchte, so gibt man einfach nur die GUID ein. So müssen keine Benutzerspezifischen Informationen gespeichert werden und man braucht keine Accountverwaltung."

### 8.6.4. Frontend
Das Frontend erhält seine Daten über die Schnittstelle vom Backend. Es ist komponentenbasiert. Die angezeigten Komponenten sind durch die Benutzer wählbar.

Es gibt folgende Komponenten:
- Deutschlandkarte (optional zoombar)
- Balkendiagramm
- Tabelle mit Daten zu den Infektionszahlen
- optional eine weiteres Feature aus der Umfrage, das genau 7 oder 8 Stimmen erreicht hat

Die Funktionalität der ersten drei Komponenten kann im Wesentlichen aus den bisherigen Aufgaben übernommen werden.

Das Frontend soll mit Vue erstellt werden. Für den Prototyp genügt es, wenn mindestens eine der [Komponenten mit Vue](https://vuejs.org/v2/guide/components-registration.html) realisiert ist. Später sollen natürlich alle Komponenten mit Vue realisiert werden.

Die Kommunikation mit dem Backend kann z.B. mittels axios erfolgen.

### 8.6.5. Backend
Das Backend bezieht seine Daten regelmäßig von externen Datenquellen (im Prototyp sind nur die bisher verwendeten Daten des RKI nötig) und speichert diese in einem zu entwerfenden Format in einer eigenen Datenbank. Dabei kann z.B. [TypeORM](https://typeorm.io/#/) zum Einsatz kommen.

Das Backend liefert diese Daten über die Schnittstelle an das Frontend. Die Geodaten werden entsprechend dem Zoomlevel in Web-Mercator-Koordinaten geliefert und können mit dem RDP-Algorithmus ausgedünnt werden.

Das Backend soll mit Express erstellt werden. Als Datenbank wird [PostgreSQL](https://www.postgresql.org/) verwendet. Optional können Backend und Datenbank [dockerisiert](https://www.docker.com/) werden.

### 8.6.6. Zeitrahmen
Am 18.6.2020 erfolgt eine Präsentation und Besprechung des Zwischenstandes. Die Abgabe ist eine Woche später geplant.

### 8.6.7. Beispiel Vue-Komponenten
Ein größeres Beispiel aus dem Buch "Fullstack Vue" von Hassan Djirdeh, Nate Murray, and Ari Lerner ist beigefügt. Da es sich um urheberrechtlich geschützte Inhalte handelt, dürfen Sie diese auf keinen Fall in irgendeiner Form weitergeben.
