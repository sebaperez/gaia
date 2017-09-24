## API de IA de GAIA

### Instalar dependencias

```bash
>>> npm install
```

### Correr App

```bash
>>> cd server
>>> node index
```

### API Usage

* **GET /dummy**

Metodo de prueba de la API, deberia retornar el mismo body que se envió

* **POST /process**

Punto de entrada principal de la API.   
Espera un body que tenga un json de este tipo:  

{"msj":" ... "}  

Ejemplo:  

{"msj":"Hola, queria saber si podiamos coordinar una reunion para mañana a las 14:00 o el proximo viernes a las 15:00"}