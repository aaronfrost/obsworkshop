# Observables Workshop

This project is a starter for Frosty's Observables workshop. In order
to get going, please follow the setup instructions below.

## In Step 1

In this step of the workshop, we will do an in-depth comparison of Promises
and Observables. We will cover the following points about Observables. Each
of these points is an area where Observables are more powerful, but also
require more time to learn.

- They are very similar to create.
- They are very different to use.
  - Single Use vs Multiple Use
  - Eager vs Lazy
  - Cancellable
  - Multicasting
  - Chaining
  - Complete vs Incomplete

### Similar

Let's write a Promise and an Observable, and see how similar they are.

### Single Use vs Multiple Use

Promises are built upon the principle that they will fire exactly one time. Were they ever
to fire more than once, or never, it would create a catastrophic outcome for our
promise-based code.

Observables have no such guarantee, however. They may never fire. They may fire only once
(like a promise). And they may fire dozens or hundreds of times. Let's walk through this
and see how to handle multiple emissions from an Observable.

### Eager vs Lazy

Promises are eager, meaning that they fire immediately after they are declared. Whether
you have a `.then` listening to the promise or not, it is eager and will be executing
immediately.

Observables are not this way. They will not fire until they are subscribed to. For those
who aren't aware, calling `.subscribe` on an Observable is like calling `.then` on a
Promise. So it is distinct that unlike the Promise, which fires immediately after being
declared, that the Observable doesn't fire until it is subscribed to.

This feature is one of the most valueable features of Observables.

### Cancellable

One thing that is wicked difficult with Promises to do is cancel any HTTP request that
they make. It takes a significant amount of code to track current requests, and then
even more to cancel them when you need to.

With Observables, you get this for free in many cases. Let's go through this.
[Go Here](https://stackblitz.com/edit/obsworkshop-cancellation?file=index.ts)

### Multicasting

With a promise, if several pieces of code all call `.then` the promise only happens
the one time.

With Observables, however, if several pieces of code call `.subscribe` then the
Observable may perform the entire stream once for each subscriber. This means that
if we want, each subscriber can cause another request to our backend. Or, we can
learn to control this and have them share their subscription results.

We'll test with this - http://www.mocky.io/v2/5d8b0e90350000e104d46b9b?mocky-delay=100ms

### Chaining

Like Promises, Observables are very chainable. With a Promise, you do the following:

```javascript
myPromise
  .then(val => getAnotherPromise(val))
  .then(val2 => getYetAnotherPromise(val2))
  .then(val3 => seriouslyGetAnotherPromise(val3));
```

Chaining with Observables is done a few different ways. The most popular way is by
passing numerous different operators into the `pipe` function. NOTE: We'll cover
operators in another section.

### Complete vs Incomplete

One concept that we need to learn that has no comparison with Promises is that
of `Complete`. Observables will remain incomplete until something completes them.
Once they are complete, all of their subscriptions are removed automatically, which helps
prevent memory leaks.

Let's look at how to tap into this new lifecycle that Observables brings to the work of
async in JavaScript.

---

#### We did it

Once we made it this far, we are done with the first section of this workshop. Please
follow the following steps and checkout the branch `step2`.

- `git stash`
- `git checkout step2`
