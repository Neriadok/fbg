<?php


	/**
	 * FUNCIÓN DE ESTRUCTURA
	 * Función que genera el contenido de la página foros.
	 *
	 * Los contenidos de la web se cargan de forma dinámica en servidor
	 * en función de la base de datos
	 * y los datos recibidos en el método POST.
	 *
	 * @param $conexion Mysqli - Conexion a base de datos.
	 */
	function partidas($conexion){
		echo "<div id='contenido' class='contenedor left column'>";
		echo "OPCIONES<br/>AVATAR<br/>NICK<br/>RENOMBRE<br/>PARTIDAS<br/>VICTORIAS<br/>DERROTAS";
		echo "</div>";
		
		echo "<div id='contenido' class='contenedor mid column'>";
		echo "CONTENIDO PRINCIPAL<br/>Primero las partidas activas.<br/>Luego una partida seleccionada.";
		echo "</div>";
		
		echo "<div id='contenido' class='contenedor right column'>";
		echo "HISTORIAL DE PARTIDAS";
		echo "</div>";
	}
	
	
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
	
	/**
	 * FUNCIÓN DE CONTENIDO
	 * Función que muestra un listado de las partidas de un usuario.
	 * Puede indicarse que se muestren solo aquellas partidas que estén sin finalizar.
	 * 
	 *  @param $conexion Mysqli - Conexion a base de datos.
	 */
	function partidas_listado($conexion,$activas){
		echo "
			<p class='enfasis'>Listado de Partidas
		";
		
		if($logged){
			echo "Activas";
		}
		
		echo "
			</p>
			<div id='partidas' class='scrollingBox'>
				<table id='partidasContent' class='scrollingBoxContent'>
		";
		$sentencia = $conexion -> prepare("CALL proceso_listadoPartidas(?)");
		$sentencia -> bind_param('i', $_SESSION['userId']);
		if($sentencia -> execute()){
			$sentencia -> store_result();
			$sentencia -> bind_result(
			);
			while($sentencia -> fetch()){
				if(!$activas || ($activas && $activa)){
				}
			}
			$sentencia -> close();
			echo "
				</table>
				</div>
				<div id='partidasMoving' class='scrollingBoxMoving'>
					<div id='partidasMovingUp' class='scrollingBoxMovingUp'></div>
					<div id='partidasMovingBar' class='scrollingBoxMovingBar'></div>
					<div id='partidasMovingDown' class='scrollingBoxMovingDown'></div>
				</div>
			
			";
		}
	}
?>