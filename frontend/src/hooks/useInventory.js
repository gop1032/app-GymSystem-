import { useCallback, useEffect, useState } from 'react'
import api from '../config/api'

export function useInventory() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const loadProducts = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/inventory')
      setProducts(data.data || [])
    } finally {
      setLoading(false)
    }
  }, [])

  const createProduct = async (payload) => {
    const { data } = await api.post('/inventory', payload)
    await loadProducts()
    return data.data
  }

  const updateProduct = async (id, payload) => {
    const { data } = await api.put(`/inventory/${id}`, payload)
    await loadProducts()
    return data.data
  }

  const deleteProduct = async (id) => {
    const { data } = await api.delete(`/inventory/${id}`)
    await loadProducts()
    return data.data
  }

  const sellProduct = async (productId, quantity) => {
    const { data } = await api.post('/inventory/sales', { productId, quantity })
    await loadProducts()
    return data.data
  }

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  return { products, loading, loadProducts, createProduct, updateProduct, deleteProduct, sellProduct }
}
