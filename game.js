var game = {
  energy: 0,
  totalEnergy: 0,
  clickPower: 1,
  clickStat: 0,
  u1: false,
  proton: 0,
  protonPower: 0,
  protonSpeed: 1000,
  protonInterval: false,
  protonInitCost: 20,
  protonCostMult: 4/3,
  protonCost: 20,
  protonCost10: 20 * (1 - Math.pow(4/3, 10)) / (1 - 4/3),
  protonCost100: 20 * (1 - Math.pow(4/3, 100)) / (1 - 4/3),
  electron: 0,
  electronPower: 0,
  electronInitCost: 50,
  electronCostMult: 1.33,
  electronCost: 50,
  electronCost10: 50 * (1 - Math.pow(1.33, 10)) / (1 - 1.33),
  electronCost100: 50 * (1 - Math.pow(1.33, 100)) / (1 - 1.33),
  neutrino: 0,
  neutrinoPower: 0,
  neutrinoInitCost: 100000,
  neutrinoCostMult: 2,
  neutrinoCost: 100000,
  neutrinoCost10: 100000 * (1 - Math.pow(2, 10)) / (1 - 2),
  neutrinoCost100: 100000 * (1 - Math.pow(2, 100)) / (1 - 2),
  H: 0,
  deu: 0,
  tritium: 0,
  Hpower: 1,
  mass: 0,
  unlockStage: 0,
  sigFigs: 4,
  lastTick: Date.now()
};
const rand = new Uint32Array(8);




function format(amount, maxPrecision) {
  let power = Math.floor(Math.log10(amount));
  if (power < 6) {
    if(maxPrecision == 0) {return Math.round(amount);}
    else return Math.round(amount * Math.pow(10, maxPrecision)) / Math.pow(10, maxPrecision);
  }
	else {
    let mantissa = amount / Math.pow(10, power);
    return mantissa.toFixed(game.sigFigs-1) + "e" + power; 
  }
}

function changeSigFigs(amount) {
  if(((game.sigFigs + amount) < 8) && ((game.sigFigs + amount) > 0)) {
    game.sigFigs += amount;
    document.getElementById("sigFigD").innerHTML = game.sigFigs;
    updateEverything();
  }
}


function logBase(base, input) {
	return Math.log(input) / Math.log(base);
}

function logBuy(type, initalCost, costMult) {
	var quo = game.energy / initalCost;
	var geoConst = 1 - (1 / costMult);
	quo = Math.floor(logBase(costMult, quo * geoConst));
	
	if(quo > 0) {
	    var newCost = initalCost * Math.pow(costMult, quo);
    
	    switch(type) {
        case -1: 
          game.proton += quo;
			    game.protonCost = newCost;
			    document.getElementById('protonD').innerHTML = format(game.proton);
			    document.getElementById('protonC').innerHTML = format(Math.round(newCost));
          game.protonCost10 = game.protonCost * (1 - Math.pow(game.protonCostMult, 10)) / (1 - game.protonCostMult);
          game.protonCost100 = game.protonCost * (1 - Math.pow(game.protonCostMult, 100)) / (1 - game.protonCostMult);
			    break;
        case -3: 
          game.electron += quo;
			    game.electronCost = newCost;
			    document.getElementById('electronD').innerHTML = format(game.electron);
			    document.getElementById('electronC').innerHTML = format(Math.round(newCost));
          game.electronCost10 = game.electronCost * (1 - Math.pow(game.electronCostMult, 10)) / (1 - game.electronCostMult);
          game.electronCost100 = game.electronCost * (1 - Math.pow(game.electronCostMult, 100)) / (1 - game.electronCostMult);
			    break;
      }
  }
}

