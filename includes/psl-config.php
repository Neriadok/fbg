<?php
	/**
	 * Estos son los datos de inicio de sesión de la base de datos:
	 */
	define("HOST", "localhost");
	define("USER", "fbguser");
	define("PASSWORD", "+USERpass1234");
	define("DATABASE", "FBG");
	
	/**
	 * Estos datos se utilizaban para el método set_cookie_params()
	 * No obstante, esa linea da error, de modo que ha sido "suprimida"
	 * de forma indefinida al no ser prioritaria.
	 *
	define("CAN_REGISTER", "any");
	define("DEFAULT_ROLE", "member");
	*/
	define("SECURE", true);
?>