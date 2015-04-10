/**
 * Clase que realiza una peticion al servidor a fin de cambiar el contenido principal de la página.
 * Esta clase es similar a la clase Boton, en versiones futuras quizá se unifiquen.
 * A diferencia de la clase boton
 * 
 * @param ca AsinCronos - Objeto de clase AsinCronos. Será el objeto a través del que lanzaremos la petición asíncrona.
 * @param elementoId String - Id del elemento al que daremos las carácerísticas mencionadas.
 * @param tipo integer - Tipo de boton, define las animacinones con que se interactua.
 * @param tipoDestino integer - Define la variable en que se envia el destino, el valor es el ID del propio elemento.
 * @param sitioCarga String - Id del elemento en que se cargará la respuesta del servidor.
 */
function Destino(ca,elementoId,tipo,tipoDestino,sitioCarga){
	/**** CONSTRUCTOR DEL OBJETO ****/
	/***VARIABLES DEL OBJETO***/
	var pulsado=false;

	
	
	
	/***ASIGNACIÓN DE EVENTOS***/
	document.getElementById(elementoId).onclick = ir;
	document.getElementById(elementoId).onmouseover = cEncima;
	document.getElementById(elementoId).onmouseout = cFuera;
	document.getElementById(elementoId).onmousedown = cPulsado;
	
	
	/**** MÉTODOS PRIVADOS ****/
	
	/**
	 * Método que envia los datos al servidor para emular el cambio de página en el sitio.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function ir(e){
		/**Prevenimos eventos por defecto*/
		e.preventDefault();

		//Creamos el objeto con los datos
		var datos = new Object();
	
		datos[tipoDestino] = elementoId;
		
		//Lo convertimos a texto
		datos = JSON.stringify(datos);

		//Actualizamos los contenidos mediante la conexion asíncrona en función de los datos obtenidos.
		ca.actualizar(datos,sitioCarga);
	};

		
	/**
	 * Método que se ejecuta para resaltar que el cursor está sobre el elemento destino. 
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function cEncima(e){
		/**Prevenimos eventos por defecto*/
		e.preventDefault();
		
		switch(tipo){
			case 1: e.target.style.border="2px solid #F9FF45"; break;
			case 2: document.getElementById(elementoId).style.textShadow="2px 2px 2px #CBD126"; break;
			default:;
		}
	};

		
	/**
	 * Método que se ejecuta para resaltar que el cursor salio del elemento destino.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function cFuera(e){
		/**Prevenimos eventos por defecto*/
		e.preventDefault();
		
		cSoltar(e);	
		
		switch(tipo){
			case 1: e.target.style.border="2px solid "+e.target.style.background; break;
			case 2: document.getElementById(elementoId).style.color="white";
				document.getElementById(elementoId).style.textShadow="none"; 
				break;
			default:;
		}
	};

	
	/**
	 * Método que se ejecuta para resaltar que el cursor está pulsado sobre el elemento destino.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function cPulsado(e){
		/**Prevenimos eventos por defecto*/
		e.preventDefault();
	
		pulsado=true;
		
		switch(tipo){
			case 1: e.target.style.boxShadow="2px 2px 2px black"; break;
			case 2: document.getElementById(elementoId).style.color="#F9FF45"; break;
			default:;
		}
	};

		
	/**
	 * Método que se ejecuta para resaltar que el cursor dejo de estar pulsado sobre el elemento boton.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function cSoltar(e){
		if(pulsado){
			pulsado = false;
			
			switch(tipo){
				case 1: e.target.style.boxShadow="none"; break;
				case 2: document.getElementById(elementoId).style.color="white";
					document.getElementById(elementoId).style.textShadow="none";
					break;
				default:;
			}
		}
	};
};