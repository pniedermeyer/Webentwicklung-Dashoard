# Dashboard-Prototyp
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
