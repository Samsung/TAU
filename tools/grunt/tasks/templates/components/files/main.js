'use strict';
var pkg = require('./package');

module.exports = {
    consumeCloset: function(closetProvider) {
        closetProvider.getPackageRegister(pkg.name)
            .registerComponents(pkg.components)
            .registerAppTemplates(pkg.appTemplate)
            .registerPageTemplates(pkg.pageTemplate)
    }
};