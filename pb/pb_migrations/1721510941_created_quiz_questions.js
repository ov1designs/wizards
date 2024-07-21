/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "q30ko5oi30ym8hg",
    "created": "2024-07-20 21:29:01.022Z",
    "updated": "2024-07-20 21:29:01.022Z",
    "name": "quiz_questions",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "xss9vvqi",
        "name": "quiz",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "tr01qev2gz7ykl1",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "envzih2e",
        "name": "question_text",
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
  const collection = dao.findCollectionByNameOrId("q30ko5oi30ym8hg");

  return dao.deleteCollection(collection);
})
