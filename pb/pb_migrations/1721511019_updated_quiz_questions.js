/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("q30ko5oi30ym8hg")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kwounesq",
    "name": "correct_answer",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "olowqijukbs2mab",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("q30ko5oi30ym8hg")

  // remove
  collection.schema.removeField("kwounesq")

  return dao.saveCollection(collection)
})
