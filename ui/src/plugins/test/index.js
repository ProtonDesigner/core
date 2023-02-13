'use strict';

function getAugmentedNamespace(n) {
  if (n.__esModule) return n;
  var f = n.default;
	if (typeof f == "function") {
		var a = function a () {
			if (this instanceof a) {
				var args = [null];
				args.push.apply(args, arguments);
				var Ctor = Function.bind.apply(f, args);
				return new Ctor();
			}
			return f.apply(this, arguments);
		};
		a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

var lib = {};

Object.defineProperty(lib, "__esModule", { value: true });
var ProtonPlugin$1 = /** @class */ (function () {
    function ProtonPlugin(project) {
        this.project = project;
    }
    ProtonPlugin.prototype.invoke = function (command, args) {
        var func = this[command];
        if (func) {
            var _args = args ? args : {};
            func.apply(void 0, _args);
        }
    };
    ProtonPlugin.prototype.editor_saveProject = function () { };
    ProtonPlugin.prototype.editor_addElement = function (_a) {
        _a.element;
    };
    ProtonPlugin.prototype.editor_deleteElement = function (_a) {
        _a.elementUID;
    };
    return ProtonPlugin;
}());
lib.default = ProtonPlugin$1;

module.exports = {
    default: (msg) => {
        console.log(msg);
    }
};

var test$1 = /*#__PURE__*/Object.freeze({
	__proto__: null
});

var require$$1 = /*@__PURE__*/getAugmentedNamespace(test$1);

module.exports = {
    color: "red",
    settings: [
        {
            id: "color",
            type: "string",
            required: true,
            defaultValue: "blue"
        }
    ]
};

const plugin = lib;
const { default: test } = require$$1;


const ProtonPlugin = plugin.default;

class MyPlugin extends ProtonPlugin {
    editor_addElement() {
        test("yooo");
    }
}

var src = {
    MyPlugin
};

module.exports = src;
