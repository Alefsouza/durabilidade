routerAdd('GET', '/backend/v1/inventory-proxy', (e) => {
  const url = $secrets.get('VITE_ORDS_API_URL')

  if (!url) {
    const mockData = [
      {
        cod_mat_teste: 'PN-1001',
        desc_mat_teste: 'Pastilha de Freio Dianteira',
        marca_teste: 'BrakeTech',
        km_esperado: 40000,
        quantidade: 50,
        filial: 'SP',
      },
      {
        cod_mat_teste: 'PN-2022',
        desc_mat_teste: 'Filtro de Ar Motor',
        marca_teste: 'AirPure',
        km_esperado: 20000,
        quantidade: 120,
        filial: 'RJ',
      },
      {
        cod_mat_teste: 'PN-3033',
        desc_mat_teste: 'Pneu Liso 295/80',
        marca_teste: 'TireMax',
        km_esperado: 120000,
        quantidade: 30,
        filial: 'MG',
      },
    ]
    return e.json(
      200,
      mockData.map((item) => ({
        id: String(item.cod_mat_teste),
        partNumber: String(item.cod_mat_teste),
        name: item.desc_mat_teste,
        supplier: item.marca_teste,
        expectedKm: Number(item.km_esperado) || 0,
        quantity: Number(item.quantidade) || 0,
        branch: item.filial || 'Todas',
      })),
    )
  }

  try {
    const res = $http.send({
      url: url,
      method: 'GET',
      timeout: 15,
    })

    if (res.statusCode !== 200) {
      $app.logger().error('ORDS API error', 'statusCode', res.statusCode)
      return e.internalServerError('Unable to sync with Oracle database')
    }

    const data = res.json || []
    const items = Array.isArray(data) ? data : data.items || []

    const mapped = items.map((item) => ({
      id: String(item.cod_mat_teste || Math.random().toString(36).substr(2, 9)),
      partNumber: String(item.cod_mat_teste || ''),
      name: String(item.desc_mat_teste || ''),
      supplier: String(item.marca_teste || ''),
      expectedKm: Number(item.km_esperado) || 0,
      quantity: Number(item.quantidade || 0),
      branch: String(item.filial || 'Todas'),
    }))

    return e.json(200, mapped)
  } catch (err) {
    $app.logger().error('ORDS API request failed', 'error', String(err))
    return e.internalServerError('Unable to sync with Oracle database')
  }
})
