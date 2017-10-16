### Request de ejemplo

URL: `http://localhost:5555/mensajes`

Body:
```javascript
{
	"attachments": [],
	"headers": {},
	"text": "Hola mañana por la tarde\n---------- Forwarded message ----------\nFrom: Jonathan Buzzetti <buzzetti.jp@gmail.com>\nDate: 2017-09-24 18:21 GMT-03:00\nSubject: Pruebita\nTo: clara@gaiameet.com\n\n\nContenidoooo sasasa\n\n\nsadas\nda\nsd\nad\nasd\n",
	"subject": "Fwd: Pruebita",
	"date": "2017-09-24T21:29:20.000Z",
	"to": {
   		"value": {
    		"address": "marito@gmail.com"
    	},
    	"html": "<span class=\"mp_address_group\"><a href=\"mailto:clara@gaiameet.com\" class=\"mp_address_email\">clara@gaiameet.com</a></span>",
    	"text": "clara@gaiameet.com"
    },
	"from": {
   		"value": {
    		"address": "sebalanus@gmail.com"
    	},
        "html": "<span class=\"mp_address_group\"><span class=\"mp_address_name\">Jonathan Buzzetti</span> &lt;<a href=\"mailto:buzzetti.jp@gmail.com\" class=\"mp_address_email\">buzzetti.jp@gmail.com</a>&gt;</span>",
        "text": "Jonathan Buzzetti <buzzetti.jp@gmail.com>"
    },
	"messageId": "<CADtizUa-eVcauzsE6_mTeKLOXDMEEm5sf8quGX3=p+XTU0Pojg@mail.gmail.com>",
	"inReplyTo": "<CADtizUaxmzzLAJH2JX1DKAhNEep8PC6DcUdMd9ESdWLBdC4N1A@mail.gmail.com>"
}
```
