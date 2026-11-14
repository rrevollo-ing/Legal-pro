import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

export default function App() {
  const [expedientes, setExpedientes] = useState([])
  const [numeroCaso, setNumeroCaso] = useState('')
  const [editingId, setEditingId] = useState(null)
  
  // Estado para abrir/cerrar el menú en celulares
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    fetchExpedientes()
  }, [])

  async function fetchExpedientes() {
    const { data } = await supabase.from('expedientes').select('*')
    if (data) setExpedientes(data)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!numeroCaso.trim()) return

    if (editingId) {
      const { error } = await supabase
        .from('expedientes')
        .update({ numero_caso: numeroCaso })
        .eq('id', editingId)

      if (!error) {
        setEditingId(null)
        setNumeroCaso('')
        fetchExpedientes()
      }
    } else {
      const { error } = await supabase
        .from('expedientes')
        .insert([{ numero_caso: numeroCaso, estado: 'Activo' }])

      if (!error) {
        setNumeroCaso('')
        fetchExpedientes()
      }
    }
  }

  function iniciarEdicion(exp) {
    setEditingId(exp.id)
    setNumeroCaso(exp.numero_caso)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row overflow-x-hidden">
      
      {/* 1. Barra superior móvil con botón de menú (Solo visible en celulares) */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center shadow-md z-40">
        <span className="font-bold text-lg text-teal-400">LegalPro PWA</span>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-slate-800 px-3 py-1.5 rounded text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          {sidebarOpen ? '✕ Cerrar' : '☰ Menú'}
        </button>
      </div>

      {/* 2. Men