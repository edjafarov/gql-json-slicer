const gql = require('graphql-tag');

module.exports = function gqlSlice(query, object){
  return objectSlicer(object, gql(query).definitions[0])
}

function objectSlicer(obj, schema) {
  if (Array.isArray(obj)) return obj.map(el => objectSlicer(el, schema));
  
  if (schema.selectionSet && schema.selectionSet.selections) {
    return schema.selectionSet.selections.reduce((r, s) => {
      if (obj[s.name.value] && typeof obj[s.name.value] === 'object') {
        r[s.name.value] = objectSlicer(obj[s.name.value], s);
      } else {
        if(obj[s.name.value]) r[s.name.value] = obj[s.name.value];
      }
      return r;
    }, {});
  }
  return obj;
}
