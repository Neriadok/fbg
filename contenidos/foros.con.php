<?php
	include_once '../includes/db_connect.php';
	include_once '../includes/functions.php';
	include_once '../includes/default.inc.php';
	include_once '../includes/foros.inc.php';
	
	sesion_segura();
	
	$urle=esc_url($_SERVER['PHP_SELF']);
	
	
	if (login_check($conexion)){
		//Registramos que el usuario esta activo
		actividad($conexion);
		
		foro_contenido($conexion);
	}

	//Si no se esta logueado redireccionamos a la página que mostrará el contenido por defecto.
	else {
		header("Location: $urle");
	}
?>