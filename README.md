# JLS-breakdown Game

Simple 2D agar.io inspired game where you compose music just by eating
game elements from playground.

Each time you eat something -> some sounds is generated so you compose
your own music just by moving (aka changing your cursor on the browser screen)

I developed this game in 2017 for personal purposes.
In 2020 I did small refactor to hooks and typescript and publish it on my github

## Preview

[Game is temporary deployed this url: http://jake-loves-space-game.svehlik.eu/](http://jake-loves-space-game.svehlik.eu/)

## Screenshot

![game preview](/docs/game-preview.png)

visualised performance for `getAnimationFrame` event game loop

![game preview](/docs/game-performance-overview.png)

## dev

app is builded on `create-react-app` react boilerplate

### run for local development

```bash
npm install
npm run start
```

### build

```bash
npm run build
```

## License

JLS-breakdown Game is licensed under the MIT license.

## TODO:

- adding multiplayer
- sounds are ofter not predictable
