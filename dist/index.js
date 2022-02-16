function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var Formulaik = _interopDefault(require('@yelounak/formulaik'));
var FormulaikMui = _interopDefault(require('@yelounak/formulaik-mui'));
var Yup = require('yup');
var Button = _interopDefault(require('@mui/material/Button'));
var CircularProgress = _interopDefault(require('@mui/material/CircularProgress'));
var _ = _interopDefault(require('underscore'));
var shortid = _interopDefault(require('shortid'));
var ReactJson = _interopDefault(require('react-json-view-ssr'));
var Accordion = _interopDefault(require('@mui/material/Accordion'));
var AccordionSummary = _interopDefault(require('@mui/material/AccordionSummary'));
var AccordionDetails = _interopDefault(require('@mui/material/AccordionDetails'));
var ExpandMoreIcon = _interopDefault(require('@mui/icons-material/ExpandMore'));
var InputAdornment = _interopDefault(require('@mui/material/InputAdornment'));
var OutlinedInput = _interopDefault(require('@mui/material/OutlinedInput'));
var CheckIcon = _interopDefault(require('@mui/icons-material/Check'));
var ErrorIcon = _interopDefault(require('@mui/icons-material/Error'));

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var WhereSingle = (function (props) {
  var values = props.values,
      customOnValueChanged = props.customOnValueChanged,
      _props$item = props.item,
      id = _props$item.id,
      itemProps = _props$item.props;

  var _useState = React.useState(null),
      error = _useState[0];

  var item = values[id];
  var fields = itemProps.fields;

  var validationSchema = function validationSchema() {
    return Yup.object().shape({
      fieldName: Yup.string().required("This field can't be blank"),
      constraint: Yup.string().required("This field can't be blank"),
      value: Yup.string().required("This field can't be blank")
    });
  };

  var fieldNameOptions = function fieldNameOptions() {
    var items = [{
      label: '',
      value: null
    }];
    Object.keys(fields).forEach(function (key) {
      if (['ACL'].includes(key)) {
        return;
      }

      var _item = {
        label: key,
        value: key
      };
      items.push(_item);
    });
    return items;
  };

  var inputTypeFromFieldType = function inputTypeFromFieldType(data) {
    if (!data) {
      return {
        type: 'input'
      };
    }

    var type = data.type;

    switch (type) {
      default:
      case 'String':
        return {
          type: 'input'
        };

      case 'Date':
        return {
          type: 'datePicker'
        };
    }
  };

  var inputs = [{
    isMulti: true,
    className: 'flex',
    items: [{
      type: 'select',
      schema: 'fieldName',
      id: 'fieldName',
      label: 'Field name',
      className: 'w-1/3 ml-2 mr-2',
      props: {
        options: fieldNameOptions()
      }
    }, {
      type: 'select',
      schema: 'constraint',
      id: 'constraint',
      label: 'Constraint',
      className: 'w-1/3 ml-2 mr-2',
      props: {
        options: [{
          label: "equalTo",
          value: 'equalTo'
        }, {
          label: "greaterThan",
          value: 'greaterThan'
        }, {
          label: "exists",
          value: 'exists'
        }, {
          label: "doesNotExist",
          value: 'doesNotExist'
        }]
      }
    }, _extends({}, inputTypeFromFieldType(item), {
      schema: 'value',
      id: 'value',
      label: 'Value',
      className: 'w-1/3 ml-2'
    })]
  }];
  var initialValues = item ? item : {};

  var onValuesChanged = function onValuesChanged(__values) {
    var result = _extends({}, item, __values);

    if (__values.fieldName) {
      var struct = fields[__values.fieldName];

      if (struct) {
        result.type = struct.type;
      }
    }

    customOnValueChanged && customOnValueChanged(result);
  };

  return /*#__PURE__*/React__default.createElement(Formulaik, {
    componentsLibraries: [FormulaikMui],
    initialValues: initialValues,
    validationSchema: validationSchema,
    inputs: inputs,
    onValuesChanged: onValuesChanged,
    error: error
  });
});

