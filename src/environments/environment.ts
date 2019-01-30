// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // introsys apiUrl: `http://172.18.3.86:80/api/v1`,
  apiUrl: `http://192.168.15.1:80/api/v1`,
  // Fortiss for automatica tests  apiUrl: `http://10.0.2.214:80/api/v1`,
  //cloudUrl: `http://nancy:9993/api/v1`,
  //apiUrl: 'http://weplus72:80/api/v1',
  //apiUrl: 'http://10.5.89.89:80/api/v1',
  //apiUrl: 'http://158.125.157.53:80/api/v1',
  
  // introsys cloudUrl: `http://172.18.3.87:9993/api/v1`,
  //cloudUrl: 'http://weplus72:9993/api/v1',
  cloudUrl: 'http://nancy:9993/api/v1',
  //cloudUrl: 'http://10.5.73.172:9993/api/v1',
  //cloudUrl: 'http://158.125.157.53:9993/api/v1',

  t42Url: 'http://nancy:3000',

  recommendationSystemUrl: 'http://nancy:8885/api/v1',

  paramSeparator: "<",
  paramValueSeparator: ">",

  subSystemMarkerPrefix: "ss",
  moduleMarkerPrefix: "m",
  skillMarkerPrefix: "sk",
  recipeMarkerPrefix: "r",

  subSystemMarker: "ss>",
  moduleMarker: "m>",
  skillMarker: "sk>",
  recipeMarker: "r>",

  acceptTermTooltip: 'Accept conditions',

  lastComponentNameTag: 'lastComponentName',

  HOMEPAGE: '/',
  SUBSYSTEMS_LIST: '/subSystems',

  systemStage: ['Production', 'Pre_Production', 'Ramp_Up'],
  systemStage_production: 'Production',
  systemStage_preproduction: 'Pre_Production',
  systemStage_rampup: 'Ramp_Up',


  orderPriorityPossibility: ['Normal', 'Rush'],

  // Observations main type and relative subtypes
  observationMainType: ['Functionality', 'Quality', 'Performance'],
  // Sub Types for each main type
  /*functionalitySubType: ['Temperature', 'Pressure', 'Voltage', 'Current', 'Flow', 'Force'],
  qualitySubType: ['Noise', 'Vibration'],
  performanceSubType: ['Energy Consumption', 'Operational Speed']*/

  functionalitySubType: [{
                          name: 'Temperature',
                          units: ['C']
                        }, {
                          name: 'Pressure',
                          units: ['Pa', 'Psi']
                        }, {
                          name: 'Voltage',
                          units: ['V']
                        }, {
                          name: 'Current',
                          units: ['A']
                        }, {
                          name: 'Flow',
                          units: ['m3/s']
                        }, {
                          name: 'Force',
                          units: ['N']
                        }],
  qualitySubType: 	[{
                      name: 'Noise',
                      units: ['dB']
                    }, {
                      name: 'Vibration',
                      units: ['Hz']
                    }],
  performanceSubType: 	[{
                          name: 'Energy Consumption',
                          units: ['kW/h', 'kW/yr']
                        }, {
                          name: 'Operational Speed',
                          units: ['m/s']
                        }]

};
