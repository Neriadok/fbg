/**
 * Clase que nos genera unidades en el juego.
 *
 * Una unidad es un individuo, un soldado, animal, maquina o monstruo
 * que forma parte de la batalla.
 * 
 * @author Daniel Mart�n D�az
 * @version 1.1 (23/07/2014)
 */
function Unidad(tropaId, classNameFichas, selected, indice, subirRango){
	/*VARIABLES*/
	//Car�cter�sticas
	var fichasComponentes = document.getElementsByClassName(classNameFichas);
	var componente = [];
	var larga = false;
	
	iniciarComponentes();
	
	/*GETTERS*/
	/**
	 * 
	 */
	this.getPeana = function(){
		var peana = 0;
		for(var i=0; i<componente.length; i++){
			if(componente[i].getRepresentada()){
				peana += componente[i].getPeana();
				if(componente[i].getTipo() == "Montura-Tiro"){
					larga = true;
				}
			}
		}
		return {peana: parseInt(peana), larga: larga};
	};
	
	/**
	 * 
	 */
	this.getRango = function(){
		var rango = 0;
		for(var i=0; i<componente.length; i++){
			if(componente[i].getRango() > rango){
				rango = componente[i].getRango();
			}
		}
		return parseInt(rango)+subirRango;
	};
	
	/**
	 * 
	 */
	this.getMovimiento = function(){
		/**
		 * En caso de haber montura o bestia de tiro, siempre se toma el movimiento de esta.
		 * En caso contrario se toma el menor de todos.
		 */
		var hayMontura = false;
		var movimiento = Number.MAX_VALUE;
		
		for(var i=0; i<componente.length && !hayMontura; i++){
			if(componente[i].getTipo() == "Montura-Tiro"){
				hayMontura = true;
				movimiento = componente[i].getMovimiento();
			}
			else{
				if(componente[i].getMovimiento().movimiento < movimiento){
					movimiento = componente[i].getMovimiento();
				}
			}
		}
		
		return movimiento;
	};
	
	/*M�TODOS INTERNOS*/
	function iniciarComponentes(){
		for(var i=0 ; i<fichasComponentes.length ; i++){
			componente[i] = new Componente("componente"+fichasComponentes[i].innerHTML+tropaId, fichasComponentes[i].innerHTML);
		}
	}
		
	
	/*METODOS DE INTERACTUACION*/
	/**
	 * 
	 */
	this.posicionar = function(x,y,tipo,situacion,zoom,user){
		
		if(user){
			situacion.fillStyle = "#E8E65F";
		}
		else{
			situacion.fillStyle = "#C1D0E3";
		}
		
		if(larga){
			situacion.fillRect(x, y, this.getPeana().peana*zoom, this.getPeana().peana*zoom*2);
			situacion.strokeRect(x, y, this.getPeana().peana*zoom, this.getPeana().peana*zoom*2);
		}
		
		else{
			situacion.fillRect(x, y, this.getPeana().peana*zoom, this.getPeana().peana*zoom);
			situacion.strokeRect(x, y, this.getPeana().peana*zoom, this.getPeana().peana*zoom);
		}
	}
};