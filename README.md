# isElementVisible

Something that can be very useful in a page or web application is **the ability to detect when a particular item appears or disappears from the screen** due to the actions of the user.

For example, if a piece of important information disappears because the user scrolls by moving the contents, we can extract a summary note, reminder or shortcut to go see it again, and hide it again when the element reappears. Things like that...

To get something like this we could use **an `inViewport` event**, or similar, to get notified when an item appears or disappears from the visible part of the page (the viewport). We would subscribe to this event and automatically receive notifications if the item appears or disappears.

The problem is that **there is no such event in HTML / JavaScript**.

To fix this problem I have created the library `isElementVisible.js`.

The library exposes **a `visibilityHelper` object** with 4 functions:

- **`isElementTotallyVisible(element)`**: Indicates whether or not an element is within the visible area of ​​the page.
- **`isElementPartiallyVisible(element)`**: Indicates whether or not an element is within the visible area of ​​the page.
- **`inViewportPartially(element, handler)`**: It is used to define an event handler that will be automatically raised when the element that is indicated is partially or totally outside the current page.
- **`inViewportTotally(element, handler)`**: It is used to define an event handler that will be automatically raised when the element that is indicated is completely in or out of the current page.

To use this library just put a reference to the script in the header of the page and then define the event in a similar way to this:

```
var myDiv = document.getElementById("myElement");
visibilityHelper.inViewportPartially(myDiv, function(visible, element){
                                                console.log("%s element is visible?: %s", element.id, visible);
                                        });
```

Which will cause the event handler to be called whenever the element partially enters or leaves the visible area of ​​the page.

>**Note**: The events definition should be done at the end of the page or in the load event (or `$.ready()` in jQuery), where the elements that we are going to monitor are fully defined and we can locate them.

In the repository is also included a small example (test.html) with two boxes stuck in the middle of a lot of text (to be able to scroll and test them). This example uses both events (total and partial visibility) to display **in the browser console** when the event of entry and exit of the visible area happens, and thus to be able to test it in practice.

I hope you find it useful!
