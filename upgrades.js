function iu1b()
  {
    switch(game.iu.id[0]) {
        case 0:
            if(game.H >= 100) {
              game.iu.id[0]++;
              game.H -= 100;
              game.protonSpeed = 500;
            }
            break;

        case 1:
            if(game.H >= 200 && game.energy >= 2.5e7) {
                game.iu.id[0]++;
                game.H -= 200;
                game.energy -= 2.5e7;
                game.protonSpeed = 250;
              }
              break;

        case 2:
            if(game.H >= 500 && game.energy >= 4e8) {
                game.iu.id[0]++;
                game.H -= 500;
                game.energy -= 4e8;
                game.protonSpeed = 500/3;
              }
              break;

        case 3:
            if(game.H >= 1000 && game.deu >= 100) {
                game.iu.id[0]++;
                game.H -= 1000;
                game.deu -= 100;
                game.protonSpeed = 100;
              }
              break;

        case 4:
            if(game.deu >= 250 && game.energy >= 1e11) {
              game.iu.id[0]++;
              game.deu -= 250;
              game.energy -= 1e11;
              game.protonSpeed = 50;
            }
            break;

        case 5:
            if(game.H >= 3000 && game.deu >= 500 && game.energy >= 1e14) {
              game.iu.id[0]++;
              game.H -= 3000;
              game.deu -= 500;
              game.energy -= 1e14;
              game.protonSpeed = 100/3;
            }
            break;
    }
    
    updateEverything();
    updateProtonSpeed();
  }
  




function ru1One() {
    if(Math.round(game.H) >= Math.round(ruBaseCost[0] * Math.pow(1.1, game.ru.id[0]))) {
        game.H = Math.round(game.H) - Math.round(ruBaseCost[0] * Math.pow(1.1, game.ru.id[0]));
        game.ru.id[0]++;
        game.protonCostMult = (game.protonCostMult - 1) * 0.99 + 1;
        updateHPower();
        updateMass();
        updateProtonCosts();
        updatePePower();
        document.getElementById("H1D").innerHTML = game.H;
        document.getElementById("H1P").innerHTML = format(Math.pow(game.H + 1, HEffectExponent[0]), 2);
        document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
        document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
        document.getElementById("energyS").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
        document.getElementById("protonC").innerHTML = format(game.protonCost, 0);
        document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
        document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
        document.getElementById("ru1Level").innerHTML = game.ru.id[0];
        document.getElementById("ru1Cost").innerHTML = Math.round(ruBaseCost[0] * Math.pow(1.1, game.ru.id[0]));
    }
}

function ru1Max() {
    let initCost = ruBaseCost[0] * Math.pow(1.1, game.ru.id[0]);
    let currentCost = initCost;
    let count = 0;
    if(game.H / (1e8) > initCost) {
        count = logBuy(initCost, 1.1, game.H);
        game.H -= initCost / (1 - 1/1.1) * Math.pow(1.1, count - 1);
    }
    else {
        while(game.H >= currentCost) {
            game.H = Math.round(game.H) - Math.round(currentCost);
            currentCost *= 1.1;
            count++;
        }
    }
    game.ru.id[0] += count;
    game.protonCostMult = (game.protonCostMult - 1) * Math.pow(0.99, count) + 1;
    updateHPower();
    updateMass();
    updateProtonCosts();
    updatePePower();
    document.getElementById("H1D").innerHTML = game.H;
    document.getElementById("H1P").innerHTML = format(Math.pow(game.H + 1, HEffectExponent[0]), 2);
    document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
    document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
    document.getElementById("energyS").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
    document.getElementById("protonC").innerHTML = format(game.protonCost, 0);
    document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
    document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
    document.getElementById("ru1Level").innerHTML = game.ru.id[0];
    document.getElementById("ru1Cost").innerHTML = Math.round(ruBaseCost[0] * Math.pow(1.1, game.ru.id[0]));
}


