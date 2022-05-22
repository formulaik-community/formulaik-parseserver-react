import React from 'react'
import ParseObjectAutoComplete from '../parseObjectAutoComplete'

export default (props) => {
  const className = '_User'
  const params = props.item.params ? props.item.params : {}


  const queryHook = (_props) => {
    const { query, search } = _props
    // if (locale) {
    //     query.equalTo('locale', locale)
    // }

    if (search) {

    }

    params.queryHook && params.queryHook(_props)
  }

  const queryInitiator = (_props) => {
    if (params.query) {
      return params.query(_props)
    }

    const { search, sort, filter, locale } = _props
    var _query
    if (search) {
      const firstNameQuery = new Parse.Query(className)
      firstNameQuery.matches('firstname', search, 'i')

      const lastNameQuery = new Parse.Query(className)
      lastNameQuery.matches('lastname', search, 'i')

      const handleQuery = new Parse.Query(className)
      handleQuery.matches('handle', search, 'i')

      const emailQuery = new Parse.Query(className)
      emailQuery.matches('email', search, 'i')

      //https://stackoverflow.com/questions/18762881/search-for-case-insensitive-data-from-parse-using-javascript
      _query = new Parse.Query.or(firstNameQuery, lastNameQuery, handleQuery, emailQuery)
      //query.fullText('lastname', search)
    }
    if (!_query) {
      _query = new Parse.Query(className)
    }

    return _query
  }

  const optionLabel = option => {
    if (params.optionLabel) {
      return params.optionLabel(option)
    }

    const user = option
    if (!user) {
      return null
    }

    const name = `${user.get('firstname')} ${user.get('lastname')} ${user.get('handle') ? `(${user.get('handle')})` : ''}`
    return name
  }

  const _props = {
    ...props,
    item: {
      ...props.item,
      params: {
        ...props.item.params,
        optionLabel,
        queryInitiator,
        queryHook,
        className
      }
    }
  }

  return <ParseObjectAutoComplete
    {..._props}
  />
}
