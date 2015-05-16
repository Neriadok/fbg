<?php
	include_once 'includes/db_connect.php';
	include_once 'includes/functions.php';
	include_once 'includes/default.inc.php';
	include_once 'includes/listas.inc.php';
	
	sesion_segura();
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset='UTF8'>
		<title>FBG - Listas</title>
		<link rel='shortcut icon' href='src/dragon.ico'/>
		<link rel='stylesheet' type='text/css' href='css/default.css' />
		<link rel='stylesheet' type='text/css' href='css/listas.css' />
		<script type="text/JavaScript" src="js/sha512.js"></script>
		<script type="text/JavaScript" src="jFBG/AsinCronos.js"></script>
		<script type="text/JavaScript" src="jFBG/Submit.js"></script>
		<script type="text/JavaScript" src="jFBG/Yggdrasil.js"></script>
		<script type="text/JavaScript" src="jFBG/ItemDesplegable.js"></script>
		<script type="text/JavaScript" src="jFBG/Scrolling.js"></script>
		<script type="text/JavaScript" src="jFBG/Boton.js"></script>
		<script type="text/JavaScript" src="jFBG/Ventana.js"></script>
		<script type="text/JavaScript" src="jFBG/Alerta.js"></script>
		<script type="text/JavaScript" src="jFBG/Destino.js"></script>
		<script type="text/JavaScript" src="jFBG/Agregar.js"></script>
		<script>
			
        	function inicio(){
            	var ca = new AsinCronos("contenidos/listas.con.php");
				tratarElementos();
				
            	setInterval(
                    function(){
                        if(ca.check())tratarElementos();
                    }
                  	,500
                 );
            	
            	function tratarElementos(){
                	/**GENERAL PARA TODAS LAS SECCIONES*/
                	/**Generamos el objeto Yggdrasil, que nos ayudara a estructurar el arbol de contenidos en funcion del tamaño de la ventana**/
            		arbol = new Yggdrasil(document.getElementById("yggdrasil") , document.getElementById("copa") , document.getElementById("tronco") , document.getElementById("raiz"));

    				/**Generamos los items desplegables que forman parte de la cabecera.**/
    				d1i = new ItemDesplegable(document.getElementById("desplegable1I"),"I",1);
    				d2i = new ItemDesplegable(document.getElementById("desplegable2I"),"I",2);
    				d3i = new ItemDesplegable(document.getElementById("desplegable3I"),"I",3);
    				d1d = new ItemDesplegable(document.getElementById("desplegable1D"),"D",1);
    				d2d = new ItemDesplegable(document.getElementById("desplegable2D"),"D",2);
    				d3d = new ItemDesplegable(document.getElementById("desplegable3D"),"D",3);
    				
                	
    				/**Genereamos el objeto Submit para registrarnos si este existiese.**/
    				if(document.getElementById("registrar") != null){
                		var enviarTema = new Submit(2, "registrar", document.getElementById("regForm"),ca);
    				}

    				/**Genereamos el objeto Submit para registrarnos si este existiese.**/
    				if(document.getElementById("loguear") != null){
                		var enviarTema = new Submit(1, "loguear", document.getElementById("logForm"),ca);
    				}

    				/**Si existiesen elementos de clase scrollingBox, generariamos objetos Scrolling para un movimiento dinámico**/
    				var scrollings = document.getElementsByClassName("scrollingBox");

                	if(scrollings != null){
                    	for(var i=0;i<scrollings.length;i++){
                    		scrollings[i] = new Scrolling(scrollings[i]);
                		}
    				}

    				/**Si existiesen listas a las que poder ir, generamos los objetos Destino para cada una de ellas.**/
    				var listas = null;
    				
                	if(document.getElementsByClassName("lista") != null){

                		listas = document.getElementsByClassName("lista");
                    	
                    	for(var i=0;i<listas.length;i++){
                    		listas[i] = new Destino(ca, listas[i].id , 2, "lista", "contenido");
                		}
    				}

    				/**Generamos el objeto Boton para crear una nueva lista si existiese.**/
    				if(document.getElementById("newList") != null){
    					var destino = new Boton(ca, "newList","newList",1,"contenido");
    				}

    				/**Generamos el objeto Boton para volver a la página de inicio de listas.**/
    				if(document.getElementById("volver") != null){
    					var destino = new Boton(ca, "volver","",1,"contenido");
    				}
    				

    				/**SECCION DE LISTAS*/
                	/**Creamos el objeto Submit.js para eliminar la lista actual, si eistiese.**/
                	var eliminarLista = document.getElementById("eliminarLista");

    				if(eliminarLista != null){
                		eliminarLista = new Submit(9, "eliminarLista" , document.getElementById("listaActual"),ca);
    				}

                	/**Creamos el objeto Submit.js para modificar la lista actual, si eistiese.**/
                	var editLista = document.getElementById("modificarLista");

    				if(editLista != null){
                		editLista = new Submit(10, "modificarLista" , document.getElementById("listaActual"),ca,"contenido");
    				}
    				


                	/**SECCION DE EDICION O CREACIÓN DE LISTAS*/
    				/**Genereamos el objeto Agregar que nos permita añadir nuevas categorias.**/
    				if(document.getElementById("addPer") != null){
                		var addPer = new Agregar( "addPer","personajes",4);
    				}

    				/**Genereamos el objeto Agregar que nos permita añadir nuevas categorias.**/
    				if(document.getElementById("addTropa") != null){
                		var addTrop = new Agregar( "addTropa","tropas",3);
    				}	

    				/**Generamos los objetos de alerta si los hubiese.**/
                	var alertas = document.getElementsByClassName("alerta");

                	if(alertas != null){
                		for(var i=0;i<alertas.length;i++){
                			alertas[i] = new Alerta(alertas[i].id);
    					}
                	}

                	/**Genereamos el objeto Submit para guardar la lista si este existiese.**/
    				if(document.getElementById("savelist") != null){
                		var enviarLista = new Submit(8, "savelist", document.getElementById("formulariolista"),ca);
    				}

                	/**Genereamos el objeto Submit para guardar cambios en la lista si este existiese.**/
    				if(document.getElementById("saveeditlist") != null){
                		var guardarLista = new Submit(11, "saveeditlist", document.getElementById("formulariolista"),ca);
    				}
    				
    				/**Generamos los objetos ventana si los hubiese.**/
                	var ventanas = iniciarVentanas();
            	};
        	};

        	
        	/**
        	 * Debido a que los objetos agregados incorporan ventanas, cada vez que añadamos uno
        	 * y al cargar por primera vez la página, actualizamos todos los objetos Ventana.js
        	 */
			function iniciarVentanas(){ 
				var ventanas = document.getElementsByClassName("ventana");

        		if(ventanas != null){
        			for(var i=0;i<ventanas.length;i++){
        				ventanas[i] = new Ventana(ventanas[i].id);
					}
        		}
        		return ventanas;
			};
        </script>
	</head>
	<body onload="inicio();">
		<div id='yggdrasil'>
			<div id='copa'>
				<?php 
					copa($conexion);
				?>
			</div>
	
			<div id='tronco'>
				<?php 
					
					$urle=esc_url($_SERVER['PHP_SELF']);
					if (login_check($conexion)){
						//Registramos que el usuario esta activo
						actividad($conexion);
		
						listas($conexion);
					}
					else {
						defaultContent();
					}
				?>
			</div>
			<table id='raiz'>
				<tr>
					<?php 
						footContent($conexion);
					?>
				</tr>
			</table>
		</div>
	</body>
</html>