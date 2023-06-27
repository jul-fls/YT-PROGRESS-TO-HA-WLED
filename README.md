# YT-PROGRESS-TO-HA-WLED

Système permettant de synchroniser la progression de visionnage de vidéos et shorts youtube sur un controllerur wled via Home Assistant


Ce système est composé de plusieurs élements :
- Extension chromium (chrome, brave, edge, etc...) (pour récupérer la progression de lecture de la vidéo youtube)
- Cloudflare Worker JS (pour proxifier les requetes en https entre le navigateur sur la page du player youtube et l'instance Home Assistant pour ne pas être limité au niveau des limitations du CORS)
- Tunnel cloudflare (pour exposer en ligne son instance home assistant (non obligatoire, l'abonnement "nabu casa cloud" fonctionne tout aussi bien)
- Instance Home Assistant hebergé en local (raspberry pi, vm, conteneur docker, etc...)
- Ruban Led Adressable piloté avec un contrôleur disposant du firmware "WLED"

# Mise en place 
1. Configurer le controleur WLED sur son réseau wifi et l'intégrer à Home Assistant soit manuellement soit via la découverte automatique de Home Assistant via l'intégration "WLED"
2. Créer une entrée numérique (input number) sur son instance Home Assistant lui donner un nom clair (ça servira à envoyer à Home Assistant le pourcentage actuel de la vidéo en cours de lecture) (ex: "input_number.yt_video_progress")
3. Créer une automatisation en vous basant sur le fichier yaml "automation.yaml" dans le repository
4. Créer une clé d'API Home Assistant (jeton d'accès longue durée) via votre profile Home Assistant [LIEN MY HOME ASSISTANT](https://my.home-assistant.io/redirect/profile/) lui donner un nom qui fait sens et stocker le jeton d'accès de manière sécurisé et fiable (ce dernier permet d'agir en votre nom sur votre instance Home Assistant (même droits)) étant donné que vous ne pourrez plus jamais l'afficher de nouveau au travers d'Home Assistant
5. Vérifier que l'accès public (en dehors du réseau local de votre instance Home Assistant) à votre instance Home Assistant est fonctionnel et noter l'url d'accès (ex: "domotique.domain.tld" ou "abc123def456ghi789.ui.nabu.casa").
6. Configurer le worker js cloudflare (non obligatoire, un simple proxy cors fera l'affaire à condition qu'il soit suffisamment sécurisé)
   * Créer ou se connecter à son compte cloudflare afin de configurer le worker js, pour ce faire aller dans votre tableau de board cloudflare après avoir configuré votre compte avec un site (domaine personnel)
   * Cliquer dans la section de gauche sur "Workers et pages" puis "Créer une application"
   * Cliquer sur "Créer un worker"
   * Changer le nom généré automatiquement pour quelque chose de plus explicite pour vous et cliquer sur "Déployer"
   * Noter dans un bloc notes ou autre l'url figurant sous le texte "Aperçu" il s'agit de l'url de votre worker js cloudflare (ex: "https://hello-world-yt-progress-to-ha-wled.usernae-abc123.workers.dev")
   * Cliquer sur "Modification rapide"
   * Effacer tout le code par défaut au sein du fichier "worker.js" et le remplacer par le contenu du fichier source "worker.js" du repository
   * Cliquer sur "Enregistrer et déployer" en haut à droite et attendre environ 1 minute que les modifications soient faites sur les serveurs de cloudflare
7. Installer et configurer l'extension chrome
   * Installer l'extension chrome "YT PROGRESS TO HA WLED" en allant dans la page de gestion des extensions de votre navigateur en tapant l'url ou via le menu de votre navigateur (ex: "chrome://extensions", "brave://extensions", "edge://extensions", etc...)
   * Télécharger une copie locale du repository au format zip et la dézipper dans vos téléchargements ou autre
   * Activer le mode développeur si ce n'est pas déjà le cas
   * Cliquer sur "Charger l'extension décompréssée" et ouvrir le dossier "YT-PROGRESS-TO-HA-WLED"
   * L'extension devrait désormais s'afficher dans la liste
   * Dans la barre d'extensions dans la liste repérer l'icone de cette dernière et cliquer dessus
   * Un formulaire devrait à présent s'afficher contenant les champs suivant :
     * Jeton d'accès API Home Assistant
     * Url publique de votre instance Home Assistant
     * Id de l'entité de l'input number créé pour le pourcentage de la vidéo regardée
     * Url de votre worker cloudflare noté précédemment
    * Une fois les champs correctement saisies cliquer sur "Enregistrer"
8. Normalement il ne vous reste plus qu'à tester et tout devrait fonctionner
