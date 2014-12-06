# tween-chain

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Creates a new tween that chains and groups multiple tweens, allowing you to create a makeshift timeline. 

```js
var Tween = require('tween-chain')

var chain = Tween()
        .chain(el, { x: 10, delay: 0.5, duration: 1 })
        .chain()
        .then(el, {})

tweenr.to(chain)
```

## Usage

[![NPM](https://nodei.co/npm/tween-chain.png)](https://nodei.co/npm/tween-chain/)

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/tween-chain/blob/master/LICENSE.md) for details.
