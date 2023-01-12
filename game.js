var game = {
    energy: 0,
    totalEnergy: 0,
    clickPower: 1,
    clickStat: 0,
    proton: 0,
    protonPower: 0,
    protonSpeed: 1000,
    protonInitCost: 20,
    protonCostMult: 4/3,
    protonCost: 20,
    protonCost10: 20 * (1 - Math.pow(4/3, 10)) / (1 - 4/3),
    protonCost100: 20 * (1 - Math.pow(4/3, 100)) / (1 - 4/3),
    neutron: 0,
    neutronPower: 1,
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
    neutronEffectExponent: 2,
    electron: 0,
    electronPower: 0,
    electronInitCost: 50,
    electronCostMult: 1.33,
    electronCost: 50,
    electronCost10: 50 * (1 - Math.pow(1.33, 10)) / (1 - 1.33),
    electronCost100: 50 * (1 - Math.pow(1.33, 100)) / (1 - 1.33),
    neutrino: 0,
    neutrinoPower: 1,
    neutrinoInitCost: 100000,
    neutrinoCostMult: 2,
    neutrinoCost: 100000,
    neutrinoCost10: 100000 * (1 - Math.pow(2, 10)) / (1 - 2),
    neutrinoCost100: 100000 * (1 - Math.pow(2, 100)) / (1 - 2),
    neutrinoEffectExponent: 1,
    H: 0,
    deu: 0,
    tritium: 0,
    totalHydrogen: 0,
    totalHydrogen60secondsAgo: 0,
    He: 0,
    Hpower: 1,
    totalMass: 0,
    subatomicBoughtThisRun: new Array(4),
    
    nu: {
      num: 4,
      id: new Array(4)
    },
    ru: {
      num: 7,
      id: new Array(7)
    },
    iu: {
      num: 1,
      id: new Array(1)
    },

    c1: { //gas contaner 1
      gases: new Array(2), //gases in container 1 (Gas object)
      t: 0, //temperature
      p: 0, //pressure
      v: 1, //volume
      it: 'p', //input type (proportion or amount)
      ing: 0, //input number for gases (in text box)
      inh: 0, //input number for heat (in text box)
    },

    ach: {
      num: 40,
      get: 0,
      power: 1,
      id: new Array(40),
      name: new Array(40)
    },
    unlockStage: 0,
    tab3: 0,
    sigFigs: 4,
    minPowerForSci: 6,
    hotkeys: true,
    lastTick: Date.now()
  };
  const rand = new Uint32Array(8);
  const MAX_VALUE = 1.79769312e308;
  var energyLastSecond = MAX_VALUE;
  var lastResetTime = 0;
  const ruBaseCost = [10, 1, 1e8, [50, 5, 5e8], [500, 25, 1.6e9], [300, 1e9], [20, 1e9]];
  const periodicRows = [2, 10, 18, 36, 54, 86, 118, 168, 218, 290, 362, 460, 558, 686, 814, 976, 1138, 1338, 1538, 1780, 2022, 2310, 2598, 2936, 3274, 3666, 4058, 4508, 4958, 5470, 5982, 6560, 7138, 7786, 8434, 9156, 9878, 10678, 11478, 12360, 13242, 14210, 15178];
  var HEffectExponent = [0.5, 0.5];

  var protonInterval;
  var GasIt = [null, 'p'];

  
  
  
  
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
    else if(seconds < 31557600) //That's 86400 * 365.25. Yes, I'm assuming a year is 365.25 days here.
      return Math.floor(seconds / 86400) + "day, " + Math.floor((seconds / 3600) % 60) + "hr, " + Math.floor((seconds/ 60) % 60) + "min";
    else if(Math.floor(Math.log10(seconds / 31557600)) < game.minPowerForSci)
      return Math.floor(seconds / 31557600) + "yr, " + Math.floor((seconds / 86400) % 365.25) + "day";
    else
      return format(seconds / 31557600) + "yr";
  }
  
  
  function format(amount, maxPrecision) {
    if(amount < 0)
      return amount.toFixed(maxPrecision);
    let power = Math.floor(Math.log10(amount));
    if (power < game.minPowerForSci && power > -5 || amount == 0) {
      if(maxPrecision == 0) {return Math.round(amount);}
      else return amount.toFixed(maxPrecision);
    }
      else {
      let mantissa = amount / Math.pow(10, power);
      return mantissa.toFixed(game.sigFigs-1) + "e" + power; 
    }
  }
  

  function changeSigFigs(change, value) {
    if(change == 0) {
      if(value < 1) {
        alert("You cannot have less than 1 significant figure.");
        value = 1;
      }
      else if(value > 9) {
        alert("You cannot have more than 9 significant figures.");
        value = 9;
      }
      game.sigFigs = Math.round(value);
    }
    if(((game.sigFigs + change) < 10) && ((game.sigFigs + change) > 0)) {
      game.sigFigs += change;
    }
    updateEverything();
  }

  function sigFigTextBox() {
    let sigFigInput2 = parseInt(document.getElementById("sigFigInput1").value);
    changeSigFigs(0, sigFigInput2);
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
  
  function logBuy(initialCost, costMult, resourceSpent) {
      let quo = resourceSpent / initialCost;
      let geoConst = 1 - (1 / costMult);
      return Math.ceil(logBase(costMult, quo * geoConst));
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



  function randn_bm() {  //found this on StackOverflow lol
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  }

  function normal(mean, sd) {
    return randn_bm() * sd + mean;
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
      if(decays > 20) {
        if(game.nu.id[3]) {
          initialEnergyGain = (game.neutronDecayEnergy + game.neutronInitCost / 2 * Math.pow(game.neutronCostMult, game.subatomicBoughtThisRun[3] - game.neutron - i));
          game.energy += initialEnergyGain * (1 - Math.pow(game.neutronCostMult, decays)) / (1 - game.neutronCostMult);
        }
        else game.energy += game.neutronDecayEnergy * decays;

        game.proton += Math.round(normal(decays * game.neutronDecayPChance, Math.sqrt(decays * game.neutronDecayPChance * (1-game.neutronDecayPChance))));
        game.electron += Math.round(normal(decays * game.neutronDecayEChance, Math.sqrt(decays * game.neutronDecayEChance * (1-game.neutronDecayEChance))));
        game.neutrino += Math.round(normal(decays * game.neutronDecayNChance, Math.sqrt(decays * game.neutronDecayNChance * (1-game.neutronDecayNChance))));
      }
      else {
        for(let i = 0; i < decays; i++) {
          if(Math.random() < game.neutronDecayPChance) game.proton++;
          if(Math.random() < game.neutronDecayEChance) game.electron++;
          if(Math.random() < game.neutronDecayNChance) {
            game.neutrino++;
          }
          if(game.nu.id[3]) {
            game.energy += (game.neutronDecayEnergy + game.neutronInitCost / 2 * Math.pow(game.neutronCostMult, game.subatomicBoughtThisRun[3] - game.neutron - i));
          }
          else game.energy += game.neutronDecayEnergy;
        }
      }
      if(!game.ach[20]) {
        game.ach.id[20] = true; 
        updateAchievementColors();
        checkAchievementCount();
      }
      updatePennPower();
      if(game.nu.id[3])
        document.getElementById("neutronDecayEnD").innerHTML = format(game.neutronDecayEnergy + game.neutronInitCost / 2 * Math.pow(game.neutronCostMult, game.subatomicBoughtThisRun[3] - game.neutron), 0);
      document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
      document.getElementById("protonD").innerHTML = game.proton;
      document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
      document.getElementById("energyS").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
      document.getElementById("neutronD").innerHTML = game.neutron;
      document.getElementById("neutronP0").innerHTML = format(1 + game.neutron/2, 1);
      document.getElementById("neutronP").innerHTML = format(game.neutronPower, 2);
      document.getElementById("electronD").innerHTML = game.electron;
      document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
      document.getElementById("neutrinoD").innerHTML = game.neutrino;
      document.getElementById("neutrinoP0").innerHTML = Math.round(1 + game.neutrino);
      document.getElementById("neutrinoP").innerHTML = format(game.neutrinoPower, 1);
      document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
    }
  }



  function subatomicRowBonus(resource) {
    let minLevel = 0;
    let level = Math.ceil(periodicRows.length / 2);
    let maxLevel = periodicRows.length;
    while(resource >= periodicRows[level] || resource < periodicRows[level - 1]) {
      if(resource >= periodicRows[level]) {
        minLevel = level;
        level = Math.ceil((minLevel + maxLevel) / 2);
      }
      else {
        maxLevel = level;
        level = Math.floor((minLevel + maxLevel) / 2);
      }
    }
    return level;
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
      game.subatomicBoughtThisRun[0]++;
      game.totalMass += 1.0072765;
      updateProtonPower();
      game.protonCost *= game.protonCostMult;
      game.protonCost10 *= game.protonCostMult;
      game.protonCost100 *= game.protonCostMult;
      updateElectronCosts();
      document.getElementById("protonC").innerHTML = format(game.protonCost, 0);
      document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
      document.getElementById("protonD").innerHTML = game.proton;
      document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
      document.getElementById("energyS").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
      document.getElementById("protonRowBonusNext").innerHTML = periodicRows[subatomicRowBonus(game.proton)];
    }
  }
  
  function makeMaxProtons()
  {
    let count = 0;
    if(game.energy / (1e9 * (game.protonCostMult - 1)) > game.protonCost) {
      count = logBuy(game.protonCost, game.protonCostMult, game.energy);
      game.energy -= game.protonCost / (1 - 1/game.protonCostMult) * Math.pow(game.protonCostMult, count - 1);
      game.protonCost *= Math.pow(game.protonCostMult, count);
    }
      else {
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
  }
    if(count >= 40 && !game.ach.id[26]) {
      game.ach.id[26] = true; 
      updateAchievementColors();
      checkAchievementCount()
    }
    game.proton += count;
    game.subatomicBoughtThisRun[0] += count;
    game.totalMass += count * 1.0072765;
    updateProtonPower();
    game.protonCost10 = game.protonCost * (1 - Math.pow(game.protonCostMult, 10)) / (1 - game.protonCostMult);
    game.protonCost100 = game.protonCost * (1 - Math.pow(game.protonCostMult, 100)) / (1 - game.protonCostMult);
    updateElectronCosts();
    document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
    document.getElementById("protonD").innerHTML = game.proton;
    document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
    document.getElementById("energyS").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
    document.getElementById("protonC").innerHTML = format(game.protonCost, 0);
    document.getElementById("protonRowBonusNext").innerHTML = periodicRows[subatomicRowBonus(game.proton)];
  }
  
  function updateProtonSpeed() {
    clearInterval(protonInterval);
    protonInterval = setInterval(function()
              {
    tap(game.protonPower * game.Hpower * game.ach.power);
  }, game.protonSpeed); }
  
  function updateProtonPower() {
    game.protonPower = game.proton * game.neutrinoPower * game.neutronPower * Math.pow((1 + game.ru.id[5] / 10), subatomicRowBonus(game.proton));
  }
  
  function updateElectronPower() {
    game.electronPower = game.electron * game.neutrinoPower * game.neutronPower * Math.pow(3, game.ru.id[4]) * Math.pow((1 + game.ru.id[6] / 10), subatomicRowBonus(game.electron));
    game.clickPower = game.neutrinoPower * game.neutronPower + game.electronPower;
  }

  function updateNeutrinoPower() {
    game.neutrinoEffectExponent = 0.99999 + 0.00001 * Math.pow(10, 3.7 * Math.pow(Math.log10(Math.max(1, game.c1.t)), 0.12));
    game.neutrinoPower = 1 + Math.pow(game.neutrino, game.neutrinoEffectExponent);
  }

  function updateNeutronPower() {
    game.neutronEffectExponent = 1.99999 + 0.00001 * Math.pow(10, 3.7 * Math.pow(Math.log10(Math.max(1, game.c1.p)), 0.12));
    game.neutronPower = Math.pow((1 + game.neutron/2), game.neutronEffectExponent);
  }
  
  function updatePePower() {
    updateProtonPower();
    updateElectronPower();
  }

  function updateNnPower() {
    updateNeutrinoPower();
    updateNeutronPower();
  }

  function updatePennPower() {
    updateNnPower();
    updatePePower();
  }


  function updateProtonCosts() {
    game.protonCostMult = (4/3 - 1) * Math.pow(0.97, game.ru.id[0]) + 1.000000000001;
    if(game.nu.id[1]) {
      game.protonCost = game.protonInitCost * Math.pow(game.protonCostMult, game.subatomicBoughtThisRun[0]) / Math.pow(2, Math.pow(game.electron, 1/3));
    }
    else {
      game.protonCost = game.protonInitCost * Math.pow(game.protonCostMult, game.subatomicBoughtThisRun[0]);
    }
      game.protonCost10 = game.protonCost * (1 - Math.pow(game.protonCostMult, 10)) / (1 - game.protonCostMult);
      game.protonCost100 = game.protonCost * (1 - Math.pow(game.protonCostMult, 100)) / (1 - game.protonCostMult);
      document.getElementById("protonC").innerHTML = format(game.protonCost, 0);
  }

  function updateElectronCosts() {
    game.electronCostMult = 0.33 * Math.pow(0.97, game.ru.id[1]) + 1.000000000001;
    if(game.nu.id[1]) {
      game.electronCost = game.electronInitCost * Math.pow(game.electronCostMult, game.subatomicBoughtThisRun[1]) / Math.pow(2, Math.pow(game.proton, 1/3));
    }
    else {
      game.electronCost = game.electronInitCost * Math.pow(game.electronCostMult, game.subatomicBoughtThisRun[1]);
    }
      game.electronCost10 = game.electronCost * (1 - Math.pow(game.electronCostMult, 10)) / (1 - game.electronCostMult);
      game.electronCost100 = game.electronCost * (1 - Math.pow(game.electronCostMult, 100)) / (1 - game.electronCostMult);
      document.getElementById("electronC").innerHTML = format(game.electronCost, 0);
  }

  function updateNeutrinoCosts() {
    game.neutrinoCostMult = Math.pow(0.96, game.ru.id[2]) + 1.000000000001;
    game.neutrinoCost = game.neutrinoInitCost * Math.pow(game.neutrinoCostMult, game.subatomicBoughtThisRun[2]);
    game.neutrinoCost10 = game.neutrinoCost * (1 - Math.pow(game.neutrinoCostMult, 10)) / (1 - game.neutrinoCostMult);
    game.neutrinoCost100 = game.neutrinoCost * (1 - Math.pow(game.neutrinoCostMult, 100)) / (1 - game.neutrinoCostMult);
    document.getElementById("neutrinoC").innerHTML = format(game.neutrinoCost, 0);
  }

  function updateNeutronCosts() {
    game.neutronCostMult = 1/2 * Math.pow(0.96, game.ru.id[3]) + 1.000000000001;
    game.neutronCost = game.neutronInitCost * Math.pow(game.neutronCostMult, game.subatomicBoughtThisRun[3]);
    game.neutronCost10 = game.neutronCost * (1 - Math.pow(game.neutronCostMult, 10)) / (1 - game.neutronCostMult);
    game.neutronCost100 = game.neutronCost * (1 - Math.pow(game.neutronCostMult, 100)) / (1 - game.neutronCostMult);
    document.getElementById("neutrinoC").innerHTML = format(game.neutrinoCost, 0);
  }


  function updatePeCosts() {
    updateProtonCosts();
    updateElectronCosts();
  }

  function updateSubatomicCosts() {
    updatePeCosts();
    updateNeutrinoCosts();
    updateNeutronCosts();
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
      game.subatomicBoughtThisRun[1]++;
      game.totalMass += 0.0005858;
      updateElectronPower();
      game.electronCost *= game.electronCostMult;
      game.electronCost10 *= game.electronCostMult;
      game.electronCost100 *= game.electronCostMult;
      updateProtonCosts();
      document.getElementById("electronC").innerHTML = format(game.electronCost, 0);
      document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
      document.getElementById("electronD").innerHTML = game.electron;
      document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
      document.getElementById("electronRowBonusNext").innerHTML = periodicRows[subatomicRowBonus(game.electron)];
      document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
    }
  }
  
  function makeMaxElectrons()
  {
    let count = 0;
    if(game.energy / (1e9 * (game.electronCostMult - 1)) > game.electronCost) {
      count = logBuy(game.electronCost, game.electronCostMult, game.energy);
      game.energy -= game.electronCost / (1 - 1/game.electronCostMult) * Math.pow(game.electronCostMult, count - 1);
      game.electronCost *= Math.pow(game.electronCostMult, count);
    }
      else {
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
  }
    if(count >= 40 && !game.ach.id[26]) {
      game.ach.id[26] = true; 
      updateAchievementColors();
      checkAchievementCount()
    }
    game.electron += count;
    game.subatomicBoughtThisRun[1] += count;
    game.totalMass += count * 0.0005858;
    updateElectronPower();
    game.electronCost10 = game.electronCost * (1 - Math.pow(game.electronCostMult, 10)) / (1 - game.electronCostMult);
    game.electronCost100 = game.electronCost * (1 - Math.pow(game.electronCostMult, 100)) / (1 - game.electronCostMult);
    updateProtonCosts();
    document.getElementById("electronC").innerHTML = format(game.electronCost, 0);
    document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
    document.getElementById("electronD").innerHTML = game.electron;
    document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
    document.getElementById("electronRowBonusNext").innerHTML = periodicRows[subatomicRowBonus(game.electron)];
    document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
  }
  
  
  function makeNeutrino()
  {
    if(game.energy >= Math.ceil(game.neutrinoCost))
    {
      game.energy -= Math.ceil(game.neutrinoCost);
      game.neutrino++;
      game.subatomicBoughtThisRun[2]++;
      updateNeutrinoPower();
      updatePePower();
      game.neutrinoCost *= game.neutrinoCostMult;
      game.neutrinoCost10 *= game.neutrinoCostMult;
      game.neutrinoCost100 *= game.neutrinoCostMult;
      document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
      document.getElementById("neutrinoC").innerHTML = format(game.neutrinoCost, 0);
      document.getElementById("neutrinoD").innerHTML = game.neutrino;
      document.getElementById("neutrinoP0").innerHTML = Math.round(1 + game.neutrino);
      document.getElementById("neutrinoP").innerHTML = format(game.neutrinoPower, 1);
      document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
      document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
      document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
      document.getElementById("energyS").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
    }
  }
  
  function makeMaxNeutrinos()
  {
    let count = 0;
    if(game.energy / (1e9 * (game.electronCostMult - 1)) > game.electronCost) {
      count = logBuy(game.neutrinoCost, game.neutrinoCostMult, game.energy);
      game.energy -= game.neutrinoCost / (1 - 1/game.neutrinoCostMult) * Math.pow(game.neutrinoCostMult, count - 1);
      game.neutrinoCost *= Math.pow(game.neutrinoCostMult, count);
    }
      else {
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
  }
    if(count >= 40 && !game.ach.id[26]) {
      game.ach.id[26] = true; 
      updateAchievementColors();
      checkAchievementCount()
    }
    game.neutrino += count;
    game.subatomicBoughtThisRun[2] += count;
    updateNeutrinoPower();
    updatePePower();
    game.neutrinoCost10 = game.neutrinoCost * (1 - Math.pow(game.neutrinoCostMult, 10)) / (1 - game.neutrinoCostMult);
    game.neutrinoCost100 = game.neutrinoCost * (1 - Math.pow(game.neutrinoCostMult, 100)) / (1 - game.neutrinoCostMult);
    document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
    document.getElementById("neutrinoC").innerHTML = format(game.neutrinoCost, 0);
    document.getElementById("neutrinoD").innerHTML = game.neutrino;
    document.getElementById("neutrinoP0").innerHTML = Math.round(1 + game.neutrino);
    document.getElementById("neutrinoP").innerHTML = format(game.neutrinoPower, 1);
    document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
    document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
    document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
    document.getElementById("energyS").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
  }



  function makeNeutron() {
    if(game.energy >= game.neutronCost && game.proton >= 1 && game.electron >= 1 && game.neutrino >= 1) {
      game.neutron++;
      game.subatomicBoughtThisRun[3]++;
      game.neutronPower = game.neutron;
      game.energy -= game.neutronCost;
      game.proton--;
      game.electron--;
      game.neutrino--;
      game.neutronCost *= game.neutronCostMult;
      game.neutronCost10 *= game.neutronCostMult;
      game.neutronCost100 *= game.neutronCostMult;
      updatePeCosts();
      updateMass();
      updatePennPower();
      document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
      document.getElementById("protonD").innerHTML = game.proton;
      document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
      document.getElementById("energyS").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
      document.getElementById("protonRowBonusNext").innerHTML = periodicRows[subatomicRowBonus(game.proton)];
      document.getElementById("neutronD").innerHTML = game.neutron;
      document.getElementById("neutronP0").innerHTML = format(1 + game.neutron/2, 1);
      document.getElementById("neutronP").innerHTML = format(game.neutronPower, 2);
      document.getElementById("neutronC").innerHTML = format(game.neutronCost, 0);
      document.getElementById("electronD").innerHTML = game.electron;
      document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
      document.getElementById("electronRowBonusNext").innerHTML = periodicRows[subatomicRowBonus(game.electron)];
      document.getElementById("neutrinoD").innerHTML = game.neutrino;
      document.getElementById("neutrinoP0").innerHTML = Math.round(1 + game.neutrino);
      document.getElementById("neutrinoP").innerHTML = format(game.neutrinoPower, 1);
      document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
    }
  }
  
  function makeMaxNeutrons() {
    let count = 0;
    if(game.energy / (1e9 * (game.neutronCostMult - 1)) > game.neutronCost) {
      count = Math.min(game.proton, game.electron, game.neutrino, logBuy(game.neutronCost, game.neutronCostMult, game.energy));
      game.energy -= game.neutronCost / (1 - 1/game.neutronCostMult) * Math.pow(game.neutronCostMult, count - 1);
      game.neutronCost *= Math.pow(game.neutronCostMult, count);
      game.proton -= count;
      game.electron -= count;
      game.neutrino -= count;
    }
    else {
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
        }
        else {
          game.energy -= game.neutronCost;
          game.neutronCost *= game.neutronCostMult;
          count++;
          game.proton--;
          game.electron--;
          game.neutrino--;
        }
      }
    }
    if(count >= 40 && !game.ach.id[26]) {
      game.ach.id[26] = true; 
      updateAchievementColors();
      checkAchievementCount()
    }
    game.neutron += count;
    game.subatomicBoughtThisRun[3] += count;
    game.neutronPower = game.neutron;
    updateMass();
    updatePennPower();
    game.neutronCost10 = game.neutronCost * (1 - Math.pow(game.neutronCostMult, 10)) / (1 - game.neutronCostMult);
    game.neutronCost100 = game.neutronCost * (1 - Math.pow(game.neutronCostMult, 100)) / (1 - game.neutronCostMult);
    updatePeCosts();
    document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
    document.getElementById("protonD").innerHTML = game.proton;
    document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
    document.getElementById("energyS").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
    document.getElementById("protonRowBonusNext").innerHTML = periodicRows[subatomicRowBonus(game.proton)];
    document.getElementById("neutronD").innerHTML = game.neutron;
    document.getElementById("neutronP0").innerHTML = format(1 + game.neutron/2, 1);
    document.getElementById("neutronP").innerHTML = format(game.neutronPower, 2);
    document.getElementById("neutronC").innerHTML = format(game.neutronCost, 0);
    document.getElementById("electronD").innerHTML = game.electron;
    document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
    document.getElementById("electronRowBonusNext").innerHTML = periodicRows[subatomicRowBonus(game.electron)];
    document.getElementById("neutrinoD").innerHTML = game.neutrino;
    document.getElementById("neutrinoP0").innerHTML = Math.round(1 + game.neutrino);
    document.getElementById("neutrinoP").innerHTML = format(game.neutrinoPower, 1);
    document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
  }
  
  
  
  
  
  
  function updateHPower() {
    let protiumExponentBoost = 0; //Helium will affect this later
    let deuteriumExponentBoost = 0; //ditto
    if(game.nu.id[2]) {
      protiumExponentBoost += Math.log10(1 + game.deu) / 100;
      deuteriumExponentBoost += Math.log10(1 + game.H) / 100;
    }
    HEffectExponent[0] = 0.5 + protiumExponentBoost;
    HEffectExponent[1] = 0.5 + deuteriumExponentBoost;
    game.Hpower = Math.pow(game.H + 1, HEffectExponent[0]) * Math.pow(game.deu + 1, HEffectExponent[1]);
    document.getElementById("HpP").innerHTML = format(game.Hpower, 2);
    document.getElementById("H1EffectExponentD").innerHTML = format(HEffectExponent[0], 4);
    document.getElementById("H2EffectExponentD").innerHTML = format(HEffectExponent[1], 4);
  }


  
  function p1(mass) //not the McLaren P1, this is a :ripaarex:
  {
    if(Date.now() - lastResetTime <= 4000 && Math.min(game.proton, game.electron) >= 1 && !game.ach.id[14]) {
      game.ach.id[14] = true; 
      updateAchievementColors();
      checkAchievementCount();
    }
    if(Date.now() - lastResetTime <= 5000 && Math.min(game.proton, game.electron, game.neutron) >= 1 && !game.ach.id[31]) {
      game.ach.id[31] = true; 
      updateAchievementColors();
      checkAchievementCount();
    }
    lastResetTime = Date.now();
    game.subatomicBoughtThisRun = [0,0,0,0];
    let amount = 0;

    if(mass == 1) {
      amount = Math.min(game.proton, game.electron);
      game.H += amount;
      document.getElementById("H1D").innerHTML = game.H;
      document.getElementById("H1P").innerHTML = format(Math.pow(game.H + 1, HEffectExponent[0]), 2);
      }
    else if(mass == 2) {
      amount = Math.min(game.proton, game.neutron, game.electron);
      game.deu += amount;
      document.getElementById("H2D").innerHTML = game.deu;
      document.getElementById("H2P").innerHTML = format(Math.pow(game.deu + 1, HEffectExponent[1]), 2);
    }

    game.totalHydrogen += amount;
    setTimeout(function() {
      game.totalHydrogen60secondsAgo += amount;
    }, 60000)
    if(game.totalHydrogen - game.totalHydrogen60secondsAgo >= 1000 && !game.ach.id[36]) {
      game.ach.id[36] = true; 
      updateAchievementColors();
      checkAchievementCount();
    }

    updateHPower();
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
    game.neutronPower = 1;
    game.neutronCost = 1e6;
    game.neutronCost10 = 1e6 * (1 - Math.pow(1.5, 10)) / (1 - 1.5);
    game.neutronCost100 = 1e6 * (1 - Math.pow(1.5, 100)) / (1 - 1.5);
    updateMass();
    document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
    document.getElementById("protonD").innerHTML = game.proton;
    document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
    document.getElementById("energyS").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
    document.getElementById("protonC").innerHTML = format(game.protonCost, 0);
    document.getElementById("protonRowBonusNext").innerHTML = periodicRows[subatomicRowBonus(game.proton)];
    document.getElementById("neutronC").innerHTML = format(game.neutronCost, 0);
    document.getElementById("neutronD").innerHTML = game.neutron;
    document.getElementById("neutronP0").innerHTML = format(1 + game.neutron/2, 1);
    document.getElementById("neutronP").innerHTML = format(game.neutronPower, 2);
    document.getElementById("electronD").innerHTML = game.electron;
    document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
    document.getElementById("electronC").innerHTML = format(game.electronCost, 0);
    document.getElementById("electronRowBonusNext").innerHTML = periodicRows[subatomicRowBonus(game.electron)];
    document.getElementById("neutrinoC").innerHTML = format(game.neutrinoCost, 0);
    document.getElementById("neutrinoD").innerHTML = game.neutrino;
    document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
    if(game.nu.id[3])
        document.getElementById("neutronDecayEnD").innerHTML = format(game.neutronDecayEnergy + game.neutronInitCost / 2 * Math.pow(game.neutronCostMult, game.subatomicBoughtThisRun[3] - game.neutron), 0);
    else
        document.getElementById("neutronDecayEnD").innerHTML = format(game.neutronDecayEnergy, 0);
  }
  
  
  
  
  
  setInterval(function() {
    neutronDecay();
  }, 33.333333333333)
  
  
  
  setInterval(function()
             {
    //if(!(game.totalEnergy > 0)) {hardReset();}
    checkForAchievements();
    advanceUnlockStage();
    hideAndShow();
  }, 1000)
  
  
  
  function advanceUnlockStage() {
    switch(game.unlockStage) {
      case 0:
        if(game.H > 1)
          game.unlockStage++;
        break;
    }
  }
  
  
  function hideAndShow() {
    document.getElementById('unlock1').style.visibility = "hidden";
        document.getElementById('unlock3').style.visibility = "hidden";
        document.getElementById('tab1a').style.visibility = "hidden";
        document.getElementById('tab1b').style.visibility = "hidden";
        document.getElementById('tab1c').style.visibility = "hidden";
        document.getElementById('tab1d').style.visibility = "hidden";
        document.getElementById('neutrinoGasBonusText').style.display = "none";
        document.getElementById('H2square').style.visibility = "hidden";
        document.getElementById('upgradeTable1').style.visibility = "hidden";
        document.getElementById('DhotkeyD').style.visibility = "hidden";
        document.getElementById('tab3main').style.display = "none";

        document.getElementById('ru1').style.visibility = "visible";
        document.getElementById('iu1').style.visibility = "visible";
        document.getElementById('gasC1U').style.display = "inline-block";

    switch(game.unlockStage) {
      case 4:
        document.getElementById('neutrinoGasBonusText').style.display = "inline-block";  
        document.getElementById('gasC1U').style.display = "none";
        document.getElementById('tab3main').style.display = "inline-block";

      case 3:
        document.getElementById('unlock3').style.visibility = "visible";
        document.getElementById('tab1d').style.visibility = "visible";
        document.getElementById('H2square').style.visibility = "visible";
        document.getElementById('upgradeTable1').style.visibility = "visible";
        document.getElementById('DhotkeyD').style.visibility = "visible";

      case 2:
        document.getElementById('tab1b').style.visibility = "visible";
        
      case 1:
        document.getElementById('unlock1').style.visibility = "visible";
        break;
    }

    if(game.unlockStage == 1)
      document.getElementById('tab1a').style.visibility = "visible";
    else if(game.unlockStage == 2)
      document.getElementById('tab1c').style.visibility = "visible";

    if(game.ru.id[5] == 0) 
      document.getElementById('protonRowBonusText').style.visibility = "hidden";
    else
      document.getElementById('protonRowBonusText').style.visibility = "visible";
    if(game.ru.id[6] == 0) 
      document.getElementById('electronRowBonusText').style.visibility = "hidden";
    else
      document.getElementById('electronRowBonusText').style.visibility = "visible";
  }
  
  
  
  
  
  
  window.addEventListener('keydown', function(event) {
    if(!game.hotkeys) return;
      switch(event.keyCode) {
      case 72: // H
        p1(1);
        break;
      case 68: // D
        if(game.unlockStage < 3) break;
        p1(2);
        break;
    }
  });

  function toggleHotkeys() {
    game.hotkeys = !game.hotkeys;
    if(game.hotkeys) document.getElementById("hotkeyToggleD").innerHTML = "enabled";
    else document.getElementById("hotkeyToggleD").innerHTML = "disabled";
  }
  
  
  
  
  
  
  
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
    if(game.proton >= 118 && game.electron >= 118 && !game.ach.id[34]) {
      game.ach.id[34] = true; 
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
      checkAchievementCount();
    }
    if(game.energy >= 5e8 && game.neutrino == 0 && game.neutron == 0 && !game.ach.id[29]) {
      game.ach.id[29] = true; 
      updateAchievementColors();
      checkAchievementCount();
    }
    if(game.energy >= 1e8 && game.subatomicBoughtThisRun[0] == 0 && game.subatomicBoughtThisRun[1] == 0 && !game.ach.id[38]) {
      game.ach.id[38] = true; 
      updateAchievementColors();
      checkAchievementCount();
    }
    if(game.energy >= 5e10 && game.subatomicBoughtThisRun[2] == 0 && game.subatomicBoughtThisRun[3] == 0 && !game.ach.id[39]) {
      game.ach.id[39] = true; 
      updateAchievementColors();
      checkAchievementCount();
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
    if(game.totalEnergy >= 1e10 && !game.ach.id[30]) {
      game.ach.id[30] = true;
      updateAchievementColors();
      checkAchievementCount();
    }
    if(game.totalEnergy >= 1.331e11 && !game.ach.id[32]) {
      game.ach.id[32] = true;
      updateAchievementColors();
      checkAchievementCount();
    }
    if(game.totalEnergy >= 1e12 && !game.ach.id[35]) {
      game.ach.id[35] = true;
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
    if(game.neutrino >= 60 && !game.ach.id[37]) {
      game.ach.id[37] = true; 
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
    if(game.energy - energyLastSecond >= 2e10 && !game.ach.id[33]) {
      game.ach.id[33] = true; 
      updateAchievementColors();
      checkAchievementCount();
    }
    
    energyLastSecond = game.energy;
  }
  
  function checkAchievementCount() {
    let n = 0;
    let perAchBonus = 5;
    let rows = 0;
    let rowCheck = 0;
    for(let i = 0; i < game.ach.num; i++) {
      if(game.ach.id[i]) {
        n++;
        rowCheck++;
      }
      if(game.nu.id[0] && i % 10 == 9) {
        if(rowCheck == 10) {
          rows++;
        }
        rowCheck = 0;
      }
    }
    perAchBonus = 5 + rows;
    game.ach.get = n;
    game.ach.power = Math.pow(1 + perAchBonus / 100, n);
    document.getElementById("perAchBonus").innerHTML = format(perAchBonus, 0);
    document.getElementById("achBonusD").innerHTML = format(game.ach.power, 2);
    document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
    document.getElementById("energyS").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
    document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
    document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
  }

  function giveAllAchievements() {
    for(let i = 0; i < game.ach.id.length; i++) {
      game.ach.id[i] = true;
    }
    checkAchievementCount();
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
    updateHPower();
    updateSubatomicCosts();
    checkAchievementCount();
    updateMass();
    updatePennPower();
    hideAndShow();
    document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
    document.getElementById("totalEnergyD").innerHTML = format(game.totalEnergy, 0);
    document.getElementById("totalEnergyPerspective").innerHTML = format(game.totalEnergy * 7.5153825e-12, 3);
    document.getElementById("protonD").innerHTML = game.proton;
    document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
    document.getElementById("energyS").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
    document.getElementById("protonC").innerHTML = format(game.protonCost, 0);
    document.getElementById("protonRowBonusEffectiveness").innerHTML = format(1 + game.ru.id[5] / 10, 1);
    document.getElementById("protonRowBonusNext").innerHTML = periodicRows[subatomicRowBonus(game.proton)];
    document.getElementById("neutronD").innerHTML = game.neutron;
    document.getElementById("neutronP0").innerHTML = format(1 + game.neutron/2, 1);
    document.getElementById("neutronP").innerHTML = format(game.neutronPower, 2);
    document.getElementById("neutronC").innerHTML = format(game.neutronCost, 0);
    document.getElementById("neutronGasBonusD").innerHTML = format(game.neutronEffectExponent, 3);
    document.getElementById("neutronDecayEnD").innerHTML = format(game.neutronDecayEnergy, 0);
    document.getElementById("neutronHLD").innerHTML = formatTime(game.neutronHL);
    document.getElementById("neutronDecayPD").innerHTML = format(game.neutronDecayPChance * 100, 2);
    document.getElementById("neutronDecayElD").innerHTML = format(game.neutronDecayEChance * 100, 2);
    document.getElementById("neutronDecayND").innerHTML = format(game.neutronDecayNChance * 100, 2);
    document.getElementById("electronD").innerHTML = game.electron;
    document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
    document.getElementById("electronC").innerHTML = format(game.electronCost, 0);
    document.getElementById("electronRowBonusEffectiveness").innerHTML = format(1 + game.ru.id[6] / 10, 1);
    document.getElementById("electronRowBonusNext").innerHTML = periodicRows[subatomicRowBonus(game.electron)];
    document.getElementById("neutrinoC").innerHTML = format(game.neutrinoCost, 0);
    document.getElementById("neutrinoD").innerHTML = game.neutrino;
    document.getElementById("neutrinoP0").innerHTML = Math.round(1 + game.neutrino);
    document.getElementById("neutrinoP").innerHTML = format(game.neutrinoPower, 1);
    document.getElementById("neutrinoGasBonusD").innerHTML = format(game.neutrinoEffectExponent, 3);
    document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
    document.getElementById("ru1Level").innerHTML = game.ru.id[0];
    document.getElementById("ru1Cost").innerHTML = Math.round(ruBaseCost[0] * Math.pow(1.1, game.ru.id[0]));
    document.getElementById("ru2Level").innerHTML = game.ru.id[1];
    document.getElementById("ru2Cost").innerHTML = Math.round(ruBaseCost[1] * Math.pow(1.1, game.ru.id[1]));
    document.getElementById("ru3Level").innerHTML = game.ru.id[2];
    document.getElementById("ru3Cost").innerHTML = format(ruBaseCost[2] * Math.pow(1.6, game.ru.id[2]), 0);
    document.getElementById("ru4Level").innerHTML = game.ru.id[3];
    document.getElementById("ru4CostProtium").innerHTML = format(ruBaseCost[3][0] * Math.pow(1.25, game.ru.id[3]), 0);
    document.getElementById("ru4CostDeuterium").innerHTML = format(ruBaseCost[3][1] * Math.pow(1.25, game.ru.id[3]), 0);
    document.getElementById("ru4CostEnergy").innerHTML = format(ruBaseCost[3][2] * Math.pow(1.5, game.ru.id[3]), 0);
    document.getElementById("ru5Level").innerHTML = game.ru.id[4];
    document.getElementById("ru6Level").innerHTML = game.ru.id[5];
    document.getElementById("ru6CostProtium").innerHTML = format(ruBaseCost[5][0] * Math.pow(1.97, game.ru.id[5]), 0);
    document.getElementById("ru6CostEnergy").innerHTML = format(ruBaseCost[5][1] * Math.pow(32, game.ru.id[5]), 0);
    document.getElementById("ru7Level").innerHTML = game.ru.id[6];
    document.getElementById("ru7CostDeuterium").innerHTML = format(ruBaseCost[6][0] * Math.pow(2, game.ru.id[6]), 0);
    document.getElementById("ru7CostEnergy").innerHTML = format(ruBaseCost[6][1] * Math.pow(32, game.ru.id[6]), 0);
    document.getElementById("nu2EffectProton").innerHTML = format(Math.pow(2, Math.pow(game.electron, 1/3)), 2);
    document.getElementById("nu2EffectElectron").innerHTML = format(Math.pow(2, Math.pow(game.proton, 1/3)), 2);
    document.getElementById("nu3EffectProtium").innerHTML = format(Math.log10(1 + game.deu) / 100, 4);
    document.getElementById("nu3EffectDeuterium").innerHTML = format(Math.log10(1 + game.H) / 100, 4);
    document.getElementById("H1D").innerHTML = game.H;
    document.getElementById("H1P").innerHTML = format(Math.pow(game.H + 1, HEffectExponent[0]), 2);
    document.getElementById("H2D").innerHTML = game.deu;
    document.getElementById("H2P").innerHTML = format(Math.pow(game.deu + 1, HEffectExponent[1]), 2);
    document.getElementById("c1PD").innerHTML = format(game.c1.p, 2);
    document.getElementById("c1TD").innerHTML = format(game.c1.t, 2);
    document.getElementById("c1VD").innerHTML = format(game.c1.v, 2);
    document.getElementById("Btab3." + game.tab3).className = "mBtab3";
    document.getElementById("sigFigD").innerHTML = game.sigFigs;
    document.getElementById("minPowerForSciD").innerHTML = game.minPowerForSci;
    document.getElementById("minPowerForSciD2").innerHTML = game.minPowerForSci;
    if(game.hotkeys) document.getElementById("hotkeyToggleD").innerHTML = "enabled";
    else document.getElementById("hotkeyToggleD").innerHTML = "disabled";
    if(game.nu.id[3])
        document.getElementById("neutronDecayEnD").innerHTML = format(game.neutronDecayEnergy + game.neutronInitCost / 2 * Math.pow(game.neutronCostMult, game.subatomicBoughtThisRun[3] - game.neutron), 0);
    else
        document.getElementById("neutronDecayEnD").innerHTML = format(game.neutronDecayEnergy, 0);
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
    if(!game.protonCost10) game.protonCost10 = 20 * (1 - Math.pow(game.protonCostMult, 10)) / (1 - game.protonCostMult);
    if(!game.protonCost100) game.protonCost100 = 20 * (1 - Math.pow(game.protonCostMult, 100)) / (1 - game.protonCostMult);
    if(!game.neutron) game.neutron = 0;
    if(!game.neutronPower) game.neutronPower = 1;
    if(!game.neutronHL) game.neutronHL = 600;
    if(!game.neutronDecayEnergy) game.neutronDecayEnergy = 5e6;
    if(!game.neutronDecayPChance) game.neutronDecayPChance = 0.1;
    if(!game.neutronDecayEChance) game.neutronDecayEChance = 0.1;
    if(!game.neutronDecayNChance) game.neutronDecayNChance = 0.25;
    if(!game.neutronInitCost) game.neutronInitCost = 1e6;
    if(!game.neutronCostMult) game.neutronCostMult = 1.5;
    if(!game.neutronCost) game.neutronCost = 1e6;
    if(!game.neutronCost10) game.neutronCost10 = 1e6 * (1 - Math.pow(game.neutronCostMult, 10)) / (1 - game.neutronCostMult);
    if(!game.neutronCost100) game.neutronCost100 = 1e6 * (1 - Math.pow(game.neutronCostMult, 100)) / (1 - game.neutronCostMult);
    if(!game.neutronEffectExponent) game.neutronEffectExponent = 2;
    if(!game.electron) game.electron = 0;
    if(!game.electronPower) game.electronPower = 0;
    if(!game.electronInitCost) game.electronInitCost = 50;
    if(!game.electronCostMult) game.electronCostMult = 1.33;
    if(!game.electronCost) game.electronCost = 50;
    if(!game.electronCost10) game.electronCost10 = 50 * (1 - Math.pow(game.electronCostMult, 10)) / (1 - game.electronCostMult);
    if(!game.electronCost100) game.electronCost100 = 50 * (1 - Math.pow(game.electronCostMult, 100)) / (1 - game.electronCostMult);
    if(!game.neutrino) game.neutrino = 0;
    if(!game.neutrinoPower) game.neutrinoPower = 0;
    if(!game.neutrinoInitCost) game.neutrinoInitCost = 100000;
    if(!game.neutrinoCostMult) game.neutrinoCostMult = 2;
    if(!game.neutrinoCost) game.neutrinoCost = 100000;
    if(!game.neutrinoCost10) game.neutrinoCost10 = 100000 * (1 - Math.pow(game.neutrinoCostMult, 10)) / (1 - game.neutrinoCostMult);
    if(!game.neutrinoCost100) game.neutrinoCost100 = 100000 * (1 - Math.pow(game.neutrinoCostMult, 100)) / (1 - game.neutrinoCostMult);
    if(!game.neutrinoEffectExponent) game.neutrinoEffectExponent = 1;
    if(!game.H) game.H = 0;
    if(!game.deu) game.deu = 0;
    if(!game.tritium) game.tritium = 0;
    if(!game.totalHydrogen) game.totalHydrogen = 0;
    if(!game.totalHydrogen60secondsAgo) game.totalHydrogen60secondsAgo = 0;
    if(!game.He) game.He = 0;
    if(!game.Hpower) game.Hpower = 1;
    if(!game.clickPower) game.clickPower = 1;
    if(!game.clickStat) game.clickStat = 0;
    if(!game.protonSpeed) game.protonSpeed = 1000;
    
    if(!game.subatomicBoughtThisRun) {
      game.subatomicBoughtThisRun = new Array(4);
      p1(1);
      for(let i = 0; i < 4; i++) {
        game.subatomicBoughtThisRun[i] = 0;
      }
    }

    if(!game.iu) {
      game.iu = {
        num: 1,
        id: new Array(1)
      }
    }
    if(!game.iu.num || game.iu.num != 1) game.iu.num = 1;
    if(!game.iu.id) {
      game.iu.id = new Array(game.iu.num);
      for(let i = 0; i < game.iu.num; i++)
        game.iu.id[i] = 0;
    }
    if(game.iu.id.length != game.iu.num) {
      let a = game.iu.id;
      game.iu.id = new Array(game.iu.num);
      for(let i = 0; i < Math.min(a.length, game.iu.num); i++) 
        game.iu.id[i] = a[i];
    }
    for(let i = 0; i < game.iu.num; i++) {
      if(!game.iu.id[i])
        game.iu.id[i] = 0;
    }
    
    if(!game.ru) {
      game.ru = {
        num: 7,
        id: new Array(7)
      }
    }
    if(!game.ru.num || game.ru.num != 7) game.ru.num = 7;
    if(!game.ru.id) {
      game.ru.id = new Array(game.ru.num);
      for(let i = 0; i < game.ru.num; i++)
        game.ru.id[i] = 0;
    }
    if(game.ru.id.length != game.ru.num) {
      let a = game.ru.id;
      game.ru.id = new Array(game.ru.num);
      for(let i = 0; i < Math.min(a.length, game.ru.num); i++) 
        game.ru.id[i] = a[i];
    }
    for(let i = 0; i < game.ru.num; i++) {
      if(!game.ru.id[i])
        game.ru.id[i] = 0;
    }

    if(!game.nu) {
      game.nu = {
        num: 4,
        id: new Array(4)
      }
    }
    if(!game.nu.num || game.nu.num != 4) game.nu.num = 4;
    if(!game.nu.id) {
      game.nu.id = new Array(game.nu.num);
      for(let i = 0; i < game.nu.num; i++)
        game.nu.id[i] = false;
    }
    if(game.nu.id.length != game.nu.num) {
      let a = game.nu.id;
      game.nu.id = new Array(game.nu.num);
      for(let i = 0; i < Math.min(a.length, game.nu.num); i++) 
        game.nu.id[i] = a[i];
    }
    for(let i = 0; i < game.nu.num; i++) {
      if(!game.nu.id[i] || game.nu.id[i] == 0)
        game.nu.id[i] = false;
    }

    if(!game.totalMass) game.totalMass = 0;
    if(!game.tab3) game.tab3 = 0;
    if(!game.unlockStage) game.unlockStage = 0;
    if(!game.sigFigs) game.sigFigs = 4;
    if(!game.minPowerForSci) game.minPowerForSci = 6;
    if(game.hotkeys != true && game.hotkeys != false) game.hotkeys = true;

    if(!game.c1) {
      game.c1 = {
        gases: new Array(2),
        t: 0,
        p: 0,
        v: 1,
        it: 'p',
        ing: 0,
        inh: 0
      };
    }
    if(!game.c1.gases || game.c1.gases.length != 2) game.c1.gases = new Array(2);
    if(!game.c1.t) game.c1.t = 0;
    if(!game.c1.p) game.c1.p = 0;
    if(!game.c1.v) game.c1.v = 0;
    if(!game.c1.it) game.c1.it = 'p';
    if(!game.c1.inh) game.c1.inh = 0;
    if(!game.c1.ing) game.c1.ing = 0;

    if(!game.ach) {
      game.ach = {
        num: 40,
        get: 0,
        power: 1,
        id: new Array(40)
      }
    }
    if(!game.ach.num || game.ach.num != 40) game.ach.num = 40;
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




  function hardResetClick() {
    let confirmation = confirm("WARNING: BY CLICKING 'OK', YOU HARD RESET THE GAME. YOUR PREVIOUS SAVE DATA CANNOT BE RECOVERED. DO YOU WANT TO DO THIS??");
    if(confirmation) hardReset();
  }
  
  function hardReset() {
    clearInterval(game.protonInterval);
    
    game.energy = 0;
    game.totalEnergy = 0;
    game.proton = 0;
    game.protonPower = 0;
    game.protonInitCost = 20;
    game.protonCostMult = 4/3;
    game.protonCost = 20;
    game.protonCost10 = 20 * (1 - Math.pow(4/3, 10)) / (1 - 4/3);
    game.protonCost100 = 20 * (1 - Math.pow(4/3, 100)) / (1 - 4/3);
    game.neutron = 0;
    game.neutronPower = 1;
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
    game.neutronEffectExponent = 2;
    game.electron = 0;
    game.electronPower = 0;
    game.electronInitCost = 50;
    game.electronCostMult = 1.33;
    game.electronCost = 50;
    game.electronCost10 = 50 * (1 - Math.pow(1.33, 10)) / (1 - 1.33);
    game.electronCost100 = 50 * (1 - Math.pow(1.33, 100)) / (1 - 1.33);
    game.neutrino = 0;
    game.neutrinoPower = 1;
    game.neutrinoInitCost = 100000;
    game.neutrinoCostMult = 2;
    game.neutrinoCost = 100000;
    game.neutrinoCost10 = 100000 * (1 - Math.pow(2, 10)) / (1 - 2);
    game.neutrinoCost100 = 100000 * (1 - Math.pow(2, 100)) / (1 - 2);
    game.neutrinoEffectExponent = 1;
    game.H = 0;
    game.deu = 0;
    game.tritium = 0;
    game.Hpower = 1;
    game.clickPower = 1;
    game.clickStat = 0;
    game.protonSpeed = 1000;
    game.subatomicBoughtThisRun = [0,0,0,0];
    game.totalMass = 0;
    game.ru.num = 7;
    game.iu.num = 1;
    game.nu.num = 4;
    for(let i = 0; i < game.ru.num; i++)
      game.ru.id[i] = 0;
    game.iu.num = 1;
    for(let i = 0; i < game.iu.num; i++)
      game.iu.id[i] = 0;
    game.nu.num = 4;
    for(let i = 0; i < game.nu.num; i++)
      game.nu.id[i] = false;
    game.ach.num = 35;
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
      document.getElementById("tab3").style.display = "none";
      document.getElementById("tab3.0").style.display = "none";
      document.getElementById("tab3.1").style.display = "none";
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
    if(tab.startsWith("tab3.")) {
      document.getElementById("tab3").style.display = "inline-block";
      document.getElementById("Btab3." + game.tab3).className = "mBtab1";
      game.tab3 = parseInt(tab.slice(5));
      document.getElementById("Btab3." + game.tab3).className = "mBtab3";
    }
    if(tab == "tab3") document.getElementById("tab3." + game.tab3).style.display = "inline-block";
  }