function Crandom(chance, recursionLevel) {
  if(chance > 1e-7) {
    if(rand[0] < 4294967296 * chance) {
      window.crypto.getRandomValues(rand);
      return true;
    }
    else {
      window.crypto.getRandomValues(rand);
      return false;
    }
  }
  else if(rand[recursionLevel] > 4294967296 * 1e-7 || recursionLevel > 7) {
    window.crypto.getRandomValues(rand);
      return false;
  }
  else return Crandom(chance * 1e7, recursionLevel++);
  /* how to use this to generate a random number from 0 to 65536:
    window.crypto.getRandomValues(rand);
  document.getElementById("test").innerHTML = Math.floor(rand[0] / 65536); */
}



function slowDecay(num, halfLife) {
  
}

function mediumDecay(num, halfLife) {
  
}

function fastDecay(num, halfLife) {
  
}

          
          

function tap(a)
{
  game.energy += a;
  game.totalEnergy += a;
  document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
}

function makeProton()
{
  if(game.energy >= Math.ceil(game.protonCost)) 
  {
    game.energy -= Math.ceil(game.protonCost);
    game.proton++;
    updateProtonPower();
    game.protonCost *= game.protonCostMult;
    game.protonCost10 *= game.protonCostMult;
    game.protonCost100 *= game.protonCostMult;
    document.getElementById("protonC").innerHTML = format(game.protonCost, 0);
    document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
    document.getElementById("protonD").innerHTML = game.proton;
    document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * 1000 / game.protonSpeed, 2);
  }
}

function makeMaxProtons()
{
  if(game.energy / (1e9 * (game.protonCostMult - 1)) > game.protonCost) {
    logBuy(-1, game.protonCost, game.protonCostMult);
  }
    else {
  let count = 0;
  while(game.energy > game.protonCost) {
    if(game.energy > game.protonCost100) {
      game.energy -= game.protonCost100;
      let a = Math.pow(game.protonCostMult, 100);
      game.protonCost *= a;
      game.protonCost10 *= a;
      game.protonCost100 *= a;
      count += 100;
    }
    else if(game.energy > game.protonCost10) {
      game.energy -= game.protonCost10;
      let b = Math.pow(game.protonCostMult, 10);
      game.protonCost *= b;
      game.protonCost10 *= b;
      count += 10;
    }
    else {
      game.energy -= game.protonCost;
      game.protonCost *= game.protonCostMult;
      count++;
    }
  }
  game.proton += count;
  updateProtonPower();
  game.protonCost10 = game.protonCost * (1 - Math.pow(game.protonCostMult, 10)) / (1 - game.protonCostMult);
  game.protonCost100 = game.protonCost * (1 - Math.pow(game.protonCostMult, 100)) / (1 - game.protonCostMult);
  document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
  document.getElementById("protonD").innerHTML = game.proton;
  document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * 1000 / game.protonSpeed, 2);
  document.getElementById("protonC").innerHTML = format(game.protonCost, 0);
    }
}

function updateProtonSpeed() {
  clearInterval(game.protonInterval);
  game.protonInterval = setInterval(function()
            {
  tap(game.protonPower * game.Hpower);
}, game.protonSpeed); }

function updateProtonPower() {
  game.protonPower = game.proton * (1+game.neutrinoPower);
}

function updateElectronPower() {
  game.electronPower = game.electron * (1+game.neutrinoPower);
  game.clickPower = 1 + game.neutrinoPower + game.electronPower;
}

function updatePePower() {
  updateProtonPower();
  updateElectronPower();
}


function makeElectron()
{
  if(game.energy >= Math.ceil(game.electronCost))
  {
    game.energy -= Math.ceil(game.electronCost);
    game.electron++;
    updateElectronPower();
    game.electronCost *= game.electronCostMult;
    game.electronCost10 *= game.electronCostMult;
    game.electronCost100 *= game.electronCostMult;
    document.getElementById("electronC").innerHTML = format(game.electronCost, 0);
    document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
    document.getElementById("electronD").innerHTML = game.electron;
    document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower, 2);
    document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower, 2);
  }
}

