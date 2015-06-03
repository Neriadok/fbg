/**
 * Clase JS que genera la sensacion de despliegue de elementos.
 * 
 * @param elementoId - Id del elemento que activará el despliegue.
 */
function Desplegable(elementoId){

	/**** CONSTRUCCIÓN DEL OBJETO ****/
	/***VARIABLES DEL OBJETO***/
	
	/**Definimos los elementos desplegables.*/
	var desplegable = document.getElementsByClassName("desplegable"+elementoId);	
	
	/***ASIGNACIÓN DE EVENTOS***/
	document.getElementById(elementoId).onmouseover = desplegar;
	document.getElementById(elementoId).onmouseout = retraer;
	
	
	/**** MÉTODOS PRIVADOS ****/
	
	/**
	 * Método que despliega el elemento dandole display block.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function desplegar(e){
		/**Prevenimos eventos por defecto*/
		e.preventDefault();
		
		/**Mostramos todos los elementos desplegables*/
		for(var i=0;i<desplegable.length;i++){
			desplegable[i].style.display = "block";
		}
	}
	
		
	/**
	 * Método que retrae el elemento dandole display none.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function retraer(e){
		/**Prevenimos eventos por defecto*/
		e.preventDefault();
		
		/**Escondemos todos los elementos desplegables*/
		for(var i=0;i<desplegable.length;i++){
			desplegable[i].style.display = "none";
		}
	}
};