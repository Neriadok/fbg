/**
  *  Clase que nos genera tropas en el juego.
  * 
  *  Una tropa consta de varias unidades, tengan o no distintos atributos,
  *  orgnizadas en una formacion.
  *  
  *  @author Daniel Mart�n D�az
  *  @version 1.1 (23/07/2014)
  */
function Tropa(tropaId,panelOut){
	/ * VARIABLES */
	//Car�cter�sticas
	var id = tropaId;
	var nombre = document.getElementById("nombre"+tropaId).innerHTML;
	var miembros = parseInt(document.getElementById("miembros"+tropaId).innerHTML);
	var user = document.getElementById("user"+tropaId).value;
	var larga = false;
	
	//Situacion
	var selected = false;
	var movida = false;
	var estado = document.getElementById("estado"+tropaId).innerHTML;
	var heridas = document.getElementById("heridas"+tropaId).innerHTML;
	var latitud = parseInt(document.getElementById("latitud"+tropaId).innerHTML);
	var altitud = parseInt(document.getElementById("altitud"+tropaId).innerHTML);
	var orientacion = parseInt(document.getElementById("orientacion"+tropaId).innerHTML) * Math.PI/180;
	var unidadesFila = document.getElementById("unidadesfila"+tropaId).innerHTML;
	var tropaAdoptivaId = document.getElementById("tropaadoptivaid"+tropaId).innerHTML;
	var tropaBajoAtaqueId = document.getElementById("tropabajoataqueid"+tropaId).innerHTML;
	var tropaBajoAtaqueFlanco = document.getElementById("tropabajoataqueflanco"+tropaId).innerHTML;
	
	//Miembros
	var unidad = [];
	var fichasUnidades = [];
	var tropaAdoptadaId = [];
	iniciarUnidades();
	
	
	
	/ * GETTERS */
	/**
	  *  Método get del atributo id
	  */
	this.getId = function(){
		return id;
	};
	
	/**
	  *  Método get del atributo nombre.
	  *  
	  *  @return nombre de la tropa.
	  */
	this.getNombre = function(){
		return nombre;
	};
	
	/**
	  *  Método get del atributo user.
	  *  
	  *  @return true si user == "si".
	  */
	this.getUser = function(){
		if(user == "si") return true;
		else return false;
	};
	
	/**
	  *  Método que comprueba si una tropa está en el campo.
	  *  
	  *  @return true si la tropa se encuentra en el terreno
	  */
	this.getEnCampo = function(){
		if(estado != "Eliminada" && estado != "Sin desplegar") return true;
		else return false;
	};
	
	/**
	  *  Método que comprueba si una tropa está realizando alguna acción o no esta en juego, de modo que no pueda realizar acciones.
	  *  
	  *  @return true si la tropa no puede realizar acciones.
	  */
	this.getOcupada = function(){
		if(estado != "En juego") return true;
		else return false;
	};
	
	/**
	  *  Método que comprueba si una tropa movio esta fase.
	  *  
	  *  @return true si la tropa no puede realizar acciones.
	  */
	this.getMovida = function(){
		return movida;
	};
	
	/**
	  *  Método get que retorna el rango mas bajo de las unidades
	  *  
	  *  @return rango mas bajo.
	  */
	this.getRangoBajo = function(){
		var min=10;
		for(var i=0;i<unidad.length;i++){
			if(unidad[i].getRango()<min){
				min=unidad[i].getRango();
			}
		}
		return min;
	};
	
	/**
	  *  Método get que retorna el rango mas bajo de las unidades
	  *  
	  *  @return rango mas bajo.
	  */
	this.esMaquinaria = function(){
		var maquinaria = false;
		
		for(var i=0;i<unidad.length;i++){
			if(
				unidad[i].getTipo() == "Artillería"
				|| unidad[i].getTipo() == "Carro"
			){
				maquinaria = true;
			}
		}
		return maquinaria;
	};
	
	/**
	  *  Método get que retorna el rango mas alto de las unidades
	  *  
	  *  @return rango mas alto.
	  */
	this.getRangoAlto = function(){
		var max=0;
		for(var i=0;i<unidad.length;i++){
			if(unidad[i].getRango()>max){
				max=unidad[i].getRango();
			}
		}
		return max;
	};
	
	/**
	  *  Método get que retorna las coordenadas del punto vanguardiaSiniestra.
	  *  
	  *  @return coordenadas X e Y de la esquina.
	  */
	this.getVanguardiaSiniestra = function(){
		var coor;
		if(estado != "Eliminada" && estado != "Sin desplegar"){
			coor = { x: latitud, y: altitud }; 
		}
		else{
			coor = { x: null, y: null };
		}
		return coor;
	};
	
	/**
	  *  Método get que retorna las coordenadas del punto vanguardiaDiestra.
	  *  
	  *  @return coordenadas X e Y de la esquina.
	  */
	this.getVanguardiaDiestra = function(){
		var coor;
		if(estado != "Eliminada" && estado != "Sin desplegar"){
			//X+cos(angulo) * ancho
			//Y+sen(angulo) * ancho
			var valorX = parseInt(latitud + dimensiones().ancho * Math.cos(orientacion));
			var valorY = parseInt(altitud + dimensiones().ancho * Math.sin(orientacion));
			coor = { x: valorX, y: valorY };
		}
		else{
			coor = { x: null, y: null };
		}
		return coor;
	};
	
	/**
	  *  Método get que retorna las coordenadas del punto vanguardiaDiestra.
	  *  
	  *  @return coordenadas X e Y de la esquina.
	  */
	this.getRetaguardiaSiniestra = function(){
		var coor;
		if(estado != "Eliminada" && estado != "Sin desplegar"){
			//X-sen(angulo) * alto
			//Y+cos(angulo) * alto
			var valorX = parseInt(latitud-dimensiones().alto * Math.sin(orientacion));
			var valorY = parseInt(altitud+dimensiones().alto * Math.cos(orientacion));
			coor = { x: valorX, y: valorY };
		}
		else{
			coor = { x: null, y: null };
		}
		return coor;
	};
	
	/**
	  *  Método get que retorna las coordenadas del punto retaguardiaDiestra.
	  *  
	  *  @return coordenadas X e Y de la esquina.
	  */
	this.getRetaguardiaDiestra = function(){
		var coor;
		if(estado != "Eliminada" && estado != "Sin desplegar"){
			//X+cos(angulo) * ancho-sen(angulo) * alto
			//Y+sen(angulo) * ancho+cos(angulo) * alto
			var valorX = parseInt(latitud+dimensiones().ancho * Math.cos(orientacion)-dimensiones().alto * Math.sin(orientacion));
			var valorY = parseInt(altitud+dimensiones().ancho * Math.sin(orientacion)+dimensiones().alto * Math.cos(orientacion));
			coor = { x: valorX , y: valorY };
		}
		else{
			coor = { x: null, y: null };
		}
		return coor;
	};
	
	/**
	  *  Método get que retorna las coordenadas del punto central de la tropa.
	  *  
	  *  @return coordenadas X e Y de la esquina.
	  */
	this.getCentro = function(){
		var coor;
		if(estado != "Eliminada" && estado != "Sin desplegar"){
			//X+(cos(angulo) * ancho-sen(angulo) * alto)/2
			//Y+(sen(angulo) * ancho+cos(angulo) * alto)/2
			var valorX = parseInt(latitud+(dimensiones().ancho * Math.cos(orientacion)-dimensiones().alto * Math.sin(orientacion))/2);
			var valorY = parseInt(altitud+(dimensiones().ancho * Math.sin(orientacion)+dimensiones().alto * Math.cos(orientacion))/2);
			coor = { x: valorX , y: valorY };
		}
		else{
			coor = { x: null, y: null };
		}
		return coor;
	};
	
	
	/**
	  *  Método get que retorna la orientacion en grados de la unidad.
	  *  
	  *  @return devuelve un integer
	  */
	this.getOrientacion = function(){
		return orientacion * 180/Math.PI;
	};
	
	
	/**
	  *  Método get que retorna la cantidad de unidades de la tropa.
	  *  
	  *  @return devuelve un integer
	  */
	this.getUnidades = function(){
		return parseInt(miembros);
	};
	
	
	/**
	  *  Método get que retorna el numero de unidades por fila.
	  *  
	  *  @return devuelve un integer
	  */
	this.getAnchoFila = function(){
		return unidadesFila;
	};
	
	
	/**
	  *  Método get que retorna el numero de heridas.
	  *  
	  *  @return devuelve un integer
	  */
	this.getHeridas = function(){
		return heridas;
	};
	
	
	/**
	  *  Método get que retorna el estado.
	  *  
	  *  @return devuelve un integer
	  */
	this.getEstado = function(){
		return estado;
	};
	
	
	/**
	  *  Método get que retorna el numero de heridas.
	  *  
	  *  @return devuelve un integer
	  */
	this.getTropaAdoptiva = function(){
		return tropaAdoptivaId;
	};
	
	
	/**
	  *  Método get que retorna el id de la unidad bajo ataque y el flanco que se encuentra bajo ataque.
	  */
	this.getTropaBajoAtaque = function(){
		return {id: tropaBajoAtaqueId, flanco: tropaBajoAtaqueFlanco};
	};
	
	
	/**
	  *  Método get que retorna el numero de filas no completas de la tropa.
	  *  
	  *  @return numero de filas incompletas.
	  */
	this.getFilasIncompletas = function(){
		var nFilasIncompletas = 0;
		if(estado != "Eliminada" && estado != "Sin desplegar"){
			for(var i=0;i<unidad.length;i++){
				if(i%unidadesFila==0){
					nFilasIncompletas++;
				}
			}
		}
		return nFilasIncompletas;
	};
	
	
	/**
	  *  Método get que retorna el movimiento de la tropa.
	  *  Una tropa mueve tanto como el mas lento de sus integrantes.
	  *  
	  *  @return Movimiento mas bajo.
	  */
	this.getMovimiento = function(){
		//Declaramos el minimo como el valor m�ximo permitido
		var movimiento = 40;
		
		for(var i=0;i<unidad.length;i++){
			//Comparamos cada una de las unidades y establecemos los menores.
			if(unidad[i].getMovimiento() < movimiento){
				movimiento = unidad[i].getMovimiento();
			}
		}
		//Si las unidades devolv�an MAX_VALUE, por no poder mover, establecemos el movimiento m�ximo como 0.
		if(movimiento == 40) return 0;
		else return movimiento;
	};
	
	
	/**
	  *  Método para devolver el ancho y el alto de la tropa.
	  *  
	  *  @return dimension del alto y dimension del ancho.
	  */
	this.getDimensiones = dimensiones();
		
	
	/ * M�TODOS INTERNOS */
	/**
	  *  Método que tras modificar los valores del panel de entrada (panelIn)
	  *  actualiza los atributos de la tropa.
	  */
	function actualizar(){
		estado = document.getElementById("estado"+tropaId).innerHTML;
		latitud = parseInt(document.getElementById("latitud"+tropaId).innerHTML);
		altitud = parseInt(document.getElementById("altitud"+tropaId).innerHTML);
		orientacion = parseInt(document.getElementById("orientacion"+tropaId).innerHTML) * Math.PI/180;
		unidadesFila = document.getElementById("unidadesfila"+tropaId).innerHTML;
		tropaAdoptivaId = document.getElementById("tropaadoptivaid"+tropaId).innerHTML;
		tropaBajoAtaqueId = document.getElementById("tropabajoataqueid"+tropaId).innerHTML;
		tropaBajoAtaqueFlanco = document.getElementById("tropabajoataqueflanco"+tropaId).innerHTML;
		iniciarUnidades();
	};
	
	
	/**
	  *  Método que nos inicia las unidades de juego.
	  */
	function iniciarUnidades(){
		//Vaciamos el array
		unidad = [];
		var nUnidad = 0;
		
		//Iniciamos las unidades propias
		for(;nUnidad<miembros;nUnidad++){
			unidad[nUnidad] = new  Unidad(tropaId, "ficha"+tropaId, selected, i, 0);
		}
		//Iniciamos las unidades adoptadas
		for(var i=0;i<tropaAdoptadaId.length;i++){
			for(var j=0; j<document.getElementById("miembros"+tropaAdoptadaId[i]).innerHTML; j++,nUnidad++){
				unidad[nUnidad] = new  Unidad(tropaAdoptadaId[i], "ficha"+tropaAdoptadaId[i], selected, j, 0);
			}
		}
		if(estado != "Eliminada" && estado != "Sin desplegar"){
			if(unidad.length<5){
				unidadesFila=unidad.length;
			}
			if(unidad.length>unidad.length){
				unidadesFila=unidad.length;
			}
		}
		
		ordenarUnidades();
	};
	
	
	/**
	  *  Método que ordena las unidades de la tropa en funcion de su rango.
	  *  Usamos el metodo de la burbuja con switch.
	  */
	function ordenarUnidades(){
		//Bucle para numero de vueltas de comparacion.
		for(var i=0;i<unidad.length-1;i++){
			//Bucle para numero de comparaciones.
			for(var j=1; j < unidad.length-i ;j++){
				//Si la unidad anterior tenia mayor rango:
				if(unidad[j].getRango() > unidad[j-1].getRango()){
					
					//se cambian de lugar
					var aux=unidad[j];
					unidad[j]=unidad[j-1];
					unidad[j-1]=aux;
					
				}
			}
		}
		
		/**
		  *  Tras haber organizado las unidades 
		  *  vamos retirando en orden las de menor rango
		  *  en función de las heridas de la tropa.
		  */
		//retirarUnidades();
	};
	
	
	/**
	  *  Método para comprobar el tama�o de peana mas grande
	  *  dentro de las unidades de la tropa.
	  *  
	  *  @return tama�o mas grande de peana.
	  */
	function maximoPeana(){
		var max=0;
		for(var i=0;i<unidad.length;i++){
			
			if(unidad[i].getPeana().peana >max){
				max=unidad[i].getPeana().peana;
			}
			
			if(unidad[i].getPeana().larga){
				larga = true;
			}
		}
		return max;
	};
	
	/**
	  *  Método para devolver el alto de las filas.
	  *  
	  *  @return alto de la fila.
	  */
	function altoFila(){
		var altoFila;
		
		if(larga){
			altoFila = maximoPeana() * 2;
		}
		else{
			altoFila = maximoPeana();
		}
		return altoFila;
	};
	
	
	/**
	  *  Método para devolver el ancho y el alto de la tropa.
	  *  
	  *  @return dimension del alto y dimension del ancho.
	  */
	function dimensiones(){
		var dim;
		if(estado != "Eliminada" && estado != "Sin desplegar"){
			//Comprobamos cuantas filas tiene la unidad
			var filas = 0;
			for(var i=0;i<unidad.length;i++){
					if(i%unidadesFila==0){
						filas++;
					}
			}
			
			var an = Math.round(maximoPeana() * unidadesFila);
			var al = Math.round(altoFila() * filas);
			
			dim = { ancho: an , alto: al };
		}
		else {
			dim = { ancho: null , alto: null };
		}
		
		return dim;
	};
	
	
	/**
	  *  Método que comprueba que un punto est� contenido en una recta,
	  *  por encima, o por debajo.
	  *  
	  *  @param xP coordenada x del punto.
	  *  @param yP coordenada y del punto.
	  *  @param xR coordenada x de un punto de la recta.
	  *  @param yR coordenada y de un punto de la recta.
	  *  @param angle angulo que forma la recta con la horizontal.
	  *  @return si el punto esta por encima de la recta
	  *  el metodo devolver� 1 en caso de estar encima o a la derecha de la recta, 0 si el punto esta contenido por ella
	  *  y en caso de estar debajo o a la izquierda devolvera -1.
	  */
	function posicionPuntoRecta(xP,yP,xR,yR,angle){
		//Si la recta es paralela a uno de los ejes tratamos las variables de la siguiente manera.
		if(angle == 90 || angle == 270){
			if(xP < xR){
				return -1;
			}else if(xP == xR){
				return 0;
			}else{
				return 1;
			}
		}
		
		
		//En caso contrario nos basamos en la ecuacion de la recta.
		else{
			var m = Math.tan(angle * Math.PI/180);
			var n = yR - xR * m;
			
			if(yP < xP * m + n){
				return -1;
			}
			else{
				if(yP == xP * m+n){
					return 0;
				}
				else{
					return 1;
				}
			}
		}
	};
	
	
	/**
	  *  Método que calcula la distancia entre dos puntos.
	  *  
	  *  @param x1 coordenada x del punto 1.
	  *  @param y1 coordenada y del punto 1.
	  *  @param x2 coordenada x del punto 2.
	  *  @param y2 coordenada y del punto 2.
	  *  @return devuelve la distancia en forma de entero.
	  */
	function distanciaPuntoPunto(x1,y1,x2,y2){
		var distanciaX = Math.abs(x1-x2);
		var distanciaY = Math.abs(y1-y2);
		var distancia = Math.sqrt(Math.pow(distanciaX,2)+Math.pow(distanciaY,2));
		return parseInt(distancia);
	};
	
	
	/**
	  *  Método que comprueba que un punto est� contenido en una recta,
	  *  por encima, o por debajo.
	  *  
	  *  @param xP coordenada x del punto.
	  *  @param yP coordenada y del punto.
	  *  @param xR coordenada x de un punto de la recta.
	  *  @param yR coordenada y de un punto de la recta.
	  *  @param angle angulo que forma la recta con la horizontal.
	  *  @return si el punto esta por encima de la recta
	  *  el metodo devolver� 1 en caso de estar encima o a la derecha de la recta, 0 si el punto esta contenido por ella
	  *  y en caso de estar debajo o a la izquierda devolvera -1.
	  */
	function distanciaPuntoRecta(xP,yP,xR,yR,angle){
		//y = mx+n
		var m = Math.tan(angle * Math.PI/180);
		var n = yR - xR * m;
		
		//(mx-y+n)/raiz cuadrada de m^2 +1 = distancia
		return parseInt((m * xP-yP+n)/Math.sqrt(Math.pow(m,2)+1));
	};
	
	
	/**
	  *  Método que comprieba si un punto est� en visi�n directa.
	  *  Es aconsejable establecer primero que est� en linea de visi�n.
	  *  @param x,y Coordenadas del punto a comprobar.
	  */
	function visionDirecta(x,y){
		var xVI = latitud;
		var yVI = altitud;
		var xVD = parseInt(latitud+dimensiones().ancho * Math.cos(orientacion));
		var yVD = parseInt(altitud+dimensiones().ancho * Math.sin(orientacion));
		var angle = orientacion * 180/Math.PI+90;
		if(posicionPuntoRecta(x,y,xVI,yVI,angle) <= 0 && posicionPuntoRecta(x,y,xVD,yVD,angle) >= 0) return true;
		if(posicionPuntoRecta(x,y,xVI,yVI,angle) >= 0 && posicionPuntoRecta(x,y,xVD,yVD,angle) <= 0) return true;
		return false;
	};
	


	/ * METODOS DE INTERACTUACION */
	/**
	  *  Método que ejecuta los procesos cuando esta tropa es seleccionada.
	  */
	this.seleccionar = function(){
		console.log("Seleccionada tropa "+tropaId);
		selected=true;
		document.getElementById(panelOut).innerHTML="Tropa <b>"+nombre+"</b> seleccionada. ";
	};
	
	
	/**
	  *  Método que ejecuta los procesos cuando esta tropa es deseleccionada.
	  */
	this.deseleccionar = function(){
		selected=false;
	};
	
	
	/**
	  *  Método que despliega la unidad en el campo de batalla.
	  *  
	  *  @param x latitud del despliegue.
	  *  @param y altitud del despliegue.
	  *  @param angle orientacion en que se despliega la tropa.
	  */
	this.desplegar = function(x,y,angle,ancho,campoAncho,campoAlto,userOrder,fase){
		if(estado != "Eliminada"){
			if(x<10){
				x=10;
			}
			
			if(x>campoAncho-40){
				x=campoAncho-40;
			}
			
			if(y<10){
				y=10;
			}
			
			if(y>campoAlto-40){
				y=campoAlto-40;
			}
			
			if(fase == 0){
				if(userOrder=="Desafiador"){
					if(y>campoAlto/4){
						y=campoAlto/4;
					}
				}
				else{
					if(y<campoAlto-campoAlto/4){
						y=campoAlto-campoAlto/4;
					}
				}
			}
			
			if(ancho > unidad.length){
				ancho = unidad.length;
			}
			
			if(unidad.length<5){
				ancho=unidad.length;
			}
			
			while(angle >= 360){
				angle-=360;
			}
			
			document.getElementById("latitud"+tropaId).innerHTML = x;
			document.getElementById("altitud"+tropaId).innerHTML = y;
			document.getElementById("orientacion"+tropaId).innerHTML = angle;
			document.getElementById("estado"+tropaId).innerHTML = "En juego";
			document.getElementById("unidadesfila"+tropaId).innerHTML = ancho;
			document.getElementById("tropaadoptivaid"+tropaId).innerHTML = "";
			actualizar();
			
			document.getElementById(panelOut).innerHTML = "Tropa "+nombre+" desplegada en "+latitud+"x "+altitud+"y.<br/>Orientacion: "+parseInt(orientacion * 180/Math.PI);
			console.log("Tropa "+nombre+" desplegada en "+latitud+"x "+altitud+"y.<br/>Orientacion: "+parseInt(orientacion * 180/Math.PI));
		}
	};
	
	
	/**
	  *  Método que arrastra una tropa sin alterar su orientacion
	  */
	this.arrastrar = function(x,y,campoAncho,campoAlto,userOrder){
		if(estado != "Eliminada"){
			if(x<10){
				x=10;
			}
			
			if(x>campoAncho-40){
				x=campoAncho-40;
			}
			
			if(y<10){
				y=10;
			}
			
			if(y>campoAlto-40){
				y=campoAlto-40;
			}
			
			if(fase == 0){
				if(userOrder=="Desafiador"){
					if(y>campoAlto/4){
						y=campoAlto/4;
					}
				}
				else{
					if(y<campoAlto-campoAlto/4){
						y=campoAlto-campoAlto/4;
					}
				}
			}

			document.getElementById("latitud"+tropaId).innerHTML = x;
			document.getElementById("altitud"+tropaId).innerHTML = y;
			document.getElementById("estado"+tropaId).innerHTML = "En juego";
			document.getElementById("tropaadoptivaid"+tropaId).innerHTML = "";
			actualizar();
			document.getElementById(panelOut).innerHTML = "Tropa "+nombre+" movida a "+latitud+"x "+altitud+"y. ";
		}
	};
	
	
	
	
	/**
	  *  Metodo para establecer una tropa en su posicion actual.
	  *  
	  *  @param situacion contexto canvas en que representamos.
	  *  @param zoom proporcion de las medidas del dibujo.
	  */
	this.posicionar = function(situacion,zoom){
		if(estado != "Eliminada" && estado != "Sin desplegar" && tropaAdoptivaId == ""){
						
			//Modificamos el contexto
			situacion.translate(latitud * zoom,altitud * zoom);
			situacion.rotate(orientacion);
			
			//Definimos filas y columnas iniciales
			var fila = 0;
			var columna = 0;
			
			
			//Establecemos el ancho de la columna y el alto de la fila
			var anchoColumna=maximoPeana();
			
			if(selected){
				situacion.strokeStyle="white";
			}
			else{
				situacion.strokeStyle="grey";
			}
			situacion.fillStyle = "grey";

			console.log("Ancho Columna "+anchoColumna);
			console.log("Alto Fila "+altoFila());
			console.log("Filas Incompletas "+this.getFilasIncompletas());
			console.log("Tropa de "+anchoColumna * unidadesFila * zoom+"x"+altoFila() * this.getFilasIncompletas() * zoom);
			
			situacion.fillRect(0,0,anchoColumna * unidadesFila * zoom,altoFila() * this.getFilasIncompletas() * zoom);
			
			//Establecemos un gradiente para indicar dirección de visión.
			var tamanioCono = 160;
			var grd = situacion.createLinearGradient(0, 0, 0, -tamanioCono*zoom);
			grd.addColorStop(0, "white");
			grd.addColorStop(0.1, "cyan");
			grd.addColorStop(1, "transparent");
			situacion.fillStyle = grd;
			
			//Dibujamos un trapecio con una altura de 80 puntos.
			situacion.beginPath(0,0);
			situacion.lineTo(-tamanioCono * zoom, -tamanioCono * zoom);
			situacion.lineTo((anchoColumna * unidadesFila + tamanioCono) * zoom, -tamanioCono * zoom);
			situacion.lineTo(anchoColumna * unidadesFila * zoom, 0);
			situacion.lineTo(0, 0);
			situacion.closePath();
			situacion.fill();
			
			//Disponemos las tropas una a una.
			for(var i=0;i<unidad.length;i++,columna++){
				if(i != 0){
					if(i%unidadesFila==0){
						fila++;
						columna=0;
					}
				}
				unidad[i].posicionar(columna * anchoColumna * zoom, altoFila() * fila * zoom, situacion, zoom, this.getUser());
			}
			
			//Reestablecemos el contexto
			situacion.rotate(orientacion * (-1));
			situacion.translate(latitud * zoom * (-1),altitud * zoom * (-1));

			console.log(nombre+" posicionada.");
		}
	};
	
	
	/**
	  *  Método para incorporarse a una tropa.
	  *  
	  *  @param id de la tropa a que se incorpora.
	  */
	this.incorporar = function(tropaPadre){
		document.getElementById("latitud"+tropaId).innerHTML = "--";
		document.getElementById("altitud"+tropaId).innerHTML = "--";
		document.getElementById("orientacion"+tropaId).innerHTML = "--";
		document.getElementById("estado"+tropaId).innerHTML = "En juego";
		document.getElementById("unidadesfila"+tropaId).innerHTML = "--";
		document.getElementById("tropaadoptivaid"+tropaId).innerHTML = tropaPadre;
		actualizar();
		console.log("Tropa "+nombre+" incorporada exitosamente. ");
	};
	
	
	/**
	  *  Método para incorporar unidades a la tropa.
	  *  
	  *  @param id de la tropa a incorporar.
	  */
	this.adoptar = function(tropaAdoptandoId){
		var noExiste=true;
		for(var i=0;i<tropaAdoptadaId.length;i++){
			if(tropaAdoptadaId[i]==tropaAdoptandoId){
				noExiste=false;
			};
		}
		if(noExiste){
			tropaAdoptadaId.push(tropaAdoptandoId);
			actualizar();
		}
	};
	
	
	/**
	  *  Método para sacar unidades de la tropa.
	  *  
	  *  @param id de la tropa a separar.
	  */
	this.sacar = function(tropaSacandoId){
		var aux = [];
		for(var i=0;i<tropaAdoptadaId.length;i++){
			if(tropaAdoptadaId[i]!=tropaSacandoId){
				aux.push(tropaAdoptadaId[i]);
			};
		}
		tropaAdoptadaId = aux;
		actualizar();
	};
	
	
	/**
	  *  Método para comprobar si dos unidades entran en colision.
	  *  
	  *  @param x coordenada X del punto en supuesta colision.
	  *  @param y coordenada y del punto en supuesta colision.
	  */
	this.colision = function(x,y){
		//Se deben dar ambas para que el punto este contenido en la unidad.
		var colisionVertical = false;
		var colisionHorizontal = false;
		
		//Angulo de la vanguardia y la retaguardia.
		var anguloHorizontal = parseInt(orientacion * 180/Math.PI);
		//Angulo de los flancos.
		var anguloVertical = parseInt(orientacion * 180/Math.PI)+90;
		
		//Posicion de un punto de las rectas 1 y 3.
		var xR = parseInt(latitud);
		var yR = parseInt(altitud);
		
		//Posicion de un punto de las rectas 2 y 4.
		var xS = Math.round(
				parseInt(latitud)+dimensiones().ancho * Math.cos(orientacion)-dimensiones().alto * Math.sin(orientacion)
			);
		var yS = Math.round(
				parseInt(altitud)+dimensiones().ancho * Math.sin(orientacion)+dimensiones().alto * Math.cos(orientacion)
			);
		
		
		/**
		  *  comprobamos que este por encima de la recta 1,
		  *  dada por el punto R y el angulo horizontal,
		  *  y por debajo de la recta 2,
		  *  dada por el punto S y el angulo horizontal.
		  */
		if(posicionPuntoRecta(x,y,xR,yR,anguloHorizontal) >= 0 && posicionPuntoRecta(x,y,xS,yS,anguloHorizontal) <= 0){
			colisionVertical=true;
		}
		/**
		  *  comprobamos que este por debajo de la recta 1 y por encima de la recta 2.
		  */
		if(posicionPuntoRecta(x,y,xR,yR,anguloHorizontal) <= 0 && posicionPuntoRecta(x,y,xS,yS,anguloHorizontal) >= 0){
			colisionVertical=true;
		}
		
		/**
		  *  comprobamos que este por encima de la recta 3,
		  *  dada por el punto R y el angulo vertical,
		  *  y por debajo de la recta 4,
		  *  dada por el punto S y el angulo vertical.
		  */
		if(posicionPuntoRecta(x,y,xR,yR,anguloVertical) >= 0 && posicionPuntoRecta(x,y,xS,yS,anguloVertical) <= 0){
			colisionHorizontal=true;
		}
		/**
		  *  Comprobamos que este por encima de la recta 3 y por debajo de la recta 4.
		  */
		if(posicionPuntoRecta(x,y,xR,yR,anguloVertical) <= 0 && posicionPuntoRecta(x,y,xS,yS,anguloVertical) >= 0){
			colisionHorizontal=true;
		}
		
		/**
		  *  Comprobamos que se dan ambas colisiones
		  */
		if(colisionVertical && colisionHorizontal) return true;
		else return false;
	};
	
	
	/**
	  *  Método para retirar una tropa del campo de batalla.
	  */
	this.retirar = function(){
		document.getElementById("latitud"+tropaId).innerHTML = "";
		document.getElementById("altitud"+tropaId).innerHTML = "";
		document.getElementById("orientacion"+tropaId).innerHTML = "";
		document.getElementById("estado"+tropaId).innerHTML = "Sin desplegar";
		document.getElementById("unidadesfila"+tropaId).innerHTML = "";
		document.getElementById("tropaadoptivaid"+tropaId).innerHTML = "";
		actualizar();
		console.log("Tropa "+nombre+" retirada del campo.")
		document.getElementById(panelOut).innerHTML = "Tropa "+nombre+" retirada del campo. ";
	};
	
	
	/**
	  *  Método para comprobar si un punto est� dentro del cono de vision de la tropa.
	  *  
	  *  @param x coordenada X del punto.
	  *  @param y coordenada Y del punto.
	  *  @see Funcioenes sacadas de los metodos getVanguardia...
	  */
	this.lineaVision = function(x,y){
		//Linea izquierda
		var angleIzq = parseInt(((orientacion * 180/Math.PI)+225)%360);
		var xIzq = latitud;
		var yIzq = altitud;
		
		//Linea derecha
		var angleDer = parseInt(((orientacion * 180/Math.PI)+315)%360);
		var xDer = parseInt(latitud+dimensiones().ancho * Math.cos(orientacion));
		var yDer = parseInt(altitud+dimensiones().ancho * Math.sin(orientacion));
		
		//Linea central
		var angleCen = parseInt(orientacion * 180/Math.PI);

		//Comprobaciones
		if((angleCen >= 0 && angleCen < 45) || (angleCen >= 315 && angleCen <= 360)){
			if(
				posicionPuntoRecta(x,y,xIzq,yIzq,angleIzq)  <=  0
				&& posicionPuntoRecta(x,y,xIzq,yIzq,angleCen)  <=  0 
				&& posicionPuntoRecta(x,y,xDer,yDer,angleDer)  <=  0
			){
				return true;
			}
		}
		
		if(angleCen >= 45 && angleCen < 90){
			if(
				posicionPuntoRecta(x,y,xIzq,yIzq,angleIzq)  >=  0
				&& posicionPuntoRecta(x,y,xIzq,yIzq,angleCen)  <=  0 
				&& posicionPuntoRecta(x,y,xDer,yDer,angleDer)  <=  0
			){
				return true;
			}
		}
		
		if(angleCen >= 90 && angleCen < 135){
			if(
				posicionPuntoRecta(x,y,xIzq,yIzq,angleIzq)  >=  0 
				&& posicionPuntoRecta(x,y,xIzq,yIzq,angleCen)  >=  0 
				&& posicionPuntoRecta(x,y,xDer,yDer,angleDer)  <=  0
			){
				return true;
			}
		}
		
		if(angleCen >= 135 && angleCen < 225){
			if(
				posicionPuntoRecta(x,y,xIzq,yIzq,angleIzq)  >=  0 
				&& posicionPuntoRecta(x,y,xIzq,yIzq,angleCen)  >=  0 
				&& posicionPuntoRecta(x,y,xDer,yDer,angleDer)  >=  0
			){
				return true;
			}
		}
		
		if(angleCen >= 225 && angleCen < 270){
			if(
				posicionPuntoRecta(x,y,xIzq,yIzq,angleIzq)  <=  0 
				&& posicionPuntoRecta(x,y,xIzq,yIzq,angleCen)  >=  0 
				&& posicionPuntoRecta(x,y,xDer,yDer,angleDer)  >=  0
			){
				return true;
			}
		}
		
		if(angleCen>270 && angleCen < 315){
			if(
				posicionPuntoRecta(x,y,xIzq,yIzq,angleIzq)  <=  0 
				&& posicionPuntoRecta(x,y,xIzq,yIzq,angleCen)  <=  0 
				&& posicionPuntoRecta(x,y,xDer,yDer,angleDer)  >=  0
			){
				return true;
			}
		}
		return false;
	};
	
	/**
	  *  Método que comprueba si la tropa bloquea una linea entre dos puntos.
	  *  
	  *  @param x1,y1 Coordenadas del punto de origen de visi�n.
	  *  @param x2,y2 Coordenadas del punto objetivo de visi�n.
	  *  @return Devolver� true en caso de que la tropa interccepte la linea de visi�n en alg�n punto y false en caso contrario.
	  */
	this.bloqueaLinea = function(x1,y1,x2,y2){
		//Si la tropa tiene tropa adoptiva, no se puede comparar con ella.
		if(tropaAdoptivaId != "") return false;
		
		//Evaluamos la orientacion de la linea de vision y comparamos con cada uno de los frentes en cada caso
		//Las funciones se corresponden con los get de vanguardia y retaguardia.
		else if(y1 == y2){
			if(
				(
					x1  <=  this.getVanguardiaSiniestra().x
					&& x1  >=  this.getVanguardiaDiestra().x
				)
				|| 
				(
					x1 >= this.getVanguardiaSiniestra().x
					&& x1 <= this.getVanguardiaDiestra().x
				)
			){
				//Vanguardia
				return true;
			}
			
			else if(
				(
					x1  <=  this.getVanguardiaSiniestra().x
					&& x1  >=  this.getRetaguardiaSiniestra().x
				)
				||
				(
					x1  >=  this.getVanguardiaSiniestra().x
					&& x1  <=  this.getRetaguardiaSiniestra().x
				)
			){
				//Siniestra
				return true;
			}
			
			else if(
				(
					x1 <= this.getVanguardiaDiestra().x
					&& x1 >= this.getRetaguardiaDiestra().x
				) 
				|| 
				(
					x1 >= this.getVanguardiaDiestra().x
					&& x1 <= this.getRetaguardiaDiestra().x
				)
			){
				//Diestra
				return true;
			}
			
			else if(
				(
					x1 <= this.getRetaguardiaSiniestra().x
					&& x1 >= this.getRetaguardiaDiestra().x
				)
				||
				(
					x1 >= this.getRetaguardiaSiniestra().x
					&& x1 <= this.getRetaguardiaDiestra().x
				)
			){
				//Retaguardia
				return true;
			}
		}
		
		else if(x1==x2){
			if(
				(
					y1  <=  this.getVanguardiaSiniestra().y
					&& y1  >=  this.getVanguardiaDiestra().y
				)
				|| 
				(
					y1 >= this.getVanguardiaSiniestra().y
					&& y1 <= this.getVanguardiaDiestra().y
				)
			){
				//Vanguardia
				return true;
			}
			
			else if(
				(
					y1  <=  this.getVanguardiaSiniestra().y
					&& y1  >=  this.getRetaguardiaSiniestra().y
				)
				||
				(
					y1  >=  this.getVanguardiaSiniestra().y
					&& y1  <=  this.getRetaguardiaSiniestra().y
				)
			){
				//Siniestra
				return true;
			}
			
			else if(
				(
					y1 <= this.getVanguardiaDiestra().y
					&& y1 >= this.getRetaguardiaDiestra().y
				) 
				|| 
				(
					y1 >= this.getVanguardiaDiestra().y
					&& y1 <= this.getRetaguardiaDiestra().y
				)
			){
				//Diestra
				return true;
			}
			
			else if(
				(
					y1 <= this.getRetaguardiaSiniestra().y
					&& y1 >= this.getRetaguardiaDiestra().y
				)
				||
				(
					y1 >= this.getRetaguardiaSiniestra().y
					&& y1 <= this.getRetaguardiaDiestra().y
				)
			){
				//Retaguardia
				return true;
			}
		}
		else{
			//Definimos las esquinas
			var xVS = this.getVanguardiaSiniestra().x;
			var yVS = this.getVanguardiaSiniestra().y;
			
			var xVD = this.getVanguardiaDiestra().x;
			var yVD = this.getVanguardiaDiestra().y;
			
			var xRS = this.getRetaguardiaSiniestra().x;
			var yRS = this.getRetaguardiaSiniestra().y;
			
			var xRD = this.getRetaguardiaDiestra().x;
			var yRD = this.getRetaguardiaDiestra().y;
			
			//Establecemos la ecuacion de la linea de visi�n.
			var mL = (y1-y2)/(x1-x2);//Cateto puesto partido de cateto contiguo
			var nL = y1 - x1 * mL;//Y = mX + n
			
			/**
			 * Si la tropa tiene rectas cuya pendiente puede ser infinita
			 * JS no lo interpreta correctamente debido a la precision de sus numeros
			 * debido a ello, definimos dos angulos y si alguno de ellos fuera 90 o 270
			 * procedemos a evaluar las coordenadas Y
			 * dado que las coordenadas X serian todas iguales.
			 */
			
			//En caso de que la horizontal sea paralela al eje Y
			if(
				orientacion * 180 / Math.PI == 90 
				||
				orientacion * 180 / Math.PI == 270
			){
				//Vanguardia
				//Comprobamos si la vanguardia se encuentra entre los puntos de mira
				if(
					(xVS < x1 && xVS > x2)
					||
					(xVS > x1 && xVS < x2)
				){
					var yLV = xVS * mL + nL;
					
					if(
						(yLV < yVS && yLV > yVD)
						||
						(yLV > yVS && yLV < yVD)
					){
						return true
					}
				}
				
				//Retaguardia
				//Comprobamos si la retaguardia se encuentra entre los puntos de mira
				if(
					(xRD < x1 && xRD > x2)
					||
					(xRD > x1 && xRD < x2)
				){
					var yLR = xRD * mL + nL;
					
					if(
						(yLR < yRS && yLR > yRD)
						||
						(yLR > yRS && yLR < yRD)
					){
						return true
					}
				}
			}
			
			//En caso contrario
			else {
				//Establecemos la pendiente horizontal
				var mHorizontal = Math.tan(orientacion);
				
				//Vanguardia
				var nV = yVS - xVS * mHorizontal;
				
				//Localizamos el punto de corte
				var xLV = (nL - nV)/(mHorizontal - mL);
				var yLV = xLV * mL + nL;
				
				//El punto de corte ha de encontrarse en la vanguardia y entre los puntos a comprobar
				if(
					(
						(xLV < xVS && xLV > xVD)
						||
						(xLV > xVS && xLV < xVD)
					)
					&&
					(
						(xLV < x1 && xLV > x2)
						||
						(xLV > x1 && xLV < x2)
					)
				){
					return true;
				}
				
				//Retaguardia
				var nR = yRD - xRD * mHorizontal;
				
				//Localizamos el punto de corte
				var xLR = (nL - nR) / (mHorizontal - mL);
				var yLR = xLR * mL + nL;
				
				//El punto de corte ha de encontrarse en la retaguardia y entre los puntos a comprobar
				if(
					(
						(xLR < xRS && xLR > xRD)
						||
						(xLR > xRS && xLR < xRD)
					)
					&&
					(
						(xLR < x1 && xLR > x2)
						||
						(xLR > x1 && xLR < x2)
					)
				){
					return true;
				}
			}
			
			
			//En caso de que la vertical sea paralela al eje y
			if(
				orientacion * 180 / Math.PI == 180 
				||
				orientacion * 180 / Math.PI == 0
			){
				//Siniestra
				//Comprobamos si la siniestra se encuentra entre los puntos de mira
				if(
					(xVS < x1 && xRS > x2)
					||
					(xVS > x1 && xRS < x2)
				){
					var yLS = xVS * mL + nL;
					
					if(
						(yLS < yVS && yLS > yVS)
						||
						(yLS > yVS && yLS < yVS)
					){
						return true
					}
				}
				
				//Diestra
				//Comprobamos si la diestra se encuentra entre los puntos de mira
				if(
					(xVD < x1 && xRD > x2)
					||
					(xVD > x1 && xRD < x2)
				){
					var yLD = xRD * mL + nL;
					
					if(
						(yLD < yVD && yLD > yRD)
						||
						(yLD > yVD && yLD < yRD)
					){
						return true
					}
				}
			}
			
			//En caso contrario
			else {
				//Establecemos la pendiente Vertical
				var mVertical = Math.tan(orientacion+Math.PI/2);
				
				//Siniestra
				var nS = yVS - xVS * mVertical;
				
				//Localizamos el punto de corte
				var xLS = (nL - nS) / (mVertical - mL);
				var yLS = xLS * mL + nL;
				
				if(
					(
						(xLS < xVS && xLS > xRS)
						||
						(xLS > xVS && xLS < xRS)
					)
					&&
					(
						(xLS < x1 && xLS > x2)
						||
						(xLS > x1 && xLS < x2)
					)
				){
					return true;
				}
				
				//Diestra
				var nD = yRD - xRD * mVertical;
				
				//Localizamos el punto de corte
				var xLD = (nL - nD)/(mVertical - mL);
				var yLD = xLD * mL + nL;
				
				if(
					(
						(xLD < xVD && xLD > xRD) 
						|| 
						(xLD > xVD && xLD < xRD)
					)
					&&
					(
						(xLD < x1 && xLD > x2)
						||
						(xLD > x1 && xLD < x2)
					)
				){
					return true;
				}
			}
		}
		return false;
	};
	
	/** 
	  *  Método que comprueba si una tropa est� a alcance de carga.
	  *  El alcance de carga es el doble del movimiento de la unidad mas lenta o el de la montura.
	  *  
	  *  Para comprobar cual es la distancia mas corta: 
	  *  Se comprueba si la tropa tiene vision directa con el frente objetivo.
	  *  De ser así, la distancia mas corta será la distancia entre la recta frente y la tropa.
	  *  En caso contrario se evaluaría la distancia con ambos puntos de dicho frente.
	  *  
	  *  
	  *  @param objetivo Tropa objetivo de la carga.
	  *  @param frente Frente de combate m�s pr�ximo.
	  *  @return Devuelve verdadero si la carga es viable.
	  */
	this.alcanceCarga = function(objetivo,frente){
		//Los puntos de vision son los dos vertices de la vanguardia de esta tropa.
		var xVI = latitud;
		var yVI = altitud;
		var xVD = parseInt(latitud+dimensiones().ancho * Math.cos(orientacion));
		var yVD = parseInt(altitud+dimensiones().ancho * Math.sin(orientacion));
		
		switch(frente){
			case 1://Cargar por el frente
				if(
					(
						visionDirecta(
							objetivo.getVanguardiaSiniestra().x
							,objetivo.getVanguardiaSiniestra().y
						)
						
						&&
						
						distanciaPuntoRecta(
							objetivo.getVanguardiaSiniestra().x
							,objetivo.getVanguardiaSiniestra().y
							,xVI
							,yVI
							,orientacion * 180/Math.PI
						)  <=  this.getMovimiento() * 2
					)

					||
					
					
					distanciaPuntoPunto(
						objetivo.getVanguardiaSiniestra().x
						,objetivo.getVanguardiaSiniestra().y
						,xVI
						,yVI
					)
					 <=  this.getMovimiento() * 2
					
					||
					
					distanciaPuntoPunto(
						objetivo.getVanguardiaSiniestra().x
						,objetivo.getVanguardiaSiniestra().y
						,xVD
						,yVD
					)
					 <=  this.getMovimiento() * 2
					

					||
					
					(
						visionDirecta(
							objetivo.getVanguardiaDiestra().x
							,objetivo.getVanguardiaDiniestra().y
						)
						
						&&
						
						distanciaPuntoRecta(
							objetivo.getVanguardiaDiestra().x
							,objetivo.getVanguardiaDiestra().y
							,xVI
							,yVI
							,orientacion * 180/Math.PI
						)
						 <=  this.getMovimiento() * 2
					)

					||
					
					
					distanciaPuntoPunto(
						objetivo.getVanguardiaDiestra().x
						,objetivo.getVanguardiaDiestra().y
						,xVI
						,yVI
					)
					 <=  this.getMovimiento() * 2
					
					||
					
					distanciaPuntoPunto(
						objetivo.getVanguardiaDiestra().x
						,objetivo.getVanguardiaDiestra().y
						,xVD
						,yVD
					)
					 <=  this.getMovimiento() * 2
				){
					return true;
				}
				
			break;
			
			case 2://Cargar por el flanco izquierdo
				if(
					(
						visionDirecta(
							objetivo.getVanguardiaSiniestra().x
							,objetivo.getVanguardiaSiniestra().y
						)
						
						&&
						
						distanciaPuntoRecta(
							objetivo.getVanguardiaSiniestra().x
							,objetivo.getVanguardiaSiniestra().y
							,xVI
							,yVI
							,orientacion * 180/Math.PI
						)
						 <=  this.getMovimiento() * 2
					)

					||
						
					distanciaPuntoPunto(
						objetivo.getVanguardiaSiniestra().x
						,objetivo.getVanguardiaSiniestra().y,xVI,yVI
					)
					 <=  this.getMovimiento() * 2
					
					||
					
					distanciaPuntoPunto(
						objetivo.getVanguardiaSiniestra().x
						,objetivo.getVanguardiaSiniestra().y
						,xVD
						,yVD
					)
					 <=  this.getMovimiento() * 2
					
					||
					
					(
						visionDirecta(
							objetivo.getRetaguardiaSiniestra().x
							,objetivo.getRetaguardiaSiniestra().y
						)
						
						&&
						
						distanciaPuntoRecta(
							objetivo.getRetaguardiaSiniestra().x
							,objetivo.getRetaguardiaSiniestra().y
							,xVI
							,yVI
							,orientacion * 180/Math.PI
						)
						 <=  this.getMovimiento() * 2
					)

					||
					
					distanciaPuntoPunto(
						objetivo.getRetaguardiaSiniestra().x
						,objetivo.getRetaguardiaSiniestra().y
						,xVI
						,yVI
					)
					 <=  this.getMovimiento() * 2
					
					||
					
					distanciaPuntoPunto(
						objetivo.getRetaguardiaSiniestra().x
						,objetivo.getRetaguardiaSiniestra().y
						,xVD
						,yVD
					)
					 <=  this.getMovimiento() * 2
				){
					return true;
				}
				
			break;
			
			case 3://Cargar por el flanco derecho
				if(
					(
						visionDirecta(
							objetivo.getVanguardiaDiestra().x
							,objetivo.getVanguardiaDiestra().y
						)
						
						&&
						
						distanciaPuntoRecta(
							objetivo.getVanguardiaDiestra().x
							,objetivo.getVanguardiaDiestra().y
							,xVI
							,yVI
							,orientacion * 180/Math.PI
						)  <=  this.getMovimiento() * 2
					)

					||
					
					distanciaPuntoPunto(
						objetivo.getVanguardiaDiestra().x
						,objetivo.getVanguardiaDiestra().y
						,xVI
						,yVI
					)
					 <=  this.getMovimiento() * 2
					
					||
					
					distanciaPuntoPunto(
						objetivo.getVanguardiaDiestra().x
						,objetivo.getVanguardiaDiestra().y
						,xVD
						,yVD
					)
					 <=  this.getMovimiento() * 2

					||
					
					(
						visionDirecta(
							objetivo.getRetaguardiaDiestra().x
							,objetivo.getRetaguardiaDiestra().y
						)
						
						&&
						
						distanciaPuntoRecta(
							objetivo.getRetaguardiaDiestra().x
							,objetivo.getRetaguardiaDiestra().y
							,xVI
							,yVI
							,orientacion * 180/Math.PI
						)
						 <=  this.getMovimiento() * 2
					)

					||
					
					distanciaPuntoPunto(
						objetivo.getRetaguardiaDiestra().x
						,objetivo.getRetaguardiaDiestra().y
						,xVI
						,yVI
					)
					 <= this.getMovimiento() * 2
					
					||
					
					distanciaPuntoPunto(
						objetivo.getRetaguardiaDiestra().x
						,objetivo.getRetaguardiaDiestra().y
						,xVD
						,yVD
					)
					 <= this.getMovimiento() * 2
				){
					return true;
				}
				
			break;
			
			case 4://Cargar por retaguardia
				if(
					(
						visionDirecta(
							objetivo.getRetaguardiaSiniestra().x
							,objetivo.getRetaguardiaSiniestra().y
						)
						
						&&
						
						distanciaPuntoRecta(
							objetivo.getRetaguardiaSiniestra().x
							,objetivo.getRetaguardiaSiniestra().y
							,xVI
							,yVI
							,orientacion * 180/Math.PI
						)
						 <=  this.getMovimiento() * 2
					)

					||
					
					distanciaPuntoPunto(
						objetivo.getRetaguardiaSiniestra().x
						,objetivo.getRetaguardiaSiniestra().y
						,xVI
						,yVI
					)
					 <=  this.getMovimiento() * 2
					
					||
					
					distanciaPuntoPunto(
						objetivo.getRetaguardiaSiniestra().x
						,objetivo.getRetaguardiaSiniestra().y
						,xVD
						,yVD
					)
					 <=  this.getMovimiento() * 2

					||
					
					(
						visionDirecta(
							objetivo.getRetaguardiaDiestra().x
							,objetivo.getRetaguardiaDiniestra().y
						)
						
						&&
					
						distanciaPuntoRecta(
							objetivo.getRetaguardiaDiestra().x
							,objetivo.getRetaguardiaDiestra().y
							,xVI
							,yVI
							,orientacion * 180/Math.PI
						)
						 <=  this.getMovimiento() * 2
					)

					||
					
					distanciaPuntoPunto(
						objetivo.getRetaguardiaDiestra().x
						,objetivo.getRetaguardiaDiestra().y
						,xVI
						,yVI
					)
					 <=  this.getMovimiento() * 2
					
					||
					
					distanciaPuntoPunto(
						objetivo.getRetaguardiaDiestra().x
						,objetivo.getRetaguardiaDiestra().y
						,xVD
						,yVD
					)
					 <=  this.getMovimiento() * 2
				){
					return true;
				}
				
			break;
		}
		return false;
	};
	
	
	/**
	  *  Método que devuelve la distancia entre la tropa y un punto.
	  *  
	  *  @param punto objeto con atributos "x" e "y".
	  *  @return Devuelve la menor distancia entre el frente de la tropa y el punto.
	  */
	this.distanciaFrentePunto = function(punto){
		var xVI = latitud;
		var yVI = altitud;
		var xVD = parseInt(latitud+dimensiones().ancho * Math.cos(orientacion));
		var yVD = parseInt(altitud+dimensiones().ancho * Math.sin(orientacion));
		if(visionDirecta(punto.x,punto.y)){
			distanciaPuntoRecta(punto.x,punto.y,xVI,yVI,orientacion * 180/Math.PI);
		}
		else{
			if(
				distanciaPuntoPunto(punto.x,punto.y,xVI,yVI) 
				< distanciaPuntoPunto(punto.x,punto.y,xVD,yVD)
			){
				return distanciaPuntoPunto(punto.x,punto.y,xVI,yVI);
			}
			
			else{
				return distanciaPuntoPunto(punto.x,punto.y,xVD,yVD);
			}
		}
	};
	
	
	/**
	  *  Método que establece los eventos cuando esta tropa carga a otra.
	  *  
	  *  @param objetivo tropa que recibe la carga
	  *  @param frente frente por el enemigo que recibe la carga.
	  */
	this.cargar = function(objetivo,frente){
		document.getElementById("estado"+tropaId).innerHTML = "Cargando";
		document.getElementById("estado"+objetivo.getId()).innerHTML = "Bajo carga";
		document.getElementById("tropabajoataqueid"+tropaId).innerHTML = objetivo.getId();
		
		//Indicamos la carga
		document.getElementById(panelOut).innerHTML = "La tropa "+nombre+" carga contra "+objetivo.getNombre();
		
		switch(frente){
			case 1: 
				//Indicamos por donde se realiza
				document.getElementById(panelOut).innerHTML += " de frente. ";

				//Posicionamos la tropa
				document.getElementById("latitud"+tropaId).innerHTML = objetivo.getVanguardiaDiestra().x;
				document.getElementById("altitud"+tropaId).innerHTML = objetivo.getVanguardiaDiestra().y;
				document.getElementById("orientacion"+tropaId).innerHTML = ""+(parseInt(180)+objetivo.getOrientacion());
				
				//Actualizamos los datos
				document.getElementById("tropabajoataqueflanco"+tropaId).innerHTML = "Vanguardia";
			break;
			
			case 2: 
				//Indicamos por donde se realiza
				document.getElementById(panelOut).innerHTML += " por el flanco izquierdo. ";

				//Posicionamos la tropa
				document.getElementById("latitud"+tropaId).innerHTML = objetivo.getVanguardiaSiniestra().x;
				document.getElementById("altitud"+tropaId).innerHTML = objetivo.getVanguardiaSiniestra().y;
				document.getElementById("orientacion"+tropaId).innerHTML = ""+(parseInt(90)+objetivo.getOrientacion());
				
				//Actualizamos los datos
				document.getElementById("tropabajoataqueflanco"+tropaId).innerHTML = "Siniestra";
			break;
			
			case 3: 
				//Indicamos por donde se realiza
				document.getElementById(panelOut).innerHTML += " por el flanco derecho. ";

				//Posicionamos la tropa
				document.getElementById("latitud"+tropaId).innerHTML = objetivo.getRetaguardiaDiestra().x;
				document.getElementById("altitud"+tropaId).innerHTML = objetivo.getRetaguardiaDiestra().y;
				document.getElementById("orientacion"+tropaId).innerHTML = ""+(parseInt(270)+objetivo.getOrientacion());
				
				//Actualizamos los datos
				document.getElementById("tropabajoataqueflanco"+tropaId).innerHTML = "Diestra";
			break;
			
			case 4: 
				//Indicamos por donde se realiza
				document.getElementById(panelOut).innerHTML += " por la retaguardia. ";

				//Posicionamos la tropa
				document.getElementById("latitud"+tropaId).innerHTML = objetivo.getRetaguardiaSiniestra().x;
				document.getElementById("altitud"+tropaId).innerHTML = objetivo.getRetaguardiaSiniestra().y;
				document.getElementById("orientacion"+tropaId).innerHTML = ""+objetivo.getOrientacion();
				
				//Actualizamos los datos
				document.getElementById("tropabajoataqueflanco"+tropaId).innerHTML = "Retaguardia";
			break;
		}
		actualizar();
	};
	
	
	/**
	  *  Método que actualiza una tropa cuando falla una carga.
	  */
	this.cargaFallida = function(){
		document.getElementById("estado"+tropaId).innerHTML = "Desplazada";
		document.getElementById(panelOut).innerHTML = "Carga fallida.";
		actualizar();
	};
	
	
	/**
	  *  Método que actualiza una tropa cuando entra en combate.
	  */
	this.entrarEnCombate = function(){
		document.getElementById("estado"+tropaId).innerHTML = "En combate";
		actualizar();
	};

	
	
	/**
	  *  
	  */
	this.mover = function(distancia, direccion, campoAncho, campoAlto, movimiento){
		if(estado != "En campo"){
			direccion = (direccion) * Math.PI/180;
			var x = parseInt( 
					latitud + (
						distancia  *  (
							Math.sin( 
								(orientacion + direccion)
							)
						)  *  20 
					)
				);
			
			var y = parseInt(
					altitud - (
						distancia  *  (
							Math.cos(
								(orientacion + direccion)
							)
						) 
					)  *  20 
				);
			
			
			if(x < 10){
				x = 10;
			}
			
			if(x > campoAncho-40){
				x = campoAncho-40;
			}
			
			if(y < 10){
				y = 10;
			}
			
			if(y>campoAlto-40){
				y=campoAlto-40;
			}
			
			movida = movimiento;
			document.getElementById("latitud"+tropaId).innerHTML = x;
			document.getElementById("altitud"+tropaId).innerHTML = y;
			actualizar();
			document.getElementById(panelOut).innerHTML = "Tropa "+nombre+" mueve a "+latitud+"x "+altitud+"y.";
		}
	};
	
	
	/**
	  *  
	  */
	this.reorientar = function(incremento, campoAncho, campoAlto, movimiento){
		if(estado != "En campo"){
			var angle = orientacion + incremento  *  Math.PI/180;
			
			var ejeX = this.getCentro().x;
			var ejeY = this.getCentro().y;
			
			//X = Ox - (cos(angulo) * ancho-sen(angulo) * alto)/2
			//Y = Oy - (sen(angulo) * ancho+cos(angulo) * alto)/2
			var x = parseInt(ejeX - (dimensiones().ancho * Math.cos(angle)-dimensiones().alto * Math.sin(angle))/2);
			var y = parseInt(ejeY - (dimensiones().ancho * Math.sin(angle)+dimensiones().alto * Math.cos(angle))/2);
			
			if(x < 10){
				x = 10;
			}
			
			if(x > campoAncho-40){
				x = campoAncho-40;
			}
			
			if(y < 10){
				y = 10;
			}
			
			if(y>campoAlto-40){
				y=campoAlto-40;
			}
			
			angle = angle * 180/Math.PI;
			
			while(angle >= 360){
				angle-=360;
			}
			
			movida = movimiento;
			document.getElementById("latitud"+tropaId).innerHTML = x;
			document.getElementById("altitud"+tropaId).innerHTML = y;
			document.getElementById("orientacion"+tropaId).innerHTML = angle;
			actualizar();
			document.getElementById(panelOut).innerHTML = "Tropa "+nombre+" girada "+incremento+" grados.";
		}
	};
};