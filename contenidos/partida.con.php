<?php
	include_once '../includes/db_connect.php';
	include_once '../includes/functions.php';
	include_once '../includes/default.inc.php';
	include_once '../includes/partida.inc.php';
	
	sesion_segura();
	
	$urle=esc_url($_SERVER['PHP_SELF']);
	
	if (login_check($conexion)){
		//Registramos que el usuario esta activo
		actividad($conexion);
		
		$datos = json_decode(file_get_contents('php://input'),true);
		
		if(isset($datos['partida'])){
			$partida = preg_replace("/[^0-9]+/", "", $datos['partida']);
			partida_datosPartida($conexion,$partida);
			
			//Si se ha enviado peticion de elegir una lista lo registramos.
			if(isset($datos['elegirLista'])){
				$lista = preg_replace("/[^0-9]+/", "", $datos['elegirLista']);
				echo "lista $lista";
			}
		}
		else if(isset($datos['elegirListaPts'])){
			$elegirListaPts = preg_replace("/[^0-9]+/", "", $datos['elegirListaPts']);
			partida_elegirLista($conexion,$elegirListaPts);
		}
	}
	
	//Si no se esta logueado mostramos el contenido por defecto.
	else {
		defaultContent($msgR);
	}
?>