define({ "api": [
  {
    "type": "post",
    "url": "/mensajes",
    "title": "Create mensaje",
    "name": "CreateMensaje",
    "group": "Mensaje",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "de",
            "description": "<p>Mensaje's de.</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "para",
            "description": "<p>Mensaje's para.</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "contenido",
            "description": "<p>Mensaje's contenido.</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "contenidoActual",
            "description": "<p>Mensaje's contenidoActual.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "mensaje",
            "description": "<p>Mensaje's data.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "400",
            "description": "<p>Some parameters may contain invalid values.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404",
            "description": "<p>Mensaje not found.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/mensaje/index.js",
    "groupTitle": "Mensaje"
  }
] });
