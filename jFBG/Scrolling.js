/**
 * Clase que da a un objeto la posibilidad de desplazarnos verticalmente por su contenido.
 * 
 * @param elementoId - Id del elemento.
 */
function Scrolling(scrollingBox){
	
	/***VARIABLES DEL OBJETO***/
	
	/**Altura en que posicionamos el objeto al inicio.*/
	var y=0;
	
	/**Variable de tipo interruptor que indica si estamos o no posicionados encima del elemento.*/
	var objetivo=false;
	var endEstaPulsado=false;
	var beginEstaPulsado=false;
	
	
	
	/***ASIGNACIÓN DE EVENTOS***/
	scrollingBox.onmouseover = encima;
	scrollingBox.onmouseout = fuera;
	scrollingBox.onmousewheel = scrollRoll;
	document.addEventListener('DOMMouseScroll', scrollRoll);
	
		
	/**Podemos añadir elementos de control de movimiento**/
	/**Botones para ir al comienzo o al final**/
	if(document.getElementById(scrollingBox.id+"End") != null){
		document.getElementById(scrollingBox.id+"End").onmouseover = cEncima;
		document.getElementById(scrollingBox.id+"End").onmouseout = cFuera;
		document.getElementById(scrollingBox.id+"End").onmousedown = endPulsado;
		document.getElementById(scrollingBox.id+"End").onclick = goEnd;
	}
	
	if(document.getElementById(scrollingBox.id+"Begin") != null){
		document.getElementById(scrollingBox.id+"Begin").onmouseover = cEncima;
		document.getElementById(scrollingBox.id+"Begin").onmouseout = cFuera;
		document.getElementById(scrollingBox.id+"Begin").onmousedown = beginPulsado;
		document.getElementById(scrollingBox.id+"Begin").onclick = goBegin;
	}
	
	/**Barra de desplazamiento**/
	var moving = null;
	var up = null;
	var bar = null;
	var down = null;
	var barSelected = false;
	var barMoveBegin = 0;
	//En caso de que el scrolling box incluya una barra de desplazamiento "Moving"
	if(document.getElementById(scrollingBox.id+"Moving") != null){
		//Dimensionamos y posicionamos la barra en función del propio scrolling.
		moving = document.getElementById(scrollingBox.id+"Moving");
		
		//Declaramos, posicionamos y asignamos el control de eventos a los elementos del scrollingBoxMoving
		up = document.getElementById(scrollingBox.id+"MovingUp");
		up.onmousedown = clickMover;
		
		bar = document.getElementById(scrollingBox.id+"MovingBar");
		bar.onmousedown = barPulsada;
		document.onmouseup = barSoltar;
		bar.onmousemove = barMover;
		
		down = document.getElementById(scrollingBox.id+"MovingDown");
		down.onmousedown = clickMover;
	}
	
	
		
	/***MÉTODOS Y FUNCIONES***/
	
	/**
	 * Método que se lanza cuando el cursor está sobre el elemento scrolling.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function encima(e){
		/**Prevenimos eventos por defecto*/
		e.preventDefault();
		
		objetivo=true;
	};
	
	
	/**
	 * Método que se lanza cuando el cursor sale del elemento scrolling.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function fuera(e){
		e.preventDefault();
		
		objetivo=false;
	};
	
	
	/**
	 * Método que evalua que el cursor se encuentra sobre un boton de control.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function cEncima(e){
		/**Prevenimos eventos por defecto*/
		e.preventDefault();
		
		e.target.style.borderColor="#F9FF45";
	};
	
	
	/**
	 * Método que se lanza cuando el cursor sale de un boton de control.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function cFuera(e){
		/**Prevenimos eventos por defecto*/
		e.preventDefault();

		cSoltar(e);	
		
		e.target.style.borderColor="#CBD126";
	};
	
	
	/**
	 * Método que se lanza cuando se deja de pulsar el cursor sobre un boton de control.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function cSoltar(e){
		if(endEstaPulsado){
			endEstaPulsado = false;

			document.getElementById(scrollingBox.id+"End").style.boxShadow="none";
		}
		
		if(beginEstaPulsado){
			beginEstaPulsado = false;

			document.getElementById(scrollingBox.id+"Begin").style.boxShadow="none";
		}
	};
	
	/**
	 * Método que se lanza cuando el cursor está pulsado sobre el boton de control que nos lleva al final del scrolling.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function endPulsado(e){
		/**Prevenimos eventos por defecto*/
		e.preventDefault();
		
		endEstaPulsado=true;
		
		document.getElementById(scrollingBox.id+"End").style.boxShadow="3px 3px 3px grey";
	};
	
		
	/**
	 * Método que se lanza cuando el cursor está pulsado sobre el boton de control que nos lleva al comienzo del scrolling.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function beginPulsado(e){
		/**Prevenimos eventos por defecto*/
		e.preventDefault();
		
		beginEstaPulsado=true;

		document.getElementById(scrollingBox.id+"Begin").style.boxShadow="3px 3px 3px grey";
	};
	
	
	/**
	 * Método que evalua que el cursor está pulsado sobre la barra de desplazamiento del scrolling.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function barPulsada(e){
		/**Prevenimos eventos por defecto*/
		e.preventDefault();
		
		barSelected = true;
		barMoveBegin = e.screenY;
	};
	
	
	/**
	 * Método que evalua que el cursor deja de estar pulsado sobre la barra de desplazamiento del scrolling.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function barSoltar(e){
		/**Prevenimos eventos por defecto*/
		e.preventDefault();
		
		barSelected = false;
	};
	
	/**
	 * Método que evalua que el cursor se está moviendo sobre la barra de desplazamiento del scrolling.
	 * El cursor y la pantalla tienen un margen de error con respecto a las coordenadas,
	 * esto causa un pequeño fallo independiente del codigo.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function barMover(e){
		/**Prevenimos eventos por defecto*/
		e.preventDefault();
		
		//Regla de tres
		//movimiento/movingBar = margen/tamaño
		var proporcionContenido = (scrollingBox.offsetHeight-55)/(document.getElementById(scrollingBox.id+"Content").offsetHeight-scrollingBox.offsetHeight);
		
		if(barSelected){
			mover((e.screenY-barMoveBegin)*proporcionContenido);
		}
	};
	
		
	/**
	 * Funcion que desplaza la barra de desplazamiento en función de nuestra posición en el scrolling.
	 */
	function barDesplazar(){
		//El tamaño del contenido es igual a su offsetHeight
		var contenidoSize = (document.getElementById(scrollingBox.id+"Content").offsetHeight-scrollingBox.offsetHeight);
		//Tamaño de la barra de desplazamiento menos el tamaño de los botones y la barra
		var movingSize = document.getElementById(scrollingBox.id+"Moving").offsetHeight-72;
		
		//La posicion en porcentaje será igual a su offsetTop entre el tamaño del contenido, todo ello multiplicado por 100
		var contenidoPosition = -parseInt(document.getElementById(scrollingBox.id+"Content").style.marginTop)/contenidoSize;
				
		//Si la posicion es superior al 100% no la desplazamos.
		if(contenidoSize>0){
			var posicion = movingSize*contenidoPosition;
			if(posicion<0)posicion=0;
			if(posicion>movingSize)posicion=movingSize;
			
			bar.style.marginTop = posicion+"px";
		}
	};

	
	/**
	 * Función que nos posiciona en el final del scrolling.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function goEnd(e){
		/**Prevenimos eventos por defecto*/
		e.preventDefault();
		
		/**Definimos la altura en el m�nimo posible.**/
		y = scrollingBox.offsetHeight-10-document.getElementById(scrollingBox.id+"Content").offsetHeight;
			
		/**Establecemos la nueva altura, es necesario a�adir el sufijo px al modificarla.*/
		document.getElementById(scrollingBox.id+"Content").style.marginTop = y+"px";

		if(bar != null){
			barDesplazar();
		}
		/**Soltamos el boton**/
		cSoltar(e);
	}

	
	/**
	 * Método que nos posiciona en el comienzo del scrolling.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function goBegin(e){
		/**Prevenimos eventos por defecto*/
		e.preventDefault();
		
		/**Definimos la altura en el m�ximo posible**/
		y = 10;
			
		/**Establecemos la nueva altura, es necesario a�adir el sufijo px al modificarla.*/
		document.getElementById(scrollingBox.id+"Content").style.marginTop = y+"px";

		if(bar != null){
			barDesplazar();
		}
		/**Soltamos el boton**/
		cSoltar(e);
	}
	
	
	/**
	 * Método que evalua cuanto hemos accionado el scroll del raton a fin de definir el desplazamiento realizado.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function scrollRoll(e){

		/**Verificamos que nos encontramos encima del elemento.*/
		if(objetivo){
			/**Prevenimos eventos por defecto*/
			e.preventDefault();
			
			/**Verificiamos que el contenido del elemento se sale de la scrollingbox.*/
			if(document.getElementById(scrollingBox.id+"Content").offsetHeight > scrollingBox.offsetHeight-10){
				
				var rolled=0;
			
				/**El evento Scroll se comporta de manera diferente según el navegador.*/
				/** FireFox*/
				if ('detail' in e) {
					rolled += Math.round(e.detail/3);
				}
				/** Chrome*/
				if ('deltaY' in e) {
					rolled += Math.round(e.deltaY/100);
				}
			
				/**Modificamos la altura del elemento en funcion de cuanto scroll hayamos efectuado.*/
				mover(rolled*10);
			}
		}
	};
	
	/**
	 * Método que evalua cuanto desplazamos el scroll en función del boton de la barra de desplazamiento que pulsamos.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function clickMover(e){
		e.preventDefault();
		if(e.target.id == scrollingBox.id+"MovingUp"){
			mover(-20);
		}
		else{
			mover(20);
		}
		
	};
	
	
	/**
	 * Método que mueve el contenido del scroll una cantidad de pixeles dada.
	 * 
	 * @param desplazamiento integer - Número de pixeles que desplazamos el scroll.
	 */
	function mover(desplazamiento){
		y -= desplazamiento;
			
		/**Si queremos subir demasiado bloqueamos la altura.*/
		if(y > 10) y = 10;
		
		/**Hacemos lo mismo si quisieramos bajar demasiado.*/
		if(y < scrollingBox.offsetHeight-10-document.getElementById(scrollingBox.id+"Content").offsetHeight) y = scrollingBox.offsetHeight-10-document.getElementById(scrollingBox.id+"Content").offsetHeight;
	
		/**Establecemos la nueva altura, es necesario añadir el sufijo px al modificarla.*/
		document.getElementById(scrollingBox.id+"Content").style.marginTop = y+"px";
		
		if(bar != null){
			barDesplazar();
		}
	};
};