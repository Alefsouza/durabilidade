migrate(
  (app) => {
    const collection = new Collection({
      name: 'materials',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'supplier', type: 'text', required: true },
        { name: 'partNumber', type: 'text', required: true },
        { name: 'expectedKm', type: 'number', required: true },
        { name: 'quantity', type: 'number', required: true },
        {
          name: 'branch',
          type: 'select',
          required: true,
          values: ['SP', 'RJ', 'MG', 'RS', 'Todas'],
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('materials')
    app.delete(collection)
  },
)
