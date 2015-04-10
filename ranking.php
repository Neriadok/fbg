<?php
	include_once 'includes/db_connect.php';
	include_once 'includes/functions.php';
	include_once 'includes/default.inc.php';
	include_once 'includes/ranking.inc.php';
	
	sesion_segura();
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset='UTF8'>
		<title>FBG - Usuarios</title>
		<link rel='shortcut icon' href='src/dragon.ico'/>
		<link rel='stylesheet' type='text/css' href='css/default.css' />
		<link rel='stylesheet' type='text/css' href='css/perfil.css' />
		<script type="text/JavaScript" src="js/sha512.js"></script>
		<script type="text/JavaScript" src="jFBG/AsinCronos.js"></script>
		<script type="text/JavaScript" src="jFBG/Submit.js"></script>
		<script type="text/JavaScript" src="jFBG/Yggdrasil.js"></script>
		<script type="text/JavaScript" src="jFBG/ItemDesplegable.js"></script>
		<script type="text/JavaScript" src="jFBG/Scrolling.js"></script>
		<script type="text/JavaScript" src="jFBG/Ventana.js"></script>
		<script type="text/JavaScript" src="jFBG/Boton.js"></script>
		<script type="text/JavaScript" src="jFBG/Alerta.js"></script>
		<script>
	    	function inicio(){
            	var ca = new AsinCronos("contenidos/ranking.con.php");
				tratarElementos();
				
            	setInterval(
                    function(){
                        if(ca.check())tratarElementos();
                    }
                  	,500
                 );
	
	
	            /**Funciones generadas al inicio**/
	
	        	function tratarElementos(){
		        	/**GENERAL PARA TODAS LAS SECCIONES*/
	        		/**Generamos el objeto Yggdrasil, que nos ayudara a estructurar el arbol de contenidos en funcion del tamaño de la ventana**/
	        		var arbol = new Yggdrasil(document.getElementById("yggdrasil") , document.getElementById("copa") , document.getElementById("tronco") , document.getElementById("raiz"));
	
					/**Generamos los items desplegables que forman parte de la cabecera.**/
					d1i = new ItemDesplegable(document.getElementById("desplegable1I"),"I",1);
					d2i = new ItemDesplegable(document.getElementById("desplegable2I"),"I",2);
					d3i = new ItemDesplegable(document.getElementById("desplegable3I"),"I",3);
					d1d = new ItemDesplegable(document.getElementById("desplegable1D"),"D",1);
					d2d = new ItemDesplegable(document.getElementById("desplegable2D"),"D",2);
					d3d = new ItemDesplegable(document.getElementById("desplegable3D"),"D",3);
					
	            	
					/**Genereamos el objeto Submit para registrarnos si este existiese.**/
					if(document.getElementById("registrar") != null){
	            		var registrar = new Submit(2, "registrar", document.getElementById("regForm"), ca);
					}
	
					/**Genereamos el objeto Submit para registrarnos si este existiese.**/
					if(document.getElementById("loguear") != null){
	            		var loguear = new Submit(1, "loguear", document.getElementById("logForm"), ca);
					}

    				/**Si existiesen elementos de clase scrollingBox, generariamos objetos Scrolling para un movimiento dinámico**/
    				var scrollings = document.getElementsByClassName("scrollingBox");

                	if(scrollings != null){
                    	for(var i=0;i<scrollings.length;i++){
                    		scrollings[i] = new Scrolling(scrollings[i]);
                		}
    				}

    				/**Generamos los objetos ventana si los hubiese.**/
                	var ventanas = document.getElementsByClassName("ventana");

                	if(ventanas != null){
                		for(var i=0;i<ventanas.length;i++){
                			ventanas[i] = new Ventana(ventanas[i].id);
    					}
                	}

                	
                	/**SECCION RANKING*/
                	/**Generamos los objetos Submit para visualizar el perfil de un usuario.**/
                	var verPerfilUser = document.getElementsByClassName("perfilUser");

                	if(verPerfilUser != null){
                		for(var i=0;i<verPerfilUser.length;i++){
                    		/* Actualizaremos las opciones de los usuarios de forma asincrona
                    		 * las opciones de un usuario tienen por atributo Id "userOptions"+idUsuario
                    		 * por eso quitamos las primeras 8 letras de "addmigoU"+idUsuario
                    		 */
                    		 verPerfilUser[i] = new Submit(0, verPerfilUser[i].id, document.getElementById(verPerfilUser[i].id), ca);
    					}
                	}
                	
                	/**Generamos los objetos Submit para enviar un mensaje a un usuario.**/
                	var mensajeUser = document.getElementsByClassName("msgUser");

                	if(mensajeUser != null){
                		for(var i=0;i<mensajeUser.length;i++){
                    		mensajeUser[i] = new Submit(13, mensajeUser[i].id, document.getElementById(mensajeUser[i].id+"Form"), ca);
    					}
                	}
                	
                	/**Generamos los objetos Submit para añadir faltas a un usuario.**/
                	var faltaUsers = document.getElementsByClassName("faltaUser");

                	if(faltaUsers != null){
                		for(var i=0;i<faltaUsers.length;i++){
                    		faltaUsers[i] = new Submit(0, faltaUsers[i].id, document.getElementById(faltaUsers[i].id), ca);
    					}
                	}
                	
                	/**Generamos los objetos Submit para banear un usuario.**/
                	var banUsers = document.getElementsByClassName("banUser");

                	if(banUsers != null){
                		for(var i=0;i<banUsers.length;i++){
                    		banUsers[i] = new Submit(0, banUsers[i].id, document.getElementById(banUsers[i].id), ca);
    					}
                	}
                	
                	/**Generamos los objetos Submit para eliminar un usuario.**/
                	var delUsers = document.getElementsByClassName("eliminarUser");

                	if(delUsers != null){
                		for(var i=0;i<delUsers.length;i++){
                    		delUsers[i] = new Submit(0, delUsers[i].id, document.getElementById(delUsers[i].id), ca);
    					}
                	}

                	

                	
                	/**SECCION PERFIL*/
                	/**Generamos los objetos Submit para realizar peticiones de amistad.**/
                	var addmigo = document.getElementById("addmigo");

                	if(addmigo != null){
                		addmigo = new Submit(0, "addmigo", document.getElementById("addmigo"), ca);
                	}

                	/**Generamos los objetos Submit para realizar eliminaciones de amistad.**/
                	var delmigo = document.getElementById("delmigo");

                	if(delmigo != null){
                		delmigo = new Submit(0, "delmigo", document.getElementById("delmigo"), ca);
                	}
                	
    				/**Generamos el objeto Boton para editar nuestro perfil si existiese.**/
    				if(document.getElementById("editPerfil") != null){
    					var destino = new Boton(ca, "editPerfil","editPerfil",1);
    				}

    				
                	/**SECCION EDITAR PERFIL*/
    				/**Generamos el objeto Boton para volver a nuestro perfil si existiese.**/
    				if(document.getElementById("volver") != null){
    					var destino = new Boton(ca, "volver","",1);
    				}

                	/**Genereamos el objeto Submit para guardar cambios en foros si este existiese.**/
    				if(document.getElementById("saveChanges") != null){
                		var enviarTema = new Submit(12,  "saveChanges", document.getElementById("datosPerfil"),ca);
    				}
	        	};
        	}
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
						ranking($conexion);
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