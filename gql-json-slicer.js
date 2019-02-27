const gql = require('graphql-tag');

module.exports = function gqlSlice(query, object){
  return objectSlicer(object, gql(query).definitions[0])
}
module.exports._ = (obj) =>{
  return (query) => objectSlicer(obj, gql(query).definitions[0]);
}

function objectSlicer(obj, schema) {
  if (Array.isArray(obj)) {
    let arrayResult = obj.map(el => objectSlicer(el, schema));
    if(schema.arguments) {
      const args = argumentsToObject(schema.arguments);
      if(args.limit) {
        arrayResult = arrayResult.slice(0, args.limit);
      }
      if(args.pick) {
        arrayResult = arrayResult.reduce((r, ar) => ([...r, flattenObject(ar)]), []);
      }
    }
    return arrayResult;
  }
  
  if (schema.selectionSet && schema.selectionSet.selections) {
    let objectResult = schema.selectionSet.selections.reduce((r, s) => {
      if (obj[s.name.value] && typeof obj[s.name.value] === 'object') {
        r[s.name.value] = objectSlicer(obj[s.name.value], s);
      } else {
        if(obj[s.name.value]) r[s.name.value] = obj[s.name.value];
      }
      return r;
    }, {});
    if(schema.arguments) {
      const args = argumentsToObject(schema.arguments);
      if(args.flatten) {
        const keys = Object.keys(objectResult);
        const isArrays =  keys.reduce((r, or) => !r ? r : Array.isArray(objectResult[or]), true);
        
        objectResult = isArrays 
                        ? keys.reduce((r, k) => [].concat(r, objectResult[k]) ,[]) 
                        : keys.reduce((r, k) => Object.assign({}, r, objectResult[k]) ,{});
      }
    }
    return objectResult;
  }
  return obj;
}

function flattenObject(o) {
  const keys = Object.keys(o);
  return keys.length === 1 ? o[keys[0]] : keys.map(k => o[k]);
}

function argumentsToObject(args) {
  return args.reduce((r, a) => ({...r, [a.name.value]: a.value.value}), {})
}