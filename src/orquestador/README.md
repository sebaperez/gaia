### Request de ejemplo

`POST  http:localhost:5555/mensajes`

Body ejemplo:
```javascript
{
	"text": "Podemos agendar una reunion el miercoles a las 15 hs?",
	"subject": "Pruebita",
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

###Mail parseado:

```javascript
{
 "attachments": [],
 "headers": {},
 "html": "<div dir=\"ltr\">teaaegafa ag aeg </div>\n",
 "text": "teaaegafa ag aeg\n",
 "textAsHtml": "<p>teaaegafa ag aeg</p>",
 "subject": "test",
 "date": "2017-10-08T16:20:00.000Z",
 "to": {
    "value": [
         {
             "address": "clara@gaiameet.com",
             "name": ""
         }
    ],
    "html": "<span class=\"mp_address_group\"><a href=\"mailto:clara@gaiameet.com\" class=\"mp_address_email\">clara@gaiameet.com</a></span>",
    "text": "clara@gaiameet.com"
 },
 "from": {
    "value": [
         {
             "address": "nicolas.presta@mercadolibre.com",
             "name": "Nicolas Rodriguez Presta"
         }
    ],
    "html": "<span class=\"mp_address_group\"><span class=\"mp_address_name\">Nicolas Rodriguez Presta</span> &lt;<a href=\"mailto:nicolas.presta@mercadolibre.com\" class=\"mp_address_email\">nicolas.presta@mercadolibre.com</a>&gt;</span>",
    "text": "Nicolas Rodriguez Presta <nicolas.presta@mercadolibre.com>"
 },
 "messageId": "<CAEfck2BKvKwU57rO1NBDdMic5EOmHBsRy=Y+aW5p3coYsfXtJQ@mail.gmail.com>"
}
```
