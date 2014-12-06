# tween-chain

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Creates a new tween that chains and groups multiple tweens, allowing you to create a timeline of sorts.

```js
var Tween = require('tween-chain')

var el = { x: 0, y: 0, z: 0 }

var chain = Tween()
        .chain(el, { x: 10, delay: 0.5, duration: 1, ease: 'expoOut' })
        .chain(el, { y: 10, delay: 0.6, duration: 1.5 })
        .then(el, { z: 10, delay: 0.5, duration: 1 })
        .on('complete', function() {
            console.log("all tweens complete")
        })

//we can use tweenr to handle timing for us
require('tweenr').to(chain)
```

The first two tweens (on `x` and `y`) run in parallel with a slightly different delays/durations. The third tween runs *after* the previous `y` tween is finished, so `z` won't start tweening until 2s (including its delay).

Features:

- `chain()` allows you to stack tweens so they run in parallel
- `then()` allows you to defer your tween until the previously added tween is finished
- events are triggered for the whole chain
- cancelling a chain cancels all the tweens it contains
- you can `chain()` and `then()` other chains to build up complex and layered timelines

Note that tweens are mutable, so timelines are not currently "reusable" -- instead, they should be wrapped in a function.

```js
function animateIn(element) {
    return Tween()
        .chain(element, { opacity: 1, duration: 1 })
        .chain(element, { radius: 5, duration: 1.5 })
}
```

## Usage

[![NPM](https://nodei.co/npm/tween-chain.png)](https://nodei.co/npm/tween-chain/)

The constructor, `chain()`, and `then()` methods all follow the same pattern as [tweenr#to](https://github.com/mattdesl/tweenr#tweenr--requiretweenropt). You can pass in a tween object (like another `tween-chain`) or `(element, opt)` to create a generic object tween.

#### `tween = require('tween-chain')([element, opt])`

Creates a new chain, optionally with an initial tween. 

#### `tween.chain(element, opt)`

Adds a tween to this chain which will be run as soon as this chain starts. Aside from individual delays, any `chain()` tweens will always run in parallel. This is mostly useful e.g. if you want to tween opacity and size with subtly different easings or timings. 

#### `tween.then(element, opt)`

Adds a tween which is only started once the previously added tween has completed. This allows you to build up events that trigger one after another.


#### `tween.cancel()`

Cancels this chain and its children, returning this for method chaining.

If you cancel a chain, all of its children will emit `cancelling` and subsequent `complete` events on next tick. This also means that any subsequent chains waiting for this chain will then be triggered. 

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/tween-chain/blob/master/LICENSE.md) for details.