function ru2One() {
    if(Math.round(game.deu) >= Math.round(ruBaseCost[1] * Math.pow(1.1, game.ru.id[1]))) {
        game.deu = Math.round(game.deu) - Math.round(ruBaseCost[1] * Math.pow(1.1, game.ru.id[1]));
        game.ru.id[1]++;
        game.electronCostMult = (game.electronCostMult - 1) * 0.99 + 1;
        updateHPower();
        updateMass();
        updateElectronCosts();
        updatePePower();
        document.getElementById("H2D").innerHTML = game.deu;
        document.getElementById("H2P").innerHTML = format(Math.pow(game.deu + 1, HEffectExponent[1]), 2);
        document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
        document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
        document.getElementById("energyS").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
        document.getElementById("electronC").innerHTML = format(game.electronCost, 0);
        document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
        document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
        document.getElementById("ru2Level").innerHTML = game.ru.id[1];
        document.getElementById("ru2Cost").innerHTML = Math.round(ruBaseCost[1] * Math.pow(1.1, game.ru.id[1]));
    }
}

function ru2Max() {
    let initCost = ruBaseCost[1] * Math.pow(1.1, game.ru.id[1]);
    let currentCost = initCost;
    let count = 0;
    if(game.H / (1e8) > initCost) {
        count = logBuy(initCost, 1.1, game.deu);
        game.deu -= initCost / (1 - 1/1.1) * Math.pow(1.1, count - 1);
    }
    else {
        while(game.deu >= currentCost) {
            game.deu = Math.round(game.deu) - Math.round(currentCost);
            currentCost *= 1.1;
            count++;
        }
    }
    game.ru.id[1] += count;
    game.electronCostMult = (game.electronCostMult - 1) * Math.pow(0.99, count) + 1;
    updateHPower();
    updateMass();
    updateElectronCosts();
    updatePePower();
    document.getElementById("H2D").innerHTML = game.deu;
        document.getElementById("H2P").innerHTML = format(Math.pow(game.deu + 1, HEffectExponent[1]), 2);
        document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
        document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
        document.getElementById("energyS").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
        document.getElementById("electronC").innerHTML = format(game.electronCost, 0);
        document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
        document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
        document.getElementById("ru2Level").innerHTML = game.ru.id[1];
        document.getElementById("ru2Cost").innerHTML = Math.round(ruBaseCost[1] * Math.pow(1.1, game.ru.id[1]));
}


function ru3One() {
    if(Math.round(game.energy) >= Math.round(ruBaseCost[2] * Math.pow(1.6, game.ru.id[2]))) {
        game.energy = Math.round(game.energy) - Math.round(ruBaseCost[2] * Math.pow(1.6, game.ru.id[2]));
        game.ru.id[2]++;
        game.neutrinoCostMult = (game.neutrinoCostMult - 1) * 0.98 + 1;
        updateNeutrinoCosts();
        document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
        document.getElementById("neutrinoC").innerHTML = format(game.neutrinoCost, 0);
        document.getElementById("ru3Level").innerHTML = game.ru.id[2];
        document.getElementById("ru3Cost").innerHTML = format(ruBaseCost[2] * Math.pow(1.6, game.ru.id[2]), 0);
    }
}

function ru3Max() {
    let initCost = ruBaseCost[2] * Math.pow(1.6, game.ru.id[2]);
    let currentCost = initCost;
    let count = 0;
    if(game.energy / (1e9) > initCost) {
        count = logBuy(initCost, 1.6, game.energy);
        game.energy -= initCost / (1 - 1/1.6) * Math.pow(1.6, count - 1);
    }
    else {
        while(game.energy >= currentCost) {
            game.energy = Math.round(game.energy) - Math.round(currentCost);
            currentCost *= 1.6;
            count++;
        }
    }
    game.ru.id[2] += count;
    game.neutrinoCostMult = (game.neutrinoCostMult - 1) * Math.pow(0.98, count) + 1;
    updateNeutrinoCosts();
    document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
    document.getElementById("neutrinoC").innerHTML = format(game.neutrinoCost, 0);
    document.getElementById("ru3Level").innerHTML = game.ru.id[2];
    document.getElementById("ru3Cost").innerHTML = format(ruBaseCost[2] * Math.pow(1.6, game.ru.id[2]), 0);
}


