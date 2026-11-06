import {defineField, defineType} from 'sanity'

/** Optional. Posts without an author show "Steven Legg" on the site. */
export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'image', title: 'Photo', type: 'image', options: {hotspot: true}}),
  ],
})
