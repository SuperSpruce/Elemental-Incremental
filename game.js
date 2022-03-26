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
    neutron: 0,
    neutronPower: 0,
    neutronHL: 600,
    neutronDecayEnergy: 5e6,
    neutronDecayPChance: 0.1,
    neutronDecayEChance: 0.1,
    neutronDecayNChance: 0.25,
    neutronInitCost: 1e6,
    neutronCostMult: 1.5,
    neutronCost: 1e6,
    neutronCost10: 1e6 * (1 - Math.pow(1.5, 10)) / (1 - 1.5),
    neutronCost100: 1e6 * (1 - Math.pow(1.5, 100)) / (1 - 1.5),
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
    totalMass: 0,
    ach: {
      num: 30,
      get: 0,
      power: 1,
      id: new Array(30),
      name: new Array(30),
      desc: new Array(30)
    },
    unlockStage: 0,
    sigFigs: 4,
    minPowerForSci: 6,
    lastTick: Date.now()
  };
  const rand = new Uint32Array(8);
  const MAX_VALUE = 1.79769312e308;
  var energyLastSecond = MAX_VALUE;
  var lastResetTime = 0;
  
  
  
  
  
  function formatTime(seconds) {
    if(seconds < 1e-4) 
      return format(seconds, 0) + "s";
    else if(seconds < 0.1)
      return format(seconds * 1000, 3) + "ms";
    else if(seconds < 60)
      return format(seconds, 3) + "s";
    else if(seconds < 3600)
      return Math.floor(seconds / 60) + "min, " + seconds%60 + "s";
    else if(seconds < 86400)
      return Math.floor(seconds / 3600) + "hr, " + Math.floor((seconds/ 60) % 60) + "min, " + seconds%60 + "s";
    else if(seconds < 31557600) //That's 86400 * 365.25
      return Math.floor(seconds / 86400) + "day, " + Math.floor((seconds / 3600) % 60) + "hr, " + Math.floor((seconds/ 60) % 60) + "min";
    else if(Math.floor(Math.log10(seconds / 31557600)) < game.minPowerForSci)
      return Math.floor(seconds / 31557600) + "yr, " + Math.floor((seconds / 86400) % 365.25) + "day";
    else
      return format(seconds / 31557600) + "yr";
  }
  
  
  function format(amount, maxPrecision) {
    let power = Math.floor(Math.log10(amount));
    if (power < game.minPowerForSci && power > -5 || amount == 0) {
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
      updateEverything();
    }
  }
  
  function changeMinPowerForSci(amount) {
    if(((game.minPowerForSci + amount) < 16) && ((game.minPowerForSci + amount) > 0)) {
      game.minPowerForSci += amount;
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
  
  

  function radioactiveDecay(num, halfLife, frameTime) {
    let chanceForDecay = num * frameTime / halfLife;
    if(chanceForDecay < 0.001)
      return slowDecay(num, halfLife, frameTime);
    else if(chanceForDecay < 100)
      return mediumDecay(num, halfLife, frameTime);
    else
      return fastDecay(num, halfLife, frameTime);
  }
  
  function slowDecay(num, halfLife, frameTime) {
    if(Math.random() < num * frameTime / halfLife)
      return 1;
    else return 0;
  }
  
  function mediumDecay(num, halfLife, frameTime) {
    let a = 0;
    let chance = 1 - 1/(1 + num*frameTime/halfLife);
    while(Math.random() < chance && a < 1000)
      a++;
    return a;
  }
  
  function fastDecay(num, halfLife, frameTime) {
    return Math.round(num * frameTime / halfLife);
  }


  function neutronDecay() {
    let decays = radioactiveDecay(game.neutron, game.neutronHL, 1/30);
    if(decays > 0) {
      game.neutron -= decays;
      game.neutronPower = game.neutron;
      game.energy += (5e6 * decays);
      if(decays > 20) {
        //Will add this in later, needs normal distributions to work properly
      }
      else {
        for(let i = 0; i < decays; i++) {
          if(Math.random() < game.neutronDecayPChance) game.proton++;
          if(Math.random() < game.neutronDecayEChance) game.electron++;
          if(Math.random() < game.neutronDecayNChance) {
            game.neutrino++;
            game.neutrinoPower = game.neutrino;
          }
        }
      }
      if(!game.ach[20]) {
        game.ach.id[20] = true; 
        updateAchievementColors();
        checkAchievementCount();
      }
      updatePePower();
      document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
      document.getElementById("protonD").innerHTML = game.proton;
      document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
      document.getElementById("neutronD").innerHTML = game.neutron;
      document.getElementById("neutronP").innerHTML = format(Math.pow(1 + game.neutronPower/2, 2), 2);
      document.getElementById("electronD").innerHTML = game.electron;
      document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
      document.getElementById("neutrinoD").innerHTML = game.neutrino;
      document.getElementById("neutrinoP").innerHTML = Math.round(1 + game.neutrinoPower);
      document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
    }
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
      game.totalMass += 1.0072765;
      updateProtonPower();
      game.protonCost *= game.protonCostMult;
      game.protonCost10 *= game.protonCostMult;
      game.protonCost100 *= game.protonCostMult;
      document.getElementById("protonC").innerHTML = format(game.protonCost, 0);
      document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
      document.getElementById("protonD").innerHTML = game.proton;
      document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
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
    if(count >= 40 && !game.ach.id[26]) {
      game.ach.id[26] = true; 
      updateAchievementColors();
      checkAchievementCount()
    }
    game.proton += count;
    game.totalMass += count * 1.0072765;
    updateProtonPower();
    game.protonCost10 = game.protonCost * (1 - Math.pow(game.protonCostMult, 10)) / (1 - game.protonCostMult);
    game.protonCost100 = game.protonCost * (1 - Math.pow(game.protonCostMult, 100)) / (1 - game.protonCostMult);
    document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
    document.getElementById("protonD").innerHTML = game.proton;
    document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
    document.getElementById("protonC").innerHTML = format(game.protonCost, 0);
      }
  }
  
  function updateProtonSpeed() {
    clearInterval(game.protonInterval);
    game.protonInterval = setInterval(function()
              {
    tap(game.protonPower * game.Hpower * game.ach.power);
  }, game.protonSpeed); }
  
  function updateProtonPower() {
    game.protonPower = game.proton * (1+game.neutrinoPower) * Math.pow(1 + game.neutronPower/2, 2);
  }
  
  function updateElectronPower() {
    game.electronPower = game.electron * (1+game.neutrinoPower) * Math.pow(1 + game.neutronPower/2, 2);
    game.clickPower = (1 + game.neutrinoPower) * Math.pow(1 + game.neutronPower/2, 2) + game.electronPower;
  }
  
  function updatePePower() {
    updateProtonPower();
    updateElectronPower();
  }


  function updateMass() {
    game.totalMass = game.proton * 1.0072765 + game.electron * 0.0005858 + game.neutron * 1.0086649 + game.H * 1.0078250 + game.deu * 2.0141018;
  }


  
  
  function makeElectron()
  {
    if(game.energy >= Math.ceil(game.electronCost))
    {
      game.energy -= Math.ceil(game.electronCost);
      game.electron++;
      game.totalMass += 0.0005858;
      updateElectronPower();
      game.electronCost *= game.electronCostMult;
      game.electronCost10 *= game.electronCostMult;
      game.electronCost100 *= game.electronCostMult;
      document.getElementById("electronC").innerHTML = format(game.electronCost, 0);
      document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
      document.getElementById("electronD").innerHTML = game.electron;
      document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
      document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
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
    if(count >= 40 && !game.ach.id[26]) {
      game.ach.id[26] = true; 
      updateAchievementColors();
      checkAchievementCount()
    }
    game.electron += count;
    game.totalMass += count * 0.0005858;
    updateElectronPower();
    game.electronCost10 = game.electronCost * (1 - Math.pow(game.electronCostMult, 10)) / (1 - game.electronCostMult);
    game.electronCost100 = game.electronCost * (1 - Math.pow(game.electronCostMult, 100)) / (1 - game.electronCostMult);
    document.getElementById("electronC").innerHTML = format(game.electronCost, 0);
    document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
    document.getElementById("electronD").innerHTML = game.electron;
    document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
    document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
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
      document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
      document.getElementById("neutrinoC").innerHTML = format(game.neutrinoCost, 0);
      document.getElementById("neutrinoD").innerHTML = game.neutrino;
      document.getElementById("neutrinoP").innerHTML = Math.round(1 + game.neutrino);
      document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
      document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
      document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
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
    if(count >= 40 && !game.ach.id[26]) {
      game.ach.id[26] = true; 
      updateAchievementColors();
      checkAchievementCount()
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
    document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
    document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
    document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
    }
  }



  function makeNeutron() {
    if(game.energy >= game.neutronCost && game.proton >= 1 && game.electron >= 1 && game.neutrino >= 1) {
      game.neutron++;
      game.neutronPower = game.neutron;
      game.energy -= game.neutronCost;
      game.proton--;
      game.electron--;
      game.neutrino--;
      game.neutronCost *= game.neutronCostMult;
      game.neutronCost10 *= game.neutronCostMult;
      game.neutronCost100 *= game.neutronCostMult;
      game.neutrinoPower = game.neutrino;
      game.totalMass += 1.0086649;
      updatePePower();
      document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
      document.getElementById("protonD").innerHTML = game.proton;
      document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
      document.getElementById("neutronD").innerHTML = game.neutron;
      document.getElementById("neutronP").innerHTML = format(Math.pow(1 + game.neutronPower/2, 2), 2);
      document.getElementById("neutronC").innerHTML = format(game.neutronCost, 0);
      document.getElementById("electronD").innerHTML = game.electron;
      document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
      document.getElementById("neutrinoD").innerHTML = game.neutrino;
      document.getElementById("neutrinoP").innerHTML = Math.round(1 + game.neutrinoPower);
      document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
    }
  }
  
    function makeMaxNeutrons() {
    if(game.energy / (1e9 * (game.neutronCostMult - 1)) > game.neutronCost)
      logBuy(-2, game.neutronCost, game.neutronCostMult);

      let count = 0;
      while(game.energy > game.neutronCost && game.proton >= 1 && game.electron >= 1 && game.neutrino >= 1) {
        if(game.energy > game.neutronCost100 && game.proton >= 100 && game.electron >= 100 && game.neutrino >= 100) {
          game.energy -= game.neutronCost100;
          let a = Math.pow(game.neutronCostMult, 100);
          game.neutronCost *= a;
          game.neutronCost10 *= a;
          game.neutronCost100 *= a;
          count += 100;
          game.proton -= 100;
          game.electron -= 100;
          game.neutrino -= 100;
          game.totalMass += 100.86649;
        }
        else if(game.energy > game.neutronCost10 && game.proton >= 10 && game.electron >= 10 && game.neutrino >= 10) {
          game.energy -= game.neutronCost10;
          let b = Math.pow(game.neutronCostMult, 10);
          game.neutronCost *= b;
          game.neutronCost10 *= b;
          count += 10;
          game.proton -= 10;
          game.electron -= 10;
          game.neutrino -= 10;
          game.totalMass += 10.086649;
        }
        else {
          game.energy -= game.neutronCost;
          game.neutronCost *= game.neutronCostMult;
          count++;
          game.proton--;
          game.electron--;
          game.neutrino--;
          game.totalMass += 1.0086649;
        }
      }
    if(count >= 40 && !game.ach.id[26]) {
      game.ach.id[26] = true; 
      updateAchievementColors();
      checkAchievementCount()
    }
    game.neutron += count;
    game.neutrinoPower = game.neutrino;
    game.neutronPower = game.neutron;
    updatePePower();
    game.neutronCost10 = game.neutronCost * (1 - Math.pow(game.neutronCostMult, 10)) / (1 - game.neutronCostMult);
    game.neutronCost100 = game.neutronCost * (1 - Math.pow(game.neutronCostMult, 100)) / (1 - game.neutronCostMult);
    document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
    document.getElementById("protonD").innerHTML = game.proton;
    document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
    document.getElementById("neutronD").innerHTML = game.neutron;
    document.getElementById("neutronP").innerHTML = format(Math.pow(1 + game.neutronPower/2, 2), 2);
    document.getElementById("neutronC").innerHTML = format(game.neutronCost, 0);
    document.getElementById("electronD").innerHTML = game.electron;
    document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
    document.getElementById("neutrinoD").innerHTML = game.neutrino;
    document.getElementById("neutrinoP").innerHTML = Math.round(1 + game.neutrinoPower);
    document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
  }

  
  
  
  
  function u1b()
  {
    if(game.H >= 100 && !game.u1)
      {
        game.u1 = true;
        game.H -= 100;
        game.protonSpeed /= 2;
        game.Hpower = Math.sqrt(game.H + 1) * Math.sqrt(game.deu + 1);
        document.getElementById("H1D").innerHTML = game.H;
        document.getElementById("H1P").innerHTML = format(Math.sqrt(game.H + 1), 2);
        document.getElementById("HpP").innerHTML = format(game.Hpower, 2);
        document.getElementById("u1p").innerHTML = game.u1;
        document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
        document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);   
        document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
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
    if(game.H >= 20 && game.unlockStage == 2) {
      game.unlockStage++;
      game.H -= 20;
      game.Hpower = Math.sqrt(game.H + 1) * Math.sqrt(game.deu + 1);
      document.getElementById("H1D").innerHTML = game.H;
      document.getElementById("H1P").innerHTML = format(Math.sqrt(game.H + 1), 2);
      document.getElementById("HpP").innerHTML = format(game.Hpower, 2);
      document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
      document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
      document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
      hideAndShow();
    }
  }
  
  
  
  function p1(mass) //not the McLaren P1, this is a :ripaarex:
  {
    if(Date.now() - lastResetTime <= 4000 && Math.min(game.proton, game.electron) >= 1 && !game.ach.id[14]) {
      game.ach.id[14] = true; 
      updateAchievementColors();
      checkAchievementCount();
    }
    lastResetTime = Date.now();

    if(mass == 1) {
      game.H += Math.min(game.proton, game.electron);
      document.getElementById("H1D").innerHTML = game.H;
      document.getElementById("H1P").innerHTML = format(Math.sqrt(game.H + 1), 2);
      }
    else if(mass == 2) {
      game.deu += Math.min(game.proton, game.neutron, game.electron);
      document.getElementById("H2D").innerHTML = game.deu;
      document.getElementById("H2P").innerHTML = format(Math.sqrt(game.deu + 1), 2);
    }

    game.Hpower = Math.sqrt(game.H + 1) * Math.sqrt(game.deu + 1);
    game.energy = 0;
    game.clickPower = 1;
    game.proton = 0;
    game.electron = 0;
    game.electronPower = 0;
    game.protonPower = 0;
    game.protonCost = 20;
    game.protonCost10 = 20 * (1 - Math.pow(4/3, 10)) / (1 - 4/3);
    game.protonCost100 = 20 * (1 - Math.pow(4/3, 100)) / (1 - 4/3);
    game.electronCost = 50;
    game.electronCost10 = 50 * (1 - Math.pow(1.33, 10)) / (1 - 1.33);
    game.electronCost100 = 50 * (1 - Math.pow(1.33, 100)) / (1 - 1.33);
    game.neutrino = 0;
    game.neutrinoPower = 0;
    game.neutrinoCost = 100000;
    game.neutrinoCost10 = 100000 * (1 - Math.pow(2, 10)) / (1 - 2);
    game.neutrinoCost100 = 100000 * (1 - Math.pow(2, 100)) / (1 - 2);
    game.neutron = 0;
    game.neutronPower = 0;
    game.neutronCost = 1e6;
    game.neutronCost10 = 1e6 * (1 - Math.pow(1.5, 10)) / (1 - 1.5);
    game.neutronCost100 = 1e6 * (1 - Math.pow(1.5, 100)) / (1 - 1.5);
    updateMass();
    document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
    document.getElementById("protonD").innerHTML = game.proton;
    document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
    document.getElementById("protonC").innerHTML = format(game.protonCost, 0);
    document.getElementById("neutronC").innerHTML = format(game.neutronCost, 0);
    document.getElementById("neutronD").innerHTML = game.neutron;
    document.getElementById("neutronP").innerHTML = format(Math.pow(1 + game.neutronPower/2, 2), 2);
    document.getElementById("electronD").innerHTML = game.electron;
    document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
    document.getElementById("electronC").innerHTML = format(game.electronCost, 0);
    document.getElementById("neutrinoC").innerHTML = format(game.neutrinoCost, 0);
    document.getElementById("neutrinoD").innerHTML = game.neutrino;
    document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
    document.getElementById("HpP").innerHTML = format(game.Hpower, 2);
  }
  
  
  
  
  
  setInterval(function() {
    neutronDecay();
  }, 33.333333333333)
  
  
  
  setInterval(function()
             {
    if(!(game.totalEnergy > 0)) {hardReset();}
    checkForAchievements();
    hideAndShow();
  }, 1000)
  
  
  
  function hideAndShow() {
    switch(game.unlockStage) {
      case 0:
        document.getElementById('unlock1').style.visibility = "hidden";
        document.getElementById('tab1a').style.visibility = "hidden";
        document.getElementById('tab1b').style.visibility = "hidden";
        document.getElementById('tab1c').style.visibility = "hidden";
        document.getElementById('tab1d').style.visibility = "hidden";
        document.getElementById('H2square').style.visibility = "hidden";
        if(game.H > 1)
          game.unlockStage++;
      break;
        
      case 1:
        document.getElementById('unlock1').style.visibility = "visible";
        document.getElementById('tab1a').style.visibility = "visible";
        document.getElementById('tab1b').style.visibility = "hidden";
        document.getElementById('tab1c').style.visibility = "hidden";
        document.getElementById('tab1d').style.visibility = "hidden";
        document.getElementById('H2square').style.visibility = "hidden";
        break;
        
      case 2:
        document.getElementById('unlock1').style.visibility = "visible";
        document.getElementById('tab1a').style.visibility = "hidden";
        document.getElementById('tab1b').style.visibility = "visible";
        document.getElementById('tab1c').style.visibility = "visible";
        document.getElementById('tab1d').style.visibility = "hidden";
        document.getElementById('H2square').style.visibility = "hidden";
        break;
        
      case 3:
        document.getElementById('unlock1').style.visibility = "visible";
        document.getElementById('tab1a').style.visibility = "hidden";
        document.getElementById('tab1b').style.visibility = "visible";
        document.getElementById('tab1c').style.visibility = "hidden";
        document.getElementById('tab1d').style.visibility = "visible";
        document.getElementById('H2square').style.visibility = "visible";
        break;
    }
  }
  
  
  
  function save() {
      localStorage.cc = btoa(JSON.stringify(game));
  }
  
  function load(type) {
    initializeVariables();
      if(localStorage.cc && type == 0) {
        game = JSON.parse(atob(localStorage.cc));
        initializeVariables();
      }
    else if(type == 0) hardReset();
    if(!(game.totalEnergy > 0)) hardReset();
  
      //transformToDecimal(game);
    updateEverything();
    updateProtonSpeed();
    tab("tab1");
    document.hasFocus = true;
  }

  function exportSave() {
    let save = btoa(JSON.stringify(game));
    navigator.clipboard.writeText(save);
  }

  function importSave(save) {
    game = JSON.parse(atob(save));
    load(1);
  }
  
  
  
  window.addEventListener('keydown', function(event) {
      switch(event.keyCode) {
      case 72: // H
        p1(1);
        break;
      case 68: // D
        p1(2);
        break;
    }
  });
  
  
  
  setInterval(function()
              {
    save();
    updateEverything();
  }, 6969);
  
  
  
  function checkForAchievements() {
    if(game.proton >= 6 && game.electron >= 6 && !game.ach.id[0]) {
      game.ach.id[0] = true; 
      updateAchievementColors();
      checkAchievementCount();
    }
    if(game.proton >= 10 && game.electron >= 10 && !game.ach.id[1]) {
      game.ach.id[1] = true; 
      updateAchievementColors();
      checkAchievementCount();
    }
    if(game.proton >= 18 && game.electron >= 18 && !game.ach.id[2]) {
      game.ach.id[2] = true; 
      updateAchievementColors();
      checkAchievementCount();
    }
    if(game.proton >= 26 && game.electron >= 26 && !game.ach.id[6]) { 
      game.ach.id[6] = true; 
      updateAchievementColors();
      checkAchievementCount();
    }
    if(game.proton >= 36 && game.electron >= 36 && !game.ach.id[7]) {
      game.ach.id[7] = true; 
      updateAchievementColors();
      checkAchievementCount();
    }
    if(game.proton >= 47 && game.electron >= 47 && !game.ach.id[17]) {
      game.ach.id[17] = true; 
      updateAchievementColors();
      checkAchievementCount();
    }
    if(game.proton >= 54 && game.electron >= 54 && !game.ach.id[18]) {
      game.ach.id[18] = true; 
      updateAchievementColors();
      checkAchievementCount();
    }
    if(game.proton == 0 && game.electron >= 30 && !game.ach.id[10]) {
      game.ach.id[10] = true; 
      updateAchievementColors();
      checkAchievementCount();
    }
    if(game.proton >= 30 && game.electron == 0 && !game.ach.id[11]) {
      game.ach.id[11] = true; 
      updateAchievementColors();
      checkAchievementCount();
    }
    
    if(game.totalEnergy >= 21300 && !game.ach.id[3]) {
      game.ach.id[3] = true; 
      updateAchievementColors();
      checkAchievementCount();
    }
    if(game.totalEnergy >= 133100 && !game.ach.id[4]) {
      game.ach.id[4] = true; 
      updateAchievementColors();
      checkAchievementCount();
    }
    if(game.totalEnergy >= 1e6 && !game.ach.id[5]) {
      game.ach.id[5] = true; 
      updateAchievementColors();
      checkAchievementCount();
    }
    if(game.energy >= 1e7 && !game.ach.id[8]) {
      game.ach.id[8] = true;
      updateAchievementColors();
      checkAchievementCount();
    }
    if(game.energy >= 5e7 && game.neutrino == 0 && !game.ach.id[19]) {
      game.ach.id[19] = true; 
      updateAchievementColors();
      checkAchievementCount()
    }
    if(game.energy >= 5e8 && game.neutrino == 0 && game.neutron == 0 && !game.ach.id[29]) {
      game.ach.id[29] = true; 
      updateAchievementColors();
      checkAchievementCount()
    }
    if(game.totalEnergy >= 2e8 && !game.ach.id[21]) {
      game.ach.id[21] = true;
      updateAchievementColors();
      checkAchievementCount();
    }
    if(game.totalEnergy >= 1e9 && !game.ach.id[25]) {
      game.ach.id[25] = true;
      updateAchievementColors();
      checkAchievementCount();
    }
    
    if(game.H + 2*game.deu >= 294 && !game.ach.id[9]) {
      game.ach.id[9] = true; 
      updateAchievementColors();
      checkAchievementCount();
    }
    if(game.neutrino >= 10 && !game.ach.id[15]) {
      game.ach.id[15] = true; 
      updateAchievementColors();
      checkAchievementCount();
    }
    if(game.proton + game.electron + game.neutrino + game.neutron >= 100 && !game.ach.id[16]) {
      game.ach.id[16] = true; 
      updateAchievementColors();
      checkAchievementCount();
    }
    if(game.neutron >= 4 && game.neutrino == 0 && !game.ach.id[22]) {
      game.ach.id[22] = true;
      updateAchievementColors();
      checkAchievementCount();
    }
    if(game.neutron >= 6 && !game.ach.id[23]) {
      game.ach.id[23] = true;
      updateAchievementColors();
      checkAchievementCount();
    }
    if(game.neutron >= 5 && game.proton == 0 && game.electron == 0 && !game.ach.id[24]) {
      game.ach.id[24] = true;
      updateAchievementColors();
      checkAchievementCount();
    }
    if(game.totalMass >= 1200 && !game.ach.id[28]) {
      game.ach.id[28] = true;
      updateAchievementColors();
      checkAchievementCount();
    }
    if(game.ach.get >= 10 && !game.ach.id[13]) {
      game.ach.id[13] = true; 
      updateAchievementColors();
      checkAchievementCount();
    }
    if(game.ach.get >= 25 && !game.ach.id[27]) {
      game.ach.id[27] = true; 
      updateAchievementColors();
      checkAchievementCount();
    }
    
    if(game.energy - energyLastSecond >= 20000 && !game.ach.id[12]) {
      game.ach.id[12] = true; 
      updateAchievementColors();
      checkAchievementCount();
    }
    
    energyLastSecond = game.energy;
  }
  
  function checkAchievementCount() {
    let n = 0;
    for(let i = 0; i < game.ach.num; i++)
      if(game.ach.id[i]) n++;
    game.ach.get = n;
    game.ach.power = Math.pow(1.05, n);
    document.getElementById("achBonusD").innerHTML = format(game.ach.power, 2);
    document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
    document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
    document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
  }
  
  function updateAchievementColors() {
    for(let i = 1; i < game.ach.num+1; i++) {
       if(game.ach.id[i-1]) 
         document.getElementById("ach" + i + "D").className = "achT";
       else
         document.getElementById("ach" + i + "D").className = "achF";
    }
  }
  
  


  function updateEverything() {
    checkAchievementCount();
    updateMass();
    updatePePower();
    document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
    document.getElementById("totalEnergyD").innerHTML = format(game.totalEnergy, 0);
    document.getElementById("protonD").innerHTML = game.proton;
    document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
    document.getElementById("protonC").innerHTML = format(game.protonCost, 0);
    document.getElementById("neutronD").innerHTML = game.neutron;
    document.getElementById("neutronP").innerHTML = format(Math.pow(1 + game.neutronPower/2, 2), 2);
    document.getElementById("neutronC").innerHTML = format(game.neutronCost, 0);
    document.getElementById("neutronDecayEnD").innerHTML = format(game.neutronDecayEnergy, 0);
    document.getElementById("neutronHLD").innerHTML = formatTime(game.neutronHL);
    document.getElementById("neutronDecayPD").innerHTML = format(game.neutronDecayPChance * 100, 2);
    document.getElementById("neutronDecayElD").innerHTML = format(game.neutronDecayEChance * 100, 2);
    document.getElementById("neutronDecayND").innerHTML = format(game.neutronDecayNChance * 100, 2);
    document.getElementById("electronD").innerHTML = game.electron;
    document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
    document.getElementById("electronC").innerHTML = format(game.electronCost, 0);
    document.getElementById("neutrinoC").innerHTML = format(game.neutrinoCost, 0);
    document.getElementById("neutrinoD").innerHTML = game.neutrino;
    document.getElementById("neutrinoP").innerHTML = Math.round(1 + game.neutrino);
    document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
    document.getElementById("H1D").innerHTML = game.H;
    document.getElementById("H1P").innerHTML = format(Math.sqrt(game.H + 1), 2);
    document.getElementById("H2D").innerHTML = game.deu;
    document.getElementById("H2P").innerHTML = format(Math.sqrt(game.deu + 1), 2);
    document.getElementById("HpP").innerHTML = format(game.Hpower, 2);
    document.getElementById("u1p").innerHTML = game.u1;
    document.getElementById("sigFigD").innerHTML = game.sigFigs;
    document.getElementById("minPowerForSciD").innerHTML = game.minPowerForSci;
    document.getElementById("minPowerForSciD2").innerHTML = game.minPowerForSci;
    hideAndShow();
    updateAchievementColors();
}



  
  function initializeVariables() {
    if(!game.energy) game.energy = 0;
    if(!game.totalEnergy) game.totalEnergy = 0;
    if(!game.proton) game.proton = 0;
    if(!game.protonPower) game.protonPower = 0;
    if(!game.protonInitCost) game.protonInitCost = 20;
    if(!game.protonCostMult) game.protonCostMult = 4/3;
    if(!game.protonCost) game.protonCost = 20;
    if(!game.protonCost10) game.protonCost10 = 20 * (1 - Math.pow(4/3, 10)) / (1 - 4/3);
    if(!game.protonCost100) game.protonCost100 = 20 * (1 - Math.pow(4/3, 100)) / (1 - 4/3);
    if(!game.neutron) game.neutron = 0;
    if(!game.neutronPower) game.neutronPower = 0;
    if(!game.neutronHL) game.neutronHL = 600;
    if(!game.neutronDecayEnergy) game.neutronDecayEnergy = 5e6;
    if(!game.neutronDecayPChance) game.neutronDecayPChance = 0.1;
    if(!game.neutronDecayEChance) game.neutronDecayEChance = 0.1;
    if(!game.neutronDecayNChance) game.neutronDecayNChance = 0.25;
    if(!game.neutronInitCost) game.neutronInitCost = 1e6;
    if(!game.neutronCostMult) game.neutronCostMult = 1.5;
    if(!game.neutronCost) game.neutronCost = 1e6;
    if(!game.neutronCost10) game.neutronCost10 = 1e6 * (1 - Math.pow(1.5, 10)) / (1 - 1.5);
    if(!game.neutronCost100) game.neutronCost100 = 1e6 * (1 - Math.pow(1.5, 100)) / (1 - 1.5);
    if(!game.electron) game.electron = 0;
    if(!game.electronPower) game.electronPower = 0;
    if(!game.electronInitCost) game.electronInitCost = 50;
    if(!game.electronCostMult) game.electronCostMult = 1.33;
    if(!game.electronCost) game.electronCost = 50;
    if(!game.electronCost10) game.electronCost10 = 50 * (1 - Math.pow(1.33, 10)) / (1 - 1.33);
    if(!game.electronCost100) game.electronCost100 = 50 * (1 - Math.pow(1.33, 100)) / (1 - 1.33);
    if(!game.neutrino) game.neutrino = 0;
    if(!game.neutrinoPower) game.neutrinoPower = 0;
    if(!game.neutrinoInitCost) game.neutrinoInitCost = 100000;
    if(!game.neutrinoCostMult) game.neutrinoCostMult = 2;
    if(!game.neutrinoCost) game.neutrinoCost = 100000;
    if(!game.neutrinoCost10) game.neutrinoCost10 = 100000 * (1 - Math.pow(2, 10)) / (1 - 2);
    if(!game.neutrinoCost100) game.neutrinoCost100 = 100000 * (1 - Math.pow(2, 100)) / (1 - 2);
    if(!game.H) game.H = 0;
    if(!game.deu) game.deu = 0;
    if(!game.tritium) game.tritium = 0;
    if(!game.Hpower) game.Hpower = 1;
    if(!game.clickPower) game.clickPower = 1;
    if(!game.clickStat) game.clickStat = 0;
    if(!game.protonSpeed) game.protonSpeed = 1000;
    if(!game.u1) game.u1 = false;
    if(!game.totalMass) game.totalMass = 0;
    if(!game.unlockStage) game.unlockStage = 0;
    if(!game.sigFigs) game.sigFigs = 4;
    if(!game.minPowerForSci) game.minPowerForSci = 6;
    if(!game.ach) {
      game.ach = {
        num: 30,
        get: 0,
        power: 1,
        id: new Array(30)
      }
    }
    if(!game.ach.num || game.ach.num != 30) game.ach.num = 30;
    if(!game.ach.id || game.ach.id[0] == "null") {
      game.ach.id = new Array(game.ach.num);
      for(let i = 0; i < game.ach.num; i++)
        game.ach.id[i] = false;
    }
    if(game.ach.id.length != game.ach.num) {
      let a = game.ach.id;
      game.ach.id = new Array(game.ach.num);
      for(let i = 0; i < Math.min(a.length, game.ach.num); i++) 
        game.ach.id[i] = a[i];
    }
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
    game.neutron = 0;
    game.neutronPower = 0;
    game.neutronHL = 600;
    game.neutronDecayEnergy = 5e6;
    game.neutronDecayPChance = 0.1;
    game.neutronDecayEChance = 0.1;
    game.neutronDecayNChance = 0.25;
    game.neutronInitCost = 1e6;
    game.neutronCostMult = 1.5;
    game.neutronCost = 1e6;
    game.neutronCost10 = 1e6 * (1 - Math.pow(1.5, 10)) / (1 - 1.5);
    game.neutronCost100 = 1e6 * (1 - Math.pow(1.5, 100)) / (1 - 1.5);
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
    game.totalMass = 0;
    game.ach.num = 30;
    for(let i = 0; i < game.ach.num; i++)
      game.ach.id[i] = false;
    game.ach.get = 0;
    game.ach.power = 1;
    game.unlockStage = 0;
    game.sigFigs = 4;
    game.minPowerForSci = 6;
    
    updateEverything();
    updateProtonSpeed();
  }
  
  
  function tab(tab) {
      // hide all your tabs, then show the one the user selected.
      document.getElementById("tab1").style.display = "none";
      document.getElementById("tab2").style.display = "none";
    document.getElementById("tabU1").style.display = "none";
      document.getElementById("tabO1").style.display = "none";
      document.getElementById("tabM").style.display = "none";
    document.getElementById("tabM.1").style.display = "none";
    document.getElementById("tabM.2").style.display = "none";
    document.getElementById("tabM.3").style.display = "none";
    document.getElementById("tabM.4").style.display = "none";
    document.getElementById("tabM.5").style.display = "none";
      document.getElementById(tab).style.display = "inline-block";
    if(tab.startsWith("tabM.")) 
      document.getElementById("tabM").style.display = "inline-block";
  }
  // go to a tab for the first time, so not all show
    load(0);
