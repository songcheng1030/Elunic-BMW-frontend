# BMW AIQX Use Cases


#### Table of Contents

- [BMW AIQX Use Cases](#bmw-aiqx-use-cases)
      - [Table of Contents](#table-of-contents)
  - [Docker shell](#docker-shell)
  - [Angular commands](#angular-commands)
    - [Ngrx](#ngrx)
      - [Working with @ngrx/entitiy](#working-with-ngrxentitiy)

## Docker shell

All development should take place inside this Docker-based shell
to ensure dependencies and versions are the same everywhere.

```shell
$ npm run shell
```

You can join an existing shell by running:

```shell
$ npm run shell:join
```

## Angular commands

The usual Angular commands are available in addition to the ones listed above,
such as `ng serve`, `ng build`, though it is recommended to use the provided
`npm` scripts whenever possible.

### Ngrx

Also make use of the NGRX code scaffolding. For available commands see `ng generate --help`.
See also in the [Docs](https://ngrx.io/docs), [Schematics](https://ngrx.io/guide/schematics/store) and specifically [@ngrx/entitiy](https://ngrx.io/guide/entity).

#### Working with @ngrx/entitiy
Ngrx Entitiy provides a simple way to work with flat entities that are stored in a efficient way in the NGRX Store. It provides a simple way to generate most of the ngrx boilerplate that is needed for an entitiy. A few manual steps are needed to hook everything up. Steps to get a new entity(in the example a "Todo" Entity) fully working in the store. 
1. `ng g entity ngrx/todo/Todo` will generate all the boilerplate code to get you started. (model,actions,reducer)
2. Enable the genrated `todo.reducer.ts` file to work with multiple states (multiple entities in the store):
  * `export const todoFeatureSelector = createFeatureSelector<State>(todoesFeatureKey);` has to be added to the generated `todo.reducer.ts`
  * Let the already generated selector know, they should select within that State: `...= adapter.getSelectors(todoFeatureSelector);`
3. Hook the entity up to be availabe in the app-wide NGRX Store in `ngrx/index.ts`:
  * Recommended way to import needed reducers: `import * as Todo from './todo/todo.reducer';`
  * Add it to the store (root state), add: `[Todo.todoesFeatureKey]: Todo.State` to the State interface
  * Add the reducers so that they are subscribed: `[Todo.todoesFeatureKey]: Todo.reducer` to the reducer const. _HINT: Angular Aot does not support the dynamic property names, use `'todos': Todo.reducer` then
  * Optionally, it the entities also has it's own side effects (e.g. backend calls), use `ng g effect ngrx/todo/Todo` to create these and also add them in the index.ts to the appEffects array!