function makeMaxElectrons()
{
  if(game.energy / (1e9 * (game.electronCostMult - 1)) > game.electronCost) {
    logBuy(-3, game.electronCost, game.electronCostMult);
  }
    else {
  let count = 0;
  while(game.energy > game.electronCost) {
    if(game.energy > game.electronCost100) {
      game.energy -= game.electronCost100;
      let a = Math.pow(game.electronCostMult, 100);
      game.electronCost *= a;
      game.electronCost10 *= a;
      game.electronCost100 *= a;
      count += 100;
    }
    else if(game.energy > game.electronCost10) {
      game.energy -= game.electronCost10;
      let b = Math.pow(game.electronCostMult, 10);
      game.electronCost *= b;
      game.electronCost10 *= b;
      count += 10;
    }
    else {
      game.energy -= game.electronCost;
      game.electronCost *= game.electronCostMult;
      count++;
    }
  }
  game.electron += count;
  updateElectronPower();
  game.electronCost10 = game.electronCost * (1 - Math.pow(game.electronCostMult, 10)) / (1 - game.electronCostMult);
  game.electronCost100 = game.electronCost * (1 - Math.pow(game.electronCostMult, 100)) / (1 - game.electronCostMult);
  document.getElementById("electronC").innerHTML = format(game.electronCost, 0);
  document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
  document.getElementById("electronD").innerHTML = game.electron;
  document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower, 2);
  document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower, 2);
  }
}


function makeNeutrino()
{
  if(game.energy >= Math.ceil(game.neutrinoCost))
  {
    game.energy -= Math.ceil(game.neutrinoCost);
    game.neutrino++;
    game.neutrinoPower = game.neutrino;
    updatePePower();
    game.neutrinoCost *= game.neutrinoCostMult;
    game.neutrinoCost10 *= game.neutrinoCostMult;
    game.neutrinoCost100 *= game.neutrinoCostMult;
    game.clickPower = 1 + game.electronPower + game.neutrinoPower;
    document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
    document.getElementById("neutrinoC").innerHTML = format(game.neutrinoCost, 0);
    document.getElementById("neutrinoD").innerHTML = game.neutrino;
    document.getElementById("neutrinoP").innerHTML = Math.round(1 + game.neutrino);
    document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower, 2);
    document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower, 2);
    document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * 1000 / game.protonSpeed, 2);
  }
}

function makeMaxNeutrinos()
{
  if(game.energy / (1e9 * (game.electronCostMult - 1)) > game.electronCost) {
    logBuy(-4, game.neutrinoCost, game.neutrinoCostMult);
  }
    else {
  let count = 0;
  while(game.energy > game.neutrinoCost) {
    if(game.energy > game.neutrinoCost100) {
      game.energy -= game.neutrinoCost100;
      let a = Math.pow(game.neutrinoCostMult, 100);
      game.neutrinoCost *= a;
      game.neutrinoCost10 *= a;
      game.neutrinoCost100 *= a;
      count += 100;
    }
    else if(game.energy > game.neutrinoCost10) {
      game.energy -= game.neutrinoCost10;
      let b = Math.pow(game.neutrinoCostMult, 10);
      game.neutrinoCost *= b;
      game.neutrinoCost10 *= b;
      count += 10;
    }
    else {
      game.energy -= game.neutrinoCost;
      game.neutrinoCost *= game.neutrinoCostMult;
      count++;
    }
  }
  game.neutrino += count;
  game.neutrinoPower = game.neutrino;
  updatePePower();
  game.neutrinoCost10 = game.neutrinoCost * (1 - Math.pow(game.neutrinoCostMult, 10)) / (1 - game.neutrinoCostMult);
  game.neutrinoCost100 = game.neutrinoCost * (1 - Math.pow(game.neutrinoCostMult, 100)) / (1 - game.neutrinoCostMult);
  document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
  document.getElementById("neutrinoC").innerHTML = format(game.neutrinoCost, 0);
  document.getElementById("neutrinoD").innerHTML = game.neutrino;
  document.getElementById("neutrinoP").innerHTML = Math.round(1 + game.neutrino);
  document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower, 2);
  document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower, 2);
  document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * 1000 / game.protonSpeed, 2);
  }
}






