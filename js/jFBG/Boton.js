/**
 * Clase que concede a un elemento carácteristicas de interactividad.
 * Un boton permite enviar información al servidor sin necesidad de un formulario.
 * 
 * @param ca AsinCronos - Objeto de clase AsinCronos. Será el objeto a través del que lanzaremos la petición asíncrona.
 * @param elementoId String - Id del elemento al que daremos las carácerísticas mencionadas.
 * @param valor String - Dato enviado al servidor de forma asíncrona.
 * @param tipo integer - Tipo de boton, define la variable que contendrá el dato enviado.
 * @param sitioCarga String - Id del elemento en que se cargará la respuesta del servidor.
 */
function Boton(ca, elementoId, valor, tipo, sitioCarga){
	/**** CONSTRUCTOR DEL OBJETO ****/
	/***VARIABLES DEL OBJETO***/
	var pulsado=false;

	
	/***ASIGNACIÓN DE EVENTOS***/
	document.getElementById(elementoId).onclick = pressBoton;
	document.getElementById(elementoId).onmouseover = cEncima;
	document.getElementById(elementoId).onmouseout = cFuera;
	document.getElementById(elementoId).onmousedown = cPulsado;
	
	
	/***MÉTODOS PRIVADOS***/
	
	/**
	 * Método que se lanza cuando se pulsa el boton.
	 * Por defecto no realizaría ninguna acción a fin de no producir errores.
	 * 
	 * @param e Event - Evento que lanzó la función.
	 */
	function pressBoton(e){
		switch(tipo){
			case 1: ir(e); break;
			case 2: ir(e); break;
			default:;
		}
	};
	
	/**
	 * Método que envia los datos al servidor, 
	 * normalmente teniendo como consecuencia el acceder a un nuevo contenido.
	 * 
	 * @param e Event - Evento que lanzó la función.
	 */
	function ir(e){
		/**Prevenimos eventos por defecto*/
		e.preventDefault();

		cSoltar(e);
		
		//Creamos el objeto con los datos
		var datos = new Object();
		
		switch(tipo){
			case 2: datos['newTopic'] = valor; break;
			default: datos['destino'] = valor;
		}
			
		//Lo convertimos a texto
		datos = JSON.stringify(datos);
		
		//Actualizamos los contenidos mediante la conexion asíncrona en función de los datos obtenidos.
		ca.actualizar(datos,sitioCarga);
	};
	
	
	/**
	 * Método que se ejecuta para resaltar que el cursor está sobre el elemento boton. 
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function cEncima(e){
		/**Prevenimos eventos por defecto*/
		e.preventDefault();
		
		if(document.getElementById(elementoId) != null){
			document.getElementById(elementoId).style.borderColor="#F9FF45";
		}
	};
	
	
	/**
	 * Método que se ejecuta para resaltar que el cursor salio del elemento boton.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function cFuera(e){
		/**Prevenimos eventos por defecto*/
		e.preventDefault();

		cSoltar(e);	
		
		if(document.getElementById(elementoId) != null){
			document.getElementById(elementoId).style.borderColor="#CBD126";
		}
	};
	
	
	/**
	 * Método que se ejecuta para resaltar que el cursor está pulsado sobre el elemento boton.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function cPulsado(e){
		/**Prevenimos eventos por defecto*/
		e.preventDefault();
		
		pulsado=true;

		if(document.getElementById(elementoId) != null){
			document.getElementById(elementoId).style.boxShadow="3px 3px 3px grey";
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

			if(document.getElementById(elementoId) != null){
				document.getElementById(elementoId).style.boxShadow="none";
			}
		}
	};
};