var Wheres = (function (props) {
  var values = props.values,
      customOnValueChanged = props.customOnValueChanged,
      _props$item = props.item,
      id = _props$item.id,
      itemProps = _props$item.props;
  var _value = values[id];

  if (!_value || _.isEmpty(_value)) {
    var _placeHolder = {
      id: shortid.generate()
    };
    var val = {};
    val[_placeHolder.id] = _placeHolder;
    customOnValueChanged && customOnValueChanged(val);
    return /*#__PURE__*/React__default.createElement("div", {
      className: "w-full border-warmGray-400 border-2 px-5 py-6 rounded-xl"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "w-full justify-center flex"
    }, /*#__PURE__*/React__default.createElement(CircularProgress, null)));
  }

  React.useEffect(function () {
    updateValues({
      values: values[id],
      force: false
    });
  }, []);

  var _useState = React.useState(null),
      error = _useState[0];

  var schema = itemProps.schema;

  var validationSchema = function validationSchema() {
    return Yup.object().shape();
  };

  var handleRemove = function handleRemove(_ref) {
    var _id = _ref.id;

    if (!_id || !values || !values[id]) {
      return;
    }

    var _value = values[id];

    if (!_value || !_value[_id]) {
      return;
    }

    var __value = _extends({}, _value);

    delete __value[_id];
    updateValues({
      values: __value
    });
  };

  var inputs = function inputs() {
    var fields = schema.fields;
    var items = wheresToArray();
    return items.map(function (item, i) {
      return {
        type: 'where',
        id: item.id,
        props: {
          fields: fields,
          handleRemove: handleRemove
        }
      };
    });
  };

  var initialValues = function initialValues() {
    var items = wheresToArray();
    var _items = {};
    var _value = values[id];
    var ids = items.map(function (item) {
      return item.id;
    });

    for (var i = 0; i < ids.length; i++) {
      var _id = ids[i];
      var _val = _value[_id];
      _items[_id] = _extends({
        id: _id
      }, _val ? _val : {});
    }

    return _items;
  };

  var wheresToArray = function wheresToArray() {
    var _value = values[id];
    return _.map(_value, function (value, key) {
      var _v = _extends({}, value);

      if (!_v.id) {
        _v.id = key;
      }

      return _v;
    });
  };

  var onValuesChanged = function onValuesChanged(_values) {
    updateValues({
      values: _values
    });
  };

  var updateValues = function updateValues(_ref2) {
    var _values = _ref2.values,
        _ref2$force = _ref2.force,
        force = _ref2$force === void 0 ? true : _ref2$force;
    var _placeHolder = {
      id: shortid.generate()
    };

    var placeholderExists = _.findWhere(_.values(_values), {
      fieldName: undefined
    });

    if (!placeholderExists) {
      placeholderExists = _.findWhere(_.values(_values), {
        fieldName: null
      });
    }

    if (!placeholderExists) {
      _values[_placeHolder.id] = _placeHolder;
    }

    if (placeholderExists && !force) {
      return;
    }

    customOnValueChanged && customOnValueChanged(_values);
  };

  var componentsLibrary = function componentsLibrary(_ref3) {
    var type = _ref3.type;

    switch (type) {
      case 'where':
        return WhereSingle;

      default:
        return null;
    }
  };

  return /*#__PURE__*/React__default.createElement("div", {
    className: "w-full"
  }, /*#__PURE__*/React__default.createElement(Formulaik, {
    componentsLibraries: [componentsLibrary, FormulaikMui],
    initialValues: initialValues,
    validationSchema: validationSchema,
    inputs: inputs,
    onValuesChanged: onValuesChanged,
    error: error
  }));
});

var componentsLibrary = function componentsLibrary(_ref) {
  var type = _ref.type;

  switch (type) {
    case 'wheres':
      return Wheres;

    default:
      return null;
  }
};

