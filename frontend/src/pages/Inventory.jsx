import React, { useMemo, useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import { useInventory } from '../hooks/useInventory'
import { AuthContext } from '../context/AuthContext'
import { Search, Package, ShoppingCart, Plus, Edit2, Trash2, TrendingDown, Box, DollarSign, AlertTriangle } from 'lucide-react'

const CATEGORY_IMAGES = {
  suplemento: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=400&auto=format&fit=crop&q=70',
  proteína:   'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=400&auto=format&fit=crop&q=70',
  creatina:   'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=70',
  accesorio:  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop&q=70',
  ropa:       'https://images.unsplash.com/photo-1517720359744-6d12f8a09b10?w=400&auto=format&fit=crop&q=70',
  bebida:     'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&auto=format&fit=crop&q=70',
}

function getImg(name, category) {
  const n = name?.toLowerCase() || ''
  const c = category?.toLowerCase() || ''
  if (n.includes('prot') || n.includes('whey') || n.includes('mass')) return CATEGORY_IMAGES.suplemento
  if (n.includes('creat')) return CATEGORY_IMAGES.creatina
  if (n.includes('pre-') || n.includes('bcaa') || n.includes('amino')) return CATEGORY_IMAGES.suplemento
  if (c === 'bebida' || n.includes('agua') || n.includes('gator') || n.includes('monster')) return CATEGORY_IMAGES.bebida
  if (c === 'ropa' || n.includes('polera') || n.includes('short')) return CATEGORY_IMAGES.ropa
  if (c === 'accesorio' || n.includes('shaker') || n.includes('guant') || n.includes('banda') || n.includes('toalla') || n.includes('cuerda')) return CATEGORY_IMAGES.accesorio
  return 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&auto=format&fit=crop&q=70'
}

const CAT_COLORS = {
  suplemento: { bg: 'rgba(251,191,36,0.15)', text: '#fbbf24' },
  accesorio:  { bg: 'rgba(59,130,246,0.15)', text: '#3b82f6' },
  ropa:       { bg: 'rgba(219,39,119,0.15)', text: '#db2777' },
  bebida:     { bg: 'rgba(5,150,105,0.15)',  text: '#059669' },
  otro:       { bg: 'rgba(107,114,128,0.15)',text: '#6b7280' },
}

function getCatColor(cat) {
  return CAT_COLORS[cat?.toLowerCase()] || CAT_COLORS.otro
}

function ProductCard({ product, canManage, isClient, onSell, onEdit, onDelete }) {
  const [imgError, setImgError] = useState(false)
  const img = product.imageUrl || getImg(product.name, product.category)
  const catColor = getCatColor(product.category)
  const stockLow = product.stock > 0 && product.stock <= 5
  const outOfStock = product.stock <= 0

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)', border: `1px solid ${outOfStock ? 'rgba(220,38,38,0.2)' : 'rgba(255,255,255,0.08)'}`,
      borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
      transition: 'all 0.25s', opacity: outOfStock ? 0.6 : 1
    }}
      onMouseEnter={e => { if (!outOfStock) { e.currentTarget.style.borderColor = 'rgba(251,191,36,0.3)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)' }}}
      onMouseLeave={e => { e.currentTarget.style.borderColor = outOfStock ? 'rgba(220,38,38,0.2)' : 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
    >
      {/* Image */}
      <div style={{ height: '160px', overflow: 'hidden', position: 'relative', background: '#111827' }}>
        <img
          src={imgError ? 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&auto=format&fit=crop&q=70' : img}
          onError={() => setImgError(true)}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: outOfStock ? 'grayscale(70%)' : 'none' }}
        />
        {/* Badges overlay */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
          <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 800, background: catColor.bg, color: catColor.text, backdropFilter: 'blur(8px)' }}>
            {product.category}
          </span>
          {stockLow && !outOfStock && (
            <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 800, background: 'rgba(220,38,38,0.8)', color: '#fff' }}>
              ¡Últimas unidades!
            </span>
          )}
          {outOfStock && (
            <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 800, background: 'rgba(220,38,38,0.9)', color: '#fff' }}>
              Sin stock
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem', marginBottom: '4px', lineHeight: 1.3 }}>{product.name}</h3>
          <p style={{ color: '#4b5563', fontSize: '0.75rem' }}>Stock: {product.stock} unidades</p>
        </div>

        <div style={{ marginTop: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#fbbf24', fontSize: '1.4rem', fontWeight: 900 }}>
              S/. {Number(product.price).toFixed(2)}
            </span>
            {!isClient && canManage && (
              <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                Total stock: S/. {(Number(product.price) * product.stock).toFixed(2)}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onSell(product)}
              disabled={outOfStock}
              style={{
                flex: 1, padding: '10px', borderRadius: '12px', fontWeight: 800, fontSize: '0.82rem',
                background: outOfStock ? 'rgba(107,114,128,0.1)' : 'linear-gradient(135deg,#fbbf24,#d97706)',
                color: outOfStock ? '#4b5563' : '#030712', border: 'none',
                cursor: outOfStock ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
              }}
            >
              <ShoppingCart size={14} />
              {outOfStock ? 'Sin stock' : isClient ? 'Comprar' : 'Vender'}
            </button>
            {canManage && (
              <>
                <button onClick={() => onEdit(product)} style={{ padding: '10px 12px', borderRadius: '12px', background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', color: '#3b82f6', cursor: 'pointer' }}>
                  <Edit2 size={14} />
                </button>
                <button onClick={() => onDelete(product)} style={{ padding: '10px 12px', borderRadius: '12px', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', color: '#ef4444', cursor: 'pointer' }}>
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const initialValues = { name: '', category: 'suplemento', stock: 0, price: 0, imageUrl: '', isActive: true }
const CATEGORIES = ['suplemento', 'accesorio', 'ropa', 'bebida', 'otro']

export default function Inventory() {
  const { user } = useContext(AuthContext)
  const isClient     = user?.role === 'CLIENT'
  const isNutrition  = user?.role === 'NUTRITIONIST'
  const canManage    = user?.role === 'ADMIN' || user?.role === 'RECEPTIONIST'

  const { products, loading, createProduct, updateProduct, deleteProduct, sellProduct } = useInventory()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('ALL')
  const [showForm, setShowForm] = useState(false)
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({ defaultValues: initialValues })

  const isEditing = Boolean(selectedProduct)

  const onSubmit = async (values) => {
    try {
      const payload = { ...values, stock: Number(values.stock), price: Number(values.price), isActive: true }
      if (isEditing) {
        await updateProduct(selectedProduct.id, payload)
        Swal.fire({ icon: 'success', title: '✅ Producto actualizado', timer: 1400, showConfirmButton: false, background: '#111827', color: '#fff' })
      } else {
        await createProduct(payload)
        Swal.fire({ icon: 'success', title: '✅ Producto creado', timer: 1400, showConfirmButton: false, background: '#111827', color: '#fff' })
      }
      setSelectedProduct(null)
      setShowForm(false)
      reset(initialValues)
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error?.response?.data?.message || error.message, background: '#111827', color: '#fff' })
    }
  }

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setShowForm(true)
    reset({ name: product.name, category: product.category, stock: product.stock, price: product.price, imageUrl: product.imageUrl || '', isActive: product.isActive })
  }

  const handleDelete = async (product) => {
    const result = await Swal.fire({
      title: `¿Desactivar ${product.name}?`,
      text: 'El producto dejará de aparecer en el catálogo.',
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#ef4444', confirmButtonText: 'Sí, desactivar',
      background: '#111827', color: '#fff'
    })
    if (!result.isConfirmed) return
    try {
      await deleteProduct(product.id)
      Swal.fire({ icon: 'success', title: 'Desactivado', timer: 1000, showConfirmButton: false, background: '#111827', color: '#fff' })
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error?.response?.data?.message || error.message, background: '#111827', color: '#fff' })
    }
  }

  const handleSell = async (product) => {
    const { value: qty } = await Swal.fire({
      title: isClient ? `🛒 Comprar: ${product.name}` : `💰 Registrar Venta: ${product.name}`,
      html: `
        <div style="background:#1f2937;border:1px solid #374151;border-radius:12px;padding:12px;margin:8px 0;text-align:left">
          <p style="color:#9ca3af;font-size:0.8rem">Precio unitario</p>
          <p style="color:#fbbf24;font-size:1.4rem;font-weight:900">S/. ${Number(product.price).toFixed(2)}</p>
          <p style="color:#6b7280;font-size:0.75rem;margin-top:4px">Stock disponible: ${product.stock} unidades</p>
        </div>
      `,
      input: 'number',
      inputLabel: 'Cantidad',
      inputValue: 1,
      inputAttributes: { min: 1, max: product.stock, step: 1 },
      showCancelButton: true,
      confirmButtonText: isClient ? '✅ Confirmar Compra' : '✅ Registrar Venta',
      background: '#111827', color: '#fff',
      inputValidator: (v) => {
        if (!v || Number(v) <= 0) return 'Ingresa una cantidad válida'
        if (Number(v) > product.stock) return `Solo hay ${product.stock} en stock`
      }
    })
    if (!qty) return
    try {
      const total = (Number(product.price) * Number(qty)).toFixed(2)
      await sellProduct(product.id, Number(qty))
      Swal.fire({
        icon: 'success',
        title: isClient ? '¡Compra realizada!' : '¡Venta registrada!',
        html: `
          <p style="color:#9ca3af">Producto: <strong style="color:#fff">${product.name}</strong></p>
          <p style="color:#9ca3af;margin-top:6px">Cantidad: <strong style="color:#fbbf24">${qty} unid.</strong></p>
          <p style="color:#9ca3af;margin-top:6px">Total: <strong style="color:#fbbf24">S/. ${total}</strong></p>
          ${isClient ? '<p style="color:#6b7280;font-size:0.8rem;margin-top:8px">Recoge tu pedido en recepción 📦</p>' : ''}
        `,
        background: '#111827', color: '#fff',
        confirmButtonColor: '#fbbf24', confirmButtonText: 'Entendido'
      })
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error en la venta', text: error?.response?.data?.message || error.message, background: '#111827', color: '#fff' })
    }
  }

  const filteredProducts = useMemo(() =>
    products
      .filter(p => isClient || isNutrition ? p.isActive : true)
      .filter(p => filterCat === 'ALL' || p.category?.toLowerCase() === filterCat)
      .filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase())
      ),
    [products, search, filterCat, isClient, isNutrition]
  )

  const stats = {
    total: products.length,
    active: products.filter(p => p.isActive).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock <= 5).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    totalValue: products.reduce((acc, p) => acc + Number(p.price) * p.stock, 0)
  }

  const inputS = { width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '0.88rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', boxSizing: 'border-box' }
  const labelS = { color: '#9ca3af', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px', display: 'block' }

  return (
    <div style={{ minHeight: '100vh', background: '#030712', padding: '2rem', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <p style={{ color: '#fbbf24', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em' }}>
              {isClient ? 'Catálogo' : isNutrition ? 'Suplementos' : 'Gestión de Inventario'}
            </p>
            <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginTop: '4px' }}>
              {isClient ? 'Tienda Gym System' : isNutrition ? 'Suplementos y Nutrición' : 'Inventario y Ventas'}
            </h1>
          </div>
          {canManage && (
            <button
              onClick={() => { setShowForm(s => !s); setSelectedProduct(null); reset(initialValues) }}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px',
                borderRadius: '12px', background: showForm ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg,#fbbf24,#d97706)',
                color: showForm ? '#9ca3af' : '#030712', fontWeight: 800, fontSize: '0.9rem', border: 'none', cursor: 'pointer'
              }}
            >
              <Plus size={18} />
              {showForm ? 'Cancelar' : 'Nuevo Producto'}
            </button>
          )}
        </div>

        {/* KPI Stats — solo para admins */}
        {canManage && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { label: 'Total productos', value: stats.total, icon: <Box size={16} />, color: '#fbbf24' },
              { label: 'Activos', value: stats.active, icon: <Package size={16} />, color: '#059669' },
              { label: 'Stock bajo', value: stats.lowStock, icon: <TrendingDown size={16} />, color: '#d97706' },
              { label: 'Sin stock', value: stats.outOfStock, icon: <AlertTriangle size={16} />, color: '#dc2626' },
              { label: 'Valor total', value: `S/. ${stats.totalValue.toFixed(0)}`, icon: <DollarSign size={16} />, color: '#8b5cf6' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <p style={{ color: '#6b7280', fontSize: '0.72rem', fontWeight: 600 }}>{s.label}</p>
                  <div style={{ color: s.color }}>{s.icon}</div>
                </div>
                <p style={{ color: s.color, fontSize: '1.5rem', fontWeight: 900 }}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Form inline — solo para admins */}
        {canManage && showForm && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '20px', padding: '1.5rem', marginBottom: '2rem' }}>
            <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.25rem' }}>
              {isEditing ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', alignItems: 'end' }}>
                <div>
                  <label style={labelS}>Nombre *</label>
                  <input style={inputS} type="text" placeholder="Ej: Proteína Whey" {...register('name', { required: true })} />
                </div>
                <div>
                  <label style={labelS}>Categoría *</label>
                  <select style={inputS} {...register('category', { required: true })}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelS}>Stock</label>
                  <input style={inputS} type="number" min="0" {...register('stock', { valueAsNumber: true })} />
                </div>
                <div>
                  <label style={labelS}>URL Imagen</label>
                  <input style={inputS} type="text" placeholder="https://..." {...register('imageUrl')} />
                </div>
                <div>
                  <label style={labelS}>Precio (S/.)</label>
                  <input style={inputS} type="number" min="0" step="0.01" {...register('price', { valueAsNumber: true })} />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="submit" disabled={isSubmitting} style={{ flex: 1, padding: '10px', borderRadius: '12px', background: 'linear-gradient(135deg,#fbbf24,#d97706)', color: '#030712', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>
                    {isSubmitting ? '...' : isEditing ? 'Actualizar' : 'Guardar'}
                  </button>
                  {isEditing && (
                    <button type="button" onClick={() => { setSelectedProduct(null); reset(initialValues) }} style={{ padding: '10px 12px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af', cursor: 'pointer', fontSize: '0.85rem' }}>
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Search + category filter */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar productos..."
              style={{ width: '100%', paddingLeft: '42px', paddingRight: '14px', paddingTop: '11px', paddingBottom: '11px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.88rem', boxSizing: 'border-box' }}
            />
          </div>
          {['ALL', ...CATEGORIES].map(cat => {
            const cc = getCatColor(cat)
            return (
              <button key={cat} onClick={() => setFilterCat(cat)} style={{
                padding: '10px 16px', borderRadius: '10px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
                border: filterCat === cat ? 'none' : '1px solid rgba(255,255,255,0.08)',
                background: filterCat === cat ? (cat !== 'ALL' ? cc.bg : 'linear-gradient(135deg,#fbbf24,#d97706)') : 'rgba(255,255,255,0.03)',
                color: filterCat === cat ? (cat !== 'ALL' ? cc.text : '#030712') : '#6b7280',
              }}>
                {cat === 'ALL' ? '📦 Todos' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            )
          })}
        </div>

        {/* Products grid */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#374151', paddingTop: '4rem', fontSize: '1rem' }}>Cargando productos...</div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#374151' }}>
            <Package size={40} style={{ margin: '0 auto 12px', opacity: .4 }} />
            <p style={{ fontWeight: 700 }}>No se encontraron productos</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                canManage={canManage}
                isClient={isClient || isNutrition}
                onSell={handleSell}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Client CTA banner */}
        {(isClient) && (
          <div style={{ marginTop: '2rem', background: 'linear-gradient(135deg,rgba(251,191,36,0.12),rgba(217,119,6,0.06))', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '20px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '2rem' }}>📦</span>
            <div>
              <p style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>¿Realizaste una compra?</p>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '4px' }}>Dirígete a recepción con tu código de compra para retirar tu pedido. Aceptamos efectivo, tarjeta y transferencia.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
