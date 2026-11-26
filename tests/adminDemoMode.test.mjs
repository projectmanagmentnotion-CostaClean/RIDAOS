import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('admin shell labels the legacy operations workspace as simulated demo data', async () => {
  const source = await readFile(new URL('../src/admin/layouts/AdminShell.tsx', import.meta.url), 'utf8')

  assert.match(source, /Modo demo · no operativo/)
  assert.match(source, /Datos simulados · no son pedidos reales/)
  assert.match(source, /No conecta con pedidos DTI ni con Supabase/)
  assert.doesNotMatch(source, /Datos de trabajo activos/)
})
