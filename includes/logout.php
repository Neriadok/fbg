<?php
	include_once 'db_connect.php';
	include_once 'functions.php';
	sesion_segura();
	
	//Guardamos la hora del log out
	$sentencia = $conexion -> prepare("CALL proceso_logout(?)");
	$sentencia -> bind_param('i', $_SESSION['userId']);
	$sentencia -> execute();
	$sentencia -> close();
	
	// Desconfigura todos los valores de sesi�n.
	$_SESSION = array();
	
	// Obtiene los par�metros de sesi�n.
	$params = session_get_cookie_params();

	// Borra el cookie actual.
	setcookie(
		session_name(),
		'',
		time() - 42000,
		$params["path"],
		$params["domain"],
		$params["secure"],
		$params["httponly"]
	);

	// Destruye sesi�n.
	session_destroy();
	header('Location: ../portal.php');
?>