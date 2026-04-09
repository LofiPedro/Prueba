export default function SepaIphPrototype() {
  const sections = [
    {
      title: '1. Inicio de evento',
      subtitle: 'Alta rápida de intervención',
      fields: ['Tipo de evento (CNIE)', 'Fecha y hora automática (editable)', 'Ubicación GPS automática (editable)', 'Latitud y longitud', 'Mapa para ajustar punto exacto', 'Corporación / agrupamiento', 'Número de unidad'],
      note: 'Meta UX: iniciar un evento en menos de 20 segundos. El sistema pregunta si la geolocalización corresponde al momento actual o posterior a los hechos.'
    },
    {
      title: '2. Datos del primer respondiente',
      subtitle: 'Identificación institucional',
      fields: ['Nombre y clave', 'Cargo', 'Sector', 'Compañeros intervinientes', 'Supervisor inmediato'],
      note: 'Autollenado desde credencial institucional con campos editables para corregir o actualizar datos.'
    },
    {
      title: '3. Persona detenida',
      subtitle: 'Datos básicos y condición física',
      fields: ['Nombre / alias', 'Sexo', 'Edad aproximada', 'Vestimenta', 'Señas particulares', 'Lesiones visibles', 'Estado de conciencia'],
      note: 'Campos condicionales para reducir ruido cuando no hay dato confirmado.'
    },
    {
      title: '4. Circunstancias de la detención',
      subtitle: 'Modo, tiempo y lugar',
      fields: ['Cómo se detectó el hecho', 'Conducta observada', 'Fundamento de intervención', 'Uso de la fuerza', 'Objetos asegurados'],
      note: 'El sistema ordena la narrativa en secuencia cronológica.'
    },
    {
      title: '5. Derechos y traslado',
      subtitle: 'Puesta a disposición',
      fields: ['Lectura de derechos', 'Hora de aseguramiento', 'Hora de traslado', 'Autoridad receptora', 'Destino / MP'],
      note: 'Validaciones bloqueantes cuando falta fundamento o autoridad receptora.'
    },
    {
      title: '6. Revisión jurídica',
      subtitle: 'Semáforo de consistencia',
      fields: ['Alertas rojas', 'Campos faltantes', 'Narrativa sugerida', 'Versión PDF previa', 'Envío a mesa C5'],
      note: 'Pantalla pensada para supervisor, jurídico y capturista.'
    }
  ];

  const alerts = [
    'Hora de detención posterior a la puesta a disposición',
    'No se registró lectura de derechos',
    'Hay indicios sin relación narrativa',
    'Falta autoridad receptora',
    'La geolocalización no fue confirmada'
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Prototipo funcional</p>
              <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">SEPA-IPH</h1>
              <p className="text-base md:text-lg text-slate-600 mt-3 max-w-3xl">
                Sistema Estatal de Precaptura y Asistencia para IPH. Propuesta de experiencia móvil para policía de campo,
                supervisor y mesa de validación C5.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 min-w-[150px]">
                <div className="text-sm text-slate-500">Tiempo objetivo</div>
                <div className="text-2xl font-semibold">&lt; 4 min</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 min-w-[150px]">
                <div className="text-sm text-slate-500">Modo de uso</div>
                <div className="text-2xl font-semibold">Offline</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
          <div className="space-y-6">
            {sections.map((section, idx) => (
              <div key={section.title} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm text-slate-500">Pantalla {idx + 1}</div>
                    <h2 className="text-2xl font-semibold mt-1">{section.title}</h2>
                    <p className="text-slate-600 mt-1">{section.subtitle}</p>
                  </div>
                  <div className="rounded-full bg-slate-900 text-white text-sm px-3 py-1">Mobile</div>
                </div>
                <div className="mt-5 grid sm:grid-cols-2 gap-3">
                  {section.fields.map((field) => (
                    <div key={field} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
                      {field}
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-900">
                  {section.note}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-semibold">Vista móvil sugerida</h2>
              <p className="text-slate-600 mt-2">Interfaz tipo asistente paso a paso, con botones grandes, pocos campos visibles y avance guiado.</p>

              <div className="mt-6 mx-auto w-[300px] rounded-[2.5rem] border-[10px] border-slate-900 bg-slate-900 shadow-xl overflow-hidden">
                <div className="bg-white min-h-[580px]">
                  <div className="bg-slate-900 text-white px-5 pt-4 pb-5">
                    <div className="flex items-center justify-between text-xs opacity-80">
                      <span>SEPA-IPH</span>
                      <span>2/6</span>
                    </div>
                    <h3 className="text-xl font-semibold mt-3">Primer respondiente</h3>
                    <p className="text-sm text-slate-300 mt-1">Datos institucionales precargados y editables</p>
                  </div>

                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-2">Nombre y clave</label>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm">Of. Laura Méndez · MXP-2147</div>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-2">Cargo y sector</label>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm">Policía Primero · Sector Centro</div>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-2">¿Geolocalización del momento actual?</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-2xl border border-slate-900 bg-slate-900 text-white p-3 text-center text-sm">Sí</div>
                        <div className="rounded-2xl border border-slate-200 p-3 text-center text-sm">Posterior a hechos</div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-2">Latitud / Longitud (manual si es posterior)</label>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm">
                        19.4326, -99.1332
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm min-h-[90px]">
                      [Mapa interactivo para fijar ubicación exacta]
                    </div>
                    <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900">
                      Si la geolocalización es posterior, captura manual obligatoria y nota justificativa.
                    </div>
                  </div>

                  <div className="px-4 pb-5 pt-1 flex gap-3">
                    <button className="flex-1 rounded-2xl border border-slate-300 py-3 text-sm font-medium">Guardar</button>
                    <button className="flex-1 rounded-2xl bg-slate-900 text-white py-3 text-sm font-medium">Continuar</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-semibold">Alertas automáticas</h2>
              <div className="mt-4 space-y-3">
                {alerts.map((alert) => (
                  <div key={alert} className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
                    {alert}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-semibold">Control de tiempo y geolocalización</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                  Hora y ubicación se detectan automáticamente desde el dispositivo al iniciar el evento.
                </div>
                <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                  El policía puede editar ambos datos y seleccionar el punto exacto en mapa para guardar latitud y longitud.
                </div>
                <div className="rounded-2xl border border-amber-200 p-4 bg-amber-50 text-amber-900">
                  La app pregunta si la geolocalización corresponde al momento actual o si es posterior a los hechos; en este último caso exige captura manual.
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-semibold">Roles dentro del sistema</h2>
              <div className="mt-4 grid gap-3">
                {[
                  ['Policía', 'Inicia evento, captura hechos, revisa narrativa y envía precaptura.'],
                  ['Supervisor', 'Valida consistencia operativa y autoriza envío.'],
                  ['Jurídico', 'Revisa redacción, riesgo jurídico y observaciones del MP.'],
                  ['Operador C5', 'Recibe la ficha, captura en plataforma oficial y retorna folio.']
                ].map(([role, desc]) => (
                  <div key={role} className="rounded-2xl border border-slate-200 p-4">
                    <div className="font-semibold">{role}</div>
                    <div className="text-sm text-slate-600 mt-1">{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
