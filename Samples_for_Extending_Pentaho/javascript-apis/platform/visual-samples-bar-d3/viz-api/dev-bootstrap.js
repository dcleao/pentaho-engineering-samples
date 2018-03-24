(function (global) {
  var basePath = "viz-api";

  var requireCfg = { paths: {}, shim: {}, map: { "*": {} }, bundles: {}, config: {}, packages: [] };

  var useDebug = typeof document === "undefined" || document.location.href.indexOf("debug=true") > 0;
  var minSuffix = useDebug ? "" : ".min";
  var requirePaths = requireCfg.paths;
  var requireShim = requireCfg.shim;
  var requireMap = requireCfg.map;

  var requireTypeInfo = requireCfg.config["pentaho/typeInfo"] || (requireCfg.config["pentaho/typeInfo"] = {});
  var requireInstInfo = requireCfg.config["pentaho/instanceInfo"] || (requireCfg.config["pentaho/instanceInfo"] = {});

  // region Pentaho Platform JavaScript APIs (Core, Data, Visual)

  // Unfortunately, *mantle* already maps the "pentaho" id to "/js",
  // so the paths of all of the following sub-modules must be configured individually.
  // E.g. requirePaths["pentaho/util"] = basePath + "/pentaho/util";
  [
    "shim", "util", "lang",
    "i18n", "service", "data", "type", "typeInfo", "instanceInfo",
    "visual", "config", "environment", "debug", "ccc"
  ].forEach(function (name) {
    requirePaths["pentaho/" + name] = basePath + "/pentaho/" + name;
  });

  // Named instances
  requireInstInfo["pentaho/config/impl/instanceOfAmdLoadedService"] = { type: "pentaho.config.IService" };

  requireTypeInfo["pentaho/type/instance"] = { alias: "instance" };
  requireTypeInfo["pentaho/type/value"] = { alias: "value", base: "instance" };
  requireTypeInfo["pentaho/type/property"] = { alias: "property", base: "instance" };
  requireTypeInfo["pentaho/type/list"] = { alias: "list", base: "value" };
  requireTypeInfo["pentaho/type/element"] = { alias: "element", base: "value" };
  requireTypeInfo["pentaho/type/complex"] = { alias: "complex", base: "element" };
  requireTypeInfo["pentaho/type/simple"] = { alias: "simple", base: "element" };
  requireTypeInfo["pentaho/type/number"] = { alias: "number", base: "simple" };
  requireTypeInfo["pentaho/type/string"] = { alias: "string", base: "simple" };
  requireTypeInfo["pentaho/type/boolean"] = { alias: "boolean", base: "simple" };
  requireTypeInfo["pentaho/type/date"] = { alias: "date", base: "simple" };
  requireTypeInfo["pentaho/type/object"] = { alias: "object", base: "simple" };
  requireTypeInfo["pentaho/type/function"] = { alias: "function", base: "simple" };
  requireTypeInfo["pentaho/type/typeDescriptor"] = {alias: "type", base: "simple"};
  requireTypeInfo["pentaho/type/mixins/enum"] = { alias: "enum", base: "element" };
  requireTypeInfo["pentaho/type/action/base"] = { base: "element" };

  requireTypeInfo["pentaho/data/filter/abstract"] = { base: "complex" };
  requireTypeInfo["pentaho/data/filter/true"] = { alias: "true", base: "pentaho/data/filter/abstract" };
  requireTypeInfo["pentaho/data/filter/false"] = { alias: "false", base: "pentaho/data/filter/abstract" };
  requireTypeInfo["pentaho/data/filter/tree"] = { base: "pentaho/data/filter/abstract" };
  requireTypeInfo["pentaho/data/filter/or"] = { alias: "or", base: "pentaho/data/filter/tree" };
  requireTypeInfo["pentaho/data/filter/and"] = { alias: "and", base: "pentaho/data/filter/tree" };
  requireTypeInfo["pentaho/data/filter/not"] = { alias: "not", base: "pentaho/data/filter/abstract" };
  requireTypeInfo["pentaho/data/filter/property"] = { base: "pentaho/data/filter/abstract" };
  requireTypeInfo["pentaho/data/filter/isEqual"] = { alias: "=", base: "pentaho/data/filter/property" };
  requireTypeInfo["pentaho/data/filter/isIn"] = { alias: "in", base: "pentaho/data/filter/property" };
  requireTypeInfo["pentaho/data/filter/isGreater"] = { alias: ">", base: "pentaho/data/filter/property" };
  requireTypeInfo["pentaho/data/filter/isGreaterOrEqual"] = { alias: ">=", base: "pentaho/data/filter/property" };
  requireTypeInfo["pentaho/data/filter/isLess"] = { alias: "<", base: "pentaho/data/filter/property" };
  requireTypeInfo["pentaho/data/filter/isLessOrEqual"] = { alias: "<=", base: "pentaho/data/filter/property" };
  requireTypeInfo["pentaho/data/filter/isLike"] = { alias: "like", base: "pentaho/data/filter/property" };

  requireTypeInfo["pentaho/visual/base/model"] = {base: "complex"};
  requireTypeInfo["pentaho/visual/base/view"] = {
    base: "complex",
    props: {
      model: { valueType: "pentaho/visual/base/model" }
    }
  };
  requireTypeInfo["pentaho/visual/role/adaptation/strategy"] = {base: "complex"};
  requireTypeInfo["pentaho/visual/role/adaptation/identityStrategy"] = {
    base: "pentaho/visual/role/adaptation/strategy"
  };
  // endregion

  // region Base AMD Plugins
  requirePaths["json"] = basePath + "/util/require-json/json";
  requirePaths["text"] = basePath + "/util/require-text/text";
  // Using `map` is important for use in r.js and correct AMD config of the other files of the package.
  // Placing the minSuffix in the path ensures building works well,
  // so that the resolved module id is the same in both debug and non-debug cases.
  if (minSuffix) {
    requirePaths["common-ui/util/require-css/css"] = basePath + "/util/require-css/css" + minSuffix;
  }
  requireMap["*"]["css"] = "common-ui/util/require-css/css";
  // endregion

  // region Type API and Visualization Models Packages and Themes
  function mapTheme(mid, themeRoot, themes) {
    var theme = (typeof active_theme !== "undefined") ? active_theme : null;
    if (!theme || themes.indexOf(theme) < 0) theme = themes[0];

    // e.g. "/theme" -> "/themes/crystal"
    requireMap["*"][mid + "/theme"] = mid + "/" + themeRoot + "/" + theme;
  }

  // Type API Base Theme
  mapTheme("pentaho/type", "themes", ["ruby"]);

  // Visual Models Themes
  mapTheme("pentaho/visual/models", "themes", ["crystal", "sapphire", "onyx", "det", "ruby"]);

  // sample/calc theme
  mapTheme("pentaho/visual/samples/calc", "themes", ["ruby"]);

  requireInstInfo["pentaho/visual/config/vizApi.conf"] = { type: "pentaho.config.spec.IRuleSet" };

  requireTypeInfo["pentaho/visual/models/abstract"] = { base: "pentaho/visual/base/model" };
  requireTypeInfo["pentaho/visual/samples/calc/model"] = { base: "pentaho/visual/base/model" };
  [
    "pentaho/visual/models/cartesianAbstract",
    "pentaho/visual/models/categoricalContinuousAbstract",
    "pentaho/visual/models/barAbstract",
    "pentaho/visual/models/barNormalizedAbstract",
    "pentaho/visual/models/barHorizontal",
    "pentaho/visual/models/bar",
    "pentaho/visual/models/barStacked",
    "pentaho/visual/models/barStackedHorizontal",
    "pentaho/visual/models/barNormalized",
    "pentaho/visual/models/barNormalizedHorizontal",
    "pentaho/visual/models/barLine",
    "pentaho/visual/models/line",
    "pentaho/visual/models/pointAbstract",
    "pentaho/visual/models/metricPointAbstract",
    "pentaho/visual/models/areaStacked",
    "pentaho/visual/models/pie",
    "pentaho/visual/models/heatGrid",
    "pentaho/visual/models/sunburst",
    "pentaho/visual/models/donut",
    "pentaho/visual/models/scatter",
    "pentaho/visual/models/bubble"
  ].forEach(function (name) {
    requireTypeInfo[name] = { base: "pentaho/visual/models/abstract" };
  });
  // endregion

  // TODO: this should be removed from here, and to the GEO plugin's package.json
  // when it is possible to specify global maps or an option that achieves the same effect.
  requireMap["*"]["pentaho/visual/models/geoMap"] = "pentaho/geo/visual_${project.version}/model";
  requireMap["*"]["pentaho/geo/visual/map"] = "pentaho/geo/visual_${project.version}/view";

  // VizAPI actions
  requireTypeInfo["pentaho/visual/action/base"] = {base: "pentaho/type/action/base"};
  requireTypeInfo["pentaho/visual/action/select"] = {alias: "select", base: "pentaho/visual/action/base"};
  requireTypeInfo["pentaho/visual/action/execute"] = {alias: "execute", base: "pentaho/visual/action/base"};
  requireTypeInfo["pentaho/visual/action/update"] = {base: "pentaho/visual/action/base"};

  // Color Palettes
  requireTypeInfo["pentaho/visual/color/palette"] = { base: "complex" };

  [
    "pentaho/visual/color/palettes/nominalPrimary",
    "pentaho/visual/color/palettes/nominalNeutral",
    "pentaho/visual/color/palettes/nominalLight",
    "pentaho/visual/color/palettes/nominalDark",
    "pentaho/visual/color/palettes/quantitativeBlue3",
    "pentaho/visual/color/palettes/quantitativeBlue5",
    "pentaho/visual/color/palettes/quantitativeGray3",
    "pentaho/visual/color/palettes/quantitativeGray5",
    "pentaho/visual/color/palettes/divergentRyg3",
    "pentaho/visual/color/palettes/divergentRyg5",
    "pentaho/visual/color/palettes/divergentRyb3",
    "pentaho/visual/color/palettes/divergentRyb5"
  ].forEach(function (id) {
    requireInstInfo[id] = { type: "pentaho/visual/color/palette" };
  });

  requirePaths["pentaho/i18n"] = basePath + "/i18nMock";
  requirePaths["pentaho/i18n/MessageBundle"] = basePath + "/pentaho/i18n/MessageBundle";

  require.config(requireCfg);

  define("vizapi-dev-init", function () {
    return function(package) {
      var config = {paths: {}};

      config.paths[package.name] = ".";

      if(package.dependencies) {
        for(var key in package.dependencies) {
          if(package.dependencies.hasOwnProperty(key)) {
            config.paths[key] = "./node_modules/" + key;
          }
        }
      }

      if(package.config) {
        config.config = package.config;
      }

      require.config(config);
    };
  });
})(window);
