<?php
	include_once '../includes/db_connect.php';
	include_once '../includes/functions.php';
	include_once '../includes/default.inc.php';
	include_once '../includes/perfil.inc.php';
	
	sesion_segura();
	
	$urle=esc_url($_SERVER['PHP_SELF']);
	
	if (login_check($conexion)){
		//Registramos que el usuario esta activo
		actividad($conexion);
		
		//Mostramos el perfil del usuario.
		perfil($conexion);
		
	}
	
	//Si no se esta logueado mostramos el contenido por defecto.
	else {
		defaultContent($msgR);
	}
?>