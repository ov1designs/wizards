/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "olowqijukbs2mab",
    "created": "2024-07-20 21:29:50.333Z",
    "updated": "2024-07-20 21:29:50.333Z",
    "name": "quiz_answers",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "y19xpksn",
        "name": "question",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "q30ko5oi30ym8hg",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "5puthgvy",
        "name": "answer_text",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
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
  const collection = dao.findCollectionByNameOrId("olowqijukbs2mab");

  return dao.deleteCollection(collection);
})
