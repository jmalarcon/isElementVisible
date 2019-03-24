// @ts-check
/**
 * @file This library adds 4 new events to any element in a page: show, hide, showpart and hidepart.
 * @author José Manuel Alarcón - www.JASoft.org - www.campusMVP.es
 * @version 3.0
 * @license MIT
 */

(function(){

//#region visibility checking functions

    /**
     * Assigns a handler to the events needed to control de visibility events
     * @param {EventListenerOrEventListenerObject} listener
     */
    function enableDetectionEventsListener(listener) {
        window.addEventListener("load", listener);
        window.addEventListener("resize", listener);
        window.addEventListener("scroll", listener);
    }

    /**
     * Removes the handler from the events needed to control de visibility events
     * @param {EventListenerObject} listener
     */
    function disableDetectionEventsListener(listener) {
        window.removeEventListener("load", listener);
        window.removeEventListener("resize", listener);
        window.removeEventListener("scroll", listener);
    }

    /**
     * Determines whether the element passed as a parameter is fully visible in the browser window or not.
     * @param {object} elt - The element whose visibility we are interested in determining
     * @returns {boolean} true if the item is fully visible, false if not
     */
    function isElementTotallyVisible(elt) {
        var viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        //Position of the element box
        var box = elt.getBoundingClientRect();
        return ( box.top >= 0 &&
                 box.bottom <= viewportHeight &&
                 box.left >= 0 &&
                 box.right <= viewportWidth );
    }

    /**
     * Determines whether the element passed as a parameter is visible even partially in the browser window or not.
     * @param {object} elt - The element whose visibility we are interested in determining
     * @returns {boolean} true if the item is visible, even partially, false if not
     */
    function isElementPartiallyVisible(elt) {
        var viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        //Position of the element box
        var box = elt.getBoundingClientRect();
        var insideBoxH = (box.left >= 0 && box.left <= viewportWidth) ||
                          (box.right >= 0 && box.right <= viewportWidth);
        var insideBoxV = (box.top >= 0 && box.top <= viewportHeight) ||
                          (box.bottom>= 0 && box.bottom <= viewportHeight);
        return (insideBoxH && insideBoxV);
    }

    /**
     * Defines a handler to be able to automatically detect when a certain element changes visibility on the page. This version considers that the element is visible, if any part of it is in the viewport.
     * @param {object} elt - The element whose visibility we are interested in determining
     * @param {function} handler - The function that will be called when the element has changed its visibility state. It receives a boolean to indicate whether it is visible or not, and a reference to the element that has changed its visibility.
     */
    function inViewportPartially(elt, handler) {
        var prevVisibility = isElementPartiallyVisible(elt);    //Creates a closure for the handler of this particular event
        //Define a handler to determine possible changes
        function detectPossibleChange() {
            var isVisible = isElementPartiallyVisible(elt);
            if (isVisible != prevVisibility) { //the visibility state of the element has changed
                prevVisibility = isVisible;
                if (typeof handler == "function")
                    handler(isVisible, elt);
            }
        }

        //Bind this internal function with the various events that could cause a change in visibility
        enableDetectionEventsListener(detectPossibleChange);
        return detectPossibleChange;    //To keep a reference to the closure for event remove
    }

    /**
     * Defines a handler to be able to automatically detect when a certain element changes visibility on the page.
     * @param {object} elt - The element whose visibility we are interested in determining
     * @param {function} handler - The function that will be called when the element has changed its visibility state. It receives a boolean to indicate whether it is visible or not, and a reference to the element that has changed its visibility.
     */
    function inViewportTotally(elt, handler) {
        var prevVisibility = isElementTotallyVisible(elt);    //Creates a closure for the handler of this particular event
        //Define a handler to determine possible changes
        function detectPossibleChange() {
            var isVisible = isElementTotallyVisible(elt);
            if (isVisible != prevVisibility) { //the visibility state of the element has changed
                prevVisibility = isVisible;
                if (typeof handler == "function")
                    handler(isVisible, elt);
            }
        }

        //Bind this internal function with the various events that could cause a change in visibility
        enableDetectionEventsListener(detectPossibleChange);
        return detectPossibleChange;    //To keep a reference to the closure for event removal
    }

//#endregion

//#region Event listeners subclassification and management

    //List of elements that already have visibility events enabled
    var showEnabledElements = [];
    var hideEnabledElements = [];
    var showpartEnabledElements = [];
    var hidepartEnabledElements = [];

    //Show
    /**
     * Adds show detection to an element. Raises when the element is shown totally (not partially)
     * @param {EventTarget} elt The element to add show events to
     */
    function enableElementShowEvent(elt) {
        //If element is not already enabled...
        if (showEnabledElements.indexOf(elt) == -1) {
            elt.onShowInternalListener = inViewportTotally(elt, raiseShowEvent); //Start detecting full show changes
        }
        //Add element to the list of enabled elements (it's in the list several times if there are several listeners)
        showEnabledElements.push(elt);
    }

    /**
     * Removes show detection from an element.
     * @param {EventTarget} elt
     */
    function disableElementShowEvent(elt) {
        var pos = showEnabledElements.indexOf(elt);
        //If element is not in the list, means a call to remove before adding a handler first
        if (pos == -1) return;

        //Remove the element from the list (it can be more than once)
        showEnabledElements.splice(pos, 1);

        //If the element is not in the list (it is once per event listener added)
        if (showEnabledElements.indexOf(elt) == -1)
        {
            //Remove the window events
            disableDetectionEventsListener(elt.onShowInternalListener);
            delete elt.onShowInternalListener;
        }
    }

    //Hide
    /**
     * Adds hide event detection to an element. Raises when the element is hidden totally (not partially)
     * @param {EventTarget} elt
     */
    function enableElementHideEvent(elt) {
        //If element is not already enabled...
        if (hideEnabledElements.indexOf(elt) == -1) {
            elt.onHideInternalListener = inViewportPartially(elt, raiseHideEvent); //Start detecting full hide changes
        }
        //Add element to the list of enabled elements (it's in the list several times if there are several listeners)
        hideEnabledElements.push(elt);
    }

    /**
     * Removes hide detection from an element.
     * @param {EventTarget} elt
     */
    function disableElementHideEvent(elt) {
        var pos = hideEnabledElements.indexOf(elt);
        //If element is not in the list, means a call to remove before adding a handler first
        if (pos == -1) return;

        //Remove the element from the list (it can be more than once)
        hideEnabledElements.splice(pos, 1);

        //If the element is not in the list (it is once per event listener added)
        if (hideEnabledElements.indexOf(elt) == -1)
        {
            //Remove the window events
            disableDetectionEventsListener(elt.onHideInternalListener);
            delete elt.onHideInternalListener;
        }
    }

    //Show Partially
    /**
     * Adds partial show detection to an element. Raises when the element is shown partially (not totally)
     * @param {EventTarget} elt
     */
    function enableElementShowpartEvent(elt) {
        //If element is not already enabled...
        if (showpartEnabledElements.indexOf(elt) == -1) {
            elt.onShowpartInternalListener = inViewportPartially(elt, raiseShowPartEvent); //Start detecting partial show changes
        }
        //Add element to the list of enabled elements (it's in the list several times if there are several listeners)
        showpartEnabledElements.push(elt);
    }

    /**
     * Removes partial show detection from an element.
     * @param {EventTarget} elt
     */
    function disableElementShowpartEvent(elt) {
        var pos = showpartEnabledElements.indexOf(elt);
        //If element is not in the list, means a call to remove before adding a handler first
        if (pos == -1) return;

        //Remove the element from the list (it can be more than once)
        showpartEnabledElements.splice(pos, 1);

        //If the element is not in the list (it is once per event listener added)
        if (showpartEnabledElements.indexOf(elt) == -1)
        {
            //Remove the window events
            disableDetectionEventsListener(elt.onShowpartInternalListener);
            delete elt.onShowpartInternalListener;
        }
    }

    //Hide partially
    /**
     * Adds hide partially event detection to an element. Raises when the element is hidden totally (not partially)
     * @param {EventTarget} elt
     */
    function enableElementHidepartEvent(elt) {
        //If element is not already enabled...
        if (hidepartEnabledElements.indexOf(elt) == -1) {
            elt.onHidepartInternalListener = inViewportTotally(elt, raiseHidePartEvent); //Start detecting partial hide changes
        }
        //Add element to the list of enabled elements (it's in the list several times if there are several listeners)
        hidepartEnabledElements.push(elt);
    }

    /**
     * Removes hide detection from an element.
     * @param {EventTarget} elt
     */
    function disableElementHidepartEvent(elt) {
        var pos = hidepartEnabledElements.indexOf(elt);
        //If element is not in the list, means a call to remove before adding a handler first
        if (pos == -1) return;

        //Remove the element from the list (it can be more than once)
        hidepartEnabledElements.splice(pos, 1);

        //If the element is not in the list (it is once per event listener added)
        if (hidepartEnabledElements.indexOf(elt) == -1)
        {
            //Remove the window events
            disableDetectionEventsListener(elt.onHidepartInternalListener);
            delete elt.onHidepartInternalListener;
        }
    }

    //Redefine the original global addEventListener and removeEventListener methods in order to detect the new custom events

    //Genereic event-raising method for visibility
    function raiseEvent(eventName, visibility, elt) {
        var evt = new CustomEvent(eventName, {
            detail: {
				visible: visibility //For being able to use the same handler for show and hide events. You can chech this value
			},
            bubbles: true,
            cancelable: false
        });
        elt.dispatchEvent(evt); //Notify event
    }

    //One method to handle/raise each event

    //Raises the show event for the specified element
    function raiseShowEvent(isVisible, elt) {
        if (isVisible) {
            raiseEvent('show', isVisible, elt);
        }
    }
    function raiseHideEvent(isVisible, elt) {
        //Raise show or hide depending on the visibility state
        if (!isVisible) {
            raiseEvent('hide', isVisible, elt);
        }
    }
    //Raises the showprt or hidepart event for the specified element
    function raiseShowPartEvent(isVisible, elt) {
        if (isVisible) {
            raiseEvent('showpart', isVisible, elt);
        }
    }
    function raiseHidePartEvent(isVisible, elt) {
        if (!isVisible) {
            raiseEvent('hidepart', isVisible, elt);
        }
    }

    //Subclassify the original global addEventListener to intercept and enable the new events
    //Original addEventListener
    var oAEL = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        //Call the original AEL
        oAEL.call(this, type, listener, options);

        //If the event is one of the supported ones by this library, then add the current element to raise the event
        var lType = type.toLowerCase();
        switch (lType) {
            case 'show': //Raised when the element is totally shown
                enableElementShowEvent(this);
                break;
            case 'hide':    //Raised when the element is totally hidden
                enableElementHideEvent(this);
                break;
            case 'showpart':    //Raised when the element is partially shown
                enableElementShowpartEvent(this);
                break;
            case 'hidepart':    //Raised when the element is partially hidden
                enableElementHidepartEvent(this);
                break;
        }
    };

    //Subclassify the original global removeEventListener to intercept and disable the new events
    //Original removeEventListener
    var oREL = EventTarget.prototype.removeEventListener;
    EventTarget.prototype.removeEventListener = function(type, listener, options) {
        //Call the original REL to remove the original listener
        oREL.call(this, type, listener, options);

        //If the event is one of the supported ones by this library, then remove the current handler to stop raising the event
        var lType = type.toLowerCase();
        switch (lType) {
            case 'show':
                disableElementShowEvent(this);
                break;
            case 'hide':    //Raised when the element is totally hidden
                disableElementHideEvent(this);
                break;
            case 'showpart':    //Raised when the element is partially shown
                disableElementShowpartEvent(this);
                break;
            case 'hidepart':    //Raised when the element is partially hidden
                disableElementHidepartEvent(this);
                break;
        }
    }

    //TODO: Add support for IE
//#endregion

})();
