#!/usr/bin/env node

import { readFileSync } from 'node:fs'

function loadEnvValue(name) {
  const fromProcess = process.env[name]
  if (fromProcess) return fromProcess

  const envFile = readFileSync('.env', 'utf8')
  const line = envFile
    .split('\n')
    .map(entry => entry.trim())
    .find(entry => entry.startsWith(`${name}=`))

  return line ? line.slice(name.length + 1) : ''
}

const supabaseUrl = loadEnvValue('VITE_SUPABASE_URL')
const supabaseAnonKey = loadEnvValue('VITE_SUPABASE_ANON_KEY')

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env')
}

const endpoint = new URL('/rest/v1/posts', supabaseUrl)
endpoint.searchParams.set('select', 'id,title,slug,excerpt,published_at,post_tags(tags(name,slug))')
endpoint.searchParams.set('status', 'eq.published')
endpoint.searchParams.set('order', 'published_at.desc')

const response = await fetch(endpoint, {
  headers: {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
  },
})

if (!response.ok) {
  throw new Error(`Supabase request failed with ${response.status}`)
}

const posts = await response.json()
console.log(JSON.stringify(posts, null, 2))
