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

//we can use tweenr to handle timing for us
require('tweenr').to(chain)
    .on('complete', function() {
        console.log("all tweens complete")
    })
```

The first two tweens (on `x` and `y`) run in parallel with a slightly different delays/durations. The third tween runs *after* the previous tween is finished, so `z` won't start tweening until 2s (including its delay).

Features:

- `chain()` allows you to stack tweens so they run in parallel
- `then()` allows you to defer your tween until the previously added tween is finished
- events are triggered for the whole chain
- cancelling a chain cancels all the tweens it contains
- you can `chain()` and `then()` other chains to build up complex and layered timelines

## Usage

[![NPM](https://nodei.co/npm/tween-chain.png)](https://nodei.co/npm/tween-chain/)

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/tween-chain/blob/master/LICENSE.md) for details.
