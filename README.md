git@github.com:VolodymyrOsinchuk/PERN-EUROPE-UA.git

git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:VolodymyrOsinchuk/PERN-EUROPE-UA.git
git push -u origin main

### or push an existing repository from the command line
git remote add origin git@github.com:VolodymyrOsinchuk/PERN-EUROPE-UA.git
git branch -M main
git push -u origin main

cd backend && NODE_ENV=production ALLOW_PRODUCTION_SEED=true node scripts/seedData.js

read -s "SEED_ADMIN_PASSWORD?Mot de passe admin : "; printf '\n'; export SEED_ADMIN_PASSWORD
read -s "SEED_DEMO_PASSWORD?Mot de passe des comptes de démonstration : "; printf '\n'; export SEED_DEMO_PASSWORD
NODE_ENV=production ALLOW_PRODUCTION_SEED=true node scripts/seedData.js
