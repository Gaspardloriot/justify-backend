# justify-backend
 Backend for justify app
 
 L'application est divisée en quatre parties principales:
 
 Le folder index.js contient le set-up pour le serveur, les routes et la base de données.
 
Le folder justifyUsers.js contient la création du Schema MongoDb afin de sauvegarder les utilisateurs et leurs données.
 
Le folder decrypt.js sert à décrypter le token lorsqu'il est renvoyé pour vérification (il aura été crypté lors de son envoi sur le localstorage).

Enfin, le folder justifier contient les fonctions de justification de l'api. elles reçoivent en paramètre le texte envoyé lors du POST request émanant du client (en admettant que la vérification par token soit successful).


