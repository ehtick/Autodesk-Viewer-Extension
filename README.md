# Instructions

Build a Autodesk Viewer extension using the test-extension.ts file. There are two classes within the test-extension.ts file, TestTool and TestExtension. Code related to the tool will sit within the TestTool class and TestExtension will create an instance of that class. TestExtension will also handle the toolbar and button to activate/deactivate the tool.

## Requirements
The extension will have to allow the user to draw a polygon on the suface of the rendered building. The polygon will need to be able to complete a full shape. An event should be fired to the console once the polygon has been completed. The polygon should have a color fill that is slightly transparent.

Please refer to the below image for an example of the end result:
![alt text](./src/assets/markup.png)

## Resources
An extension built by an Autodesk staff member has been included in this repo as an example. This extension allows the user to draw a box or sphere on the canvas through the use of ThreeJS. Please see the draw-tool-extension.ts file.

A collection of other extensions built by Autodesk as examples can be found here: https://github.com/autodesk-platform-services/aps-extensions 


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