function ru4One() {
    if((Math.round(game.H) >= Math.round(ruBaseCost[3][0] * Math.pow(1.25, game.ru.id[3]))) && 
       (Math.round(game.deu) >= Math.round(ruBaseCost[3][1] * Math.pow(1.25, game.ru.id[3]))) && 
       (Math.round(game.energy) >= Math.round(ruBaseCost[3][2] * Math.pow(1.5, game.ru.id[3])))) 
    {
        game.H = Math.round(game.H) - Math.round(ruBaseCost[3][0] * Math.pow(1.25, game.ru.id[3]));
        game.deu = Math.round(game.deu) - Math.round(ruBaseCost[3][1] * Math.pow(1.25, game.ru.id[3]));
        game.energy = Math.round(game.energy) - Math.round(ruBaseCost[3][2] * Math.pow(1.5, game.ru.id[3]));
        game.ru.id[3]++;
        game.neutronCostMult = (game.neutronCostMult - 1) * 0.98 + 1;
        updateHPower();
        updateNeutronCosts();
        updateMass();
        updatePePower();
        document.getElementById("H1D").innerHTML = game.H;
        document.getElementById("H1P").innerHTML = format(Math.pow(game.H + 1, HEffectExponent[0]), 2);
        document.getElementById("H2D").innerHTML = game.deu;
        document.getElementById("H2P").innerHTML = format(Math.pow(game.deu + 1, HEffectExponent[1]), 2);
        document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
        document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
        document.getElementById("energyS").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
        document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
        document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
        document.getElementById("neutronC").innerHTML = format(game.neutronCost, 0);
        document.getElementById("ru4Level").innerHTML = game.ru.id[3];
        document.getElementById("ru4CostProtium").innerHTML = format(ruBaseCost[3][0] * Math.pow(1.25, game.ru.id[3]), 0);
        document.getElementById("ru4CostDeuterium").innerHTML = format(ruBaseCost[3][1] * Math.pow(1.25, game.ru.id[3]), 0);
        document.getElementById("ru4CostEnergy").innerHTML = format(ruBaseCost[3][2] * Math.pow(1.5, game.ru.id[3]), 0);
    }
}

function ru4Max() {
    let initCostProtium = ruBaseCost[3][0] * Math.pow(1.25, game.ru.id[3]);
    let initCostDeuterium = ruBaseCost[3][1] * Math.pow(1.25, game.ru.id[3]);
    let initCostEnergy = ruBaseCost[3][2] * Math.pow(1.5, game.ru.id[3]);
    let currentCostProtium = initCostProtium;
    let currentCostDeuterium = initCostDeuterium;
    let currentCostEnergy = initCostEnergy;
    let count = 0;
    if((game.H / (1e9) > initCostProtium) && (game.deu / (1e9) > initCostDeuterium) && (game.energy / (1e9) > initCostEnergy)) {
        count = Math.min(logBuy(initCostProtium, 1.25, game.H), logBuy(initCostDeuterium, 1.25, game.deu), logBuy(initCostEnergy, 1.5, game.energy));
        game.H -= initCost / (1 - 1/1.25) * Math.pow(1.25, count - 1);
        game.deu -= initCost / (1 - 1/1.25) * Math.pow(1.25, count - 1);
        game.energy -= initCost / (1 - 1/1.5) * Math.pow(1.5, count - 1);
    }
    else {
        while((Math.round(game.H) >= Math.round(currentCostProtium)) && (Math.round(game.deu) >= Math.round(currentCostDeuterium)) && (game.energy >= currentCostEnergy)) {
            game.H = Math.round(game.H) - Math.round(currentCostProtium);
            game.deu = Math.round(game.deu) - Math.round(currentCostDeuterium);
            game.energy = Math.round(game.energy) - Math.round(currentCostEnergy);
            currentCostProtium *= 1.25;
            currentCostDeuterium *= 1.25;
            currentCostEnergy *= 1.5;
            count++;
        }
    }
    game.ru.id[3] += count;
    game.neutronCostMult = (game.neutronCostMult - 1) * Math.pow(0.98, count) + 1;
    updateHPower();
    updateNeutronCosts();
    updateMass();
    updatePePower();
    document.getElementById("H1D").innerHTML = game.H;
    document.getElementById("H1P").innerHTML = format(Math.pow(game.H + 1, HEffectExponent[0]), 2);
    document.getElementById("H2D").innerHTML = game.deu;
    document.getElementById("H2P").innerHTML = format(Math.pow(game.deu + 1, HEffectExponent[1]), 2);
    document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
    document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
    document.getElementById("energyS").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
    document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
    document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
    document.getElementById("neutronC").innerHTML = format(game.neutronCost, 0);
    document.getElementById("ru4Level").innerHTML = game.ru.id[3];
    document.getElementById("ru4CostProtium").innerHTML = format(ruBaseCost[3][0] * Math.pow(1.25, game.ru.id[3]), 0);
    document.getElementById("ru4CostDeuterium").innerHTML = format(ruBaseCost[3][1] * Math.pow(1.25, game.ru.id[3]), 0);
    document.getElementById("ru4CostEnergy").innerHTML = format(ruBaseCost[3][2] * Math.pow(1.5, game.ru.id[3]), 0);
}


