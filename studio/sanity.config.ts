/**
 * Sanity Studio for steven-legg.com.
 *
 * The schemas mirror the documents already in the `production` dataset and the
 * fields the site reads in ../sanity/queries.ts. Change a field name here only
 * together with the matching query, or published posts will stop rendering.
 */
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Steven Legg — Blog',
  projectId: 'mo87nuz0',
  dataset: 'production',
  plugins: [structureTool()],
  schema: {types: schemaTypes},
})
