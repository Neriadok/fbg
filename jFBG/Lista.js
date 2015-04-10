/**
 * Clase que evalua que las unidades de una lista de ejercito estén correctamente nombradas
 * y que calcula los puntos totales de la lista.
 * 
 * Tras la implementacion de AJAX, el evento "onsubmit" no puede ser lanzado,
 * pese a ello no interfiere en el codigo y podría ser util en futuras versiones.
 * 
 * @param form Element - Formulario de la lista.
 * @param cajadatos Element - Elemento en que se mostrará la puntuación.
 * @param claseElementos String - Atributo Class de los inputs que contienen la puntuación de una tropa.
 * @param claseNombreTropas String - Atributo Class de los inputs que contienen el nombre de una tropa.
 */
function Lista(form,cajadatos,claseElementos,claseNombreTropas){
	/**** CONSTRUCTOR DEL OBJETO ****/
	/***ASIGNACIÓN DE EVENTOS***/
	form.onchange = cambios;
	form.onsubmit = cambios;
		
		
	
	/***MÉTODOS PRIVADOS***/

	/**
	 * Método que se ejecuta cuando se produce un cambio en la lista.
	 * Tiene como objetivo establecer la puntuacion de la lista.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function cambios(e){
		var elementos = document.getElementsByClassName(claseElementos);
		var nombreTropa = document.getElementsByClassName(claseNombreTropas);
		
		var sumaPts = 0;
		
		//Verificamos todos los elementos de la lista.
		for(var i=0;i<elementos.length;i++){
			//Solo evaluamos aquellos de los que se ha indicado nombre, los demas se ignoran.
			if(nombreTropa[i].value != ""){
				//Si la puntuacion no es un número o esta vacía, sustituimos el valor por el texto "Error"
				if(isNaN(elementos[i].value) || elementos[i].value == ""){
					elementos[i].value = "Error";
				}
				//Si todo es correcto, aumentamos la puntuacion.
				else{
					sumaPts += parseInt(elementos[i].value);
				}
			}
		}
		cajadatos.innerHTML = sumaPts;
	};
}