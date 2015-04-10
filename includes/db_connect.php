<?php
	/**
	 * En este fichero creamos la conexion a base de datos que usaremos en todos los demás sitios de la página.
	 * Para que la conexion funcione debemos incluir el fichero con los datos de conexion.
	 */	
	include_once 'psl-config.php';
	$conexion = new mysqli(HOST, USER, PASSWORD, DATABASE);
	
	/**
	 * Si surgiese algun problema en la conexion,
	 * redireccionamos al usuario a la página de error.
	 */
	if($conexion -> connect_errno){
		header("Location: Error.html");
	}
?>