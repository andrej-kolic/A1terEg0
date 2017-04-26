![scr1](https://cloud.githubusercontent.com/assets/1579077/25276308/da47b228-2699-11e7-9435-e0c2114b8c67.png)

![scr2](https://cloud.githubusercontent.com/assets/1579077/25276315/dfc2852a-2699-11e7-996f-18c65634a38c.png)

# Built on top of Relay Starter Kit

This kit includes an app server, a GraphQL server, and a transpiler that you can use to get started building an app with Relay. For a walkthrough, see the [Relay tutorial](https://facebook.github.io/relay/docs/tutorial.html).

## Installation

```
npm install
```

## Running

Start a local server:

```
npm start
```

## Developing

Any changes you make to files in the `js/` directory will cause the server to
automatically rebuild the app and refresh your browser.

If at any time you make changes to `data/schema.js`, stop the server,
regenerate `data/schema.json`, and restart the server:

```
npm run update-schema
npm start
```

## License

Relay Starter Kit is [BSD licensed](./LICENSE). We also provide an additional [patent grant](./PATENTS).


## Improvements
- validation
- conversations / multiple users
- authentication
- default avatar
