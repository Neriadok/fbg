<?php
	include_once 'includes/db_connect.php';
	include_once 'includes/functions.php';
	include_once 'includes/default.inc.php';
	include_once 'includes/admin.inc.php';
	
	
	sesion_segura();
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset='UTF8'>
		<title>FBG - Panel de Administración</title>
		<link rel='shortcut icon' href='src/dragon.ico'/>
		<link rel='stylesheet' type='text/css' href='css/default.css' />
		<link rel='stylesheet' type='text/css' href='css/admin.css' />
		<script type="text/JavaScript" src="js/sha512.js"></script>
		<script type="text/JavaScript" src="jFBG/AsinCronos.js"></script>
		<script type="text/JavaScript" src="jFBG/Submit.js"></script>
		<script type="text/JavaScript" src="jFBG/Yggdrasil.js"></script>
		<script type="text/JavaScript" src="jFBG/ItemDesplegable.js"></script>
		<script type="text/JavaScript" src="jFBG/Scrolling.js"></script>
		<script type="text/JavaScript" src="jFBG/Ventana.js"></script>
		<script type="text/JavaScript" src="jFBG/Agregar.js"></script>
		<script>
        	function inicio(){
            	var ca = new AsinCronos("contenidos/admin.con.php");
				tratarElementos();
				
            	setInterval(
                    function(){
                        if(ca.check())tratarElementos();
                    }
                  	,500
                 );


                /**Funciones generadas al inicio**/

            	function tratarElementos(){
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

                	/**SECCION DE FOROS*/
    				/**Genereamos el objeto Submit para guardar cambios en foros si este existiese.**/
    				if(document.getElementById("saveForos") != null){
                		var enviarTema = new Submit(4, "saveForos", document.getElementById("adminForos"),ca,"forosBox");
    				}
    				
    				/**Si existen categorias, asignamos los objetos js Submit formularios para eliminarlos.**/
                	var eliminarCat = document.getElementsByClassName("eliminarCat");

    				if(eliminarCat != null){
                		for(var i=0;i<eliminarCat.length;i++){
                			eliminarCat[i] = new Submit(6, eliminarCat[i].id , document.getElementById("adminForos"),ca,"forosBox");
                		}
    				}

                	/**Si existen foros, asignamos los objetos js Submit formularios para eliminarlos.**/
                	var eliminarForo = document.getElementsByClassName("eliminarForo");

    				if(eliminarForo != null){
                		for(var i=0;i<eliminarForo.length;i++){
                			eliminarForo[i] = new Submit(7, eliminarForo[i].id , document.getElementById("adminForos"),ca,"forosBox");
                		}
    				}
                	
    				/**Genereamos el objeto Agregar que nos permita añadir nuevas categorias.**/
    				if(document.getElementById("addCat") != null){
                		var addCat = new Agregar( "addCat","adminForosContent",1);
    				}

    				/**Genereamos el objeto Agregar que nos permita añadir nuevos foros.**/
                	var newforos = document.getElementsByClassName("nuevosforos");

    				if(newforos != null){
                		for(var i=0;i<newforos.length;i++){
                			newforos[i] = new Agregar( "add"+newforos[i].id, newforos[i].id, 2, (newforos[i].id).substring(11) );
                		}
    				}
                	
                	
                	/**SECCION DE USUARIOS*/
    				/**Genereamos el objeto Submit para guardar cambios en usuarios si este existiese.**/
    				if(document.getElementById("saveUsers") != null){
                		var enviarTema = new Submit(3, "saveUsers", document.getElementById("adminUsers"),ca,"usersBox");
    				}

    				/**Si existen usuarios, asignamos los objetos js Submit formularios para eliminarlos.**/
                	var eliminarUser = document.getElementsByClassName("eliminarUser");

    				if(eliminarUser != null){
                		for(var i=0;i<eliminarUser.length;i++){
                			eliminarUser[i] = new Submit(5, eliminarUser[i].id , document.getElementById("adminUsers"),ca,"usersBox");
                		}
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
		
						if($_SESSION['tipoUser'] == 3){
							admin($conexion);
						}
						else{
							acceso_prohibido($conexion,$_SESSION['tipoUser']);
						}
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