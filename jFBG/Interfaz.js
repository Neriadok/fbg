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
function Interfaz(interfaz,columnaInfo,columnaPrincipal,contenidoPrincipal,contenidoSecundario){

	/***VARIABLES DEL OBJETO***/
	var winH = window.innerHeight;
	var winW = window.innerWidth;
	var columna = false;
	var activoSecundario = false;
	var anchoPag = 800;
	var anchoCol = 450;
	var anchoInfo = 300;
	var minAltoSecundario = 30;
	var maxAltoSecundario = 250;
	var altoPag = 500;
	
	growUngrow(null);
	
	/***ASIGNACIÓN DE EVENTOS***/
	window.onresize = growUngrow;
	contenidoSecundario.onmouseover = cDentro;
	contenidoSecundario.onmouseout = cFuera;
	
	
	
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
		
		interfaz.style.height = winH+'px';
		interfaz.style.width = '100%';

		
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
		interfaz.style.overflowY = "scroll";
		
		columnaInfo.style.position = 'relative';
		columnaInfo.style.width = winW+'px';
		columnaInfo.style.height = 'auto';

		columnaPrincipal.style.position = 'relative';
		columnaPrincipal.style.left = '0px';
		columnaPrincipal.style.width = winW+'px';

		contenidoPrincipal.style.position = 'relative';
		contenidoPrincipal.style.width = winW+'px';
		contenidoPrincipal.style.height = '500px';

		contenidoSecundario.style.position = 'relative';
		contenidoSecundario.style.width = winW+'px';
		contenidoSecundario.style.height = 'auto';
	};
	
	/**
	 * Esta estructura es la estructura estándar de la página
	 * y tiene como objetivo tener todos los elementos visibles en pantalla.
	 * Gracias a esta estructura, el cliente tiene facil acceso a todos los contenidos,
	 * respetando así la ley de fitts
	 */
	function estructuraDinamica(){
		interfaz.style.overflow = "hidden";

		columnaInfo.style.position = 'absolute';
		columnaInfo.style.left = "0px";
		columnaInfo.style.top = "0px";
		columnaInfo.style.width = anchoInfo+'px';
		columnaInfo.style.height = winH+'px'

		columnaPrincipal.style.position = 'absolute';
		columnaPrincipal.style.left = anchoInfo+"px";
		columnaPrincipal.style.top = "0px";
		columnaPrincipal.style.width = (winW-anchoInfo)+'px';
		columnaPrincipal.style.height = winH+'px';
		
		//Evaluamos si el raton está sobre el contenido secundario para desplegarlo o retraerlo
		if(activoSecundario){
			contenidoPrincipal.style.width = (winW-anchoInfo)+'px';
			contenidoPrincipal.style.height = (winH - maxAltoSecundario) + 'px';
			
			contenidoSecundario.style.width = (winW-anchoInfo)+'px';
			contenidoSecundario.style.height = maxAltoSecundario + 'px';
		}
		else{
			contenidoPrincipal.style.width = (winW-anchoInfo)+'px';
			contenidoPrincipal.style.height = (winH - minAltoSecundario) + 'px';
			
			contenidoSecundario.style.width = (winW-anchoInfo)+'px';
			contenidoSecundario.style.height = minAltoSecundario + 'px';
		}
	};
	
	/**
	 * Método que establece que el cursor está dentro del contenido secundario 
	 * y lo despliega si estamos en estructura dinámica.
	 * 
	 * @param e Event- Evento que lanzo el método.
	 */
	function cDentro(e){
		activoSecundario = true;
		growUngrow(null);
	};
	
	/**
	 * Método que establece que el cursor está fueradel contenido secundario 
	 * y lo retrae si estamos en estructura dinámica.
	 * 
	 * @param e Event- Evento que lanzo el método.
	 */
	function cFuera(e){
		activoSecundario = false;
		growUngrow(null);
	};
};