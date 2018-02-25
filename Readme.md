# SugarCube Lists

Experiment with lists for [SugarCube](https://gitlab.com/sugarcube/sugarcube).

## Synopsis

[![Build Status](https://travis-ci.org/critocrito/sugarcube-list.svg?branch=master)](https://travis-ci.org/critocrito/sugarcube-list)

Look into the [`api.md`](api.md) and into [`test`](test) for descriptions.
Note that the current implementation of SugarCube actually fails all but
one test. The tests have a negative assertion
(`results.should.not.eql(expected)`).

## Installation

```
git clone git@github.com:critocrito/sugarcube-list.git
cd sugarcube-list
npm install
npm run build
```

## Tests

```
npm run tests
```
