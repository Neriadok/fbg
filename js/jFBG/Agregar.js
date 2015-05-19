/**
 * Clase que genera un elemento que permite añadir, a un elemento dado,
 * una cantidad ilimitada de elementos hijos que siguen un mismo patron.
 * 
 * @param botonId String - Id del elemento Boton, que al ser pulsado añadirá un nuevo agregado.
 * @param elementoPadreId String - Id del elemento al que se añadirán los agregados.
 * @param tipoAgregado integer - Define el patron por que se construirá el agregado.
 * @param datos Undefined - Parámetro opcional que nos permite añadir, una información dada a los agregados.
 */
function Agregar(botonId,elementoPadreId,tipoAgregado,datos){

	/**** CONSTRUCCIÓN DEL OBJETO ****/
	/***VARIABLES DEL OBJETO***/
	var numeroAgregados=0;
	var pulsado = false;

		
	/***ASIGNACIÓN DE EVENTOS***/
	document.getElementById(botonId).onclick = agregar;
	document.getElementById(botonId).onmouseover = cEncima;
	document.getElementById(botonId).onmouseout = cFuera;
	document.getElementById(botonId).onmousedown = cPulsado;
	
		
	/***MÉTODOS PRIVADOS***/

	/**
	 * Método que se ejecuta para resaltar que el cursor está sobre el elemento boton. 
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function cEncima(e){
		/**Prevenimos eventos por defecto*/
		e.preventDefault();
		
		if(document.getElementById(botonId) != null){
			document.getElementById(botonId).style.borderColor="#F9FF45";
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
		
		if(document.getElementById(botonId) != null){
			document.getElementById(botonId).style.borderColor="#CBD126";
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

		if(document.getElementById(botonId) != null){
			document.getElementById(botonId).style.boxShadow="3px 3px 3px grey";
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
			if(document.getElementById(botonId) != null){
				document.getElementById(botonId).style.boxShadow="none";
			}
		}
	};
	
		
	/**
	 * Método que agrega un nuevo elemento agregado al elemento padre.
	 * El agragado en cuestion estará definido por su tipo.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function agregar(e){
		var agregado;
		
		switch(tipoAgregado){
			case 1: agregado = nuevaCategoria(); break;
			case 2: agregado = nuevoForo(); break;
			case 3: agregado = nuevaTropa(); break;
			case 4: agregado = nuevoPersonaje(); break;
			default: agregado = document.createElement("span");
		}
		
		document.getElementById(elementoPadreId).appendChild(agregado);
		numeroAgregados++;
		if(tipoAgregado == 3 || tipoAgregado ==4){
			iniciarVentanas();
		}
		
		cSoltar(e);
	};
	
		
	/**
	 * Método que establece una nueva categoría como agregado.
	 */
	function nuevaCategoria(){
		
		var agregado = document.createElement("table");
		
		var contenido = "<tr class='adminCategory'>";
		contenido += "<td  class='adminCol1' colspan='2'>Nueva Categoría</td>";
		contenido += "<td>Permisos:</td>";
		contenido += "<td  class='adminCol2'>";
		contenido += "<select class='permisosNuevaCat' name='permisosNuevaCat["+numeroAgregados+"]'>";
		contenido += "<option value='1'>1</option>";
		contenido += "<option value='2'>2</option>";
		contenido += "<option value='3'>3</option>";
		contenido += "</select>";
		contenido += "</td>";
		contenido += "</tr>";
		contenido += "<tr class='adminCategory' >";
		contenido += "<td  class='adminCol1' colspan='2'>";
		contenido += "<input class='nuevaCat' name='nuevaCat["+numeroAgregados+"]' type='text' value=''/>";
		contenido += "</td>";
		contenido += "<td  class='adminCol3'></td>";
		contenido += "<td  class='adminCol4'></td>";
		contenido += "</tr>";
		
		agregado.innerHTML = contenido;
		
		return agregado;
	};
	
		
	/**
	 * Método que establece un nuevo foro como agregado.
	 */
	function nuevoForo(){
		
		var agregado = document.createElement("tr");
		agregado.className = "adminForo";
		
		var contenido = "<td  class='adminCol1' colspan='2'>";
		contenido += "	<input class='nuevoForo' name='nuevoForo["+numeroAgregados+"-"+datos+"]' type='text' value=''/>";
		contenido += "</td>";
		contenido += "<td  class='adminCol2'  colspan='2'>";
		contenido += "Nuevo Foro";
		contenido += "<input type='hidden' class='categoriaNuevoForo' name='categoriaNuevoForo["+numeroAgregados+"-"+datos+"]' value='"+datos+"'/>";
		contenido += "</td>";
		
		agregado.innerHTML = contenido;

		return agregado;
	};

		
	/**
	 * Método que establece un nuevo personaje como agregado.
	 */
	function nuevoPersonaje(){
			
		/**Al modificar listas, existen agregados previos por lo que el numero de agregados actuales será igual a dicha cantidad de elementos.**/
		numeroAgregados = document.getElementById(elementoPadreId).childElementCount;
		var n = numeroAgregados;
		
		var agregado = document.createElement("tr");
		agregado.className = "personajerow";
		
		if(numeroAgregados%2==0){
			agregado.className += " pairRow";
		}
		else{
			agregado.className += " inpairRow";
		}
	
	
		var contenido = "<td class='col1'>Personaje "+(n+1)+"</td>";
		contenido += "<td class='col2'>";
		contenido += "<select class='rangoPersonaje' name='rangoPersonaje["+n+"]'>";
		contenido += "<option value='6'>Heroe</option>";
		contenido += "<option value='7'>Comandante</option>";
		contenido += "<option value='8'>Portaestandarte de Batalla</option>";
		contenido += "<option value='9'>General</option>";
		contenido += "</select>";
		contenido += "</td>";
		contenido += "<td class='col3'><input class='nombrePersonaje nombreTP' name='nombrePersonaje["+n+"]' type='text' value=''></td>";
		contenido += "<td class='col4'>";
		contenido += "<select class='tipoPersonaje' name='tipoPersonaje["+n+"]'>";
		contenido += "<option value='1'>Infantería</option>";
		contenido += "</select>";
		contenido += "</td>";
		contenido += "<td class='col5'><input class='puntosPersonaje puntosTP' name='puntosPersonaje["+n+"]' type='integer' value=''></td>";
		contenido += "<td class='col6'>";
		//Opciones
		contenido += "<div id='detallesPersonaje"+n+"Boton' class='botonVentana'><img src='src/botones/info.png'/></div>";
		contenido += "<div id='detallesPersonaje"+n+"' class='ventana oculto'>";
		contenido += "<h2 id='detallesPersonaje"+n+"Selector' class='ventanaSelector'>Detalles del "+(n+1)+"º Personaje</h2>";
		contenido += "<div class='ventanaContent'>";
	
		//Tabla de atributos
		contenido += "<table>";
		contenido += "<tr><td  colspan='10' class='tablehead alignleft'>Atributos:</td></tr>";
		contenido += "<tr class='atributos'>";
		contenido += "<td>Componentes</td>";
		contenido += "<td>M</td>";
		contenido += "<td>HA</td>";
		contenido += "<td>HP</td>";
		contenido += "<td>F</td>";
		contenido += "<td>R</td>";
		contenido += "<td>PS</td>";
		contenido += "<td>I</td>";
		contenido += "<td>A</td>";
		contenido += "<td>L</td>";
		contenido += "</tr>";
		contenido += atributos("Personaje","Personaje",n);
		contenido += atributos("<label for='monturaPersonaje"+n+"'>Montura-Bestias de Tiro</label> <input type='checkbox' id='monturaPersonaje"+n+"' class='monturaPersonaje' name='monturaPersonaje["+n+"]'/>","MonturaPersonaje",n);
		contenido += atributos("<label for='maquinaPersonaje"+n+"'>Maquinaria-Carro</label> <input type='checkbox' id='maquinaPersonaje"+n+"' class='maquinaPersonaje' name='maquinaPersonaje["+n+"]'/>","MaquinariaPersonaje",n);
		contenido += atributos("<label for='dotacionPersonaje"+n+"'>Dotacion</label> <input type='checkbox' id='dotacionPersonaje"+n+"' class='dotacionPersonaje' name='dotacionPersonaje["+n+"]'/>","DotacionPersonaje",n);
		contenido += "</table>";
		
		
	
		//Cierre opciones
		contenido += "</div>";
		contenido += "</div>";
		//Cierre casilla
		contenido += "</td>";
		
		
		
		agregado.innerHTML = contenido;
	
		return agregado
	};
	
		
	/**
	 * Método que establece una nueva tropa como agregado.
	 */
	function nuevaTropa(){
		/**CONSTANTES**/
		var maxU = 50;
		var maxA = 10;
		
		/**Al modificar listas, existen agregados previos por lo que el numero de agregados actuales será igual a dicha cantidad de elementos.**/
		numeroAgregados = document.getElementById(elementoPadreId).childElementCount;
		var n = numeroAgregados;
		
		var agregado = document.createElement("tr");
		agregado.className = "troparow";
		
		if(numeroAgregados%2==0){
			agregado.className += " pairRow";
		}
		else{
			agregado.className += " inpairRow";
		}
	
	
		var contenido = "<td class='col1'>Tropa "+(n+1)+"</td>";
		contenido += "<td class='col2'>";
		contenido += "<select class='unidadesTropa' name='unidadesTropa["+n+"]'>";
		
		/**El numero de unidades puede ir de 1 a 100, soy demasiado vago como para poner 100 options a mano*/
		for(var i=1;i<=maxU;i++){
			contenido += "<option value='"+i+"'>"+i+" x</option>";
		}
	
		contenido += "</select>";
		contenido += "</td>";
		contenido += "<td class='col3'><input class='nombreTropa nombreTP' name='nombreTropa["+n+"]' type='text' value=''></td>";
		contenido += "<td class='col4'>";
		contenido += "<select class='tipoTropa' name='tipoTropa["+n+"]'>";
		contenido += "<option value='1'>Infantería</option>";
		contenido += "</select>";
		contenido += "</td>";
		contenido += "<td class='col5'><input class='puntosTropa puntosTP' name='puntosTropa["+n+"]' type='integer' value=''></td>";
		contenido += "<td class='col6'>";
		
		//Opciones
		contenido += "<div id='detallesTropa"+n+"Boton' class='botonVentana'><img src='src/botones/info.png'/></div>";
		contenido += "<div id='detallesTropa"+n+"' class='ventana oculto'>";
		contenido += "<h2 id='detallesTropa"+n+"Selector' class='ventanaSelector'>Detalles de la "+(n+1)+"ª Tropa</h2>";
		contenido += "<div class='ventanaContent'>";
		contenido += "<table>";
		contenido += "<tr>";
		contenido += "<td class='alignRight'><label for='musicoTropa"+n+"'>Músico:</label></td>";
		contenido += "<td><input type='checkbox' id='musicoTropa"+n+"' class='musicoTropa' name='musicoTropa["+n+"]'/></td>";
		contenido += "<td class='alignRight'><label for='portaestandarteTropa"+n+"'>Portaestandarte:</label></td>";
		contenido += "<td><input type='checkbox' id='portaestTropa"+n+"' class='portaestTropa' name='portaestTropa["+n+"]'/></td>";
		contenido += "<td class='alignRight'><label for='champTropa"+n+"'>Campeón:</label></td>";
		contenido += "<td><input type='checkbox' id='champTropa"+n+"' class='champTropa' name='champTropa["+n+"]'/></td>";
		contenido += "</tr>";
		contenido += "</table>";

		//Tabla de atributos
		contenido += "<table>";
		contenido += "<tr><td  colspan='10' class='tablehead alignleft'>Atributos:</td></tr>";
		contenido += "<tr class='atributos'>";
		contenido += "<td>Componentes</td>";
		contenido += "<td>M</td>";
		contenido += "<td>HA</td>";
		contenido += "<td>HP</td>";
		contenido += "<td>F</td>";
		contenido += "<td>R</td>";
		contenido += "<td>PS</td>";
		contenido += "<td>I</td>";
		contenido += "<td>A</td>";
		contenido += "<td>L</td>";
		contenido += "</tr>";
		contenido += atributos("Miembros-Dotacion","Tropa",n);
		contenido += atributos("<label for='monturaTropa"+n+"'>Montura-Bestias de Tiro</label> <input type='checkbox' id='monturaTropa"+n+"' class='monturaTropa' name='monturaTropa["+n+"]'/>","MonturaTropa",n);
		contenido += atributos("<label for='maquinaTropa"+n+"'>Maquinaria-Carro</label> <input type='checkbox' id='maquinaTropa"+n+"' class='maquinaTropa' name='maquinaTropa["+n+"]'/>","MaquinariaTropa",n);
		contenido += "</table>";
		contenido += "</table>";
		
		//Cierre opciones
		contenido += "</div>";
		contenido += "</div>";
		//Cierre casilla
		contenido += "</td>";


		agregado.innerHTML = contenido;
		
		return agregado
	};
	
	/**
	 * Método que se usa para establecer los atributos de un agregado de tipo tropa o de tipo personaje.
	 * Tiene como principal objetivo el recilaje de código.
	 * 
	 * @param text String - Texto que identifica el componente de la tropa al que pertenecen los atributos. Puede contener opciones adicionales.
	 * @param elemento String - NO ES UN ELEMENTO HTML. Texto que identifica a la componente e indica si pertenece a una tropa o un personaje.
	 * @param indice integer - Indice que identifica a la tropa. El número de indice es el mismo que el del agregado que la representa.
	 */
	function atributos(text,elemento,indice){
		/**Constantes*/
		var maxA = 10;
		
		/**Contenido*/
		var contenido = "";
		
		contenido += "<tr class='atributos'>";
		contenido += "<td>"+text+"</td>";
		
		//M
		contenido += "<td>";
		contenido += "<select class='movimiento"+elemento+"' name='movimiento"+elemento+"["+indice+"]'>";
		contenido += "<option value='0'>0cm</option>";
		contenido += "<option value='3'>3cm</option>";
		contenido += "<option value='5'>5cm</option>";
		contenido += "<option value='8'>8cm</option>";
		contenido += "<option value='10'>10cm</option>";
		contenido += "<option value='12'>12cm</option>";
		contenido += "<option value='15'>15cm</option>";
		contenido += "<option value='18'>18cm</option>";
		contenido += "<option value='20'>20cm</option>";
		contenido += "<option value='22'>22cm</option>";
		contenido += "<option value='25'>25cm</option>";
		contenido += "<option value='30'>30cm</option>";
		contenido += "</select>";
		contenido += "</td>";
		
		//ha
		contenido += "<td>";
		contenido += "<select class='ha"+elemento+"' name='ha"+elemento+"["+indice+"]'>";
		for(var i=0;i<=maxA;i++){
			contenido += "<option value='"+i+"'>"+i+"</option>";
		}
		contenido += "</select>";
		contenido += "</td>";
		
		//hp
		contenido += "<td>";
		contenido += "<select class='hp"+elemento+"' name='hp"+elemento+"["+indice+"]'>";
		for(var i=0;i<=maxA;i++){
			contenido += "<option value='"+i+"'>"+i+"</option>";
		}
		contenido += "</select>";
		contenido += "</td>";
		
		//f
		contenido += "<td>";
		contenido += "<select class='f"+elemento+"' name='f"+elemento+"["+indice+"]'>";
		for(var i=0;i<=maxA;i++){
			contenido += "<option value='"+i+"'>"+i+"</option>";
		}
		contenido += "</select>";
		contenido += "</td>";
		
		//r
		contenido += "<td>";
		contenido += "<select class='r"+elemento+"' name='r"+elemento+"["+indice+"]'>";
		for(var i=0;i<=maxA;i++){
			contenido += "<option value='"+i+"'>"+i+"</option>";
		}
		contenido += "</select>";
		contenido += "</td>";
		
		//ps
		contenido += "<td>";
		contenido += "<select class='ps"+elemento+"' name='ps"+elemento+"["+indice+"]'>";
		for(var i=0;i<=maxA;i++){
			contenido += "<option value='"+i+"'>"+i+"</option>";
		}
		contenido += "</select>";
		contenido += "</td>";
		
		//i
		contenido += "<td>";
		contenido += "<select class='i"+elemento+"' name='i"+elemento+"["+indice+"]'>";
		for(var i=0;i<=maxA;i++){
			contenido += "<option value='"+i+"'>"+i+"</option>";
		}
		contenido += "</select>";
		contenido += "</td>";
		
		//a
		contenido += "<td>";
		contenido += "<select class='a"+elemento+"' name='a"+elemento+"["+indice+"]'>";
		for(var i=0;i<=maxA;i++){
			contenido += "<option value='"+i+"'>"+i+"</option>";
		}
		contenido += "</select>";
		contenido += "</td>";
		
		//l
		contenido += "<td>";
		contenido += "<select class='l"+elemento+"' name='l"+elemento+"["+indice+"]'>";
		for(var i=0;i<=maxA;i++){
			contenido += "<option value='"+i+"'>"+i+"</option>";
		}
		contenido += "</select>";
		contenido += "</td>";
		

		contenido += "</tr>";
		
		
		return contenido;
	};
};