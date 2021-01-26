# SCILL Web Components

This project contains some web components that can easily be integrated into web pages.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.7.

## Creating a new Web Component

To create a new web component (widget), follow this guide:

1. Create the new component in the `app` folder (i.e. use this command to create the `MyDashboard` component: `ng g component MyDashboard`)
2. Add the component to the `entryComponents` array in `app.module.ts`
3. Register the component in `ngDoBootstrap` in `app.module.ts` (see examples to understand how to do that)
4. Add the registered HTML tag in the `index.html`

## Styles
You can either put styles into to components style sheet. In this case, the widget will not be
influenced by the webpage it is embedded. If you want the widgets styles to be changeable, you
need to set `ViewEncapsulation` in the component decoration to `None` (see examples) and add
the styles in the `styles.scss` file.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build:elements` to build the project. In the folder `elements` three files will be created:

1. `scill-widgets.js`
2. `styles.css`
3. `index.html`

To add the widgets to a web page you need to include the JS and CSS files and add ad html tag registered before:

```html
<!doctype html>
<html lang="en">
<head>
  <title>SCILL Widgets Demo</title>
</head>
<body>
<scill-task-list app-id="593776232582742019" api-key="3:8OZ=I6M~$((bzTB&E&OJRXcLE48S!:'x),F.8I*," user-id="1234" battle-pass-id="627086321190174723"></scill-task-list>
<script src="scill-widgets.js"></script>
<link rel="stylesheet" type="text/css" href="styles.css">
</body>
</html>
```

## About SCILL

This example code uses the [SCILL JavaScript SDK](https://github.com/scillgame/scill-js) and is **not ready for
production** as it exposes the API key. 

Developer documentation and more info about exposing API keys and using access tokens instead can
be found in our developer documents: [SCILL Developer Documentation](https://developers.scillgame.com/api/introduction.html)
