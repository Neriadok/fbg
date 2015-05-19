/**
 * Clase que nos genera unidades en el juego.
 *
 * Una unidad es un individuo, un soldado, animal, maquina o monstruo
 * que forma parte de la batalla.
 * 
 * @author Daniel Mart�n D�az
 * @version 1.1 (23/07/2014)
 */
function Componente(fichaReferencia, tipo){
	/*VARIABLES*/
	//Car�cter�sticas
	var rango = parseInt(document.getElementById("rango"+fichaReferencia).innerHTML);
	var representada = document.getElementById("representada"+fichaReferencia).innerHTML;
	var peana = 40;
	
	//Atributos
	var m = document.getElementById("movimiento"+fichaReferencia).innerHTML;
	var ha = document.getElementById("ha"+fichaReferencia).innerHTML;
	var hp = document.getElementById("hp"+fichaReferencia).innerHTML;
	var f = document.getElementById("f"+fichaReferencia).innerHTML;
	var r = document.getElementById("r"+fichaReferencia).innerHTML;
	var ps = document.getElementById("ps"+fichaReferencia).innerHTML;
	var i = document.getElementById("i"+fichaReferencia).innerHTML;
	var a = document.getElementById("a"+fichaReferencia).innerHTML;
	var l = document.getElementById("l"+fichaReferencia).innerHTML;
	
	if(rango >= 6 || tipo == "Montura-Tiro" || tipo == "Maquinaria-Carro"){
		peana = 45;
	}
	
	
	
	/*GETTERS*/
	/**
	 * Método getter para el atributo peana.
	 * 
	 * @return Devuelve un integer.
	 */
	this.getPeana = function(){
		return peana;
	};
	
	/**
	 * Método getter para el atributo rango.
	 * 
	 * @return Devuelve un integer.
	 */
	this.getRango = function(){
		return rango;
	};
	
	/**
	 * Método getter para el atributo tipo.
	 * 
	 * @return Devuelve un String.
	 */
	this.getTipo = function(){
		return tipo;
	};
	
	/**
	 * Método getter para el atributo representada.
	 * 
	 * @return Devuelve un boolean.
	 */
	this.getRepresentada = function(){
		if(representada == "si") return true;
		else return false;
	};
	
	/**
	 * Método getter para el atributo movimiento.
	 * Si el movimiento es 0 le damos como valor "Number.MAX_VALUE",
	 * esto no es por que la unidad tenga movimiento infinito,
	 * sino para que este movimiento no se tenga en cuenta
	 * a la hora de calcular el menor movimiento.
	 * 
	 * Una tropa moverá tan rapido como el más lento de sus integrantes.
	 * 
	 * @return Devuelve un integer.
	 */
	this.getMovimiento = function(){
		var movimiento;
		if(m == 0){
			movimiento = Number.MAX_VALUE;
		}
		else{
			movimiento = m*20;
		}
		return movimiento;
	};
	
	/*M�TODOS INTERNOS*/
	
		
	
	/*METODOS DE INTERACTUACION*/
};