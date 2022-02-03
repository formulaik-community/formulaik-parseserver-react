
export default async ({ search, sort, filter, className, include = [], exclude = [], queryHook, data }) => {
  console.log('fetchItems: ', className)
  if (!className) {
    return []
  }

  if (search && search.length < 2) {
    return []
  }

  const _className = className
  console.log('fetchItems: _className', _className)
  if (!_className) {
    return []
  }
  const query = new Parse.Query(_className)
  switch (sort) {
    case 'desc':
      query.descending('createdAt')
      break
    default:
      query.ascending('createdAt')
      break
  }


  queryHook && queryHook({ query, search, sort, filter })

  if (filter !== 'all') {
    //_query.startsWith('mimeType', filter)
  }
  //_query.fullText('name', controls.search.query ? controls.search.query : '')
  query.include(include)
  query.exclude(exclude)
  return query.find()
}
