<?php
	
	/**
	 * FUNCIÓN DE EJECUCIÓN SETTER
	 * Función que envia un desafio a un usuario.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @param $destinatario integer - Id del usuario al que se desafia.
	 * @param $pts integer - Cantidad de puntos que se podrían usar en la partida resultante del desafío.
	 */
	function desafiarUser ($conexion, $destinatario, $pts){
		$sentencia = $conexion -> prepare("CALL proceso_desafiarUser(?,?,?)");
		$sentencia -> bind_param('iii', $destinatario, $_SESSION['userId'], $pts);
		$sentencia -> execute();
		$sentencia -> close();
	}
	
	/**
	 * FUNCIÓN DE EJECUCIÓN SETTER
	 * Función que acepta un desafio y por lo tanto genera una partida en base de datos.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @param $desafio integer - Id del desafio en el correo.
	 */
	function aceptarDesafio ($conexion,$desafio){
		$sentencia = $conexion -> prepare("CALL proceso_nuevaPartida(?,?,?)");
		$sentencia -> bind_param('iii', $_SESSION['userId'], $desafiador, $desafio);
		$sentencia -> execute();
		$sentencia -> close();
	}
	
	/**
	 * FUNCIÓN DE EJECUCIÓN SETTER
	 * Función que acepta un desafio y por lo tanto genera una partida en base de datos.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @param $desafio integer - Id del desafio en el correo.
	 */
	function denegarDesafio ($conexion,$desafio){
		$sentencia = $conexion -> prepare("CALL proceso_denegarDesafio(?)");
		$sentencia -> bind_param('i',$desafio);
		$sentencia -> execute();
		$sentencia -> close();
	}
?>