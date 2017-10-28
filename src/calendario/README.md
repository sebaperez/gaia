## API de Calendario de GAIA

### API Usage

* **POST /proximodisponible**

Punto de entrada principal de la API.
Devuelve el hueco mas proximo de tamaño 1 hr (solo la fecha desde del hueco).
En caso de no encontrar devuelve null.
Se puede mandar el array de fechas tanto como 1 como muchas.
El manejo de restriccion por preferencias de usuario esta a cargo de la api.
Espera un request con el user_id y un body que contenga un json de este tipo:

req: localhost:3009/proximodisponible?usuario=300

body:
[{
	"desde":"YYYY-MM-DDTHH:00:00-03:00", //formato de fecha obligatorio
	"hasta":"YYYY-MM-DDTHH:00:00-03:00"
},
{
	"desde":"2017-10-09T08:00:00-03:00",
	"hasta":"2017-10-09T16:00:00-03:00"
},
{
	"desde":"2017-10-09T12:00:00-03:00",
	"hasta":"2017-10-09T13:00:00-03:00"
}]

* **POST /agregarEvento**

Punto de entrada secundario de la API.   
Devuelve 200 o err
Espera un request con el user_id y body que tenga un json de este tipo:

req: usuario = user_id

body:
{
	"description":"agregar descripcion de la reunion",
"fecha_desde": "YYYY-MM-DDTHH:00:00-03:00", //formato de fecha obligatorio
"fecha_hasta": "YYYY-MM-DDTHH:00:00-03:00"
}

Ejemplo:  

req=> localhost:3009/agregarEvento?usuario=300
body:
{
  "description":"prueba de reunion por gaia",
  "fecha_desde": "2017-10-16T17:00:00-03:00",
  "fecha_hasta": "2017-10-16T19:00:00-03:00"
}

respuesta:
{
 "kind": "calendar#event",
 "etag": "\"3018409072886000\"",
 "id": "g2buuvfkliogvk6i80hr92m04c",
 "status": "confirmed",
 "htmlLink": "https://www.google.com/calendar/event?eid=ZzJidXV2ZmtsaW9ndms2aTgwaHI5Mm0wNGMgYnV6emV0dGkuanBAbQ",
 "created": "2017-10-28T15:28:56.000Z",
 "updated": "2017-10-28T15:28:56.443Z",
 "creator": {
  "email": "buzzetti.jp@gmail.com",
  "displayName": "Jonathan Buzzetti",
  "self": true
 },
 "organizer": {
  "email": "buzzetti.jp@gmail.com",
  "displayName": "Jonathan Buzzetti",
  "self": true
 },
 "start": {
  "dateTime": "2017-10-28T17:00:00-03:00"
 },
 "end": {
  "dateTime": "2017-10-28T18:00:00-03:00"
 },
 "iCalUID": "g2buuvfkliogvk6i80hr92m04c@google.com",
 "sequence": 0,
 "reminders": {
  "useDefault": true
 }
}
