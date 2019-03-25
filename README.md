# VisibilityEvents.js

Something that can be very useful in a page or web application is **the ability to detect when a particular item appears or disappears from the screen** due to the actions of the user. It's similar to the "waypoints" feature some libraries include, but in a generic and simpler way.

For example, if a piece of important information disappears because the user scrolls by moving the contents, we can extract a summary note, reminder or shortcut to go see it again, apply an animation, or hide it again when the element reappears. Things like that...

To get something like this we could use **an `inViewport` event**, or similar, to get notified when an item appears or disappears from the visible part of the page (the viewport). We would subscribe to this event and automatically receive notifications if the item appears or disappears.

The problem is that **there is no such event in HTML / JavaScript**.

To fix this problem I have created this library `visibilityEvents.js`, written in pure ECMAScript 5 and **working in all browsers except Internet Explorer**. The library is ony 903 bytes minimized nad gzipped.

This library defines **4 new events** for any DOM element:

- **`show`**: it's raised when an element is **completely inside the viewport** in the page. If the element is initially visible it won't raise the event. It's only raised if the element is not totally visible in the page and gets into the viewport completely (by means of scrolling or resizing the page).
- **`hide`**: gets notified when an element is **completely outside the viewport** of the page.
- **`showpart`**: raised when the element was hidden and any part of it is partially in the viewport. As soon as the element box enters the viewport this event is raised.
- **`hidepart`**: when the element was fully visible and any part of it gets hidden.

The events adds a `visible` property to the `details` object of the `event` so that you can reuse the same handler for several of them.

>You can install this package through [npm](https://www.npmjs.com/package/visibilityevents) in order to keep dependencies under control in your app:
>
>`npm i visibilityevents`

To use this library just put a reference to the script in the header of the page and then define events in the usual way:

```html
<script src="visibilityEvents.min.js"></script>
```

```javascript
var elt = document.getElementById("myElement");

elt.addEventListener('show', function() {
    console.log("Element %s, shown completely in the page. Visibility state: %s", ev.target.id, ev.detail.visible);
});
```

In this case the `show` event is raised if the element was totally or partially outside the viewport and, by means of scrolling or resizing, the element gets totally inside the viewport.

It's important to know that **those events only raise in the case the visibility state changes**. For example, if the element is already visible when the page loads, the `show` event won't be raised. It only will be raised if the element is not visible and then is visible again. The same thing happens to all the new events: they detect **changes** in the corresponding visibility state.

## Testing sample

In the repository a small example is also included (`test.html`) with two boxes stuck in the middle of a lot of text (to be able to scroll and test them). This example uses the four events to display **in the browser console** ant visibility changes, and thus to be able to test it in practice.

The first box uses two `show` events to notify in the console when it's completely visible in the viewport, and one `hidepart` event to notify when it starts to get hidden. If you click on it, one of the handlers will be toggled (for testing `removeEventListener`).

The second box will notify when it starts to enter the visible area and when it is totally outside it.

## A word of warning

It's important to notice that the visibility events will only work if the visibility state changes because of **scrolling**, **resizing** or the page finishes **loading** making the previous state of the element change.

I know there are other events that can lead to a change in the visibility of an element, for example dynamically modifying the DOM structure through code, changing the `display` property of the element or other elements, or if the user applies a zoom to the page. For the sake of simplicity and to keep the original objective of this library, none of those events are taken into consideration (in fact there's no effective way to detect the last one, zooming, anyway). The idea here is to detect changes in visibility on a normal use of a webpage. However if you need to add any of those events you can modify `enableDetectionEventsListener` and `disableDetectionEventsListener` in the source code.

I hope you find it useful!