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
		partidas_datosUsuario($conexion);
		echo "</div>";
		
		echo "
			<div id='contenido' class='contenedor mid column'>
				<h2 id='tituloPartida'>Bienvenido a tu sección de partidas</h2>
				<div id='expositor'></div>
			</div>
		";
		
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
				<div id='partidasContent' class='scrollingBoxContent'>
		";
		$sentencia = $conexion -> prepare("CALL proceso_listadoPartidas(?)");
		$sentencia -> bind_param('i', $_SESSION['userId']);
		if($sentencia -> execute()){
			$sentencia -> store_result();
			$sentencia -> bind_result(
					$id
					,$partida
					,$user
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
			
			$i = 0;
			while($sentencia -> fetch()){
				if(!$activas || ($activas && $fechaFin == null)){
					$i++;
					echo "
						<div id='$id' class='partida
					";
					//Elegimos el color de la fila
					if($fechaFin == null){
						if($i%2 == 0){
							echo "pairRow";
						}
						else{
							echo "inpairRow";
						}
					}
					else{
						echo "greyRow";
					}
					
					echo "
						'>$desafiadorNick VS $desafiadoNick a $pts Puntos<br/>
					";
					if($fechaFin == null){
						if($ejercitoNombre != null){
							if($turnos == 0){
								echo "Pendiente de empezar";
							}
							else{
								echo "Turno $turnos, ";
								if($fase == null){
									echo "fase del enemigo";
								}
								else{
									echo "fase de $fase";
								}
							}
						}
						else{
							echo "Elegir Ejercito";
						}
					}
					else{
						echo "Finalizada";
					}
					echo "
						<div class='oculto'>
							<p id='desafiador$id'>$desafiadorNick</p>
							<p id='desafiado$id'>$desafiadoNick</p>
							<p id='puntos$id'>$pts Puntos</p>
							<p id='partida$id'>$partida</p>
							<p id='usuario$id'>$user</p>
							<p id='lista$id'>$ejercitoNombre</p>
							<p id='turnos$id'>$turnos</p>
							<p id='fase$id'>$fase</p>
							<p id='fin$id'>$fechaFin</p>
							<p id='fechas$id'>
								Esta partida comenzó  el ".date("d/m/Y",$fechaInicio)."<br/>
								a las ".date("H:i:s",$fechaInicio)."<br/>
								y 
					";				
					if($fechaFin != null){
						echo "$vencedor la ganó el ".date("d/m/Y",$fechaFin)."<br/>
							a las ".date("H:i:s",$fechaFin).".
						";
					}
					else{
						echo "actualmente sigue activa.";
					}
					echo "
								</p>
							</div>
						</div>
					";
				}
			}
			$sentencia -> close();
			echo "
					</div>
				</div>
				<div id='partidasMoving' class='scrollingBoxMoving'>
					<div id='partidasMovingUp' class='scrollingBoxMovingUp'></div>
					<div id='partidasMovingBar' class='scrollingBoxMovingBar'></div>
					<div id='partidasMovingDown' class='scrollingBoxMovingDown'></div>
				</div>
			
			";
		}
	}
	
	/**
	 * FUNCIÓN DE EJECUCIÓN SETTER
	 * Función que otorga la victoria al enemigo.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @param $ejercito integer - Id del ejercito que se rinde.
	 */
	function rendirse($conexion, $ejercito){
		$sentencia = $conexion -> prepare("CALL proceso_rendirse(?)");
		$sentencia -> bind_param('i', $ejercito);
		$sentencia -> execute();
		$sentencia -> close();
	}
	
	/**
	 * FUNCIÓN DE CONTENIDO
	 * Función que muestra algunos detalles del usuario referentes a las partidas.
	 */
	function partidas_datosUsuario($conexion){
		
		$sentencia = $conexion -> prepare("CALL proceso_datosUsers()");
		$sentencia -> execute();
		$sentencia -> store_result();
		$sentencia -> bind_result(
			$uId
			,$unickname
			,$avatar
			,$mail
			,$utipo
			,$urenombre
			,$uregdate
			,$ubandate
			,$ufaltas
			,$ufirma
			,$umensajes
			,$utemas
			,$ugrito
			,$upartidas
			,$uvictorias
		);
		
		while($sentencia -> fetch()){
			if($uId == $_SESSION['userId']){
				echo "
					<table class='width100'>
						<tr>
							<td colspan='2' class='alignCenter'>
				";
			
				//Si no hay avatar mostramos el avatar por defecto.
				if($avatar != null){
					echo "<img class='avatarUser' src='$avatar'/>";
				}
				else{
					echo "<img class='avatarUser' src='src/avatares/default.jpg'/>";
				}
			
				echo "
						</td>
					</tr>
					<tr>
						<td colspan='2' class='perfilCell alignCenter
				";
			
				//Los colores cambian en función del tipo de usuario.
				switch($utipo){
					case 0: echo " uBanned"; break;
					case 1: echo " uSimple"; break;
					case 2: echo " uModerador"; break;
					case 3: echo " uAdmin"; break;
				}
			
				//Mostramos el nick del usuario.
				echo "
					'>$unickname
				";
			
				//A continuacion mostramos datos y estadisticas.
				echo "
						</td>
					</tr>
					<tr>
						<td colspan='2' class='alignCenter grito'>$ugrito</td>
					</tr>
					<tr>
						<td class='alignRight'>Renombre:</td>
						<td class='alignLeft white'>$urenombre</td>
					</tr>
					<tr>
						<td class='alignRight'>Partidas:</td>
						<td class='alignLeft white'>$upartidas</td>
					</tr>
					<tr>
						<td class='alignRight'>Victorias:</td>
						<td class='alignLeft white'>$uvictorias</td>
					</tr>
				</table>
				";
			}
		}
	}
?>