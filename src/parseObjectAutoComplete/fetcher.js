export default async ({ queryInitiator, search, sort, filter, className, include = [], exclude = [], data, locale, cache, queryHook }) => {
  const cachedItems = cache && cache.get({ search, key: className })
  if (cachedItems && cachedItems.length) {
    return cachedItems
  }

  console.log('fetchItems: ', className)
  if (!className) {
    return []
  }

  if (search && search.length < 2) {
    return []
  }

  const _className = (typeof className === 'function') ? className({ data }) : className
  console.log('fetchItems: _className', _className)
  if (!_className) {
    return []
  }
  const query = queryInitiator ? queryInitiator({ search, sort, filter, locale }) : new Parse.Query(_className)
  switch (sort) {
    case 'desc':
      query.descending('createdAt')
      break
    default:
      query.ascending('createdAt')
      break
  }

  queryHook && queryHook({ query, search, sort, filter, locale })

  if (filter !== 'all') {
    //_query.startsWith('mimeType', filter)
  }
  //_query.fullText('name', controls.search.query ? controls.search.query : '')
  query.include(include)
  query.exclude(exclude)
  var results = await query.find()
  results = results ? results : []
  cache && cache.add({ search, key: className, results })
  return results
}
