<?php
	include_once 'includes/db_connect.php';
	include_once 'includes/functions.php';
	include_once 'includes/default.inc.php';
	
	sesion_segura();
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset='UTF8'>
		<title>FBG - </title>
		<link rel='shortcut icon' href='src/dragon.ico'/>
		<link rel='stylesheet' type='text/css' href='css/default.css' />
		<script type="text/JavaScript" src="js/sha512.js"></script>
		<script type="text/JavaScript" src="jFBG/AsinCronos.js"></script>
		<script type="text/JavaScript" src="jFBG/Submit.js"></script>
		<script type="text/JavaScript" src="jFBG/Yggdrasil.js"></script>
		<script type="text/JavaScript" src="jFBG/ItemDesplegable.js"></script>
		<script>
        	function inicio(){
            	var ca = new AsinCronos("contenidos/buzon.con.php");
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
						echo "
							<div id='contenido' class='contenedor mid top box'>Standar</div>
						";
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