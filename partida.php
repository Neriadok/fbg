<?php
	include_once 'includes/db_connect.php';
	include_once 'includes/functions.php';
	include_once 'includes/default.inc.php';
	include_once 'includes/partida.inc.php';
	include_once 'includes/partidas.inc.php';
	
	sesion_segura();
?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset='UTF8'>
		<title>FBG - </title>
		<link rel='shortcut icon' href='src/dragon.ico'/>
		<link rel='stylesheet' type='text/css' href='css/default.css' />
		<link rel='stylesheet' type='text/css' href='css/partida.css' />
		<script type="text/javascript" src="jFBG/AsinCronos.js"></script>
		<script type="text/javascript" src="jFBG/Interfaz.js"></script>
		<script type="text/javascript" src="jFBG/Unidad.js"></script>
		<script type="text/javascript" src="jFBG/Tropa.js"></script>
		<script type="text/javascript" src="jFBG/Partida.js"></script>
		<script type="text/javascript" src="jFBG/Ventana.js"></script>
		<script>
        	function inicio(){

				/** Comprobamos en que partida nos encontramos actualmente **/
				var partidaId = null;

				/** La variable partida es una cookie, la unica que usamos en el rpoyecto por temas de seguridad **/
				//Localizamos la posicion de la cookie
				var posicionCookie = document.cookie.search("FBGpartida=");

				//Si no existiese el resultado sería -1
				if(posicionCookie != -1){
					//Quitamos todo lo que hay antes de la cookie
					var galleta = document.cookie.substr(posicionCookie);
					var comienzoCookie = galleta.search("=")+1;
					var finCookie = galleta.search(";");
					
					partidaId = galleta.slice(comienzoCookie,finCookie);
				}
				console.log("Partida "+partidaId);

				
            	var ca = new AsinCronos("contenidos/partida.con.php");
				tratarElementos();
				
				setInterval(
					function(){
						if(ca.check())tratarElementos();
					}
					,500
				);

				
                /** Funciones generadas al inicio **/

            	function tratarElementos(){
    				console.log("Partida "+partidaId);
                	var interfaz = new Interfaz(
                    	document.getElementById("interfaz")
                		,document.getElementById("columnaInfo")
                		,document.getElementById("columnaPrincipal")
                		,document.getElementById("contenidoPrincipal")
                		,document.getElementById("panelin")
                	);

                	if(partidaId != null){
                		var partida = new Partida(partidaId, "batalla","terreno","panelin","panelout","panelfase", ca);
                	}
            	};
        	}
        </script>
	</head>
	<body onload="inicio();">
		<?php 
			$urle=esc_url($_SERVER['PHP_SELF']);
			if (login_check($conexion)){
				//Registramos que el usuario esta activo
				actividad($conexion);
				
				partida($conexion);
			}
			else {
				echo "<div>INICIA SESIÓN<br/><a href='portal.php'>Volver al portal</a></div>";
			}
		?>
	</body>
</html>