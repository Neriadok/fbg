<?php
	include_once 'includes/db_connect.php';
	include_once 'includes/functions.php';
	include_once 'includes/default.inc.php';
	include_once 'includes/foros.inc.php';

	sesion_segura();
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset='UTF8'>
		<title>FBG - Foros</title>
		<link rel='shortcut icon' href='src/dragon.ico'/>
		<link rel='stylesheet' type='text/css' href='css/default.css' />
		<link rel='stylesheet' type='text/css' href='css/foros.css' />
		<script type="text/JavaScript" src="js/sha512.js"></script>
		<script type="text/JavaScript" src="jFBG/AsinCronos.js"></script>
		<script type="text/JavaScript" src="jFBG/Submit.js"></script>
		<script type="text/JavaScript" src="jFBG/Yggdrasil.js"></script>
		<script type="text/JavaScript" src="jFBG/ItemDesplegable.js"></script>
		<script type="text/JavaScript" src="jFBG/Desplegable.js"></script>
		<script type="text/JavaScript" src="jFBG/Destino.js"></script>
		<script type="text/JavaScript" src="jFBG/Boton.js"></script>
		<script type="text/JavaScript" src="jFBG/Scrolling.js"></script>
		<script type="text/JavaScript" src="jFBG/Ventana.js"></script>
		<script>
        	function inicio(){
            	var ca = new AsinCronos("contenidos/foros.con.php");
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
    				
                	
    				/**Genereamos el objeto Submit para registrarnos si este existiese.**/
    				if(document.getElementById("registrar") != null){
                		var enviarTema = new Submit(2, "registrar", document.getElementById("regForm"), ca, null);
    				}


    				/**Genereamos el objeto Submit para registrarnos si este existiese.**/
    				if(document.getElementById("loguear") != null){
                		var enviarTema = new Submit(1, "loguear", document.getElementById("logForm"), ca, null);
    				}
    				

    				/**Generamos los objetos ventana si los hubiese.**/
                	var ventanas = document.getElementsByClassName("ventana");

                	if(ventanas != null){
                		for(var i=0;i<ventanas.length;i++){
                			ventanas[i] = new Ventana(ventanas[i].id);
    					}
                	}
                	

    				/**Si existiesen elementos de clase scrollingBox, generariamos objetos Scrolling para un movimiento dinámico**/
    				var scrollings = document.getElementsByClassName("scrollingBox");

                	if(scrollings != null){
                    	for(var i=0;i<scrollings.length;i++){
                    		scrollings[i] = new Scrolling(scrollings[i]);
                		}
    				}

    				
                	/**Creamos una barra de navegación desplegable**/
                	var desplegables = document.getElementsByClassName("conjuntoDesplegable");

    				if(desplegables != null){
                		for(var i=0;i<desplegables.length;i++){
                			desplegables[i] = new Desplegable(desplegables[i].id);
                		}
    				}

                	/**Establecemos los elementos que nos harán de indices de navegación**/
                	var foros = document.getElementsByClassName("forumsForum");

    				if(foros != null){
    	            	for(var i=0;i<foros.length;i++){
        	            	foros[i] = new Destino(ca, foros[i].id, 1, "destino", "contenido");
        	        	}
    				}


    				/**SECCION FORO*/
					/**Generamos el objeto Boton para nuevo tema si este existiese.**/
                	if(document.getElementById("newTopic") != null){
                		var nuevoTema = new Boton(ca, "newTopic", document.getElementById("foroActual").innerHTML, 2, "contenido");
    				}

                	
                	/**Si existiesen temas a los que poder ir, generamos los objetos TemaDestino para cada uno de ellos.**/
    				var temas = null;
    				
                	if(document.getElementsByClassName("temaDestino") != null){

                		temas = document.getElementsByClassName("temaDestino");
                    	
                    	for(var i=0;i<temas.length;i++){
                    		temas[i] = new Destino(ca, temas[i].id , 2, "topic", "contenido");
                		}
    				}
    				

    				/**SECCION NUEVO TEMA*/
					/**Genereamos el objeto Submit para enviar un nuevo tema al foro actual si este existiese.**/
    				if(document.getElementById("sendTopic") != null){
                		var enviarTema = new Submit(0, "sendTopic", document.getElementById("topicForm"), ca, "contenido");
    				}
    				

    				/**SECCION TEMA*/
    				/**Genereamos el objeto Submit para enviar un nuevo post al tema actual si este existiese.**/
    				if(document.getElementById("sendPost") != null){
                		var enviarTema = new Submit(0, "sendPost", document.getElementById("postForm"), ca, "contenido");
    				}


                	/**Genereamos el objeto Submit para eliminar el tema actual si este existiese.**/
    				if(document.getElementById("eliminarTopic") != null){
                		var eliminarTema = new Submit(0, "eliminarTopicConfirm", document.getElementById("eliminarTopic"), ca, "contenido");
    				}


                	/**Genereamos el objeto Submit para cerrar el tema actual si este existiese.**/
    				if(document.getElementById("cerrarTopic") != null){
                		var cerrarTema = new Submit(0, "cerrarTopicConfirm", document.getElementById("cerrarTopic"), ca, "contenido");
    				}


                	/**Genereamos el objeto Submit para abrir el tema actual si este existiese.**/
    				if(document.getElementById("abrirTopic") != null){
                		var abrirTema = new Submit(0, "abrirTopicConfirm", document.getElementById("abrirTopic"), ca, "contenido");
    				}

    				
                	/**Si existen posts del usuario, asignamos los objetos js Submit formularios para eliminarlos.**/
                	var eliminarPosts = document.getElementsByClassName("eliminarPost");

    				if(eliminarPosts != null){
                		for(var i=0;i<eliminarPosts.length;i++){
                			eliminarPosts[i] = new Submit(0, eliminarPosts[i].id + "confirm" , eliminarPosts[i], ca, "contenido");
                		}
    				}

    				
                	/**Si existen posts del usuario, asignamos los objetos js Submit formularios para modificarlos.**/
                	var modificarPosts = document.getElementsByClassName("modificarPost");

    				if(modificarPosts != null){
                		for(var i=0;i<modificarPosts.length;i++){
                			modificarPosts[i] = new Submit(0, modificarPosts[i].id + "confirm" , modificarPosts[i], ca, "contenido");
                		}
    				}

                	/**Generamos el objeto Boton para nuevo tema si este existiese.**/
                	if(document.getElementById("volverAForo") != null){
        	          	var volver = new Boton(ca, "volverAForo", document.getElementById("foroActual").innerHTML, 1, "contenido");
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
					if (login_check($conexion)){
						foros($conexion);
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
