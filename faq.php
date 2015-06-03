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
		<title>FBG - FAQ</title>
		<link rel='shortcut icon' href='src/dragon.ico'/>
		<link rel='stylesheet' type='text/css' href='css/default.css' />
		<script type="text/JavaScript" src="js/sha512.js"></script>
		<script type="text/JavaScript" src="js/jFBG/AsinCronos.js"></script>
		<script type="text/JavaScript" src="js/jFBG/Submit.js"></script>
		<script type="text/JavaScript" src="js/jFBG/Yggdrasil.js"></script>
		<script type="text/JavaScript" src="js/jFBG/ItemDesplegable.js"></script>
		<script type="text/JavaScript" src="js/jFBG/PreventTextSelect.js"></script>
		<script>
        	function inicio(){
				tratarElementos();
                

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
				<div class='contenedor mid top box'>
					<a href='https://mega.co.nz/#!IY5ywD5S!qkDGc3h5TNKEpvz5pTUXCeEBd90lCO6PKFJ4I-Q5zhc'>Pulsa este link para descargar la <b>Guía para el Usuario</b></a>
				</div>
				<?php 
					
					$urle=esc_url($_SERVER['PHP_SELF']);
					if (login_check($conexion)){
						//Registramos que el usuario esta activo
						actividad($conexion);
				
						if($_SESSION['tipoUser'] == 3){
							echo "
								<div class='contenedor mid  bot box'>
									<a href='https://mega.co.nz/#!wVIWGYrY!2Ogamfj3EssgOIOrdg6x8LBGuKBUmnpvwchTagCmVKE'>Pulsa este link para descargar la <b>Guía para el Administrador</b></a>
								</div>
							";
						}
						
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