var Ticker = require('tween-ticker')
var Base = require('tween-base')
var inherits = require('inherits')

module.exports = function(target, end, opt) {
    return new TweenChain(target, end, opt)
}

function TweenChain(element, opt) {
    Base.call(this)
    this.ticker = Ticker()
    this.tweens = []
    this.deferred = []
    this.on('complete', this._handleComplete.bind(this))

    if (element)
        this.chain(element, opt)
}

inherits(TweenChain, Base)

TweenChain.prototype._handleComplete = function() {
    this.active = false
}

TweenChain.prototype.chain = function(element, opt) {
    var tween = this.ticker.to(element, opt)
    return this._push(tween)
}

TweenChain.prototype._push = function(tween) {
    this.tweens.push(tween)
    this.duration += (tween.delay||0) + (tween.duration||0)

    var self = this
    tween.once('complete', function(tween) {
        //remove this tween from the list of remaining tweens
        var idx = self.tweens.indexOf(tween)
        if (idx !== -1)
            self.tweens.splice(idx, 1)

        //all tweens complete
        if (self.tweens.length === 0)
            self.emit('complete', self)
    })

    tween.once('start', function() {
        if (!self._started) {
            self._started = true
            self.emit('start', self)
        }
    })
    return this
}

TweenChain.prototype.then = function(element, opt) {
    if (this.tweens.length > 0) {
        //create a tween that isn't initially running
        var next = this.ticker.to(element, opt)
        next.enabled = false

        //when the last tween is completed, we can start 
        //running our next tween
        var last = this.tweens[this.tweens.length-1]
        var self = this
        last.once('complete', function() {
            self.deferred.push(next)
        })
        return this._push(next)
    } else {
        return this.chain(element, opt)
    }
}

TweenChain.prototype.tick = function(dt, ease) {
    //start running any deferred tweens
    while (this.deferred.length > 0) {
        var next = this.deferred.pop()
        next.enabled = true
    }

    if (this.cancelling && this.active) {
        this.active = false
        this.emit('cancelling', this)
        this.tweens.forEach(function(t) {
            t.cancel()
            t.tick(0)
        })
        this.emit('complete', this)
    }

    if (!this.active)
        return

    this.time += dt
    this.ticker.tick(dt, ease)
    this.emit('update', this)
}