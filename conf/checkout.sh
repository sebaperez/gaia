echo ============ Pulling ============
cd gaia

git pull https://jonybuzz:joper951753@github.com/sebaperez/gaia.git
#git pull -b <branch> https://github.com/sebaperez/gaia.git

if [ "$?" != "0"]
then
   git status
   cd ..
   exit 1
fi

forever stopall

echo ============ Instalando =============
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

cd respuesta
npm install
forever start . dev
cd ..

#IO está en otro server
#cd io
#npm install
#forever start ./index.js
#cd ..

cd conversacion
npm install
forever start . dev
cd ..

cd calendario
npm install
forever start ./server/index.js
cd ..

echo ============== Desplegado ==============

cd ..
