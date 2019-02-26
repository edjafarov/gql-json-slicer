const gqlSlice = require("./gql-json-slicer");

describe('gqlSlice', () => {
  var data1 = {
    field1: "field1",
    field2: "field2"
  }
  test('filters out field', () => {
    expect(gqlSlice(`{field1}`, data1)).toMatchSnapshot();
  })

  test('ignore fields not specified', () => {
    expect(gqlSlice(`{
      field1
      field3
    }`, data1)).toMatchSnapshot();
  })
  var data2 = {
    field1: "field1",
    field2: ["field2"]
  }
  test('arrays should be handled properly', () => {
    expect(gqlSlice(`{field2}`, data2)).toMatchSnapshot();
  })
  var data3 = {
    field1: "field1",
    field2: {
      innerField1: "innerField1",
      innerField2: "innerField2",
      deeperField: {
        deeperInner1: "deeperInner1",
        deeperInner2: "deeperInner2"
      }
    }
  }

  test('deep nested fields should be resolved', () => {
    expect(gqlSlice(`{
      field2
    }`, data3)).toMatchSnapshot();
  })

  test('deep nested fields should be deeply resolved', () => {
    expect(gqlSlice(`{
      field2 {
        innerField2
        deeperField {
          deeperInner1
        }
      }
    }`, data3)).toMatchSnapshot();
  })

  var data4 = {
    field1: "field1",
    field2: [{
      innerField1: "innerField11",
      innerField2: "innerField12",
    },{
      innerField1: "innerField21",
      innerField2: "innerField22",
    },{
      innerField1: "innerField31",
      innerField2: "innerField32",
    }]
  }

  test('deep nested fields should be resolved', () => {
    expect(gqlSlice(`{
      field2 {
        innerField2
      }
    }`, data4)).toMatchSnapshot();
  })

})
