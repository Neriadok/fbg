<?php
	//Esta página es un modelo a seguir.
	include_once '../includes/db_connect.php';
	include_once '../includes/functions.php';
	include_once '../includes/default.inc.php';
	
	sesion_segura();

	$datos = json_decode(file_get_contents('php://input'),true);
	
	$urle=esc_url($_SERVER['PHP_SELF']);
	
	if (login_check($conexion)){
		//Registramos que el usuario esta activo
		actividad($conexion);
		
		echo "
			<div id='contenido' class='contenedor mid top box'>AJAX funciona</div>
		";
	}
	else {
		defaultContent($msgR);
	}
?>