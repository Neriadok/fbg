/**
 * Clase que nos transforma un elemento en una "ventana" desplazable dentro de sitio.
 * 
 * @param ventanaId String - Id del elemento que queremos transformar en ventana.
 */
function Ventana(ventanaId){
	/**** CONSTRUCIÓN DEL OBJETO ****/
	/***VARIABLES DEL OBJETO***/
	var activa = false;
	var desplegada = false;

	
	/***ASIGNACIÓN DE EVENTOS***/
	document.getElementById(ventanaId+"Boton").onclick = boton;
	document.getElementById(ventanaId+"Boton").onmouseover = cEncima;
	document.getElementById(ventanaId+"Boton").onmouseout = cFuera;
	document.getElementById(ventanaId+"Selector").onmousedown = cPulsar;
	document.getElementById(ventanaId+"Selector").onmouseup = cSoltar;
	document.getElementById(ventanaId+"Selector").onmousemove = cMover;
	document.getElementById(ventanaId+"Selector").ondblclick = boton;
	
	
	/***MÉTODOS Y FUNCIONES***/
	
	/**
	 * Método que evalua que se pulso el cursor sobre el selector de la ventana.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function cPulsar(e){
		//Prevenimos los efectos por defecto del evento.
		e.preventDefault();
		
		if(!activa){
			activa=true;
		}
	};
	
		
	/**
	 * Método que verifica que estamos moviendo el cursor sobre el selector del elemento.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function cMover(e){
		//Prevenimos los efectos por defecto del evento.
		e.preventDefault();
		
		if(activa){
			document.getElementById(ventanaId).style.top=(e.pageY-20)+"px";
			document.getElementById(ventanaId).style.left=(e.pageX-document.getElementById(ventanaId).offsetWidth/2)+"px";
		}
	};
	
		
	/**
	 * Método que se dispara cuando el cursor deja de estar pulsado sobre el selector del elemento.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function cSoltar(e){
		//Prevenimos los efectos por defecto del evento.
		e.preventDefault();
		
		if(activa){
			activa=false;
		}
	};
	
		
	/**
	 * Método que despliega o contrae la ventana emergente.
	 * Haciendo doble click sobre el selector de la ventana esta se contrae.
	 * Esta asociado a un elemento que nos hace las veces de "interruptor".
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function boton(e){
		if(desplegada){
			document.getElementById(ventanaId+"Boton").style.boxShadow="none";
			document.getElementById(ventanaId).style.display = "none";
			desplegada=false;
		}
		else{
			document.getElementById(ventanaId+"Boton").style.boxShadow="3px 3px 3px grey";
			document.getElementById(ventanaId).style.display = "block";
			desplegada=true;
		}
	};
	
	
	/**
	 * Método que evalua que el cursor se encuentra sobre el boton interruptor.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function cEncima(e){
		/**Prevenimos eventos por defecto*/
		e.preventDefault();
		
		document.getElementById(ventanaId+"Boton").style.borderColor="#F9FF45";
	};

	
	/**
	 * Método que evalua que el cursor salio del boton interruptor.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function cFuera(e){
		/**Prevenimos eventos por defecto*/
		e.preventDefault();

		cSoltar(e);	
	
		document.getElementById(ventanaId+"Boton").style.borderColor="#CBD126";
	};
};