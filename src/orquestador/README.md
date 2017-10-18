### Request de ejemplo

`POST  http://localhost:5555/mensajes`

Body ejemplo:
```javascript
{
	"text": "Podemos agendar una reunion el miercoles a las 15 hs?",
	"subject": "Pruebita",
	"date": "2017-09-24T21:29:20.000Z",
	"to": {
   		"value": [{
    		"address": "jony.buzz@hotmail.com",
    		"name": "Jonathan Hotmail"
    	}],
    	"html": "<span class=\"mp_address_group\"><a href=\"mailto:clara@gaiameet.com\" class=\"mp_address_email\">clara@gaiameet.com</a></span>",
    	"text": "clara@gaiameet.com"
    },
	"from": {
   		"value": [{
    		"address": "buzzetti.jp@gmail.com",
    		"name": "Jonathan Buzzetti"
    	}],
        "html": "<span class=\"mp_address_group\"><span class=\"mp_address_name\">Jonathan Buzzetti</span> &lt;<a href=\"mailto:buzzetti.jp@gmail.com\" class=\"mp_address_email\">buzzetti.jp@gmail.com</a>&gt;</span>",
        "text": "Jonathan Buzzetti <buzzetti.jp@gmail.com>"
    },
	"messageId": "<CADtizUa-eVcauzsE6_mTeKLOXDMEEm5sf8quGX3=p+XTU0Pojg@mail.gmail.com>"
}
```
