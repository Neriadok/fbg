<?php
	include_once '../includes/db_connect.php';
	include_once '../includes/functions.php';
	include_once '../includes/default.inc.php';
	include_once '../includes/partidas.inc.php';
	
	sesion_segura();
	
	$urle=esc_url($_SERVER['PHP_SELF']);
	
	if (login_check($conexion)){
		//Registramos que el usuario esta activo
		actividad($conexion);
		
		$datos = json_decode(file_get_contents('php://input'),true);
		
		
		//Si recibimos Partida como parámetro significa que queremos obtener los datos de la misma.
		if(isset($datos['surrender'])){
			$ejercito = preg_replace("/[^0-9]+/", "", $datos['surrender']);
			rendirse($conexion,$ejercito);
		}
		
		partidas($conexion);
	}
	
	//Si no se esta logueado mostramos el contenido por defecto.
	else {
		defaultContent($msgR);
	}
?>