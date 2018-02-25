import Benchmark from "benchmark";
import {lists} from "@sugarcube/test";
import * as L from "list";

import listOld from "../lib/list-old";

console.log("Generating lists. This takes a while.");

const tenItems = lists(10);
const hundredItems = lists(100);
const thousandItems = lists(1000);
const tenThousandItems = lists(10000);
const hundredThousandItems = lists(100000);
const tenItemsAlt = lists(10);
const hundredItemsAlt = lists(100);
const thousandItemsAlt = lists(1000);
const tenThousandItemsAlt = lists(10000);
const hundredThousandItemsAlt = lists(100000);

const suite = new Benchmark.Suite();

suite
  .add("listOld.concat ten items", () => listOld.concat(tenItems, tenItemsAlt))
  .add("listOld.concat hundred items", () =>
    listOld.concat(hundredItems, hundredItemsAlt)
  )
  .add("listOld.concat thousand items", () =>
    listOld.concat(thousandItems, thousandItemsAlt)
  )
  .add("listOld.concat ten thousand items", () =>
    listOld.concat(tenThousandItems, tenThousandItemsAlt)
  )
  .add("listOld.concat hundred thousand items", () =>
    listOld.concat(hundredThousandItems, hundredThousandItemsAlt)
  )

  .add("L.concat ten items", () => L.concat(tenItems, tenItemsAlt))
  .add("L.concat hundred items", () => L.concat(hundredItems, hundredItemsAlt))
  .add("L.concat thousand items", () =>
    L.concat(thousandItems, thousandItemsAlt)
  )
  .add("L.concat ten thousand items", () =>
    L.concat(tenThousandItems, tenThousandItemsAlt)
  )
  .add("L.concat hundred thousand items", () =>
    L.concat(hundredThousandItems, hundredThousandItemsAlt)
  )

  .add("listOld.concat same ten items", () =>
    listOld.concat(tenItems, tenItems)
  )
  .add("listOld.concat same hundred items", () =>
    listOld.concat(hundredItems, hundredItems)
  )
  .add("listOld.concat same thousand items", () =>
    listOld.concat(thousandItems, thousandItems)
  )
  .add("listOld.concat same ten thousand items", () =>
    listOld.concat(tenThousandItems, tenThousandItems)
  )
  .add("listOld.concat same hundred thousand items", () =>
    listOld.concat(hundredThousandItems, hundredThousandItems)
  )

  .add("L.concat same ten items", () => L.concat(tenItems, tenItems))
  .add("L.concat same hundred items", () =>
    L.concat(hundredItems, hundredItems)
  )
  .add("L.concat same thousand items", () =>
    L.concat(thousandItems, thousandItems)
  )
  .add("L.concat same ten thousand items", () =>
    L.concat(tenThousandItems, tenThousandItems)
  )
  .add("L.concat same hundred thousand items", () =>
    L.concat(hundredThousandItems, hundredThousandItems)
  )
  .on("cycle", ev => console.log(String(ev.target)))
  .on("error", e => console.error(e.target.error))
  .run();
