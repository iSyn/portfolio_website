let Technology = function(tech) {
  this.name = tech.name
  this.functionName = tech.name.replace(/ /g,'-').toLowerCase()
  if (tech.img) this.img = tech.img
  this.price = tech.price
  this.tooltip = tech.tooltip
  if (!tech.learned) this.learned = 0
  this.locked = tech.locked
  if (!tech.inProgress) {
    this.inProgress = false
  } else {
    this.inProgress = true
  }
  this.duration = tech.duration * 1000
  if (!tech.currentDuration) {
    this.currentDuration = null
  } else {
    this.currentDuration = tech.currentDuration
  }
  if (tech.onFinish) this.onFinish = tech.onFinish
  if (tech.requires) this.requires = tech.requires
  if (tech.onFinishFunc) this.onFinishFunc = tech.onFinishFunc

  Game.technologies.push(this)
}

let technologies = [
  {
    name: 'Metalsmithing I',
    img: 'metalsmithing-i',
    price: {
      RED_SCIENCE: 3
    },
    locked: 0,
    tooltip: `<h4>METALSMITHING I</h4><hr/><p><strong>Cost: 3 red science</strong></p><p><i>Enables the building of basic metal items</i></p><hr /><p>3 seconds</p>`,
    duration: 15,
    onFinish: {
      unlockTech: ['Metalsmithing II', 'Autonomy I', 'Locomotion'],
      unlockAction: ['BUILD IRON GEAR', 'BUILD COPPER COIL']
    }
  },
  {
    name: 'Metalsmithing II',
    img: 'metalsmithing-ii',
    price: {
      RED_SCIENCE: 100
    },
    locked: 1,
    tooltip: `<h4>METALSMITHING II</h4><hr/><p><strong>Cost: 100 red science</strong></p><p><i>Enables the building of intermediate metal items</i></p><hr /><p>10 seconds</p>`,
    duration: 10,
    requires: 'Metalsmithing I'
  },
  {
    name: 'Autonomy I',
    img: 'automation-i',
    price: {
      RED_SCIENCE: 5
    },
    locked: 1,
    tooltip: `<h4>AUTONOMY I</h4><hr/><p><strong>Cost: 5 red science</strong></p><p><i>Enables the building of constructors</i></p><hr/><p>10 seconds</p>`,
    duration: 20,
    onFinish: {
      unlockTech: ['Autonomy II'],
      unlockAction: ['BUILD CONSTRUCTOR']
    },
    requires: 'Metalsmithing I'
  },
  {
    name: 'Autonomy II',
    img: 'automation-ii',
    price: {
      RED_SCIENCE: 70,
      BLUE_SCIENCE: 50
    },
    locked: 1,
    tooltip: `<h4>AUTONOMY II</h4><hr/><p><strong>Cost: 50 red science, 50 blue science</strong></p><p><i>Enables the building of advanced constructors</i></p><hr/><p>2 minutes</p>`,
    duration: 120,
    requires: 'Autonomy I'
  },
  {
    name: 'Fuel Efficiency I',
    img: 'fuel-efficiency-i',
    price: {
      RED_SCIENCE: 20
    },
    locked: 0,
    tooltip: `<h4>FUEL EFFICIENCY I</h4><hr/><p><strong>Cost: 10 red science</strong></p><p><i>Fuel is now 1.5x more efficient</i></p><hr/><p>10 seconds</p>`,
    duration: 20,
    onFinish: {
      unlockTech: ['Fuel Efficiency II']
    },
    onFinishFunc: () => Game.state.stats.resourceNeededMulti *= .5
  },
  {
    name: 'Fuel Efficiency II',
    img: 'fuel-efficiency-ii',
    price: {
      RED_SCIENCE: 100,
      BLUE_SCIENCE: 50
    },
    locked: 1,
    tooltip: `<h4>FUEL EFFICIENCY II</h4><hr/><p><strong>Cost: 100 red science, 50 blue science</strong></p><p><i>Fuel is now 1.5x even more efficient</i></p><hr/><p>5 minutes</p>`,
    duration: 300,
    requires: 'Fuel Efficiency I',
    onFinishFunc: () => Game.state.stats.resourceNeededMulti *= .5
  },
  {
    name: 'Locomotion',
    desc: 'Enables the building of trains',
    img: 'locomotion',
    price: {
      RED_SCIENCE: 30
    },
    locked: 1,
    tooltip: `<h4>LOCOMOTION</h4><hr/><p><strong>Cost: 30 red science</strong></p><p><i>Enables the building of trains (auto-exploration)</i></p><hr/><p>30 seconds</p>`,
    duration: 30,
    requires: 'Metalsmithing I'
  },
  {
    name: 'Enhanced Senses I',
    price: {
      RED_SCIENCE: 10
    },
    img: 'enhanced-senses-i',
    locked: 0,
    tooltip: `<h4>ENHANCED SENSES I</h4><hr><p><strong>Cost: 20 red science</strong></p><p><i>100% chance of finding something while exploring</i></p><hr/><p>20 seconds</p>`,
    duration: 20,
    onFinish: {
      unlockTech: ['Enhanced Senses II']
    }
  },
  {
    name: 'Enhanced Senses II',
    price: {
      RED_SCIENCE: 40,
      BLUE_SCIENCE: 20
    },
    img: 'enhanced-senses-ii',
    locked: 1,
    tooltip: `<h4>ENHANCED SENSES II</h4><hr /><p><strong>Cost: 40 red science, 20 blue science</strong></p><p><i>Increases the amount of ore found while exploring</i></p><p>1 minute</p>`,
    duration: 60,
    requires: 'Enhanced Senses I'
  },
  {
    name: 'Intermediate Science',
    price: {
      RED_SCIENCE: 100
    },
    img: 'intermediate-science',
    locked: 0,
    tooltip: `<h4>INTERMEDIATE SCIENCE</h4><hr/><p><strong>Cost: 100 red science</strong></p><p><i>Allows the creation of blue science</i></p><hr/><p>1 minute</p>`,
    duration: 60,
    onFinish: {
      unlockTech: ['Advanced Science'],
      unlockAction: ['BUILD BLUE SCIENCE']
    }
  },
  {
    name: 'Advanced Science',
    price: {
      BLUE_SCIENCE: 100
    },
    locked: 1,
    tooltip: `<h4>ADVANCED SCIENCE</h4><hr/><p><strong>Cost: 100 blue science</strong></p><p><i>Allows the creation of black science</i></p><hr/><p>2 minutes</p>`,
    duration: 120,
    requires: 'Intermediate Science'
  },
  // {
  //   name: 'Rocket Science',
  //   price: {
  //     BLACK_SCIENCE: 100
  //   },
  //   locked: 1,
  //   tooltip: `<h4>ROCKET SCIENCE</h4><hr /><p><strong>Cost: 100 black science</strong></p><p><i>Allows the creation of rocket fuel</i></p><hr /><p>5 minutes</p>`,
  //   duration: 300,
  //   requires: 'Advanced Science'
  // }
  {
    name: 'Weightlifting I',
    img: 'weightlifting-i',
    price: {
      RED_SCIENCE: 25
    },
    locked: 0,
    tooltip: `<h4>WEIGHTLIFTING I</h4><hr /><p><strong>Cost: 25 red science</strong></p><p><i>Increases the amount of resources get when manually mining/chopping</i></p>`,
    duration: 15,
    onFinish: {
      unlockTech: ['Weightlifting II']
    },
    onFinishFunc: () => Game.state.stats.resourceOnClickMulti++
  },
  {
    name: 'Weightlifting II',
    price: {
      RED_SCIENCE: 300
    },
    locked: 1,
    tooltip: `<h4>WEIGHTLIFTING II</h4><hr /><p><strong>Cost: 300 red science</strong></p><p><i>Increases the amount of resources get on click</i></p>`,
    duration: 60,
    requires: 'Weightlifting I'
  },
  {
    name: 'Steel Processing',
    price: {
      price: {
        RED_SCIENCE: 50
      }
    }
  }


]
