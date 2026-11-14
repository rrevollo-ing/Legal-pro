import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

export default function App() {
  const [expedientes, setExpedientes] = useState([])
  const [numeroCaso, setNumeroCaso] = useState('')
  const [editingId, setEditingId] = useState(null)
  
  // Estado para controlar la apertura del menú lateral en celulares
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    fetchExpedientes()
  }, [])

  async function fetchExpedientes() {
    const { data, error } = await supabase
      .from('expedientes')
      .select('*')
      .order('created_at', { ascending: false })
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

  // Función para el botón de salida / cerrar sesión
  function handleLogout() {
    if (window.confirm('¿Deseas salir de la aplicación?')) {
      // Limpia la vista o redirige según prefieras
      alert('Sesión finalizada correctamente.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row overflow-x-hidden">
      
      {/* 1. Barra superior móvil con botón de menú (Visible solo en celulares) */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center shadow-md z-40">
        <span className="font-bold text-lg text-teal-400">LegalPro PWA</span>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-slate-800 px-3 py-1.5 rounded text-sm font-medium text-white border border-slate-700 focus:outline-none"
        >
          {sidebarOpen ? '✕ Cerrar' : '☰ Menú'}
        </button>
      </div>

      {/* 2. Menú Lateral / Sidebar adaptable */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out shadow-xl
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          <div className="text-xl font-bold text-teal-400 mb-8 hidden md:block">LegalPro PWA</div>
          <nav className="space-y-2 mt-12 md:mt-0">
            <a href="#expedientes" onClick={() => setSidebarOpen(false)} className="block px-3 py-2 rounded bg-slate-800 text-teal-300 font-medium">
              📁 Gestión de Expedientes
            </a>
            <a href="#config" onClick={() => setSidebarOpen(false)} className="block px-3 py-2 rounded hover:bg-slate-800 text-slate-300">
              ⚙️ Configuración
            </a>
          </nav>
        </div>

        {/* Botón de Salida / Cerrar Sesión */}
        <div className="pt-6 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2 border border-rose-500/30"
          >
            🚪 Salir de la App
          </button>
        </div>
      </aside>

      {/* 3. Contenido Principal de la App */}
      <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full overflow-y-auto">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Gestión de Expedientes</h1>
          <p className="text-sm text-slate-500">Sistema de control jurídico sincronizado en la nube</p>
        </header>

        {/* Formulario de Registro / Edición */}
        <form onSubmit={handleSubmit} className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-slate-200 mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {editingId ? 'Editar Expediente / Código' : 'Nuevo Expediente o Caso'}
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={numeroCaso}
              onChange={(e) => setNumeroCaso(e.target.value)}
              placeholder="Ej: EXP-2026-001"
              className="flex-1 border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
            />
            <button 
              type="submit" 
              className={`px-5 py-2 rounded font-medium text-white transition-colors ${editingId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-teal-600 hover:bg-teal-700'}`}
            >
              {editingId ? 'Actualizar' : 'Guardar'}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => { setEditingId(null); setNumeroCaso(''); }}
                className="bg-slate-300 text-slate-700 px-4 py-2 rounded hover:bg-slate-400 font-medium text-sm"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* Listado de Expedientes */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 md:p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Expedientes Registrados</h2>
          {expedientes.length === 0 ? (
            <p className="text-slate-400 text-sm py-4 text-center">No hay expedientes registrados todavía.</p>
          ) : (
            <ul className="space-y-3">
              {expedientes.map((exp) => (
                <li key={exp.id} className="p-3 md:p-4 rounded border border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="font-semibold text-slate-800 block">{exp.numero_caso}</span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">{exp.estado || 'Activo'}</span>
                  </div>
                  <button 
                    onClick={() => iniciarEdicion(exp)}
                    className="bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded text-sm hover:bg-slate-100 font-medium self-end sm:self-auto"
                  >
                    Editar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}