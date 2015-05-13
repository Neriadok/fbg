<?php

	/**
	 * FUNCIÓN DE ESTRUCTURA
	 * Función que genera el contenido de la página de listas de ejército
	 *
	 * @param $conexion Mysqli - Conexion a base de datos.
	 */
	function listas($conexion){
		listas_navegacion($conexion);
		echo "<div id='contenido' class='contenedor mid column'>";
		listas_contenido($conexion,null);
		echo "</div>
			<div class='contenedor right top box'>
				Listas mas usadas
			</div>
			<div class='contenedor right bot box'>
				Listas mas exitosas
			</div>
		";
	}
	
	/**
	 * FUNCIÓN DE CONTENIDO
	 * Función que genera la barra de navegación.
	 *
	 * @param $conexion Mysqli - Conexion a base de datos.
	 */
	function listas_navegacion($conexion){
		$urle=esc_url($_SERVER['PHP_SELF']);
		echo "
			<div id='barranavegacion' class='contenedor left column'>
				<div class='botonsBar'>
					<div class='boton' id='listasBegin'><img src='src/botones/arriba.png'/></div>
					<div class='boton' id='listasEnd'><img src='src/botones/abajo.png'/></div>
					<form class='boton' id='newList' action='$urle' method='POST'><img src='src/botones/add.png'/></form>
					<form class='boton' id='volver' action='$urle' method='POST'><img src='src/botones/volver.png'/></form>
				</div>
				<table class='tHead'>
					<tr>
						<td class='lNombre'>Nombre</td>
						<td class='lPuntos'>Pts</td>
						<td class='lNTropas'>Tropas</td>
					</tr>
				</table>
				<form action='$urle' method='POST' id='listas' class='scrollingBox'>
					<table id='listasContent' class='scrollingBoxContent'>
		";
		
		$sentencia = $conexion -> prepare("CALL proceso_listasUsuario(?)");
		$sentencia -> bind_param('i', $_SESSION['userId']);
		$sentencia -> execute();
		$sentencia -> store_result();
		$sentencia -> bind_result($lId,$lNombre,$lPts,$lNumTropas);
		$i=0;
		while($sentencia -> fetch()){
			echo "<tr id='$lId' class='lista";
			if($i%2==0){
				echo " pairRow";
			}
			else{
				echo " inpairRow";
			}
		
			echo "
				'>
					<td class='lNombre'>$lNombre</td>
					<td class='lPuntos'>$lPts</td>
					<td class='lNTropas'>$lNumTropas</td>
				</tr>
			";
			$i++;
		}
		echo "
					</table>
				</form>
				<div id='listasMoving' class='scrollingBoxMoving'>
					<div id='listasMovingUp' class='scrollingBoxMovingUp'></div>
					<div id='listasMovingBar' class='scrollingBoxMovingBar'></div>
					<div id='listasMovingDown' class='scrollingBoxMovingDown'></div>
				</div>
			</div>
		";
		
	}
	
	/**
	 * FUNCIÓN DE ESTRUCTURA
	 * Función que genera el contenido principal de la página de listas
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @param $datos Array - Conjunto de datos recibidos en formato JSON.
	 */
	function listas_contenido($conexion,$datos){
		if(isset($datos['destino'])){
			switch($datos['destino']){
				case "newList": listas_form_nuevalista($conexion); break;
				default: 
					listas_contenidoDefault($conexion);
			}
		}
		else if(isset($datos['lista'])){
			$lista = preg_replace("/[^a-zA-Z0-9_.,:áéíóúüñÁÉÍÓÚÜÑ\r\n \-]+/","",$datos['lista']);
			listas_lista($conexion,$lista);
		}
		else if(isset($datos['modificarLista'])){
			$lista = preg_replace("/[^0-9]+/","",$datos['modificarLista']);
			
			if($lista != "") listas_form_modlista($conexion,$lista);
			else header("Location: listas.php");
		}
		else{
			listas_contenidoDefault($conexion);
		}
	}
	
	/**
	 * FUNCIÓN DE CONTENIDO
	 * Función que muestra el contenido por defecto en la sección de listas de ejército.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 */
	function listas_contenidoDefault($conexion){
		echo"
			<h1>Administrar Listas de Ejercito</h1>
		";
	}
	
	/**
	 * FUNCIÓN DE CONTENIDO
	 * Función que nos muestra los detalles de una lista de ejército prviamente seleccionada.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @param $lista integer unsigned - Id de la lista a mostrar.
	 */
	function listas_lista($conexion,$lista){
		$urle=esc_url($_SERVER['PHP_SELF']);
		$sentencia = $conexion -> prepare("CALL proceso_lista(?)");
		$sentencia -> bind_param('i', $lista);
		$sentencia -> execute();
		$sentencia -> store_result();
		$sentencia -> bind_result($lNombre,$lUser,$lPts,$lRaza,$lTropas,$lUnidades);
		if($sentencia -> fetch()){
			$sentencia -> close();
			echo "
				<table class='listName'>
					<tr>
						<td>$lNombre</td>
					</tr>
				</table>
				<form action='$urle' method='POST' class='oculto' id='listaActual'>$lista</form>
				<div class='botonsBar'>
					<div class='boton' id='tropasBegin'><img src='src/botones/arriba.png'/></div>
					<div class='boton' id='tropasEnd'><img src='src/botones/abajo.png'/></div>
					<div class='submit modificarLista' id='modificarLista'><img src='src/botones/editar.png'/></div>
					<div id='eliminarBoton' class='botonVentana'><img src='src/botones/eliminar.png'/></div>
					<div id='eliminar' class='ventana oculto'>
						<h2 id='eliminarSelector' class='ventanaSelector'>Eliminar lista: $lNombre</h2>
						<div class='ventanaContent error'>
							<p>¿Estas seguro de querer eliminar esta lista de ejercito?</p>
							<div class='submit eliminarLista' id='eliminarLista'><img src='src/botones/eliminar.png'/></div>
						</div>
					</div>
				</div>
				<div id='tropas' class='scrollingBox'>
					<div id='tropasContent' class='scrollingBoxContent'>
						<table class='listDetails'>
							<tr>
								<td>Puntos: $lPts</td>
								<td>Raza: $lRaza</td>
								<td>Nº Tropas: $lTropas</td>
								<td>Nº Unidades: $lUnidades</td>
							</tr>
						</table>
						<table>
							
			";
			$sentencia = $conexion -> prepare("CALL proceso_componentesLista(?)");
			$sentencia -> bind_param('i', $lista);
			$sentencia -> execute();
			$sentencia -> store_result();
			$sentencia -> bind_result($tId,$tNombre,$tPts,$tGen,$tBEst,$tChamp,$tMusico,$tEst,$tTipo,$tRango,$tUnidades);
			
			$tropaNombre = null;
			$tPts = null;
			$tTipo = null;
			$tRango = null;
			$tUnidades = null;
			
			while($resultado = $sentencia -> fetch()){
				$tropaNombre[$tId] = $tNombre;
				$tropaPts[$tId] = $tPts;
				$tropaTipo[$tId] = $tTipo;
				$tropaRango[$tId] = $tRango;
				$tropaUnidades[$tId] = $tUnidades;
			}
			$sentencia -> close();
			

			if($tropaNombre != null){
				$i=0;
				foreach($tropaNombre as $tropaId => $tropa){
					$i++;
					echo "<tr id='$tropaId' class='tropa";
					if($i%2==0){
						echo " pairRow";
					}
					else{
						echo " inpairRow";
					}
					
					echo "
						'>
							<td class='tropaTD'>$tropa</td>
							<td class='unidadesTD'>x$tropaUnidades[$tropaId]</td>
							<td class='puntosTD'>$tropaPts[$tropaId] pts</td>
							<td class='tipoTD'>$tropaTipo[$tropaId]</td>
							<td class='detallesTD'>
								<div id='detalles".$tropaId."Boton' class='botonVentana'><img src='src/botones/info.png'/></div>
								<div id='detalles".$tropaId."' class='ventana oculto'>
									<h2 id='detalles".$tropaId."Selector' class='ventanaSelector'>$tropa: Detalles</h2>
									<div class='ventanaContent'>
										<table>
											<tr>
												<td class='tipoUTD'></td>
												<td class='atributoTD'>MOV</td>
												<td class='atributoTD'>HA</td>
												<td class='atributoTD'>HP</td>
												<td class='atributoTD'>F</td>
												<td class='atributoTD'>R</td>
												<td class='atributoTD'>PS</td>
												<td class='atributoTD'>I</td>
												<td class='atributoTD'>A</td>
												<td class='atributoTD'>L</td>
											</tr>
					";
					$sentencia = $conexion -> prepare("CALL proceso_perfilTropa(?)");
					$sentencia -> bind_param('i', $tropaId);
					$sentencia -> execute();
					$sentencia -> store_result();
					$sentencia -> bind_result($tipo,$mov,$ha,$hp,$f,$r,$ps,$in,$a,$l);
					
					$j=0;
					while($sentencia -> fetch()){
						echo "<tr class='unidad";
						if($j%2==0){
							echo " pairRow";
						}
						else{
							echo " inpairRow";
						}
							
						echo "
							'>
								<td class='tipoUTD'>$tipo</td>
								<td class='atributoTD'>$mov</td>
								<td class='atributoTD'>$ha</td>
								<td class='atributoTD'>$hp</td>
								<td class='atributoTD'>$f</td>
								<td class='atributoTD'>$r</td>
								<td class='atributoTD'>$ps</td>
								<td class='atributoTD'>$in</td>
								<td class='atributoTD'>$a</td>
								<td class='atributoTD'>$l</td>
							</tr>
						";
	
						$j++;
					}
					$sentencia -> close();
						
					echo "
										</table>
									</div>
								</div>
							</td>
						</tr>
					";
				}
			}
			echo "
						</table>
					</div>
				</div>
				<div id='tropasMoving' class='scrollingBoxMoving'>
					<div id='tropasMovingUp' class='scrollingBoxMovingUp'></div>
					<div id='tropasMovingBar' class='scrollingBoxMovingBar'></div>
					<div id='tropasMovingDown' class='scrollingBoxMovingDown'></div>
				</div>
			";
		}
		else{
			$sentencia -> close();
			header("Location: listas.php");
		}
	}
	
	/**
	 * FUNCIÓN DE CONTENIDO
	 * Función que genera el formulario para nuevas listas
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 */
	function listas_form_nuevalista($conexion){
		$urle=esc_url($_SERVER['PHP_SELF']);
		echo "
			<h2>Nueva lista de ejército</h2>
			<div class='botonsBar'>
				<div class='boton' id='formulariolistaBegin'><img src='src/botones/arriba.png'/></div>
				<div class='boton' id='formulariolistaEnd'><img src='src/botones/abajo.png'/></div>
				<div class='boton' id='addPer'><img src='src/botones/addper.png'/></div>
				<div class='boton' id='addTropa'><img src='src/botones/addtropa.png'/></div>
				<div class='submit' id='savelist'><img src='src/botones/guardar.png'/></div>
			</div>
			<table class='scrollingBoxHead'>
				<tr class='scrollingBoxHeadRow'>
				</tr>
			</table>
			<form id='formulariolista' class='scrollingBox' action='$urle' method='POST'>
				<div id='formulariolistaContent' class='scrollingBoxContet'>
					<table class='tablehead'>
						<tr>
							<td>
								<label for='nombreLista'>Nombre de la Lista</label>
							</td>
							<td>
								<input id='nombreLista' type='text' name='nombreLista'/>
							</td>
							<td>
								<span id='puntosLista'>0</span> puntos
							</td>
						</tr>
					</table>
					<table>
						<thead class='tablehead'>
							<tr>
								<td colspan='6'>Personajes</td>
							</tr>
							<tr>
								<td class='col1'>Detalles</td>
								<td class='col2'>Rango</td>
								<td class='col3'>Nombre</td>
								<td class='col4'>Tipo</td>
								<td class='col5'>Puntos</td>
								<td class='col6'>Opciones</td>
							</tr>
						</thead>
						<tbody id='personajes'>
							
						</tbody>
					</table>
					<table>
						<thead class='tablehead'>
							<tr>
								<td colspan='6'>Tropas</td>
							</tr>
							<tr>
								<td class='col1'>Detalles</td>
								<td class='col2'>Miembros</td>
								<td class='col3'>Nombre</td>
								<td class='col4'>Tipo</td>
								<td class='col5'>Puntos</td>
								<td class='col6'>Opciones</td>
							</tr>
						</thead>
						<tbody id='tropas'>
							
						</tbody>
					</table>
				</div>
			</form>
			<div id='formulariolistaMoving' class='scrollingBoxMoving'>
				<div id='formulariolistaMovingUp' class='scrollingBoxMovingUp'></div>
				<div id='formulariolistaMovingBar' class='scrollingBoxMovingBar'></div>
				<div id='formulariolistaMovingDown' class='scrollingBoxMovingDown'></div>
			</div>
		";
	}
	
	/**
	 * FUNCIÓN DE CONTENIDO
	 * Función que genera el formulario para modificar una lista
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @param $lista integer unsigned - Id de la lista que vamos a modificar.
	 */
	function listas_form_modlista($conexion,$lista){
		$urle=esc_url($_SERVER['PHP_SELF']);
		
		$sentencia = $conexion -> prepare("CALL proceso_lista(?)");
		$sentencia -> bind_param('i', $lista);
		$sentencia -> execute();
		$sentencia -> store_result();
		$sentencia -> bind_result($lNombre,$lUser,$lPts,$lRaza,$lTropas,$lUnidades);
		if($sentencia -> fetch()){
			$sentencia -> close();
		echo "
				<h2>Modificar lista: $lNombre</h2>
				<div class='botonsBar'>
					<div class='boton' id='formulariolistaBegin'><img src='src/botones/arriba.png'/></div>
					<div class='boton' id='formulariolistaEnd'><img src='src/botones/abajo.png'/></div>
					<div class='boton' id='addPer'><img src='src/botones/addper.png'/></div>
					<div class='boton' id='addTropa'><img src='src/botones/addtropa.png'/></div>
					<div class='submit' id='saveeditlist'><img src='src/botones/guardar.png'/></div>
				</div>
				<table class='scrollingBoxHead'>
					<tr class='scrollingBoxHeadRow'>
					</tr>
				</table>
				<form id='formulariolista' class='scrollingBox' action='$urle' method='POST'>
					<div class='oculto' id='listaActual'>$lista</div>
					<div id='formulariolistaContent' class='scrollingBoxContet'>
						<table class='tablehead'>
							<tr>
								<td>
									Puntos Previos:
								</td>
								<td>
									$lPts puntos
								</td>
								<td>
									Puntos Actuales:
								</td>
								<td>
									<span id='puntosLista'>$lPts</span> puntos
								</td>
							</tr>
						</table>
						<table>
							<thead class='tablehead'>
								<tr>
									<td colspan='6'>Personajes</td>
								</tr>
								<tr>
									<td class='col1'>Detalles</td>
									<td class='col2'>Rango</td>
									<td class='col3'>Nombre</td>
									<td class='col4'>Tipo</td>
									<td class='col5'>Puntos</td>
									<td class='col6'>Opciones</td>
								</tr>
							</thead>
							<tbody id='personajes'>
			";
			
			
			//Insertamos filas para los personajes existentes
			$sentencia = $conexion -> prepare("CALL proceso_personajesLista(?)");
			$sentencia -> bind_param('i', $lista);
			$sentencia -> execute();
			$sentencia -> store_result();
			$sentencia -> bind_result(
					$personajeId
					,$personajeNombre
					,$personajePts
					,$personajeGen
					,$personajeEstBat
					,$personajeTipo
					,$personajeTipoNombre
					,$personajeRango
			);
			
			
			$pId = null;
			$pNombre = null;
			$pPts = null;
			$pGen = null;
			$pEstBat = null;
			$pTipo = null;
			$pTipoNombre = null;
			$pRango = null;
			$n = 0;
				
			while($sentencia -> fetch()){
				$pId[$n] = $personajeId;
				$pNombre[$n] = $personajeNombre;
				$pPts[$n] = $personajePts;
				$pGen[$n] = $personajeGen;
				$pEstBat[$n] = $personajeEstBat;
				$pTipo[$n] = $personajeTipo;
				$pTipoNombre[$n] = $personajeTipoNombre;
				$pRango[$n] = $personajeRango;
				$n++;
			}
			$sentencia -> close();
			
			if($pId != null){
				foreach($pId as $n => $personaje){
					echo "
						 <tr class='personajerow
					 ";
						
						
					if($n%2==0){
						echo " pairRow";
					}
					else{
						echo " inpairRow";
					}
					echo"
						 '>
							<td class='col1'>Personaje ".($n+1)."</td>
							<td class='col2'>
								<select class='rangoPersonaje' name='rangoPersonaje[".$n."]'>
					";
					switch($pRango[$n]){
						case 6: echo "<option value='6' checked='checked'>Heroe</option>" ; break;
						case 7: echo "<option value='7' checked='checked'>Comandante</option>" ; break;
						case 8: echo "<option value='8' checked='checked'>Portaestandarte de Batalla</option>" ; break;
						case 9: echo "<option value='9' checked='checked'>General</option>" ; break;
					}
					echo "
									<option value='6'>Heroe</option>
									<option value='7'>Comandante</option>
									<option value='8'>Portaestandarte de Batalla</option>
									<option value='9'>General</option>
								</select>
							</td>
							<td class='col3'><input class='nombreTP nombrePersonaje' name='nombrePersonaje[".$n."]' type='text' value='".$pNombre[$n]."'></td>
							<td class='col4'>
								<select class='tipoPersonaje' name='tipoPersonaje[".$n."]'>
									<option value='".$pTipo[$n]."'>".$pTipoNombre[$n]."</option>
									<option value='1'>Infantería</option>
								</select>
							</td>
							<td class='col5'><input class='puntosTP puntosPersonaje' name='puntosPersonaje[".$n."]' type='integer' value='".$pPts[$n]."'></td>
							<td class='col6'>
								<div id='detallesPersonaje".$n."Boton' class='botonVentana'><img src='src/botones/info.png'/></div>
								<div id='detallesPersonaje".$n."' class='ventana oculto'>
									<h2 id='detallesPersonaje".$n."Selector' class='ventanaSelector'>Detalles del ".($n+1)."º Personaje</h2>
									<div class='ventanaContent'>
										<table>
											<tr><td  colspan='10' class='tablehead alignleft'>Atributos:</td></tr>
											<tr class='atributos'>
												<td class='tipoUTD'>Componentes</td>
												<td class='atributoMovTD'>M</td>
												<td class='atributoTD'>HA</td>
												<td class='atributoTD'>HP</td>
												<td class='atributoTD'>F</td>
												<td class='atributoTD'>R</td>
												<td class='atributoTD'>PS</td>
												<td class='atributoTD'>I</td>
												<td class='atributoTD'>A</td>
												<td class='atributoTD'>L</td>
											</tr>
					";
						
					//Añadimos la seleccion para los atributos de los miembros,
					//añadiendo un option con el valor actual de dicho atributo si existiese.
					//Personaje
					$sentencia = $conexion -> prepare("CALL proceso_perfilComponente(?,?)");
					$sentencia -> bind_param('ii', $personaje, $pRango[$n]);
					$sentencia -> execute();
					$sentencia -> store_result();
					$sentencia -> bind_result($tipo,$mov,$ha,$hp,$f,$r,$ps,$in,$a,$l);
					$sentencia -> fetch();
					if($sentencia -> num_rows >= 1){
						formularioTropa("Personaje", "Personaje", $n, $mov, $ha, $hp, $f, $r, $ps, $in, $a, $l);
					}
					else{
						formularioTropa("Personaje", "Personaje", $n, null, null, null, null, null, null, null, null, null);
					}
					$sentencia -> close();
					
					//Miembros-Dotacion
					$sentencia = $conexion -> prepare("CALL proceso_perfilComponente(?,2)");
					$sentencia -> bind_param('i', $personaje);
					$sentencia -> execute();
					$sentencia -> store_result();
					$sentencia -> bind_result($tipo,$mov,$ha,$hp,$f,$r,$ps,$in,$a,$l);
					$sentencia -> fetch();
					if($sentencia -> num_rows >= 1){
						formularioTropa("<label for='monturaPersonaje".$n."'>Montura-Bestias de Tiro</label> <input type='checkbox' id='monturaPersonaje".$n."' class='monturaPersonaje' name='monturaPersonaje[".$n."]' checked='checked'/>", "MonturaPersonaje", $n, $mov, $ha, $hp, $f, $r, $ps, $in, $a, $l);
					}
					else{
						formularioTropa("<label for='monturaPersonaje".$n."'>Montura-Bestias de Tiro</label> <input type='checkbox' id='monturaPersonaje".$n."' class='monturaPersonaje' name='monturaPersonaje[".$n."]'/>", "MonturaPersonaje", $n, null, null, null, null, null, null, null, null, null);
					}
					$sentencia -> close();
				
				
					//Montura-Bestias tiro
					$sentencia = $conexion -> prepare("CALL proceso_perfilComponente(?,1)");
					$sentencia -> bind_param('i', $personaje);
					$sentencia -> execute();
					$sentencia -> store_result();
					$sentencia -> bind_result($tipo,$mov,$ha,$hp,$f,$r,$ps,$in,$a,$l);
					$sentencia -> fetch();
					if($sentencia -> num_rows >= 1){
						formularioTropa("<label for='maquinaPersonaje".$n."'>Maquinaria-Carro</label> <input type='checkbox' id='maquinaPersonaje".$n."' class='maquinaPersonaje' name='maquinaPersonaje[".$n."]' checked='checked'/>","MaquinariaPersonaje", $n, $mov, $ha, $hp, $f, $r, $ps, $in, $a, $l);
					}
					else{
						formularioTropa("<label for='maquinaPersonaje".$n."'>Maquinaria-Carro</label> <input type='checkbox' id='maquinaPersonaje".$n."' class='maquinaPersonaje' name='maquinaPersonaje[".$n."]'/>","MaquinariaPersonaje", $n, null, null, null, null, null, null, null, null, null);
					}
					$sentencia -> close();
				
					
					//Maquinaria
					$sentencia = $conexion -> prepare("CALL proceso_perfilComponente(?,0)");
					$sentencia -> bind_param('i', $personaje);
					$sentencia -> execute();
					$sentencia -> store_result();
					$sentencia -> bind_result($tipo,$mov,$ha,$hp,$f,$r,$ps,$in,$a,$l);
					$sentencia -> fetch();
					if($sentencia -> num_rows >= 1){
						formularioTropa("<label for='dotacionPersonaje".$n."'>Dotacion</label> <input type='checkbox' id='dotacionPersonaje".$n."' class='dotacionPersonaje' name='dotacionPersonaje[".$n."]' checked='checked'/>","DotacionPersonaje", $n, $mov, $ha, $hp, $f, $r, $ps, $in, $a, $l);
					}
					else{
						formularioTropa("<label for='dotacionPersonaje".$n."'>Dotacion</label> <input type='checkbox' id='dotacionPersonaje".$n."' class='dotacionPersonaje' name='dotacionPersonaje[".$n."]'/>","DotacionPersonaje", $n, null, null, null, null, null, null, null, null, null);
					}
					$sentencia -> close();

					echo "
										</table>
									</div>
								</div>
							</td>
						</tr>
					";
				}
			}
			echo "
								</tbody>
							</table>
							<table>
								<thead class='tablehead'>
									<tr>
										<td colspan='6'>Tropas</td>
									</tr>
									<tr>
										<td class='col1'>Detalles</td>
										<td class='col2'>Miembros</td>
										<td class='col3'>Nombre</td>
										<td class='col4'>Tipo</td>
										<td class='col5'>Puntos</td>
										<td class='col6'>Opciones</td>
									</tr>
								</thead>
								<tbody id='tropas'>
			";
			
			//Insertamos filas para las tropas existentes
			$sentencia = $conexion -> prepare("CALL proceso_tropasLista(?)");
			$sentencia -> bind_param('i', $lista);
			$sentencia -> execute();
			$sentencia -> store_result();
			$sentencia -> bind_result(
					$tropaId
					,$tropaNombre
					,$tropaMiembros
					,$tropaPts
					,$tropaChamp
					,$tropaMusico
					,$tropaEst
					,$tropaTipo
					,$tropaTipoNombre
					,$tropaRango
			);
			
			$tId = null;
			$tNombre = null;
			$tMiembros = null;
			$tPts = null;
			$tChamp = null;
			$tMusico = null;
			$tEst = null;
			$tTipo = null;
			$tTipoNombre = null;
			$tRango = null;
			$n = 0;

			while($sentencia -> fetch()){
					$tId[$n] = $tropaId;
					$tNombre[$n] = $tropaNombre;
					$tMiembros[$n] = $tropaMiembros;
					$tPts[$n] = $tropaPts;
					$tChamp[$n] = $tropaChamp;
					$tMusico[$n] = $tropaMusico;
					$tEst[$n] = $tropaEst;
					$tTipo[$n] = $tropaTipo;
					$tTipoNombre[$n] = $tropaTipoNombre;
					$tRango[$n] = $tropaRango;
					$n++;
			}
			$sentencia -> close();
			if($tId != null){
				foreach($tId as $n => $tropa){
					echo "
						<tr class='troparow
					";
					
			
					if($n%2==0){
						echo " pairRow";
					}
					else{
						echo " inpairRow";
					}
					echo"
						'>
							<td class='col1'>Tropa ".($n+1)."</td>
							<td class='col2'>
								<select class='unidadesTropa' name='unidadesTropa[".$n."]'>
										<option value='".$tMiembros[$n]."' checked='checked'>".$tMiembros[$n]." x</option>
					";
					//El numero de unidades puede ir de 1 a 50, soy demasiado vago como para poner 50 options a mano
					for($i=1;$i<=50;$i++){
						echo "<option value='".$i."'>".$i." x</option>";
					}
					echo "
								</select>
							</td>
							<td class='col3'><input class='nombreTP nombreTropa' name='nombreTropa[".$n."]' type='text' value='".$tNombre[$n]."'></td>
							<td class='col4'>
								<select class='tipoTropa' name='tipoTropa[".$n."]'>
									<option value='".$tTipo[$n]."'>".$tTipoNombre[$n]."</option>
									<option value='1'>Infantería</option>
								</select>
							</td>
							<td class='col5'><input class='puntosTP puntosTropa' name='puntosTropa[".$n."]' type='integer' value='".$tPts[$n]."'></td>
							<td class='col6'>
								<div id='detallesTropa".$n."Boton' class='botonVentana'><img src='src/botones/info.png'/></div>
								<div id='detallesTropa".$n."' class='ventana oculto'>
									<h2 id='detallesTropa".$n."Selector' class='ventanaSelector'>Detalles de la ".($n+1)."ª Tropa</h2>
									<div class='ventanaContent'>
										<table>
											<tr>
												<td class='alignRight'><label for='musicoTropa".$n."'>Músico:</label></td>
												<td><input type='checkbox' id='musicoTropa".$n."' class='musicoTropa' name='musicoTropa[".$n."]'
					";
					if($tMusico[$n]) echo " checked='checked'";
					echo "	
												/></td>
												<td class='alignRight'><label for='portaestandarteTropa".$n."'>Portaestandarte:</label></td>
												<td><input type='checkbox' id='portaestTropa".$n."' class='portaestTropa' name='portaestTropa[".$n."]'
					";
					if($tEst[$n]) echo " checked='checked'";
					echo "	
												/></td>
												<td class='alignRight'><label for='champTropa".$n."'>Campeón:</label></td>
												<td><input type='checkbox' id='champTropa".$n."' class='champTropa' name='champTropa[".$n."]'
					";
					if($tChamp[$n]) echo " checked='checked'";
					echo "	
												/></td>
											</tr>
										</table>
										<table>
											<tr><td  colspan='10' class='tablehead alignleft'>Atributos:</td></tr>
											<tr class='atributos'>
												<td class='tipoUTD'>Componentes</td>
												<td class='atributoMovTD'>M</td>
												<td class='atributoTD'>HA</td>
												<td class='atributoTD'>HP</td>
												<td class='atributoTD'>F</td>
												<td class='atributoTD'>R</td>
												<td class='atributoTD'>PS</td>
												<td class='atributoTD'>I</td>
												<td class='atributoTD'>A</td>
												<td class='atributoTD'>L</td>
											</tr>
					";
	
					//Añadimos la seleccion para los atributos de los miembros,
					//añadiendo un option con el valor actual de dicho atributo si existiese.
					
					//Miembros-Dotacion
					$sentencia = $conexion -> prepare("CALL proceso_perfilComponente(?,2)");
					$sentencia -> bind_param('i', $tropa);
					$sentencia -> execute();
					$sentencia -> store_result();
					$sentencia -> bind_result($tipo,$mov,$ha,$hp,$f,$r,$ps,$in,$a,$l);
					$sentencia -> fetch();
					if($sentencia -> num_rows >= 1){
						formularioTropa("Miembros-Dotacion","Tropa", $n, $mov, $ha, $hp, $f, $r, $ps, $in, $a, $l);
					}
					else{
						formularioTropa("Miembros-Dotacion","Tropa", $n, null, null, null, null, null, null, null, null, null);
					};
					$sentencia -> close();
					
					
					//Montura-Bestias tiro
					$sentencia = $conexion -> prepare("CALL proceso_perfilComponente(?,1)");
					$sentencia -> bind_param('i', $tropa);
					$sentencia -> execute();
					$sentencia -> store_result();
					$sentencia -> bind_result($tipo,$mov,$ha,$hp,$f,$r,$ps,$in,$a,$l);
					$sentencia -> fetch();
					if($sentencia -> num_rows >= 1){
						formularioTropa("<label for='monturaTropa".$n."'>Montura-Bestias de Tiro</label> <input type='checkbox' id='monturaTropa".$n."' class='monturaTropa' name='monturaTropa[".$n."]' checked='checked'/>","MonturaTropa", $n, $mov, $ha, $hp, $f, $r, $ps, $in, $a, $l);
					}
					else{
						formularioTropa("<label for='monturaTropa".$n."'>Montura-Bestias de Tiro</label> <input type='checkbox' id='monturaTropa".$n."' class='monturaTropa' name='monturaTropa[".$n."]'/>","MonturaTropa", $n, null, null, null, null, null, null, null, null, null);
					}
					$sentencia -> close();
					
					
					//Maquinaria-Carro
					$sentencia = $conexion -> prepare("CALL proceso_perfilComponente(?,0)");
					$sentencia -> bind_param('i', $tropa);
					$sentencia -> execute();
					$sentencia -> store_result();
					$sentencia -> bind_result($tipo,$mov,$ha,$hp,$f,$r,$ps,$in,$a,$l);
					$sentencia -> fetch();
					if($sentencia -> num_rows >= 1){
						formularioTropa("<label for='maquinaTropa".$n."'>Maquinaria-Carro</label> <input type='checkbox' id='maquinaTropa".$n."' class='maquinaTropa' name='maquinaTropa[".$n."]' checked='checked'/>","MaquinariaTropa", $n, $mov, $ha, $hp, $f, $r, $ps, $in, $a, $l);
					}
					else{
						formularioTropa("<label for='maquinaTropa".$n."'>Maquinaria-Carro</label> <input type='checkbox' id='maquinaTropa".$n."' class='maquinaTropa' name='maquinaTropa[".$n."]'/>","MaquinariaTropa", $n, null, null, null, null, null, null, null, null, null);
					}
					$sentencia -> close();
				
					echo "
										</table>
									</div>
								</div>
							</td>
						</tr>
					";
				}
			}
			echo "
							</tbody>
						</table>
					</div>
				</form>
				<div id='formulariolistaMoving' class='scrollingBoxMoving'>
					<div id='formulariolistaMovingUp' class='scrollingBoxMovingUp'></div>
					<div id='formulariolistaMovingBar' class='scrollingBoxMovingBar'></div>
					<div id='formulariolistaMovingDown' class='scrollingBoxMovingDown'></div>
				</div>
			";
		}
	}
	
	/**
	 * FUNCIÓN DE EJECUCIÓN SETTER
	 * Función que registra los datos de una nueva lista de ejercito.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @param $datos Array - Datos recibidos en formato JSON
	 */
	function nuevaLista($conexion,$datos){
		$nombreLista = preg_replace("/[^a-zA-Z0-9_.,:áéíóúüñÁÉÍÓÚÜÑ\r\n \-]+/", "", $datos['nombreLista']);
		$ptsLista = preg_replace("/[^0-9]+/", "", $datos['ptsLista']);
				
		if($nombreLista != ""){
			$sentencia = $conexion -> prepare("CALL proceso_newlist(?,?,?,0)");
			$sentencia -> bind_param('isi', $_SESSION['userId'], $nombreLista, $ptsLista);
			$sentencia -> execute();
			$sentencia -> store_result();
		
			/**El procedure está preparado para devolver una vista
			 *  si no se logra ejecutar correctamente*/
			if($sentencia -> num_rows == 1){
				$sentencia -> bind_result($code,$tipo,$texto);
				$sentencia -> fetch();
				echo "
					<div id='listaYaExistente' class='alerta'>
						ERROR $code:<br/>
						$tipo<br/>
						$texto
					</div>
				";
				$sentencia -> close();
			}
			/**En caso contrario cerramos este procedure
			* y pasamos a lanzar un proceso
			* por cada tropa de la que se haya declarado el nombre*/
			else{
				$sentencia -> close();
				insertarPersonajes($conexion,$nombreLista,$datos);
				insertarTropas($conexion,$nombreLista,$datos);
			}
		}
		else{
			echo "<div id='alertaEnvioLista' class='alerta'>El nombre está vacío</div>";
		}
	}
	
	/**
	 * FUNCIÓN DE EJECUCIÓN SETTER
	 * Función que elimina una lista de ejército.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @param $datos Array - Datos recibidos en formato JSON
	 */
	function eliminarLista($conexion,$datos){
		$lista = preg_replace("/[^0-9]+/", "", $datos['listaAEliminar']);
				
		$sentencia = $conexion -> prepare("CALL proceso_deletelist(?)");
		$sentencia -> bind_param('i', $lista);
		$sentencia -> execute();
		$sentencia -> fetch();
		$sentencia -> close();
	}
	
	/**
	 * FUNCIÓN DE EJECUCIÓN SETTER
	 * Función que registra los cambios en una lista modificada. 
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @param $datos Array - Datos recibidos en formato JSON
	 */
	function modificarLista($conexion,$datos){
		$lista = preg_replace("/[^0-9]+/", "", $datos['listaAModificar']);
		$ptsLista = preg_replace("/[^0-9]+/", "", $datos['ptsLista']);
				
		
		$sentencia = $conexion -> prepare("CALL proceso_updatelist(?,?,0)");
		$sentencia -> bind_param('ii', $lista, $ptsLista);
		$sentencia -> execute();
		$sentencia -> store_result();
		
		
		$nombreLista = "";
		/**El procedure está preparado para devolver el nombre de la lista*/
		if($sentencia -> num_rows == 1){
			$sentencia -> bind_result($nombre);
			$sentencia -> fetch();
			$nombreLista = $nombre;
		}
		
		/**Lanzamos un procesopor cada tropa de la que se haya declarado el nombre.
		 * Estos procesos serán inutiles si el procedure no devolvio ningun nombre.
		 */
		$sentencia -> close();
		insertarPersonajes($conexion,$nombreLista,$datos);
		insertarTropas($conexion,$nombreLista,$datos);
	}

	/**
	 * FUNCIÓN DE EJECUCIÓN SETTER
	 * Funcion que añade las tropas a una lista.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @param $nombreLista String - nombre de la lista en que vamos a incluir las tropas.
	 * @param $datos Array - Datos recibidos en formato JSON
	 */
	function insertarTropas($conexion,$nombreLista,$datos){
		if(isset($datos['nombreTropa']) && $nombreLista != ""){
			//Datos básicos de las tropas
			$tropas = $datos['nombreTropa'];
			$unidadesTropas = $datos['unidadesTropa'];
			$tiposTropas = $datos['tipoTropa'];
			$ptsTropas = $datos['puntosTropa'];
				
			//Opciones de las tropas
			$musicoTropas = null;
			if(isset($datos['musicoTropa'])) $musicoTropas = $datos['musicoTropa'];
		
			$portaestTropas = null;
			if(isset($datos['portaestTropa'])) $portaestTropas = $datos['portaestTropa'];
		
			$champTropas = null;
			if(isset($datos['champTropa'])) $champTropas = $datos['champTropa'];
		
			$monturaTropas = null;
			if(isset($datos['monturaTropa'])) $monturaTropas = $datos['monturaTropa'];
		
			$maquinariaTropas = null;
			if(isset($datos['maquinaTropa'])) $maquinariaTropas = $datos['maquinaTropa'];
				
			//Atributos de los miembros o dotaciones de las tropas
			$movTropas = $datos['movimientoTropa'];
			$haTropas = $datos['haTropa'];
			$hpTropas = $datos['hpTropa'];
			$fTropas = $datos['fTropa'];
			$rTropas = $datos['rTropa'];
			$psTropas = $datos['psTropa'];
			$iTropas = $datos['iTropa'];
			$aTropas = $datos['aTropa'];
			$lTropas = $datos['lTropa'];
		
			//Atributos de las monturas de dichas tropas
			$movMonturaTropas = $datos['movimientoMonturaTropa'];
			$haMonturaTropas = $datos['haMonturaTropa'];
			$hpMonturaTropas = $datos['hpMonturaTropa'];
			$fMonturaTropas = $datos['fMonturaTropa'];
			$rMonturaTropas = $datos['rMonturaTropa'];
			$psMonturaTropas = $datos['psMonturaTropa'];
			$iMonturaTropas = $datos['iMonturaTropa'];
			$aMonturaTropas = $datos['aMonturaTropa'];
			$lMonturaTropas = $datos['lMonturaTropa'];
		
			//Atributos de las maquinarias
			$movMaquinariaTropas = $datos['movimientoMaquinariaTropa'];
			$haMaquinariaTropas = $datos['haMaquinariaTropa'];
			$hpMaquinariaTropas = $datos['hpMaquinariaTropa'];
			$fMaquinariaTropas = $datos['fMaquinariaTropa'];
			$rMaquinariaTropas = $datos['rMaquinariaTropa'];
			$psMaquinariaTropas = $datos['psMaquinariaTropa'];
			$iMaquinariaTropas = $datos['iMaquinariaTropa'];
			$aMaquinariaTropas = $datos['aMaquinariaTropa'];
			$lMaquinariaTropas = $datos['lMaquinariaTropa'];
		
			//Tratamos las tropas una a una
			foreach($tropas as $key => $nombre){
				//Testeamos los datos
				$nombre = preg_replace("/[^a-zA-Z0-9_.,:áéíóúüñÁÉÍÓÚÜÑ\r\n \-]+/", "", $nombre);
				if($nombre != ''){
					$unidades = preg_replace("/[^0-9]+/", "", $unidadesTropas[$key]);
					$tipo = preg_replace("/[^0-9]+/", "", $tiposTropas[$key]);
					$pts = preg_replace("/[^0-9]+/", "", $ptsTropas[$key]);
			
					$champ;
					if(isset($champTropas[$key]))$champ = $champTropas[$key];
					else $champ = false;
			
					$port;
					if(isset($portaestTropas[$key]))$port = $portaestTropas[$key];
					else  $port = false;
			
					$music;
					if(isset($musicoTropas[$key]))$music = $musicoTropas[$key];
					else  $music = false;
			
					//Preparamos el procedure
					$procedure = "CALL proceso_newTroop(?,?,?,?,?,?,false,false";
			
					//Verificamos si hay champ
					if($champ)$procedure .= ",true";
					else $procedure .= ",false";
			
					//Verificamos si hay portaestandarte
					if($port)$procedure .= ",true";
					else $procedure .= ",false";
			
					//Verificamos si hay músico
					if($music)$procedure .= ",true";
					else $procedure .= ",false";
			
					$procedure .= ")";
			
					$uid = $_SESSION['userId'];
			
					//Lanzamos el procedure
					$sentencia = $conexion -> prepare($procedure);
					$sentencia -> bind_param(
							'issiii'
							,$uid
							,$nombreLista
							,$nombre
							,$tipo
							,$unidades
							,$pts
					);
					$sentencia -> execute();
					$sentencia -> store_result();
			
					//Si hay dos o mas tropas con el mismo nombre añadirá un indice a las siguientes.
					//Mientras haya coincidencias, el proceso devolverá filas.
					//Mientras haya filas se mantiene el bucle while y el indice va aumentando.
					$index = 1;
					$newNom = "";
					while($sentencia -> num_rows == 1){
						//Cerramos la anterior sentencia, que nos dio filas, y aumentamos el indice.
						$sentencia -> close();
						$index++;
						$newNom = $nombre."-".$index;
						$sentencia = $conexion -> prepare($procedure);
						$sentencia -> bind_param(
								'issiii'
								,$uid
								,$nombreLista
								,$newNom
								,$tipo
								,$unidades
								,$pts
						);
						$sentencia -> execute();
						$sentencia -> store_result();
					}
					//Cerramos la ultima sentencia, que no nos dio filas como resultado.
					$sentencia -> close();
					//Si se incremento el indice, usamos el ultimo nombre que se dio a la tropa
					if($index>1)$nombre = $newNom;
						
					$mont;
					if(isset($monturaTropas[$key])) $mont = $monturaTropas[$key];
					else  $mont = false;
			
					$mach;
					if(isset($maquinariaTropas[$key]))$mach = $maquinariaTropas[$key];
					else  $mach = false;
			
					//Preparamos los atributos de las unidades componentes de la tropa
					$mov = preg_replace("/[^0-9]+/", "", $movTropas[$key]);
					$ha = preg_replace("/[^0-9]+/", "", $haTropas[$key]);
					$hp = preg_replace("/[^0-9]+/", "", $hpTropas[$key]);
					$f = preg_replace("/[^0-9]+/", "", $fTropas[$key]);
					$r = preg_replace("/[^0-9]+/", "", $rTropas[$key]);
					$ps = preg_replace("/[^0-9]+/", "", $psTropas[$key]);
					$i = preg_replace("/[^0-9]+/", "", $iTropas[$key]);
					$a = preg_replace("/[^0-9]+/", "", $aTropas[$key]);
					$l = preg_replace("/[^0-9]+/", "", $lTropas[$key]);
						
					//Mont+Mach = Carro
					if($mont && $mach){
						$movMontura = preg_replace("/[^0-9]+/", "", $movMonturaTropas[$key]);
						$haMontura = preg_replace("/[^0-9]+/", "", $haMonturaTropas[$key]);
						$hpMontura = preg_replace("/[^0-9]+/", "", $hpMonturaTropas[$key]);
						$fMontura = preg_replace("/[^0-9]+/", "", $fMonturaTropas[$key]);
						$rMontura = preg_replace("/[^0-9]+/", "", $rMonturaTropas[$key]);
						$psMontura = preg_replace("/[^0-9]+/", "", $psMonturaTropas[$key]);
						$iMontura = preg_replace("/[^0-9]+/", "", $iMonturaTropas[$key]);
						$aMontura = preg_replace("/[^0-9]+/", "", $aMonturaTropas[$key]);
						$lMontura = preg_replace("/[^0-9]+/", "", $lMonturaTropas[$key]);
			
						$movMaquinaria = preg_replace("/[^0-9]+/", "", $movMaquinariaTropas[$key]);
						$haMaquinaria = preg_replace("/[^0-9]+/", "", $haMaquinariaTropas[$key]);
						$hpMaquinaria = preg_replace("/[^0-9]+/", "", $hpMaquinariaTropas[$key]);
						$fMaquinaria = preg_replace("/[^0-9]+/", "", $fMaquinariaTropas[$key]);
						$rMaquinaria = preg_replace("/[^0-9]+/", "", $rMaquinariaTropas[$key]);
						$psMaquinaria = preg_replace("/[^0-9]+/", "", $psMaquinariaTropas[$key]);
						$iMaquinaria = preg_replace("/[^0-9]+/", "", $iMaquinariaTropas[$key]);
						$aMaquinaria = preg_replace("/[^0-9]+/", "", $aMaquinariaTropas[$key]);
						$lMaquinaria = preg_replace("/[^0-9]+/", "", $lMaquinariaTropas[$key]);
			
						//Tratamos las unidades una a una
						//Cada unidad se compone de un carro, dos soldados y dos caballos
						//Primero generamos los soldados
						$sentencia = $conexion -> prepare("CALL proceso_newUnit(?,?,?,1,2,false,?,?,?,?,?,?,?,?,?,false,false,true)");
						$sentencia -> bind_param(
								'issiiiiiiiii'
								, $uid
								, $nombreLista
								, $nombre
								, $mov
								, $ha
								, $hp
								, $f
								, $r
								, $ps
								, $i
								, $a
								, $l
						);
						
						$sentencia -> execute();
						$sentencia -> store_result();
			
						//Segundo generamos los caballos
						$sentencia = $conexion -> prepare("CALL proceso_newUnit(?,?,?,2,1,true,?,?,?,?,?,?,?,?,?,true,false,false)");
						$sentencia -> bind_param(
								'issiiiiiiiii'
								, $uid
								, $nombreLista
								, $nombre
								, $movMontura
								, $haMontura
								, $hpMontura
								, $fMontura
								, $rMontura
								, $psMontura
								, $iMontura
								, $aMontura
								, $lMontura
						);
						$sentencia -> execute();
						$sentencia -> store_result();
							
			
						//Por ultimo generamos el carro
						$sentencia = $conexion -> prepare("CALL proceso_newUnit(?,?,?,3,0,true,?,?,?,?,?,?,?,?,?,false,true,false)");
						$sentencia -> bind_param(
								'issiiiiiiiii'
								, $uid
								, $nombreLista
								, $nombre
								, $movMaquinaria
								, $haMaquinaria
								, $hpMaquinaria
								, $fMaquinaria
								, $rMaquinaria
								, $psMaquinaria
								, $iMaquinaria
								, $aMaquinaria
								, $lMaquinaria
						);
						$sentencia -> execute();
						$sentencia -> store_result();
					}
						
					//Mont = Caballeria
					else if($mont){
						$movMontura = preg_replace("/[^0-9]+/", "", $movMonturaTropas[$key]);
						$haMontura = preg_replace("/[^0-9]+/", "", $haMonturaTropas[$key]);
						$hpMontura = preg_replace("/[^0-9]+/", "", $hpMonturaTropas[$key]);
						$fMontura = preg_replace("/[^0-9]+/", "", $fMonturaTropas[$key]);
						$rMontura = preg_replace("/[^0-9]+/", "", $rMonturaTropas[$key]);
						$psMontura = preg_replace("/[^0-9]+/", "", $psMonturaTropas[$key]);
						$iMontura = preg_replace("/[^0-9]+/", "", $iMonturaTropas[$key]);
						$aMontura = preg_replace("/[^0-9]+/", "", $aMonturaTropas[$key]);
						$lMontura = preg_replace("/[^0-9]+/", "", $lMonturaTropas[$key]);
			
						//Tratamos las unidades una a una
						//Cada unidad se compone de un carro, dos soldados y dos caballos
						//Primero generamos los soldados
						$sentencia = $conexion -> prepare("CALL proceso_newUnit(?,?,?,1,2,false,?,?,?,?,?,?,?,?,?,false,false,true)");
						$sentencia -> bind_param(
								'issiiiiiiiii'
								, $uid
								, $nombreLista
								, $nombre
								, $mov
								, $ha
								, $hp
								, $f
								, $r
								, $ps
								, $i
								, $a
								, $l
						);
						
						$sentencia -> execute();
						$sentencia -> store_result();
			
						//Segundo generamos los caballos
						$sentencia = $conexion -> prepare("CALL proceso_newUnit(?,?,?,2,1,true,?,?,?,?,?,?,?,?,?,true,false,false)");
						$sentencia -> bind_param(
								'issiiiiiiiii'
								, $uid
								, $nombreLista
								, $nombre
								, $movMontura
								, $haMontura
								, $hpMontura
								, $fMontura
								, $rMontura
								, $psMontura
								, $iMontura
								, $aMontura
								, $lMontura
						);
						$sentencia -> execute();
						$sentencia -> store_result();
					}
						
					//Mach = Maquinaria
					else if($mach){
			
						$movMaquinaria = preg_replace("/[^0-9]+/", "", $movMaquinariaTropas[$key]);
						$haMaquinaria = preg_replace("/[^0-9]+/", "", $haMaquinariaTropas[$key]);
						$hpMaquinaria = preg_replace("/[^0-9]+/", "", $hpMaquinariaTropas[$key]);
						$fMaquinaria = preg_replace("/[^0-9]+/", "", $fMaquinariaTropas[$key]);
						$rMaquinaria = preg_replace("/[^0-9]+/", "", $rMaquinariaTropas[$key]);
						$psMaquinaria = preg_replace("/[^0-9]+/", "", $psMaquinariaTropas[$key]);
						$iMaquinaria = preg_replace("/[^0-9]+/", "", $iMaquinariaTropas[$key]);
						$aMaquinaria = preg_replace("/[^0-9]+/", "", $aMaquinariaTropas[$key]);
						$lMaquinaria = preg_replace("/[^0-9]+/", "", $lMaquinariaTropas[$key]);
			
						//Tratamos las unidades una a una
						//Cada unidad se compone de un carro, dos soldados y dos caballos
						//Primero generamos los soldados
						$sentencia = $conexion -> prepare("CALL proceso_newUnit(?,?,?,1,2,true,?,?,?,?,?,?,?,?,?,false,false,true)");
						$sentencia -> bind_param(
								'issiiiiiiiii'
								, $uid
								, $nombreLista
								, $nombre
								, $mov
								, $ha
								, $hp
								, $f
								, $r
								, $ps
								, $i
								, $a
								, $l
						);
						
						$sentencia -> execute();
						$sentencia -> store_result();
			
						//Por ultimo generamos el carro
						$sentencia = $conexion -> prepare("CALL proceso_newUnit(?,?,?,3,0,true,?,?,?,?,?,?,?,?,?,false,true,false)");
						$sentencia -> bind_param(
								'issiiiiiiiii'
								, $uid
								, $nombreLista
								, $nombre
								, $movMaquinaria
								, $haMaquinaria
								, $hpMaquinaria
								, $fMaquinaria
								, $rMaquinaria
								, $psMaquinaria
								, $iMaquinaria
								, $aMaquinaria
								, $lMaquinaria
						);
						$sentencia -> execute();
						$sentencia -> store_result();
					}
			
					else{//Default = Tropa
						//Tratamos las unidades una a una
						//Cada unidad se compone de un carro, dos soldados y dos caballos
						//Primero generamos los soldados
						$sentencia = $conexion -> prepare("CALL proceso_newUnit(?,?,?,1,2,true,?,?,?,?,?,?,?,?,?,false,false,true)");
						$sentencia -> bind_param(
								'issiiiiiiiii'
								, $uid
								, $nombreLista
								, $nombre
								, $mov
								, $ha
								, $hp
								, $f
								, $r
								, $ps
								, $i
								, $a
								, $l
						);
						
						$sentencia -> execute();
						$sentencia -> store_result();
					}
				}
			}
		}
	}

	/**
	 * FUNCIÓN DE EJECUCIÓN SETTER
	 * Funcion que añade los personajes a una lista.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @param $nombreLista String - Nombre de la lista en que vamos a incluir los personajes.
	 * @param $datos Array - Datos recibidos en formato JSON
	 */
	function insertarPersonajes($conexion,$nombreLista,$datos){
		if(isset($datos['nombrePersonaje'])){
			//Datos básicos de las tropas
			$personajes = $datos['nombrePersonaje'];
			$rangoPer = $datos['rangoPersonaje'];
			$tiposPer = $datos['tipoPersonaje'];
			$ptsPer = $datos['puntosPersonaje'];
		
			$monturaPer = null;
			if(isset($datos['monturaPersonaje']))$monturaPer = $datos['monturaPersonaje'];
		
			$maquinariaPer = null;
			if(isset($datos['maquinaPersonaje']))$maquinariaPer = $datos['maquinaPersonaje'];
		
			$dotacionPer = null;
			if(isset($datos['dotacionPersonaje']))$dotacionPer = $datos['dotacionPersonaje'];
				
			//Atributos de los miembros o dotaciones de las tropas
			$movPer = $datos['movimientoPersonaje'];
			$haPer = $datos['haPersonaje'];
			$hpPer = $datos['hpPersonaje'];
			$fPer = $datos['fPersonaje'];
			$rPer = $datos['rPersonaje'];
			$psPer = $datos['psPersonaje'];
			$iPer = $datos['iPersonaje'];
			$aPer = $datos['aPersonaje'];
			$lPer = $datos['lPersonaje'];
		
			//Atributos de las monturas de dichas tropas
			$movMonturaPer = $datos['movimientoMonturaPersonaje'];
			$haMonturaPer = $datos['haMonturaPersonaje'];
			$hpMonturaPer = $datos['hpMonturaPersonaje'];
			$fMonturaPer = $datos['fMonturaPersonaje'];
			$rMonturaPer = $datos['rMonturaPersonaje'];
			$psMonturaPer = $datos['psMonturaPersonaje'];
			$iMonturaPer = $datos['iMonturaPersonaje'];
			$aMonturaPer = $datos['aMonturaPersonaje'];
			$lMonturaPer = $datos['lMonturaPersonaje'];
		
			//Atributos de las maquinarias
			$movMaquinariaPer = $datos['movimientoMaquinariaPersonaje'];
			$haMaquinariaPer = $datos['haMaquinariaPersonaje'];
			$hpMaquinariaPer = $datos['hpMaquinariaPersonaje'];
			$fMaquinariaPer = $datos['fMaquinariaPersonaje'];
			$rMaquinariaPer = $datos['rMaquinariaPersonaje'];
			$psMaquinariaPer = $datos['psMaquinariaPersonaje'];
			$iMaquinariaPer = $datos['iMaquinariaPersonaje'];
			$aMaquinariaPer = $datos['aMaquinariaPersonaje'];
			$lMaquinariaPer = $datos['lMaquinariaPersonaje'];
		
			//Atributos de las dotaciones
			$movDotacionPer = $datos['movimientoDotacionPersonaje'];
			$haDotacionPer = $datos['haDotacionPersonaje'];
			$hpDotacionPer = $datos['hpDotacionPersonaje'];
			$fDotacionPer = $datos['fDotacionPersonaje'];
			$rDotacionPer = $datos['rDotacionPersonaje'];
			$psDotacionPer = $datos['psDotacionPersonaje'];
			$iDotacionPer = $datos['iDotacionPersonaje'];
			$aDotacionPer = $datos['aDotacionPersonaje'];
			$lDotacionPer = $datos['lDotacionPersonaje'];
		
			//Tratamos las tropas una a una
			foreach($personajes as $key => $nombre){
				//Testeamos los datos
				$nombre = preg_replace("/[^a-zA-Z0-9_.,:áéíóúüñÁÉÍÓÚÜÑ\r\n \-]+/", "", $nombre);
				if($nombre != ''){
					$rango = preg_replace("/[^0-9]+/", "", $rangoPer[$key]);
					$tipo = preg_replace("/[^0-9]+/", "", $tiposPer[$key]);
					$pts = preg_replace("/[^0-9]+/", "", $ptsPer[$key]);
			
					//Preparamos el procedure
					$procedure = "CALL proceso_newTroop(?,?,?,?,1,?";
			
					//Verificamos si se trata del general
					if($rangoPer == 9){
						$procedure .= ",true";
					}
					else $procedure .= ",false";
					
					//Verificamos si es el estandarte de batalla
					if($rangoPer == 8){
						$procedure .= ",true";
					}
					else $procedure .= ",false";
					
	
	
					$procedure .= ",false,false,false)";
			
					$uid = $_SESSION['userId'];
			
					//Lanzamos el procedure
					$sentencia = $conexion -> prepare($procedure);
					$sentencia -> bind_param(
							'issii'
							,$uid
							,$nombreLista
							,$nombre
							,$tipo
							,$pts
					);
					$sentencia -> execute();
					$sentencia -> store_result();
			
					//Si hay dos o mas tropas con el mismo nombre añadirá un indice a las siguientes.
					//Mientras haya coincidencias, el proceso devolverá filas.
					//Mientras haya filas se mantiene el bucle while y el indice va aumentando.
					$index = 1;
					$newNom = "";
					while($sentencia -> num_rows == 1){
						//Cerramos la anterior sentencia, que nos dio filas, y aumentamos el indice.
						$sentencia -> close();
						$index++;
						$newNom = $nombre."-".$index;
						$sentencia = $conexion -> prepare($procedure);
						$sentencia -> bind_param(
								'issii'
								,$uid
								,$nombreLista
								,$newNom
								,$tipo
								,$pts
						);
						$sentencia -> execute();
						$sentencia -> store_result();
					}
					//Cerramos la ultima sentencia, que no nos dio filas como resultado.
					$sentencia -> close();
					//Si se incremento el indice, usamos el ultimo nombre que se dio a la tropa
					if($index>1)$nombre = $newNom;
						
					$mont;
					if(isset($monturaPer[$key]))$mont = $monturaPer[$key];
					else  $mont = false;
			
					$mach;
					if(isset($maquinariaPer[$key])) $mach = $maquinariaPer[$key];
					else  $mach = false;
			
					$dot;
					if(isset($dotacionPer[$key]))$dot = $dotacionPer[$key];
					else  $dot = false;
			
					//Preparamos los atributos del personaje
					$mov = preg_replace("/[^0-9]+/", "", $movPer[$key]);
					$ha = preg_replace("/[^0-9]+/", "", $haPer[$key]);
					$hp = preg_replace("/[^0-9]+/", "", $hpPer[$key]);
					$f = preg_replace("/[^0-9]+/", "", $fPer[$key]);
					$r = preg_replace("/[^0-9]+/", "", $rPer[$key]);
					$ps = preg_replace("/[^0-9]+/", "", $psPer[$key]);
					$i = preg_replace("/[^0-9]+/", "", $iPer[$key]);
					$a = preg_replace("/[^0-9]+/", "", $aPer[$key]);
					$l = preg_replace("/[^0-9]+/", "", $lPer[$key]);
	
						
					//Mont+Mach = Carro
					if($mont && $mach){
						//Cada unidad se compone de un carro, el personaje, un caballo y quizá su dotacion
						$sentencia = $conexion -> prepare("CALL proceso_newUnit(?,?,?,1,?,false,?,?,?,?,?,?,?,?,?,false,false,false)");
						$sentencia -> bind_param(
								'issiiiiiiiiii'
								, $uid
								, $nombreLista
								, $nombre
								, $rango
								, $mov
								, $ha
								, $hp
								, $f
								, $r
								, $ps
								, $i
								, $a
								, $l
						);
						$sentencia -> execute();
						$sentencia -> store_result();
	
	
						if($dot){
							//Si tiene dotacion, preparamos los atributos de esta
							$movDot = preg_replace("/[^0-9]+/", "", $movDotacionPer[$key]);
							$haDot = preg_replace("/[^0-9]+/", "", $haDotacionPer[$key]);
							$hpDot = preg_replace("/[^0-9]+/", "", $hpDotacionPer[$key]);
							$fDot = preg_replace("/[^0-9]+/", "", $fDotacionPer[$key]);
							$rDot = preg_replace("/[^0-9]+/", "", $rDotacionPer[$key]);
							$psDot = preg_replace("/[^0-9]+/", "", $psDotacionPer[$key]);
							$iDot = preg_replace("/[^0-9]+/", "", $iDotacionPer[$key]);
							$aDot = preg_replace("/[^0-9]+/", "", $aDotacionPer[$key]);
							$lDot = preg_replace("/[^0-9]+/", "", $lDotacionPer[$key]);
	
							//Las dotaciones tienen rango 2
							$sentencia = $conexion -> prepare("CALL proceso_newUnit(?,?,?,1,2,false,?,?,?,?,?,?,?,?,?,false,false,true)");
							$sentencia -> bind_param(
									'issiiiiiiiii'
									, $uid
									, $nombreLista
									, $nombre
									, $movDot
									, $haDot
									, $hpDot
									, $fDot
									, $rDot
									, $psDot
									, $iDot
									, $aDot
									, $lDot
							);
							$sentencia -> execute();
							$sentencia -> store_result();
						}
	
						$movMontura = preg_replace("/[^0-9]+/", "", $movMonturaPer[$key]);
						$haMontura = preg_replace("/[^0-9]+/", "", $haMonturaPer[$key]);
						$hpMontura = preg_replace("/[^0-9]+/", "", $hpMonturaPer[$key]);
						$fMontura = preg_replace("/[^0-9]+/", "", $fMonturaPer[$key]);
						$rMontura = preg_replace("/[^0-9]+/", "", $rMonturaPer[$key]);
						$psMontura = preg_replace("/[^0-9]+/", "", $psMonturaPer[$key]);
						$iMontura = preg_replace("/[^0-9]+/", "", $iMonturaPer[$key]);
						$aMontura = preg_replace("/[^0-9]+/", "", $aMonturaPer[$key]);
						$lMontura = preg_replace("/[^0-9]+/", "", $lMonturaPer[$key]);
			
						$movMaquinaria = preg_replace("/[^0-9]+/", "", $movMaquinariaPer[$key]);
						$haMaquinaria = preg_replace("/[^0-9]+/", "", $haMaquinariaPer[$key]);
						$hpMaquinaria = preg_replace("/[^0-9]+/", "", $hpMaquinariaPer[$key]);
						$fMaquinaria = preg_replace("/[^0-9]+/", "", $fMaquinariaPer[$key]);
						$rMaquinaria = preg_replace("/[^0-9]+/", "", $rMaquinariaPer[$key]);
						$psMaquinaria = preg_replace("/[^0-9]+/", "", $psMaquinariaPer[$key]);
						$iMaquinaria = preg_replace("/[^0-9]+/", "", $iMaquinariaPer[$key]);
						$aMaquinaria = preg_replace("/[^0-9]+/", "", $aMaquinariaPer[$key]);
						$lMaquinaria = preg_replace("/[^0-9]+/", "", $lMaquinariaPer[$key]);
	
					
			
						//Segundo generamos los caballos
						$sentencia = $conexion -> prepare("CALL proceso_newUnit(?,?,?,2,1,false,?,?,?,?,?,?,?,?,?,true,false,false)");
						$sentencia -> bind_param(
							'issiiiiiiiii'
								, $uid
								, $nombreLista
								, $nombre
								, $movMontura
								, $haMontura
								, $hpMontura
								, $fMontura
								, $rMontura
								, $psMontura
								, $iMontura
								, $aMontura
								, $lMontura
						);
						$sentencia -> execute();
						$sentencia -> store_result();
			
						//Por ultimo generamos el carro
						$sentencia = $conexion -> prepare("CALL proceso_newUnit(?,?,?,3,0,true,?,?,?,?,?,?,?,?,?,false,true,false)");
						$sentencia -> bind_param(
								'issiiiiiiiii'
								, $uid
								, $nombreLista
								, $nombre
								, $movMaquinaria
								, $haMaquinaria
								, $hpMaquinaria
								, $fMaquinaria
								, $rMaquinaria
								, $psMaquinaria
								, $iMaquinaria
								, $aMaquinaria
								, $lMaquinaria
						);
						$sentencia -> execute();
						$sentencia -> store_result();
					}
						
					//Mont = Caballeria
					else if($mont){
						//Cada unidad se compone del personaje y un caballo
						$sentencia = $conexion -> prepare("CALL proceso_newUnit(?,?,?,1,?,false,?,?,?,?,?,?,?,?,?,false,false,false)");
						$sentencia -> bind_param(
								'issiiiiiiiiii'
								, $uid
								, $nombreLista
								, $nombre
								, $rango
								, $mov
								, $ha
								, $hp
								, $f
								, $r
								, $ps
								, $i
								, $a
								, $l
						);
						$sentencia -> execute();
						$sentencia -> store_result();
	
						$movMontura = preg_replace("/[^0-9]+/", "", $movMonturaPer[$key]);
						$haMontura = preg_replace("/[^0-9]+/", "", $haMonturaPer[$key]);
						$hpMontura = preg_replace("/[^0-9]+/", "", $hpMonturaPer[$key]);
						$fMontura = preg_replace("/[^0-9]+/", "", $fMonturaPer[$key]);
						$rMontura = preg_replace("/[^0-9]+/", "", $rMonturaPer[$key]);
						$psMontura = preg_replace("/[^0-9]+/", "", $psMonturaPer[$key]);
						$iMontura = preg_replace("/[^0-9]+/", "", $iMonturaPer[$key]);
						$aMontura = preg_replace("/[^0-9]+/", "", $aMonturaPer[$key]);
						$lMontura = preg_replace("/[^0-9]+/", "", $lMonturaPer[$key]);
			
						//Segundo generamos el caballo
						$sentencia = $conexion -> prepare("CALL proceso_newUnit(?,?,?,2,1,true,?,?,?,?,?,?,?,?,?,true,false,false)");
						$sentencia -> bind_param(
								'issiiiiiiiii'
								, $uid
								, $nombreLista
								, $nombre
								, $movMontura
								, $haMontura
								, $hpMontura
								, $fMontura
								, $rMontura
								, $psMontura
								, $iMontura
								, $aMontura
								, $lMontura
						);
						$sentencia -> execute();
						$sentencia -> store_result();
					}
						
					//Mach = Maquinaria
					else if($mach){
						//Cada unidad se compone de la maquinaria, el personaje y quizá su dotacion
						$sentencia = $conexion -> prepare("CALL proceso_newUnit(?,?,?,1,?,false,?,?,?,?,?,?,?,?,?,false,false,false)");
						$sentencia -> bind_param(
								'issiiiiiiiiii'
								, $uid
								, $nombreLista
								, $nombre
								, $rango
								, $mov
								, $ha
								, $hp
								, $f
								, $r
								, $ps
								, $i
								, $a
								, $l
						);
						$sentencia -> execute();
						$sentencia -> store_result();
	
	
						
						//preparamos los atributos de la dotacion
						$movDot = preg_replace("/[^0-9]+/", "", $movDotacionPer[$key]);
						$haDot = preg_replace("/[^0-9]+/", "", $haDotacionPer[$key]);
						$hpDot = preg_replace("/[^0-9]+/", "", $hpDotacionPer[$key]);
						$fDot = preg_replace("/[^0-9]+/", "", $fDotacionPer[$key]);
						$rDot = preg_replace("/[^0-9]+/", "", $rDotacionPer[$key]);
						$psDot = preg_replace("/[^0-9]+/", "", $psDotacionPer[$key]);
						$iDot = preg_replace("/[^0-9]+/", "", $iDotacionPer[$key]);
						$aDot = preg_replace("/[^0-9]+/", "", $aDotacionPer[$key]);
						$lDot = preg_replace("/[^0-9]+/", "", $lDotacionPer[$key]);

						//Las dotaciones tienen rango 2
						$sentencia = $conexion -> prepare("CALL proceso_newUnit(?,?,?,1,2,true,?,?,?,?,?,?,?,?,?,false,false,true)");
						$sentencia -> bind_param(
								'issiiiiiiiii'
								, $uid
								, $nombreLista
								, $nombre
								, $movDot
								, $haDot
								, $hpDot
								, $fDot
								, $rDot
								, $psDot
								, $iDot
								, $aDot
								, $lDot
						);
						$sentencia -> execute();
						$sentencia -> store_result();
	
			
						//Por ultimo generamos la maquinaria
						$sentencia = $conexion -> prepare("CALL proceso_newUnit(?,?,?,3,0,true,?,?,?,?,?,?,?,?,?,false,true,false)");
						$sentencia -> bind_param(
								'issiiiiiiiii'
								, $uid
								, $nombreLista
								, $nombre
								, $movMaquinaria
								, $haMaquinaria
								, $hpMaquinaria
								, $fMaquinaria
								, $rMaquinaria
								, $psMaquinaria
								, $iMaquinaria
								, $aMaquinaria
								, $lMaquinaria
						);
						$sentencia -> execute();
						$sentencia -> store_result();
					}
			
					else{//Default = Personaje a Pie
						$sentencia = $conexion -> prepare("CALL proceso_newUnit(?,?,?,1,?,false,?,?,?,?,?,?,?,?,?,false,false,false)");
						$sentencia -> bind_param(
								'issiiiiiiiiii'
								, $uid
								, $nombreLista
								, $nombre
								, $rango
								, $mov
								, $ha
								, $hp
								, $f
								, $r
								, $ps
								, $i
								, $a
								, $l
						);
						$sentencia -> execute();
						$sentencia -> store_result();
					}
				}
			}
		}
	}
	
	/**
	 * FUNCIÓN DE CONTENIDO
	 * Función que genera los formularios para editar o crear una tropa.
	 * Una componente es parte de una unidad.
	 * Ejemplo: En una unidad de caballería las componentes son un caballo y un jinete.
	 * 
	 * @param $text String - Texto a mostrar sobre la componente.
	 * @param $componente String - componente de la unidad.
	 * @param $n integer unsigned - numero de la tropa o personaje a identificar.
	 * @param $mov, $ha, $hp, $f, $r, $ps, $in, $a, $l integer unsigned - Atributos de juego de la tropa.
	 */
	function formularioTropa($text, $componente, $n, $mov, $ha, $hp, $f, $r, $ps, $in, $a, $l){
		//Los atributos tienen un valor máximo de 10
		$maxA = 10;
		
		if($mov!=null && $ha!=null && $hp!=null && $f!=null && $r!=null && $ps!=null && $in!=null && $a!=null && $l){
			echo "
				<tr class='atributos'>
					<td class='tipoUTD'>$text</td>
					<td class='atributoMovTD'>
						<select class='movimiento".$componente."' name='movimiento".$componente."[".$n."]'>
							<option value='$mov' checked='checked'>".$mov."cm</option>
							<option value='0'>0cm</option>
							<option value='3'>3cm</option>
							<option value='5'>5cm</option>
							<option value='8'>8cm</option>
							<option value='10'>10cm</option>
							<option value='12'>12cm</option>
							<option value='15'>15cm</option>
							<option value='18'>18cm</option>
							<option value='20'>20cm</option>
							<option value='22'>22cm</option>
							<option value='25'>25cm</option>
							<option value='30'>30cm</option>
						</select>
					</td>
					<td class='atributoTD'>
						<select class='ha".$componente."' name='ha".$componente."[".$n."]'>
							<option value='".$ha."' checked='checked'>".$ha."</option>
			";
			for($i=0;$i<=$maxA;$i++){
				echo "<option value='".$i."'>".$i."</option>";
			}
			echo "
						</select>
					</td>
					<td class='atributoTD'>
						<select class='hp".$componente."' name='hp".$componente."[".$n."]'>
							<option value='".$hp."' checked='checked'>".$hp."</option>
			";
			for($i=0;$i<=$maxA;$i++){
				echo "<option value='".$i."'>".$i."</option>";
			}
			echo "
						</select>
					</td>
					<td class='atributoTD'>
						<select class='f".$componente."' name='f".$componente."[".$n."]'>
							<option value='".$f."' checked='checked'>".$f."</option>
			";
			for($i=0;$i<=$maxA;$i++){
				echo "<option value='".$i."'>".$i."</option>";
			}
			echo "
						</select>
					</td>
					<td class='atributoTD'>
						<select class='r".$componente."' name='r".$componente."[".$n."]'>
							<option value='".$r."' checked='checked'>".$r."</option>
			";
			for($i=0;$i<=$maxA;$i++){
				echo "<option value='".$i."'>".$i."</option>";
			}
			echo "
						</select>
					</td>
					<td class='atributoTD'>
						<select class='ps".$componente."' name='ps".$componente."[".$n."]'>
							<option value='".$ps."' checked='checked'>".$ps."</option>
			";
			for($i=0;$i<=$maxA;$i++){
				echo "<option value='".$i."'>".$i."</option>";
			}
			echo "
						</select>
					</td>
					<td class='atributoTD'>
						<select class='i".$componente."' name='i".$componente."[".$n."]'>
							<option value='".$in."' checked='checked'>".$in."</option>
			";
			for($i=0;$i<=$maxA;$i++){
				echo "<option value='".$i."'>".$i."</option>";
			}
			echo "
						</select>
					</td>
					<td class='atributoTD'>
						<select class='a".$componente."' name='a".$componente."[".$n."]'>
							<option value='".$a."' checked='checked'>".$a."</option>
			";
			for($i=0;$i<=$maxA;$i++){
				echo "<option value='".$i."'>".$i."</option>";
			}
			echo "
						</select>
					</td>
					<td class='atributoTD'>
						<select class='l".$componente."' name='l".$componente."[".$n."]'>
							<option value='".$l."' checked='checked'>".$l."</option>
			";
			for($i=0;$i<=$maxA;$i++){
				echo "<option value='".$i."'>".$i."</option>";
			}
			echo "
						</select>
					</td>
				</tr>
			";
		}
		else{
			echo "
				<tr class='atributos'>
					<td class='tipoUTD'>$text</td>
					<td class='atributoMovTD'>
						<select class='movimiento".$componente."' name='movimiento".$componente."[".$n."]'>
							<option value='0'>0cm</option>
							<option value='3'>3cm</option>
							<option value='5'>5cm</option>
							<option value='8'>8cm</option>
							<option value='10'>10cm</option>
							<option value='12'>12cm</option>
							<option value='15'>15cm</option>
							<option value='18'>18cm</option>
							<option value='20'>20cm</option>
							<option value='22'>22cm</option>
							<option value='25'>25cm</option>
							<option value='30'>30cm</option>
						</select>
					</td>
					<td class='atributoTD'>
						<select class='ha".$componente."' name='ha".$componente."[".$n."]'>
			";
			for($i=0;$i<=$maxA;$i++){
				echo "<option value='".$i."'>".$i."</option>";
			}
			echo "
						</select>
					</td>
					<td class='atributoTD'>
						<select class='hp".$componente."' name='hp".$componente."[".$n."]'>
			";
			for($i=0;$i<=$maxA;$i++){
				echo "<option value='".$i."'>".$i."</option>";
			}
			echo "
						</select>
					</td>
					<td class='atributoTD'>
						<select class='f".$componente."' name='f".$componente."[".$n."]'>
			";
			for($i=0;$i<=$maxA;$i++){
				echo "<option value='".$i."'>".$i."</option>";
			}
			echo "
						</select>
					</td>
					<td class='atributoTD'>
						<select class='r".$componente."' name='r".$componente."[".$n."]'>
			";
			for($i=0;$i<=$maxA;$i++){
				echo "<option value='".$i."'>".$i."</option>";
			}
			echo "
						</select>
					</td>
					<td class='atributoTD'>
						<select class='ps".$componente."' name='ps".$componente."[".$n."]'>
			";
			for($i=0;$i<=$maxA;$i++){
				echo "<option value='".$i."'>".$i."</option>";
			}
			echo "
						</select>
					</td>
					<td class='atributoTD'>
						<select class='i".$componente."' name='i".$componente."[".$n."]'>
			";
			for($i=0;$i<=$maxA;$i++){
				echo "<option value='".$i."'>".$i."</option>";
			}
			echo "
						</select>
					</td>
					<td class='atributoTD'>
						<select class='a".$componente."' name='a".$componente."[".$n."]'>
			";
			for($i=0;$i<=$maxA;$i++){
				echo "<option value='".$i."'>".$i."</option>";
			}
			echo "
						</select>
					</td>
					<td class='atributoTD'>
						<select class='l".$componente."' name='l".$componente."[".$n."]'>
			";
			for($i=0;$i<=$maxA;$i++){
				echo "<option value='".$i."'>".$i."</option>";
			}
			echo "
						</select>
					</td>
				</tr>
			";
		}
	}
?>