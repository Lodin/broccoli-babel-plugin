var Jasmine = require('jasmine');
var SpecReporter = require('jasmine-spec-reporter');
var jrunner = new Jasmine();

jrunner.configureDefaultReporter({print: function() {}});
jasmine.getEnv().addReporter(new SpecReporter({displaySpecDuration: true}));
jrunner.loadConfigFile();
jrunner.execute();
