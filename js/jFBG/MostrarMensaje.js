/**
 * Clase que gestiona los contenidos de una página.
 * Tiene como objetivo poner en practica el principio Big Cookie.
 * Los objetos de clase Mostrar mensaje, tienen como objetivo,
 * tras haber recibido gran cantidad de datos ("mensajes"),
 * y haberlos ocultado a la visión del usuario,
 * poder elegir cuales de ellos se muestran.
 * De este modo el usuario puede, con una sola peticion a servidor,
 * ver todos los ("mensajes") de uno en uno.
 * 
 * El parámetro CA tiene como objetivo su uso en posibles ampliaciones de código.
 * 
 * @param mensajesOcultosClass String - Atributo class que identifica el selector que permite mostrar un mensaje concreto.
 * @param expositor Element - Elemento en que se mostrara el mensaje seleccionado.
 * @param tipo integer - Tipo de mensaje. Tiene como objetivo reciclar esta clase a fin de aplicarla a diferentes contenidos.
 * @param ca AsinCronos - Objeto que gestiona una comunicación asíncrona.
 */
function MostrarMensaje(mensajesOcultosClass,expositor,tipo,ca){
	/**** CONSTRUCTOR DEL OBJETO ****/
	/***VARIABLES DEL OBJETO***/
	var pulsado=false;

		
	/***ASIGNACIÓN DE EVENTOS***/
	var mensajesOcultos = document.getElementsByClassName(mensajesOcultosClass);
	for(var i=0;i<mensajesOcultos.length;i++){
		mensajesOcultos[i].onclick = mostrar;
		mensajesOcultos[i].onmouseover = cEncima;
		mensajesOcultos[i].onmouseout = cFuera;
		mensajesOcultos[i].onmousedown = cPulsado;
	}
	
	
	/***MÉTODOS Y FUNCIONES***/
	/**
	 * Método que determina la forma en que se muestra el mensaje.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function mostrar(e){
		switch(tipo){
			case 1: mostrarCorreo(e.target); break;
			case 2: mostrarPartida(e.target); break;
			case 3: mostrarLista(e.target); break;
			default:;
		}
	};

		
	/**
	 * Método que se ejecuta para resaltar que el cursor está sobre el elemento.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function cEncima(e){
		/**Prevenimos eventos por defecto*/
		e.preventDefault();
		
		if(e.target != null){
			e.target.style.textShadow="2px 2px 2px #CBD126";
		}
	};

		
	/**
	 * Método que se ejecuta para resaltar que el cursor salio del elemento.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function cFuera(e){
		/**Prevenimos eventos por defecto*/
		e.preventDefault();
		
		cSoltar(e);	
		
		if(e.target != null){
			e.target.style.color="white";
			e.target.style.textShadow="none";
		}
	};

	
	/**
	 * Método que se ejecuta para resaltar que el cursor está pulsado sobre el elemento.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function cPulsado(e){
		/**Prevenimos eventos por defecto*/
		e.preventDefault();
	
		pulsado=true;
		
		if(e.target != null){
			e.target.style.color="#F9FF45";
		}
	};

		
	/**
	 * Método que se ejecuta para resaltar que el cursor dejo de estar pulsado sobre el elemento.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function cSoltar(e){
		if(pulsado){
			pulsado = false;
			if(e.target != null){
				e.target.style.color="white";
				e.target.style.textShadow="none";
			}
		}
	};
	
	
	/**
	 * Método usado para mostar como mensaje un correo dell buzón.
	 * Anotación: Un correo es un tipo de mensaje.
	 * 
	 * @param elemento Element - Elemento que contiene el conjunto del correo.
	 */
	function mostrarCorreo(elemento){
		document.getElementById("correoTitle").innerHTML = elemento.innerHTML;
		document.getElementById("correoEmisor").innerHTML = document.getElementById("emisor"+elemento.id).innerHTML;
		document.getElementById("correoFecha").innerHTML = document.getElementById("fecha"+elemento.id).innerHTML;
		
		/**Tratamos el contenido en función del tipo de correo*/
		expositor.innerHTML = contenido(elemento,document.getElementById("tipo"+elemento.id).innerHTML);
		expositor.appendChild(addOpciones(elemento,document.getElementById("tipo"+elemento.id).innerHTML));
		activarOpciones(elemento,document.getElementById("tipo"+elemento.id).innerHTML);
	};
	
	
	/**
	 * Método usado para mostar como mensaje los datos de una partida.
	 * Anotación: Un correo es un tipo de mensaje.
	 * 
	 * @param elemento Element - Elemento que contiene el conjunto del correo.
	 */
	function mostrarPartida(elemento){
		var desafiador = document.getElementById("desafiador"+elemento.id).innerHTML;
		var desafiado = document.getElementById("desafiado"+elemento.id).innerHTML;
		var puntos = document.getElementById("puntos"+elemento.id).innerHTML;
		
		document.getElementById("tituloPartida").innerHTML = "Partida entre "+desafiador+" y "+desafiado+" a "+puntos+" puntos";
		
		/**Tratamos el contenido*/
		expositor.innerHTML = contenido(elemento,"partida");
		
		if(document.getElementById("fin"+elemento.id).innerHTML == ""){
			expositor.appendChild(addOpciones(elemento,"partida"));
			activarOpciones(elemento,"partida");
		}
	};
	
	
	/**
	 * Método usado para mostrar como mensaje un aviso de seleccion de una lista de ejercito para una partida.
	 * 
	 * @param elemento Element - Elemento que contiene el conjunto de la lista.
	 */
	function mostrarLista(elemento){
		/**Tratamos el contenido*/
		expositor.innerHTML = contenido(elemento,"lista");
		expositor.appendChild(addOpciones(elemento,"lista"));
		activarOpciones(elemento,"lista");
	};
	
	
	/**
	 * Método que estructura el contenido de un Mensaje en función de su tipo.
	 * 
	 * @param elemento Element - Elemento que contiene el conjunto del mensaje.
	 * @param tipo integer - Tipo de mensaje recibido.
	 */
	function contenido(elemento,tipo){
		var contenido = "";
		/**Tratamos el contenido en función del tipo de correo*/
		switch(tipo){
			case "2": //Caso de que sea una petición de amistad.
				contenido += "<p>El usuario '";
				contenido += document.getElementById("emisor"+elemento.id).innerHTML;
				contenido += "' quiere añadirte a su lista de amigos.</p>";
				break;
			case "5":
				contenido += "<p>'";
				contenido += document.getElementById("emisor"+elemento.id).innerHTML;
				contenido += "' te ha desafiado a una batalla de ";
				contenido += document.getElementById("puntos"+elemento.id).innerHTML;
				contenido += " puntos.";
				if(document.getElementById("contenido"+elemento.id).innerHTML != ""){
					contenido += "<br/>Su grito de guerra es: <span class='cursiva'>";
					contenido += document.getElementById("contenido"+elemento.id).innerHTML;
					contenido += "</span>";
				}
				contenido += "</p>";
				contenido += "<p class='cursiva'>";
				contenido += document.getElementById("contenidoDefecto"+elemento.id).innerHTML;
				contenido += "</p>";
				break;
			case "partida":
				contenido += "<table>";
				
				contenido += "<tr>";
				contenido += "<td class='alignLeft'>";
				contenido +=  document.getElementById("fechas"+elemento.id).innerHTML;
				contenido += "</td>";
				contenido += "</tr>";
				
				contenido += "</table>";
				break;
			case "lista":
				contenido += "<p>";
				contenido += "La lista \"";
				contenido += document.getElementById("nombreLista"+elemento.id).value;
				contenido += "\" tiene ";
				contenido += document.getElementById("tropasLista"+elemento.id).value;
				contenido += " tropas que suman un total de ";
				contenido += document.getElementById("ptsLista"+elemento.id).value;
				contenido += " puntos.<br/>¿Quieres seleccionarla?";
				contenido += "</p>";
				break;
			default:
				contenido += "<p class='cursiva'>";
				contenido += document.getElementById("contenidoDefecto"+elemento.id).innerHTML;
				contenido += "</p>";
				contenido += "<p>";
				contenido += document.getElementById("contenido"+elemento.id).innerHTML;
				contenido += "</p>";
		}
		
		return contenido;
	};
	
	/**
	 * Método que aporta a un mensaje las opciones que tiene. Estas dependen del tipo de mensaje.
	 * 
	 * @param elemento Element - Elemento al que añadimos las opciones.
	 * @param tipo integer - Tipo de mensaje a fin de determinar que opciones aplicamos.
	 */
	function addOpciones(elemento,tipo){
		var opciones = document.createElement("div");
		opciones.className = 'alignCenter';
		
		var contenido = "";
		
		/*
		 * Agregamos el contenido de las opciones,
		 * por defecto no se añade nada.
		 */
		switch(tipo){
			case "2":
				contenido += "<form class='submit enviar' id='aceptarAmistad"+elemento.id+"'>";
				contenido += "<img src='src/botones/aceptar.png'/>";
				contenido += "<input type='hidden' name='aceptarAmistad' value='"+document.getElementById("emisorId"+elemento.id).innerHTML+"'/>";
				contenido += "</form>";
	
				contenido += "<form class='submit enviar' id='denegarAmistad"+elemento.id+"'>";
				contenido += "<img src='src/botones/eliminar.png'/>";
				contenido += "<input type='hidden' name='denegarAmistad' value='"+document.getElementById("emisorId"+elemento.id).innerHTML+"'/>";
				contenido += "</form>";
				break;
			
			case "5":
				contenido += "<form class='submit enviar' id='aceptarDesafio"+elemento.id+"'>";
				contenido += "<img src='src/botones/aceptar.png'/>";
				contenido += "<input type='hidden' name='aceptarDesafio' value='"+elemento.id+"'/>";
				contenido += "</form>";
	
				contenido += "<form class='submit enviar' id='denegarDesafio"+elemento.id+"'>";
				contenido += "<img src='src/botones/eliminar.png'/>";
				contenido += "<input type='hidden' name='denegarDesafio' value='"+elemento.id+"'/>";
				contenido += "</form>";
				break;
				
			case "partida":
				contenido += "<form class='submit' id='accederPartida'>";
				contenido += "<img src='src/botones/desafiar.png'/>";
				contenido += "<input type='hidden' id='accesoPartida' value='"+elemento.id+"'/>";
				contenido += "</form>";
				
				contenido += "<form class='submit' id='surrender'>";
				contenido += "<img src='src/botones/eliminar.png'/>";
				contenido += "<input type='hidden' name='surrender' value='"+elemento.id+"'/>";
				contenido += "</form>";
				break;
				
			case "lista":
				contenido += "<form class='submit' id='elegirLista'>";
				contenido += "<img src='src/botones/aceptar.png'/>";
				contenido += "<input type='hidden' name='ejercito' value='"+document.getElementById("ejercitoId").value+"'/>";
				contenido += "<input type='hidden' name='partida' value='"+document.getElementById("partidaId").value+"'/>";
				contenido += "<input type='hidden' name='elegirLista' value='"+elemento.id+"'/>";
				contenido += "</form>";
				break;
			
			default:
				console.log("Default options.")
				contenido += "<form class='submit enviar' id='deleteCorreo"+elemento.id+"'>";
				contenido += "<img src='src/botones/eliminar.png'/>";
				contenido += "<input type='hidden' name='deleteCorreo' value='"+elemento.id+"'/>";
				contenido += "</form>";
		}
		
		opciones.innerHTML = contenido;
		
		return opciones;
	};
	
	/**
	 * Método que activa las opciones de un mensaje.
	 * 
	 * @param elemento Element - Elemento al que pertenecen las opciones.
	 * @param tipo integer - Tipo de mensaje al que pertenecen las opciones.
	 */
	function activarOpciones(elemento,tipo){
		/*
		 * Añadimos los objetos JS asociados a los elementos de las opciones,
		 * por defecto se buscan los objetos de clase enviar
		 * y les asignamos a cada uno un objeto submit que actualiza el buzón
		 */
		switch(tipo){
			case "partida":
				var acceder = document.getElementById("accederPartida");
				
				if(acceder != null){
					acceder = new Submit(14, "accederPartida", acceder, ca)
				}
				
				var rendir = document.getElementById("surrender");
				
				if(rendir != null){
					rendir = new Submit(0, "surrender", rendir, ca)
				}
				break;
				
			case "lista":
				var lista = document.getElementById("elegirLista");
				
				if(lista != null){
					lista = new Submit(0, "elegirLista", lista, ca, 'datos');
				}
				break;
				
			default:
				var envios = document.getElementsByClassName("enviar");
				
				if(envios != null){
					for(var i=0;i<envios.length;i++){
						envios[i] = new Submit(0, envios[i].id, envios[i], ca);
					}
				}
				break;
		}
	};
	
};