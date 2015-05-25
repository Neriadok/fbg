/**
 * Clase que nos genera "objetos" de la clase partida.
 *
 * Una partida consta de una serie de eventos sucedidos a lo largo
 * de un batalla y en diversas fases.
 *
 * La batalla, representada por un lienzo canvas (de HTML5), 
 * es la representacion visual del escenario sobre el que disponemos 
 * una situacion, representada por un contexto de ese canvas, 
 * esa situacion es la representacion de las unidades ("soldaditos")
 * que estaran dispuestas sobre el batalla.
 * 
 * Para interactuar con ese contexto y esas unidades
 * usamos metodos que detecten eventos del cursor dentro del elemento canvas.
 * 
 * @param batallaId String - Id del elemento canvas con que interactuamos. 
 * @param terrenoId String - Imagen del entorno en que se libra la batalla, por ahora meramente decorativa. 
 * @param panelIn String - Id del panel en que se encuentran los datos de las unidades. 
 * @param panelOut String - Id del panel en que se muestran mensajes para el usuario. 
 * @param panelFase String - Id del panel con que el usuario se comunica con la situación. 
 * @author Daniel Martín Díaz
 * @version 1.5 (10/04/2015)
 */
function Partida(ejercitoId, batallaId, terrenoId, panelIn, panelOut, panelFase, caPartida, caPanel){
	
	/**** CONSTRUCTOR DEL OBJETO ****/
	
	/***VARIABLES Y CONSTANTES***/
	/**Constantes de juego.*/ 
	var CAMPO_ALTO = 2400;
	var CAMPO_ANCHO = 4000;
	var LONGITUD_CLICK = 500;
	var pantallaWidth = document.getElementById("game").offsetWidth; 
	var pantallaHeight = document.getElementById("game").offsetHeight; 
	
	/**Posicion de la camara.*/
	var camaraX = 0;
	var camaraY = 0;
	var minZoom = 0.25;
	var maxZoom = 1.5;
	var zoom = minZoom;
	
	/**Elementos de juego.*/
	var batalla = document.getElementById(batallaId);
	var terreno = document.getElementById(terrenoId);
	var situacion = batalla.getContext("2d");
	
	/**Variables de estado de juego.*/
	var cursorDentro = false;
	var cursorPulsado = false;
	var zoomTopLimit = false;
	var inicioClick = 0;
	var posicionInicioClick = Array[0,0];
	var clickEnTropa = false;
	
	/**Variables de juego.*/
	var userOrder;
	var fase;
	var tropaSeleccionadaId = -1;
	var tropaSeleccionadaPreviaId = -1;
	var fichaTropa;
	var fichaTropaEnemiga;
	var tropa = [];
	
	/**Metodos ejecutados al inicio:*/
	//Creamos un ciclo de comprobación de 200 ms para verificar si la partida se ha cargado o no.
	var cicloComprobar = setInterval(
			//Función que se realiza
			function (){
				if(caPartida.check()){
					console.log("Datos actualizados.");
					/**
					 * Una vez se ha actualizado los datos básicos de la partida tenemos que:
					 * 1º actualizar la situación de la partida (con los datos nuevos).
					 * 2º actualizar el panelin ya que habra que verificar los datos concretos de la situacion.
					 */
					actualizarSituacion();
					actualizarPanelIn();
				}
				else if(caPanel.check()){
					actualizarSituacion();
					actualizarElementos();
				}
			}
			//Ciclo de repetición en milisegundos
			,100
	);

	situacionConstruir();
	obtenerSituacion();
	
		
	/***ASIGNACIÓN DE EVENTOS***/
	document.getElementById(batallaId).onmouseenter = cursorEntrada;
	document.getElementById(batallaId).onmouseleave = cursorSalida;
	document.getElementById(batallaId).onmousemove = cursorMover;
	document.getElementById(batallaId).onmousedown = cursorPulsar;
	document.getElementById(batallaId).onmouseup = cursorSoltar;
	document.getElementById(batallaId).ondblclick = cursorDobleClick;
	document.onmousewheel = scrollRoll;
	document.addEventListener('DOMMouseScroll', scrollRoll);
	document.getElementById(panelIn).onchange = panelInActualizado;
	
	
	/**METODOS DE MANTENIMIENTO Y CONSTRUCCI�N*/
	/**
	 * Método que actualiza los datos actuales de la partida.
	 * Estos son necesarios para poder identificar las tablas
	 * que en conjunto representan la situación de la partida.
	 */
	function obtenerSituacion(e){
		if(e != null) e.preventDefault();
		/**
		 * Para obtener la situacióna ctual de la partida tenemos,
		 * en primer lugar, que detectar cual es la ultima fase y algunos otros datos.
		 * Para ello enviamos la variable Partida Id que en la base de datos representa el ejército,
		 * es decir, la vision del usuario de la partida (Ya que esta no es igual para su adversario).
		 */
		var datosPartida = new Object();
		
		datosPartida.ejercito = ejercitoId;
		
		//Lo convertimos a texto
		datosPartida = JSON.stringify(datosPartida);
		console.log(datosPartida);
		
		//Actualizamos los contenidos mediante la conexion asíncrona en función de los datos obtenidos.
		caPartida.actualizar(datosPartida,'datos');
	};
	

	/**
	 * Método que extráe de base de datos los datos necesarios para representar la situación
	 * Estos se cargan en panelin, que es la entrada de datos para la situación.
	 */
	function actualizarPanelIn(){
		/** Limpiamos el elemento que nos muestra datos de nuestra seleccion actual */
		document.getElementById("datosSeleccion").innerHTML = "";
		
		/**
		 * Para obtener la situacióna ctual de la partida tenemos,
		 * En primer lugar, que detectar cual es la ultima fase y algunos otros datos;
		 * En segundo lugar, obtenemos la situación de todas las tropas y unidades de la fase.
		 */
		var datosPartida = new Object();
		
		//Comprobamos si el jugador ha elegido una lista de ejercito
		if(document.getElementById("ejercitoNombre").innerHTML == ""){
			datosPartida.elegirListaPts = document.getElementById("pts").value;
		}
		//Procedemos a obtener la situacion de la partida
		else{
			datosPartida.situacionPartida = document.getElementById("partidaId").value;
			datosPartida.situacionEjercito = ejercitoId;
			datosPartida.fase = document.getElementById("faseId").value;
		}
		
		//Lo convertimos a texto
		datosPartida = JSON.stringify(datosPartida);
		console.log(datosPartida);
		
		//Actualizamos los contenidos mediante la conexion asíncrona en función de los datos obtenidos.
		caPanel.actualizar(datosPartida,panelIn);
		
		console.log("Panel In actualizado.");
	};
	
	
	/**
	 * Método que actualiza los elementos de la página tras alguna actualización asíncrona.
	 */
	function actualizarElementos(){

    	/**Prevenimos la selección de texto*/
    	var preventTextSelect = new PreventTextSelect();
		
		/**Generamos los objetos ventana si los hubiese.**/
    	var ventanas = document.getElementsByClassName("ventana");

    	if(ventanas != null){
    		for(var i=0;i<ventanas.length;i++){
    			ventanas[i] = new Ventana(ventanas[i].id);
			}
    	}
    	

		/**Si existiesen elementos de clase scrollingBox, generariamos objetos Scrolling para un movimiento dinámico**/
		var scrollings = document.getElementsByClassName("scrollingBox");

    	if(scrollings != null){
        	for(var i=0; i<scrollings.length; i++){
        		scrollings[i] = new Scrolling(scrollings[i]);
    		}
		}
    	
    	/**Si existiesen elementos de la clase lista, generariamos los objetos mostrarMensaje para seleccionarlas*/
    	var listas = document.getElementsByClassName("lista");
    	
    	if(listas != null){
    		MostrarMensaje("lista",document.getElementById("datosSeleccion"),3,caPartida);
    	}
    	
    	if(fichaTropa != null){
    		for(var i=0; i<fichaTropa.length; i++){
    			/**
    			 * Cuando hagamos click en algun selector, se mostrará dicha tropa.
    			 */
    			document.getElementById("selector"+fichaTropa[0].id).onclick = seleccionarEnPanel;

    			/**
    			 * Metemos ocultas todas las fichas de tropa enemigas en los datos de selección.
    			 * Cada vez que realizamos esta acción, la tropa en cuestion se reposiciona al final del array
    			 * y la siguiente ocupara la posición 0, de modo que siempre tratamos la tropa 0.
    			 */
    			document.getElementById("datosSeleccion").appendChild(fichaTropa[0]);
    		}
    	}
    	if(fichaTropaEnemiga != null){
    		for(var i=0; i<fichaTropaEnemiga.length ; i++){
        		for(var i=0; i<fichaTropaEnemiga.length; i++){
        			/**
        			 * Cuando hagamos click en algun selector, se mostrará dicha tropa.
        			 */
        			document.getElementById("selector"+fichaTropaEnemiga[0].id).onclick = seleccionarEnPanel;

        			/**
        			 * Metemos ocultas todas las fichas de tropa enemigas en los datos de selección.
        			 * Cada vez que realizamos esta acción, la tropa en cuestion se reposiciona al final del array
        			 * y la siguiente ocupara la posición 0, de modo que siempre tratamos la tropa 0.
        			 */
        			document.getElementById("datosSeleccion").appendChild(fichaTropaEnemiga[0]);
        		}
    		}
    	}
    	
		tropasIniciar();
		situacionConstruir();
		console.log("Elementos actualizados.");
		comprobarSituacion();
	};
	
	
	/**
	 * Método que actualiza la situación.
	 * 
	 */
	function actualizarSituacion(){
		
		//Actualizar variables
		userOrder = document.getElementById("userorder").innerHTML;
		fase = document.getElementById("ordenFase").value;
		tropaSeleccionadaId = -1;
		tropaSeleccionadaPreviaId = -1;
		fichaTropa = document.getElementsByClassName("tropapropia");
		fichaTropaEnemiga = document.getElementsByClassName("tropaenemiga");
		document.getElementById(panelOut).innerHTML = "<div class='enfasis'>FANTASY BATTLE GAMES</div>";
		console.log("Situacion actualizada.");
    	
		/**Comprobamos si existe un boton para finalizar fase.**/
		if(document.getElementById("finalizarFase") != null){
			document.getElementById("finalizarFase").ondblclick = finalizarFase;
		}
		/**Comprobamos si existe un boton para finalizar fase.**/
		if(document.getElementById("actualizarSituacion") != null){
			document.getElementById("actualizarSituacion").ondblclick = obtenerSituacion;
		}
	};
	
	/**
	 * Método que evalua si se pueden realizar acciones en esta fase,
	 * realiza las acciones automáticas
	 * y finaliza la fase de forma automática si fuera necesario.
	 */
	function comprobarSituacion(){
		var finalizar = true;

		
		if(document.getElementById("finalizarFase") != null){
			switch(fase){
			
				//Solo se necesitará reacionar ante cargas si ha habido cargas.
				case "2":
					for(var i=0; i<tropa.length; i++){
						if(tropa[i].getUser() && tropa[i].getEstado() == "Bajo carga"){
							finalizar = false;
						}
					}
					break;
					
				//Solo se combatirá si hay tropas en combate.
				case "4":
					for(var i=0; i<tropa.length; i++){
						if(tropa[i].getUser() && tropa[i].getEstado() == "En combate"){
							finalizar = false;
						}
					}
					break;
					
				//Solo se necesitara resolver combates si alguna tropa esta derrotada.
				case "5":
					for(var i=0; i<tropa.length; i++){
						if(tropa[i].getUser() && tropa[i].getEstado() == "Derrotada"){
							finalizar = false;
						}
					}
					break;
					
				default: finalizar = false;
			}
			
			if(finalizar){
				finalizarFase(null);
			}
		}
	};
	
	
	/**
	 * Método que finaliza una fase y registra los cambios en la base de datos.
	 */
	function finalizarFase(e){
		if(e != null) e.preventDefault();
		
		
		var viable = true;
		switch(fase){
			/**
			 * Si estamos en la fase de despliegue no deberemos poder finalizarla hasta haber desplegado todas las tropas.
			 */
			case "0":
				for(var i=0; i<tropa.length; i++){
					if(!tropa[i].getEnCampo()){
						viable = false;
					}
				}
				break;
			
			/**
			 * En caso de que alguna tropa siga bajo carga no se podrá finalizar la fase de reaccion de cargas.
			 */
			case "2":
				for(var i=0; i<tropa.length; i++){
					if(tropa[i].getUser() && tropa[i].getEstado() == "Bajo carga"){
						viable = false;
					}
				}
				break;
			default:
		}
				
		
		if(viable){
			document.getElementById(panelOut).innerHTML = "<div class='enfasis'>Finalizando fase</div>";
			
			var datosSituacion = registroSituacion();
			
			//Lo convertimos a texto
			datosSituacion = JSON.stringify(datosSituacion);
			console.log(datosSituacion);
			
			//Actualizamos los contenidos mediante la conexion asíncrona en función de los datos obtenidos.
			caPartida.actualizar(datosSituacion,'datos');
			
			console.log("Finalizando fase");
		}
		else{
			switch(fase){
				case "0":
					document.getElementById(panelOut).innerHTML = "<div class='error'>NO SE PUEDE FINALIZAR LA FASE<br/>Has de desplegar todas las tropas.</div>";
					break;
					
				case "2":
					document.getElementById(panelOut).innerHTML = "<div class='error'>NO SE PUEDE FINALIZAR LA FASE<br/>Alguna de tus tropas sigue en estado \"Bajo carga\".<br/> Por favor, reacciona a todas las cargas.</div>";
					break;
					
				default:;
			}
		}
	};
	
	
	/**
	 * Método que devuelve un objeto con los datos de la situacion actual.
	 * 
	 * @return Retrona un un objeto de clase Object.
	 */
	function registroSituacion(){
		var datos = new Object();
		
		datos.partida = document.getElementById("partidaId").value;
		datos.ejercito = document.getElementById("ejercitoId").value;
		datos.ejercitoEnemigo = document.getElementById("ejercitoEnemigoId").value;
		datos.turno = document.getElementById("turno").innerHTML;
		datos.fase = document.getElementById("faseId").value;
		datos.ordenFase = fase;
		datos.ordenJugador = userOrder;
		
		
		//Creamos un array de objetos que representarán a todas las tropas que habrá.
		datos.tropas = [];
		
		for(var i=0; i<tropa.length; i++){
			//Procedemos solo con las tropas que no están eliminadas.
			if(tropa[i].getEstado() != "Eliminada"){
				//Creamos el objeto
				datos.tropas[i] = new Object();
				
				//Le asignamos atributos
				datos.tropas[i].tropa = tropa[i].getId().substr(5);
				datos.tropas[i].aliada = tropa[i].getUser();
				datos.tropas[i].unidadesFila = tropa[i].getAnchoFila();
				datos.tropas[i].altitud = tropa[i].getVanguardiaSiniestra().y;
				datos.tropas[i].latitud = tropa[i].getVanguardiaSiniestra().x;
				datos.tropas[i].orientacion = tropa[i].getOrientacion();
				datos.tropas[i].heridas = tropa[i].getHeridas();
				datos.tropas[i].tropaAdoptiva = tropa[i].getTropaAdoptiva();
				datos.tropas[i].tropaBajoAtaque = tropa[i].getTropaBajoAtaque().id;
				datos.tropas[i].tropaBajoAtaqueFlanco = tropa[i].getTropaBajoAtaque().flanco;
				datos.tropas[i].estado = tropa[i].getEstado();
				
			}
		}
		
		return datos;
	};
	
	
	/**
	 * Método que inicializa las tropas de la batalla.
	 * Para ello asocia a cada objeto tropa la informacion contenida a un elemento de clase tropa existente en el DOM.
	 */
	function tropasIniciar(){
		/** Verificamos que existen elementos tropa en el dom y creamos los objetos tropa pertinentes*/
		if(fichaTropa != null){
			for(var i=0; i<fichaTropa.length; i++){
				tropa[i] = new  Tropa(fichaTropa[i].id, panelOut);
			}
		}
		if(fichaTropaEnemiga != null){
			for(var i=fichaTropa.length; i<fichaTropa.length+fichaTropaEnemiga.length; i++){
				tropa[i] = new  Tropa(fichaTropaEnemiga[i-fichaTropa.length].id, panelOut);
			}
		}
	
		//Establecemos los parentescos que no existiesen.
		if(tropa.length != 0){
			for(var i=0; i<tropa.length; i++){
				var tropaPadre = tropa[i].getTropaAdoptiva();
				console.log(tropa[i].getId()+" - "+tropaPadre);
				if(tropaPadre != ""){
					tropa[tropaBuscar(tropaPadre)].adoptar(tropa[i].getId());
					tropa[tropaBuscar(tropa[i].getId())].incorporar(tropaPadre);
					document.getElementById("tropaadoptiva"+tropa[i].getId()).innerHTML = tropa[tropaBuscar(tropaPadre)].getNombre();
				}
			}
		}
	};
	
	
	
	/**
	 * Método que nos construye el batalla.
	 */
	function situacionConstruir(){
		/**Comprobamos si la batalla entra en la pantalla.*/
		
		/**Establecemos la batalla.*/
		batalla.width = Math.round(CAMPO_ANCHO*zoom);
		batalla.height = Math.round(CAMPO_ALTO*zoom);
		batalla.style.zIndex = "4";
		batalla.style.backgroundColor = "transparent";
		batalla.style.cursor = "url('src/cursor.png'),url('src/cursor.svg'),hand";
		
		/**Establecemos el terreno.*/
		terreno.width = Math.round(CAMPO_ANCHO*zoom);
		terreno.height = Math.round(CAMPO_ALTO*zoom);
		terreno.style.position = "absolute";
		terreno.style.zIndex = "3";
		
		/**Establecemos la situacion*/
		situacion.fillStyle = "grey";
		
		/**Establecemos la camara.*/
		camaraMover(0,0);
		
		/**Mostramos el zoom.*/
		showZoom();
		
		/**Establecemos representacion visual de las tropas en ell canvas batalla*/
		tropasDisponer();
		panelFaseConstruir();
	};
	
	
	
	/**
	 * Método que posiciona las tropas en la batalla.
	 */
	function tropasDisponer(){
		for(var i=0;i<tropa.length;i++){
			tropa[i].posicionar(situacion,zoom);
		}
	};


	/**
	 * Método que establece el panel de la fase actual.
	 */
	function panelFaseConstruir(){
		console.log("Panel fase actualizado:  fase "+fase);
		document.getElementById(panelFase).innerHTML = "";
		var elemento = document.createElement("form");
		var contenido = "";
		if(document.getElementById("finalizarFase") != null){
			switch(fase){
				case "0":
					contenido = panelFaseDespliegue(contenido);
					break;
				
				case "1":
					contenido = panelFaseDeclaracionCargas(contenido);
					break;
				
				case "3":
					contenido = panelFaseMovimiento(contenido);
					break;
					
				default: ;
			}
		}
		else{
			contenido = "";
		}
		
		elemento.innerHTML = contenido;
		document.getElementById(panelFase).appendChild(elemento);
		
		if(document.getElementById("accionFase") != null){
			document.getElementById("accionFase").onclick = accionFase;
			document.getElementById("accionFase").onmouseover = cEncima;
			document.getElementById("accionFase").onmouseout = cFuera;
			document.getElementById("accionFase").onmousedown = cPulsado;
		}
	};

		
	
	
	
	/**METODOS DE SALIDA*/
	/*****************************************************************************************************************/
	
	/**
	 * Método para mostrar en la web el zoom.
	 */
	function showZoom(){
		document.getElementById("zoom").innerHTML = Math.round(zoom*100);
	};
	
		
	
	/**
	 * Método para mostrar en la web la posicion del curosor.
	 */
	function showCursor(e){
		if(cursorDentro){
			document.getElementById("cursorX").innerHTML = Math.round(posicionCursor(e).x);
			document.getElementById("cursorY").innerHTML = Math.round(posicionCursor(e).y);
		}
		else{
			document.getElementById("cursorX").innerHTML = "--";
			document.getElementById("cursorY").innerHTML = "--";
		}
	};

		
	
	/**
	 * Método para establecer la camara en una posicion concreta.
	 * 
	 * @param x Nueva coordenada de la camara en el eje X.
	 * @param y Nueva coordenada de la camara en el eje Y.
	 */
	function camaraSet(x,y){
		camaraX = Math.round(x);
		camaraY = Math.round(y);
		
		batalla.style.left = camaraX+"px";
		batalla.style.top = camaraY+"px";
		terreno.style.left = camaraX+"px";
		terreno.style.top = camaraY+"px";
	};
	
		
	
	/**
	 * Método para mover la camara.
	 * 
	 * @param x Incremento de la posicion de la camara en el eje X.
	 * @param y Incremento de la posicion de la camara en el eje Y.
	 */
	function camaraMover(x,y){
		/**Fijamos las nuevas coordenadas teniendo en cuenta el zoom.*/
		camaraX += x*zoom;
		camaraY += y*zoom;
		
		if(camaraX < pantallaWidth-batalla.width){
			camaraX = pantallaWidth-batalla.width;
		}
		if(camaraX > 0){
			camaraX = 0;
		}
		if(camaraY < pantallaHeight-batalla.height){
			camaraY = pantallaHeight-batalla.height;
		}
		if(camaraY > 0){
			camaraY = 0;
		}

		/**Establecemos la posicion de la camara.*/
		batalla.style.left = camaraX+"px";
		batalla.style.top = camaraY+"px";
		terreno.style.left = camaraX+"px";
		terreno.style.top = camaraY+"px";
	};

		
	
	/**
	 * Método para ampliar la camara.
	 * 
	 * @param e Evento que lanzo el metodo.
	 * @param zoomIncrement veces que el scroll hizo resistencia.
	 */
	function camaraZoom(zoomIncrement,e){
		/**Comprobamos que existe alguna variacion.*/
		if(zoomIncrement != 0){
		
			/**Establecemos variaciones graduales.*/
			zoom -= zoomIncrement/20;
			
			var moverCamaraNeeded = true;
			/**Verificamos si intentamos aumentar el zoom por encima del limite.*/
			if(zoomTopLimit && zoomIncrement<0){
				moverCamaraNeeded = false;
			}
			else{
				zoomTopLimit = false;
			}

			/**Establecemos un m�ximo.*/
			if(zoom<minZoom){
				zoom = minZoom;
			}
			
			/**Establecemos un m�nimo.*/
			if(zoom>maxZoom){
				zoom = maxZoom;
				zoomTopLimit = true;
			}
			
			/**Establecemos la camara para simular estaticidad.*/
			/**Proporcion del cambio.*/
			var proporcion;
			
			if (zoomIncrement>0){
				proporcion = 1.25;
			}
			else{
				proporcion = 0.75;
			}
			
			/**Desplazamiento de la camara.*/
			if(moverCamaraNeeded){
				var desplazamientoX = (e.pageX-posicionElemento(batalla.offsetParent).x)*proporcion-(posicionCursor(e).x)*zoom;
				var desplazamientoY = (e.pageY-posicionElemento(batalla.offsetParent).y)*proporcion-(posicionCursor(e).y)*zoom;
				camaraSet (desplazamientoX,desplazamientoY);
			}
			
			/**Reconstruimos el escenario.*/
			situacionConstruir();
		}
	};
	

	
	
	/**
	 * Método que se ejecuta para resaltar que el cursor está sobre el elemento boton. 
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function cEncima(e){
		/**Prevenimos eventos por defecto*/
		e.preventDefault();
		if(e.target != null){
			e.target.style.borderColor="#F9FF45";
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
		
		if(e.target != null){
			e.target.style.borderColor="#CBD126";
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

		if(e.target != null){
			e.target.style.boxShadow="3px 3px 3px grey";
		}
	};
	
	
	/**
	 * Método que se ejecuta para resaltar que el cursor dejo de estar pulsado sobre el elemento boton.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function cSoltar(e){
		if(e.target != null){
			e.target.style.boxShadow="none";
		}
	};	
	
	
	
	/**METODOS DE TRATAMIENTO DE LAS TROPAS*/
	/*****************************************************************************************************************/
	
	/**
	 * Método que localiza una tropa en funcion de su id.
	 * 
	 * @param tropaId id de la tropa que buscamos.
	 * @return Indice de la tropa dentro de tropa[].
	 */
	function tropaBuscar(tropaId){
		var i;
		for(i=0;i<tropa.length;i++){
			if(tropa[i].getId()==tropaId){
				return i;
			}
		}
		return -1;
	};
	
		
	
	/**
	 * Método que establece una tropa como seleccion
	 * 
	 * @param tropaId id de la tropa que seleccionamos.
	 */
	function tropaSeleccionar(tropaId){
		/**Deseleccionamos la tropa previa.*/
		if(tropaSeleccionadaId != -1){
			tropa[tropaBuscar(tropaSeleccionadaId)].deseleccionar();
			document.getElementById(tropaSeleccionadaId).style.display="none";
		}
	
		/**Establecemos la seleccion previa y la seleccion.*/
		if(tropaSeleccionadaId != -1){
			tropaSeleccionadaPreviaId = tropaSeleccionadaId;
		}
		tropaSeleccionadaId = tropaId;
		
		/**Verificamos que la tropa previa no sea la misma que la seleccionada.*/
		if(tropaSeleccionadaPreviaId == tropaSeleccionadaId){
			tropaSeleccionadaPreviaId = -1;
		}
		
		/**Seleccionamos la nueva tropa.*/
		tropa[tropaBuscar(tropaId)].seleccionar();
		
		/**Actualizamos panelFase y panelIn*/
		document.getElementById(tropaId).style.display="block";
	};
	
		
	
	/**
	 * Método que comprueba que una tropa no colisione con ninguna otra.
	 * 
	 * @param tropaId id de la tropa que se ha de comparar.
	 */
	function tropaColision(tropaId){
		var colision = false;
		for(var i=0;i<tropa.length;i++){
			/**Si la tropa est� en campo, comparamos los puntos de ambas tropas.*/
			if(tropa[i].getEnCampo() && i!=tropaBuscar(tropaId)){
				if(tropa[i].colision(
						tropa[tropaBuscar(tropaId)].getVanguardiaSiniestra().x
						,tropa[tropaBuscar(tropaId)].getVanguardiaSiniestra().y
						)
					){
					colision=true;
				}else if(tropa[i].colision(
						tropa[tropaBuscar(tropaId)].getVanguardiaDiestra().x
						,tropa[tropaBuscar(tropaId)].getVanguardiaDiestra().y
						)
					){
					colision=true;
				}else if(tropa[i].colision(
						tropa[tropaBuscar(tropaId)].getRetaguardiaSiniestra().x
						,tropa[tropaBuscar(tropaId)].getRetaguardiaSiniestra().y
						)
					){
					colision=true;
				}else if(tropa[i].colision(
						tropa[tropaBuscar(tropaId)].getRetaguardiaDiestra().x,
						tropa[tropaBuscar(tropaId)].getRetaguardiaDiestra().y
						)
					){
					colision=true;
				}else if(tropa[tropaBuscar(tropaId)].colision(
						tropa[i].getVanguardiaSiniestra().x,
						tropa[i].getVanguardiaSiniestra().y
						)
					){
					colision=true;
				}else if(tropa[tropaBuscar(tropaId)].colision(
						tropa[i].getVanguardiaDiestra().x
						,tropa[i].getVanguardiaDiestra().y
						)
					){
					colision=true;
				}else if(tropa[tropaBuscar(tropaId)].colision(
						tropa[i].getRetaguardiaSiniestra().x
						,tropa[i].getRetaguardiaSiniestra().y
						)
					){
					colision=true;
				}else if(tropa[tropaBuscar(tropaId)].colision(
						tropa[i].getRetaguardiaDiestra().x
						,tropa[i].getRetaguardiaDiestra().y
						)
					){
					colision=true;
				}
			}
		}
		return colision;
	};
	
		
	
	/**
	 * Método que determina si se hace click sobre una tropa.
	 * 
	 * @param e Evento que lanzo el metodo.
	 */
	function tropaClick(e){
		for(var i=0;i<tropa.length;i++){
			if(tropa[i].getEnCampo()){
				if(tropa[i].colision(posicionCursor(e).x,posicionCursor(e).y)){
					return true;
				}
			}
		}
		return false;
	};
	
		
	
	/**
	 * Método que comprueba si una tropa ve a otra.
	 * 
	 * @param tropa1 Tropa que mira.
	 * @param tropa2 Tropa que ha de ser vista.
	 * @return Devolver� true si existe vision.
	 */
	function tropaVer(tropa1,tropa2){
		/**Establecemos las Id de las tropas*/
		var t1ID=tropa1.getId();
		var t2ID=tropa2.getId();
		
		/**Establecemos los puntos de mira de la tropa1*/
		var t1VS=tropa1.getVanguardiaSiniestra();
		var t1VD=tropa1.getVanguardiaDiestra();
		
		/**Establecemos los puntos de la tropa2*/
		var t2VS=tropa2.getVanguardiaSiniestra();
		var t2VD=tropa2.getVanguardiaDiestra();
		var t2RS=tropa2.getRetaguardiaSiniestra();
		var t2RD=tropa2.getRetaguardiaDiestra();
		
		/**Comprobamos cual es el v�rtice de la tropa 2 m�s pr�ximo a la tropa 1*/
		/**Comprobamos si la tropa1 ve el punto de Vanguardia Siniestra de la tropa2*/
		if(tropa1.lineaVision(t2VS.x,t2VS.y)){
			/**Si el punto est� en la linea de visi�n ver�ficamos que ningun elemento bloquee la linea de visi�n*/
			if(lineaLibre(t1VS,t2VS,t1ID,t2ID) || lineaLibre(t1VD,t2VS,t1ID,t2ID)){
				/**Para que se bloquee la visi�n ambos puntos, VS y VD, han de carecer de visi�n*/
				return true;
			}
		}
		
		/**Comprobamos si la tropa1 ve el punto de Vanguardia Diestra de la tropa2*/
		if(tropa1.lineaVision(t2VD.x,t2VD.y)){
			/**Si el punto est� en la linea de visi�n ver�ficamos que ningun elemento bloquee la linea de visi�n*/
			if(lineaLibre(t1VS,t2VD,t1ID,t2ID) || lineaLibre(t1VD,t2VD,t1ID,t2ID)){
				/**Para que se bloquee la visi�n ambos puntos, VS y VD, han de carecer de visi�n*/
				return true;
			}
		}
		
		/**Comprobamos si la tropa1 ve el punto de Retaguardia Siniestra de la tropa2*/
		if(tropa1.lineaVision(t2RS.x,t2RS.y)){
			/**Si el punto est� en la linea de visi�n ver�ficamos que ningun elemento bloquee la linea de visi�n*/
			if(lineaLibre(t1VS,t2RS,t1ID,t2ID) || lineaLibre(t1VD,t2RS,t1ID,t2ID)){
				/**Para que se bloquee la visi�n ambos puntos, VS y VD, han de carecer de visi�n*/
				return true;
			}
		}
		
		/**Comprobamos si la tropa1 ve el punto de Retaguardia Diestra de la tropa2*/
		if(tropa1.lineaVision(t2RD.x,t2RD.y)){
			/**Si el punto est� en la linea de visi�n ver�ficamos que ningun elemento bloquee la linea de visi�n*/
			if(lineaLibre(t1VS,t2RD,t1ID,t2ID) || lineaLibre(t1VD,t2RD,t1ID,t2ID)){
				/**Para que se bloquee la visi�n ambos puntos, VS y VD, han de carecer de visi�n*/
				return true;
			}
		}
	};
	
		
	
	/**
	 * Método que comprueba los frentes disponibles m�s pr�ximos 
	 * de una tropa objetivo a una tropa atacante.
	 * @param tropa1 tropa Atacante.
	 * @param tropa2 tropa objetivo.
	 * @return devolver�:
	 * 0 si no se puede ver ning�n frente, 
	 * 1 para la vanguardia.
	 * 2 para la siniestra.
	 * 3 para la diestra.
	 * 4 para la retaguardia.
	 */
	function tropaFrenteVer(tropa1,tropa2){
		/**Establecemos las Id de las tropas*/
		var t1ID=tropa1.getId();
		var t2ID=tropa2.getId();
		/**Establecemos los puntos de mira de la tropa1*/
		var t1VS=tropa1.getVanguardiaSiniestra();
		var t1VD=tropa1.getVanguardiaDiestra();
		/**Establecemos los puntos de la tropa2*/
		var t2VS=tropa2.getVanguardiaSiniestra();
		var t2VD=tropa2.getVanguardiaDiestra();
		var t2RS=tropa2.getRetaguardiaSiniestra();
		var t2RD=tropa2.getRetaguardiaDiestra();
		
		/**Suponemos que la tropa 1 no ve ning�n punto de la tropa 2*/
		var verVS=false;
		var verVD=false;
		var verRS=false;
		var verRD=false;
		
		/**Comprobamos si la tropa1 ve el punto de Vanguardia Siniestra de la tropa2*/
		if(tropa1.lineaVision(t2VS.x,t2VS.y)){
			/**Si el punto est� en la linea de visi�n ver�ficamos que ningun elemento bloquee la linea de visi�n*/
			if(lineaLibre(t1VS,t2VS,t1ID,t2ID) || lineaLibre(t1VD,t2VS,t1ID,t2ID)){
				/**Para que se bloquee la visi�n ambos puntos, VS y VD, han de carecer de visi�n*/
				verVS=true;
			}
		}
		
		/**Comprobamos si la tropa1 ve el punto de Vanguardia Diestra de la tropa2*/
		if(tropa1.lineaVision(t2VD.x,t2VD.y)){
			/**Si el punto est� en la linea de visi�n ver�ficamos que ningun elemento bloquee la linea de visi�n*/
			if(lineaLibre(t1VS,t2VD,t1ID,t2ID) || lineaLibre(t1VD,t2VD,t1ID,t2ID)){
				/**Para que se bloquee la visi�n ambos puntos, VS y VD, han de carecer de visi�n*/
				verVD=true;
			}
		}
		
		/**Comprobamos si la tropa1 ve el punto de Retaguardia Siniestra de la tropa2*/
		if(tropa1.lineaVision(t2RS.x,t2RS.y)){
			/**Si el punto est� en la linea de visi�n ver�ficamos que ningun elemento bloquee la linea de visi�n*/
			if(lineaLibre(t1VS,t2RS,t1ID,t2ID) || lineaLibre(t1VD,t2RS,t1ID,t2ID)){
				/**Para que se bloquee la visi�n ambos puntos, VS y VD, han de carecer de visi�n*/
				verRS=true;
			}
		}
		
		/**Comprobamos si la tropa1 ve el punto de Retaguardia Diestra de la tropa2*/
		if(tropa1.lineaVision(t2RD.x,t2RD.y)){
			/**Si el punto est� en la linea de visi�n ver�ficamos que ningun elemento bloquee la linea de visi�n*/
			if(lineaLibre(t1VS,t2RD,t1ID,t2ID) || lineaLibre(t1VD,t2RD,t1ID,t2ID)){
				/**Para que se bloquee la visi�n ambos puntos, VS y VD, han de carecer de visi�n*/
				verRD=true;
			}
		}
		
		/**Comprobamos cual es el punto m�s pr�ximo*/
		/**En funcion de si vemos otros puntos de la tropa designamos el frente de carga*/
		/**Por utilidad tiene preferencia la retaguardia sobre los flancos y los flancos sobre la vanguardia*/
		switch(tropaPuntoProximoFrente(tropa1,tropa2)){
			case "vs":
				if(verRS) return 2;
				if(verVD) return 1;
				break;
				
			case "vd":
				if(verRD) return 3;
				if(verVD) return 1;
				break;
				
			case "rs":
				if(verRD) return 4;
				if(verVS) return 2;
				break;
				
			case "rd":
				if(verRS) return 4;
				if(verVD) return 3;
				break;
		}
		return 0;
	};
	
		
	
	/**
	 * Método que evalua el punto m�s proximo de una tropa objetivo a el frente de una tropa dada.
	 * @param tropa1 tropa dada.
	 * @param tropa2 tropa objetivo.
	 * @return devolver� un String que representa las siglas de uno de los 4 puntos de una tropa.
	 */
	function tropaPuntoProximoFrente(tropa1,tropa2){
		/**Establecemos las Id de las tropas*/
		var t1ID=tropa1.getId();
		var t2ID=tropa2.getId();
		/**Establecemos los puntos de la tropa2*/
		var t2VS=tropa2.getVanguardiaSiniestra();
		var t2VD=tropa2.getVanguardiaDiestra();
		var t2RS=tropa2.getRetaguardiaSiniestra();
		var t2RD=tropa2.getRetaguardiaDiestra();
		
		/**Establecemos el nombre de los frentes,*/
		var frente = [];
		frente[0] = "vs";
		frente[1] = "vd";
		frente[2] = "rs";
		frente[3] = "rd";
		
		/**Establecemos las distancias desde el frente de la tropa 1 a cada uno de los puntos*/
		var distancia = [];
		distancia[0] = tropa1.distanciaFrentePunto(tropa2.getVanguardiaSiniestra());
		distancia[1] = tropa1.distanciaFrentePunto(tropa2.getVanguardiaDiestra());
		distancia[2] = tropa1.distanciaFrentePunto(tropa2.getRetaguardiaSiniestra());
		distancia[3] = tropa1.distanciaFrentePunto(tropa2.getRetaguardiaDiestra());
		
		/**Ordenamos de menor a mayor las distancias y los nombres asociados de forma paralela*/
		/**Recurrimos al metodo de la burbuja con interruptor para una m�xima eficiencia*/
		var cambios=true;
		for(var i=1;i<distancia.length-1 && cambios;i++){
			cambios=false;
			for(var j=1;j<distancia.length-i-1;j++){
				if(distancia[i]<distancia[i-1]){
					cambios=true;
					
					var auxDistancia = distancia[i];
					distancia[i] = distancia[i-1];
					distancia[i-1] = auxDistancia;
					
					var auxFrente = frente[i];
					frente[i] = frente[i-1];
					frente[i-1] = auxFrente;
				}
			}
		}
		
		return frente[0];
	};
	
		
	
	
	
	/**METODOS PARA EL TRATAMIENTO DE COORDENADAS*/
	/*****************************************************************************************************************/
	
	/**
	 * Método que muestra la posicion absoluta de un elemento
	 * respecto a la pagina.
	 * 
	 * @param element Elemento del que se quiere saber la posicion absoluta.
	 * @return vector bidimensional con las coordenadas (x,y).
	 */
	function posicionElemento(element){
		/**Definimos un punto (x,y).*/
		var pos = { x: element.offsetLeft, y: element.offsetTop };
		
		/**Si el elemento tiene padre, sumamos la posici�n del padre.*/
		if (element.offsetParent) {
			var tmp =  posicionElemento(element.offsetParent);
			pos.x += tmp.x;
			pos.y += tmp.y;
		}
		return pos;
	};
	
		
	
	/**
	 * Método que muestra la posicion del cursor dentro de un elemento.
	 * Este metodo tiene un margen de aproximadamente 8 pixeles de error
	 * en la coordenada (0,0).
	 * 
	 * @param e Evento que lanzo el metodo.
	 * @return vector bidimensional con las coordenadas (x,y).
	 */
	function posicionCursor(e){
		/**Prevenimos los efectos por defecto del evento.*/
		e.preventDefault();
		
		/**Establecemos la posici�n del elemento en que se lanzo el evento.*/
		var posEle = posicionElemento(e.target);
		
		/**Establecemos el punto  (x,y).*/
		var posCur = { x: (e.pageX-posEle.x), y: (e.pageY-posEle.y) };

		posCur.x = Math.round(posCur.x / zoom);
		posCur.y = Math.round(posCur.y / zoom);
		
		return posCur;
	};	
	
		
	
	/**
	 * Método que calcula la distancia entre dos puntos.
	 * 
	 * @param x1 coordenada x del punto 1.
	 * @param y1 coordenada y del punto 1.
	 * @param x2 coordenada x del punto 2.
	 * @param y2 coordenada y del punto 2.
	 * @return devuelve la distancia en forma de entero.
	 */
	function distanciaPuntoPunto(x1,y1,x2,y2){
		var distanciaX = Math.abs(x1-x2);
		var distanciaY = Math.abs(y1-y2);
		var distancia = Math.sqrt(Math.pow(distanciaX,2)+Math.pow(distanciaY,2));
		return parseInt(distancia);
	};
	
		
	
	/**
	 * Método que comprueba que un punto est� contenido en una recta,
	 * por encima, o por debajo.
	 * 
	 * @param xP coordenada x del punto.
	 * @param yP coordenada y del punto.
	 * @param xR coordenada x de un punto de la recta.
	 * @param yR coordenada y de un punto de la recta.
	 * @param angle angulo que forma la recta con la horizontal.
	 * @return si el punto esta por encima de la recta
	 * el metodo devolver� 1 en caso de estar encima o a la derecha de la recta, 0 si el punto esta contenido por ella
	 * y en caso de estar debajo o a la izquierda devolvera -1.
	 */
	function distanciaPuntoRecta(xP,yP,xR,yR,angle){
		/**y = mx+n*/
		var m = Math.tan(angle*Math.PI/180);
		var n = yR - xR*m;
		
		/**(mx-y+n)/raiz cuadrada de m^2 +1 = distancia*/
		return parseInt((m*xP-yP+n)/Math.sqrt(Math.pow(m,2)+1));
	};
	
	
	
	/**
	 * Método que comprueba si la linea entre dos puntos, de dos tropas, est� despejada.
	 * 
	 * @param p1 coordenadas del punto uno (ha de tener indices "x" e "y").
	 * @param p2 coordenadas del punto dos (ha de tener indices "x" e "y").
	 * @param t1ID tropa implicada en la linea de visi�n.
	 * @param t2ID tropa implicada en la linea de visi�n.
	 * @return devolver� un valor booleano. En caso de que NINGUNA tropa bloquee la linea de visi�n devolver� true.
	 */
	function lineaLibre(p1,p2,t1ID,t2ID){
		for(var i=0;i<tropa.length;i++){
			if(tropa[i].getId() != t1ID && tropa[i].getId() != t2ID){
				
				if(tropa[i].bloqueaLinea(p1.x,p1.y,p2.x,p2.y)){
					console.log(tropa[i].getNombre());
					return false;
				}
			}
		}
		return true;
	};

		
	
	
	
	/**METODOS DE CONTROL DE EVENTOS*/
	/*****************************************************************************************************************/
	
	/**
	 * Método que establece los sucesos el cursor entra a la batalla.
	 * 
	 * @param e Evento que lanzo el metodo.
	 */
	 function cursorEntrada(e){
		/**Prevenimos los efectos por defecto del evento.*/
		e.preventDefault();
		
		cursorDentro = true;
		showCursor(e);
	};
	
		
	
	/**
	 * Método que establece los sucesos el cursor sale del batalla.
	 * 
	 * @param e Evento que lanzo el metodo.
	 */
	 function cursorSalida(e){
		/**Prevenimos los efectos por defecto del evento.*/
		e.preventDefault();
		
		cursorDentro = false;
		cursorPulsado = false;
		clickEnTropa = false;
		switch(fase){
			case "0":
				if(tropaSeleccionadaId != -1){
					if(tropaColision(tropaSeleccionadaId)){
						tropa[tropaBuscar(tropaSeleccionadaId)].retirar();
						document.getElementById(panelOut).innerHTML = "<div class='error'>Tropa no desplegada. Ya hay otra tropa en el lugar deseado. </div>";
					}
				}
				break;
				
			case "1":
				break;
				
			default: ;
		}
		showCursor(e);
	};

		
	
	/**
	 * Método que establece los sucesos cuando se mueve el cursor.
	 * 
	 * @param e Evento que lanzo el metodo.
	 */
	 function cursorMover(e){
		/**Prevenimos los efectos por defecto del evento.*/
		e.preventDefault();
		
		showCursor(e);
		
		if(cursorPulsado){
			if(clickEnTropa){
				if(document.getElementById("finalizarFase") != null){
					switch(fase){
					
						case "0": accionMoverCursorPulsadoDespliegue(e); break;
						
						default: ;
					}
				}
			}
			else{
				/**Cambiamos la posicion de la camara*/
				camaraMover(Math.round(posicionCursor(e).x - posicionInicioClick.x) , Math.round(posicionCursor(e).y - posicionInicioClick.y));
			}
		}
		else{
			if(document.getElementById("finalizarFase") != null){
				switch(fase){
					case "1": accionMoverCursorDeclaracionCargas(e); break;
						
					default: ;
				}
			}
		}
	};
	
		
	
	/**
	 * Método que establece los sucesos cuando se pulsa el cursor.
	 * 
	 * @param e Evento que lanzo el metodo.
	 */
	 function cursorPulsar(e){
		/**Prevenimos los efectos por defecto del evento.*/
		e.preventDefault();
		
		/**Indicamos que se est� pulsando el cursor.*/
		cursorPulsado = true;

		/**Establecemos el inicio de la pulsaci�n.*/
		inicioClick = new Date().getTime();
		
		/**Establecemos las coordenadas de la pulsacion.*/
		posicionInicioClick = posicionCursor(e);
		
		/** Comprobamos si se realiza un Click, o si se est� manteniendo pulsado el curso.*
		if(new Date().getTime() - inicioClick < LONGITUD_CLICK){
			cursorClick(e);
		}
		else{*/
			/**Comprobamos si arrastramos mapa o unidad.*/
			if(tropaClick(e)){
				clickEnTropa = true;
			}
			else{
				clickEnTropa = false;
			}
		//}
	};
	
		
	
	/**
	 * Método que establece los sucesos cuando se suelta el cursor.
	 * 
	 * @param e Evento que lanzo el metodo.
	 */
	 function cursorSoltar(e){
		/**Prevenimos los efectos por defecto del evento.*/
		e.preventDefault();
	
		/**Indicamos que ya no se est� pulsando el cursor.*/
		cursorPulsado = false;
		clickEnTropa = false;
		if(document.getElementById("finalizarFase") != null){
			switch(fase){
				case "0": accionSoltarCursorDespliegue(e); break;
					
				case "1": break;
					
				default: ;
			}
		}
		situacionConstruir();
	};
	
		
	
	/**
	 * Método que establece los sucesos cuando se hace click.
	 * 
	 * NOTA: est� Método es privileged,
	 * se ejecuta cuando se deja de pulsar el cursor
	 * y la pulsacion es menor de 500 milisegundos.
	 * 
	 * @param e Evento que lanzo el metodo.
	 * @see Partida.cursorSoltar(e)
	 */
	function cursorClick(e){
		/**Prevenimos los efectos por defecto del evento.*/
		e.preventDefault();
	};
	
		
	
	/**
	 * Método que establece los sucesos cuando se hace doble click.
	 * 
	 * @param e Evento que lanzo el metodo.
	 */
	 function cursorDobleClick(e){
		/**Prevenimos los efectos por defecto del evento.*/
		e.preventDefault();
		
		/**Si hacemos dobleClick sobre una tropa la seleccionamos.*/
		/**Si no, haremos una funcion especifica de la fase.*/
		if(tropaClick(e)){
			for(var i=0;i<tropa.length;i++){
				if(tropa[i].getEnCampo()){
					if(tropa[i].colision(posicionCursor(e).x, posicionCursor(e).y)){
						tropaSeleccionar(tropa[i].getId());
					}
				}
			}
		}
		else{
			if(document.getElementById("finalizarFase") != null){
				switch(fase){
					case "0": accionDobleClickDespliegue(e); break;
						
					case "1": break;
	
					default: ;
				}
			}
		}
		situacionConstruir();
	};
	
		
	
	/**
	 * Método que establece los sucesos cuando se usa el scroll sobre el batalla.
	 * 
	 * @param e Evento que lanzo el metodo.
	 */
	 function scrollRoll(e){
		if(cursorDentro){
			/**Prevenimos los efectos por defecto del evento.*/
			e.preventDefault();
			
			var rolled=0;
			
			/** FireFox*/
			if ('detail' in e) {
				rolled += Math.round(e.detail/3);
			}
			/** Chrome*/
			if ('deltaY' in e) {
				rolled += Math.round(e.deltaY/100);
			}
			
			camaraZoom(rolled,e);
		}
	};
	
	
	/**
	 * Método que se dispara al seleccionar una tropa en el panel de entrada de la interfaz.
	 * 
	 * @param e Evento que lanzo el metodo.
	 */
	function seleccionarEnPanel(e){
		e.preventDefault();
		tropaSeleccionar(e.target.id.substr(8));
		
		situacionConstruir();
	};
		
	
	/**
	 * Método que establece los sucesos
	 * cuando se actualiza el panel de entrada de la pagina.
	 * 
	 * @param e Evento que lanzo el metodo.
	 */
	 function panelInActualizado(e){
		/**Prevenimos los efectos por defecto del evento.*/
		e.preventDefault();
		situacionConstruir();
	};
	
		
	
	/**
	 * Método que establece los sucesos
	 * cuando se submite el panel de la fase.
	 * 
	 * @param e Evento que lanzo el metodo.
	 */
	 function accionFase(e){
		/**Prevenimos los efectos por defecto del evento.*/
		e.preventDefault();
		if(document.getElementById("finalizarFase") != null){
			switch(fase){
				case "0": accionFaseDespliegue(); break;
					
				case "1": accionFaseDeclaracionCargas(); break;
				
				case "3": accionFaseMovimiento(); break;
				
				default: alert("Accion fase default");
			}
		}
		situacionConstruir();
	};

	
	
	
	
	
	
	/**MÉTODOS CONSTRUCTORES PARA EL PANEL DE FASE**/
	/*****************************************************************************************************************/
	
	/**
	 * Método que construye el contenido para el panel de fase de despliegue
	 * 
	 * @param contenido String - String al que se le añadirá el nuevo contenido.
	 * @return Retornará un String que asignar al innerHTML.
	 */
	function panelFaseDespliegue(contenido){
		if(tropaSeleccionadaId != -1){
			if(tropa[tropaBuscar(tropaSeleccionadaId)].getUser()){
				contenido += "<table>";
				
				/**
				 * Si la tropa actual es un personaje y
				 * previamente hemos seleccionado una tropa diferente
				 * que nos pertenece posicionada en el campo,
				 * ofrecemos la posibilidad de combinarlas.
				 */
				if(
					tropa[tropaBuscar(tropaSeleccionadaId)].getUnidades() == 1
					&& tropa[tropaBuscar(tropaSeleccionadaId)].getRangoAlto() >= 6
					&& tropaSeleccionadaPreviaId != -1 
					&& tropaSeleccionadaPreviaId != tropaSeleccionadaId 
					&& tropa[tropaBuscar(tropaSeleccionadaPreviaId)].getUser()
					&& tropa[tropaBuscar(tropaSeleccionadaPreviaId)].getEnCampo()
				){
					contenido += "<tr>";
					contenido += "<td>";
					contenido += "<label for='combinar'>";
					contenido += "Combinar con ";
					contenido += tropa[tropaBuscar(tropaSeleccionadaPreviaId)].getNombre();
					contenido += "</label>";
					contenido += "</td>";
					contenido += "<td>";
					contenido += "<input id='combinar' name='combinar' type='checkbox' value='si'/>";
					contenido += "</td>";
					contenido += "</tr>";
				}
				
				/**
				 * Definimos una variable que comprobara si la tropa está en el campo
				 * para no tener que estar continuamente realizando dicha comprobación.
				 */
				var tropaEnCampo = false;
				if(tropa[tropaBuscar(tropaSeleccionadaId)].getEnCampo()){
					tropaEnCampo = true;
				}
				contenido += "<tr>";
				contenido += "<td>";
				contenido += "<label for='latitud'>Latitud: </label>";
				contenido += "</td>";
				contenido += "<td>";
				contenido += "<input id='latitud' name='latitud' type='text' value='";
				if(tropaEnCampo) contenido += tropa[tropaBuscar(tropaSeleccionadaId)].getVanguardiaSiniestra().x;
				contenido += "' size='4' maxlength='4'/>";
				contenido += "</td>";
				contenido += "</tr>";
				
				contenido += "<tr>";
				contenido += "<td>";
				contenido += "<label for='altitud'>Altitud: </label>";
				contenido += "</td>";
				contenido += "<td>";
				contenido += "<input id='altitud' name='altitud' type='text' value='";
				if(tropaEnCampo) contenido += tropa[tropaBuscar(tropaSeleccionadaId)].getVanguardiaSiniestra().y;
				contenido += "' size='4' maxlength='4'/>";
				contenido += "</td>";
				contenido += "</tr>";
				
				contenido += "<tr>";
				contenido += "<td>";
				contenido += "<label for='orientacion'>Orientacion: </label>";
				contenido += "</td>";
				contenido += "<td>";
				contenido += "<input id='orientacion' name='orientacion' type='text' value='";
				if(tropaEnCampo) contenido += tropa[tropaBuscar(tropaSeleccionadaId)].getOrientacion();
				contenido += "' size='4' maxlength='3'/>";
				contenido += "</td>";
				contenido += "</tr>";
				
				contenido += "<tr>";
				contenido += "<td>";
				contenido += "<label for='anchofila'>Unidades por fila</label>";
				contenido += "</td>";
				contenido += "<td>";
				contenido += "<select id='anchofila' name='anchofila'>";
				if(tropaEnCampo){
					contenido += "<option value='";
					contenido += tropa[tropaBuscar(tropaSeleccionadaId)].getAnchoFila();
					contenido += "' selected='selected'>";
					contenido += tropa[tropaBuscar(tropaSeleccionadaId)].getAnchoFila();
					contenido += "</option>";
				}
				contenido += "<option value='5'>5</option>";
				contenido += "<option value='6'>6</option>";
				contenido += "<option value='7'>7</option>";
				contenido += "<option value='8'>8</option>";
				contenido += "<option value='9'>9</option>";
				contenido += "<option value='10'>10</option>";
				contenido += "</select>";
				contenido += "</td>";
				contenido += "</tr>";
				
				contenido += "<tr>";
				contenido += "<td colspan='2' class='alignCenter'>";
				contenido += "<div id='accionFase' class='boton'>Desplegar</div>";
				contenido += "</td>";
				contenido += "</tr>";
				
				contenido += "</table>";
				
			}
			else{
				contenido += "<p>Por favor, elija una tropa.</p>";
			}
		}
		else{
			contenido += "<p>Por favor, elija una tropa.</p>";
		}
		
		return contenido;
	};
	
	
	/**
	 * Método que construye el contenido para el panel de fase de declaracion de cargas
	 * 
	 * @param contenido String - String al que se le añadirá el nuevo contenido.
	 * @return Retornará un String que asignar al innerHTML.
	 */
	function panelFaseDeclaracionCargas(contenido){

		if(tropaSeleccionadaId != -1 && tropaSeleccionadaPreviaId != -1){
			/**Si alguna de las tropas es aliada y la otra enemiga.*/
			if(
				(
					tropa[tropaBuscar(tropaSeleccionadaId)].getUser() 
					&& !tropa[tropaBuscar(tropaSeleccionadaPreviaId)].getUser()
				)
				||
				(
					tropa[tropaBuscar(tropaSeleccionadaPreviaId)].getUser()
					&& !tropa[tropaBuscar(tropaSeleccionadaId)].getUser()
				)
			){
				/** Comprobamos cual de las tropas es enemiga y cual aliada */
				if(tropa[tropaBuscar(tropaSeleccionadaId)].getUser()){
					var tropaPropia = tropa[tropaBuscar(tropaSeleccionadaId)];
					var tropaEnemiga = tropa[tropaBuscar(tropaSeleccionadaPreviaId)];
				}
				else{
					var tropaPropia = tropa[tropaBuscar(tropaSeleccionadaPreviaId)];
					var tropaEnemiga = tropa[tropaBuscar(tropaSeleccionadaId)];
				}
				
				if(tropaPropia.getOcupada()){
					contenido += "<p>";
					contenido += "La tropa ";
					
					contenido += "<b>";
					contenido += tropaPropia.getNombre();
					contenido += "</b>";
					
					contenido += " ya realizo una acción este turno y por lo tanto no puede realizar ninguna otra.";
					
					contenido += "</p>";
				}
				
				else{
					var frenteVisiblePrioritario = tropaFrenteVer(tropaPropia, tropaEnemiga);
					
					switch(frenteVisiblePrioritario){
						case 0:
							contenido += "<p>";
							contenido += "La tropa ";
							
							contenido += "<b>";
							contenido += tropaPropia.getNombre();
							contenido += "</b>";
							
							contenido += " no puede ver a la tropa enemiga ";
								
							contenido += "<b>";
							contenido += tropaEnemiga.getNombre();
							contenido += "</b>.";
							
							contenido += "</p>";
							break;
							
						case 1:
							contenido += "<p>";
							contenido += "La tropa ";
							
							contenido += "<b>";
							contenido += tropaPropia.getNombre();
							contenido += "</b>";
							
							contenido += " ve a la tropa enemiga "
								
							contenido += "<b>";
							contenido += tropaEnemiga.getNombre();
							contenido += "</b>";
							
							contenido += " por su vanguardia.";
							
							contenido += "</p>";
							break;
							
						case 2:

							contenido += "<p>";
							contenido += "La tropa ";
							
							contenido += "<b>";
							contenido += tropaPropia.getNombre();
							contenido += "</b>";
							
							contenido += " ve a la tropa enemiga "
								
							contenido += "<b>";
							contenido += tropaEnemiga.getNombre();
							contenido += "</b>";
							
							contenido += " por su flanco izquierdo.";
							
							contenido += "</p>";
							break;
							
						case 3:

							contenido += "<p>";
							contenido += "La tropa ";
							
							contenido += "<b>";
							contenido += tropaPropia.getNombre();
							contenido += "</b>";
							
							contenido += " ve a la tropa enemiga "
								
							contenido += "<b>";
							contenido += tropaEnemiga.getNombre();
							contenido += "</b>";
							
							contenido += " por su flanco derecho. ";
							
							contenido += "</p>";
							break;
							
						case 4:

							contenido += "<p>";
							contenido += "La tropa ";
							
							contenido += "<b>";
							contenido += tropaPropia.getNombre();
							contenido += "</b>";
							
							contenido += " ve a la tropa enemiga "
								
							contenido += "<b>";
							contenido += tropaEnemiga.getNombre();
							contenido += "</b>";
							
							contenido += " por su retaguardia.";
							
							contenido += "</p>";
							break;
							
						default:
							contenido += "La tropa <b>"+tropaPropia.getNombre()+"</b> no puede ver a la tropa enemiga <b>"+tropaEnemiga.getNombre()+"</b>. ";
					}
					
					
					if(frenteVisiblePrioritario != 0){
						contenido += "<div colspan='2' class='alignCenter'>";
						contenido += "¿Deseas cargar?<br/>";
						contenido += "<div id='accionFase' class='boton'><img src='src/botones/desafiar.png'/></div>";
						contenido += "</div>";
					}
				}
			}
			/**Si ambas tropas pertenecen al usuario*/
			else if(
				tropa[tropaBuscar(tropaSeleccionadaPreviaId)].getUser() 
				&& tropa[tropaBuscar(tropaSeleccionadaId)].getUser() 
				|| !tropa[tropaBuscar(tropaSeleccionadaPreviaId)].getUser() 
				&& !tropa[tropaBuscar(tropaSeleccionadaId)].getUser()
			){
				contenido += "Las tropas <b>"+tropa[tropaBuscar(tropaSeleccionadaPreviaId)].getNombre()+"</b> y <b>"+tropa[tropaBuscar(tropaSeleccionadaId)].getNombre()+"</b> son aliadas.<br/><br/>Carga con una de tus tropas a una tropa enemiga. ";
			}
		}
		/**Si ninguna de las tropas seleccionadas pertenece al usuario*/
		else{
			contenido += "Por favor, elija una tropa con que cargar o a la que cargar. ";
		}
		
		return contenido;
	};
	
	

	/**
	 * Método que construye el contenido para el panel de fase de despliegue
	 * 
	 * @param contenido String - String al que se le añadirá el nuevo contenido.
	 * @return Retornará un String que asignar al innerHTML.
	 */
	function panelFaseMovimiento(contenido){
		if(tropaSeleccionadaId != -1){
			if(tropa[tropaBuscar(tropaSeleccionadaId)].getUser()){
				contenido += "<table class='subtitle'>";
				
				if(tropa[tropaBuscar(tropaSeleccionadaId)].getTropaAdoptiva() == ""){
					
					if(!tropa[tropaBuscar(tropaSeleccionadaId)].getOcupada() && !tropa[tropaBuscar(tropaSeleccionadaId)].getMovida()){
						
						//Mover
						contenido += "<tr>";
						
						contenido += "<td class='alignRight'>";
						contenido += "<input type='radio' name='accionFaseMovimiento' value='mover'/>";
						contenido += "</td>";
						
						contenido += "<td class='alignLeft white'>";
						contenido  += "MOVER";
						contenido += "</td>";
						
						contenido += "</tr>";
						
						contenido += "<tr>";
						
						contenido += "<td>";
						contenido += "<select id='moverDistancia'>";
						for(var i=0; i <= tropa[tropaBuscar(tropaSeleccionadaId)].getMovimiento(); i++){
							contenido += "<option value='"+i+"'>"+i+" puntos</option>";
						}
						contenido += "</select>";
						contenido += "</td>";
						contenido += "<td class='alignLeft'>";
						contenido += "distancia";
						contenido += "</td>";
						
						contenido += "<td>";
						contenido += "<select id='moverDireccion'>";
						contenido += "<option value='0'>Vanguardia</option>";
						contenido += "<option value='45'>Vanguardia-Diestra</option>";
						contenido += "<option value='90'>Diestra</option>";
						contenido += "<option value='135'>Retaguardia-Diestra</option>";
						contenido += "<option value='180'>Retaguardia</option>";
						contenido += "<option value='225'>Retaguardia-Siniestra</option>";
						contenido += "<option value='270'>Siniestra</option>";
						contenido += "<option value='315'>Vanguardia-Siniestra</option>";
						contenido += "</select>";
						contenido += "</td>";
						contenido += "<td class='alignLeft'>";
						contenido += "direccion";
						contenido += "</td>";
						
						contenido += "</tr>";
						
						//Girar
						contenido += "<tr>";
						
						contenido += "<td class='alignRight'>";
						contenido += "<input type='radio' name='accionFaseMovimiento' value='girar'/>";
						contenido += "</td>";
						
						contenido += "<td class='alignLeft white'>";
						contenido  += "GIRAR";
						contenido += "</td>";
						
						contenido += "<td colspan='2' rowspan='4' class='alignCenter'>";
						contenido += "<div id='accionFase' class='boton'><img src='src/botones/aceptar.png'/></div>";
						contenido += "</td>";
						
						contenido += "</tr>";
						
						contenido += "<tr>";
						
						contenido += "<td>";
						contenido += "<select id='girarAngulo'>";
						for(var i = 0; i < 360; i++){
							contenido += "<option value='"+i+"'>"+i+"º</option>";
						}
						contenido += "</select>";
						contenido += "</td>";
						contenido += "<td class='alignLeft'>";
						contenido += "grados";
						contenido += "</td>";
						
						contenido += "</tr>";

						//Marchar
						if(!tropa[tropaBuscar(tropaSeleccionadaId)].esMaquinaria()){
							contenido += "<tr>";
							
							contenido += "<td class='alignRight'>";
							contenido += "<input type='radio' name='accionFaseMovimiento' value='marchar'/>";
							contenido += "</td>";
							
							contenido += "<td class='alignLeft white'>";
							contenido  += "MARCHAR";
							contenido += "</td>";
							
							contenido += "</tr>";
							
							contenido += "<tr>";
							
							contenido += "<td>";
							contenido += "<select id='marcharDistancia'>";
							for(var i=0; i <= tropa[tropaBuscar(tropaSeleccionadaId)].getMovimiento()*2; i++){
								contenido += "<option value='"+i+"'>"+i+" puntos</option>";
							}
							contenido += "</select>";
							contenido += "</td>";
							contenido += "<td class='alignLeft'>";
							contenido += "distancia";
							contenido += "</td>";
							
							contenido += "</tr>";
						}
						else{
							contenido += "<tr><td colspan='2' rowspan='2'>Las tropas con maquinaria no pueden marchar debido al peso.</td></tr>";
						}
					}
					else{
						contenido += "<tr><td>La tropa está ocupada o ya ha movido y por lo tanto no puede mover.</td></tr>";
					}
				}
				else{
					contenido += "<tr>";
					
					contenido += "<td colspan='2' class='alignCenter white'>";
					contenido  += "SEPARAR";
					contenido += "</td>";
					
					contenido += "</tr>";
					
					contenido += "<tr>";
					
					contenido += "<td colspan='2' class='alignCenter'>";
					contenido += "Si separas la tropa <b>\"";
					contenido += tropa[tropaBuscar(tropaSeleccionadaId)].getNombre();
					contenido += "\"</b> de la tropa <b>\"";
					contenido += tropa[tropaBuscar(tropa[tropaBuscar(tropaSeleccionadaId)].getTropaAdoptiva())].getNombre();
					contenido += "\"</b> no podrás volver a unirlas.";
					contenido += "</td>";
					
					contenido += "</tr>";
					
					contenido += "<tr>";
					
					contenido += "<td class='alignCenter'>";
					contenido += "Confirmar:";
					contenido += "<input type='checkbox' name='accionFaseMovimiento' value='separar'/>";
					contenido += "</td>";
					
					contenido += "</tr>";
					
					contenido += "<tr>";
					
					contenido += "<td colspan='2' class='alignCenter'>";
					contenido += "<div id='accionFase' class='boton'><img src='src/botones/aceptar.png'/></div>";
					contenido += "</td>";
					
					contenido += "</tr>";
					
				}
				
				contenido += "</table>";
				
			}
			else{
				contenido += "<p>Tropa enemiga.</p>";
			}
		}
		else{
			contenido += "<p>Por favor, elija una tropa.</p>";
		}
		
		return contenido;
	};
	
	
	
	/**MÉTODOS CON LAS ACCIONES DE CADA FASE**/
	/*****************************************************************************************************************/

	/**
	 * Método que gestiona las acciones de la fase de despliegue
	 */
	function accionFaseDespliegue(){
		
		/**
		 * El panel de fase "Despliegue"
		 * contiene los elementos necesarios para el despliegue.
		 * Las unidades se desplegaran en funcion de los datos aportados.
		 */
		if(tropaSeleccionadaId != -1){
			
			if(tropa[tropaBuscar(tropaSeleccionadaId)].getUser()){
				document.getElementById(panelOut).innerHTML = "";
				
				var desplegable = true;
				var x = document.getElementById("latitud").value;
				var y = document.getElementById("altitud").value;
				var angle = document.getElementById("orientacion").value;
				var anchoFila = document.getElementById("anchofila").value;
				var tropaPadre = -1;
				
				if (
						tropa[tropaBuscar(tropaSeleccionadaId)].getUnidades() == 1
						&& tropa[tropaBuscar(tropaSeleccionadaId)].getRangoAlto() >= 6
					&& tropaSeleccionadaPreviaId != -1 
					&& tropaSeleccionadaPreviaId != tropaSeleccionadaId 
					&& tropa[tropaBuscar(tropaSeleccionadaPreviaId)].getUser()
					&& tropa[tropaBuscar(tropaSeleccionadaPreviaId)].getEnCampo()
				){
					if(document.getElementById("combinar").checked){
						tropaPadre = tropaSeleccionadaPreviaId;
					}
				}
			
				if(x*0 != 0 || x == ""){
					desplegable = false;
					document.getElementById(panelOut).innerHTML += "<div class='error'>Latitud erronea. </div>";
				}
				
				if(y*0 != 0 || y == ""){
					desplegable = false;
					document.getElementById(panelOut).innerHTML += "<div class='error'>Altitud erronea. </div>";
				}
				
				if(angle*0 != 0 || angle == ""){
					desplegable = false;
					document.getElementById(panelOut).innerHTML += "<div class='error'>Orientacion erronea. </div>";
				}
				
				
				if(tropaPadre != -1){
					if(document.getElementById("tropaadoptivaid"+tropaSeleccionadaId).innerHTML != ""){
						tropa[tropaBuscar(document.getElementById("tropaadoptivaid"+tropaSeleccionadaId).innerHTML)].sacar(tropaSeleccionadaId);
						document.getElementById("tropaadoptivaid"+tropaSeleccionadaId).innerHTML = "";
					}
					
					tropa[tropaBuscar(tropaPadre)].adoptar(tropaSeleccionadaId);
					tropa[tropaBuscar(tropaSeleccionadaId)].incorporar(tropaPadre);
					document.getElementById("tropaadoptiva"+tropaSeleccionadaId).innerHTML = tropa[tropaBuscar(tropaPadre)].getNombre();
					tropaSeleccionar(tropaPadre);
				}
				else{
					if(desplegable){
						if(document.getElementById("tropaadoptivaid"+tropaSeleccionadaId).innerHTML != ""){
							tropa[tropaBuscar(document.getElementById("tropaadoptivaid"+tropaSeleccionadaId).innerHTML)].sacar(tropaSeleccionadaId);
						}
						tropa[tropaBuscar(tropaSeleccionadaId)].desplegar(x,y,angle,anchoFila,CAMPO_ANCHO,CAMPO_ALTO,userOrder,fase);
						if(tropaColision(tropaSeleccionadaId)){
							tropa[tropaBuscar(tropaSeleccionadaId)].retirar();
							document.getElementById(panelOut).innerHTML += "<div class='error'>Tropa no desplegada. Ya hay otra tropa en el lugar deseado. </div>";
						}
					}
					else{
						tropa[tropaBuscar(tropaSeleccionadaId)].desplegar(0,0,0,0,CAMPO_ANCHO,CAMPO_ALTO,userOrder,fase);
						tropa[tropaBuscar(tropaSeleccionadaId)].retirar();
						document.getElementById(panelOut).innerHTML += "<div class='error'> El despliegue era inviable. Comprueba los datos que introduciste. </div>";
					}
				}
			}
		}
	};
	
	
	/**
	 * Método que se dispara al hacer doble click en la fase de despliegue.
	 * 
	 * @param e Event - Evento que lanzo la accion.
	 */
	function accionDobleClickDespliegue(e){
		if(tropaSeleccionadaId != -1){
			if(tropa[tropaBuscar(tropaSeleccionadaId)].getUser()){
				/**Sacamos las unidades de la unidad adoptiva en caso de que se encontraran en una.*/
				if(document.getElementById("tropaadoptivaid"+tropaSeleccionadaId).innerHTML != ""){
					tropa[tropaBuscar(document.getElementById("tropaadoptivaid"+tropaSeleccionadaId).innerHTML)].sacar(tropaSeleccionadaId);
					document.getElementById("tropaadoptivaid"+tropaSeleccionadaId).innerHTML = "";
				}
				
				/**Y la desplegamos en la posicion del dobleclick, la orientacion varía segun se trate de desafiador o desafiado.*/
				var angle = tropa[tropaBuscar(tropaSeleccionadaId)].getOrientacion();
				
				if(isNaN(angle)){
					if(userOrder == "Desafiador"){
						angle = 180;
					}
					else{
						angle = 0;
					}
				}
				tropa[tropaBuscar(tropaSeleccionadaId)].desplegar(posicionCursor(e).x,posicionCursor(e).y,angle,5,CAMPO_ANCHO,CAMPO_ALTO,userOrder,fase);
				
				/**Si la tropa choca con otra, la retiramos.*/
				if(tropaColision(tropaSeleccionadaId)){
					tropa[tropaBuscar(tropaSeleccionadaId)].retirar();
					document.getElementById(panelOut).innerHTML += "<div class='error'>Ya hay otra tropa en el lugar deseado.</div>";
				}
			}
		}
	};
	
	
	/**
	 * Método que se dispara al arrastrar el cursor pulsado en la fase de despliegue.
	 * 
	 * @param e Event - Evento que lanzo la accion.
	 */
	function accionMoverCursorPulsadoDespliegue(e){
		if(tropaSeleccionadaId != -1){
			if(tropa[tropaBuscar(tropaSeleccionadaId)].getUser()){
				if(document.getElementById("tropaadoptivaid"+tropaSeleccionadaId).innerHTML != ""){
					tropa[tropaBuscar(document.getElementById("tropaadoptivaid"+tropaSeleccionadaId).innerHTML)].sacar(tropaSeleccionadaId);
				}
				tropa[tropaBuscar(tropaSeleccionadaId)].arrastrar(
					posicionCursor(e).x
					,posicionCursor(e).y
					,CAMPO_ANCHO
					,CAMPO_ALTO
					,userOrder
				);
				situacionConstruir();
			}
		}
	};
	
	
	/**
	 * Método que se dispara al soltar el cursor en la fase de despliegue.
	 * 
	 * @param e Event - Evento que lanzo la accion.
	 */
	function accionSoltarCursorDespliegue(e){
		if(tropaSeleccionadaId != -1){
			if(tropaColision(tropaSeleccionadaId)){
				tropa[tropaBuscar(tropaSeleccionadaId)].retirar();
				document.getElementById(panelOut).innerHTML = "<div class='error'>Tropa no desplegada. Ya hay otra tropa en el lugar deseado. </div>";
			}
		}
	};
	
	/**
	 * Método que gestiona las acciones de la fase de declaracion de cargas.
	 */
	function accionFaseDeclaracionCargas(){
		var tropaPropia = null;
		var tropaEnemiga = null;
	
		if(tropaSeleccionadaId != -1){
			if(tropa[tropaBuscar(tropaSeleccionadaId)].getUser()){
				tropaPropia = tropa[tropaBuscar(tropaSeleccionadaId)];
				tropaEnemiga = tropa[tropaBuscar(tropaSeleccionadaPreviaId)];
			}
			else if(tropaSeleccionadaPreviaId != -1){
				if(tropa[tropaBuscar(tropaSeleccionadaPreviaId)].getUser()){
					tropaPropia = tropa[tropaBuscar(tropaSeleccionadaPreviaId)];
					tropaEnemiga = tropa[tropaBuscar(tropaSeleccionadaId)];
				}
			}
		}
		
		if(tropaPropia != -1){
			/**Evaluamos si la tropa del usuario ve a la del adversario*/
			var frenteDeCarga = tropaFrenteVer(tropaPropia,tropaEnemiga);
			
			/**Verificamos si la tropa tiene movimiento suficiente para cargar.**/
			if(frenteDeCarga != 0 && tropaPropia.alcanceCarga(tropaEnemiga, frenteDeCarga)){
				tropaPropia.cargar(tropaEnemiga, frenteDeCarga);
				tropaEnemiga.recibirCarga();
			}
			else{
				tropaPropia.cargaFallida();
			}
		}
	};
	
	/**
	 * Método que se dispara al arrastrar el cursor en la fase de declaracion de cargas.
	 * 
	 * @param e Event - Evento que lanzo la accion.
	 */
	function accionMoverCursorDeclaracionCargas(e){
		var tropaPropia = null;
		
		if(tropaSeleccionadaId != -1){
			if(tropa[tropaBuscar(tropaSeleccionadaId)].getUser()){
				tropaPropia = tropa[tropaBuscar(tropaSeleccionadaId)];
			}
			else if(tropaSeleccionadaPreviaId != -1){
				if(tropa[tropaBuscar(tropaSeleccionadaPreviaId)].getUser()){
					tropaPropia = tropa[tropaBuscar(tropaSeleccionadaPreviaId)];
				}
			}
		}
		
		if(tropaPropia != null){
			if(
				tropaPropia.lineaVision(
					posicionCursor(e).x
					,posicionCursor(e).y
				)
			){
				if(
					lineaLibre(
						tropaPropia.getVanguardiaSiniestra()
						, posicionCursor(e)
						, tropaPropia.getId()
						, null
					)
				){
					document.getElementById(panelOut).innerHTML = "La tropa ve el punto en que se encuentra el cursor.";
				}
				else{
					document.getElementById(panelOut).innerHTML = "La tropa no puede ver el punto en que se encuentra el cursor.";
				}
			}
			else{
				document.getElementById(panelOut).innerHTML = "La tropa no puede ver el punto en que se encuentra el cursor.";
			}
		}
	};
	
	
	/**
	 * Método que gestiona las acciones de la fase de despliegue
	 */
	function accionFaseMovimiento(){
		
		/**
		 * El panel de fase "Movimiento"
		 * contiene los elementos necesarios para mover.
		 * Las unidades se moveran en funcion de los datos aportados.
		 */
		if(tropaSeleccionadaId != -1){
			/**
			 * Comprobamos que tipo de movimiento decidió realizar el jugador.
			 */
			var acciones = document.getElementsByName("accionFaseMovimiento");
			var accionRealizada = null;
			
			for(var i=0; i<acciones.length; i++){
				if(acciones[i].checked){
					accionRealizada = acciones[i].value;
				}
			}
			
			switch(accionRealizada){
				case "mover": 
					tropa[tropaBuscar(tropaSeleccionadaId)].mover(
						parseInt(document.getElementById("moverDistancia").value)
						, parseInt(document.getElementById("moverDireccion").value)
						, CAMPO_ANCHO
						, CAMPO_ALTO
						,true
					);
					
					//Si la tropa choca con otra, deshacemos el movimiento.
					if(tropaColision(tropaSeleccionadaId)){
						tropa[tropaBuscar(tropaSeleccionadaId)].mover(
							-parseInt(document.getElementById("moverDistancia").value)
							, parseInt(document.getElementById("moverDireccion").value)
							, CAMPO_ANCHO
							, CAMPO_ALTO
							,false
						);
						document.getElementById(panelOut).innerHTML += "<div class='error'>No puedes terminar el movimiento sobre otra tropa</div>";
					}
					break;
					
				case "girar": 
					tropa[tropaBuscar(tropaSeleccionadaId)].reorientar(
							parseInt(document.getElementById("girarAngulo").value)
							, CAMPO_ANCHO
							, CAMPO_ALTO
							,true
						);
						
						//Si la tropa choca con otra, deshacemos el movimiento.
						if(tropaColision(tropaSeleccionadaId)){
							tropa[tropaBuscar(tropaSeleccionadaId)].reorientar(
								-parseInt(document.getElementById("girarAngulo").value)
								, CAMPO_ANCHO
								, CAMPO_ALTO
								,false
							);
							document.getElementById(panelOut).innerHTML += "<div class='error'>No puedes terminar el movimiento sobre otra tropa</div>";
						}
					break;
					
				case "marchar": 
					tropa[tropaBuscar(tropaSeleccionadaId)].mover(
							parseInt(document.getElementById("marcharDistancia").value)
							, 0
							, CAMPO_ANCHO
							, CAMPO_ALTO
							,true
						);
						
						//Si la tropa choca con otra, deshacemos el movimiento.
						if(tropaColision(tropaSeleccionadaId)){
							tropa[tropaBuscar(tropaSeleccionadaId)].mover(
								-parseInt(document.getElementById("marcharDistancia").value)
								, 0
								, CAMPO_ANCHO
								, CAMPO_ALTO
								,false
							);
							document.getElementById(panelOut).innerHTML += "<div class='error'>No puedes terminar el movimiento sobre otra tropa</div>";
						}
					break;
					
				case "separar": 
					var tropaPadre = document.getElementById("tropaadoptivaid"+tropaSeleccionadaId).innerHTML;
					
					//Comprobamos por seguridad que exista una tropa padre (cuestion de evitar BUGS)
					if(tropaPadre != ""){
						//Sacamos la tropa de su tropa padre
						tropa[tropaBuscar(tropaPadre)].sacar(tropaSeleccionadaId);
						
						//La posicionamos la tropa justo encima de su padre
						var x = tropa[tropaBuscar(tropaPadre)].getVanguardiaSiniestra().x;
						var y = tropa[tropaBuscar(tropaPadre)].getVanguardiaSiniestra().y;
						var angle = tropa[tropaBuscar(tropaPadre)].getOrientacion();
						tropa[tropaBuscar(tropaSeleccionadaId)].desplegar(x, y, angle, 1, CAMPO_ANCHO,CAMPO_ALTO,userOrder,fase);
						
						//Tras posicionarla la desplazamos a la izquierda su ancho mas 3 puntos, siempre teniendo en cuenta el zoom.
						var desplazamiento = parseInt(tropa[tropaBuscar(tropaSeleccionadaId)].getDimensiones().ancho + 10)*zoom/5;
						tropa[tropaBuscar(tropaSeleccionadaId)].mover(
							desplazamiento
							, 270
							, CAMPO_ANCHO
							, CAMPO_ALTO
							,false
						);
					}
					
					break;
				
				default: 
					document.getElementById(panelOut).innerHTML = "<div class='error'>Ninguna acción seleccionada. Por favor, selecciona alguna y vuelve a intentarlo.</div>";
			}
		}
	};

};