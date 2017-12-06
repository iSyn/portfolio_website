let s = ((el) => {return document.querySelector(el)})
let select = ((arr, what) => {
  for (i in arr) {
    if (arr[i].name == what) {
      return arr[i]
    }
  }
})
let choose = ((arr) => {return Math.floor(Math.random() * arr.length)})

//https://stackoverflow.com/questions/3369593/how-to-detect-escape-key-press-with-javascript-or-jquery
document.onkeydown = function(evt) {
  evt = evt || window.event;
  var isEscape = false;
  if ("key" in evt) {
      isEscape = (evt.key == "Escape" || evt.key == "Esc");
  } else {
      isEscape = (evt.keyCode == 27);
  }
  if (isEscape) {
    Game.removeWrapper()
  }
};

let Game = {}

Game.launch = () => {

  Game.state = {
    wood: 0,
    stone: 0,
    coal: 0,
    copper: 0,
    iron: 0,
    copperPlate: 0,
    ironPlate: 0,
    copperCoil: 0,
    ironGear: 0,
    basicCircuit: 0,
    redScience: 0,
    blueScience: 0,

    worldResources: [
      {name: 'WOOD', amount: 4000},
      {name: 'STONE', amount: 4000},
      {name: 'COAL', amount: 0},
      {name: 'COPPER', amount: 0},
      {name: 'IRON', amount: 0},
    ],

    miningDrills: [
      {
        type: 'STONE',
        power: 0,
        active: 0,
        fuel: null,
      },
      {
        type: 'COAL',
        power: 0,
        active: 0,
        fuel: null,
      },
      {
        type: 'COPPER',
        power: 0,
        active: 0,
        fuel: null,
      },
      {
        type: 'IRON',
        power: 0,
        active: 0,
        fuel: null,
      },
    ],
    miningDrillsInfo: {
      owned: 0,
      active: 0,
      inactive: 0,
    },

    furnaces: [
      {
        type: 'WOOD',
        power: 0,
        active: 0,
        fuel: null
      },
      {
        type: 'IRON',
        power: 0,
        active: 0,
        fuel: null
      },
      {
        type: 'COPPER',
        power: 0,
        active: 0,
        fuel: null
      }
    ],
    furnacesInfo: {
      owned: 0,
      active: 0,
      inactive: 0
    },

    labs: {
      owned: 0
    },

    tech: {
      currentTech: null
    },

    constructors: [],
    emptyConstructor: {
      materials: 1
    },
    constructorInfo: {
      owned: 0,
      active: 0,
      inactive: 0,
    },

    trains: {
      power: 0,
      state: null, // 1 = going, 2 = coming, 3 = loading/unloading
      previousAction: null,
      currentFuel: 0,
      maxFuel: 50,
      owned: 0,
      timeNeeded: 30 * 1000,
      currentTime: 0,
      fuelCounter: 0
    },



    selectedTab: 'ACTION',
    tabs: [
      {name: 'ACTION', locked: false},
      {name: 'BUILD', locked: false},
      {name: 'TECHNOLOGY', locked: true}
    ],

    stats: {
      resourceOnClickMulti: 1,
      resourceNeededMulti: 1,
      overallTotalWood: 0,
      overallTotalStone: 0,
      overallTotalCoal: 0,
      overallTotalCopper: 0,
      overallTotalIron: 0,
      totalActionsManuallyFired: 0,
      totalBuildsManuallyFired: 0,
      exploreCount: 0,
      totalTechLearned: 0
    },

    buildQueue: []
  }

  Game.load = () => {

    setTimeout(() => {Game.addLog('Doing things takes time and energy...', 'olive')}, 1000)
    setTimeout(() => {Game.addLog('Why not build things to do the things for you.', 'olive')}, 3000)

    actions.forEach((action) => {
      new Action(action)
    })

    technologies.forEach((technology) => {
      new Technology(technology)
    })

    Game.rebuildTabs = 1
    Game.rebuildSelectedTab = 1
    Game.rebuildWorldResources = 1
    Game.updateHeader()
  }

  Game.playSound = (snd) => {
    let sfx = new Audio(`./automate-the-world/assets/${snd}.wav`)
    sfx.volume = 0.5
    sfx.play()
  }

  Game.earn = (type, total) => {

    if (type == 'wood' || type == 'stone' || type == 'coal' || type == 'copper' || type == 'iron') {
      let selectedResource
      for (i in Game.state.worldResources) {
        if (type.toUpperCase() == Game.state.worldResources[i].name) {
          selectedResource = Game.state.worldResources[i]
        }
      }
      if (selectedResource.amount >= total) {
        selectedResource.amount -= total
        Game.state[type] += total
      }
    } else {
      Game.state[type] += total
    }

    if (type == 'stone') Game.state.stats.overallTotalStone += total
    if (type == 'wood') Game.state.stats.overallTotalWood += total
    if (type == 'coal') Game.state.stats.overallTotalCoal += total
    if (type == 'copper') Game.state.stats.overallTotalCopper += total
    if (type == 'iron') Game.state.stats.overallTotalIron += total

    Game.rebuildInventory = 1
    Game.rebuildWorldResources = 1
  }

  Game.earnPassiveResources = () => {

    let gain = 0
    let loss = 0
    let selectedResource = ''

    // DRILLS
    for (i in Game.state.miningDrills) {
      let drill = Game.state.miningDrills[i]
      // IF DRILL IS TURNED ON
      if (drill.power == 1) {
        let resourceNeeded = drill.fuel.toLowerCase()
        gain = drill.active
        if (drill.fuel == 'Wood') loss = Math.ceil(drill.active / 2 * Game.state.stats.resourceNeededMulti)
        if (drill.fuel == 'Coal') loss = Math.ceil(drill.active / 3 * Game.state.stats.resourceNeededMulti)
        for (i in Game.state.worldResources) { // GRAB WORLD RESOURCE VALUE
          if (Game.state.worldResources[i].name == drill.type) selectedResource = Game.state.worldResources[i]
        }
        // IF WE HAVE ENOUGH FUEL TO SPEND
        if (Game.state[resourceNeeded] >= loss) {
          // IF WORLD RESOURCE IS MORE THAN 0
          if (selectedResource.amount > 0) {
            if (drill.type != 'COAL') {
              if (selectedResource.amount >= gain) {
                Game.earn(drill.type.toLowerCase(), gain)
                Game.state[resourceNeeded] -= loss
              } else {
                Game.earn(drill.type.toLowerCase(), selectedResource.amount)
                Game.state[resourceNeeded] -= loss
              }
            } else { // IF ON COAL
              if (selectedResource.amount >= gain) {
                // ADD COAL TO INVENTORY
                Game.state.coal += gain
                // TAKE AWAY FROM WORLD RESOURCES
                Game.state.worldResources[2].amount -= gain
                // TAKE AWAY FUEL
                Game.state.coal -= loss
                // REBUILD RESOURCES
                Game.rebuildWorldResources = 1
              } else {
                // ADD COAL TO INVENTORY
                Game.state.coal += selectedResource.amount
                // TAKE AWAY FROM WORLD RESOURCES
                Game.state.worldResources[2].amount = 0
                // TAKE AWAY FUEL
                Game.state.coal -= loss
                // REBUILD
                Game.rebuildWorldResources = 1
              }
            }
          }
        }
      }
    }

    // FURNACES
    for (i in Game.state.furnaces) {
      let furnace = Game.state.furnaces[i]
      // IF THE FURNACE IS ON
      if (furnace.power == 1) {
        let resourceGain = furnace.active
        let resourceLoss = furnace.active * 2
        let selectedFuel = furnace.fuel.toLowerCase()
        let furnaceType = furnace.type.toLowerCase()
        if (furnace.fuel == 'Wood') loss = Math.ceil(furnace.active / 2 * Game.state.stats.resourceNeededMulti)
        if (furnace.fuel == 'Coal') loss = Math.ceil(furnace.active / 3 * Game.state.stats.resourceNeededMulti)

        // IF WE HAVE FUEL
        if (Game.state[selectedFuel] >= loss) {
          // IF WE HAVE ENOUGH RESOURCES EX. IRON -> IRON PLATES
          if (Game.state[furnaceType] >= resourceLoss) {
            Game.state[furnaceType] -= resourceLoss
            Game.state[selectedFuel] -= loss
            // if (furnace.type == 'WOOD') Game.earn('coal', resourceGain)
            if (furnace.type == 'WOOD') Game.state.coal += resourceGain
            if (furnace.type == 'COPPER') Game.earn('copperPlate', resourceGain)
            if (furnace.type == 'IRON') Game.earn('ironPlate', resourceGain)
          }
        }
      }
    }

    // CONSTRUCTORS
    let fuelLoss = 0
    for (i in Game.state.constructors) {
      let selectedConstructor = Game.state.constructors[i]
      if (selectedConstructor.power == 1) {
        let resourceGainAmount = selectedConstructor.active
        let itemToConstruct = selectedConstructor.itemToConstruct
        let resourceLoss = selectedConstructor.requirements
        let selectedFuel = selectedConstructor.fuel.toLowerCase()
        if (selectedConstructor.fuel == 'Wood') fuelLoss = Math.ceil(selectedConstructor.active / 2 * Game.state.stats.resourceNeededMulti)
        if (selectedConstructor.fuel == 'Coal') fuelLoss = Math.ceil(selectedConstructor.active / 3 * Game.state.stats.resourceNeededMulti)

        let success = false

        if (Game.state[selectedFuel] >= fuelLoss) {
          for (i in resourceLoss) {
            if (Game.state[resourceLoss[i].material] >= resourceLoss[i].amount * selectedConstructor.active) {
              success = true
            } else {
              success = false
              break;
            }
          }
          if (success) {
            for (i in resourceLoss) {
              Game.state[resourceLoss[i].material] -= resourceLoss[i].amount * selectedConstructor.active
            }
            Game.state[itemToConstruct] += resourceGainAmount
          } else {
            addLog('Not enough resources', 'darkred')
          }
        }
      }
    }

    // TRAINS
    if (Game.state.trains.power == 1) {
      Game.state.trains.fuelCounter++
      if (Game.state.trains.fuelCounter >= 10) {
        Game.state.trains.fuelCounter = 0
        if (Game.state.trains.currentFuel > 1) {
          Game.state.trains.currentFuel--
        } else {
          Game.state.trains.currentFuel--
          Game.state.trains.power = 0
          Game.addLog('Your train has run out of fuel')
        }
        if (s('.train-info')) {
          Game.removeWrapper()
          Game.showTrainInfo()
        }
      }
    }

    Game.rebuildInventory = 1
  }

  Game.calculateRemainingTechDuration = () => {

    if (Game.state.tech.currentTech.currentDuration >= 0) {
      Game.state.tech.currentTech.currentDuration -= 30
      let barWidth = 100 - (Game.state.tech.currentTech.currentDuration/Game.state.tech.currentTech.duration * 100)
      if (Game.state.selectedTab == 'TECHNOLOGY') {
        let progressBar = s('.progress')
        progressBar.style.width = barWidth + '%'
      }
    } else {
      Game.recalculateRemainingTechDuration = 0
      Game.addLog(`You have completed researching: ${Game.state.tech.currentTech.name}`)
      Game.playSound('tech-complete')
      let tech = select(Game.technologies, Game.state.tech.currentTech.name)
      tech.learned = 1
      Game.state.stats.totalTechLearned++
      tech.inProgress = false
      if (tech.onFinish) {
        if (tech.onFinish.unlockTech) {
          for (i in tech.onFinish.unlockTech) {
            let name = tech.onFinish.unlockTech[i]
            let techToUnlock = select(Game.technologies, name)
            techToUnlock.locked = 0
          }
        }
        if (tech.onFinish.unlockAction) {
          for (i in tech.onFinish.unlockAction) {
            let action = tech.onFinish.unlockAction[i]
            select(Game.actions, action).locked = 0
          }
        }
        if (tech.onFinish.checkUnlock) {
          for (i in tech.onFinish.checkUnlock) {
            let tech = tech.onFinish.checkUnlock[i]
            let selectedTech = select(Game.technologies, tech)
          }
        }
      }
      if (tech.onFinishFunc) tech.onFinishFunc()


      Game.state.tech.currentTech = null
      Game.rebuildSelectedTab = 1
    }
  }

  Game.spend = (type, amount) => {
    if (Game.state[type] >= amount) {
      Game.state[type] -= amount
    }

    Game.rebuildInventory = 1
  }

  Game.showTooltip = (text) => {
    let tooltip = s('.tooltip')

    tooltip.innerHTML = text

    tooltip.style.position = 'absolute'
    tooltip.style.border = '2px solid black'
    tooltip.style.display = 'block'
    tooltip.style.top = event.clientY + 15 + 'px'
    tooltip.style.left = event.clientX - tooltip.getBoundingClientRect().width/2 + 'px'
  }

  Game.hideTooltip = () => {
    let tooltip = s('.tooltip')
    tooltip.style.display = 'none'
    tooltip.innerHTML = '';
  }

  Game.buildWorldResources = () => {
    let str = ''

    if (s('.world-resources-container')) {
      for (i in Game.state.worldResources) {
        if (Game.state.worldResources[i].amount > 0) {
          str += `
            <div class="inventory-item">
              <p class="inventory-item-name">${Game.state.worldResources[i].name}</p>
              <p class="inventory-item-amount">${Game.state.worldResources[i].amount}</p>
            </div>
          `
        }
      }
      s('.world-resources-container').innerHTML = str
    }

    Game.rebuildWorldResources = 0
  }

  Game.buildInventory = () => {
    let str = ``

    if (Game.state.stats.overallTotalWood > 0 || Game.state.wood > 0) {
      str += `
        <div class="inventory-item">
          <p class="inventory-item-name">WOOD</p>
          <p class='inventory-item-amount'>${Game.state.wood}</p>
        </div>
      `
    }

    if (Game.state.stats.overallTotalStone > 0 || Game.state.stone > 0) {
      str += `
        <div class="inventory-item">
          <p class="inventory-item-name">STONE</p>
          <p class='inventory-item-amount'>${Game.state.stone}</p>
        </div>
      `
    }

    if (Game.state.stats.overallTotalCoal > 0 || Game.state.coal > 0) {
      str += `
        <div class="inventory-item">
          <p class="inventory-item-name">COAL</p>
          <p class='inventory-item-amount'>${Game.state.coal}</p>
        </div>
      `
    }

    if (Game.state.stats.overallTotalCopper > 0 || Game.state.copper > 0) {
      str += `
        <div class="inventory-item">
          <p class="inventory-item-name">COPPER</p>
          <p class='inventory-item-amount'>${Game.state.copper}</p>
        </div>
      `
    }

    if (Game.state.stats.overallTotalIron > 0 || Game.state.iron > 0) {
      str += `
        <div class="inventory-item">
          <p class="inventory-item-name">IRON</p>
          <p class='inventory-item-amount'>${Game.state.iron}</p>
        </div>
      `
    }

    if (Game.state.copperPlate > 0) {
      str += `
        <div class="inventory-item">
          <p class="inventory-item-name">COPPER PLATE</p>
          <p class='inventory-item-amount'>${Game.state.copperPlate}</p>
        </div>
      `
    }

    if (Game.state.ironPlate > 0) {
      str += `
        <div class="inventory-item">
          <p class="inventory-item-name">IRON PLATE</p>
          <p class='inventory-item-amount'>${Game.state.ironPlate}</p>
        </div>
      `
    }

    if (Game.state.copperCoil > 0) {
      str += `
        <div class="inventory-item">
          <p class="inventory-item-name">COPPER COIL</p>
          <p class='inventory-item-amount'>${Game.state.copperCoil}</p>
        </div>
      `
    }

    if (Game.state.ironGear > 0) {
      str += `
        <div class="inventory-item">
          <p class="inventory-item-name">IRON GEAR</p>
          <p class='inventory-item-amount'>${Game.state.ironGear}</p>
        </div>
      `
    }

    if (Game.state.basicCircuit > 0) {
      str += `
        <div class="inventory-item">
          <p class="inventory-item-name">BASIC CIRCUIT</p>
          <p class='inventory-item-amount'>${Game.state.basicCircuit}</p>
        </div>
      `
    }

    if (Game.state.redScience > 0) {
      str += `
        <div class="inventory-item">
          <p class="inventory-item-name">RED SCIENCE </p>
          <p class='inventory-item-amount'>${Game.state.redScience}</p>
        </div>
      `
    }

    if (Game.state.blueScience > 0) {
      str += `
        <div class="inventory-item">
          <p class="inventory-item-name">BLUE SCIENCE </p>
          <p class='inventory-item-amount'>${Game.state.blueScience}</p>
        </div>
      `
    }

    s('.inventory-container').innerHTML = str

    Game.rebuildInventory = 0
  }

  Game.buildTabs = () => {
    let str = ``

    for (i in Game.state.tabs) {
      if (Game.state.tabs[i].locked == false) {
        str += `<h3 id="${Game.state.tabs[i].name}-tab" class='tab' onclick='Game.changeTab("${Game.state.tabs[i].name}")'>${Game.state.tabs[i].name}</h3> &nbsp; &nbsp;`
      }
    }

    s('.tabs').innerHTML = str

    s(`#${Game.state.selectedTab}-tab`).style.textDecoration = 'underline'
    s(`#${Game.state.selectedTab}-tab`).style.color = 'black'

    Game.rebuildTabs = 0
  }

  Game.changeTab = (tab) => {

    let currentTab = Game.state.selectedTab

    if (currentTab != tab) {
      s('.tab-content').classList.remove('fadeIn')
      Game.state.selectedTab = tab
      Game.rebuildTabs = 1
      Game.rebuildSelectedTab = 1
      s('.tab-content').classList.add('fadeIn')
      setTimeout(() => {
        s('.tab-content').classList.remove('fadeIn')
      }, 500)
    }
  }

  Game.trainExplore = () => {
    let selectedResources = []

    // SELECT THE RESOURCES
    for (i = 0; i < 3; i++) {
      let number = choose(Game.state.worldResources)
      let amount = Math.floor(Math.random() * (500 - 100 + 1)) + 100
      amount += Math.ceil(Game.state.trains.owned * .05 * amount)

      selectedResources.push({
        name: Game.state.worldResources[number].name,
        amount: amount,
        index: number
      })
    }

    // ADD TO WORLD RESOURCES
    for (i in selectedResources) {
      Game.state.worldResources[selectedResources[i].index].amount += selectedResources[i].amount
      Game.addLog(`Your train found the location of ${selectedResources[i].amount} ${Game.state.worldResources[selectedResources[i].index].name.toLowerCase()}`)
    }

    Game.rebuildWorldResources = 1
  }

  Game.trainStuff = () => {
    let train = s('.train')

    if (Game.state.trains.power == 1) {
      if (Game.state.trains.state == 1) { // GOING TO RESOURCES
        Game.state.trains.currentTime += 30
        Game.state.trains.previousAction = 1
        if (Game.state.selectedTab == 'ACTION') {
          let position = Game.state.trains.currentTime/Game.state.trains.timeNeeded * 100
          train.style.left = position + "%"
          if (Game.state.trains.currentTime/Game.state.trains.timeNeeded * 100 >= 100) {
            console.log('arrived at resources')
            Game.state.trains.state = 3
            Game.state.trains.currentTime = 5 * 1000
          }
        }
      } else if (Game.state.trains.state == 2) { // COMING BACK FROM RESOURCES
        Game.state.trains.currentTime -= 30
        Game.state.trains.previousAction = 2
        if (Game.state.selectedTab == 'ACTION') {
          let position = Game.state.trains.currentTime/Game.state.trains.timeNeeded * 100
          train.style.left = position + "%"
          if (Game.state.trains.currentTime/Game.state.trains.timeNeeded * 100 <= 0) {
            console.log('arrived at home')
            Game.state.trains.state = 3
            Game.state.trains.currentTime = 5 * 1000
            // ADD WORLD RESOURCES
            Game.trainExplore()
          }
        }
      } else if (Game.state.trains.state == 3) { // UNLOADING/LOADING
        if (Game.state.selectedTab == 'ACTION') {
          if (Game.state.trains.previousAction == 1) train.style.left = 100 + "%"
          if (Game.state.trains.previousAction == 2) train.style.left = 0 + '%'
        }
        Game.state.trains.currentTime -= 30
        if (Game.state.trains.currentTime <= 0) {
          if (Game.state.trains.previousAction == 1) {
            console.log('heading to home')
            Game.state.trains.currentTime = Game.state.trains.timeNeeded
            Game.state.trains.state = 2
          } else {
            console.log('heading to resources')
            Game.state.trains.currentTime = 0
            Game.state.trains.state = 1
          }
        }
      }
    } else {
      if (Game.state.selectedTab == 'ACTION') {
        let position = Game.state.trains.currentTime/Game.state.trains.timeNeeded * 100
        train.style.left = position + "%"
      }
    }
  }

  Game.toggleTrainPower = (pow) => {
    if (pow == 1) { // if turning on
      if (Game.state.trains.currentFuel > 0) {
        Game.removeWrapper()
        Game.state.trains.power = pow
        if (!Game.state.trains.state) {
          Game.state.trains.state = 1
        }
        Game.showTrainInfo()
      } else {
        Game.addLog('Fuel is needed to power a train.', 'darkred')
      }
    } else {
      Game.state.trains.power = pow
      Game.removeWrapper()
      Game.showTrainInfo()
    }
  }

  Game.showTrainInfo = () => {
    let div = document.createElement('div')

    div.classList.add('wrapper')

    let str = `
      <div class="train-info">
        <div style='display: flex; flex-flow: row nowrap;'>
          <h2 style='flex-grow: 1; text-align: center'>TRAIN</h2>
          <i onclick='Game.removeWrapper()' style='cursor: pointer;'class='fa fa-times fa-1x'></i>
        </div>
        <hr />
        <br/>
      `

      // POWER
      if (Game.state.trains.power == 0) {
        str += `<p>Power: <button class='power-btn' onclick='Game.toggleTrainPower(1)'>OFF</button></p>`
      } else {
        str += `<p>Power: <button class='power-btn' onclick='Game.toggleTrainPower(0)'>ON</button></p>`
      }

      str += `<p>Fuel: ${Game.state.trains.currentFuel}/${Game.state.trains.maxFuel}</p>`

      str += `<br/>`

      // str += `<p>Add fuel: </p>`
      str += `
        <input style='width: 100%; font-size: xx-large; text-align: center;' type="number" placeholder='Add Fuel'/>
        <p style='text-align: center; font-size: small;'>1 fuel = 1 coal</p>
        <button onclick='Game.addFuelTrain()' style='width: 100%; font-size: x-large; position: absolute; bottom: 0px; left: 0px; padding: 20px; cursor: pointer;'>RE FUEL</button>
      `

      str += `</div>`

    div.innerHTML = str
    s('body').append(div)
  }

  Game.addFuelTrain = () => {
    let amount = parseInt(s('input').value)
    // let currentFuel = Game.state.trains.currentFuel
    if (amount) {
      if (Game.state.coal >= amount) {
        if (amount + Game.state.trains.currentFuel <= Game.state.trains.maxFuel) {
          Game.state.coal -= amount
          Game.state.trains.currentFuel += amount
          Game.addLog(`Added ${amount} fuel`)
        } else {
          Game.addLog(`Total exceeds maximum fuel. Adding ${Game.state.trains.maxFuel - Game.state.trains.currentFuel} fuel instead.`)
          Game.state.coal -= Game.state.trains.maxFuel - Game.state.trains.currentFuel
          Game.state.trains.currentFuel = Game.state.trains.maxFuel
        }
        Game.rebuildInventory = 1
        Game.removeWrapper()
        Game.showTrainInfo()
      } else {
        Game.addLog('Not enough coal', 'darkred')
      }
    }
  }

  Game.showTooltipTrain = () => {
    if (Game.state.trains.fuel <= 0) {
      Game.showTooltip('Current Action: No Fuel')
    } else {
      if (Game.state.trains.state == 3) {
        if (Game.state.trains.previousAction == 1) { // was going to resources
          Game.showTooltip('Current Action: Found resources')
        } else {
          Game.showTooltip('Current Action: Reporting information')
        }
      } else if (Game.state.trains.state == 1) {
        Game.showTooltip('Current Action: Looking for resources')
      } else if (Game.state.trains.state == 2) {
        Game.showTooltip('Current Action: Heading home')
      }
    }
  }

  Game.buildTrains = () => {
    let str = `
      <br/>
      <h3>TRAINS <span style='font-size: small'>owned: ${Game.state.trains.owned}</span></h3>
      <hr/>
      <div class="trains-container">
        <div onclick='Game.showTrainInfo()' class="train" onmouseover="Game.showTooltipTrain()" onmouseout='Game.hideTooltip()'></div>
      </div>
    `
    return str
  }

  Game.buildDrills = () => {
    let str = `
      <br/>
      <h3>DRILLS <span style='font-size: small'>owned: ${Game.state.miningDrillsInfo.owned} | active: ${Game.state.miningDrillsInfo.active} | inactive: ${Game.state.miningDrillsInfo.inactive}</span></h3>
      <hr/>
      <div class="mining-drills-container">
      `
      for (i in Game.state.miningDrills) {
        str += `
          <div class="mining-resource-container">
            <p style='text-align: center; font-weight: bold;'>${Game.state.miningDrills[i].type}</p>
            <hr style='margin-bottom: 5px'/>
            `
            // BUILDS ON AND OFF BUTTONS
            if (Game.state.miningDrills[i].power == 0) {
              str += `<p style='margin-bottom: 5px'>Power: <button onclick='Game.toggleDrillPower(1, ${i})' class="power-btn">OFF</button></p>`
            } else {
              str += `<p style='margin-bottom: 5px'>Power: <button onclick='Game.toggleDrillPower(0, ${i})' class="power-btn">ON</button></p>`
            }

            // BUILDS FUEL DROPDOWN THINGY
            if (Game.state.miningDrills[i].fuel == null) {
              str += `
                <div class="fuel-container">
                  <p>Fuel: </p>
                  <select id='fuel-${i}' onchange='Game.changeFuel("${i}")'>
                    <option selected disabled>Select Fuel Type</option>
                    <option value="Wood">Wood</option>
                    <option value="Coal">Coal</option>
                  </select>
                </div>
              `
            } else if (Game.state.miningDrills[i].fuel == 'Wood') {
              str += `
                <div class="fuel-container">
                  <p>Fuel: </p>
                  <select id='fuel-${i}' onchange='Game.changeFuel("${i}")'>
                    <option disabled>Select Fuel Type</option>
                    <option selected value="Wood">Wood</option>
                    <option value="Coal">Coal</option>
                  </select>
                </div>
              `
            } else if (Game.state.miningDrills[i].fuel == 'Coal') {
              str += `
                <div class="fuel-container">
                  <p>Fuel: </p>
                  <select id='fuel-${i}' onchange='Game.changeFuel("${i}")'>
                    <option disabled>Select Fuel Type</option>
                    <option value="Wood">Wood</option>
                    <option selected value="Coal">Coal</option>
                  </select>
                </div>
              `
            }

            // BUILD ADD/REMOVE DRILLS
            str += `
              <p style='margin-bottom: 5px'>Drills: <button onclick='Game.addRemoveDrill(0, ${i})' class='drill-btn'>-</button>${Game.state.miningDrills[i].active}<button onclick='Game.addRemoveDrill(1, ${i})' class='drill-btn'>+</button></p>
            `

            // DRILL STATS N SHIT
            if (Game.state.miningDrills[i].power == 1) {
              str += `
                <hr/>
                <br/>
                <p style='text-align: center'>+${Game.state.miningDrills[i].active} ${Game.state.miningDrills[i].type.toLowerCase()}/s</p>
              `
              if (Game.state.miningDrills[i].fuel == 'Wood') {
                str += `<p style='text-align: center'>-${Math.ceil(Game.state.miningDrills[i].active / 2 * Game.state.stats.resourceNeededMulti)} ${Game.state.miningDrills[i].fuel.toLowerCase()}/s</p>`
              } else if (Game.state.miningDrills[i].fuel == 'Coal') {
                str += `<p style='text-align: center'>-${Math.ceil(Game.state.miningDrills[i].active / 3 * Game.state.stats.resourceNeededMulti)} ${Game.state.miningDrills[i].fuel.toLowerCase()}/s</p>`
              }
            }

            str += `
          </div>
        `
      }

      str += `
      </div>
    `

    return str
  }

  Game.buildFurnaces = () => {
    let str = `
      <br/>
      <h3>FURNACES <span style='font-size: small'>owned: ${Game.state.furnacesInfo.owned} | active: ${Game.state.furnacesInfo.active} | inactive: ${Game.state.furnacesInfo.inactive}</span></h3>
      <hr/>
      <div class="furnaces-container">
      `
      for (i in Game.state.furnaces) {
        str += `<div class="furnace-container">
          <p style='text-align: center; font-weight: bold;'>${Game.state.furnaces[i].type}</p>
          <hr/>
        `

        // ON AND OFF BUTTONS
        if (Game.state.furnaces[i].power == 0) {
          str += `<p style='margin-bottom: 5px'>Power: <button onclick='Game.toggleFurnacePower(1, ${i})' class="power-btn">OFF</button></p>`
        } else {
          str += `<p style='margin-bottom: 5px'>Power: <button onclick='Game.toggleFurnacePower(0, ${i})' class="power-btn">ON</button></p>`
        }

        // FUEL DROPDOWN
        if (Game.state.furnaces[i].fuel == null) {
          str += `
            <div class="fuel-container">
              <p>Fuel: </p>
              <select id='furnace-fuel-${i}' onchange='Game.changeFurnaceFuel("${i}")'>
                <option selected disabled>Select Fuel Type</option>
                <option value="Wood">Wood</option>
                <option value="Coal">Coal</option>
              </select>
            </div>
          `
        } else if (Game.state.furnaces[i].fuel == 'Wood') {
          str += `
            <div class="fuel-container">
              <p>Fuel: </p>
              <select id='furnace-fuel-${i}' onchange='Game.changeFurnaceFuel("${i}")'>
                <option disabled>Select Fuel Type</option>
                <option selected value="Wood">Wood</option>
                <option value="Coal">Coal</option>
              </select>
            </div>
          `
        } else if (Game.state.furnaces[i].fuel == 'Coal') {
          str += `
            <div class="fuel-container">
              <p>Fuel: </p>
              <select id='furnace-fuel-${i}' onchange='Game.changeFurnaceFuel("${i}")'>
                <option disabled>Select Fuel Type</option>
                <option value="Wood">Wood</option>
                <option selected value="Coal">Coal</option>
              </select>
            </div>
          `
        }

        // BUILD ADD AND REMOVE
        str += `
          <p style='margin-bottom: 5px'>Furnaces: <button onclick='Game.addRemoveFurnace(0, ${i})' class='drill-btn'>-</button>${Game.state.furnaces[i].active}<button onclick='Game.addRemoveFurnace(1, ${i})' class='drill-btn'>+</button></p>
        `

        // FURNACE STATS N SHIT
        if (Game.state.furnaces[i].power == 1) {
          str += `
            <hr/>
            <br/>
          `
          if (Game.state.furnaces[i].type == 'WOOD') {
            str += `
              <p style='text-align: center'>+${Game.state.furnaces[i].active} coal/s</p>
              <p style='text-align: center'>-${Game.state.furnaces[i].active * 2} wood/s</p>
            `
          }
          if (Game.state.furnaces[i].type == 'COPPER') {
            str += `
              <p style='text-align: center'>+${Game.state.furnaces[i].active} copper plate/s</p>
              <p style='text-align: center'>-${Game.state.furnaces[i].active * 2} copper/s</p>
            `
          }
          if (Game.state.furnaces[i].type == 'IRON') {
            str += `
              <p style='text-align: center'>+${Game.state.furnaces[i].active} iron plate/s</p>
              <p style='text-align: center'>-${Game.state.furnaces[i].active * 2} iron/s</p>
            `
          }
          if (Game.state.furnaces[i].fuel == 'Wood') {
            str += `<p style='text-align: center'>-${Math.ceil(Game.state.furnaces[i].active / 2 * Game.state.stats.resourceNeededMulti)} ${Game.state.furnaces[i].fuel.toLowerCase()}/s</p>`
          } else if (Game.state.furnaces[i].fuel == 'Coal') {
            str += `<p style='text-align: center'>-${Math.ceil(Game.state.furnaces[i].active / 3 * Game.state.stats.resourceNeededMulti)} ${Game.state.furnaces[i].fuel.toLowerCase()}/s</p>`
          }
        }

        str += `</div>`
      }

      str += `</div>`
    return str
  }

  Game.buildConstructors = () => {
    let str = `
      <br/>
      <h3>CONSTRUCTORS <span style='font-size: small'>owned: ${Game.state.constructorInfo.owned} | active: ${Game.state.constructorInfo.active} | inactive: ${Game.state.constructorInfo.inactive}</span></h3>
      <hr/>
      <div style='margin-top: 5px;' class="constructors-container">
    `

    if (Game.state.constructors.length > 0) {
      for (i in Game.state.constructors) {
        let selected = Game.state.constructors[i]

        str += `
          <div class="constructor">
            <div class="constructor-header" style='display: flex; flex-flow: row nowrap;'>
              <p style='font-weight: bold; text-align: center; flex-grow: 1'>${selected.name.toUpperCase()}</p>
              <p onclick='Game.redesignateConstructor(${i})' onmouseover='Game.showTooltip("<p>Redesignate Constructor</p>")' onmouseout='Game.hideTooltip()' style='cursor: pointer'><i class='fa fa-times 1x'></i></p>
            </div>
            <hr />
        `

        // ON AND OFF BUTTONS
        if (selected.power == 0) {
          str += `<p style='margin-bottom: 5px'>Power: <button onclick='Game.toggleConstructorPower(1, ${i})' class="power-btn">OFF</button></p>`
        } else {
          str += `<p style='margin-bottom: 5px'>Power: <button onclick='Game.toggleConstructorPower(0, ${i})' class="power-btn">ON</button></p>`
        }

        // FUEL DROPDOWN
        if (selected.fuel == null) {
          str += `
            <div class="fuel-container">
              <p>Fuel: </p>
              <select id='constructor-fuel-${i}' onchange='Game.changeConstructorFuel("${i}")'>
                <option selected disabled>Select Fuel Type</option>
                <option value="Wood">Wood</option>
                <option value="Coal">Coal</option>
              </select>
            </div>
          `
        } else if (selected.fuel == 'Wood') {
          str += `
            <div class="fuel-container">
              <p>Fuel: </p>
              <select id='constructor-fuel-${i}' onchange='Game.changeConstructorFuel("${i}")'>
                <option disabled>Select Fuel Type</option>
                <option selected value="Wood">Wood</option>
                <option value="Coal">Coal</option>
              </select>
            </div>
          `
        } else if (selected.fuel == 'Coal') {
          str += `
            <div class="fuel-container">
              <p>Fuel: </p>
              <select id='constructor-fuel-${i}' onchange='Game.changeConstructorFuel("${i}")'>
                <option disabled>Select Fuel Type</option>
                <option value="Wood">Wood</option>
                <option selected value="Coal">Coal</option>
              </select>
            </div>
          `
        }

        // BUILD ADD AND REMOVE
        str += `
          <p style='margin-bottom: 5px'>Constructors: <button onclick='Game.addRemoveConstructor(0, ${i})' class='drill-btn'>-</button>${selected.active}<button  onclick='Game.addRemoveConstructor(1, ${i})'class='drill-btn'>+</button></p>
        `

        if (selected.power == 1) {
          str += `
            <hr />
            <br />
          `

          str += `
            <p style='text-align: center'>+${selected.active} ${selected.name.toLowerCase()}/s</p>
          `

          for (j in selected.requirements) {
            str += `<p style='text-align: center'>-${selected.requirements[j].amount * selected.active} ${selected.requirements[j].materialName}/s</p>`
          }

          if (selected.fuel == 'Wood') {
            str += `<p style='text-align: center'>-${Math.ceil(selected.active / 2 * Game.state.stats.resourceNeededMulti)} ${selected.fuel.toLowerCase()}/s</p>`
          } else if (selected.fuel == 'Coal') {
            str += `<p style='text-align: center'>-${Math.ceil(selected.active / 3 * Game.state.stats.resourceNeededMulti)} ${selected.fuel.toLowerCase()}/s</p>`
          }

        }

        str += '</div>'
      }
    }

    if (Game.state.constructors.length < Game.state.constructorInfo.owned) {
      str += `
        <div class="available-constructor" onclick='Game.newConstructor()'>
          <h4>DESIGNATE <br/> INACTIVE <br/> CONSTRUCTOR</h4>
        </div>
      `
    }

    str += '</div>'

    return str
  }

  Game.redesignateConstructor = (num) => {
    let selectedConstructor = Game.state.constructors[num]
    let selectedConstructorActive = selectedConstructor.active

    Game.state.constructors.splice(num, 1)

    Game.state.constructorInfo.active -= selectedConstructorActive
    Game.state.constructorInfo.inactive += selectedConstructorActive

    Game.rebuildSelectedTab = 1
  }

  Game.toggleConstructorPower = (pow, num) => {
    let selectedConstructor = Game.state.constructors[num]

    if (selectedConstructor.fuel != null && selectedConstructor.active > 0) {
      selectedConstructor.power = pow

      Game.rebuildSelectedTab = 1
    } else {
      Game.addLog('Select a fuel type before powering on constructor', 'darkred')
    }

    if (selectedConstructor.active == 0) {
      Game.addLog('Add some constructors', 'darkred')
    }
  }

  Game.changeConstructorFuel = (num) => {
    let selectedConstructor = Game.state.constructors[num]
    let selectedSelect = s(`#constructor-fuel-${num}`)

    selectedConstructor.fuel = selectedSelect.value

    Game.rebuildSelectedTab = 1
  }

  Game.addRemoveConstructor = (type, num) => {
    let selectedConstructor = Game.state.constructors[num]

    if (type == 0) {
      // REMOVE CONSTRUCTORS
      if (selectedConstructor.active > 0) {
        selectedConstructor.active--
        Game.state.constructorInfo.inactive++
        Game.state.constructorInfo.active--
        if (selectedConstructor.active == 0) {
          selectedConstructor.power = 0
        }
      }
    } else {
      // ADD CONSTRUCTORS
      if (Game.state.constructorInfo.inactive > 0) {
        selectedConstructor.active++
        Game.state.constructorInfo.inactive--
        Game.state.constructorInfo.active++
      }
    }

    Game.rebuildSelectedTab = 1
  }

  Game.newConstructor = () => {
    if (Game.state.constructorInfo.inactive > 0) {
      let div = document.createElement('div')

      div.classList.add('wrapper')

      let str = `
        <div class="constructor-modal-container">
          <div style='display: flex; flex-flow: row nowrap; align-items: center'>
            <h2 style='flex-grow: 1; text-align: center'>CONSTRUCTOR</h2>
            <p><i onclick='Game.removeWrapper(); Game.state.emptyConstructor.materials=1' style='cursor: pointer;' class='fa fa-times fa-1x'></i></p>
          </div>
          <hr/>
          <br/>
          `

          str += '<div class="constructor-materials-container">'

          str += `
            <div class="row">
              <select id='constructor-materials-1' style='flex-grow: 1'>
                <option selected disabled>Select a material</option>
                <option value="wood">Wood</option>
                <option value="stone">Stone</option>
                <option value="coal">Coal</option>
                <option value="copper">Copper</option>
                <option value="iron">Iron</option>
                <option value="copperPlate">Copper Plate</option>
                <option value="ironPlate">Iron Plate</option>
                <option value="copperCoil">Copper Coil</option>
                <option value="ironGear">Iron Gear</option>
              </select>
              <input id='constructor-materials-amount-1' style='width: 40px;' type="number" min='1' max='10'/>
            </div>
          `

          str += '</div>'

          str += `<p style='text-align: center;'><i onclick='Game.addConstructorMaterial()' style='cursor: pointer; margin-top: 3px;' class='fa fa-plus-square-o fa-2x'></i></p>`

          str += `<button onclick='Game.checkConstructorRecipe()'>DESIGNATE</button>`

          str += `</div>`

          div.innerHTML = str

      s('body').append(div)
    }
  }

  Game.checkConstructorRecipe = () => {
    let userInput = []

    let check = document.querySelectorAll('.row')

    for (i = 0; i < check.length; i++) {
      // IF HAS A MATERIAL AND THERES AN AMOUNT
      if (check[i].children[0].value != 'Select a material' && check[i].children[1].value) {
        userInput.push({
          material: check[i].children[0].value,
          amount: check[i].children[1].value,
        })
      }
    }

    Game.removeWrapper()
    Game.state.emptyConstructor.materials=1

    let success = false
    let selectedRecipe = {}

    // LOOP THORUGH RECIPES
    for (i in recipes) {
      // IF SELECTED RECIPE HAS THE SAME AMOUNT OF MATERIALS
      if (userInput.length == recipes[i].requirements.length) {
        for (j = 0; j < userInput.length; j++) {
          if (userInput[j].material == recipes[i].requirements[j].material && userInput[j].amount == recipes[i].requirements[j].amount) {
            success = true
            selectedRecipe = recipes[i]
          } else {
            success = false
            break
          }
        }
        if (success) {
          break
        }
      }
    }

    if (success) {
      Game.addLog(`Designated constructor for ${selectedRecipe.name}`)
      Game.foundRecipe(selectedRecipe)
    } else {
      Game.addLog('invalid recipe', 'darkred')
    }
  }

  Game.foundRecipe = (recipe) => {

    let constructorObj = {
      name: recipe.name,
      itemToConstruct: recipe.itemName,
      requirements: recipe.requirements,
      power: 0,
      active: 0,
      fuel: null
    }

    Game.state.constructors.push(constructorObj)

    Game.rebuildSelectedTab = 1
  }

  Game.actions = []

  Game.technologies = []

  Game.buildSelectedTab = () => {
    let selectedTab = Game.state.selectedTab
    let str = ''

    if (selectedTab == 'ACTION') {

      str += `<div class="content">`

      for (i in Game.actions) {
        let action = Game.actions[i]
        if (action.tab == 'GATHER') {
          if (!action.locked) {
            if (action.nextLine) {
              str += '<div class="next-line-push"></div>'
              str += `
                <div class="action" onclick='Game.fireAction(${i}, ${action.onclick})' onmouseover='Game.showTooltip("${action.tooltip}")' onmouseout='Game.hideTooltip()'>
                  <div id='action-${i}' class="action-progress"></div>
                  <div class="action-name">${action.name}</div>
                </div>`
            } else {
              str += `
                <div class="action" onclick='Game.fireAction(${i}, ${action.onclick})' onmouseover='Game.showTooltip("${action.tooltip}")' onmouseout='Game.hideTooltip()'>
                  <div id='action-${i}' class="action-progress"></div>
                  <div class="action-name">${action.name}</div>
                </div>`
            }
          }
        }
      }

      str += `</div>`

      if (Game.state.trains.owned > 0) str += Game.buildTrains()
      if (Game.state.miningDrillsInfo.owned > 0) str += Game.buildDrills()
      if (Game.state.furnacesInfo.owned > 0) str += Game.buildFurnaces()
      if (Game.state.constructorInfo.owned > 0) str += Game.buildConstructors()
    }

    if (selectedTab == 'BUILD') {
      str += `<div class='content'>`

      for (i in Game.actions) {
        let action = Game.actions[i]
        if (action.tab == 'BUILD') {
          if (!action.locked) {
            if (action.nextLine) {
              str += `<div class="next-line-push"></div>`
              str += `<div class="action" onclick='Game.addBuildQueue(${i})' onmouseover='Game.showTooltip("${action.tooltip}")' onmouseout='Game.hideTooltip()'>${action.name}</div>`
            } else {
              str += `<div class="action" onclick='Game.addBuildQueue(${i})' onmouseover='Game.showTooltip("${action.tooltip}")' onmouseout='Game.hideTooltip()'>${action.name}</div>`
            }
          }
        }
      }

      str += '</div>'
    }

    if (selectedTab == 'TECHNOLOGY') {

      str += `<div class="current-tech">`

      if (!Game.state.tech.currentTech) {
        str += `
          <h3 style='text-align: center; padding: 50px 0; height: 140px; opacity: .6;'>NO CURRENT TECH IN PROGRESS</h3>
          <hr/>
        `
      } else {
        str += `
          <div class="current-tech-container">
            <div class="current-tech-img" style='background: url(./automate-the-world/assets/${Game.state.tech.currentTech.img}.png); background-size: 100% 100%; image-rendering: pixelated;'></div>
            <div class="current-tech-info">
              <h4>${Game.state.tech.currentTech.name}</h4>
              <div class="progress-bar-container">
                <div class="progress"></div>
              </div>
            </div>
          </div>
          <hr/>
        `
      }

        str += `</div>`

        str += `
          <h3>AVAILABLE TECHNOLOGY</h3>
          <div class="available-techs">
        `

        let sortedTech = Game.technologies.sort((a, b) => a.price.RED_SCIENCE - b.price.RED_SCIENCE)

        for (i in sortedTech) {
          if (sortedTech[i].locked == 0) {
            if (sortedTech[i].learned == 0) {
              if (sortedTech[i].inProgress == false) {
                str += `
                  <div style='background: url(./automate-the-world/assets/${sortedTech[i].img}.png); background-size: 100% 100%; image-rendering: pixelated;' class="available-tech" onclick='Game.learnTech(${JSON.stringify(sortedTech[i])})' onmouseover='Game.showTooltip("${sortedTech[i].tooltip}")' onmouseout='Game.hideTooltip()'></div>
                `
              }
            }
          }
        }

        str += `</div>`

        str += `
          <br/>
          <hr/>
          <h3>LOCKED TECHNOLOGY</h3>
          <div class="locked-techs">
        `

        for (i in Game.technologies) {
          if (Game.technologies[i].locked == 1) {
            str += `
              <div style='background: darkgrey;' class="available-tech" onclick='Game.addLog("Tech is locked", "darkred")' onmouseover='Game.showTooltip("<h4>${Game.technologies[i].name.toUpperCase()}</h4><hr/><p>Requires: ${Game.technologies[i].requires}</p>")' onmouseout='Game.hideTooltip()'></div>
            `
          }
        }

        str += `</div>`

        if (Game.state.stats.totalTechLearned > 0) {
          str += `
            <br/>
            <hr/>
            <h3>COMPLETED TECHNOLOGY</h3>
            <div class="available-techs">
          `

          for (i in Game.technologies) {
            if (Game.technologies[i].learned == true) {
              str += `
                <div style='background: url(./automate-the-world/assets/${sortedTech[i].img}.png); background-size: 100% 100%; image-rendering: pixelated; cursor: pointer' class="available-tech" onmouseover='Game.showTooltip("<h4>${Game.technologies[i].name.toUpperCase()}</h4>")' onmouseout='Game.hideTooltip()'></div>
              `
            }
          }
        }

        str += `</div>`

    }

    s('.tab-content').innerHTML = str

    Game.rebuildSelectedTab = 0
  }

  Game.toggleFurnacePower = (pow, furnace) => {
    let selectedFurnace = Game.state.furnaces[furnace]

    if (selectedFurnace.fuel != null && selectedFurnace.active > 0) {
      selectedFurnace.power = pow

      Game.rebuildSelectedTab = 1
    } else {
      Game.addLog('Select a fuel type before powering on furnace', 'darkred')
    }

    if (selectedFurnace.active == 0) {
      Game.addLog('Add some furnaces', 'darkred')
    }
  }

  Game.toggleDrillPower = (pow, drill) => {
    let selectedDrill = Game.state.miningDrills[drill]

    if (selectedDrill.fuel != null && selectedDrill.active > 0) {
      selectedDrill.power = pow

      Game.rebuildSelectedTab = 1
    } else {
      Game.addLog('Select a fuel type before powering on drill', 'darkred')
    }

    if (selectedDrill.active == 0) {
      Game.addLog('Add some drills', 'darkred')
    }
  }

  Game.addRemoveDrill = (type, drill) => {
    let selectedDrill = Game.state.miningDrills[drill]

    if (type == 0) {
      // REMOVE DRILLS
      if (selectedDrill.active > 0) {
        selectedDrill.active--
        Game.state.miningDrillsInfo.inactive++
        Game.state.miningDrillsInfo.active--
        if (selectedDrill.active == 0) {
          selectedDrill.power = 0
        }
      }
    } else {
      // ADD DRILLS
      if (Game.state.miningDrillsInfo.inactive > 0) {
        selectedDrill.active++
        Game.state.miningDrillsInfo.inactive--
        Game.state.miningDrillsInfo.active++
      }
    }

    Game.rebuildSelectedTab = 1
  }

  Game.addRemoveFurnace = (type, furnace) => {
    let selectedFurnace = Game.state.furnaces[furnace]

    if (type == 0) {
      // REMOVE furnace
      if (selectedFurnace.active > 0) {
        selectedFurnace.active--
        Game.state.furnacesInfo.inactive++
        Game.state.furnacesInfo.active--
        if (selectedFurnace.active == 0) {
          selectedFurnace.power = 0
        }
      }
    } else {
      // ADD furnace
      if (Game.state.furnacesInfo.inactive > 0) {
        selectedFurnace.active++
        Game.state.furnacesInfo.inactive--
        Game.state.furnacesInfo.active++
      }
    }

    Game.rebuildSelectedTab = 1
  }

  Game.changeFurnaceFuel = (furnace) => {
    let selectedFurnace = Game.state.furnaces[furnace]
    let selectedSelect = s(`#furnace-fuel-${furnace}`)

    selectedFurnace.fuel = selectedSelect.value

    Game.rebuildSelectedTab = 1
  }

  Game.changeFuel = (drill) => {
    let selectedDrill = Game.state.miningDrills[drill]
    let selectedSelect = s(`#fuel-${drill}`)

    selectedDrill.fuel = selectedSelect.value

    Game.rebuildSelectedTab = 1
  }

  Game.learnTech = (tech) => {
    Game.hideTooltip()

    let selectedTech = select(Game.technologies, tech.name)

    if (!Game.state.tech.currentTech) {
      if (selectedTech.price.RED_SCIENCE && !selectedTech.price.BLUE_SCIENCE) {
        if (Game.state.redScience >= selectedTech.price.RED_SCIENCE) {
          Game.state.redScience -= selectedTech.price.RED_SCIENCE
          Game.rebuildInventory = 1

          Game.playSound('start-tech')

          Game.state.tech.currentTech = selectedTech
          Game.state.tech.currentTech.currentDuration = selectedTech.duration
          Game.recalculateRemainingTechDuration = 1
          selectedTech.inProgress = true

        } else {
          Game.addLog('You do not have enough red science', 'darkred')
        }
      } else if (selectedTech.price.RED_SCIENCE && selectedTech.price.BLUE_SCIENCE) {
        if (Game.state.redScience >= selectedTech.price.RED_SCIENCE && Game.state.blueScience >= selectedTech.price.BLUE_SCIENCE) {
          Game.state.redScience -= selectedTech.price.RED_SCIENCE
          Game.state.blueScience -= selectedTech.price.BLUE_SCIENCE
          Game.rebuildInventory = 1

          Game.state.tech.currentTech = selectedTech
          Game.state.tech.currentTech.currentDuration = selectedTech.duration
          Game.recalculateRemainingTechDuration = 1
          selectedTech.inProgress = true
        } else {
          if (Game.state.redScience < selectedTech.price.RED_SCIENCE) Game.addLog('Not enough red science', 'darkred')
          if (Game.state.blueScience < selectedTech.price.BLUE_SCIENCE) Game.addLog('Not enough blue science', 'darkred')
        }
      }
    } else {
      Game.addLog('You are already researching something', 'darkred')
    }

    Game.rebuildSelectedTab = 1
  }

  Game.fireAction = (actionNum, func) => {
    let selectedAction = Game.actions[actionNum]

    if (selectedAction.tab == 'GATHER') {
      if (!selectedAction.currentCooldown) {
        selectedAction.currentCooldown = selectedAction.cooldown
        Game.state.stats.totalActionsManuallyFired++
        func()
        if (Game.state.stats.totalActionsManuallyFired == 3) Game.unlockWorldResources()
      }
    } else {
      func()
      if (Game.state.stats.totalBuildsManuallyFired == 1) Game.unlockBuildQueue()
    }
  }

  Game.unlockWorldResources = () => {


    Game.addLog('Your world has limited resources...', 'olive')
    setTimeout(() => {Game.addLog('Explore your surroundings to find more', 'olive')}, 2000)

    let el = s('.page-content-left')

    el.innerHTML = `
      <div class="page-content" style='height: 60%; border-bottom: 6px solid black'>
        <h3>INVENTORY</h3>
        <hr/>
        <div class="inventory-container"></div>
      </div>
      <div id='world-resources-page-content' class="page-content">
        <h3>WORLD RESOURCES</h3>
        <hr/>
        <div class="world-resources-container"></div>
      </div>
    `

    s('#world-resources-page-content').classList.add('fadeIn-slow')

    select(Game.actions, 'EXPLORE').locked = 0

    Game.rebuildInventory = 1
    Game.rebuildWorldResources = 1
    Game.rebuildSelectedTab = 1
  }

  Game.unlockBuildQueue = () => {
    let el = s('.page-content-right')

    el.innerHTML += `
      <div id='build-queue' class="page-content">
        <h3>BUILD QUEUE</h3>
        <hr/>
        <div class="build-queue-container"></div>
      </div>
    `

    s('#logs').style.height = '75%'
    s('#logs').style.borderBottom = '6px solid black'

    s('#build-queue').classList.add('fadeIn-slow')
  }

  Game.updateCooldown = (actionNum) => {
    selectedAction = Game.actions[actionNum]

    if (selectedAction.currentCooldown > 0) {
      selectedAction.currentCooldown -= 30
    } else {
      selectedAction.currentCooldown = null
    }

    if (Game.state.selectedTab == 'ACTION') {
      let progressBar = s(`#action-${actionNum}`)
      let barWidth = (selectedAction.currentCooldown/selectedAction.cooldown * 100)
      progressBar.style.width = barWidth + '%'
    }
  }

  Game.addBuildQueue = (actionNum, func) => {

    let action = Game.actions[actionNum]

    let building = {
      name: action.name,
      itemName: action.itemName,
      cooldown: action.cooldown,
      onComplete: action.onclick,
      price: action.price
    }

    let success = true

    // CHECKS IF YOU HAVE ENOUGH RESOURCES
    for (i=0; i<action.price.length; i++) {
      if (Game.state[action.price[i].type] >= action.price[i].amount) {
        sucess = true
      } else {
        success = false
      }
    }

    if (success) {

      // CHECK IF QUEUE SHOWS
      if (!s('#build-queue')) {
        Game.unlockBuildQueue()
      }

      // ADD BUILDING TO QUEUE
      Game.state.buildQueue.push(building)
      console.log(Game.state.buildQueue)

      // TAKE PRICE
      for (i=0; i<action.price.length; i++) {
        Game.state[action.price[i].type] -= action.price[i].amount
      }

      Game.rebuildInventory = 1
    } else {
      Game.addLog('You are missing some resources', 'darkred')
    }
  }

  Game.cancelBuildQueue = (num) => {

    let selected = Game.state.buildQueue[num]

    for (i in selected.price) {
      let material = selected.price[i].type
      let amount = selected.price[i].amount

      Game.state[material] += amount
      Game.rebuildInventory = 1
    }

    Game.state.buildQueue.splice(num, 1)

    Game.hideTooltip()
    Game.updateBuildQueue()
  }

  Game.updateBuildQueue = () => {

    let buildQueue = s('.build-queue-container')
    let str = ''

    // SET FIRST COOLDOWN
    if (!Game.state.buildQueue[0].currentCooldown) {
      Game.state.buildQueue[0].currentCooldown = Game.state.buildQueue[0].cooldown
    }

    for (i in Game.state.buildQueue) {
      if (i == 0) {
        str += `
          <div>
            <h4>BUILDING: ${Game.state.buildQueue[i].itemName}</h4>
            <div onclick='Game.cancelBuildQueue(${i})' style='display: flex; flex-flow: row nowrap;'>
              <h4>PROGRESS: </h4>
              <div class="building-progress-container" style='flex-grow: 1'>
                <div class="building-progress" style='width: 25%; height: 100%; background: black'></div>
              </div>
            </div>
            <hr/>
          </div>
        `
      } else {
        str += `<p style='cursor: pointer;' onmouseover='Game.showTooltip("<p>click to cancel</p>")' onmouseout='Game.hideTooltip()' onclick='Game.cancelBuildQueue(${i})'>${Game.state.buildQueue[i].itemName}</p>`
      }
    }

    buildQueue.innerHTML = str

    if (Game.state.buildQueue[0].currentCooldown > 0) {
      Game.state.buildQueue[0].currentCooldown -= 31
      let barWidth = 100 - (Game.state.buildQueue[0].currentCooldown/Game.state.buildQueue[0].cooldown * 100)
      let progressBar = s('.building-progress')
      progressBar.style.width = barWidth + '%'
    } else {
      console.log('completed')
      let functionName = Game.state.buildQueue[0].onComplete
      Game[functionName]();

      Game.state.buildQueue.shift()
      if (Game.state.buildQueue.length == 0) {
        buildQueue.innerHTML = `<p style='text-align: center; opacity: 0.6;'>No items in queue</p>`
      }
    }
  }

  Game.explore = () => {

    Game.state.stats.exploreCount++

    if (Game.state.stats.exploreCount == 1) {
      Game.state.worldResources[2].amount += 5000 // Add a bunch of starting coal
      select(Game.actions, 'MINE COAL').locked = 0
      Game.addLog('You have discovered COAL!')
    } else if (Game.state.stats.exploreCount == 2) {
      Game.state.worldResources[3].amount += 3000 // Add a bunch of starting copper
      select(Game.actions, 'MINE COPPER').locked = 0
      Game.addLog('You have discovered COPPER!')
    } else if (Game.state.stats.exploreCount == 3) {
      Game.state.worldResources[4].amount += 3000 // Add a bunch of starting iron
      select(Game.actions, 'MINE IRON').locked = 0
      Game.addLog('You have discovered IRON!')
    } else {

      let selectedType = Game.state.worldResources[choose(Game.state.worldResources)]

      // Math.floor(Math.random() * (max - min + 1)) + min
      let selectedAmount = Math.floor(Math.random() * (500 - 10 + 1)) + 10
      let enhancedSensesTech = select(Game.technologies, 'Enhanced Senses I')

      if (Math.random() >= .3 || enhancedSensesTech.learned == 1) { // 70% chance

        if (select(Game.technologies, 'Enhanced Senses II').learned == 1) {
          selectedAmount += selectedAmount/2
        }

        selectedType.amount += selectedAmount

        // patch of ...
        // vein of ...

        let small = ['a small patch of', 'a small vein of']
        let medium = ['a medium patch of', 'a medium vein of']
        let large = ['a large patch of', 'a large vein of']
        let gigantic = ['a gigantic patch of']

        let selectedArr = small
        if (selectedAmount >= 100) selectedArr = medium
        if (selectedAmount >= 200) selectedArr = large
        if (selectedAmount >= 400) selectedArr = gigantic

        if (selectedType.name == 'WOOD') {
          Game.addLog(`You find ${selectedAmount} wood`)
        } else {
          Game.addLog(`You find ${selectedArr[choose(selectedArr)]} ${selectedAmount} ${selectedType.name.toLowerCase()}`)
        }

      } else {
        Game.addLog('You explore your surroundings but found nothing notable.')
      }
    }
    Game.rebuildWorldResources = 1
    Game.rebuildSelectedTab = 1
  }

  Game.chopTree = () => {
    // Math.floor(Math.random() * (max - min + 1)) + min
    let amount = Math.floor(Math.random() * (7 - 5 + 1)) + 5
    amount *= Game.state.stats.resourceOnClickMulti

    if (Game.state.worldResources[0].amount >= amount) {
      Game.earn('wood', amount)
    } else {
      amount = Game.state.worldResources[0].amount
      Game.earn('wood', amount)
    }

    Game.addLog(`You chopped ${amount} wood`)
  }

  Game.mineRock = () => {
    // Math.floor(Math.random() * (max - min + 1)) + min
    let amount = Math.floor(Math.random() * (5 - 3 + 1)) + 3
    amount *= Game.state.stats.resourceOnClickMulti

    if (Game.state.worldResources[1].amount >= amount) {
      Game.earn('stone', amount)
    } else {
      amount = Game.state.worldResources[1].amount
      Game.earn('stone', amount)
    }
    Game.addLog(`You mined ${amount} stone`)
  }

  Game.mineCoal = () => {
    let amount = 1
    amount *= Game.state.stats.resourceOnClickMulti
    if (Game.state.worldResources[2].amount >= amount) {
      Game.earn('coal', amount)
    } else {
      amount = 0
      Game.earn('coal', amount)
    }

    Game.addLog(`You mined ${amount} coal`)
  }

  Game.mineCopper = () => {
    let amount = 1
    amount *= Game.state.stats.resourceOnClickMulti
    if (Game.state.worldResources[3].amount >= amount) {
      Game.earn('copper', amount)
    } else {
      amount = 0
      Game.earn('copper', amount)
    }

    Game.addLog(`You mined ${amount} copper`)
  }

  Game.mineIron = () => {
    let amount = 1
    amount *= Game.state.stats.resourceOnClickMulti
    if (Game.state.worldResources[4].amount >= amount) {
      Game.earn('iron', amount)
    } else {
      amount = 0
      Game.earn('iron', amount)
    }

    Game.addLog(`You mined ${amount} iron`)
  }

  Game.burnWood = () => {
    if (Game.state.wood >= 2) {
      Game.state.wood -= 2
      Game.state.coal++

      Game.rebuildInventory = 1
    } else {
      Game.addLog('Not enough resources', 'darkred')
    }
  }

  Game.smeltCopper = () => {
    if (Game.state.copper >= 2) {
      Game.state.copper -= 2
      Game.state.copperPlate++

      Game.rebuildInventory = 1
    } else {
      Game.addLog('Not enough resources', 'darkred')
    }
  }

  Game.smeltIron = () => {
    if (Game.state.iron >= 2) {
      Game.state.iron -= 2
      Game.state.ironPlate++

      Game.rebuildInventory = 1
    } else {
      Game.addLog('Not enough resources', 'darkred')
    }
  }

  Game.buildMiningDrill = () => {
    Game.state.miningDrillsInfo.owned++
    Game.state.miningDrillsInfo.inactive++
    Game.state.stats.totalBuildsManuallyFired++
    Game.rebuildSelectedTab = 1
    Game.addLog('You crafted a mining drill')
  }

  Game.buildFurnace = () => {
    Game.state.furnacesInfo.owned++
    Game.state.furnacesInfo.inactive++
    Game.state.stats.totalBuildsManuallyFired++
    Game.addLog('You crafted a furnace')

    // UNLOCK NEW BUTTONS
    if (select(Game.actions, "BURN WOOD").locked == 1) {
      select(Game.actions, "BURN WOOD").locked = 0
      select(Game.actions, "SMELT COPPER").locked = 0
      select(Game.actions, "SMELT IRON").locked = 0
    }

    Game.rebuildSelectedTab = 1
  }

  Game.buildRedScience = () => {
    Game.state.redScience++
    Game.state.stats.totalBuildsManuallyFired++

    Game.addLog('You crafted a red science')

    Game.rebuildInventory = 1
  }

  Game.buildBlueScience = () => {
    Game.state.blueScience++
    Game.state.stats.totalBuildsManuallyFired++

    Game.addLog('You crafted a blue science')

    Game.rebuildInventory = 1
  }

  Game.buildLab = () => {
    Game.state.labs.owned++
    Game.state.stats.totalBuildsManuallyFired++

    let redScience = select(Game.actions, "BUILD RED SCIENCE")
    if (redScience.locked == 1) redScience.locked = 0

    Game.rebuildSelectedTab = 1
    Game.addLog('You crafted a lab')

    if (Game.state.tabs[2].locked == true) {
      Game.state.tabs[2].locked = false
      Game.rebuildTabs = 1
    }
  }

  Game.buildTrain = () => {
    Game.state.trains.owned++

    Game.addLog('You made a train')

    Game.rebuildInventory = 1
  }

  Game.buildIronGear = () => {
    Game.state.ironGear++

    Game.addLog('You made an iron gear')

    Game.rebuildInventory = 1
  }

  Game.buildCopperCoil = () => {
    Game.state.copperCoil += 1

    Game.addLog('You crafted a copper coil')

    Game.rebuildInventory = 1
  }

  Game.buildConstructor = () => {
    Game.state.constructorInfo.owned++
    Game.state.constructorInfo.inactive++

    Game.addLog('You made a constructor')
  }

  Game.buildBasicCircuit = () => {
    Game.state.basicCircuit += 1

    Game.addLog('You made a basic circuit')

    Game.rebuildInventory = 1
  }

  Game.addConstructorMaterial = () => {

    let firstValue, firstValueAmount, secondValue, secondValueAmount
    firstValue = s(`#constructor-materials-1`).value
    firstValueAmount = s('#constructor-materials-amount-1').value
    if (s(`#constructor-materials-2`)) {secondValue = s(`#constructor-materials-2`).value; secondValueAmount = s(`#constructor-materials-amount-2`).value}

    if (Game.state.emptyConstructor.materials < 2) {
      Game.state.emptyConstructor.materials += 1

      s('.constructor-materials-container').innerHTML +=  `
        <div class="row">
          <select id='constructor-materials-${Game.state.emptyConstructor.materials}' style='flex-grow: 1'>
            <option selected disabled>Select a material</option>
            <option value="wood">Wood</option>
            <option value="stone">Stone</option>
            <option value="coal">Coal</option>
            <option value="copper">Copper</option>
            <option value="iron">Iron</option>
            <option value="copperPlate">Copper Plate</option>
            <option value="ironPlate">Iron Plate</option>
            <option value="copperCoil">Copper Coil</option>
            <option value="ironPlate">Iron Plate</option>
          </select>
          <input id='constructor-materials-amount-${Game.state.emptyConstructor.materials}' style='width: 40px;' type="number" min='1' max='10'/>
        </div>
      `

      s(`#constructor-materials-1`).value = firstValue
      s(`#constructor-materials-amount-1`).value = firstValueAmount
      if (secondValue) {s(`#constructor-materials-2`).value = secondValue; s(`#constructor-materials-amount-2`).value = secondValueAmount}
    } else {
      Game.addLog('You can only have a max of 2 materials', 'darkred')
    }
  }

  Game.addLog = (txt, txtColor) => {
    let newLog = document.createElement('p')
    newLog.classList.add('log')

    newLog.innerHTML = txt

    if (txtColor) newLog.style.color = txtColor

    s('.logs-container').prepend(newLog)

    let allLogs = document.querySelectorAll('.log')
    if (allLogs[11]) allLogs[11].style.opacity = '.8'
    if (allLogs[12]) allLogs[11].style.opacity = '.8'
    if (allLogs[13]) allLogs[11].style.opacity = '.8'
    if (allLogs[14]) allLogs[14].style.opacity = '.6'
    if (allLogs[15]) allLogs[15].style.opacity = '.6'
    if (allLogs[16]) allLogs[16].style.opacity = '.6'
    if (allLogs[17]) allLogs[17].style.opacity = '.3'
    if (allLogs[18]) allLogs[18].style.opacity = '.3'
    if (allLogs[19]) allLogs[19].style.opacity = '.3'
    if (allLogs[20]) allLogs[20].style.opacity = '.1'
    if (allLogs[21]) allLogs[21].style.opacity = '.1'
    if (allLogs[22]) allLogs[22].style.opacity = '.1'
    if (allLogs[23]) allLogs[23].parentNode.removeChild(allLogs[23])
  }

  Game.removeWrapper = () => {
    let wrappers = document.querySelectorAll('.wrapper');
    wrappers.forEach((wrapper) => {
      wrapper.parentNode.removeChild(wrapper)
    })
    Game.state.emptyConstructor.materials = 1
  }

  Game.headerFillers = [
    'Automate my automations',
    'Why was the robot mad? People kept pushing its buttons.',
    'If I was a robot and you were one too, if I lost a nut... would you give me a screw?',
    'More wood, more wood!',
    'Chop my morning wood. Or evening wood... that\'s fine too.',
    'Just keep digging, just keep digging, just digging digging digging.',
    'As you can tell, these are lame. Submit your own to /u/name_is_Syn.'
  ]

  let nextFillerTxt = []

  Game.updateHeader = () => {
    let chanceToShow = .4

    if (nextFillerTxt.length == 0) {
      if (Math.random() <= chanceToShow) {
        let txt = s('.header-filler')
        let selectedTxt = Game.headerFillers[choose(Game.headerFillers)]
        txt.innerHTML = `&nbsp;- ${selectedTxt}`
        txt.style.left = '0px';
        setTimeout(() => {
          txt.style.left = '2000px';
        }, 8000)
      }
    }


    setTimeout(() => {Game.updateHeader()}, 12000)
  }

  let counter = 0
  Game.logic = () => {
    counter++

    if (counter % 30 == 0) Game.earnPassiveResources()

    if (Game.rebuildInventory) Game.buildInventory()
    if (Game.rebuildTabs) Game.buildTabs()
    if (Game.rebuildSelectedTab) Game.buildSelectedTab()
    if (Game.rebuildWorldResources) Game.buildWorldResources()
    if (Game.recalculateRemainingTechDuration) Game.calculateRemainingTechDuration()
    if (Game.state.trains.owned > 0) Game.trainStuff()

    for (i in Game.actions) {
      if (Game.actions[i].tab == 'GATHER') {
        if (Game.actions[i].cooldown) {
          if (Game.actions[i].currentCooldown != null) {
            Game.updateCooldown(i)
          }
        }
      }
    }

    if (Game.state.buildQueue) {
      // Game.updateBuildQueue()
      if (Game.state.buildQueue.length > 0) {
        Game.updateBuildQueue()
      }
    }

    setTimeout(Game.logic, 1000/30)
  }

  Game.load()
  Game.logic()

  let clickCounter = 0;
  s('header').onclick = () => {
    clickCounter++
    if (clickCounter > 7) {
      Game.addLog('CHEATS ENABLED')
      Game.state.wood += 200
      Game.state.stone += 200
      Game.state.iron += 200
      Game.state.coal += 200
      Game.state.copper += 200
      Game.state.ironPlate += 200
      Game.state.copperPlate += 200
      Game.state.redScience += 200
      Game.state.blueScience += 200
      Game.state.ironGear += 200
      Game.state.copperCoil += 200
      Game.buildInventory()
      for (i=0; i<Game.technologies.length; i++) {
        Game.technologies[i].duration = 1
      }
      for (i=0; i<Game.actions.length; i++) {
        Game.actions[i].cooldown = .5
      }
    }
  }




}

window.onload = () => Game.launch()
