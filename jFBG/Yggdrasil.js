/**
 * Clase que nos aporta el diseño responsive one view a la página.
 * Existen muchos tipos de elementos pero los principales son los contenedores.
 * Un contenedor es un pequeño apartado en que mostramos información.
 * 
 * Los contenedores tienen varios atributos que definen su ancho, alto y posicion.
 * Atributos que definenen el ancho y la posicion horizontal: left, mid, right, hright, hleft y big.
 * Atributos que definene el alto: column, box.
 * Atributos que definen la posicion vertical: top y bot.
 * 
 * @param arbol Element - Elemento HTML que envuelve todo el contenido de la página.
 * @param copa Element - Elemento HTML que envuelve la cabecera de la página.
 * @param tronco Element - Elemento HTML que envuelve el cuerpo y el contenido principal de la página.
 * @param raiz Element - Elemento HTML que envuelve el pie de la página.
 */
function Yggdrasil(arbol,copa,tronco,raiz){

	/***VARIABLES DEL OBJETO***/
	var winH = window.innerHeight;
	var winW = window.innerWidth;
	var columna = false;
	var anchoPag = 950;
	var anchoCol = 450;
	var altoPag = 570;
	
	
	/**
	 * Elementos del documento elegidos por su clase.
	 * Estas clases han sido diseñadas para estructurar el contenido.
	 */
	var elementosContenedores = document.getElementsByClassName("contenedor");
	var elementosLeft = document.getElementsByClassName("left");
	var elementosMid = document.getElementsByClassName("mid");
	var elementosRight = document.getElementsByClassName("right");
	var elementosTop = document.getElementsByClassName("top");
	var elementosBot = document.getElementsByClassName("bot");
	var elementosColumn = document.getElementsByClassName("column");
	var elementosBoxes = document.getElementsByClassName("box");
	var elementosHRight = document.getElementsByClassName("hright");
	var elementosHLeft = document.getElementsByClassName("hleft");
	var elementosBig = document.getElementsByClassName("big");
	
	/**
	 * Otros elementos que pueden requerir de adaptación.
	 */
	var elementosScrolling = document.getElementsByClassName("scrollingBox");
	var elementosTArea = document.getElementsByClassName("bigColumnTArea");
	
	
	copa.style.top = "10px";
	growUngrow(null);
	
	/***ASIGNACIÓN DE EVENTOS***/
	window.onresize = growUngrow;
	
	
	/***MÉTODOS Y FUNCIONES***/
	
	/**
	 * Método que se lanza cuando la ventana se redimensiona a fin de adaptar el contenido.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function growUngrow(e){
		//Prevenimos los efectos por defecto del evento.
		if(e!=null) e.preventDefault();
		
		winH = window.innerHeight;
		winW = window.innerWidth;


		
		/**Primero tratamos el ancho para comprobar si podemos poner el contenido en total o no.**/
		if(winW < anchoPag || winH < altoPag){
			columna = true;
		}
		else{
			columna = false;
		}
		
		/*
		if(winW < anchoCol){
			winW = anchoCol;
			window.resizeTo(anchoCol , 600);
		}
		*/
		
		if(columna){
			estructuraColumna();
		}
		else{
			estructuraDinamica();
		}
	};
	
		 
	/**
	 * Esta estrucutura está orientada a moviles o ventanas pequeñas.
	 * Se encarga de apilar el contenido cuando, al ser muy estrecha la ventana,
	 * este sería dificil de ver. De modo que aplica un scroll en el borde de la página.
	 */
	function estructuraColumna(){
		/**Estructuramos Yggdrasil**/
		arbol.style.height = winH+"px";
		arbol.style.width = "auto";
		
		/**Estructuramos la copa**/
		copa.style.left = (winW/2-210)+"px";
	
		/**Estructuramos el tronco**/
		tronco.style.height = "auto";
		tronco.style.width = "auto";
		
		/**Estructuramos el contenido del tronco**/
		var altoTronco = 170;
		for(var i=0;i<elementosContenedores.length;i++){
			elementosContenedores[i].style.position = "inherit";
			elementosContenedores[i].style.height = "auto";
			elementosContenedores[i].style.margin = "10px auto";
			elementosContenedores[i].style.left = "0px";
			elementosContenedores[i].style.width = "90%";
			elementosContenedores[i].style.top = "0px";
			elementosContenedores[i].style.textAlign = "center";
			altoTronco += elementosContenedores[i].offsetHeight+10;
		}
		
		/**Redimensionamos los elementos Scrolling**/
		for(var i=0;i<elementosScrolling.length;i++){
			elementosScrolling[i].style.height = "250px";
			elementosScrolling[i].style.width = "100%";
			//En caso de que el scrolling box incluya una barra de desplazamiento "Moving"
			if(document.getElementById(elementosScrolling[i].id+"Moving") != null){
				
				//Dimensionamos y posicionamos la barra en función del propio scrolling.
				var moving = document.getElementById(elementosScrolling[i].id+"Moving");
				moving.style.height = elementosScrolling[i].offsetHeight+"px";
				moving.style.top = "-"+elementosScrolling[i].offsetHeight+"px";
				moving.style.left = (elementosScrolling[i].offsetWidth-15)+"px";
				
				//Redimensionamos el scrolling
				elementosScrolling[i].style.width = (elementosScrolling[i].offsetWidth-15)+"px";
				
				//Declaramos y posicionamos los elementos del scrollingBoxMoving
				
				var bar = document.getElementById(elementosScrolling[i].id+"MovingBar");
				bar.style.top = "15px";
				
				var down = document.getElementById(elementosScrolling[i].id+"MovingDown");
				down.style.top = (elementosScrolling[i].offsetHeight-15)+"px";
				
				//Al tener posicionamiento relative, el padre de la scroling box mantiene le hueco en donde se encontraria, de modo que reducimos su altura.
				elementosScrolling[i].offsetParent.style.height = (elementosScrolling[i].offsetParent.offsetHeight-elementosScrolling[i].offsetHeight)+"px";
			}
		}

		/**Redimensionamos los elementos text area**/
		for(var i=0;i<elementosTArea.length;i++){
			elementosTArea[i].style.height = "250px";
		}
		
		
		/**Estructuramos la raiz**/
		raiz.style.position = "absolute";
		raiz.style.top = altoTronco+"px";
		
		if(altoTronco + 35 > winH){
			arbol.style.overflowY = "scroll";
		}
		else{
			arbol.style.overflow = "hidden";
		}
	};
	
	/**
	 * Esta estructura es la estructura estándar de la página
	 * y tiene como objetivo tener todos los elementos visibles en pantalla.
	 * Gracias a esta estructura, el cliente tiene facil acceso a todos los contenidos,
	 * respetando así la ley de fitts
	 */
	function estructuraDinamica(){
		/**Estructuramos Yggdrasil**/
		arbol.style.height = winH+"px";
		arbol.style.width = winW+"px";
		arbol.style.overflow = "hidden";
	
		/**Estructuramos la copa**/
		copa.style.left = (winW/2-210)+"px";
		

		/**Estructuramos el tronco**/
		tronco.style.height = (winH-240)+"px";
		tronco.style.width = "100%";

		/**Estructuramos el contenido del tronco**/
		for(var i=0;i<elementosContenedores.length;i++){
			elementosContenedores[i].style.position = "absolute";
		}
		
		for(var i=0;i<elementosLeft.length;i++){
			elementosLeft[i].style.left = "0%";
			elementosLeft[i].style.width = "20%";
			elementosLeft[i].style.margin = "2% 1%";
			elementosLeft[i].style.textAlign = "right";
		}

		for(var i=0;i<elementosMid.length;i++){
			elementosMid[i].style.left = "25%";
			elementosMid[i].style.width = "41%";
			elementosMid[i].style.margin = "2%";
			elementosMid[i].style.textAlign = "center";
		}

		for(var i=0;i<elementosRight.length;i++){
			elementosRight[i].style.left = "73%";
			elementosRight[i].style.width = "20%";
			elementosRight[i].style.margin = "2% 1%";
			elementosRight[i].style.textAlign = "left";
		}
		
		for(var i=0;i<elementosTop.length;i++){
			elementosTop[i].style.top = "0%";
		}
		
		for(var i=0;i<elementosBot.length;i++){
			elementosBot[i].style.top = "48%";
		}

		for(var i=0;i<elementosColumn.length;i++){
			elementosColumn[i].style.top = "0%";
			elementosColumn[i].style.height = "75%";
		}

		for(var i=0;i<elementosBoxes.length;i++){
			elementosBoxes[i].style.height = "27%";
		}

		for(var i=0;i<elementosHLeft.length;i++){
			elementosHLeft[i].style.left = "0%";
			elementosHLeft[i].style.width = "42%";
			elementosHLeft[i].style.margin = "2%";
			elementosHLeft[i].style.textAlign = "left";
		}

		for(var i=0;i<elementosHRight.length;i++){
			elementosHRight[i].style.left = "50%";
			elementosHRight[i].style.width = "42%";
			elementosHRight[i].style.margin = "2%";
			elementosHRight[i].style.textAlign = "left";
		}

		for(var i=0;i<elementosBig.length;i++){
			elementosBig[i].style.left = "25%";
			elementosBig[i].style.width = "67%";
			elementosBig[i].style.margin = "2%";
			elementosBig[i].style.textAlign = "center";
		}

		/**Redimensionamos los elementos scrolling**/
		for(var i=0;i<elementosScrolling.length;i++){
			elementosScrolling[i].style.height = "66%";
			elementosScrolling[i].style.width = "100%";
			//En caso de que el scrolling box incluya una barra de desplazamiento "Moving"
			if(document.getElementById(elementosScrolling[i].id+"Moving") != null){
				
				//Dimensionamos y posicionamos la barra en función del propio scrolling.
				var moving = document.getElementById(elementosScrolling[i].id+"Moving");
				moving.style.height = elementosScrolling[i].offsetHeight+"px";
				moving.style.top = "-"+elementosScrolling[i].offsetHeight+"px";
				moving.style.left = (elementosScrolling[i].offsetWidth-15)+"px";
				
				//Redimensionamos el scrolling
				elementosScrolling[i].style.width = (elementosScrolling[i].offsetWidth-15)+"px";
				
				//Declaramos y posicionamos los elementos del scrollingBoxMoving
				
				var bar = document.getElementById(elementosScrolling[i].id+"MovingBar");
				bar.style.top = "15px";
				
				var down = document.getElementById(elementosScrolling[i].id+"MovingDown");
				down.style.top = (elementosScrolling[i].offsetHeight-15)+"px";
			}
		}

		/**Redimensionamos los elementos text area**/
		for(var i=0;i<elementosTArea.length;i++){
			elementosTArea[i].style.height = "100%";
		}
		
		/**Estructuramos la raiz**/
		raiz.style.position = "absolute";
		raiz.style.top = (winH-70)+"px";
	};
};