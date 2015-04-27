<?php


	/**
	 * FUNCIÓN DE ESTRUCTURA
	 * Función que muestra un contenido u otro en función de la partida, el usuario logueado y el ejercito.
	 * Para ello testea la URL en que nos encontramos llegando incluso a añadir faltas a un usuario
	 * que intente acceder a una partida para la que no tiene permisos.
	 *
	 *  @param $conexion Mysqli - Conexion a base de datos.
	 */
	function partida($conexion){
		partida_content($conexion);
	}
	
	/**
	 * FUNCIÓN DE CONTENIDO
	 * Función que muestra la interfaz de juego de FBG.
	 * 
	 *  @param $conexion Mysqli - Conexion a base de datos.
	 */
	function partida_content($conexion){
		echo "
			<div id='interfaz'>
				<div id='columnaInfo' class='alignCenter'>
					<a href='partidas.php'>
						<img id='matchAvatar' src='".avatar($conexion)."'/>
					</a>
								
					<div id='datos'>
		";
		partida_datosPartida($conexion,null);
		echo "
					</div>
								
					<table>
						<tr>
							<td colspan='2'>CAMARA:</td>
						</tr>
						<tr>
							<td colspan='2' id='zoom'></td>
						</tr>
						<tr>
							<td colspan='2'>CURSOR</td>
						</tr>
						<tr>
							<td id='cursorX'>X: --</td>
							<td id='cursorY'>Y: --</td>
						</tr>
					</table>
					
					<div id='textofase'></div>
					<div id='panelout'>Panel Out</div>
					<div id='panelfase'>Panel Fase</div>
				</div>
				<div id='columnaPrincipal'>
					<div id='contenidoPrincipal'>
						<div id='game'>
							<canvas id='batalla'>
								No se pudo cargar el canvas de juego. Esto puede deberse a que tu navegador esté obsoleto o no lo tolere. Recomendamos el uso de Google Chrome o Mozilla Firefox.
							</canvas>
							<img id='terreno' src='src/mapas/mapa.jpg' />
						</div>
					</div>
					<table id='desplegable'>
						<tr><td colspan='2' id='cabecera' class='alignCenter'>Detalles</td></tr>
						<tr>
							<td id='panelin'></td>
							<td id='datosSeleccion'></td>
						</tr>
					</table>
				</div>
			</div>
		";
	}
	
	
	/**
	 * FUNCIÓN DE CONTENIDO
	 * Función que muestra filas de tabla con los datos básicos de una partida.
	 */
	function partida_datosPartida($conexion,$ejercito){
		echo "<table class='alignCenter'>";
		if($ejercito != null){
			
			$sentencia = $conexion -> prepare("CALL proceso_datosPartida(?)");
			$sentencia -> bind_param('i', $ejercito);
			$sentencia -> execute();
			$sentencia -> store_result();
			if($sentencia -> num_rows == 1){
				/** Si no existieran entradas con ese nickname devolvería false.*/
				/** Establecemos las columnas del resultado en variables */
				$sentencia -> bind_result(
					$ejercitoId
					,$usuario
					,$partidaId
					,$orden
					,$nickEnemigo
					,$ejercitoNombre
					,$listaId
					,$pts
					,$turnos
					,$fase
					,$fechaInicio
					,$faseFinalizada
				);
				$sentencia -> fetch();
			}
			else{
				//En caso de error regresamos al listado de partidas
				header("Location: partidas.php");
			}
			
			/** Comprobamos que el usuario tiene permiso para acceder a estos datos**/
			if($usuario == $_SESSION['userId']){
				echo "
					<tr>
						<td colspan='2' class='enfasis' id='ejercitoNombre'>$ejercitoNombre</td>
					</tr>
					<tr>
						<td colspan='2' class='enfasis subtitle'>Partida a $pts puntos</td>
					</tr>
					<tr>
						<td colspan='2' class='enfasis subtitle'>contra $nickEnemigo</td>
					</tr>
					<tr>
						<td>Orden</td>
						<td id='userorder'>$orden</td>
					</tr>
					<tr>
						<td>Turno</td>
						<td id='turno'>$turnos</td>
					</tr>
					<tr>
						<td>Fase</td>
						<td id='fase'>
				";
				/**Si la ultima fase del usuario está terminada indicamos que es el turno del enemigo.*/
				if($faseFinalizada){
					echo "Fase del Enemigo.";
				}
				else{
					echo $fase;
				}
				
				echo "
						</td>
					</tr>
						
					<tr class='oculto'>
						<td>
							<input type='hidden' id='partidaId' value='$partidaId'/>
							<input type='hidden' id='ejercitoId' value='$ejercitoId'/>
							<input type='hidden' id='pts' value='$pts'/>
						</td>
					</tr>
				";
				$sentencia -> close();
			}
			
			/**En caso de no tener permisos le añadimos 2 faltas**/
			else{
				$sentencia -> close();
				addFaltaUser($conexion, $_SESSION['userId']);
				addFaltaUser($conexion, $_SESSION['userId']);
			}
		}
		
		else{
			echo "
				<tr>
					<td>Orden</td>
					<td id='userorder'></td>
				</tr>
				<tr>
					<td>Turno</td>
					<td id='turno'></td>
				</tr>
				<tr>
					<td>Fase</td>
					<td id='fase'></td>
				</tr>
			";
		}
		echo "</table>";
	}
	
	
	/**
	 * 
	 */
	function partida_elegirLista($conexion,$pts){
		echo "
			<p class='subtitle alignLeft'>
				Elige una Lista para jugar la partida o crea una nueva:<br/>
			</p>
			<form method='POST' id='listas' class='scrollingBox'>
				<table id='listasContent' class='scrollingBoxContent'>
		";
		
		$sentencia = $conexion -> prepare("CALL proceso_listasUsuarioPts(?,?)");
		$sentencia -> bind_param('ii', $_SESSION['userId'], $pts);
		$sentencia -> execute();
		$sentencia -> store_result();
		if ($sentencia -> num_rows > 0) {
			$sentencia -> bind_result($lId,$lNombre,$lPts,$lNumTropas);
			$i=0;
			while($sentencia -> fetch()){
				echo "<tr class='lista";
				if($i%2==0){
					echo " pairRow";
				}
				else{
					echo " inpairRow";
				}
			
				echo "
					'>
						<td id='$lId' class='alignCenter'>
							$lNombre<br/>
							$lPts puntos - $lNumTropas tropas
							<input id='nombreLista$lId' type='hidden' value='$lNombre'/>
							<input id='ptsLista$lId' type='hidden' value='$lPts'/>
							<input id='tropasLista$lId' type='hidden' value='$lNumTropas'/>
						</td>
					</tr>
				";
				$i++;
			}
		}
		else{
			echo "
				<tr>
					<td class='Enfasis'>
						No tienes ninguna lista para la puntuación requerida.
					</td>
				</tr>
			";
		}
		echo "
				<tr>
					<td><a href='listas.php'>Ir a la sección de listas.</a></td>
				</tr>
				</table>
			</form>
			<div id='listasMoving' class='scrollingBoxMoving'>
				<div id='listasMovingUp' class='scrollingBoxMovingUp'></div>
				<div id='listasMovingBar' class='scrollingBoxMovingBar'></div>
				<div id='listasMovingDown' class='scrollingBoxMovingDown'></div>
			</div>
		";
	}
?>