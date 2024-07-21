/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("b36lt0a0v5anqh3")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bpb7hz3a",
    "name": "has_audio_exercise",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("b36lt0a0v5anqh3")

  // remove
  collection.schema.removeField("bpb7hz3a")

  return dao.saveCollection(collection)
})
