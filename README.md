# gaia
mail-bot para coordinar y agendar reuniones (Proyecto Final UTN FRBA - 2017)

## Inicialización

### Instalación
```
sudo apt-get install -y mongodb
mongodb
use gaia
db.createUser({user:"gaia", pwd:"KJ3N42KJ3NKkldf4l", roles:[{role:"userAdmin",db:"gaia"}]})

cd
npm install
cd src/user/
npm install
```

### Inicializar todo
```
npm start
```

### Modulo de usuarios
- FW: Loopback
- Puerto: 3000
- Doc API: http://localhost:3000/explorer/#/Client
```
node src/user/.
```

### Modulo de portal
- FW: Expressjs
- Puerto: 3001
```
node src/portal/app.js
```
