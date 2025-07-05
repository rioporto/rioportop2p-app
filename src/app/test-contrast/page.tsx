'use client'

import { useState, useEffect } from 'react'
import { checkContrast, colorCombinations, getAccessibleAlternatives, generateContrastReport } from '@/lib/accessibility/contrast-checker'

export default function TestContrastPage() {
  const [customFg, setCustomFg] = useState('#00ADEF')
  const [customBg, setCustomBg] = useState('#ffffff')
  const [customResult, setCustomResult] = useState<any>(null)
  const [report, setReport] = useState('')

  useEffect(() => {
    setReport(generateContrastReport())
  }, [])

  const handleCustomCheck = () => {
    try {
      const result = checkContrast(customFg, customBg)
      const alternatives = getAccessibleAlternatives(customFg, customBg)
      setCustomResult({ ...result, alternatives })
    } catch (error) {
      alert('Cores inválidas. Use formato hex (#RRGGBB)')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Teste de Contraste de Cores
        </h1>

        {/* Custom Contrast Checker */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Verificador Personalizado</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Cor do Texto</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={customFg}
                  onChange={(e) => setCustomFg(e.target.value)}
                  className="h-10 w-20"
                />
                <input
                  type="text"
                  value={customFg}
                  onChange={(e) => setCustomFg(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-700"
                  placeholder="#00ADEF"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Cor de Fundo</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={customBg}
                  onChange={(e) => setCustomBg(e.target.value)}
                  className="h-10 w-20"
                />
                <input
                  type="text"
                  value={customBg}
                  onChange={(e) => setCustomBg(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-700"
                  placeholder="#ffffff"
                />
              </div>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={handleCustomCheck}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Verificar Contraste
              </button>
            </div>
          </div>

          {customResult && (
            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-32 h-32 rounded-lg flex items-center justify-center text-2xl font-bold"
                  style={{ backgroundColor: customBg, color: customFg }}
                >
                  Amostra
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold">{customResult.ratio}:1</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Proporção de Contraste</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={customResult.passes.normal ? 'text-green-600' : 'text-red-600'}>
                    {customResult.passes.normal ? '✅' : '❌'}
                  </span>
                  <span>Texto Normal (4.5:1)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={customResult.passes.large ? 'text-green-600' : 'text-red-600'}>
                    {customResult.passes.large ? '✅' : '❌'}
                  </span>
                  <span>Texto Grande (3:1)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={customResult.passes.ui ? 'text-green-600' : 'text-red-600'}>
                    {customResult.passes.ui ? '✅' : '❌'}
                  </span>
                  <span>Componentes UI (3:1)</span>
                </div>
              </div>

              {customResult.recommendation && (
                <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900 rounded-md">
                  <p className="text-sm">{customResult.recommendation}</p>
                </div>
              )}

              {customResult.alternatives && customResult.alternatives.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Alternativas Acessíveis:</h4>
                  <div className="flex gap-2">
                    {customResult.alternatives.map((color: string) => (
                      <div key={color} className="text-center">
                        <div
                          className="w-16 h-16 rounded-lg border-2 border-gray-300"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-xs">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Predefined Color Combinations */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Combinações de Cores do Sistema</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {colorCombinations.map((combo) => {
              const result = checkContrast(combo.fg, combo.bg)
              return (
                <div key={combo.name} className="border rounded-lg p-4 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{combo.name}</h3>
                    <span className={`text-2xl ${result.passes.normal ? 'text-green-600' : result.passes.large ? 'text-yellow-600' : 'text-red-600'}`}>
                      {result.passes.normal ? '✅' : result.passes.large ? '⚠️' : '❌'}
                    </span>
                  </div>
                  
                  <div 
                    className="h-20 rounded-md flex items-center justify-center mb-2 font-medium"
                    style={{ backgroundColor: combo.bg, color: combo.fg }}
                  >
                    Texto de Exemplo
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Contraste:</span>
                      <span className="font-medium">{result.ratio}:1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Texto:</span>
                      <span className="font-mono text-xs">{combo.fg}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Fundo:</span>
                      <span className="font-mono text-xs">{combo.bg}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Full Report */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Relatório Completo</h2>
          <pre className="whitespace-pre-wrap text-sm bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
            {report}
          </pre>
        </div>
      </div>
    </div>
  )
}