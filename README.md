# Stencil-RxJS

Utilities to integrate RxJS workflows into Stencil components.

## Work in Progress

This package is very new and incomplete. The idea is to create something like this:

```tsx
import { Component, Prop, h } from "@stencil/core";
import { timer } from "rxjs";

const count$ = timer(0, 1000);

@Component({
  tag: "my-component",
  styleUrl: "my-component.css",
})
export class MyComponent {
  @Subscribe(count$) count: number;

  render() {
    return <div>{this.count}</div>;
  }
}
```

And it's already pretty close. The `@Subscribe` decorator subscribes and unsubscribes when the component is connected and disconnected, and updates the property accordingly. However, no new render is scheduled. An idea is to place `@State` before the `@Subscribe` decorator whenever necessary, but this results in an error at the moment. Ideas are very welcome.
