import ParseQuery from './parseQuery'
import ParseObjectAutoComplete from './parseObjectAutoComplete'
import Wheres from './wheres'
import WhereSingle from './whereSingle'
import VisualSelectForParseRef from './visualSelectForParseRef'

export default (props) => {
  const { type } = props
  switch (type) {
    case 'parseQuery':
      return ParseQuery
    case 'parseObjectAutoComplete':
      return ParseObjectAutoComplete
    case 'where':
      return WhereSingle
    case 'wheres':
      return Wheres
    case 'visualSelectForParseRef':
      return VisualSelectForParseRef
    default:
      return null
  }
}
