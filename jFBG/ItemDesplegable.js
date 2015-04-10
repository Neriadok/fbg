/**
 * Clase que hace que los elementos de la cabecera aparenten ser desplegables.
 * A traves de la url podemos mantener abierto el elemento que representa la página actual.
 * 
 * @param elemento Element - Elemento al que se quiere dar la animación.
 * @param alineacion String - Define la posicion con respecto a la imagen de la cabecera "I" izquierda y "D" derecha.
 * @param nivel integer - Define la altura a que se encuentra el elemento. Es importante para adaptarlo correctamente.
 */
function ItemDesplegable(elemento,alineacion,nivel){
	/**** CONSTRUCTOR DEL OBJETO ****/
	/***VARIABLES DEL OBJETO***/
	//Definimos la url en que nos encontramos.
	var siteUrl = document.URL;
	
	//Buscamos los elementos hijos del elemnto.
	var hijos = elemento.children;
	
	//Definimos la posicion horizontal del elemento, sus margenes y la alineacion del texto
	if(alineacion== "I"){
		elemento.style.left = "100px";
		elemento.style.textAlign = "left";
		for(var i=0 ; i<hijos.length ; i++){
			hijos[i].style.marginRight = "10px";
		}
	}
	else{
		elemento.style.left = "150px";
		elemento.style.textAlign = "right";
		for(var i=0 ; i<hijos.length ; i++){
			hijos[i].style.marginLeft = "10px";
		}
	}
	
	//Definimos la posicion vertical del elemento y aumentamos o reducimos la horizontal en funcion del nivel.
	switch(nivel){
		case 1:
			elemento.style.top = "33px";
			if(alineacion== "I"){
				elemento.style.left = (parseInt(elemento.style.left)+5)+"px";
			}
			else{
				elemento.style.left = (parseInt(elemento.style.left)-5)+"px";
			}
			
			break;
		case 2:
			elemento.style.top = "63px";
			break;
		case 3:
			elemento.style.top = "93px";
			if(alineacion== "I"){
				elemento.style.left = (parseInt(elemento.style.left)+5)+"px";
			}
			else{
				elemento.style.left = (parseInt(elemento.style.left)-5)+"px";
			}
			break;
	}
	
	
	
	/***ASIGNACIÓN DE EVENTOS***/
	//Si nos encontramso en ese directorio, mantenemos el desplegable extendido
	if(elemento.href == siteUrl){
		if(alineacion == "I"){
			elemento.style.left = (parseInt(elemento.style.left) - 90)+"px";
		}else{
			elemento.style.left = (parseInt(elemento.style.left) + 90)+"px";
		}
	}
	//En caso contrario le damos las funciones de desplegar y retraer
	else{
		elemento.onmouseover = desplegar;
		elemento.onmouseout = retraer;
	}
	
	
	
	/***MÉTODOS PRIVADOS***/
	/**
	 * Método que despliega el elemento cuando el cursor se posa sobre el.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function desplegar(e){
		if(alineacion == "I"){
			elemento.style.left = (parseInt(elemento.style.left) - 90)+"px";
		}else{
			elemento.style.left = (parseInt(elemento.style.left) + 90)+"px";
		}
	};
	
	/**
	 * 
	 * Método que retrae el elemento cuando el cursor sale de el.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function retraer(e){
		if(alineacion == "I"){
			elemento.style.left = (parseInt(elemento.style.left) + 90)+"px";
		}else{
			elemento.style.left = (parseInt(elemento.style.left) - 90)+"px";
		}
	};
}