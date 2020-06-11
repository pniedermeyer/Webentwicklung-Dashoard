# Docker Postgres Image (https://hub.docker.com/_/postgres)

## Environment Variables

### POSTGRES_PASSWORD

This environment variable is required for you to use the PostgreSQL image. It must not be empty or undefined. This environment variable sets the superuser password for PostgreSQL. The default superuser is defined by the POSTGRES_USER environment variable.

### POSTGRES_USER

This optional environment variable is used in conjunction with POSTGRES_PASSWORD to set a user and its password. This variable will create the specified user with superuser power and a database with the same name. If it is not specified, then the default user of postgres will be used.

### POSTGRES_DB

This optional environment variable can be used to define a different name for the default database that is created when the image is first started. If it is not specified, then the value of POSTGRES_USER will be used.

### POSTGRES_INITDB_ARGS

This optional environment variable can be used to send arguments to postgres initdb. The value is a space separated string of arguments as postgres initdb would expect them. This is useful for adding functionality like data page checksums: -e POSTGRES_INITDB_ARGS="--data-checksums".

### POSTGRES_INITDB_WALDIR

This optional environment variable can be used to define another location for the Postgres transaction log. By default the transaction log is stored in a subdirectory of the main Postgres data folder (PGDATA). Sometimes it can be desireable to store the transaction log in a different directory which may be backed by storage with different performance or reliability characteristics.

### PGDATA

This optional variable can be used to define another location - like a subdirectory - for the database files. The default is /var/lib/postgresql/data. If the data volume you're using is a filesystem mountpoint (like with GCE persistent disks) or remote folder that cannot be chowned to the postgres user (like some NFS mounts), Postgres initdb recommends a subdirectory be created to contain the data.
For example:
\$ docker run -d \
 --name some-postgres \
 -e POSTGRES_PASSWORD=mysecretpassword \
 -e PGDATA=/var/lib/postgresql/data/pgdata \
 -v /custom/mount:/var/lib/postgresql/data \
 postgres
This is an environment variable that is not Docker specific. Because the variable is used by the postgres server binary (see the PostgreSQL docs), the entrypoint script takes it into account.

### Database Configuration

There are many ways to set PostgreSQL server configuration. For information on what is available to configure, see the postgresql.org docs for the specific version of PostgreSQL that you are running. Here are a few options for setting configuration:
Use a custom config file. Create a config file and get it into the container. If you need a starting place for your config file you can use the sample provided by PostgreSQL which is available in the container at /usr/share/postgresql/postgresql.conf.sample (/usr/local/share/postgresql/postgresql.conf.sample in Alpine variants).
Important note: you must set listen_addresses = '\*'so that other containers will be able to access postgres.
$ # get the default config
$ docker run -i --rm postgres cat /usr/share/postgresql/postgresql.conf.sample > my-postgres.conf

\$ # customize the config

$ # run postgres with custom config
$ docker run -d --name some-postgres -v "\$PWD/my-postgres.conf":/etc/postgresql/postgresql.conf -e POSTGRES_PASSWORD=mysecretpassword postgres -c 'config_file=/etc/postgresql/postgresql.conf'

## How-To Docker

