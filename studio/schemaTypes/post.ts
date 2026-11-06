import {defineField, defineType} from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'meta', title: 'Details'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', group: 'content', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      description: 'The URL: /blog/<slug>. Lowercase letters, numbers and dashes only. Click Generate.',
      options: {source: 'title', maxLength: 96},
      validation: (r) =>
        r.required().custom((slug) =>
          !slug?.current || /^[a-z0-9-]{1,96}$/.test(slug.current)
            ? true
            : 'Use only lowercase letters, numbers and dashes — other slugs will 404 on the site.',
        ),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      group: 'content',
      description: 'Posts appear on the site once this time has passed. Set a future time to schedule.',
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'One or two sentences for the blog index, RSS and link previews.',
      validation: (r) => r.max(200),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      group: 'content',
      options: {hotspot: true},
      fields: [{name: 'alt', type: 'string', title: 'Alt text'}],
    }),
    defineField({name: 'body', title: 'Body', type: 'blockContent', group: 'content'}),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      group: 'meta',
      of: [{type: 'reference', to: [{type: 'category'}]}],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'meta',
      description: 'Letters, numbers, spaces and dashes only.',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      group: 'meta',
      description: 'The newest featured post takes the big slot on the home page.',
      initialValue: false,
    }),
    defineField({name: 'author', title: 'Author', type: 'reference', group: 'meta', to: [{type: 'author'}]}),
    defineField({
      name: 'seo',
      title: 'SEO overrides',
      type: 'object',
      group: 'seo',
      options: {collapsible: true, collapsed: true},
      fields: [
        {name: 'title', type: 'string', title: 'SEO title'},
        {name: 'description', type: 'text', rows: 2, title: 'SEO description'},
      ],
    }),
    defineField({
      name: 'legacySlug',
      title: 'Legacy path',
      type: 'string',
      group: 'meta',
      readOnly: true,
      description: 'Set by the legacy importer. Leave alone.',
      hidden: ({value}) => !value,
    }),
  ],
  orderings: [
    {title: 'Published, newest', name: 'publishedDesc', by: [{field: 'publishedAt', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'title', date: 'publishedAt', media: 'mainImage'},
    prepare: ({title, date, media}) => ({
      title,
      subtitle: date ? new Date(date).toLocaleDateString('en-US', {dateStyle: 'medium'}) : 'No date',
      media,
    }),
  },
})
