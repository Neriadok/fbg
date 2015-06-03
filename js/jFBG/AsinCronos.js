/**
 * Clase que administra la comunicación asíncrona entre cliente y servidor.
 * 
 * @param peticionesURL String - URL a la que se realizarán las peticiones asíncronas con la instancia en cuestion que las realize.
 */
function AsinCronos(peticionesURL){

	
	/**** CONSTRUCCIÓN DEL OBJETO ****/
	/***VARIABLES DEL OBJETO***/
	var objetoXHR = false;
	var cambios = false;
	var en = "tronco";
	
	//Evaluamos el navegador a fin de pulir posibles fallos.	
	if (window.XMLHttpRequest){
		objetoXHR = new XMLHttpRequest();
	}
	else if(window.ActiveXObject){
    	objetoXHR = new ActiveXObject("Microsoft.XMLHTTP") ;
	}

		
	/**MÉTODOS PRIVADOS**/
	
	/**
	 * Método que inserta la respuesta del servidor en el elemento con id "en".
	 */
	function respuesta (){
		if(objetoXHR.readyState==4 && objetoXHR.status==200){
    		document.getElementById(en).innerHTML=objetoXHR.responseText;
    		cambios = true;
    	}
    	else if(objetoXHR.status==500){
			document.getElementById(en).innerHTML="<h1 class='error'>ERROR 500</h1> <p class='error'>Servidor caído.<br/>Prueba a recargar la página.</p>";
		}
    	else if(objetoXHR.status==404){
			document.getElementById(en).innerHTML="<h1 class='error'>ERROR 404</h1> <p class='error'>Página no encontrada.<br/>Prueba a recargar la página.</p>";
		}
		else{
			if(peticionesURL == "contenidos/partida.con.php"){
				document.getElementById(en).innerHTML="<div class='contenedorTransparente enfasis'><div class='esferaLoading'><img src='src/sol.gif'/></div>Cargando...</div>";
			}
			else{
				document.getElementById(en).innerHTML="<div class='contenedorTransparente mid column enfasis'><div class='esferaLoading'><img src='src/sol.gif'/></div>Cargando...</div>";
			}
    	}
    };

		
	/**MÉTODOS PÚBLICOS**/
		
	/**
	 * Método que realiza una petición de actualización asíncrona.
	 * 
	 * @param datos StringJSON - Objeto en formato JSON que será enviado mediante método POST al servidor.
	 * @param String sitioDeCarga - Elemento en que se cargará la respuesta del servidor. Por defecto lo realizará en el "tronco".
	 */
	this.actualizar = function(datos,sitioDeCarga){
		if (objetoXHR){
    		if(sitioDeCarga != null) en = sitioDeCarga;
    		else en = "tronco";
    		objetoXHR.open("POST",peticionesURL);
    		objetoXHR.onreadystatechange = respuesta;
    		objetoXHR.setRequestHeader("Content-type", "application/JSON;charset=UTF-8")
    		objetoXHR.send(datos);
    	}
	};
		
	/**
	 * Método que evalua si se ha realizado, de forma asíncrona, algún cambio en el contenido de la página.
	 */
	this.check = function(){
		if (cambios){
			cambios = false;
			return true;
    	}
    	else{
    		return false;
    	}
	};
};