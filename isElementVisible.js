// @ts-check
/**
 * @file This library defines an object with two functions to detect visibility (total or partial) of an element in the viewport, and two functions that simulate two nonexistent events to detect when any element enters or leaves the visible area of the page.
 * @author José Manuel Alarcón - www.JASoft.org - www.campusMVP.es
 * @version 2.0
 * @license MIT
 */

(function(){

//#region visibility checking functions

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
        window.addEventListener("load", detectPossibleChange);
        window.addEventListener("resize", detectPossibleChange);
        window.addEventListener("scroll", detectPossibleChange);
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
        window.addEventListener("load", detectPossibleChange);
        window.addEventListener("resize", detectPossibleChange);
        window.addEventListener("scroll", detectPossibleChange);
    }

//#endregion

//#region Event listeners subclassification and management

    //I'm going to redefine theoriginal global addEventListener and removeEventListener methods in order to detect the new custom events

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
        return false;   //Don't cancel further events
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
                inViewportTotally(this, raiseShowEvent);
                break;
                case 'hide':    //Raised when the element is totally hidden
                inViewportPartially(this, raiseHideEvent);
                break;
                case 'showpart':    //Raised when the element is partially shown
                inViewportPartially(this, raiseShowPartEvent);
                break;
            case 'hidepart':    //Raised when the element is partially hidden
                inViewportTotally(this, raiseHidePartEvent);
                break;
        }
    };

    //TODO: subclassify removeEvent Listener
    //TODO: support for IE

    //Assign the global helper object
    // window.visibilityHelper = {
    //     isElementTotallyVisible: isElementTotallyVisible,
    //     isElementPartiallyVisible: isElementPartiallyVisible,
    //     inViewportPartially: inViewportPartially,
    //     inViewportTotally: inViewportTotally
    // };
})();
