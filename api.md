# Design

I deal with list of units. Each unit is a record.

## Expectations

### Merge same record

```
const a = {id: 1, field: 23};
const b = {id: 1, field2: 42};
const expected = {id: 1, field: 23, field2: 42};

const result = concat(a, b);

return isEqual(result, expected);
```

### Merge nested lists in records

```
const a = {id: 1, xs: [{id: 1, a: 23}, {id: 2}]};
const b = {id: 1, xs: [{id: 1, b: 42}, {id: 3}]};
const expected = {id: 1, xs: [{id: 1, a: 23, b: 42}, {id: 2}, {id: 3}]};

const result = concat(a, b);

return isEqual(result, expected);
```

### Merge lists of records

```
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
  {id: 1, media: [
    {id: 1, term: 42, other: 23},
    {id: 2, term: 42},
    {id: 3, term: 666}
  ]},
  {id: 2, field: 23, other: 42, media: [{id: 1}]},
  {id: 3, media: [{id: 1}]},
];

const results = concat (xs, ys);

return isEqual(results, expected);
```

### Merge duplicates recursively in list of records

```
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
  {id: 1, media: [
    {id: 1, term: 42, other: 23},
    {id: 2, term: 42},
    {id: 3, term: 666}
  ]},
  {id: 2, field: 23, other: 42, more: 66, media: [{id: 1}]},
  {id: 3, media: [{id: 1}]},
];

const results = concat (xs, ys);

return isEqual(results, expected);
```

## Utility API

- `hashKeys` :: [a] -> ({} -> Id b)

  Take a list of field names and hashes the object

## Record API

- `id` :: {} -> Id a
- `contentId` :: {} -> Id a
- `equals` :: {} -> {} -> Bool a
- `identical` :: {} -> {} -> Bool a
- `empty` :: () -> {}
- `concat` :: {} -> {} -> {}
- `hash` :: {} -> {}

## Lists of records API

- `equals` :: [{}] -> [{}] -> Bool a
- `identical` :: [{}] -> [{}] -> Bool a
- `empty` :: () => []
- `concat` :: [{}] -> [{}] -> [{}]

- `fmap` :: ({} -> {}) -> [{}] -> [{}]
- `pure` :: Any {} -> [{}]
- `apply` :: [({} -> {})] -> [{}] -> [{}]
- `filter` :: ({} -> Bool a) -> [{}] -> [{}]
- `uniq` :: [{}] -> [{}]
- `hash` :: [{}] -> [{}]

## Set API

- `union` :: [{}] -> [{}] -> [{}]
- `intersection` :: [{}] -> [{}] -> [{}]
- `difference` :: [{}] -> [{}] -> [{}]

## Ideas

- Make id hash fields protected. Never update an `id_fields` value. Make a new
  records out of it if necessary.