1. Download & install Docker (evlt aktivierung "Virtualisierung im bios)
2. Login Docker Github
3. Docker create Volume
4. Pull Image
5. Start docker image

### Docker Download

Zuerst muss Docker von der folgende Seite heruntergeladen und installiert werden: https://docs.docker.com/get-docker/ .
<<<<<<< HEAD
Sowohl für MacOS, Linux und Windows verfügbar. Ich benutze hier die Version "Docker version 19.03.5" mit dem Build "build 633a0ea". Hier sollte jedoch auch jede andere Version in Ordnung sein.

=======
Sowohl für MacOS, Linux und Windows verfügbar. Ich benutze hier die Version "Docker version 19.03.5" mit dem Build "build 633a0ea". Hier sollte jedoch auch jede andere Version in Ordnung sein. Bevor Docker nun laufen kann muss im Bios die Virtualization eingeschaltet werden. (Hyper-V)

> > > > > > > fde6c8a971dd3afa4a955340144ec92accc26a35

### Docker Login Github

Nach der Installation von Docker lassen sich die Befehle in der Form "docker <command>" an den docker-daemon weiterleiten, der diese dann ausführt. Zuerst müssen wir allerdings unseren Github-Account verlinken. Dies geschieht mit folgendem docker login Command.
Bei "-u" wird der Username angegeben und bei -p ein Personal Access Token. Ein Passwort lässt sich an dieser Stelle auch benutzen sollte aber vermieden werden. Hier die Anleitung zum erstellen eines Personal Access Token: https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line
![Alt text](./img/gittoken.PNG?raw=true 'Personal Access Token Settings')

> Example Login
> `docker login docker.pkg.github.com -u ktpn -p <personalAccessToken> (z.B. dgni723a3k67fsdj65e)`

### Docker Volume Create 
Um Datenverlust vorzubeugen sollte als nächstes ein Volume erstellt werden. Bei Start der Datenbank wird nun immer auf das Volume zugegriffen und lädt die Daten lokal. (-v Paramater mit Volume muss angegeben werden)
>`docker volume create <volumename>`
>`docker volume coronadbvolume`

### Pull Docker Image

> `docker pull docker.pkg.github.com/pniedermeyer/webentwicklung-dashoard/postgres_dashboard:1.0`

### Push Docker Image

> `docker push docker.pkg.github.com/pniedermeyer/webentwicklung-dashoard/postgres_dashboard:1.0`

### Inspect Docker Image

> `docker inspect <containername>`

### Docker exec <Container>

Um sich mit einem laufenden Container zu verbinden kann man folgendes Command benutzen um in die Bash des Containers zu gelangen:

> `docker exec -it <containername> /bin/bash`

### Start Docker Container

`docker run -it --rm --network bridge -d -v coronadb:/var/lib/postgresql/data --name dashboard_db_postgres -p 5432:5432 -e POSTGRES_PASSWORD=admin docker.pkg.github.com/pniedermeyer/webentwicklung-dashoard/postgres_dashboard:1.0`

### Create Docker Image

Um von einem laufenden Docker-Image/Container ein neues Abbild zu erstellen(z.B. neue Tabellen o.ä. wurde generiert) muss zuerst über `docker commit <containername>` ein neues Image erstellt werden. Anschließend muss dem Image noch ein Tag und eine Version zugewießen werden. Dazu schaut man mit `docker images` nach, welche Images noch keine Repository/Tag haben. Diese werden mit `<none>` markiert. Um diese jetzt zu taggen wird der Befehl `docker tag <imageID> <repo/name:tag>` ausgeführt. Wenn kein Tag angegeben wird, wird das Image mit `latest` markiert. Für weitere Infos: https://docs.docker.com/engine/reference/commandline/commit/
Einstellungen des Tokens:


### Other Docker Commands

Zeige alle laufenden docker-container\
`docker ps -a` \
Zeige alle lokalen Docker-Images \
`docker images` \
Zeige alle Netzwerke \
`docker network ls` \
Zeige alle Volumes \
`docker volume ls` \

## Github Packages

Das Docker-Image findet ihr auf Github unter https://github.com/pniedermeyer/Webentwicklung-Dashoard/packages

# PostgreSQL

## Download und Installation
PostgreSQL 12.3
Installation: PgAdmin, StackBuilder und CommandLine Tools (Server wird nicht benötigt)
https://www.postgresql.org/download/windows/

## Login über SQL-Shell (psql)
In dem Container läuft bereits eine Datenbank unter dem Namen coronaDB. 
Auf diese kann man sich über die SQL-Shell(psql) verbinden oder mit dem PGAdmin Tool.
![Alt text](./img/postgreslogin.PNG?raw=true 'Database Login')
![Alt text](./img/pgadmin.PNG?raw=true 'Dashboard pgAdmin')
