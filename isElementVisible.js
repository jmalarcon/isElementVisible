/**
 * @file This library defines an object with four functions to simulate a nonexistent event that allows to detect when any element of the page enters or leaves the visible area of the same.
 * @author José Manuel Alarcón - www.JASoft.org - www.campusMVP.es
 * @version 1.0
 */

(function(){
    
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
     * @returns {boolean} Returns true if there is something (even a little) of the element in the visible area of the page, and returns false if the element disappears completely from the visible area.
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
     * @returns {boolean} Returns true if there is the element is fully visible in the viewport, and returns false if the element disappears (even a little) from the visible area.
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
    
    //Assign the global helper object
    window.visibilityHelper = {
        isElementTotallyVisible: isElementTotallyVisible,
        isElementPartiallyVisible: isElementPartiallyVisible,
        inViewportPartially: inViewportPartially,
        inViewportTotally: inViewportTotally
    };
})();