
# Contributing

Want to contribute to these plugins? That would be awesome!

- [Reporting Bugs](#reporting-bugs)
- [Running Examples](#running-examples)
- [Running Tests](#running-tests)
- [Publishing Releases](#publishing-releases)


## Reporting Bugs

If you run into any weird behavior while using one of these plugins, feel free to open a new issue in this repository! Please run a **search before opening** a new issue, to make sure that someone else hasn't already reported or solved the bug you've found.

Any issue you open must include:

- A [JSFiddle](https://jsfiddle.net/wphujnwf/7/) that reproduces the bug with a minimal setup.
- A GIF showing the issue in action. (Using something like [RecordIt](http://recordit.co/).)
- A clear explanation of what the issue is.

Here's a [JSFiddle template with the plugins](https://jsfiddle.net/wphujnwf/7/) to get you started:

[![](./docs/images/jsfiddle.png)](https://jsfiddle.net/wphujnwf/7/)


## Running Examples

To get the examples running on your machine, you need to have the Slate repository cloned to your computer. After that, you need to `cd` into the directory where you cloned it, and install the dependencies with `yarn` and bootstrap the monorepo:

```
yarn install
yarn run bootstrap
```

Then start the watcher and examples server:

```
yarn run watch
```

Now you can open up `http://localhost:8080/dev.html` in your browser and you'll see the examples site. Any changes you make to the source code will be immediately reflected when you refresh the page.


## Running Tests

To run the tests, you need to have the Slate repository cloned to your computer. After that, you need to `cd` into the directory where you cloned it, and install the dependencies with `yarn` and bootstrap the monorepo:

```
yarn install
yarn run bootstrap
```

Then run the tests with:

```
yarn run test
```

To keep the source rebuilding on every file change, you need to run an additional watching command in a separate process:

```
yarn run watch
```

If you need to debug something, you can add a `debugger` line to the source, and then run `yarn run test debug`. 

If you only want to run a specific test or tests, you can run `yarn run test --fgrep="slate-react rendering"` flag which will filter the tests being run by grepping for the string in each test.


## Publishing Releases

Since we use [Lerna](https://lernajs.io) to manage the Slate packages this is fairly easy, **but** you must make sure you are using `npm` to run the release script, because using `yarn` results in failures. So just run:

```js
npm run release 
```

And follow the prompts Lerna gives you.
