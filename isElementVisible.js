/**
 * @file This library defines an object with two functions to detect visibility (total or partial) of an element in the viewport, and two functions that simulate two nonexistent events to detect when any element enters or leaves the visible area of the page.
 * @author José Manuel Alarcón - www.JASoft.org - www.campusMVP.es
 * @version 2.0
 * @license MIT
 */

(function(){
    
    /**
     * Regulating function that allows to imit the maximun number of calls to a function
     * @param {function} func - The function to regulate
     * @param {int} maxPerSec - Maximun number of tuimes per second the function can be called
     */
    function limitCalls(func, maxPerSec) {
        var lockActivated = false;

        return function() {
            var disableLock = function() {
                lockActivated = false;
            };

            if (!lockActivated) {
                func.apply(this, arguments);
                lockActivated = true;
                setTimeout(disableLock, 1000/maxPerSec);
            }
        };
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
     * @param {boolean} onlyFirstTime - If true the handler is called only the first time it's detected. Otherwise it will be called everytime the element is visible.
     */
    function inViewportPartially(elt, handler, onlyFirstTime) {
        var prevVisibility = isElementPartiallyVisible(elt);    //Creates a closure for the handler of this particular event
        //Define a handler to determine possible changes
        function detectPossibleChange() {
            var isVisible = isElementPartiallyVisible(elt);
            if (isVisible != prevVisibility) { //the visibility state of the element has changed
                prevVisibility = isVisible;
                var cancelFurtherEvents = false;
                if (typeof handler == "function")
                    cancelFurtherEvents = handler(isVisible, elt);

                if(cancelFurtherEvents || onlyFirstTime) { //If it's only to be called the first time or if it's cancelled, remove the events after it
                    window.removeEventListener("load", regulatedDetection);
                    window.removeEventListener("resize", regulatedDetection);
                    window.removeEventListener("scroll", regulatedDetection);
                }
            }
        }

        var regulatedDetection = limitCalls(detectPossibleChange, 20);
        //Bind this internal function with the various events that could cause a change in visibility
        window.addEventListener("load", regulatedDetection);
        window.addEventListener("resize", regulatedDetection);
        window.addEventListener("scroll", regulatedDetection);
    }

    /**
     * Defines a handler to be able to automatically detect when a certain element changes visibility on the page. 
     * @param {object} elt - The element whose visibility we are interested in determining
     * @param {function} handler - The function that will be called when the element has changed its visibility state. It receives a boolean to indicate whether it is visible or not, and a reference to the element that has changed its visibility.
     * @param {boolean} onlyFirstTime - If true the handler is called only the first time it's detected. Otherwise it will be called everytime the element is visible.
     */
    function inViewportTotally(elt, handler, onlyFirstTime) {
        var prevVisibility = isElementTotallyVisible(elt);    //Creates a closure for the handler of this particular event
        //Define a handler to determine possible changes
        function detectPossibleChange() {
            var isVisible = isElementTotallyVisible(elt);
            if (isVisible != prevVisibility) { //the visibility state of the element has changed
                prevVisibility = isVisible;
                var cancelFurtherEvents = false;
                if (typeof handler == "function")
                    cancelFurtherEvents =handler(isVisible, elt);
                
                if(cancelFurtherEvents || onlyFirstTime) { //If it's only to be called the first time or if it's cancelled, remove the events after it
                    window.removeEventListener("load", regulatedDetection);
                    window.removeEventListener("resize", regulatedDetection);
                    window.removeEventListener("scroll", regulatedDetection);
                }
            }
        }

        var regulatedDetection = limitCalls(detectPossibleChange, 20);
        //Bind this internal function with the various events that could cause a change in visibility
        window.addEventListener("load", regulatedDetection);
        window.addEventListener("resize", regulatedDetection);
        window.addEventListener("scroll", regulatedDetection);
    }
    
    //Assign the global helper object
    window.visibilityHelper = {
        isElementTotallyVisible: isElementTotallyVisible,
        isElementPartiallyVisible: isElementPartiallyVisible,
        inViewportPartially: inViewportPartially,
        inViewportTotally: inViewportTotally
    };
})();