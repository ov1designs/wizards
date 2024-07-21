/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tr01qev2gz7ykl1")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "yl82fzib",
    "name": "Lesson",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "b36lt0a0v5anqh3",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tr01qev2gz7ykl1")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "yl82fzib",
    "name": "lesson",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "b36lt0a0v5anqh3",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
})
