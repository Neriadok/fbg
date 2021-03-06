<?php
	include_once 'includes/db_connect.php';
	include_once 'includes/functions.php';
	include_once 'includes/default.inc.php';
	include_once 'includes/perfil.inc.php';
	
	sesion_segura();
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset='UTF8'>
		<title>FBG - Perfil</title>
		<link rel='shortcut icon' href='src/dragon.ico'/>
		<link rel='stylesheet' type='text/css' href='css/default.css' />
		<link rel='stylesheet' type='text/css' href='css/perfil.css' />
		<script type="text/JavaScript" src="js/sha512.js"></script>
		<script type="text/JavaScript" src="js/jFBG/AsinCronos.js"></script>
		<script type="text/JavaScript" src="js/jFBG/Submit.js"></script>
		<script type="text/JavaScript" src="js/jFBG/Yggdrasil.js"></script>
		<script type="text/JavaScript" src="js/jFBG/ItemDesplegable.js"></script>
		<script type="text/JavaScript" src="js/jFBG/Boton.js"></script>
		<script type="text/JavaScript" src="js/jFBG/Ventana.js"></script>
		<script type="text/JavaScript" src="js/jFBG/Scrolling.js"></script>
		<script type="text/JavaScript" src="js/jFBG/PreventTextSelect.js"></script>
		<script>
        	function inicio(){
            	var ca = new AsinCronos("contenidos/perfil.con.php");
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
            		arbol = new Yggdrasil(document.getElementById("yggdrasil") , document.getElementById("copa") , document.getElementById("tronco") , document.getElementById("raiz"));

    				/**Generamos los items desplegables que forman parte de la cabecera.**/
    				d1i = new ItemDesplegable(document.getElementById("desplegable1I"),"I",1);
    				d2i = new ItemDesplegable(document.getElementById("desplegable2I"),"I",2);
    				d3i = new ItemDesplegable(document.getElementById("desplegable3I"),"I",3);
    				d1d = new ItemDesplegable(document.getElementById("desplegable1D"),"D",1);
    				d2d = new ItemDesplegable(document.getElementById("desplegable2D"),"D",2);
    				d3d = new ItemDesplegable(document.getElementById("desplegable3D"),"D",3);

                	/**Prevenimos la selección de texto*/
                	var preventTextSelect = new PreventTextSelect();
    				
                	
    				/**Genereamos el objeto Submit para registrarnos si este existiese.**/
    				if(document.getElementById("registrar") != null){
                		var enviarTema = new Submit(2,  "registrar", document.getElementById("regForm"),ca);
    				}

    				/**Genereamos el objeto Submit para registrarnos si este existiese.**/
    				if(document.getElementById("loguear") != null){
                		var enviarTema = new Submit(1,  "loguear", document.getElementById("logForm"),ca);
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


    				/**SECCION PERFIL*/
    				/**Generamos el objeto Boton para editar nuestro perfil si existiese.**/
    				if(document.getElementById("editPerfil") != null){
    					var destino = new Boton(ca, "editPerfil","editPerfil",1);
    				}
    				
                	/**Generamos los objetos Submit para realizar peticiones de amistad.**/
                	var addmigo = document.getElementsByClassName("addmigoUser");

                	if(addmigo != null){
                		for(var i=0;i<addmigo.length;i++){
                    		/* Actualizaremos las opciones de los usuarios de forma asincrona
                    		 * las opciones de un usuario tienen por atributo Id "userOptions"+idUsuario
                    		 * por eso quitamos las primeras 8 letras de "addmigoU"+idUsuario
                    		 */
                			addmigo[i] = new Submit(0, addmigo[i].id, document.getElementById(addmigo[i].id), ca, "userOptions"+(addmigo[i].id.substr(8)));
    					}
                	}
    				
    				
    				/**SECCION MODIFICAR PERFIL*/
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
						//Registramos que el usuario esta activo
						actividad($conexion);
		
						perfil($conexion);
					}
					else {
						defaultContent($msgR);
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