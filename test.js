var test = require('tape').test
var Tween = require('./')
var array = require('tween-array')
var Ticker = require('tween-ticker')

test("basic tween", function(t) {
    var el = { x: 0, y: 0 }

    var tween = Tween(el, { duration: 1, x: 5 })
    tween.tick(0.5)
    t.equal(el.x, 2.5, 'ticks tween')
    t.end()
})

test("a tween timeline or chain", function(t) {
    var el = { x: 0, y: 0 }
    var start = [10, 10], end = [20, 20]

    t.plan(5)
    var tween = Tween(el, { duration: 1, x: 5 })
        .chain(el, { duration: 2, delay: 0.5, z: 5, y: 2 })
        .chain(array(start, end, 2))
        .on('complete', function() {
            t.equal(tween.time, 2.5, 'total time should equal')
            t.equal(el.x, 5, 'tweens both timelines')
            t.equal(el.y, 2, 'tweens both timelines')
            t.deepEqual(start, [20, 20], 'includes array tween')
        })
    tween.tick(0.5)
    t.equal(el.x, 2.5, 'ticks tween')
    tween.tick(0.5) 
    tween.tick(1)
    tween.tick(0.5)
})

test("then() chaining", function(t) {
    var el = { x: 0, y: 0 }
    var start = [0, 0], end = [5, 5]

    t.plan(9)
    var tween = Tween(el, { x: 10, duration: 2 })
            .then(el, { x: 0, duration: 1 })
            .then(el, { y: 5, duration: 0.5, delay: 0 })
            .chain(array(start, end, 4)) //runs in parallel
            .on('complete', function() {
                t.equal(tween.time, 4, 'all tweens finished')
            })
    tween.tick(1)
    t.equal(el.x, 5, 'toward first tween')
    tween.tick(1)
    t.deepEqual(start, [2.5, 2.5], 'chain in parallel')
    t.equal(el.x, 10, 'hits first tween')
    t.equal(el.y, 0, 'third tween has not started')
    tween.tick(0.5)
    t.equal(el.x, 5, 'toward second tween')
    tween.tick(0.5)
    t.equal(el.x, 0, 'hits second tween')
    t.equal(el.y, 0, 'third tween has not started')
    tween.tick(0.25)
    t.equal(el.y, 2.5, 'third tween started')
    tween.tick(0.25)
    tween.tick(0.5)
})

test('events', function(t) {
    var el = { x: 0, y: 0 }
    var start = [0, 0], end = [5, 5]
   
    t.plan(5)

    var tween = Tween(el, { x: 10, duration: 2 })
            .then(el, { x: 0, duration: 1 })
            .then(el, { y: 5, duration: 0.5, delay: 0 })
            .chain(array(start, end, 4)) //runs in parallel
            .on('start', function() {
                t.ok(tween.time > 0, 'start event')
            })
            .on('update', function() {
                t.ok(true, 'update event')
            })

    tween.tick(0.5)
    t.deepEqual(el, { x: 2.5, y: 0 }, 'changes el')
    tween.cancel()

    //subsequent ticks do nothing
    tween.tick(0.5)
    tween.tick(0.5)
    tween.tick(4)

    t.deepEqual(el, { x: 2.5, y: 0 }, 'tween cancels whole chain')
    t.deepEqual(start, [ 0.625, 0.625 ], 'tween cancels whole chain')
})

test('tweenception', function(t) {
    var el = { x: 0, y: 0 }
    t.plan(6)

    var tween = Tween()
            .chain(el, { x: 1, duration: 1 })
            .then(el, { x: -1, duration: 2 })

    var tween2 = Tween()
            .chain(tween)
            .then(el, { y: 2, duration: 1 })
            .on('complete', function() {
                t.deepEqual(el, { x: -1, y: 2 }, 'all complete')
            })
    tween2.tick(0.5)
    t.deepEqual(el, { x: 0.5, y: 0 }, 'chain inside a chain')
    tween2.tick(0.5)
    t.deepEqual(el, { x: 1, y: 0 }, 'chain inside a chain')
    tween2.tick(1)
    t.deepEqual(el, { x: 0, y: 0 }, 'chain inside a chain')
    tween2.tick(1)
    t.deepEqual(el, { x: -1, y: 0 }, 'chain inside a chain')
    tween2.tick(0.5)
    t.deepEqual(el, { x: -1, y: 1 }, 'chain inside a chain')
    tween2.tick(0.5)
})


test('easing', function(t) {
    var el = { x: 0, y: 0, z: 0 }
    
    var funk = function(a) {
        return 0.5
    }

    var ticker = Ticker({ eases: { funk: funk } })
    var tween = Tween()
            .chain(el, { x: 1, ease: funk, duration: 1 })
            .chain(el, { y: 1, ease: 'funk', duration: 1 })
            .chain(el, { z: 1, duration: 1 })

    ticker.to(tween)
    ticker.tick(1)

    t.deepEqual(el, { x: 0.5, y: 0.5, z: 1 })
    t.end()
})