function ru5One() {
    if((game.H >= ruBaseCost[4][0] * Math.pow(4, game.ru.id[4])) && 
       (game.deu >= ruBaseCost[4][1] * Math.pow(4, game.ru.id[4])) && 
       (game.energy >= ruBaseCost[4][2] * Math.pow(25, game.ru.id[4])) &&
       (game.ru.id[4] < 3)) {
        game.H -= ruBaseCost[4][0] * Math.pow(4, game.ru.id[4]);
        game.deu -= ruBaseCost[4][1] * Math.pow(4, game.ru.id[4]);
        game.energy -= ruBaseCost[4][2] * Math.pow(25, game.ru.id[4]);
        game.ru.id[4]++;
        updateEverything();
    }
}


function ru6One() {
    if((Math.round(game.H) >= Math.round(ruBaseCost[5][0] * Math.pow(1.97, game.ru.id[5])))
    && (game.energy >= ruBaseCost[5][1] * Math.pow(32, game.ru.id[5]))) {
        game.H = Math.round(game.H) - Math.round(ruBaseCost[5][0] * Math.pow(1.97, game.ru.id[5]));
        game.energy -= ruBaseCost[5][1] * Math.pow(32, game.ru.id[5]);
        game.ru.id[5]++;
        updateHPower();
        updatePePower();
        document.getElementById("protonRowBonusEffectiveness").innerHTML = format(1 + game.ru.id[5] / 10, 1);
        document.getElementById("H1D").innerHTML = game.H;
        document.getElementById("H1P").innerHTML = format(Math.pow(game.H + 1, HEffectExponent[0]), 2);
        document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
        document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
        document.getElementById("energyS").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
        document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
        document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
        document.getElementById("ru6Level").innerHTML = game.ru.id[5];
        document.getElementById("ru6CostProtium").innerHTML = format(ruBaseCost[5][0] * Math.pow(1.97, game.ru.id[5]), 0);
        document.getElementById("ru6CostEnergy").innerHTML = format(ruBaseCost[5][1] * Math.pow(32, game.ru.id[5]), 0);
    }
}

function ru6Max() {
    let initCostProtium = ruBaseCost[5][0] * Math.pow(1.97, game.ru.id[5]);
    let initCostEnergy = ruBaseCost[5][1] * Math.pow(32, game.ru.id[5]);
    let currentCostProtium = initCostProtium;
    let currentCostEnergy = initCostEnergy;
    let count = 0;
    if((game.H / (1e9) > initCostProtium) && (game.energy / (1e9) > initCostEnergy)) {
        count = Math.min(logBuy(initCostProtium, 1.97, game.H), logBuy(initCostEnergy, 32, game.energy));
        game.H -= initCost / (1 - 1/1.97) * Math.pow(1.97, count - 1);
        game.energy -= initCost / (1 - 1/32) * Math.pow(32, count - 1);
    }
    else {
        while((Math.round(game.H) >= Math.round(currentCostProtium)) && (game.energy >= currentCostEnergy)) {
            game.H = Math.round(game.H) - Math.round(currentCostProtium);
            game.energy = Math.round(game.energy) - Math.round(currentCostEnergy);
            currentCostProtium *= 1.;
            currentCostEnergy *= 32;
            count++;
        }
    }
    game.ru.id[5] += count;
    updateHPower();
    updatePePower();
    document.getElementById("protonRowBonusEffectiveness").innerHTML = format(1 + game.ru.id[5] / 10, 1);
    document.getElementById("H1D").innerHTML = game.H;
    document.getElementById("H1P").innerHTML = format(Math.pow(game.H + 1, HEffectExponent[0]), 2);
    document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
    document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
    document.getElementById("energyS").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
    document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
    document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
    document.getElementById("ru6Level").innerHTML = game.ru.id[5];
    document.getElementById("ru6CostProtium").innerHTML = format(ruBaseCost[5][0] * Math.pow(1.97, game.ru.id[5]), 0);
    document.getElementById("ru6CostEnergy").innerHTML = format(ruBaseCost[5][1] * Math.pow(32, game.ru.id[5]), 0);
}


