import React, { useState, useEffect } from 'react';
import { Briefcase, Calendar, FileText, Users, Plus, CheckCircle, Clock, ShieldCheck, Wifi, WifiOff } from 'lucide-react';

export default function LegalProApp() {
  const [seccionActiva, setSeccionActiva] = useState('casos');
  const [conectado, setConectado] = useState(navigator.onLine);
  
  // Base de datos local persistente (Offline-First con LocalStorage)
  const [casos, setCasos] = useState(() => {
    const datosGuardados = localStorage.getItem('legalpro_casos');
    if (datosGuardados) {
      try {
        return JSON.parse(datosGuardados);
      } catch (e) {
        console.error("Error al leer datos locales", e);
      }
    }
    // Casos iniciales por defecto si no existe historial previo
    return [
      { id: '1', codigo: 'NUREJ-7012', cliente: 'María Elena Soliz', materia: 'Civil', juzgado: 'Juzgado 1ro Civil', vencimiento: '2026-03-20', estado: 'Al Día' },
      { id: '2', codigo: 'NUREJ-7019', cliente: 'Constructora Urubó', materia: 'Comercial', juzgado: 'Juzgado 4to Civil', vencimiento: '2026-03-18', estado: 'Atención' },
    ];
  });

  // Guardado automático en almacenamiento local ante cualquier modificación
  useEffect(() => {
    localStorage.setItem('legalpro_casos', JSON.stringify(casos));
  }, [casos]);

  const [nuevoCasoModal, setNuevoCasoModal] = useState(false);
  const [nombreCliente, setNombreCliente] = useState('');
  const [codigoNurej, setCodigoNurej] = useState('');

  useEffect(() => {
    const handleOnline = () => setConectado(true);
    const handleOffline = () => setConectado(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const agregarCaso = (e) => {
    e.preventDefault();
    if (!nombreCliente || !codigoNurej) return;
    const nuevo = {
      id: Date.now().toString(),
      codigo: codigoNurej,
      cliente: nombreCliente,
      materia: 'Civil / General',
      juzgado: 'Juzgado de Turno Santa Cruz',
      vencimiento: '2026-04-01',
      estado: 'Al Día',
      sync: conectado ? 'Sincronizado' : 'Pendiente en Cola Local'
    };
    setCasos([nuevo, ...casos]);
    setNombreCliente('');
    setCodigoNurej('');
    setNuevoCasoModal(false);
  };

  return (
    <div className="flex h-screen bg-[#F4F1EA] text-[#0A192F] font-sans">
      
      {/* Barra Lateral con Terminología Simplificada */}
      <aside className="w-64 bg-[#0A192F] text-[#F4F1EA] flex flex-col shadow-xl">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-extrabold tracking-wide text-white">LEGAL<span className="text-[#0D9488]">PRO</span></h1>
          <p className="text-xs text-slate-400 mt-1">Santa Cruz de la Sierra</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setSeccionActiva('casos')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${seccionActiva === 'casos' ? 'bg-[#0D9488] text-white shadow-md' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <Briefcase size={18} />
            <span>Mis Casos (50 máx)</span>
          </button>

          <button 
            onClick={() => setSeccionActiva('agenda')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${seccionActiva === 'agenda' ? 'bg-[#0D9488] text-white shadow-md' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <Calendar size={18} />
            <span>Agenda y Plazos</span>
          </button>

          <button 
            onClick={() => setSeccionActiva('redactar')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${seccionActiva === 'redactar' ? 'bg-[#0D9488] text-white shadow-md' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <FileText size={18} />
            <span>Redactar Escrito</span>
          </button>

          <button 
            onClick={() => setSeccionActiva('suscripcion')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${seccionActiva === 'suscripcion' ? 'bg-[#0D9488] text-white shadow-md' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <ShieldCheck size={18} />
            <span>Mi Suscripción (QR)</span>
          </button>
        </nav>

        {/* Indicador de Conectividad Offline-First */}
        <div className="p-4 border-t border-slate-800 text-xs flex items-center justify-between text-slate-400">
          <div className="flex items-center space-x-2">
            {conectado ? <Wifi size={14} className="text-emerald-400" /> : <WifiOff size={14} className="text-amber-400" />}
            <span>{conectado ? 'En Línea (Sincronizado)' : 'Sin Conexión (Modo Local)'}</span>
          </div>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-[#0A192F] capitalize">
              {seccionActiva === 'casos' && 'Gestión de Mis Casos Vigentes'}
              {seccionActiva === 'agenda' && 'Calendario y Alertas Procesales'}
              {seccionActiva === 'redactar' && 'Generador Automático de Escritos'}
              {seccionActiva === 'suscripcion' && 'Estado de Cuenta y Pagos QR'}
            </h2>
            <p className="text-xs text-slate-500">Operando de forma fluida en computadora y dispositivos móviles</p>
          </div>

          {seccionActiva === 'casos' && (
            <button 
              onClick={() => setNuevoCasoModal(true)}
              className="bg-[#0D9488] hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 shadow-sm transition-all"
            >
              <Plus size={16} />
              <span>Nuevo Caso</span>
            </button>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          
          {seccionActiva === 'casos' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F4F1EA] text-slate-600 text-xs uppercase tracking-wider">
                    <th className="py-3 px-6">Código NUREJ</th>
                    <th className="py-3 px-6">Cliente</th>
                    <th className="py-3 px-6">Materia</th>
                    <th className="py-3 px-6">Tribunal</th>
                    <th className="py-3 px-6">Próximo Plazo</th>
                    <th className="py-3 px-6">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {casos.map((caso) => (
                    <tr key={caso.id} className="hover:bg-slate-50">
                      <td className="py-4 px-6 font-semibold text-[#0A192F]">{caso.codigo}</td>
                      <td className="py-4 px-6">{caso.cliente}</td>
                      <td className="py-4 px-6"><span className="bg-slate-100 px-2.5 py-1 rounded-md text-xs font-medium text-slate-700">{caso.materia}</span></td>
                      <td className="py-4 px-6 text-slate-600">{caso.juzgado}</td>
                      <td className="py-4 px-6 text-amber-700 font-medium">{caso.vencimiento}</td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                          {caso.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {seccionActiva === 'agenda' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-lg mb-4 text-[#0A192F]">Plazos Procesales Calculados (Excluyendo Fines de Semana y Feriados de Bolivia)</h3>
              <p className="text-sm text-slate-600 mb-6">El sistema calcula automáticamente los días hábiles judiciales para evitar preclusiones.</p>
              <div className="space-y-3">
                <div className="p-4 bg-amber-50 border-l-4 border-amber-600 rounded-r-lg">
                  <p className="font-semibold text-amber-900 text-sm">Vencimiento Fatal - Caso NUREJ-7012</p>
                  <p className="text-xs text-amber-700 mt-1">Plazo de 5 días hábiles vence el Lunes 20 de Marzo de 2026.</p>
                </div>
              </div>
            </div>
          )}

          {seccionActiva === 'redactar' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-2xl">
              <h3 className="font-bold text-lg mb-4 text-[#0A192F]">Generación de Memorial / Escrito</h3>
              <p className="text-sm text-slate-600 mb-4">Seleccione una plantilla y el sistema rellenará automáticamente los datos de su cliente y juzgado.</p>
              <select className="w-full p-3 bg-[#F4F1EA] rounded-lg text-sm border-none mb-4 outline-none">
                <option>Memorial de Demanda Civil</option>
                <option>Memorial de Apelación</option>
                <option>Memorial de Solicitud de Medidas Cautelares</option>
              </select>
              <button className="bg-[#0D9488] text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow-sm">
                Generar Escrito Automático
              </button>
            </div>
          )}

          {seccionActiva === 'suscripcion' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-md">
              <h3 className="font-bold text-lg mb-2 text-[#0A192F]">Plan Starter (50 Expedientes)</h3>
              <p className="text-sm text-slate-600 mb-6">Estado: <span className="text-emerald-600 font-semibold">Activo (Vence en 28 días)</span></p>
              <div className="p-4 bg-[#F4F1EA] rounded-xl text-center">
                <p className="text-xs font-semibold text-slate-700 mb-2">Renovar vía QR Simple (Banca Móvil Bolivia)</p>
                <div className="w-48 h-48 bg-white mx-auto border border-slate-300 rounded-lg flex items-center justify-center text-xs text-slate-400">
                  [ Código QR Interoperable ]
                </div>
                <p className="text-xs text-slate-500 mt-3">Escanee con BISA, BNB o cualquier banca móvil</p>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Modal para Nuevo Caso */}
      {nuevoCasoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="font-bold text-lg text-[#0A192F] mb-4">Registrar Nuevo Caso</h3>
            <form onSubmit={agregarCaso} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Código NUREJ / Expediente</label>
                <input 
                  type="text" 
                  value={codigoNurej} 
                  onChange={(e) => setCodigoNurej(e.target.value)} 
                  placeholder="Ej: 70128492" 
                  className="w-full p-3 bg-[#F4F1EA] rounded-lg text-sm border-none outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre del Cliente</label>
                <input 
                  type="text" 
                  value={nombreCliente} 
                  onChange={(e) => setNombreCliente(e.target.value)} 
                  placeholder="Ej: Juan Pérez" 
                  className="w-full p-3 bg-[#F4F1EA] rounded-lg text-sm border-none outline-none"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setNuevoCasoModal(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#0D9488] text-white rounded-lg text-sm font-medium"
                >
                  Guardar Caso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}