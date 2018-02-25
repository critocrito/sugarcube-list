import {
  cloneDeep as clone,
  every,
  merge,
  identity,
  has,
  isEqual,
} from "lodash/fp";
import jsc, {property} from "jsverify";
import {listArb, listsArb} from "@sugarcube/test";

import list from "../lib/list-old";

const {
  emptyOne,
  equalsOne,
  identicalOne,
  concatOne,
  empty,
  equals,
  concat,
  fmap,
  uniq,
  hashOne,
  hash,
} = list;

const isTrue = isEqual(true);

describe("list interface", () => {
  property("reflexivity of equality", listArb, h =>
    isTrue(equalsOne(h, clone(h)))
  );

  property("symmetry of equality", listArb, h =>
    isEqual(equalsOne(h, clone(h)), equalsOne(clone(h), h))
  );

  property("transitivity of equality", listArb, h => {
    const j = clone(h);
    const k = clone(h);
    return equalsOne(h, j) && equalsOne(j, k) && equalsOne(h, k);
  });

  property("associativity of a monoid", listArb, listArb, listArb, (h, j, k) =>
    equalsOne(concatOne(concatOne(h, j), k), concatOne(h, concatOne(j, k)))
  );

  property("right identity of a Monoid", listArb, h =>
    identicalOne(concatOne(h, emptyOne()), h)
  );

  property("left identity of a Monoid", listArb, h =>
    equalsOne(concatOne(emptyOne(), h), h)
  );
});

describe("lists interface", () => {
  property("reflexivity of equality", listsArb, xs =>
    isTrue(equals(xs, clone(xs)))
  );

  property("symmetry of equality", listsArb, xs =>
    isEqual(equals(xs, clone(xs)), equals(clone(xs), xs))
  );

  property("transitivity of equality", listsArb, xs => {
    const ys = clone(xs);
    const zs = clone(xs);
    return equals(xs, ys) && equals(ys, zs) && equals(xs, zs);
  });

  property(
    "associativity of a semigroup",
    listsArb,
    listsArb,
    listsArb,
    (xs, ys, zs) =>
      equals(concat(concat(xs, ys), zs), concat(xs, concat(ys, zs)))
  );

  property("right identity of a Monoid", listsArb, xs =>
    equals(concat(xs, empty()), uniq(xs))
  );

  property("left identity of a Monoid", listsArb, xs =>
    equals(concat(empty(), xs), uniq(xs))
  );

  property("identity of a Functor", listsArb, xs =>
    equals(fmap(identity, xs), xs)
  );

  property(
    "composition of a Functor",
    listsArb,
    jsc.dict(jsc.string),
    jsc.dict(jsc.string),
    (xs, a, b) => {
      const f = merge(a);
      const g = merge(b);
      return equals(fmap(z => f(g(z)), xs), fmap(f, fmap(g, xs)));
    }
  );
});

describe("lists hashing", () => {
  property("hashes a single list", listArb, h =>
    has("_sc_id_hash", hashOne(h))
  );

  property("hashes many lists", listsArb, xs =>
    every(has("_sc_id_hash"), hash(xs))
  );
});

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
