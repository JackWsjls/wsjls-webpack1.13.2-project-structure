// 版本控制的node的插件semver 
var semver = require('semver');
// 解释 命令行彩色输出
var chalk = require('chalk');
var packageConfig = require('../package.json')

var exec = function(cmd) {
  return require('child_process')
    .execSync(cmd).toString().trim()
}

var versionRequirements = [{
  name: 'node',
  // 去掉版本中的字母
  currentVersion: semver.clean(process.version),
  versionRequirement: packageConfig.engines.node
}, {
  name: 'npm',
  currentVersion: exec('npm --version'),
  versionRequirement: packageConfig.engines.npm
}]

module.exports = function() {
  var warnings = []
  for (var i = 0; i < versionRequirements.length; i++) {
    var mod = versionRequirements[i]
    // semver.satisfies 前一项是否满足后一项的规则
    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      warnings.push(mod.name + ': ' +
        chalk.red(mod.currentVersion) + ' should be ' +
        chalk.green(mod.versionRequirement)
      )
    }
  }

  if (warnings.length) {

    console.log(chalk.yellow('To use this template, you must update following to modules:'))

    for (var i = 0; i < warnings.length; i++) {
      var warning = warnings[i]
      console.log('  ' + warning)
    }

    process.exit(1)
  }
}
