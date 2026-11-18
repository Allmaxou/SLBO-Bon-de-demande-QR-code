# SLBO - Bons de demande par QR code

Page web utilisée par la Clinique Saint-Luc Bouge pour rediriger vers le
formulaire Google Forms correspondant à la version du bon de demande scanné.

## Fonctionnement

Le QR code ouvre la page avec deux paramètres :

- `doc` : identifiant de la version du document ;
- `side` : côté du document scanné, avec la valeur `recto` ou `verso`.

La page charge ensuite les informations de la version demandée depuis
[`data.json`](./data.json).

La référence affichée indique le document, le côté scanné et la date de
déploiement, par exemple :

```text
SLBO_V11_recto 2026-01-01
```

Si le paramètre `side` est absent ou invalide, aucun suffixe de côté n'est
ajouté à la référence.

## Tester localement

Le projet ne nécessite aucune installation de dépendances. Un serveur web
local est toutefois nécessaire, car la page charge `data.json` avec `fetch`.

Depuis le dossier du projet, exécuter :

```powershell
py -m http.server 8000
```

Ouvrir ensuite l'une des URLs suivantes dans un navigateur :

- [Document 11 - recto](http://localhost:8000/?doc=11&side=recto)
- [Document 11 - verso](http://localhost:8000/?doc=11&side=verso)
- [Document 12 - recto](http://localhost:8000/?doc=12&side=recto)
- [Document 12 - verso](http://localhost:8000/?doc=12&side=verso)

Pour arrêter le serveur, utiliser `Ctrl+C` dans PowerShell.

## Créer les QR codes

Créer un QR code différent pour chaque côté de chaque version. Les URLs à
encoder doivent respecter ce format :

```text
https://<adresse-du-site>/?doc=11&side=recto
https://<adresse-du-site>/?doc=11&side=verso
```

Le côté ne peut pas être détecté automatiquement si le recto et le verso
utilisent exactement la même URL. Il doit donc être défini dans le QR code.

## Modifier une version de document

Ajouter ou modifier une entrée dans [`data.json`](./data.json) :

```json
{
  "13": {
    "title": "Bon de demande 13",
    "scanCode": "SLBO_V13",
    "version": "13",
    "deployedAt": "2026-11-18",
    "updatedAt": "2026-11-18",
    "formUrl": "https://docs.google.com/forms/d/e/FORM_ID/viewform"
  }
}
```

Le paramètre `doc=13` permettra alors d'accéder à cette nouvelle version.

## Structure du projet

- [`index.html`](./index.html) : structure de la page ;
- [`app.js`](./app.js) : lecture des paramètres et chargement des données ;
- [`data.json`](./data.json) : configuration des documents et formulaires ;
- [`styles.css`](./styles.css) : mise en forme ;
- [`clinique-saint-luc-logo.png`](./clinique-saint-luc-logo.png) : logo affiché.
