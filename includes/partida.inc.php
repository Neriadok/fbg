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
								
					<table id='datos'>
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
					</table>
								
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
					<div id='panelin'>
						PanelIn
					</div>
				</div>
			</div>
		";
	}
	
	
	/**
	 * FUNCIÓN DE CONTENIDO
	 * Función que muestra la columna de información.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 */
	function partida_infoCol($conexion,$datos){
		echo "
			<tr>
				<td colspan='2'>
					<table>
					</table>
				</td>
			</tr>

			<tr>
				<td colspan='2' id='textofase'></td>
			</tr>

			<tr>
				<td colspan='2' id='panelout'>Panel Out</td>
			</tr>

			<tr>
				<td colspan='2' id='panelfase'>Panel Fase</td>
			</tr>
		";
	}
?>