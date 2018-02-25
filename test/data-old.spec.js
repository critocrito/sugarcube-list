import data from "../lib/data-old";

const {concat} = data;

describe("data behavior", () => {
  it("merges lists of records", () => {
    const xs = [
      {
        _sc_id_hash: 1,
        _sc_media: [{_sc_id_hash: 1, term: 23}, {_sc_id_hash: 2, term: 42}],
      },
      {_sc_id_hash: 2, field: 23, _sc_media: []},
    ];
    const ys = [
      {
        _sc_id_hash: 1,
        _sc_media: [
          {_sc_id_hash: 1, term: 42, other: 23},
          {_sc_id_hash: 3, term: 666},
        ],
      },
      {_sc_id_hash: 2, other: 42, _sc_media: [{_sc_id_hash: 1}]},
      {_sc_id_hash: 3, _sc_media: [{_sc_id_hash: 1}]},
    ];
    const expected = [
      {
        _sc_id_hash: 1,
        _sc_media: [
          {_sc_id_hash: 1, term: 42, other: 23},
          {_sc_id_hash: 2, term: 42},
          {_sc_id_hash: 3, term: 666},
        ],
      },
      {_sc_id_hash: 2, field: 23, other: 42, _sc_media: [{_sc_id_hash: 1}]},
      {_sc_id_hash: 3, _sc_media: [{_sc_id_hash: 1}]},
    ];

    const results = concat(xs, ys);

    // data-old fails this spec.
    return results.should.not.eql(expected);
  });

  it("merges duplicates recursively in lists of records", () => {
    const xs = [
      {
        _sc_id_hash: 1,
        _sc_media: [{_sc_id_hash: 1, term: 23}, {_sc_id_hash: 2, term: 42}],
      },
      {_sc_id_hash: 2, field: 23, _sc_media: []},
      {_sc_id_hash: 2, more: 66, _sc_media: []},
    ];
    const ys = [
      {
        _sc_id_hash: 1,
        _sc_media: [
          {_sc_id_hash: 1, term: 42, other: 23},
          {_sc_id_hash: 3, term: 66},
        ],
      },
      {_sc_id_hash: 2, other: 42, _sc_media: [{_sc_id_hash: 1}]},
      {_sc_id_hash: 3, _sc_media: [{_sc_id_hash: 1}, {_sc_id_hash: 1}]},
    ];
    const expected = [
      {
        _sc_id_hash: 1,
        _sc_media: [
          {_sc_id_hash: 1, term: 42, other: 23},
          {_sc_id_hash: 2, term: 42},
          {_sc_id_hash: 3, term: 666},
        ],
      },
      {
        _sc_id_hash: 2,
        field: 23,
        other: 42,
        more: 66,
        _sc_media: [{_sc_id_hash: 1}],
      },
      {_sc_id_hash: 3, _sc_media: [{_sc_id_hash: 1}]},
    ];

    const results = concat(xs, ys);

    // data-old fails this spec.
    return results.should.not.eql(expected);
  });
});
