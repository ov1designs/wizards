/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0i5wrb6gdzc3cdg")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "b4kgh4ky",
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
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "egsugaej",
    "name": "score",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cogeksof",
    "name": "passed",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ea4oovca",
    "name": "completed",
    "type": "date",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0i5wrb6gdzc3cdg")

  // remove
  collection.schema.removeField("b4kgh4ky")

  // remove
  collection.schema.removeField("egsugaej")

  // remove
  collection.schema.removeField("cogeksof")

  // remove
  collection.schema.removeField("ea4oovca")

  return dao.saveCollection(collection)
})
