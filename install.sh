echo "Installing, meh"
cp .env.example .env
composer install
vendor\\bin\\homestead make
npm install
vagrant up
php artisan key:generate
echo "installation done"