function ru7One() {
    if((Math.round(game.deu) >= Math.round(ruBaseCost[6][0] * Math.pow(2, game.ru.id[6])))
    && (game.energy >= ruBaseCost[6][1] * Math.pow(32, game.ru.id[6]))) {
        game.deu = Math.round(game.deu) - Math.round(ruBaseCost[6][0] * Math.pow(2, game.ru.id[6]));
        game.energy -= ruBaseCost[6][1] * Math.pow(32, game.ru.id[6]);
        game.ru.id[6]++;
        updateHPower();
        updatePePower();
        document.getElementById("electronRowBonusEffectiveness").innerHTML = format(1 + game.ru.id[6] / 10, 1);
        document.getElementById("H2D").innerHTML = game.deu;
        document.getElementById("H2P").innerHTML = format(Math.pow(game.deu + 1, HEffectExponent[1]), 2);
        document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
        document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
        document.getElementById("energyS").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
        document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
        document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
        document.getElementById("ru7Level").innerHTML = game.ru.id[6];
        document.getElementById("ru7CostDeuterium").innerHTML = format(ruBaseCost[6][0] * Math.pow(2, game.ru.id[6]), 0);
        document.getElementById("ru7CostEnergy").innerHTML = format(ruBaseCost[6][1] * Math.pow(32, game.ru.id[6]), 0);
    }
}

function ru7Max() {
    let initCostDeuterium = ruBaseCost[6][0] * Math.pow(2, game.ru.id[6]);
    let initCostEnergy = ruBaseCost[6][1] * Math.pow(32, game.ru.id[6]);
    let currentCostDeuterium = initCostDeuterium;
    let currentCostEnergy = initCostEnergy;
    let count = 0;
    if((game.deu / (1e9) > initCostDeuterium) && (game.energy / (1e9) > initCostEnergy)) {
        count = Math.min(logBuy(initCostDeuterium, 2, game.deu), logBuy(initCostEnergy, 32, game.energy));
        game.deu -= initCost / (1 - 1/2) * Math.pow(2, count - 1);
        game.energy -= initCost / (1 - 1/32) * Math.pow(32, count - 1);
    }
    else {
        while((Math.round(game.deu) >= Math.round(currentCostDeuterium)) && (game.energy >= currentCostEnergy)) {
            game.deu = Math.round(game.deu) - Math.round(currentCostDeuterium);
            game.energy = Math.round(game.energy) - Math.round(currentCostEnergy);
            currentCostDeuterium *= 2;
            currentCostEnergy *= 32;
            count++;
        }
    }
    game.ru.id[6] += count;
    updateHPower();
    updatePePower();
    document.getElementById("electronRowBonusEffectiveness").innerHTML = format(1 + game.ru.id[6] / 10, 1);
    document.getElementById("H2D").innerHTML = game.deu;
    document.getElementById("H2P").innerHTML = format(Math.pow(game.deu + 1, HEffectExponent[1]), 2);
    document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
    document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
    document.getElementById("energyS").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
    document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
    document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
    document.getElementById("ru7Level").innerHTML = game.ru.id[6];
    document.getElementById("ru7CostDeuterium").innerHTML = format(ruBaseCost[6][0] * Math.pow(2, game.ru.id[6]), 0);
    document.getElementById("ru7CostEnergy").innerHTML = format(ruBaseCost[6][1] * Math.pow(32, game.ru.id[6]), 0);
}




function nu1Buy() {
    if(!game.nu.id[0] && game.energy >= 3e11) {
        game.energy -= 3e11;
        game.nu.id[0] = true;
        checkAchievementCount();
        document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
    }
}

