import list from "../lib/list-old";

const {concatOne, concat} = list;

describe("list behavior", () => {
  it("merges single records", () => {
    const a = {id: 1, field: 23};
    const b = {id: 1, field2: 42};
    const expected = {id: 1, field: 23, field2: 42};

    const result = concatOne(a, b);

    return result.should.eql(expected);
  });

  it("merges nested lists inside records", () => {
    const a = {id: 1, xs: [{id: 1, a: 23}, {id: 2}]};
    const b = {id: 1, xs: [{id: 1, b: 42}, {id: 3}]};
    const expected = {id: 1, xs: [{id: 1, a: 23, b: 42}, {id: 2}, {id: 3}]};

    const result = concatOne(a, b);

    // list-old fails this spec.
    return result.should.not.eql(expected);
  });

  it("merges lists of records", () => {
    const xs = [
      {id: 1, media: [{id: 1, term: 23}, {id: 2, term: 42}]},
      {id: 2, field: 23, media: []},
    ];
    const ys = [
      {id: 1, media: [{id: 1, term: 42, other: 23}, {id: 3, term: 666}]},
      {id: 2, other: 42, media: [{id: 1}]},
      {id: 3, media: [{id: 1}]},
    ];
    const expected = [
      {
        id: 1,
        media: [
          {id: 1, term: 42, other: 23},
          {id: 2, term: 42},
          {id: 3, term: 666},
        ],
      },
      {id: 2, field: 23, other: 42, media: [{id: 1}]},
      {id: 3, media: [{id: 1}]},
    ];

    const results = concat(xs, ys);

    // list-old fails this spec.
    return results.should.not.eql(expected);
  });

  it("merges duplicates recursively in lists of records", () => {
    const xs = [
      {id: 1, media: [{id: 1, term: 23}, {id: 2, term: 42}]},
      {id: 2, field: 23, media: []},
      {id: 2, more: 66, media: []},
    ];
    const ys = [
      {id: 1, media: [{id: 1, term: 42, other: 23}, {id: 3, term: 66}]},
      {id: 2, other: 42, media: [{id: 1}]},
      {id: 3, media: [{id: 1}, {id: 1}]},
    ];
    const expected = [
      {
        id: 1,
        media: [
          {id: 1, term: 42, other: 23},
          {id: 2, term: 42},
          {id: 3, term: 666},
        ],
      },
      {id: 2, field: 23, other: 42, more: 66, media: [{id: 1}]},
      {id: 3, media: [{id: 1}]},
    ];

    const results = concat(xs, ys);

    // list-old fails this spec.
    return results.should.not.eql(expected);
  });
});
