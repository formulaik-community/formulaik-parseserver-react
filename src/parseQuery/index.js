import React, { useState, useRef, useEffect } from 'react'
import Formulaik from 'formulaik'
import FormulaikMui from 'formulaik-mui'
import * as Yup from 'yup'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

import _ from 'underscore'
import shortid from 'shortid'
import ReactJson from 'react-json-view-ssr'

import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'



import WheresComponent from '../wheres'
const componentsLibrary = ({ type }) => {
    switch (type) {
        case 'wheres':
            return WheresComponent
        default:
            return null
    }
}


const fetchSchemas = async () => {
    //return Parse.Schema.all()
    const result = await Parse.Cloud.run('schema')
    console.log('schema: ', result)
    return result
}

export default (props) => {
    const {
        values,
        customOnValueChanged,
        errors,

        item: { id, label, props: itemProps }
    } = props

    const schemas = useRef()
    const [error, setError] = useState(null)


    const [queryResult, setQueryResult] = useState(null)

    const buildSchemas = async () => {
        if (schemas.current) {
            return
        }

        const items = await fetchSchemas()
        const { classNameInclude = null, classNameExclude = ['_Installation', '_Session'] } = itemProps
        if (classNameInclude) {
            schemas.current = _.filter(items, item => classNameInclude.includes(item.className))
        } else {
            schemas.current = _.filter(items, item => !classNameExclude.includes(item.className))
        }

    }

    useEffect(() => {
        buildSchemas()
    }, [])

    useEffect(() => {
        updateQueryResult()
    }, [values])


    const { query, className, accessor, key, dependsOnUser, userAccessor, } = (values && values[id]) ? values[id] : {}

    const validationSchema = () => {
        if (!query) {
            return Yup.object().shape({
                className: Yup.string().nullable(),
            })
        }

        return Yup.object().shape({
            // limit: Yup.number()
            //     .required("This field can't be blank"),
            // skip: Yup.number()
            //     .required("This field can't be blank"),
            className: Yup.string().nullable(),
        })
    }

    const fieldNameOptions = () => {
        if (!query || !schemas.current) {
            return []
        } const _schema = _.findWhere(schemas.current, { className })
        if (!_schema) {
            return []
        }
        const { fields } = _schema
        const items = [{ label: '', value: null }]
        Object.keys(fields).forEach(key => {
            if (['ACL'].includes(key)) {
                return
            }
            const _item = { label: key, value: key }
            items.push(_item)
        })
        return items
    }

    const formItemsProvider = () => {
        const classNameItem = {
            type: 'autocomplete',
            schema: 'className',
            id: 'className',
            label: 'Classname',
            className: 'w-1/3',
            props: {
                fetcher: async ({ value }) => {
                    const items = schemas.current
                    const _i = items.map(i => i.className)
                    return _i
                },
                isOptionEqualToValue: (option, value) => {
                    return (option === value)
                },
                getOptionLabel: (option) => {
                    const name = option
                    return `${name}`
                },
                disabled: itemProps.blockClassName
            }
        }

        if (!query) {
            return [classNameItem]
        }

        return [
            classNameItem,
            // {
            //     type: 'html',
            //     id: 'html',
            //     props: {
            //         content: <b><i>{'Please be aware these queries will run everytime you fetch a campaing.'}</i></b>
            //     }
            // },
            ...(itemProps.showCustomKey ? [
                {
                    type: 'input',
                    schema: 'key',
                    id: 'key',
                    label: 'Custom Key',
                    className: 'w-1/3',
                    props: { helperText: 'The prefix to this data query. Defaults to classname' }
                },
            ] : []),
            ...(itemProps.showDependsOnUser ? [{
                isMulti: true,
                className: 'flex',
                items: [
                    {
                        type: 'checkbox',
                        schema: 'dependsOnUser',
                        id: 'dependsOnUser',
                        label: 'Depends on user',
                        className: 'w-2/3 mr-2',
                        props: {
                            subLabel: "Whether the query depends on the user queried from the target audience"
                        }
                    },
                    // ...((values[id] && values[id]['dependsOnUser']) ? [
                    ...(true ? [
                        {
                            type: 'input',
                            schema: 'userAccessor',
                            id: 'userAccessor',
                            label: 'User Accessor',
                            className: 'w-1/3 ml-2',
                            props: { helperText: 'The path to matching the user in this data query' }
                        },
                    ] : []),
                ]
            }] : []),
            {
                type: 'input',
                schema: 'accessor',
                id: 'accessor',
                label: 'Data accessor ',
                className: 'w-1/3',
                props: { helperText: '(advanced)' }
            },
            {
                type: 'divider',
                id: 'divider',
                props: {
                    content: <b><i>{'Wheres'}</i></b>
                }
            },
            {
                type: 'wheres',
                id: 'wheres',
                props: {
                    schema: (query && schemas.current) ? _.findWhere(schemas.current, { className }) : null
                }
            },
            {
                type: 'divider',
                id: 'divider',
                props: {
                    content: <b><i>{'Generic constraints'}</i></b>
                }
            },
            ...(itemProps.showLimit ? [{
                isMulti: true,
                className: 'flex',
                items: [
                    {
                        type: 'input',
                        schema: 'limit',
                        id: 'limit',
                        label: 'Limit',
                        className: 'w-1/3',
                        props: { helperText: 'This limit will be applied to the job. If unlimited, leave blank.' }
                    },
                    // {
                    //     type: 'input',
                    //     schema: 'skip',
                    //     id: 'skip',
                    //     label: 'Skip',
                    //     className: 'w-1/2 ml-2',
                    // }
                ]
            }] : []),
            {
                isMulti: true,
                className: 'flex',
                items: [
                    {
                        type: 'select',
                        schema: 'sortDirection',
                        id: 'sortDirection',
                        label: 'Sort direction',
                        className: 'w-1/3 ',
                        props: {
                            options: [
                                { label: null, value: null },
                                { label: "desc", value: 'desc' },
                                { label: "asc", value: 'asc' },
                            ]
                        }
                    },

                    {
                        type: 'divider',
                        id: 'divider',
                        props: {
                            vertical: true,
                            content: <b>{'For'}</b>
                        }
                    },
                    {
                        type: 'select',
                        schema: 'sortField',
                        id: 'sortField',
                        label: 'sortField',
                        className: 'w-2/3',
                        props: {
                            options: fieldNameOptions()
                        }
                    },
                ]
            },

            {
                type: 'input',
                schema: 'include',
                id: 'include',
                label: 'Inclusions',
                props: { helperText: ' (in the form of ["fieldA", "fieldB.fieldC"])' }
            },
            {
                type: 'input',
                schema: 'exclude',
                id: 'exclude',
                label: 'Exclusions (in the form of ["classNameA", "classNameB.classNameC"])',
                props: { helperText: ' (in the form of ["fieldA", "fieldB.fieldC"])' }
            },
            // {
            //     type: 'JSONEditor',
            //     schema: 'mock_',
            //     label: 'mock_',
            //     id: 'mock_',
            //     forceLabel: true,
            //     props: {
            //         options: {},
            //         mode: 'json',
            //         height: '40px',
            //     }
            // },
        ]
    }

    const adaptInitialWheres = () => {
        if (!query) {
            return {}
        }

        const where = query.toJSON().where
        const result = {}
        Object.keys(where).forEach(key => {
            const id = shortid.generate()
            result[id] = {
                id,
                fieldName: key,
                value: where[key],
                constraint: 'equalTo',
            }
        })
        return result
    }

    const sortDirection = () => {
        const def = null
        if (!query) {
            return def
        }
        const order = query._order
        if (!order || order.length === 0) {
            return def
        }
        var first = order[0]
        if (!first || first.trim().length === 0) {
            return def
        }

        first = first.trim()
        var value = "asc"
        var label = "asc"
        if (first.charAt(0) === '-') {
            value = "desc"
            label = "desc"
        }
        return value
    }

    const sortField = () => {
        const def = null
        if (!query) {
            return def
        }
        const order = query._order
        if (!order || order.length === 0) {
            return def
        }
        var first = order[0]
        if (!first || first.trim().length === 0) {
            return def
        }

        first = first.trim()

        if (first.charAt(0) === '-') {
            first = first.substring(1, first.length)
        }

        return first
    }


    const initialValues = {
        className,
        key,
        dependsOnUser,
        userAccessor,
        accessor,
        wheres: adaptInitialWheres(),
        limit: query ? query._limit : 10,
        //skip: query ? query._skip : 0,
        include: query ? JSON.stringify(query._include) : '[]',
        exclude: query ? JSON.stringify(query._exclude) : '[]',

        sortDirection: sortDirection(),
        sortField: sortField()
    }

    const updateQueryResult = async () => {
        if (itemProps.hideQueryResult) {
            return
        }

        if (!query) {
            return
        }

        const _query = query
        _query.withCount()
        const item = await _query.find()
        setQueryResult(item)
    }

    const onValuesChanged = (__values) => {
        const { className } = __values
        //console.log('__values: ', __values)

        if (!className) {
            customOnValueChanged && customOnValueChanged({ query: null, className: null, accessor: null })
            return
        }

        var _item = query
        if (!_item || _item.className !== className) {
            _item = new Parse.Query(className)
        }
        applyQueryConstraints({ query: _item, values: __values })
        updateQueryResult()
        if (itemProps.showDependsOnUser) {
            const _dependsOnUser = values[id] ? values[id]['dependsOnUser'] : null

        }

        customOnValueChanged && customOnValueChanged({ query: _item, ...__values })
    }

    const onRemove = async () => {
        if (itemProps.onRemove) { itemProps.onRemove() }
    }

    const onClear = async () => {
        onValuesChanged({})
    }

    const handleQueryValueWithType = (value, type) => {
        switch (type) {
            case 'Date': {

            }
            default: break
        }
        return value
    }

    const applyQueryConstraints = ({ query, values } = {}) => {
        if (!query) {
            return
        }
        query._where = {}
        query.order = []

        const { wheres, limit, skip, include, exclude, sortDirection, sortField } = values

        if (sortField && sortDirection) {
            switch (sortDirection) {
                case "asc": {
                    query.ascending(sortField)
                } break
                case "desc": {
                    query.descending(sortField)
                } break
                default: break
            }
        }

        //console.log('wheres: ', wheres)
        Object.keys(wheres).forEach((key) => {
            const _val = wheres[key]
            if (!_val || !_val.fieldName || !_val.value) {
                return
            }
            const { fieldName, constraint, value, type } = _val
            const _value = handleQueryValueWithType(value, type)

            switch (constraint) {
                case 'equalTo':
                    query.equalTo(fieldName, _value)
                    break
                case 'notEqualTo':
                    query.notEqualTo(fieldName, _value)
                    break
                default:
                    break
            }
        })
        if (itemProps.showLimit && limit) {
            query.limit(parseInt(limit))
        }
        // if (skip) {
        //     query.skip(parseInt(skip))
        // }
        query._include = []
        query._exclude = []
        if (include) {
            try {
                const _include = JSON.parse(include)
                if (_include && Array.isArray(_include)) {

                    query.include(_include)
                }
            } catch (e) {
                console.error('parseQuery > applyQueryConstraints > include ', e)
            }
        }
        if (exclude) {
            try {
                const _exclude = JSON.parse(exclude)
                if (_exclude && Array.isArray(_exclude)) {
                    query.exclude(_exclude)
                }
            } catch (e) {
                console.error('parseQuery > applyQueryConstraints > exclude ', e)
            }
        }
        //console.log('applyQueryConstraints > query: ', query.toJSON(), 'wheres', wheres)
    }

    return (

        <Accordion className="w-full border-warmGray-400  border-2 px-4 py-4 rounded-xl">
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header">
                <div className="grid grid-cols-2 justify-between w-full">
                    <div className="">
                        <h4>{`${label} ➻ ${key ? `${key}` : `${className ? className : ''}`}`}</h4>
                    </div>
                    <div className="flex justify-end mr-4">
                        {query ?
                            <>
                                {/* <Button className={'mr-4'}>Preview</Button> */}
                                <Button onClick={onClear}>Clear</Button>

                            </>
                            : null}
                        {itemProps.onRemove ?
                            <Button onClick={onRemove}>Remove data query</Button> : null}

                    </div>
                </div>
            </AccordionSummary>
            <AccordionDetails>
                {(!schemas.current) ?
                    <div className="w-full justify-center flex">
                        <CircularProgress />
                    </div>
                    :
                    <div className="w-full">
                        <div className="mt-6 w-full">
                            <Formulaik
                                componentsLibraries={[componentsLibrary, FormulaikMui]}
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                formItemsProvider={formItemsProvider}
                                onValuesChanged={onValuesChanged}
                                error={error} />
                        </div>
                        {query ?
                            <div className="mt-2 text-xs text-warmGray-600 italic w-full">
                                <b>{"Query"}</b>
                                <ReactJson src={query.toJSON()} collapsed enableClipboard={false} />
                            </div>
                            : null}
                        {(query && queryResult) ?
                            <div className="mt-2 text-xs text-warmGray-600 italic w-full">
                                <b>{`Results (count: ${queryResult.count})`}</b>
                                <ReactJson src={queryResult.results.map(i => i.toJSON())} collapsed enableClipboard={false} />
                            </div>
                            : null}
                    </div>
                }
            </AccordionDetails>
        </Accordion>
    )
}