function nu2Buy() {
    if(!game.nu.id[1] && game.energy >= 1e13 && game.H >= 750 && game.deu >= 50) {
        game.energy -= 1e13;
        game.H -= 750;
        game.deu -= 50;
        game.nu.id[1] = true;
        updatePeCosts();
        updateHPower();
        updatePePower();
        document.getElementById("H1D").innerHTML = game.H;
        document.getElementById("H1P").innerHTML = format(Math.pow(game.H + 1, HEffectExponent[0]), 2);
        document.getElementById("H2D").innerHTML = game.deu;
        document.getElementById("H2P").innerHTML = format(Math.pow(game.deu + 1, HEffectExponent[1]), 2);
        document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
        document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
        document.getElementById("energyS").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
        document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
        document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
    }
}

function nu3Buy() {
    if(!game.nu.id[2] && game.energy >= 1e15 && game.H >= 250 && game.deu >= 250) {
        game.energy -= 1e15;
        game.H -= 250;
        game.deu -= 250;
        game.nu.id[2] = true;
        updateHPower();
        updatePePower();
        document.getElementById("H1D").innerHTML = game.H;
        document.getElementById("H1P").innerHTML = format(Math.pow(game.H + 1, HEffectExponent[0]), 2);
        document.getElementById("H2D").innerHTML = game.deu;
        document.getElementById("H2P").innerHTML = format(Math.pow(game.deu + 1, HEffectExponent[1]), 2);
        document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
        document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
        document.getElementById("energyS").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
        document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
        document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
    }
}

function nu4Buy() {
    if(!game.nu.id[3] && game.H >= 5000 && game.deu >= 1000) {
        game.H -= 5000;
        game.deu -= 1000;
        game.nu.id[3] = true;
        updateHPower();
        updatePePower();
        document.getElementById("H1D").innerHTML = game.H;
        document.getElementById("H1P").innerHTML = format(Math.pow(game.H + 1, HEffectExponent[0]), 2);
        document.getElementById("H2D").innerHTML = game.deu;
        document.getElementById("H2P").innerHTML = format(Math.pow(game.deu + 1, HEffectExponent[1]), 2);
        document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
        document.getElementById("energyS").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
        document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
        document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
        document.getElementById("neutronDecayEnD").innerHTML = format(game.neutronDecayEnergy + game.neutronInitCost / 2 * Math.pow(game.neutronCostMult, game.subatomicBoughtThisRun[3] - game.neutron), 0);
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
      updateHPower();
      document.getElementById("H1D").innerHTML = game.H;
      document.getElementById("H1P").innerHTML = format(Math.pow(game.H + 1, HEffectExponent[0]), 2);
      document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
      document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
      document.getElementById("energyS").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
      document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
      hideAndShow();
    }
  }





