var visualHelpers_1 = require("../../base/spec/visualHelpers");
var chai_1 = require("chai");
var LineUpVisual_1 = require("./LineUpVisual");
var $ = require("jquery");
describe('LineUpVisual', function () {
    var parentEle;
    beforeEach(function () {
        global['d3'] = require("d3");
        global['_'] = require("underscore");
        parentEle = $('<div></div>');
    });
    afterEach(function () {
        if (parentEle) {
            parentEle.remove();
        }
        parentEle = null;
    });
    var createVisual = function () {
        var instance = new LineUpVisual_1.default(true);
        var initOptions = visualHelpers_1.Utils.createFakeInitOptions();
        parentEle.append(initOptions.element);
        instance.init(initOptions);
        return {
            instance: instance,
            element: initOptions.element
        };
    };
    it('should load', function () {
        chai_1.expect(createVisual()).to.not.be.undefined;
    });
    it('should remove columns from LineUp.configuration if columns are removed from PBI', function () {
        var instance = createVisual().instance;
        // Load initial data
        instance.update(visualHelpers_1.Utils.createUpdateOptionsWithData());
        chai_1.expect(instance.lineup.configuration.columns.length).to.be.equal(2);
        // Pretend that we had an existing config
        var config = instance.lineup.configuration;
        var newOptions = visualHelpers_1.Utils.createUpdateOptionsWithSmallData();
        newOptions.dataViews[0].metadata = {
            objects: {
                'layout': {
                    'layout': JSON.stringify(config)
                }
            }
        };
        // Run update again with new options
        instance.update(newOptions);
        // Make sure it removed the extra column
        chai_1.expect(instance.lineup.configuration.columns.length).to.be.equal(1);
    });
    it('should remove sort from LineUp.configuration if columns are removed from PBI', function () {
        var instance = createVisual().instance;
        // Load initial data
        var data = visualHelpers_1.Utils.createUpdateOptionsWithData();
        instance.update(data);
        chai_1.expect(instance.lineup.configuration.columns.length).to.be.equal(2);
        // Pretend that we had an existing config
        var newOptions = visualHelpers_1.Utils.createUpdateOptionsWithSmallData();
        var config = instance.lineup.configuration;
        // Add a sort to the missing data, which in this case is the second column in the original data
        config.sort = {
            // This column is removed in the "Small" dataset
            column: data.dataViews[0].table.columns[1].displayName,
            asc: true
        };
        newOptions.dataViews[0].metadata = {
            objects: {
                'layout': {
                    'layout': JSON.stringify(config)
                }
            }
        };
        // Run update again with new options
        instance.update(newOptions);
        // Make sure it removed the extra column
        chai_1.expect(instance.lineup.configuration.sort).to.be.undefined;
    });
});
