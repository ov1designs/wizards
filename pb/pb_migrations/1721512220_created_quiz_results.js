/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "0i5wrb6gdzc3cdg",
    "created": "2024-07-20 21:50:20.583Z",
    "updated": "2024-07-20 21:50:20.583Z",
    "name": "quiz_results",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "il6jdcoz",
        "name": "user",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("0i5wrb6gdzc3cdg");

  return dao.deleteCollection(collection);
})