function updateUpgradeColors() {

    if(Math.round(game.H) >= Math.round(ruBaseCost[0] * Math.pow(1.1, game.ru.id[0]))) {
        document.getElementById("ru1Buy1").className = "ruBuy1CanAfford";
        document.getElementById("ru1BuyMax").className = "ruBuyMaxCanAfford";
    }
    else {
        document.getElementById("ru1Buy1").className = "ruBuy1CannotAfford";
        document.getElementById("ru1BuyMax").className = "ruBuyMaxCannotAfford";
    }

    if(Math.round(game.deu) >= Math.round(ruBaseCost[1] * Math.pow(1.1, game.ru.id[1]))) {
        document.getElementById("ru2Buy1").className = "ruBuy1CanAfford";
        document.getElementById("ru2BuyMax").className = "ruBuyMaxCanAfford";
    }
    else {
        document.getElementById("ru2Buy1").className = "ruBuy1CannotAfford";
        document.getElementById("ru2BuyMax").className = "ruBuyMaxCannotAfford";
    }

    if(Math.round(game.energy) >= Math.round(ruBaseCost[2] * Math.pow(1.6, game.ru.id[2]))) {
        document.getElementById("ru3Buy1").className = "ruBuy1CanAfford";
        document.getElementById("ru3BuyMax").className = "ruBuyMaxCanAfford";
    }
    else {
        document.getElementById("ru3Buy1").className = "ruBuy1CannotAfford";
        document.getElementById("ru3BuyMax").className = "ruBuyMaxCannotAfford";
    }

    if((Math.round(game.H) >= Math.round(ruBaseCost[3][0] * Math.pow(1.25, game.ru.id[3]))) && 
       (Math.round(game.deu) >= Math.round(ruBaseCost[3][1] * Math.pow(1.25, game.ru.id[3]))) && 
       (Math.round(game.energy) >= Math.round(ruBaseCost[3][2] * Math.pow(1.5, game.ru.id[3]))))
    {
        document.getElementById("ru4Buy1").className = "ruBuy1CanAfford";
        document.getElementById("ru4BuyMax").className = "ruBuyMaxCanAfford";
    }
    else {
        document.getElementById("ru4Buy1").className = "ruBuy1CannotAfford";
        document.getElementById("ru4BuyMax").className = "ruBuyMaxCannotAfford";
    }

    document.getElementById("ru5Level").innerHTML = game.ru.id[4];
    if(game.ru.id[4] == 3) {
        document.getElementById("ru5").className = "UMaxed";
        document.getElementById("ru5ProtiumCost").innerHTML = "MAXED";
        document.getElementById("ru5DeuteriumCost").innerHTML = "";
        document.getElementById("ru5EnergyCost").innerHTML = "";
    }
    else {
        document.getElementById("ru5ProtiumCost").innerHTML = "Cost: " + format(ruBaseCost[4][0] * Math.pow(4, game.ru.id[4]), 0) + " Protium, ";
        document.getElementById("ru5DeuteriumCost").innerHTML = format(ruBaseCost[4][1] * Math.pow(4, game.ru.id[4]), 0) + " Deuterium, and ";
        document.getElementById("ru5EnergyCost").innerHTML = format(ruBaseCost[4][2] * Math.pow(25, game.ru.id[4]), 0) + " energy.";
        if((game.H > ruBaseCost[4][0] * Math.pow(4, game.ru.id[4])) && 
           (game.deu > ruBaseCost[4][1] * Math.pow(4, game.ru.id[4])) && 
           (game.energy > ruBaseCost[4][2] * Math.pow(25, game.ru.id[4]))) {
                document.getElementById("ru5").className = "UCanAfford";
           }
        else
            document.getElementById("ru5").className = "UCannotAfford";
    }

    if((Math.round(game.H) >= Math.round(ruBaseCost[5][0] * Math.pow(1.97, game.ru.id[5]))) &&
       (game.energy >= ruBaseCost[5][1] * Math.pow(32, game.ru.id[5]))) {
        document.getElementById("ru6Buy1").className = "ruBuy1CanAfford";
        document.getElementById("ru6BuyMax").className = "ruBuyMaxCanAfford";
    }
    else {
        document.getElementById("ru6Buy1").className = "ruBuy1CannotAfford";
        document.getElementById("ru6BuyMax").className = "ruBuyMaxCannotAfford";
    }

    if((Math.round(game.deu) >= Math.round(ruBaseCost[6][0] * Math.pow(2, game.ru.id[6]))) &&
       (game.energy >= ruBaseCost[6][1] * Math.pow(32, game.ru.id[6]))) {
        document.getElementById("ru7Buy1").className = "ruBuy1CanAfford";
        document.getElementById("ru7BuyMax").className = "ruBuyMaxCanAfford";
    }
    else {
        document.getElementById("ru7Buy1").className = "ruBuy1CannotAfford";
        document.getElementById("ru7BuyMax").className = "ruBuyMaxCannotAfford";
    }


    if(game.nu.id[0])
        document.getElementById("nu1").className = "UMaxed";
    else if(game.energy >= 3e11) 
        document.getElementById("nu1").className = "UCanAfford";
    else
        document.getElementById("nu1").className = "UCannotAfford";

    if(game.nu.id[1])
        document.getElementById("nu2").className = "UMaxed";
    else if(game.energy >= 1e13 && game.H >= 750 && game.deu >= 50) 
        document.getElementById("nu2").className = "UCanAfford";
    else
        document.getElementById("nu2").className = "UCannotAfford";

    if(game.nu.id[2])
        document.getElementById("nu3").className = "UMaxed";
    else if(game.energy >= 1e15 && game.H >= 250 && game.deu >= 250) 
        document.getElementById("nu3").className = "UCanAfford";
    else
        document.getElementById("nu3").className = "UCannotAfford";

    if(game.nu.id[3])
        document.getElementById("nu4").className = "UMaxed";
    else if(game.H >= 5000 && game.deu >= 1000) 
        document.getElementById("nu4").className = "UCanAfford";
    else
        document.getElementById("nu4").className = "UCannotAfford";


    document.getElementById("iu1Level").innerHTML = game.iu.id[0];
    switch(game.iu.id[0]) {
        case 0:
            document.getElementById("iu1desc").innerHTML = "Double the speed of protons";
            document.getElementById("iu1ProtiumCost").innerHTML = "Cost: 100 Protium";
            document.getElementById("iu1DeuteriumCost").innerHTML = "";
            document.getElementById("iu1EnergyCost").innerHTML = ".";
            if(game.H >= 100) document.getElementById("iu1").className = "UCanAfford";
            else document.getElementById("iu1").className = "UCannotAfford";
            break;
  
        case 1:
            document.getElementById("iu1desc").innerHTML = "Double the speed of protons";
            document.getElementById("iu1ProtiumCost").innerHTML = "Cost: 200 Protium";
            document.getElementById("iu1DeuteriumCost").innerHTML = "";
            document.getElementById("iu1EnergyCost").innerHTML = ", 2.5e7 energy.";
            if(game.H >= 200 && game.energy >= 2.5e7) document.getElementById("iu1").className = "UCanAfford";
            else document.getElementById("iu1").className = "UCannotAfford";
            break;
  
        case 2:
            document.getElementById("iu1desc").innerHTML = "Increase the speed of protons by 50%";
            document.getElementById("iu1ProtiumCost").innerHTML = "Cost: 500 Protium";
            document.getElementById("iu1DeuteriumCost").innerHTML = "";
            document.getElementById("iu1EnergyCost").innerHTML = ", 4e8 energy.";
            if(game.H >= 500 && game.energy >= 4e8) document.getElementById("iu1").className = "UCanAfford";
            else document.getElementById("iu1").className = "UCannotAfford";
            break;
  
        case 3:
            document.getElementById("iu1desc").innerHTML = "Increase the speed of protons by 5/3";
            document.getElementById("iu1ProtiumCost").innerHTML = "Cost: 1000 Protium";
            document.getElementById("iu1DeuteriumCost").innerHTML = ", 100 Deuterium";
            document.getElementById("iu1EnergyCost").innerHTML = ".";
            if(game.H >= 1000 && game.deu >= 100) document.getElementById("iu1").className = "UCanAfford";
            else document.getElementById("iu1").className = "UCannotAfford";
            break;
  
        case 4:
            document.getElementById("iu1desc").innerHTML = "Double the speed of protons";
            document.getElementById("iu1ProtiumCost").innerHTML = "Cost: ";
            document.getElementById("iu1DeuteriumCost").innerHTML = "250 Deuterium";
            document.getElementById("iu1EnergyCost").innerHTML = ", 1e11 energy.";
            if(game.deu >= 250 && game.energy >= 1e11) document.getElementById("iu1").className = "UCanAfford";
            else document.getElementById("iu1").className = "UCannotAfford";
            break;
  
        case 5:
            document.getElementById("iu1desc").innerHTML = "Increase the speed of protons by 50%";
            document.getElementById("iu1ProtiumCost").innerHTML = "Cost: 3000 Protium";
            document.getElementById("iu1DeuteriumCost").innerHTML = ", 500 Deuterium";
            document.getElementById("iu1EnergyCost").innerHTML = ", 1e14 energy.";
            if(game.H >= 3000 && game.deu >= 500 && game.energy >= 1e14) document.getElementById("iu1").className = "UCanAfford";
            else document.getElementById("iu1").className = "UCannotAfford";
            break;

        case 6: 
            document.getElementById("iu1desc").innerHTML = "Increase the speed of protons";
            document.getElementById("iu1ProtiumCost").innerHTML = "MAXED";
            document.getElementById("iu1DeuteriumCost").innerHTML = "";
            document.getElementById("iu1EnergyCost").innerHTML = "";
            document.getElementById("iu1").className = "UMaxed";
    }
}




function updateEverything2() {
    updateEverything();
    updateUpgradeColors();
}


setInterval(function() {
        updateUpgradeColors();
}, 100)


load(0);
updateEverything2();
