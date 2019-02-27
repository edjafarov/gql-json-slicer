const gqlSlice = require("./gql-json-slicer");
const { _ } = gqlSlice;

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


describe('gqlSlice pick', () => {
  var data1 = {
    field1: [{
      a:1,
      b:2
    },
    {
      a:3,
      b:4
    },{
      a:5,
      b:6
    }]
  }
  test('should pick the array, to array of arrays', () => {
    expect(gqlSlice(`{
      field1(pick: true) {
        a
        b
      }
    }`, data1)).toMatchSnapshot();
  })
  test('should pick the array to array', () => {
    expect(gqlSlice(`{
      field1(pick: true) {
        a
      }
    }`, data1)).toMatchSnapshot();
  })
})

describe('gqlSlice limit', () => {
  var data1 = {
    field1: [1,2,3,4,5]
  }
  test('should limit the array', () => {
    expect(gqlSlice(`{
      field1(limit: 2)
    }`, data1)).toMatchSnapshot();
  })
})

describe('gqlSlice flatten', () => {
  var data1 = {
    field1: {
      toFlat1: {
        a:1,
        b:2
      },
      toFlat2: {
        c:3
      }
    }
  }
  test('should flatten the object', () => {
    expect(gqlSlice(`{
      field1(flatten: true) {
        toFlat1 {
          a
          b
        }
        toFlat2 {
          c
        }
      }
    }`, data1)).toMatchSnapshot();
  })
  var data2 = {
    field1: {
      toFlat1: [{
        a:1,
        b:2
      },{
        a:3,
        b:4
      }
      ],
      toFlat2: [{
        c:3
      },{
        c:6
      }]
    }
  }  
  test('should flatten the array', () => {
    expect(gqlSlice(`{
      field1(flatten: true) {
        toFlat1 {
          a
          b
        }
        toFlat2 {
          c
        }
      }
    }`, data2)).toMatchSnapshot();
  })
  test('should flatten the array with pick', () => {
    expect(gqlSlice(`{
      field1(flatten: true) {
        toFlat1(pick: true) {
          a
        }
        toFlat2(pick: true) {
          c
        }
      }
    }`, data2)).toMatchSnapshot();
  })
})

describe('gqlSlice native', () => {
  var data1 = {
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
  test('should work same way', () => {
    expect(_(data1)`{
      field2 {
        innerField2
        deeperField {
          deeperInner1
        }
      }
    }`).toMatchSnapshot();
  })
})