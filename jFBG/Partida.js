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
function Partida(batallaId, terrenoId, panelIn, panelOut, panelFase){
	
	/**** CONSTRUCTOR DEL OBJETO ****/
	
	/***VARIABLES Y CONSTANTES***/
	/**Constantes de juego.*/ 
	var CAMPO_ALTO = 2400;
	var CAMPO_ANCHO = 4000;
	var LONGITUD_CLICK = 500;
	
	/**Posicion de la camara.*/
	var camaraX = 0;
	var camaraY = 0;
	var zoom = 0.2;
	
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
	var userOrder = document.getElementById("userorder").innerHTML;
	var fase = document.getElementById("fase").innerHTML;
	var tropaSeleccionadaId = -1;
	var tropaSeleccionadaPreviaId = -1;
	var fichaTropa = document.getElementsByClassName("tropapropia");
	var fichaTropaEnemiga = document.getElementsByClassName("tropaenemiga");
	var tropa = [];
	
	/**Metodos ejecutados al inicio:*/
	tropasIniciar();
	situacionConstruir();
	panelFaseConstruir();
	
		
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
	document.getElementById("panelfase").onsubmit = accionFase;
	
	
	/**METODOS DE MANTENIMIENTO Y CONSTRUCCI�N*/
	/**
	 * M�todo que inicializa las tropas de la batalla.
	 * Para ello asocia a cada objeto tropa la informacion contenida a un elemento de clase tropa existente en el DOM.
	 */
	function tropasIniciar(){
		for(var i=0;i<fichaTropa.length;i++){
			tropa[i] = new  Tropa(fichaTropa[i].id,panelOut);
		}
		for(var i=fichaTropa.length;i<fichaTropa.length+fichaTropaEnemiga.length;i++){
			tropa[i] = new  Tropa(fichaTropaEnemiga[i-fichaTropa.length].id,panelOut);
		}
	};
	
	
	
	/**
	 * M�todo que nos construye el batalla.
	 */
	function situacionConstruir(){
		/**Comprobamos si la batalla entra en la pantalla.*/
		
		/**Establecemos la batalla.*/
		batalla.width = Math.round(CAMPO_ANCHO*zoom);
		batalla.height = Math.round(CAMPO_ALTO*zoom);
		batalla.style.zIndex = "2";
		batalla.style.backgroundColor = "transparent";
		batalla.style.cursor = "pointer";
		
		/**Establecemos el terreno.*/
		terreno.width = Math.round(CAMPO_ANCHO*zoom);
		terreno.height = Math.round(CAMPO_ALTO*zoom);
		terreno.style.position = "absolute";
		terreno.style.zIndex = "1";
		
		/**Establecemos la situacion*/
		situacion.fillStyle = "black";
		
		/**Establecemos la camara.*/
		camaraMover(0,0);
		
		/**Mostramos el zoom.*/
		showZoom();
		
		/**Establecemos representacion visual de las tropas en ell canvas batalla*/
		tropasDisponer();
	};
	
	
	
	/**
	 * M�todo que posiciona las tropas en la batalla.
	 */
	function tropasDisponer(){
		for(var i=0;i<tropa.length;i++){
			tropa[i].posicionar(situacion,zoom);
		}
	};
	
	
	/**
	 * M�todo que establece el panel de la fase actual.
	 * Los contenidos se incluyen mediante js, lo cual hace, para desgracia de los programadores, se formen estas mega lineas de c�digo.
	 * En todo caso no preocuparse, estas lineas son etiquetas de html, el motivo de que sean tan extensas es que
	 * si una etiqueta no se cierra cuando finaliza la sentencia en que modificamos el innerHTML, el propio navegador la cierra por su cuenta,
	 * con lo que todo el contenido que fueramos a meter dentro aparecer� fuera y habr� una etiqueta de cierre adicional. 
	 */
	function panelFaseConstruir(){
		switch(fase){
			case "Despliegue":
				if(tropaSeleccionadaId != -1){
					if(tropa[tropaBuscar(tropaSeleccionadaId)].getUser()){
						if(tropaSeleccionadaPreviaId != -1 && tropaSeleccionadaPreviaId != tropaSeleccionadaId ){
							if(tropa[tropaBuscar(tropaSeleccionadaPreviaId)].getUser()){
								document.getElementById("textofase").innerHTML = "<b id=\"seleccionActual\">"+tropa[tropaBuscar(tropaSeleccionadaId)].getNombre()+"</b>";
								document.getElementById("tablafase").innerHTML = "<tr><td><label for=\"combinar\">Combinar con "+tropa[tropaBuscar(tropaSeleccionadaPreviaId)].getNombre()+" </label></td><td><input id=\"combinar\" name=\"combinar\" type=\"checkbox\" value=\"si\"/></td></tr>";
								document.getElementById("tablafase").innerHTML += "<tr><td><label for=\"latitud\">Latitud: </label></td><td><input id=\"latitud\" name=\"latitud\" type=\"text\" value=\"\" size=\"4\" maxlength=\"4\"/></td></tr>";
								document.getElementById("tablafase").innerHTML += "<tr><td><label for=\"altitud\">Altitud: </label></td><td><input id=\"altitud\" name=\"altitud\" type=\"text\" value=\"\" size=\"4\" maxlength=\"4\"/></td></tr>";
								document.getElementById("tablafase").innerHTML += "<tr><td><label for=\"orientacion\">Orientacion: </label></td><td><input id=\"orientacion\" name=\"orientacion\" type=\"text\" value=\"\" size=\"4\" maxlength=\"3\"/></td></tr>";
								document.getElementById("tablafase").innerHTML += "<tr><td><label for=\"anchofila\">Unidades por fila</label></td><td><select id=\"anchofila\" name=\"anchofila\"><option value=\"5\" select=\"selected\">5</option><option value=\"6\">6</option><option value=\"7\">7</option><option value=\"8\">8</option><option value=\"9\">9</option><option value=\"10\">10</option></select></td></tr>";
								document.getElementById("textofase").innerHTML += "&nbsp; &nbsp; <input id=\"desplegar\" type=\"submit\" value=\"Desplegar\"/>";
							}
							else{
								document.getElementById("textofase").innerHTML = "<b id=\"seleccionActual\">"+tropa[tropaBuscar(tropaSeleccionadaId)].getNombre()+"</b>";
								document.getElementById("tablafase").innerHTML == "<tr><td><label for=\"latitud\">Latitud: </label></td><td><input id=\"latitud\" name=\"latitud\" type=\"text\" value=\"\" size=\"4\" maxlength=\"4\"/></td></tr>";
								document.getElementById("tablafase").innerHTML += "<tr><td><label for=\"altitud\">Altitud: </label></td><td><input id=\"altitud\" name=\"altitud\" type=\"text\" value=\"\" size=\"4\" maxlength=\"4\"/></td></tr>";
								document.getElementById("tablafase").innerHTML += "<tr><td><label for=\"orientacion\">Orientacion: </label></td><td><input id=\"orientacion\" name=\"orientacion\" type=\"text\" value=\"\" size=\"4\" maxlength=\"3\"/></td></tr>";
								document.getElementById("tablafase").innerHTML += "<tr><td><label for=\"anchofila\">Unidades por fila</label></td><td><select id=\"anchofila\" name=\"anchofila\"><option value=\"5\" select=\"selected\">5</option><option value=\"6\">6</option><option value=\"7\">7</option><option value=\"8\">8</option><option value=\"9\">9</option><option value=\"10\">10</option></select></td></tr>";
								document.getElementById("textofase").innerHTML += "&nbsp; &nbsp; <input id=\"desplegar\" type=\"submit\" value=\"Desplegar\"/>";
							}
						}
						else{
							document.getElementById("textofase").innerHTML = "<b id=\"seleccionActual\">"+tropa[tropaBuscar(tropaSeleccionadaId)].getNombre()+"</b>";
							document.getElementById("tablafase").innerHTML = "<tr><td><label for=\"latitud\">Latitud: </label></td><td><input id=\"latitud\" name=\"latitud\" type=\"text\" value=\"\" size=\"4\" maxlength=\"4\"/></td></tr>";
							document.getElementById("tablafase").innerHTML += "<tr><td><label for=\"altitud\">Altitud: </label></td><td><input id=\"altitud\" name=\"altitud\" type=\"text\" value=\"\" size=\"4\" maxlength=\"4\"/></td></tr>";
							document.getElementById("tablafase").innerHTML += "<tr><td><label for=\"orientacion\">Orientacion: </label></td><td><input id=\"orientacion\" name=\"orientacion\" type=\"text\" value=\"\" size=\"4\" maxlength=\"3\"/></td></tr>";
							document.getElementById("tablafase").innerHTML += "<tr><td><label for=\"anchofila\">Unidades por fila</label></td><td><select id=\"anchofila\" name=\"anchofila\"><option value=\"5\" select=\"selected\">5</option><option value=\"6\">6</option><option value=\"7\">7</option><option value=\"8\">8</option><option value=\"9\">9</option><option value=\"10\">10</option></select></td></tr>";
							document.getElementById("textofase").innerHTML += "&nbsp; &nbsp; <input id=\"desplegar\" type=\"submit\" value=\"Desplegar\"/>";
						}
					}
					else{
						document.getElementById("textofase").innerHTML = "<p>Por favor, elija una tropa en el panel de control.</p>";
					}
				}
				else{
					document.getElementById("textofase").innerHTML = "<p>Por favor, elija una tropa en el panel de control.</p>";
				}
			break;
			case "Declaracion de Cargas":
				if(tropaSeleccionadaId != -1 && tropaSeleccionadaPreviaId != -1){
					/**Si la tropa seleccionada pertenece al usuario y la previa no:*/
					if(tropa[tropaBuscar(tropaSeleccionadaId)].getUser() && !tropa[tropaBuscar(tropaSeleccionadaPreviaId)].getUser()){
						switch(tropaFrenteVer(tropa[tropaBuscar(tropaSeleccionadaId)],tropa[tropaBuscar(tropaSeleccionadaPreviaId)])){
							case 0:
								document.getElementById("textoFase").innerHTML = "La tropa <b>"+tropa[tropaBuscar(tropaSeleccionadaId)].getNombre()+"</b> no puede ver a la tropa enemiga <b>"+tropa[tropaBuscar(tropaSeleccionadaPreviaId)].getNombre()+"</b>.";
								break;
							case 1:
								document.getElementById("textoFase").innerHTML = "La tropa <b>"+tropa[tropaBuscar(tropaSeleccionadaId)].getNombre()+"</b> ve a la tropa enmiga <b>"+tropa[tropaBuscar(tropaSeleccionadaPreviaId)].getNombre()+"</b> de frente.<br/>";
								document.getElementById("textoFase").innerHTML += "&nbsp; &nbsp; <input id=\"cargar\" type=\"submit\" value=\"Cargar\"/>";
								break;
							case 2:
								document.getElementById("textoFase").innerHTML = "La tropa <b>"+tropa[tropaBuscar(tropaSeleccionadaId)].getNombre()+"</b> ve el flanco izquierdo de la tropa enemiga <b>"+tropa[tropaBuscar(tropaSeleccionadaPreviaId)].getNombre()+"</b>.<br/>";
								document.getElementById("textoFase").innerHTML += "&nbsp; &nbsp; <input id=\"cargar\" type=\"submit\" value=\"Cargar\"/>";
								break;
							case 3:
								document.getElementById("textoFase").innerHTML = "La tropa <b>"+tropa[tropaBuscar(tropaSeleccionadaId)].getNombre()+"</b> ve el flanco derecho de la tropa enemiga <b>"+tropa[tropaBuscar(tropaSeleccionadaPreviaId)].getNombre()+"</b>.<br/>";
								document.getElementById("textoFase").innerHTML += "&nbsp; &nbsp; <input id=\"cargar\" type=\"submit\" value=\"Cargar\"/>";
								break;
							case 4:
								document.getElementById("textoFase").innerHTML = "La tropa <b>"+tropa[tropaBuscar(tropaSeleccionadaId)].getNombre()+"</b> ve la retauardia de la tropa enemiga <b>"+tropa[tropaBuscar(tropaSeleccionadaPreviaId)].getNombre()+"</b>.<br/>";
								document.getElementById("textoFase").innerHTML += "&nbsp; &nbsp; <input id=\"cargar\" type=\"submit\" value=\"Cargar\"/>";
								break;
							default:
								document.getElementById("textoFase").innerHTML = "La tropa <b>"+tropa[tropaBuscar(tropaSeleccionadaId)].getNombre()+"</b> no puede ver a la tropa enemiga <b>"+tropa[tropaBuscar(tropaSeleccionadaPreviaId)].getNombre()+"</b>.";
						}
					}
					/**Si la tropa seleccionada no pertenece al usuario y la previa si:*/
					if(tropa[tropaBuscar(tropaSeleccionadaPreviaId)].getUser() && !tropa[tropaBuscar(tropaSeleccionadaId)].getUser()){
						switch(tropaFrenteVer(tropa[tropaBuscar(tropaSeleccionadaPreviaId)],tropa[tropaBuscar(tropaSeleccionadaId)])){
							case 0:
								document.getElementById("textoFase").innerHTML = "La tropa <b>"+tropa[tropaBuscar(tropaSeleccionadaPreviaId)].getNombre()+"</b> no puede ver a la tropa enemiga <b>"+tropa[tropaBuscar(tropaSeleccionadaId)].getNombre()+"</b>.";
							break;
							case 1:
								document.getElementById("textoFase").innerHTML = "La tropa <b>"+tropa[tropaBuscar(tropaSeleccionadaPreviaId)].getNombre()+"</b> ve a la tropa enmiga <b>"+tropa[tropaBuscar(tropaSeleccionadaId)].getNombre()+"</b> de frente.<br/>";
								document.getElementById("textoFase").innerHTML += "&nbsp; &nbsp; <input id=\"cargar\" type=\"submit\" value=\"Cargar\"/>";
								break;
							case 2:
								document.getElementById("textoFase").innerHTML = "La tropa <b>"+tropa[tropaBuscar(tropaSeleccionadaPreviaId)].getNombre()+"</b> ve el flanco izquierdo de la tropa enemiga <b>"+tropa[tropaBuscar(tropaSeleccionadaId)].getNombre()+"</b>.<br/>";
								document.getElementById("textoFase").innerHTML += "&nbsp; &nbsp; <input id=\"cargar\" type=\"submit\" value=\"Cargar\"/>";
								break;
							case 3:
								document.getElementById("textoFase").innerHTML = "La tropa <b>"+tropa[tropaBuscar(tropaSeleccionadaPreviaId)].getNombre()+"</b> ve el flanco derecho de la tropa enemiga <b>"+tropa[tropaBuscar(tropaSeleccionadaId)].getNombre()+"</b>.<br/>";
								document.getElementById("textoFase").innerHTML += "&nbsp; &nbsp; <input id=\"cargar\" type=\"submit\" value=\"Cargar\"/>";
								break;
							case 4:
								document.getElementById("textoFase").innerHTML = "La tropa <b>"+tropa[tropaBuscar(tropaSeleccionadaPreviaId)].getNombre()+"</b> ve la retauardia de la tropa enemiga <b>"+tropa[tropaBuscar(tropaSeleccionadaId)].getNombre()+"</b>.<br/>";
								document.getElementById("textoFase").innerHTML += "&nbsp; &nbsp; <input id=\"cargar\" type=\"submit\" value=\"Cargar\"/>";
								break;
							default:
								document.getElementById("textoFase").innerHTML = "La tropa <b>"+tropa[tropaBuscar(tropaSeleccionadaPreviaId)].getNombre()+"</b> no puede ver a la tropa enemiga <b>"+tropa[tropaBuscar(tropaSeleccionadaId)].getNombre()+"</b>.";
						}
					}
					/**Si ambas tropas pertenecen al usuario*/
					if(tropa[tropaBuscar(tropaSeleccionadaPreviaId)].getUser() && tropa[tropaBuscar(tropaSeleccionadaId)].getUser() || !tropa[tropaBuscar(tropaSeleccionadaPreviaId)].getUser() && !tropa[tropaBuscar(tropaSeleccionadaId)].getUser()){
						document.getElementById("textoFase").innerHTML = "Las tropas <b>"+tropa[tropaBuscar(tropaSeleccionadaPreviaId)].getNombre()+"</b> y <b>"+tropa[tropaBuscar(tropaSeleccionadaId)].getNombre()+"</b> son aliadas. Carga con una de tus tropas a una tropa enemiga.";
					}
				}
				/**Si ninguna de las tropas seleccionadas pertenece al usuario*/
				else{
					document.getElementById("textoFase").innerHTML = "Por favor, elija una tropa con que cargar o a la que cargar.";
				}
			break;
			default: document.getElementById(panelOut).innerHTML = "Error, fase desconocida. Visite FAQ para mas informaci�n.";
		}
	};

		
	
	
	
	/**METODOS DE SALIDA*/
	/**
	 * M�todo para mostrar en la web el zoom.
	 */
	function showZoom(){
		document.getElementById("zoom").innerHTML = "Zoom "+Math.round(zoom*100)+"%";
	};
	
		
	
	/**
	 * M�todo para mostrar en la web la posicion del curosor.
	 */
	function showCursor(e){
		if(cursorDentro){
			document.getElementById("cursorX").innerHTML = "X: "+Math.round(posicionCursor(e).x)+"";
			document.getElementById("cursorY").innerHTML = "Y: "+Math.round(posicionCursor(e).y)+"";
		}
		else{
			document.getElementById("cursorX").innerHTML = "X: --";
			document.getElementById("cursorY").innerHTML = "Y: --";
		}
	};

		
	
	/**
	 * M�todo para establecer la camara en una posicion concreta.
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
	 * M�todo para mover la camara.
	 * 
	 * @param x Incremento de la posicion de la camara en el eje X.
	 * @param y Incremento de la posicion de la camara en el eje Y.
	 */
	function camaraMover(x,y){
		/**Fijamos las nuevas coordenadas teniendo en cuenta el zoom.*/
		camaraX += x*zoom;
		camaraY += y*zoom;
		
		if(camaraX < 800-batalla.width){
			camaraX = 800-batalla.width;
		}
		if(camaraX > 0){
			camaraX = 0;
		}
		if(camaraY < 480-batalla.height){
			camaraY = 480-batalla.height;
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
	 * M�todo para ampliar la camara.
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
			if(zoom<0.2){
				zoom = 0.2;
			}
			
			/**Establecemos un m�nimo.*/
			if(zoom>1.5){
				zoom = 1.5;
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
	
		
	
	
	
	/**METODOS DE TRATAMIENTO DE LAS TROPAS*/
	/**
	 * M�todo que localiza una tropa en funcion de su id.
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
	 * M�todo que establece una tropa como seleccion
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
		document.getElementById(tropaId+"selected").selected="selected";
		document.getElementById(tropaId).style.display="block";
		panelFaseConstruir();
	};
	
		
	
	/**
	 * M�todo que comprueba que una tropa no colisione con ninguna otra.
	 * 
	 * @param tropaId id de la tropa que se ha de comparar.
	 */
	function tropaColision(tropaId){
		var colision = false;
		for(var i=0;i<tropa.length;i++){
			/**Si la tropa est� en campo, comparamos los puntos de ambas tropas.*/
			if(tropa[i].getEnCampo() && i!=tropaBuscar(tropaId)){
				if(tropa[i].colision(tropa[tropaBuscar(tropaId)].getVanguardiaSiniestra().x,tropa[tropaBuscar(tropaId)].getVanguardiaSiniestra().y)){
					colision=true;
				}else if(tropa[i].colision(tropa[tropaBuscar(tropaId)].getVanguardiaDiestra().x,tropa[tropaBuscar(tropaId)].getVanguardiaDiestra().y)){
					colision=true;
				}else if(tropa[i].colision(tropa[tropaBuscar(tropaId)].getRetaguardiaSiniestra().x,tropa[tropaBuscar(tropaId)].getRetaguardiaSiniestra().y)){
					colision=true;
				}else if(tropa[i].colision(tropa[tropaBuscar(tropaId)].getRetaguardiaDiestra().x,tropa[tropaBuscar(tropaId)].getRetaguardiaDiestra().y)){
					colision=true;
				}else if(tropa[tropaBuscar(tropaId)].colision(tropa[i].getVanguardiaSiniestra().x,tropa[i].getVanguardiaSiniestra().y)){
					colision=true;
				}else if(tropa[tropaBuscar(tropaId)].colision(tropa[i].getVanguardiaDiestra().x,tropa[i].getVanguardiaDiestra().y)){
					colision=true;
				}else if(tropa[tropaBuscar(tropaId)].colision(tropa[i].getRetaguardiaSiniestra().x,tropa[i].getRetaguardiaSiniestra().y)){
					colision=true;
				}else if(tropa[tropaBuscar(tropaId)].colision(tropa[i].getRetaguardiaDiestra().x,tropa[i].getRetaguardiaDiestra().y)){
					colision=true;
				}
			}
		}
		return colision;
	};
	
		
	
	/**
	 * M�todo que determina si se hace click sobre una tropa.
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
	 * M�todo que comprueba si una tropa ve a otra.
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
	 * M�todo que comprueba los frentes disponibles m�s pr�ximos 
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
	 * M�todo que evalua el punto m�s proximo de una tropa objetivo a el frente de una tropa dada.
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
	/**
	 * M�todo que muestra la posicion absoluta de un elemento
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
	 * M�todo que muestra la posicion del cursor dentro de un elemento.
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
	 * M�todo que calcula la distancia entre dos puntos.
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
	 * M�todo que comprueba que un punto est� contenido en una recta,
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
	 * M�todo que comprueba si la linea entre dos puntos, de dos tropas, est� despejada.
	 * 
	 * @param p1 coordenadas del punto uno (ha de tener indices "x" e "y").
	 * @param p2 coordenadas del punto dos (ha de tener indices "x" e "y").
	 * @param t1ID tropa implicada en la linea de visi�n.
	 * @param t2ID tropa implicada en la linea de visi�n.
	 * @return devolver� un valor booleano. En caso de que NINGUNA tropa bloquee la linea de visi�n devolver� true.
	 */
	function lineaLibre(p1,p2,t1ID,t2ID){
		for(var i=0;i<tropa.length;i++){
			if(tropa[i].getId()!=t1ID && tropa[i].getId()!=t2ID){
				if(tropa[i].bloqueaLinea(p1.x,p1.y,p2.x,p2.y)){
					return false;
				}
			}
		}
		return true;
	};

		
	
	
	
	/**METODOS DE CONTROL DE EVENTOS*/
	/**
	 * M�todo que establece los sucesos el cursor entra a la batalla.
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
	 * M�todo que establece los sucesos el cursor sale del batalla.
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
			case "Despliegue":
				if(tropaSeleccionadaId != -1){
					if(tropaColision(tropaSeleccionadaId)){
						tropa[tropaBuscar(tropaSeleccionadaId)].retirar();
						document.getElementById(panelOut).innerHTML = "Tropa no desplegada. Ya hay otra tropa en el lugar deseado.";
					}
				}
				break;
			case "Declaracion de Cargas":
				break;
			default: document.getElementById(panelOut).innerHTML = "Error, fase desconocida. Visite FAQ para mas informaci�n.";
		}
		showCursor(e);
	};

		
	
	/**
	 * M�todo que establece los sucesos cuando se mueve el cursor.
	 * 
	 * @param e Evento que lanzo el metodo.
	 */
	 function cursorMover(e){
		/**Prevenimos los efectos por defecto del evento.*/
		e.preventDefault();
		
		showCursor(e);
		
		if(cursorPulsado){
			if(clickEnTropa){
				switch(fase){
					case "Despliegue":
						if(tropaSeleccionadaId != -1){
							if(tropa[tropaBuscar(tropaSeleccionadaId)].getUser()){
								if(document.getElementById(tropaSeleccionadaId+"tropaadoptivaid").innerHTML != "-1"){
									tropa[tropaBuscar(document.getElementById(tropaSeleccionadaId+"tropaadoptivaid").innerHTML)].sacar(tropaSeleccionadaId);
								}
								tropa[tropaBuscar(tropaSeleccionadaId)].arrastrar(posicionCursor(e).x,posicionCursor(e).y,CAMPO_ANCHO,CAMPO_ALTO,userOrder);
								situacionConstruir();
							}
						}
						break;
				}
			}
			else{
				/**Cambiamos la posicion de la camara*/
				camaraMover(Math.round(posicionCursor(e).x - posicionInicioClick.x) , Math.round(posicionCursor(e).y - posicionInicioClick.y));
			}
		}
		else{
			switch(fase){
				case "Declaracion de Cargas":
					if(tropaSeleccionadaId != -1){
						if(tropa[tropaBuscar(tropaSeleccionadaId)].getUser()){
						}
					}
					break;
			}
		}
	};
	
		
	
	/**
	 * M�todo que establece los sucesos cuando se pulsa el cursor.
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
	 * M�todo que establece los sucesos cuando se suelta el cursor.
	 * 
	 * @param e Evento que lanzo el metodo.
	 */
	 function cursorSoltar(e){
		/**Prevenimos los efectos por defecto del evento.*/
		e.preventDefault();
	
		/**Indicamos que ya no se est� pulsando el cursor.*/
		cursorPulsado = false;
		clickEnTropa = false;
		
		switch(fase){
			case "Despliegue":
				if(tropaSeleccionadaId != -1){
					if(tropaColision(tropaSeleccionadaId)){
						tropa[tropaBuscar(tropaSeleccionadaId)].retirar();
						document.getElementById(panelOut).innerHTML = "Tropa no desplegada. Ya hay otra tropa en el lugar deseado.";
					}
				}
				break;
			case "Declaracion de Cargas":
				break;
			default:
				document.getElementById(panelOut).innerHTML = "Error, fase desconocida. Visite FAQ para mas informaci�n.";
		}
		situacionConstruir();
	};
	
		
	
	/**
	 * M�todo que establece los sucesos cuando se hace click.
	 * 
	 * NOTA: est� m�todo es privileged,
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
	 * M�todo que establece los sucesos cuando se hace doble click.
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
					if(tropa[i].colision(posicionCursor(e).x,posicionCursor(e).y)){
						tropaSeleccionar(tropa[i].getId());
					}
				}
			}
		}
		else{
			switch(fase){
				case "Despliegue": /**En la fase de despliegue, al hacer doble click:*/
					if(tropaSeleccionadaId != -1){
						if(tropa[tropaBuscar(tropaSeleccionadaId)].getUser()){
							/**Sacamos las unidades de la unidad adoptiva en caso de que se encontraran en una.*/
							if(document.getElementById(tropaSeleccionadaId+"tropaadoptivaid").innerHTML != "-1"){
								tropa[tropaBuscar(document.getElementById(tropaSeleccionadaId+"tropaadoptivaid").innerHTML)].sacar(tropaSeleccionadaId);
							}
							/**Y la desplegamos en la posicion del dobleclick.*/
							tropa[tropaBuscar(tropaSeleccionadaId)].desplegar(posicionCursor(e).x,posicionCursor(e).y,0,5,CAMPO_ANCHO,CAMPO_ALTO,userOrder);
							document.getElementById(tropaSeleccionadaId+"tropaadoptiva").innerHTML = "--";
							/**Si la tropa choca con otra, la retiramos.*/
							if(tropaColision(tropaSeleccionadaId)){
								tropa[tropaBuscar(tropaSeleccionadaId)].retirar();
								document.getElementById(panelOut).innerHTML += "Ya hay otra tropa en el lugar deseado.";
							}
						}
					}
					break;
				case "Declaracion de Cargas":
					break;
				default: 
					document.getElementById(panelOut).innerHTML = "Error, fase desconocida. Visite FAQ para mas informaci�n.";
			}
		}
		situacionConstruir();
		panelFaseConstruir();
	};
	
		
	
	/**
	 * M�todo que establece los sucesos cuando se usa el scroll sobre el batalla.
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
	 * M�todo que establece los sucesos
	 * cuando se actualiza el panel de entrada de la pagina.
	 * 
	 * @param e Evento que lanzo el metodo.
	 */
	 function panelInActualizado(e){
		/**Prevenimos los efectos por defecto del evento.*/
		e.preventDefault();
		
		if(e.target.name = "tropaseleccionada"){
			tropaSeleccionar(e.target.value);
		}
		situacionConstruir();
		panelFaseConstruir();
	};
	
		
	
	/**
	 * M�todo que establece los sucesos
	 * cuando se submite el panel de la fase.
	 * 
	 * @param e Evento que lanzo el metodo.
	 */
	 function accionFase(e){
		/**Prevenimos los efectos por defecto del evento.*/
		e.preventDefault();
		switch(fase){
			case "Despliegue": /**El panel de fase "Despliegue" */
				/**contiene los elementos necesarios para el despliegue.*
				 *Las unidades se desplegaran en funcion de lso datos aportados.*/
				if(tropaSeleccionadaId != -1){
					if(tropa[tropaBuscar(tropaSeleccionadaId)].getUser()){
						var x = document.getElementById("latitud").value;
						var y = document.getElementById("altitud").value;
						var angle = document.getElementById("orientacion").value;
						var anchoFila = document.getElementById("anchofila").value;
						var tropaPadre = -1;
						if (tropaSeleccionadaPreviaId != -1){
							if(document.getElementById("combinar").checked){
								tropaPadre=tropaSeleccionadaPreviaId;
							}
						}
					
						if(x*0 != 0){
							x=0;
							document.getElementById(panelOut).innerHTML = "Latitud erronea.";
						}
						if(y*0 != 0){
							y=0;
							document.getElementById(panelOut).innerHTML = "Altitud erronea.";
						}
						if(angle*0 != 0){
							angle=0;
							document.getElementById(panelOut).innerHTML = "Orientacion erronea.";
						}
						while(angle>=360){
							angle-=360;
						}
						if(tropaPadre != -1){
							if(tropa[tropaBuscar(tropaPadre)].getEnCampo()){
								if(tropa[tropaBuscar(tropaSeleccionadaId)].getRangoBajo()>4){
									tropa[tropaBuscar(tropaPadre)].adoptar(tropaSeleccionadaId);
									tropa[tropaBuscar(tropaSeleccionadaId)].incorporar(tropaPadre);
									document.getElementById(tropaSeleccionadaId+"tropaadoptiva").innerHTML = tropa[tropaBuscar(tropaPadre)].getNombre();
								}
								else{
									document.getElementById(panelOut).innerHTML = "Tropa no desplegada. Solo los personajes se pueden unir a otras tropas.";
								}
							}
							else{
								document.getElementById(panelOut).innerHTML = "Tropa no desplegada. La tropa con que la quieres combinar no est� en campo.";
							}
						}
						else{
							if(document.getElementById(tropaSeleccionadaId+"tropaadoptivaid").innerHTML != "-1"){
								tropa[tropaBuscar(document.getElementById(tropaSeleccionadaId+"tropaadoptivaid").innerHTML)].sacar(tropaSeleccionadaId);
							}
							tropa[tropaBuscar(tropaSeleccionadaId)].desplegar(x,y,angle,anchoFila,CAMPO_ANCHO,CAMPO_ALTO,userOrder);
							if(tropaColision(tropaSeleccionadaId)){
								tropa[tropaBuscar(tropaSeleccionadaId)].retirar();
								document.getElementById(panelOut).innerHTML += "Tropa no desplegada. Ya hay otra tropa en el lugar deseado.";
							}
						}
					}
				}
				break;
			case "Declaracion de Cargas":
				if(tropaSeleccionadaId!=-1 && tropaSeleccionadaPreviaId!=-1){
					/**Caso en que la tropa seleccionada pertenece al usuario*/
					if(tropa[tropaBuscar(tropaSeleccionadaId)].getUser() && !tropa[tropaBuscar(tropaSeleccionadaPreviaId)].getUser()){
						/**Evaluamos si la tropa del usuario ve a la del adversario*/
						var frenteDeCarga = tropaFrenteVer(tropa[tropaBuscar(tropaSeleccionadaId)],tropa[tropaBuscar(tropaSeleccionadaPreviaId)]);
						switch(frenteDeCarga){
							default: alert(frenteDeCarga);
						}
					}
					/**Caso en que la anterior tropa seleccionada pertenece al usuario*/
					if(!tropa[tropaBuscar(tropaSeleccionadaId)].getUser() && tropa[tropaBuscar(tropaSeleccionadaPreviaId)].getUser()){
						/**Evaluamos si la tropa del usuario ve a la del adversario*/
						var frenteDeCarga = tropaFrenteVer(tropa[tropaBuscar(tropaSeleccionadaPreviaId)],tropa[tropaBuscar(tropaSeleccionadaId)]);
						switch(frenteDeCarga){
							default: alert(frenteDeCarga);
						}
					}
				}
				break;
			default: 
				document.getElementById(panelOut).innerHTML = "Error, fase desconocida. Visite FAQ para mas informaci�n.";
		}
		situacionConstruir();
		panelFaseConstruir();
	};
};