function u1b()
{
  if(game.H >= 100 && !game.u1)
    {
      game.u1 = true;
      game.H -= 100;
      game.protonSpeed /= 2;
      game.Hpower = Math.sqrt(game.H + 1) * Math.sqrt(game.deu + 1);
      document.getElementById("HpD").innerHTML = game.H;
      document.getElementById("u1p").innerHTML = game.u1;
      document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower, 2);
      document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * 1000 / game.protonSpeed, 2);      
      document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower, 2);
      updateProtonSpeed();
    }
}

function w2b() {
  if(game.energy >= 10000 && game.unlockStage == 1) {
    game.unlockStage++;
    game.energy -= 10000;
    document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
    hideAndShow();
  }
}

function w3b() {
  if(game.H >= 10 && game.unlockStage == 2) {
    game.unlockStage++;
    game.H -= 10;
    game.Hpower = Math.sqrt(game.H + 1) * Math.sqrt(game.deu + 1);
    document.getElementById("HpD").innerHTML = game.H;
    document.getElementById("w3p").innerHTML = game.unlockStage > 2;
    document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower, 2);
    document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * 1000 / game.protonSpeed, 2);
    document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower, 2);
    hideAndShow();
  }
}



function p1() //not the McLaren P1, this is a :ripaarex:
{
  game.H += Math.min(game.proton, game.electron);
  game.Hpower = Math.sqrt(game.H + 1) * Math.sqrt(game.deu + 1);
  game.energy = 0;
  game.clickPower = 1;
  game.proton = 0;
  game.electron = 0;
  game.electronPower = 0;
  game.protonPower = 0;
  game.protonCost = 20;
  game.electronCost = 50;
  game.neutrino = 0;
  game.neutrinoPower = 0;
  game.neutrinoCost = 100000;
  document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
  document.getElementById("protonD").innerHTML = game.proton;
  document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * 1000 / game.protonSpeed, 2);
  document.getElementById("protonC").innerHTML = format(game.protonCost, 0);
  document.getElementById("electronD").innerHTML = game.electron;
  document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower, 2);
  document.getElementById("electronC").innerHTML = format(game.electronCost, 0);
  document.getElementById("neutrinoC").innerHTML = format(game.neutrinoCost, 0);
  document.getElementById("neutrinoD").innerHTML = game.neutrino;
  document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower, 2);
  document.getElementById("HpD").innerHTML = game.H;
  document.getElementById("HpP").innerHTML = Math.round(100 * game.Hpower - 100);
 
}





setInterval(function()
           {
  //slowDecay();
}, 33.333333333333)



setInterval(function()
           {
  if(!(game.totalEnergy > 0)) {hardReset();}
  hideAndShow();
}, 1000)



function hideAndShow() {
  switch(game.unlockStage) {
    case 0:
      document.getElementById('unlock1').style.visibility = "hidden";
      document.getElementById('tab1a').style.visibility = "hidden";
      document.getElementById('tab1b').style.visibility = "hidden";
      document.getElementById('tab1c').style.visibility = "hidden";
      if(game.H > 1)
        game.unlockStage++;
    break;
      
    case 1:
      document.getElementById('unlock1').style.visibility = "visible";
      document.getElementById('tab1a').style.visibility = "visible";
      document.getElementById('tab1b').style.visibility = "hidden";
      document.getElementById('tab1c').style.visibility = "hidden";
      break;
      
    case 2:
      document.getElementById('unlock1').style.visibility = "visible";
      document.getElementById('tab1a').style.visibility = "hidden";
      document.getElementById('tab1b').style.visibility = "visible";
      document.getElementById('tab1c').style.visibility = "visible";
      break;
      
    case 3:
      document.getElementById('unlock1').style.visibility = "visible";
      document.getElementById('tab1a').style.visibility = "hidden";
      document.getElementById('tab1b').style.visibility = "visible";
      document.getElementById('tab1c').style.visibility = "hidden";
      break;
  }
}



