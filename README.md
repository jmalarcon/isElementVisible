# isElementVisible.js

Something that can be very useful in a page or web application is **the ability to detect when a particular item appears or disappears from the screen** due to the actions of the user. It's similar to the "waypoints" feature some libraries include, but in a generic and simpler way.

For example, if a piece of important information disappears because the user scrolls by moving the contents, we can extract a summary note, reminder or shortcut to go see it again, apply an animation, or hide it again when the element reappears. Things like that...

To get something like this we could use **an `inViewport` event**, or similar, to get notified when an item appears or disappears from the visible part of the page (the viewport). We would subscribe to this event and automatically receive notifications if the item appears or disappears.

The problem is that **there is no such event in HTML / JavaScript**.

To fix this problem I have created this simple library `isElementVisible.js`, written in pure ECMAScript 5 and working in even older browsers.

The library exposes **a `visibilityHelper` global object** with 4 functions:

- **`isElementTotallyVisible(element)`**: Indicates whether or not an element is within the visible area of ​​the page.
- **`isElementPartiallyVisible(element)`**: Indicates whether or not an element is within the visible area of ​​the page.
- **`inViewportPartially(element, handler, onlyFirstTime)`**: It is used to define an event handler that will be automatically raised when the element that is indicated is partially or totally outside the current page. The last boolean parameter indicates if the handler is going to be called every time this happens (`false`, default value), or only the first time the element enters the viewport (`true`). The handler receives the current visibility state (to detect if it's entering (`true`) or leaving (`false`) the viewport)
- **`inViewportTotally(element, handler, onlyFirstTime)`**: It is used to define an event handler that will be automatically raised when the element that is indicated is completely in or out of the current page. The last boolean parameter indicates if the handler is going to be called every time this happens (`false`, default value), or only the first time the element enters or exists the viewport (`true`). The handler receives the current visibility state (to detect if it's entering (`true`) or leaving (`false`) the viewport)

You can use the return value of the handler to cancel further enter/exit events detection. If you return `true` the event will be cancelled and no further detection will be done. If you return `false` (or don't return anything at all) the events will keep raising.

To use this library just put a reference to the script in the header of the page and then define the event in a similar way to this:

```
var myDiv = document.getElementById("myElement");
visibilityHelper.inViewportPartially(myDiv, 
        function(visible, element){
                console.log("%s element is visible?: %s", element.id, visible);
        });
```

Which will cause the event handler to be called whenever the element partially enters or leaves the visible area of ​​the page, notifying the current visibility state and the element (in case we use the same handler for several elements).

>**Note**: The events definition should be done at the end of the page or in the load event (or [`$.ready()`](https://api.jquery.com/ready/) in jQuery), where the elements that we are going to monitor are fully defined and we can locate them.

In the repository a small example is also included (`test.html`) with two boxes stuck in the middle of a lot of text (to be able to scroll and test them). This example uses both events (total and partial visibility) to display **in the browser console** when the event of entry and exit of the visible area happens, and thus to be able to test it in practice. Add a `true` value to the `inViewportTotally` or `inViewportPartially` methods in the test to test that the handler is being called only the first time.

I hope you find it useful!