var fetchSchemas = function fetchSchemas() {
  try {
    return Promise.resolve(Parse.Cloud.run('schema')).then(function (result) {
      console.log('schema: ', result);
      return result;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

var ParseQuery = (function (props) {
  var values = props.values,
      customOnValueChanged = props.customOnValueChanged,
      _props$item = props.item,
      id = _props$item.id,
      label = _props$item.label,
      itemProps = _props$item.props;
  var schemas = React.useRef();

  var _useState = React.useState(null),
      error = _useState[0];

  var _useState2 = React.useState(null),
      queryResult = _useState2[0],
      setQueryResult = _useState2[1];

  var buildSchemas = function buildSchemas() {
    try {
      if (schemas.current) {
        return Promise.resolve();
      }

      return Promise.resolve(fetchSchemas()).then(function (items) {
        var _itemProps$classNameI = itemProps.classNameInclude,
            classNameInclude = _itemProps$classNameI === void 0 ? null : _itemProps$classNameI,
            _itemProps$classNameE = itemProps.classNameExclude,
            classNameExclude = _itemProps$classNameE === void 0 ? ['_Installation', '_Session'] : _itemProps$classNameE;

        if (classNameInclude) {
          schemas.current = _.filter(items, function (item) {
            return classNameInclude.includes(item.className);
          });
        } else {
          schemas.current = _.filter(items, function (item) {
            return !classNameExclude.includes(item.className);
          });
        }
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  React.useEffect(function () {
    buildSchemas();
  }, []);
  React.useEffect(function () {
    updateQueryResult();
  }, [values]);

  var _ref2 = values && values[id] ? values[id] : {},
      query = _ref2.query,
      className = _ref2.className,
      accessor = _ref2.accessor,
      key = _ref2.key,
      dependsOnUser = _ref2.dependsOnUser,
      userAccessor = _ref2.userAccessor;

  var validationSchema = function validationSchema() {
    if (!query) {
      return Yup.object().shape({
        className: Yup.string().nullable()
      });
    }

    return Yup.object().shape({
      className: Yup.string().nullable()
    });
  };

  var fieldNameOptions = function fieldNameOptions() {
    if (!query || !schemas.current) {
      return [];
    }

    var _schema = _.findWhere(schemas.current, {
      className: className
    });

    if (!_schema) {
      return [];
    }

    var fields = _schema.fields;
    var items = [{
      label: '',
      value: null
    }];
    Object.keys(fields).forEach(function (key) {
      if (['ACL'].includes(key)) {
        return;
      }

      var _item = {
        label: key,
        value: key
      };
      items.push(_item);
    });
    return items;
  };

  var inputs = function inputs() {
    var classNameItem = {
      type: 'autocomplete',
      schema: 'className',
      id: 'className',
      label: 'Classname',
      className: 'w-1/3',
      props: {
        fetcher: function (_ref3) {

          try {
            var items = schemas.current;

            var _i = items.map(function (i) {
              return i.className;
            });

            return Promise.resolve(_i);
          } catch (e) {
            return Promise.reject(e);
          }
        },
        isOptionEqualToValue: function isOptionEqualToValue(option, value) {
          return option === value;
        },
        getOptionLabel: function getOptionLabel(option) {
          var name = option;
          return "" + name;
        },
        disabled: itemProps.blockClassName
      }
    };

    if (!query) {
      return [classNameItem];
    }

    return [classNameItem].concat(itemProps.showCustomKey ? [{
      type: 'input',
      schema: 'key',
      id: 'key',
      label: 'Custom Key',
      className: 'w-1/3',
      props: {
        helperText: 'The prefix to this data query. Defaults to classname'
      }
    }] : [], itemProps.showDependsOnUser ? [{
      isMulti: true,
      className: 'flex',
      items: [{
        type: 'checkbox',
        schema: 'dependsOnUser',
        id: 'dependsOnUser',
        label: 'Depends on user',
        className: 'w-2/3 mr-2',
        props: {
          subLabel: "Whether the query depends on the user queried from the target audience"
        }
      }].concat( [{
        type: 'input',
        schema: 'userAccessor',
        id: 'userAccessor',
        label: 'User Accessor',
        className: 'w-1/3 ml-2',
        props: {
          helperText: 'The path to matching the user in this data query'
        }
      }] )
    }] : [], [{
      type: 'input',
      schema: 'accessor',
      id: 'accessor',
      label: 'Data accessor ',
      className: 'w-1/3',
      props: {
        helperText: '(advanced)'
      }
    }, {
      type: 'divider',
      id: 'divider',
      props: {
        content: /*#__PURE__*/React__default.createElement("b", null, /*#__PURE__*/React__default.createElement("i", null, 'Wheres'))
      }
    }, {
      type: 'wheres',
      id: 'wheres',
      props: {
        schema: query && schemas.current ? _.findWhere(schemas.current, {
          className: className
        }) : null
      }
    }, {
      type: 'divider',
      id: 'divider',
      props: {
        content: /*#__PURE__*/React__default.createElement("b", null, /*#__PURE__*/React__default.createElement("i", null, 'Generic constraints'))
      }
    }], itemProps.showLimit ? [{
      isMulti: true,
      className: 'flex',
      items: [{
        type: 'input',
        schema: 'limit',
        id: 'limit',
        label: 'Limit',
        className: 'w-1/3',
        props: {
          helperText: 'This limit will be applied to the job. If unlimited, leave blank.'
        }
      }]
    }] : [], [{
      isMulti: true,
      className: 'flex',
      items: [{
        type: 'select',
        schema: 'sortDirection',
        id: 'sortDirection',
        label: 'Sort direction',
        className: 'w-1/3 ',
        props: {
          options: [{
            label: null,
            value: null
          }, {
            label: "desc",
            value: 'desc'
          }, {
            label: "asc",
            value: 'asc'
          }]
        }
      }, {
        type: 'divider',
        id: 'divider',
        props: {
          vertical: true,
          content: /*#__PURE__*/React__default.createElement("b", null, 'For')
        }
      }, {
        type: 'select',
        schema: 'sortField',
        id: 'sortField',
        label: 'sortField',
        className: 'w-2/3',
        props: {
          options: fieldNameOptions()
        }
      }]
    }, {
      type: 'input',
      schema: 'include',
      id: 'include',
      label: 'Inclusions',
      props: {
        helperText: ' (in the form of ["fieldA", "fieldB.fieldC"])'
      }
    }, {
      type: 'input',
      schema: 'exclude',
      id: 'exclude',
      label: 'Exclusions (in the form of ["classNameA", "classNameB.classNameC"])',
      props: {
        helperText: ' (in the form of ["fieldA", "fieldB.fieldC"])'
      }
    }]);
  };

  var adaptInitialWheres = function adaptInitialWheres() {
    if (!query) {
      return {};
    }

    var where = query.toJSON().where;
    var result = {};
    Object.keys(where).forEach(function (key) {
      var id = shortid.generate();
      result[id] = {
        id: id,
        fieldName: key,
        value: where[key],
        constraint: 'equalTo'
      };
    });
    return result;
  };

  var sortDirection = function sortDirection() {
    var def = null;

    if (!query) {
      return def;
    }

    var order = query._order;

    if (!order || order.length === 0) {
      return def;
    }

    var first = order[0];

    if (!first || first.trim().length === 0) {
      return def;
    }

    first = first.trim();
    var value = "asc";

    if (first.charAt(0) === '-') {
      value = "desc";
    }

    return value;
  };

  var sortField = function sortField() {
    var def = null;

    if (!query) {
      return def;
    }

    var order = query._order;

    if (!order || order.length === 0) {
      return def;
    }

    var first = order[0];

    if (!first || first.trim().length === 0) {
      return def;
    }

    first = first.trim();

    if (first.charAt(0) === '-') {
      first = first.substring(1, first.length);
    }

    return first;
  };

  var initialValues = {
    className: className,
    key: key,
    dependsOnUser: dependsOnUser,
    userAccessor: userAccessor,
    accessor: accessor,
    wheres: adaptInitialWheres(),
    limit: query ? query._limit : 10,
    include: query ? JSON.stringify(query._include) : '[]',
    exclude: query ? JSON.stringify(query._exclude) : '[]',
    sortDirection: sortDirection(),
    sortField: sortField()
  };

  var updateQueryResult = function updateQueryResult() {
    try {
      if (itemProps.hideQueryResult) {
        return Promise.resolve();
      }

      if (!query) {
        return Promise.resolve();
      }

      var _query = query;

      _query.withCount();

      return Promise.resolve(_query.find()).then(function (item) {
        setQueryResult(item);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var onValuesChanged = function onValuesChanged(__values) {
    var className = __values.className;

    if (!className) {
      customOnValueChanged && customOnValueChanged({
        query: null,
        className: null,
        accessor: null
      });
      return;
    }

    var _item = query;

    if (!_item || _item.className !== className) {
      _item = new Parse.Query(className);
    }

    applyQueryConstraints({
      query: _item,
      values: __values
    });
    updateQueryResult();

    customOnValueChanged && customOnValueChanged(_extends({
      query: _item
    }, __values));
  };

  var onRemove = function onRemove() {
    try {
      if (itemProps.onRemove) {
        itemProps.onRemove();
      }

      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var onClear = function onClear() {
    try {
      onValuesChanged({});
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var handleQueryValueWithType = function handleQueryValueWithType(value, type) {

    return value;
  };

  var applyQueryConstraints = function applyQueryConstraints(_temp) {
    var _ref4 = _temp === void 0 ? {} : _temp,
        query = _ref4.query,
        values = _ref4.values;

    if (!query) {
      return;
    }

    query._where = {};
    query.order = [];
    var wheres = values.wheres,
        limit = values.limit,
        include = values.include,
        exclude = values.exclude,
        sortDirection = values.sortDirection,
        sortField = values.sortField;

    if (sortField && sortDirection) {
      switch (sortDirection) {
        case "asc":
          {
            query.ascending(sortField);
          }
          break;

        case "desc":
          {
            query.descending(sortField);
          }
          break;
      }
    }

    Object.keys(wheres).forEach(function (key) {
      var _val = wheres[key];

      if (!_val || !_val.fieldName || !_val.value) {
        return;
      }

      var fieldName = _val.fieldName,
          constraint = _val.constraint,
          value = _val.value;

      var _value = handleQueryValueWithType(value);

      switch (constraint) {
        case 'equalTo':
          query.equalTo(fieldName, _value);
          break;

        case 'notEqualTo':
          query.notEqualTo(fieldName, _value);
          break;
      }
    });

    if (itemProps.showLimit && limit) {
      query.limit(parseInt(limit));
    }

    query._include = [];
    query._exclude = [];

    if (include) {
      try {
        var _include = JSON.parse(include);

        if (_include && Array.isArray(_include)) {
          query.include(_include);
        }
      } catch (e) {
        console.error('parseQuery > applyQueryConstraints > include ', e);
      }
    }

    if (exclude) {
      try {
        var _exclude = JSON.parse(exclude);

        if (_exclude && Array.isArray(_exclude)) {
          query.exclude(_exclude);
        }
      } catch (e) {
        console.error('parseQuery > applyQueryConstraints > exclude ', e);
      }
    }
  };

  return /*#__PURE__*/React__default.createElement(Accordion, {
    className: "w-full border-warmGray-400  border-2 px-4 py-4 rounded-xl"
  }, /*#__PURE__*/React__default.createElement(AccordionSummary, {
    expandIcon: /*#__PURE__*/React__default.createElement(ExpandMoreIcon, null),
    "aria-controls": "panel1a-content",
    id: "panel1a-header"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "grid grid-cols-2 justify-between w-full"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: ""
  }, /*#__PURE__*/React__default.createElement("h4", null, label + " \u27BB " + (key ? "" + key : "" + (className ? className : '')))), /*#__PURE__*/React__default.createElement("div", {
    className: "flex justify-end mr-4"
  }, query ? /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(Button, {
    onClick: onClear
  }, "Clear")) : null, itemProps.onRemove ? /*#__PURE__*/React__default.createElement(Button, {
    onClick: onRemove
  }, "Remove data query") : null))), /*#__PURE__*/React__default.createElement(AccordionDetails, null, !schemas.current ? /*#__PURE__*/React__default.createElement("div", {
    className: "w-full justify-center flex"
  }, /*#__PURE__*/React__default.createElement(CircularProgress, null)) : /*#__PURE__*/React__default.createElement("div", {
    className: "w-full"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "mt-6 w-full"
  }, /*#__PURE__*/React__default.createElement(Formulaik, {
    componentsLibraries: [componentsLibrary, FormulaikMui],
    initialValues: initialValues,
    validationSchema: validationSchema,
    inputs: inputs,
    onValuesChanged: onValuesChanged,
    error: error
  })), query ? /*#__PURE__*/React__default.createElement("div", {
    className: "mt-2 text-xs text-warmGray-600 italic w-full"
  }, /*#__PURE__*/React__default.createElement("b", null, "Query"), /*#__PURE__*/React__default.createElement(ReactJson, {
    src: query.toJSON(),
    collapsed: true,
    enableClipboard: false
  })) : null, query && queryResult ? /*#__PURE__*/React__default.createElement("div", {
    className: "mt-2 text-xs text-warmGray-600 italic w-full"
  }, /*#__PURE__*/React__default.createElement("b", null, "Results (count: " + queryResult.count + ")"), /*#__PURE__*/React__default.createElement(ReactJson, {
    src: queryResult.results.map(function (i) {
      return i.toJSON();
    }),
    collapsed: true,
    enableClipboard: false
  })) : null)));
});

var fetchItems = function fetchItems(_ref) {
  var search = _ref.search,
      sort = _ref.sort,
      filter = _ref.filter,
      className = _ref.className,
      _ref$include = _ref.include,
      include = _ref$include === void 0 ? [] : _ref$include,
      _ref$exclude = _ref.exclude,
      exclude = _ref$exclude === void 0 ? [] : _ref$exclude,
      queryHook = _ref.queryHook,
      data = _ref.data,
      cache = _ref.cache;

  try {
    var cachedItems = cache && cache.get({
      search: search,
      key: className
    });

    if (cachedItems) {
      return Promise.resolve(cachedItems);
    }

    console.log('fetchItems: ', className);

    if (!className) {
      return Promise.resolve([]);
    }

    if (search && search.length < 2) {
      return Promise.resolve([]);
    }

    var _className = typeof className === 'function' ? className({
      data: data
    }) : className;

    console.log('fetchItems: _className', _className);

    if (!_className) {
      return Promise.resolve([]);
    }

    var query = new Parse.Query(_className);

    switch (sort) {
      case 'desc':
        query.descending('createdAt');
        break;

      default:
        query.ascending('createdAt');
        break;
    }

    queryHook && queryHook({
      query: query,
      search: search,
      sort: sort,
      filter: filter
    });

    if (filter !== 'all') {}

    query.include(include);
    query.exclude(exclude);
    return Promise.resolve(query.find()).then(function (results) {
      results = results ? results : [];
      cache && cache.add({
        search: search,
        key: className,
        results: results
      });
      return results;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

var ParseObjectAutoComplete = (function (props) {
  var value = props.value,
      customOnValueChanged = props.customOnValueChanged,
      error = props.error,
      _props$item = props.item,
      label = _props$item.label,
      itemProps = _props$item.props;
  var className = itemProps.className,
      _itemProps$include = itemProps.include,
      include = _itemProps$include === void 0 ? [] : _itemProps$include,
      _itemProps$exclude = itemProps.exclude,
      exclude = _itemProps$exclude === void 0 ? [] : _itemProps$exclude,
      queryHook = itemProps.queryHook,
      getOptionLabel = itemProps.getOptionLabel,
      _itemProps$multiple = itemProps.multiple,
      multiple = _itemProps$multiple === void 0 ? true : _itemProps$multiple;
  var data = value;

  if (!data) {
    data = multiple ? [] : null;
  }

  if (Array.isArray(data)) {
    data = data.filter(function (a) {
      return a;
    });
  }

  var validationSchema = function validationSchema() {
    return Yup.object().shape({
      items: multiple ? Yup.array() : Yup.object()
    });
  };

  var inputs = [{
    type: 'autocomplete',
    schema: 'items',
    id: 'items',
    label: label,
    props: {
      multiple: multiple,
      filterSelectedOptions: true,
      fetcher: function (_ref2) {
        var value = _ref2.value;

        try {
          return fetchItems({
            search: value,
            className: className,
            include: include,
            exclude: exclude,
            queryHook: queryHook,
            data: data,
            cache: props.cache
          });
        } catch (e) {
          return Promise.reject(e);
        }
      },
      isOptionEqualToValue: function isOptionEqualToValue(option, value) {
        return option.id === value.id;
      },
      getOptionLabel: getOptionLabel
    }
  }];
  var initialValues = {
    items: data
  };

  var onValuesChanged = function onValuesChanged(__values) {
    customOnValueChanged && customOnValueChanged(__values.items);
  };

  return /*#__PURE__*/React__default.createElement("div", {
    className: "w-full " + (error ? 'bg-red-100 ' : '')
  }, /*#__PURE__*/React__default.createElement(Formulaik, {
    componentsLibraries: [FormulaikMui],
    initialValues: initialValues,
    validationSchema: validationSchema,
    inputs: inputs,
    onValuesChanged: onValuesChanged,
    hideErrors: true,
    disabled: props.disabled,
    readOnly: props.readOnly
  }));
});

// A type of promise-like that resolves synchronously and supports only one observer

const _iteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))) : "@@iterator";

const _asyncIteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))) : "@@asyncIterator";

// Asynchronously call a function and send errors to recovery continuation
function _catch(body, recover) {
	try {
		var result = body();
	} catch(e) {
		return recover(e);
	}
	if (result && result.then) {
		return result.then(void 0, recover);
	}
	return result;
}

var fetchRefs = (function (_ref) {
  var search = _ref.search,
      sort = _ref.sort,
      filter = _ref.filter,
      className = _ref.className,
      _ref$include = _ref.include,
      include = _ref$include === void 0 ? [] : _ref$include,
      _ref$exclude = _ref.exclude,
      exclude = _ref$exclude === void 0 ? [] : _ref$exclude,
      queryHook = _ref.queryHook;

  try {
    console.log('fetchItems: ', className);

    if (!className) {
      return Promise.resolve([]);
    }

    if (search && search.length < 2) {
      return Promise.resolve([]);
    }

    var _className = className;
    console.log('fetchItems: _className', _className);

    if (!_className) {
      return Promise.resolve([]);
    }

    var query = new Parse.Query(_className);

    switch (sort) {
      case 'desc':
        query.descending('createdAt');
        break;

      default:
        query.ascending('createdAt');
        break;
    }

    queryHook && queryHook({
      query: query,
      search: search,
      sort: sort,
      filter: filter
    });

    if (filter !== 'all') {}

    query.include(include);
    query.exclude(exclude);
    return Promise.resolve(query.find());
  } catch (e) {
    return Promise.reject(e);
  }
});

var VisualSelectForParseRef = (function (props) {
  var value = props.value,
      customOnValueChanged = props.customOnValueChanged,
      _props$item = props.item,
      label = _props$item.label,
      itemProps = _props$item.props;

  var _useState = React.useState(null),
      refs = _useState[0],
      setRefs = _useState[1];

  var items = value ? value : [];
  React.useEffect(function () {
    fetch();
  }, []);

  var fetch = function fetch() {
    try {
      var _temp2 = _catch(function () {
        var _itemProps$fetchParam = itemProps.fetchParameters,
            include = _itemProps$fetchParam.include,
            exclude = _itemProps$fetchParam.exclude,
            queryHook = _itemProps$fetchParam.queryHook,
            className = _itemProps$fetchParam.className,
            search = _itemProps$fetchParam.search;
        return Promise.resolve(fetchRefs({
          search: search,
          className: className,
          include: include,
          exclude: exclude,
          queryHook: queryHook
        })).then(function (_refs) {
          setRefs(_refs);
        });
      }, function () {});

      return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  if (!refs) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: " align-middle text-center py-4"
    }, /*#__PURE__*/React__default.createElement("h4", null, "Loading"));
  }

  if (Array.isArray(items)) {
    items = items.filter(function (a) {
      return a;
    });
  }

  var validationSchema = function validationSchema() {
    return Yup.object().shape({
      items: Yup.array().min(itemProps.visualSelectProps.minSelectionAllowed, itemProps.visualSelectProps.minSelectionAllowedMessage).max(itemProps.visualSelectProps.maxSelectionAllowed, itemProps.visualSelectProps.maxSelectionAllowedMessage)
    });
  };

  var visualSelectItems = function visualSelectItems() {
    return refs.map(function (ref) {
      return {
        id: ref.id,
        props: itemProps.mapRefProps(ref)
      };
    });
  };

  var inputs = [{
    type: 'visualSelect',
    schema: 'items',
    label: label,
    id: 'items',
    props: _extends({
      items: visualSelectItems()
    }, itemProps.visualSelectProps)
  }];
  var initialValues = {
    items: items.map(function (i) {
      return i.id;
    })
  };

  var onValuesChanged = function onValuesChanged(__values) {
    var values = refs.filter(function (a) {
      return __values.items.includes(a.id);
    });
    console.log('values', values);
    customOnValueChanged && customOnValueChanged(values);
  };

  return /*#__PURE__*/React__default.createElement(Formulaik, {
    componentsLibraries: [FormulaikMui],
    initialValues: initialValues,
    validationSchema: validationSchema,
    inputs: inputs,
    onValuesChanged: onValuesChanged,
    disabled: props.disabled,
    readOnly: props.readOnly
  });
});

var capitalize = function capitalize(s) {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

var queryHook = function queryHook(_ref) {
  var query = _ref.query,
      search = _ref.search;

  if (search) {
    query.contains('name', search);
  }
};

var fetchItems$1 = function fetchItems(_ref2) {
  var search = _ref2.search,
      sort = _ref2.sort,
      filter = _ref2.filter,
      className = _ref2.className,
      _ref2$include = _ref2.include,
      include = _ref2$include === void 0 ? [] : _ref2$include,
      _ref2$exclude = _ref2.exclude,
      exclude = _ref2$exclude === void 0 ? [] : _ref2$exclude,
      data = _ref2.data,
      locale = _ref2.locale,
      cache = _ref2.cache;

  try {
    var cachedItems = cache && cache.get({
      search: search,
      key: className
    });

    if (cachedItems && cachedItems.length) {
      return Promise.resolve(cachedItems);
    }

    console.log('fetchItems: ', className);

    if (!className) {
      return Promise.resolve([]);
    }

    if (search && search.length < 2) {
      return Promise.resolve([]);
    }

    var _className = typeof className === 'function' ? className({
      data: data
    }) : className;

    console.log('fetchItems: _className', _className);

    if (!_className) {
      return Promise.resolve([]);
    }

    var query = new Parse.Query(_className);

    switch (sort) {
      case 'desc':
        query.descending('createdAt');
        break;

      default:
        query.ascending('createdAt');
        break;
    }

    queryHook && queryHook({
      query: query,
      search: search,
      sort: sort,
      filter: filter,
      locale: locale
    });

    if (filter !== 'all') {}

    query.include(include);
    query.exclude(exclude);
    return Promise.resolve(query.find()).then(function (results) {
      results = results ? results : [];
      cache && cache.add({
        search: search,
        key: className,
        results: results
      });
      return results;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

var ParseObjectAutoCompleteRef = (function (props) {
  var value = props.value,
      customOnValueChanged = props.customOnValueChanged,
      error = props.error,
      _props$item = props.item,
      label = _props$item.label,
      itemProps = _props$item.props;
  var className = itemProps.className,
      _itemProps$include = itemProps.include,
      include = _itemProps$include === void 0 ? [] : _itemProps$include,
      _itemProps$exclude = itemProps.exclude,
      exclude = _itemProps$exclude === void 0 ? [] : _itemProps$exclude,
      _itemProps$multiple = itemProps.multiple,
      multiple = _itemProps$multiple === void 0 ? true : _itemProps$multiple,
      locale = itemProps.locale;
  var data = value;

  if (!data) {
    data = multiple ? [] : null;
  }

  if (Array.isArray(data)) {
    data = data.filter(function (a) {
      return a;
    });
  }

  var validationSchema = function validationSchema() {
    return Yup.object().shape({
      items: multiple ? Yup.array() : Yup.object()
    });
  };

  var getOptionLabel = function getOptionLabel(option) {
    if (!option) {
      return null;
    }

    var nameLoc = option.get('nameLoc');
    var name = option.get('name') ? capitalize(option.get('name')) : option.get('name');

    if (!nameLoc || !nameLoc[locale]) {
      return name;
    }

    return capitalize(nameLoc[locale]);
  };

  var inputs = [{
    type: 'autocomplete',
    schema: 'items',
    id: 'items',
    label: label,
    props: {
      multiple: multiple,
      filterSelectedOptions: true,
      fetcher: function (_ref3) {
        var value = _ref3.value;

        try {
          return fetchItems$1({
            search: value,
            className: className,
            include: include,
            exclude: exclude,
            queryHook: queryHook,
            data: data,
            locale: locale,
            cache: props.cache
          });
        } catch (e) {
          return Promise.reject(e);
        }
      },
      isOptionEqualToValue: function isOptionEqualToValue(option, value) {
        return option.id === value.id;
      },
      getOptionLabel: getOptionLabel
    }
  }];
  var initialValues = {
    items: data
  };

  var onValuesChanged = function onValuesChanged(__values) {
    customOnValueChanged && customOnValueChanged(__values.items);
  };

  return /*#__PURE__*/React__default.createElement("div", {
    className: "w-full " + (error ? 'bg-red-100 ' : '')
  }, /*#__PURE__*/React__default.createElement(Formulaik, {
    componentsLibraries: [FormulaikMui],
    initialValues: initialValues,
    validationSchema: validationSchema,
    inputs: inputs,
    onValuesChanged: onValuesChanged,
    hideErrors: true,
    disabled: props.disabled,
    readOnly: props.readOnly
  }));
});

var fetchItems$2 = function fetchItems(_ref) {
  var search = _ref.search,
      filter = _ref.filter,
      className = _ref.className,
      data = _ref.data,
      queryHook = _ref.queryHook;

  try {
    console.log('fetchItems: ', className);

    if (!className) {
      return Promise.resolve(0);
    }

    if (search && search.length < 2) {
      return Promise.resolve(0);
    }

    var _className = typeof className === 'function' ? className({
      data: data
    }) : className;

    console.log('fetchItems: _className', _className);

    if (!_className) {
      return Promise.resolve(0);
    }

    var query = new Parse.Query(_className);
    queryHook && queryHook({
      query: query,
      search: search,
      filter: filter
    });

    if (filter !== 'all') {}

    return Promise.resolve(query.count());
  } catch (e) {
    return Promise.reject(e);
  }
};

var ParseObjectUniqueValue = (function (props) {
  var customOnValueChanged = props.customOnValueChanged,
      propsValue = props.value,
      errors = props.errors,
      _props$item = props.item,
      id = _props$item.id,
      label = _props$item.label,
      itemProps = _props$item.props;
  var className = itemProps.className,
      queryHook = itemProps.queryHook,
      _itemProps$minLength = itemProps.minLength,
      minLength = _itemProps$minLength === void 0 ? 3 : _itemProps$minLength,
      _itemProps$maxLength = itemProps.maxLength,
      maxLength = _itemProps$maxLength === void 0 ? 20 : _itemProps$maxLength;

  var _useState = React.useState(propsValue ? propsValue : {
    value: null,
    isValid: false,
    initialValue: ''
  }),
      data = _useState[0],
      setData = _useState[1];

  var initialValue = React.useRef(data.value);

  var _useState2 = React.useState(false),
      isLoading = _useState2[0],
      setIsLoading = _useState2[1];

  var onChange = function onChange(_ref2) {
    var value = _ref2.target.value;

    try {
      var _value = value.trim().toLowerCase();

      if (initialValue.current && _value === initialValue.current) {
        setIsLoading(false);

        var _data = _extends({}, data, {
          value: _value,
          isValid: true
        });

        setData(_data);
        customOnValueChanged && customOnValueChanged(_data);
        return Promise.resolve();
      }

      if (_value.length <= minLength || _value.length > maxLength) {
        setIsLoading(false);

        var _data2 = _extends({}, data, {
          value: _value,
          isValid: false
        });

        setData(_data2);
        customOnValueChanged && customOnValueChanged(_data2);
        return Promise.resolve();
      }

      setIsLoading(true);
      return Promise.resolve(fetchItems$2({
        search: _value,
        queryHook: queryHook,
        className: className
      })).then(function (count) {
        setIsLoading(false);

        var _data = _extends({}, data, {
          value: _value,
          isValid: count === 0
        });

        setData(_data);
        customOnValueChanged && customOnValueChanged(_data);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var adornment = function adornment() {
    if (isLoading) {
      return /*#__PURE__*/React__default.createElement(CircularProgress, null);
    }

    if (data.isValid) {
      return /*#__PURE__*/React__default.createElement(CheckIcon, {
        color: "green"
      });
    }

    return /*#__PURE__*/React__default.createElement(ErrorIcon, {
      color: "red"
    });
  };

  return /*#__PURE__*/React__default.createElement(OutlinedInput, {
    label: label,
    variant: "outlined",
    disabled: props.disabled,
    readOnly: props.readOnly,
    value: data.value,
    className: "" + (!data.isValid || errors[id] ? 'bg-red-100' : 'bg-green-100'),
    onChange: onChange,
    placeholder: label,
    endAdornment: /*#__PURE__*/React__default.createElement(InputAdornment, {
      position: "end"
    }, adornment())
  });
});

var index = (function (props) {
  var type = props.type;

  switch (type) {
    case 'parseQuery':
      return ParseQuery;

    case 'parseObjectAutoComplete':
      return ParseObjectAutoComplete;

    case 'where':
      return WhereSingle;

    case 'wheres':
      return Wheres;

    case 'visualSelectForParseRef':
      return VisualSelectForParseRef;

    case 'parseObjectAutoCompleteRef':
      return ParseObjectAutoCompleteRef;

    case 'parseObjectUniqueValue':
      return ParseObjectUniqueValue;

    default:
      return null;
  }
});

module.exports = index;
//# sourceMappingURL=index.js.map