function save() {
    localStorage.cc = btoa(JSON.stringify(game));
}

function load() {
    if(localStorage.cc) {
      game = JSON.parse(atob(localStorage.cc));
    }
  else hardReset();
  if(!(game.totalEnergy > 0)) hardReset();

    //transformToDecimal(game);
  updateEverything();
  updateProtonSpeed();
  tab("tab1");
}

setInterval(function()
            {
  save();
}, 6969);


function updateEverything() {
    updatePePower();
    document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
    document.getElementById("protonD").innerHTML = game.proton;
    document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * 1000 / game.protonSpeed, 2);
    document.getElementById("protonC").innerHTML = format(game.protonCost, 0);
    document.getElementById("electronD").innerHTML = game.electron;
    document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower, 2);
    document.getElementById("electronC").innerHTML = format(game.electronCost, 0);
    document.getElementById("neutrinoC").innerHTML = format(game.neutrinoCost, 0);
    document.getElementById("neutrinoD").innerHTML = game.neutrino;
    document.getElementById("neutrinoP").innerHTML = Math.round(1 + game.neutrino);
    document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower, 2);
    document.getElementById("HpD").innerHTML = game.H;
    document.getElementById("HpP").innerHTML = Math.round(100 * game.Hpower - 100);
    document.getElementById("u1p").innerHTML = game.u1;
    document.getElementById("sigFigD").innerHTML = game.sigFigs;
    hideAndShow();
}


function hardReset() {
  clearInterval(game.protonInterval);
  
  game.energy = 0;
  game.totalEnergy = 0;
  game.proton = 0;
  game.protonPower = 0;
  game.protonInterval = false;
  game.protonInitCost = 20;
  game.protonCostMult = 4/3;
  game.protonCost = 20;
  game.protonCost10 = 20 * (1 - Math.pow(4/3, 10)) / (1 - 4/3);
  game.protonCost100 = 20 * (1 - Math.pow(4/3, 100)) / (1 - 4/3);
  game.electron = 0;
  game.electronPower = 0;
  game.electronInitCost = 50;
  game.electronCostMult = 1.33;
  game.electronCost = 50;
  game.electronCost10 = 50 * (1 - Math.pow(1.33, 10)) / (1 - 1.33);
  game.electronCost100 = 50 * (1 - Math.pow(1.33, 100)) / (1 - 1.33);
  game.neutrino = 0;
  game.neutrinoPower = 0;
  game.neutrinoInitCost = 100000;
  game.neutrinoCostMult = 2;
  game.neutrinoCost = 100000;
  game.neutrinoCost10 = 100000 * (1 - Math.pow(2, 10)) / (1 - 2);
  game.neutrinoCost100 = 100000 * (1 - Math.pow(2, 100)) / (1 - 2);
  game.H = 0;
  game.deu = 0;
  game.tritium = 0;
  game.Hpower = 1;
  game.clickPower = 1;
  game.clickStat = 0;
  game.protonSpeed = 1000;
  game.u1 = false;
  game.mass = 0;
  game.unlockStage = 0;
  game.sigFigs = 4;
  
    updateEverything();
}


function tab(tab) {
	// hide all your tabs, then show the one the user selected.
	document.getElementById("tab1").style.display = "none"
	document.getElementById("tab2").style.display = "none"
  document.getElementById("tabU1").style.display = "none"
	document.getElementById("tabO1").style.display = "none"
	document.getElementById("tabC1").style.display = "none"
	document.getElementById(tab).style.display = "inline-block"
}
// go to a tab for the first time, so not all show
  
  load();
