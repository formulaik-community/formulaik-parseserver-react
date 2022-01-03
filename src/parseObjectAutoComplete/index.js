import React, { useState, useRef, useEffect } from 'react'
import Formulaik from 'formulaik'
import FormulaikMui from 'formulaik-mui'
import * as Yup from 'yup'

const fetchItems = async ({ search, sort, filter, className, include = [], exclude = [], queryHook, data }) => {
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

export default (props) => {
    const {
        values,
        customOnValueChanged,
        errors,
        item: { label, id, props: itemProps }
    } = props

    const [error, setError] = useState(null)
    const { className, include = [], exclude = [], queryHook, getOptionLabel, multiple = true } = itemProps
    var data = values[id]
    if (!data) {
        data = multiple ? [] : null
    }
    if (Array.isArray(data)) {
        data = data.filter(a => a)
    }

    const validationSchema = () => {
        return Yup.object().shape({
            items: multiple ? Yup.array() : Yup.object()
        })
    }

    const formItemsProvider = [
        {
            type: 'autocomplete',
            schema: 'items',
            id: 'items',
            label: label,
            props: {
                multiple,
                filterSelectedOptions: true,
                fetcher: async ({ value }) => {
                    return fetchItems({ search: value, className, include, exclude, queryHook, data })
                },
                isOptionEqualToValue: (option, value) => { return (option.id === value.id) },
                getOptionLabel,
            }
        },
    ]

    const initialValues = {
        items: data
    }

    const onValuesChanged = (__values) => {
        customOnValueChanged && customOnValueChanged(__values.items)
    }

    return <Formulaik
        componentsLibraries={[FormulaikMui]}
        initialValues={initialValues}
        validationSchema={validationSchema}
        formItemsProvider={formItemsProvider}
        onValuesChanged={onValuesChanged}
        error={error} />
}
