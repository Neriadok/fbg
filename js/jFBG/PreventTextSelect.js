/**
 * Clase que bloquea la selección de texto en una serie de elementos.
 * 
 * @param clasesElementos String Array - Listado de los atributos Class que se deben gestionar. 
 */
function PreventTextSelect(){
	
	/**** CONSTRUCCIÓN DEL OBJETO ****/
	
	/***VARIABLES DEL OBJETO***/
	var clasesElementos = new Array('submit', 'boton', 'finalizarFase', 'actualizarSituacion');
	
	/***ASIGNACIÓN DE EVENTOS***/
	for(var i=0; i<clasesElementos.length; i++){
		//Seleccionamos los elementos que denota
		var elementos = document.getElementsByClassName(clasesElementos[i]);
		
		//Y les asignamos uno por uno la funcion que bloquea la selección de texto
		for(var j=0; j<elementos.length; j++){
			elementos[j].onmousedown = bloquearTexto;
			elementos[j].onselectstart = bloquearTexto;
		}
	}
	
	
	
	/***MÉTODOS PRIVADOS***/
	
	/**
	 * Método que bloquea la selección de texto.
	 * 
	 * @param e Event - Evento que lanzo el método.
	 */
	function bloquearTexto(e){
		console.log("hi =D");
		e.preventDefault();
		return false;
	};
};