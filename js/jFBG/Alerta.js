/**
 * Clase que permite cerrar un elemento emergente definido en la web como "Alerta".
 * NO ESTÁ RELACIONADO A LA FUNCIÓN ALERT.
 * 
 * En algunos documentos, si se disparan varias alertas, al ser envueltas en el mismo objeto, solo se podrá cerrar la última.
 * Este "bug" no interfiere con el funcionamiento normal de la web y solucionarlo requiere un esfuerzo innecesario 
 * en relación al resultado que se obtendría.
 * 
 * @param alertaId String - id del elemento "Alerta".
 */
function Alerta(alertaId){
	/**** CONSTRUCCIÓN DEL OBJETO ****/
	
	/***ASIGNACIÓN DE EVENTOS***/
	document.getElementById(alertaId).ondblclick = cerrar;
	
	
	/***MÉTODOS PRIVADOS***/
	
	/**
	 * Método que se dispara tras hacer doble click sobre el elemento alerta.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function cerrar(e){
			document.getElementById(alertaId).style.display = "none";
	};
};