forever stopall

echo ========== Checkouteando =========
cd gaia

git pull https://github.com/sebaperez/gaia.git
#git pull -b <branch> https://github.com/sebaperez/gaia.git

echo ============== Instalando ==============
cd src

cd user
npm install
forever start .
cd ..

cd ia
npm install
forever start ./server/index.js
cd ..

cd orquestador
npm install
forever start ./config/www
cd ..
echo ============== Desplegado ==============

cd ..
