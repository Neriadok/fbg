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
		echo "CONTENIDO PRINCIPAL";
		echo "</div>";
		
		echo "<div id='contenido' class='contenedor right column'>";
		echo "<p class='enfasis'>HISTORIAL DE PARTIDAS</p>";
		partidas_listado($conexion,false);
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
		$sentencia = $conexion -> prepare("CALL proceso_nuevaPartida(?,?)");
		$sentencia -> bind_param('ii', $_SESSION['userId'], $desafio);
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
			<div id='partidas' class='scrollingBox'>
				<table id='partidasContent' class='scrollingBoxContent'>
		";
		$sentencia = $conexion -> prepare("CALL proceso_listadoPartidas(?)");
		$sentencia -> bind_param('i', $_SESSION['userId']);
		if($sentencia -> execute()){
			$sentencia -> store_result();
			$sentencia -> bind_result(
					$id
					,$partida
					,$desafiadorNick
					,$desafiadoNick
					,$ejercitoNombre
					,$pts
					,$turnos
					,$fase
					,$fechaInicio
					,$fechaFin
					,$vencedor
			);
			while($sentencia -> fetch()){
				if(!$activas || ($activas && $fechaFin == null)){
					echo "
						<tr id='$id' class='partida'>
							<td>$desafiadorNick VS $desafiadoNick</td>
							<td>$pts</td>
							<td>
					";
					if($ejercitoNombre != null){
						echo "$ejercitoNombre";
					}
					else{
						echo "Elegir Ejercito";
					}
					echo "
							</td>
							<td>
								<div id='infoPartida".$id."Boton' class='botonVentana'><img src='src/botones/info.png'/></div>
								<div id='infoPartida".$id."' class='ventana oculto'>
									<h2 id='infoPartida".$id."Selector' class='ventanaSelector'>
										Partida $desafiadorNick VS $desafiadoNick
									</h2>
									<table class='ventanaContent'>
					";
					if($vencedor != null){
						echo "
							<tr>
								<td class='alignCenter enfasis' colspan2>¡Victoria de $vencedor!</td>
							</tr>
						";
					}
					echo "
										<tr class='enfasis'>
											<td class='alignRight'>$pts</td>
											<td class='alignLeft'> Puntos</td>
										</tr>
										<tr>
											<td colpan='2'>
												Partida empezada en el ".date("d/m/Y",$fechaInicio).
												" a las ".date("H:i:s",$fechaInicio)."
					";
					if($fechaFin != null){
						echo "
							y terminada en el".date("d/m/Y",$fechaFin).
							" a las ".date("H:i:s",$fechaFin)
						;
					}
					echo ".
							</td>
						</tr>
					";
					if($ejercitoNombre != null){
						echo "
							<tr>
								<td class='alignRight'>Ejercito: </td>
								<td class='alignLeft'>$ejercitoNombre</td>
							</tr>
						";
					}
					if($turnos != null){
						echo "
							<tr>
								<td class='alignRight'>Turno</td>
								<td class='alignLeft'>$turnos</td>
							</tr>
						";
					}
					if($fase != null){
						echo "
							<tr>
								<td>Fase</td>
								<td>$fase</td>
							</tr>
						";
					}
					echo "
										<tr class='oculto'>
											<td colspan='2'>
												<p id='partida$id'>$partida</p>
												<p id='lista$id'>$ejercitoNombre</p>
												<p id='turnos$id'>$turnos</p>
												<p id='fase$id'>$fase</p>
												<p id='fin$id'>$fechaFin</p>
											</td>
										</tr>
									</table>
								</div>
							</td>
						</tr>
					";
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