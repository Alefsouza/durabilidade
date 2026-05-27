migrate(
  (app) => {
    const collection = new Collection({
      name: 'durability_tests',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'material_id', type: 'text', required: true },
        { name: 'prefix', type: 'text', required: true },
        { name: 'position', type: 'text', required: true },
        { name: 'start_date', type: 'text', required: true },
        { name: 'start_km', type: 'number', required: true },
        { name: 'current_km', type: 'number', required: false },
        { name: 'final_km', type: 'number', required: false },
        { name: 'end_date', type: 'text', required: false },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['ativo', 'aprovado', 'reprovado'],
          maxSelect: 1,
        },
        {
          name: 'branch',
          type: 'select',
          required: true,
          values: ['SP', 'RJ', 'MG', 'RS'],
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('durability_tests')
    app.delete(collection)
  },
)
