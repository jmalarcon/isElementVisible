/**
 * @file Esta biblioteca define cuatro funciones globales para simular un evento inexistente que permite detectar cuando un elemento cualquiera de la página entra o sale del área visible de la misma.
 * @author José Manuel Alarcón - www.JASoft.org - www.campusMVP.es
 * @version 1.0
 * @tutorial http://www.jasoft.org/Blog/post/Detectar-la-aparicion-y-desaparicion-de-un-elemento-evento-inViewport.aspx
 */

/**
 * Determina si el elemento que se le pasa como parámetro está completamente visible en la ventana del navegador o no.
 * @param {object} elto - El elemento cuya visibilidad nos interesa determinar
 * @returns {boolean} true si el elemento está visible por completo, false si no lo está
 */
function isElementTotallyVisible(elto) {
    var anchoViewport = window.innerWidth || document.documentElement.clientWidth;
    var alturaViewport = window.innerHeight || document.documentElement.clientHeight;
    //Posición de la caja del elemento
    var caja = elto.getBoundingClientRect();
    return ( caja.top >= 0 && 
             caja.bottom <= alturaViewport &&
             caja.left >= 0 &&
             caja.right <= anchoViewport );
}

/**
 * Determina si el elemento que se le pasa como parámetro está visiblea aunque sea parcialmente en la ventana del navegador o no.
 * @param {object} elto - El elemento cuya visibilidad nos interesa determinar
 * @returns {boolean} true si el elemento está visible aunque sea parcialmente, false si no lo está
 */
function isElementPartiallyVisible(elto) {
    var anchoViewport = window.innerWidth || document.documentElement.clientWidth;
    var alturaViewport = window.innerHeight || document.documentElement.clientHeight;
    //Posición de la caja del elemento
    var caja = elto.getBoundingClientRect();
    var cajaDentroH = (caja.left >= 0 && caja.left <= anchoViewport) ||
                      (caja.right >= 0 && caja.right <= anchoViewport);
    var cajaDentroV = (caja.top >= 0 && caja.top <= alturaViewport) ||  
                      (caja.bottom>= 0 && caja.bottom <= alturaViewport);  
    return (cajaDentroH && cajaDentroV);
}

/**
 * Define un manejador para poder detectar automáticamente cuando un determinado elemento cambia de visibilidad en la página. Esta versión considera que el elemento es visible si cualquier parte del mismo está en el área visible de la página.
 * @param {object} elto - El elemento cuya visibilidad nos interesa determinar
 * @param {function} handler - La función a la que se llamará para determinar que el elemento ha cambiado su estado de visibilidad. Se le pasa un booleano para indicar si es o no visible, y una referencia al elemento que ha cambiado la visibilidad.
 * @returns {boolean} Devuelve true si hay algo (por poco que sea) del elemento en el área visible de la página, y devuelve false si el elemento desaparece por completo del área visible.
 */
function inViewportPartially(elto, handler) {
    var anteriorVisibilidad = isElementPartiallyVisible(elto);    //crea una clausura para el manejador de este evento concreto
    //Defino un manejador para determinar posibles cambios
    function detectarPosibleCambio() {
        var esVisible = isElementPartiallyVisible(elto);
        if (esVisible != anteriorVisibilidad) { //ha cambiado el estado de visibilidad del elemento
            anteriorVisibilidad = esVisible;
            if (typeof handler == "function")
                handler(esVisible, elto);
        }
    }
    //Asocio esta función interna a los diversos eventos que podrían producir un cambio en la visibilidad
    window.addEventListener("load", detectarPosibleCambio);
    window.addEventListener("resize", detectarPosibleCambio);
    window.addEventListener("scroll", detectarPosibleCambio);
}

/**
 * Define un manejador para poder detectar automáticamente cuando un determinado elemento cambia de visibilidad en la página.
 * @param {object} elto - El elemento cuya visibilidad nos interesa determinar
 * @param {function} handler - La función a la que se llamará para determinar que el elemento ha cambiado su estado de visibilidad. Se le pasa un booleano para indicar si es o no visible, y una referencia al elemento que ha cambiado la visibilidad.
 * @returns {boolean} Devuelve true si el elemento completo está en el área visible de la página, y devuelve false si cualquier parte del mismo (por pequeña que sea)desaparece del área visible.
 */
function inViewportTotally(elto, handler) {
    var anteriorVisibilidad = isElementTotallyVisible(elto);    //crea una clausura para el manejador de este evento concreto
    //Defino un manejador para determinar posibles cambios
    function detectarPosibleCambio() {
        var esVisible = isElementTotallyVisible(elto);
        if (esVisible != anteriorVisibilidad) { //ha cambiado el estado de visibilidad del elemento
            anteriorVisibilidad = esVisible;
            if (typeof handler == "function")
                handler(esVisible, elto);
        }
    }
    //Asocio esta función interna a los diversos eventos que podrían producir un cambio en la visibilidad
    window.addEventListener("load", detectarPosibleCambio);
    window.addEventListener("resize", detectarPosibleCambio);
    window.addEventListener("scroll", detectarPosibleCambio);
}