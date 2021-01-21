(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var internal = require("./internal");
var promise = require("./promise");
var onRegisterTimeout;
var whoami;

/**
 * What's the top level module/bundle name.
 * @param moduleQName The module QName.
 * @returns The module QName, or undefined if unknown.
 */
exports.whoami = function(moduleQName) {
    if (moduleQName) {
        whoami = moduleQName;
        internal.whoami(whoami);
    }
    return whoami;
};

/**
 * Asynchronously import/require a set of modules.
 *
 * <p>
 * Responsible for triggering the async loading of modules if a given module is not already loaded.
 *
 * @param moduleQNames... A list of module "qualified" names, each containing the module name prefixed with the namespace
 * and separated by a colon i.e. "<namespace>:<moduleName>" e.g. "jquery:jquery2".
 *
 * @return A Promise, allowing async load of all modules. The promise is only fulfilled when all modules are loaded.
 */
exports.import = function() {
    if (arguments.length === 1) {
        return internal.import(arguments[0], onRegisterTimeout);        
    }
    
    var moduleQNames = [];    
    for (var i = 0; i < arguments.length; i++) {
        var argument = arguments[i];
        if (typeof argument === 'string') {
            moduleQNames.push(argument);
        }
    }
    
    if (moduleQNames.length == 0) {
        throw "No module names specified.";
    }
    
    return promise.make(function (resolve, reject) {
        var fulfillments = [];
        
        function onFulfillment() {
            if (fulfillments.length === moduleQNames.length) {
                var modules = [];
                for (var i = 0; i < fulfillments.length; i++) {
                    if (fulfillments[i].value) {
                        modules.push(fulfillments[i].value);
                    } else {
                        // don't have everything yet so can't fulfill all.
                        return;
                    }
                }
                // If we make it here, then we have fulfilled all individual promises, which 
                // means we can now fulfill the top level import promise.
                resolve(modules);
            }
        }        
        
        // doRequire for each module
        for (var i = 0; i < moduleQNames.length; i++) {           
            function doRequire(moduleQName) {
                var promise = internal.import(moduleQName, onRegisterTimeout);
                var fulfillment = {
                    promise: promise,
                    value: undefined
                };
                fulfillments.push(fulfillment);
                promise
                    .onFulfilled(function(value) {
                        fulfillment.value = value;
                        onFulfillment();
                    })
                    .onRejected(function(error) {
                        reject(error);
                    });
            }
            doRequire(moduleQNames[i]);
        }
    }).applyArgsOnFulfill();    
};

/**
 * Synchronously "require" a module that it already loaded/registered.
 *
 * <p>
 * This function will throw an error if the module is not already loaded via an outer call to 'import'
 * (or 'import').
 *
 * @param moduleQName The module "qualified" name containing the module name prefixed with the namespace
 * separated by a colon i.e. "<namespace>:<moduleName>" e.g. "jquery:jquery2".
 *
 * @return The module.
 */
exports.require = function(moduleQName) {
    var parsedModuleName = internal.parseResourceQName(moduleQName);
    var module = internal.getModule(parsedModuleName);    
    if (!module) {
        throw "Unable to perform synchronous 'require' for module '" + moduleQName + "'. This module is not pre-loaded. " +
            "The module needs to have been asynchronously pre-loaded via an outer call to 'import'.";
    }
    return module.exports;
}

/**
 * Export a module.
 * 
 * @param namespace The namespace in which the module resides, or "undefined" if the modules is in
 * the "global" module namespace e.g. a Jenkins core bundle.
 * @param moduleName The name of the module. 
 * @param module The CommonJS style module, or "undefined" if we just want to notify other modules waiting on
 * the loading of this module.
 * @param onError On error callback;
 */
exports.export = function(namespace, moduleName, module, onError) {
    internal.onReady(function() {
        try {
            var moduleSpec = {namespace: namespace, moduleName: moduleName};
            var moduleNamespaceObj = internal.getModuleNamespaceObj(moduleSpec);
            
            if (moduleNamespaceObj[moduleName]) {
                if (namespace) {
                    throw "Jenkins plugin module '" + namespace + ":" + moduleName + "' already registered.";
                } else {
                    throw "Jenkins global module '" + moduleName + "' already registered.";
                }
            }
            
            if (!module) {
                module = {
                    exports: {}
                };
            } else if (module.exports === undefined) {
                module = {
                    exports: module
                };
            }
            moduleNamespaceObj[moduleName] = module;
            
            // Notify all that the module has been registered. See internal.loadModule also.
            internal.notifyModuleExported(moduleSpec, module.exports);
        } catch (e) {
            console.error(e);
            if (onError) {
                onError(e);
            }
        }
    });
};

/**
 * Add a module's CSS to the browser page.
 * 
 * <p>
 * The assumption is that the CSS can be accessed at e.g.
 * {@code <rootURL>/plugin/<namespace>/jsmodules/<moduleName>/style.css} i.e.
 * the pluginId acts as the namespace.
 * 
 * @param namespace The namespace in which the module resides.
 * @param moduleName The name of the module. 
 * @param onError On error callback;
 */
exports.addModuleCSSToPage = function(namespace, moduleName, onError) {
    internal.onReady(function() {
        try {
            internal.addModuleCSSToPage(namespace, moduleName);
        } catch (e) {
            console.error(e);
            if (onError) {
                onError(e);
            }
        }
    });
};

/**
 * Add a plugin CSS file to the browser page.
 * 
 * @param pluginName The Jenkins plugin in which the module resides.
 * @param cssPath The CSS path. 
 * @param onError On error callback;
 */
exports.addPluginCSSToPage = function(pluginName, cssPath, onError) {
    internal.onReady(function() {
        try {
            internal.addPluginCSSToPage(pluginName, cssPath);
        } catch (e) {
            console.error(e);
            if (onError) {
                onError(e);
            }
        }
    });
};

/**
 * Add CSS file to the browser page.
 * 
 * @param cssPath The CSS path. 
 * @param onError On error callback;
 */
exports.addCSSToPage = function(cssPath, onError) {
    internal.onReady(function() {
        try {           
            internal.addCSSToPage('global', internal.getRootURL() + '/' + cssPath);
        } catch (e) {
            console.error(e);
            if (onError) {
                onError(e);
            }
        }
    });
};

/**
 * Add a javascript &lt;script&gt; element to the document &lt;head&gt;.
 * <p/>
 * Options:
 * <ul>
 *     <li><strong>scriptId</strong>: The script Id to use for the element. If not specified, one will be generated from the scriptSrc.</li>
 *     <li><strong>async</strong>: Asynchronous loading of the script. Default is 'true'.</li>
 *     <li><strong>success</strong>: An optional onload success function for the script element.</li>
 *     <li><strong>error</strong>: An optional onload error function for the script element. This is called if the .js file exists but there's an error evaluating the script. It is NOT called if the .js file doesn't exist (ala 404).</li>
 *     <li><strong>removeElementOnLoad</strong>: Remove the script element after loading the script. Default is 'false'.</li>
 * </ul>
 * 
 * @param scriptSrc The script src.
 * @param options Optional script load options object. See above.
 */
exports.addScript = function(scriptSrc, options) {
    internal.onReady(function() {
        internal.addScript(scriptSrc, options);
    });    
};

/**
 * Set the module registration timeout i.e. the length of time to wait for a module to load before failing.
 *
 * @param timeout Millisecond duration before onRegister times out. Defaults to 10000 (10s) if not specified.
 */
exports.setRegisterTimeout = function(timeout) {
    onRegisterTimeout = timeout;
}

/**
 * Set the Jenkins root/base URL.
 * 
 * @param rootUrl The root/base URL.
 */
exports.setRootURL = function(rootUrl) {
    internal.setRootURL(rootUrl);
};

exports.getRootURL = internal.getRootURL;
exports.getAdjunctURL = internal.getAdjunctURL;

/**
 * Manually initialise the Jenkins Global.
 * <p>
 * This should only ever be called from a test environment.
 */
exports.initJenkinsGlobal = function() {
    internal.initJenkinsGlobal();
};

internal.onJenkinsGlobalInit(function(jenkinsCIGlobal) {
    // For backward compatibility, we need to make some jenkins-js-modules
    // functions globally available e.g. to allow legacy code wait for
    // certain modules to be loaded, as with legacy adjuncts.
    if (!jenkinsCIGlobal._internal) {
        // Put the functions on an object called '_internal' as a way
        // of hinting to people to not use it.
        jenkinsCIGlobal._internal = {
            import: exports.import,
            addScript: internal.addScript
        };
    }
});
},{"./internal":2,"./promise":3}],2:[function(require,module,exports){
var promise = require("./promise");
var windowHandle = require("window-handle");
var jenkinsCIGlobal;
var globalInitListeners = [];
var whoami;

exports.whoami = function(moduleQName) {
    if (moduleQName) {
        whoami = exports.parseResourceQName(moduleQName);
        whoami.nsProvider = getBundleNSProviderFromScriptElement(whoami.namespace, whoami.moduleName);
    }
    return whoami;
};

exports.onReady = function(callback) {
    // This allows test based initialization of jenkins-js-modules when there might 
    // not yet be a global window object.
    if (jenkinsCIGlobal) {
        callback();
    } else {
        windowHandle.getWindow(function() {
            callback();
        });
    }    
};

exports.onJenkinsGlobalInit = function(callback) {
    globalInitListeners.push(callback);
};

exports.initJenkinsGlobal = function() {
    jenkinsCIGlobal = {
    };
    if (globalInitListeners) {
        for (var i = 0; i < globalInitListeners.length; i++) {
            globalInitListeners[i](jenkinsCIGlobal);
        }
    }
};

exports.clearJenkinsGlobal = function() {    
    jenkinsCIGlobal = undefined;
    whoami = undefined;
};

exports.getJenkins = function() {
    if (jenkinsCIGlobal) {
        return jenkinsCIGlobal;
    }
    var window = windowHandle.getWindow();
    if (window.jenkinsCIGlobal) {
        jenkinsCIGlobal = window.jenkinsCIGlobal;
    } else {
        exports.initJenkinsGlobal();
        jenkinsCIGlobal.rootURL = getRootURL();
        window.jenkinsCIGlobal = jenkinsCIGlobal;
    }   
    return jenkinsCIGlobal;
};

exports.getModuleNamespaceObj = function(moduleSpec) {
    if (moduleSpec.namespace) {
        return exports.getNamespace(moduleSpec.namespace);
    } else {
        return exports.getGlobalModules();
    }
}

exports.getNamespace = function(namespaceName) {
    var namespaces = exports.getNamespaces();
    var namespace = namespaces[namespaceName];
    if (!namespace) {
        namespace = {
            globalNS: false            
        };
        namespaces[namespaceName] = namespace;
    }
    return namespace;
};

exports.import = function(moduleQName, onRegisterTimeout) {
    return promise.make(function (resolve, reject) {
        // Some functions here needs to access the 'window' global. We want to make sure that
        // exists before attempting to fulfill the require operation. It may not exists
        // immediately in a test env.
        exports.onReady(function() {
            var moduleSpec = exports.parseResourceQName(moduleQName);
            var module = exports.getModule(moduleSpec);
            
            if (module) {
                // module already loaded
                resolve(module.exports);
            } else {
                if (onRegisterTimeout === 0) {
                    if (moduleSpec.namespace) {
                        throw 'Module ' + moduleSpec.namespace + ':' + moduleSpec.moduleName + ' require failure. Async load mode disabled.';
                    } else {
                        throw 'Global module ' + moduleSpec.moduleName + ' require failure. Async load mode disabled.';
                    }
                }

                // module not loaded. Load async, fulfilling promise once registered
                exports.loadModule(moduleSpec, onRegisterTimeout)
                    .onFulfilled(function (moduleExports) {
                        resolve(moduleExports);
                    })
                    .onRejected(function (error) {
                        reject(error);
                    });
            }
        });
    });    
};

exports.loadModule = function(moduleSpec, onRegisterTimeout) {
    var moduleNamespaceObj = exports.getModuleNamespaceObj(moduleSpec);
    var module = moduleNamespaceObj[moduleSpec.moduleName];
    
    if (module) {
        // Module already loaded. This prob shouldn't happen.
        console.log("Unexpected call to 'loadModule' for a module (" + moduleSpec.moduleName + ") that's already loaded.");
        return promise.make(function (resolve) {
            resolve(module.exports);
        });
    }

    function waitForRegistration(loadingModule, onRegisterTimeout) {
        return promise.make(function (resolve, reject) {
            if (typeof onRegisterTimeout !== "number") {
                onRegisterTimeout = 10000;
            }
            
            var timeoutObj = setTimeout(function () {
                // Timed out waiting on the module to load and register itself.
                if (!loadingModule.loaded) {
                    var moduleSpec = loadingModule.moduleSpec;
                    var errorDetail;
                    
                    if (moduleSpec.namespace) {
                        errorDetail = "Timed out waiting on module '" + moduleSpec.namespace + ":" + moduleSpec.moduleName + "' to load.";
                    } else {
                        errorDetail = "Timed out waiting on global module '" + moduleSpec.moduleName + "' to load.";
                    }                    
                    console.error('Module load failure: ' + errorDetail);

                    // Call the reject function and tell it we timed out
                    reject({
                        reason: 'timeout',
                        detail: errorDetail
                    });
                }
            }, onRegisterTimeout);
            
            loadingModule.waitList.push({
                resolve: resolve,
                timeoutObj: timeoutObj
            });                    
        });
    }
    
    var loadingModule = getLoadingModule(moduleNamespaceObj, moduleSpec.moduleName);
    if (!loadingModule.waitList) {
        loadingModule.waitList = [];
    }
    loadingModule.moduleSpec = moduleSpec; 
    loadingModule.loaded = false;

    try {
        return waitForRegistration(loadingModule, onRegisterTimeout);
    } finally {
        // We can auto/dynamic load modules in a non-global namespace. Global namespace modules
        // need to make sure they load themselves (via an adjunct, or whatever).
        if (moduleSpec.namespace) {
            var scriptId = exports.toModuleId(moduleSpec.namespace, moduleSpec.moduleName) + ':js';
            var scriptSrc = exports.toModuleSrc(moduleSpec, 'js');
            var scriptEl = exports.addScript(scriptSrc, {
                scriptId: scriptId,
                scriptSrcBase: ''
            });

            if (scriptEl) {
                // Set the module spec info on the <script> element. This allows us to resolve the
                // nsProvider for that bundle after 'whoami' is called for it (as it loads). whoami
                // is not called with the nsProvider info on it because a given bundle can
                // potentially be loaded from multiple different ns providers, so we only resole the provider
                // at load-time i.e. just after a bundle is loaded it calls 'whoami' for itself
                // and then this module magically works out where it was loaded from (it's nsProvider)
                // by locating the <script> element and using this information. For a module/bundle, knowing
                // where it was loaded from is important because it dictates where that module/bundle
                // should load it dependencies from. For example, the Bootstrap module/bundle depends on the
                // jQuery bundle. So, if the bootstrap bundle is loaded from the 'core-assets' namespace provider,
                // then that means the jQuery bundle should also be loaded from the 'core-assets'
                // namespace provider.
                // See getBundleNSProviderFromScriptElement.
                scriptEl.setAttribute('data-jenkins-module-nsProvider', moduleSpec.nsProvider);
                scriptEl.setAttribute('data-jenkins-module-namespace', moduleSpec.namespace);
                scriptEl.setAttribute('data-jenkins-module-moduleName', moduleSpec.moduleName);
            }
        }
    }
};

exports.addScript = function(scriptSrc, options) {
    if (!scriptSrc) {
        console.warn('Call to addScript with undefined "scriptSrc" arg.');
        return undefined;
    }    
    
    var normalizedOptions;
    
    // If there's no options object, create it.
    if (typeof options === 'object') {
        normalizedOptions = options;
    } else {
        normalizedOptions = {};
    }
    
    // May want to transform/map some urls.
    if (normalizedOptions.scriptSrcMap) {
        if (typeof normalizedOptions.scriptSrcMap === 'function') {
            scriptSrc = normalizedOptions.scriptSrcMap(scriptSrc);
        } else if (Array.isArray(normalizedOptions.scriptSrcMap)) {
            // it's an array of suffix mappings
            for (var i = 0; i < normalizedOptions.scriptSrcMap.length; i++) {
                var mapping = normalizedOptions.scriptSrcMap[i];
                if (mapping.from && mapping.to) {
                    if (endsWith(scriptSrc, mapping.from)) {
                        normalizedOptions.originalScriptSrc = scriptSrc;
                        scriptSrc = scriptSrc.replace(mapping.from, mapping.to);
                        break;
                    }
                }
            }
        }
    }
    
    normalizedOptions.scriptId = getScriptId(scriptSrc, options);
    
    // set some default options
    if (normalizedOptions.async === undefined) {
        normalizedOptions.async = true;
    }
    if (normalizedOptions.scriptSrcBase === undefined) {
        normalizedOptions.scriptSrcBase = '@root';
    }
    
    if (normalizedOptions.scriptSrcBase === '@root') {
        normalizedOptions.scriptSrcBase = getRootURL() + '/';
    } else if (normalizedOptions.scriptSrcBase === '@adjunct') {
        normalizedOptions.scriptSrcBase = getAdjunctURL() + '/';
    }

    var document = windowHandle.getWindow().document;
    var head = exports.getHeadElement();
    var script = document.getElementById(normalizedOptions.scriptId);

    if (script) {
        var replaceable = script.getAttribute('data-replaceable');
        if (replaceable && replaceable === 'true') {
            // This <script> element is replaceable. In this case, 
            // we remove the existing script element and add a new one of the
            // same id and with the specified src attribute.
            // Adding happens below.
            script.parentNode.removeChild(script);
        } else {
            return undefined;
        }
    }

    script = createElement('script');

    // Parts of the following onload code were inspired by how the ACE editor does it,
    // as well as from the follow SO post: http://stackoverflow.com/a/4845802/1166986
    var onload = function (_, isAborted) {
        script.setAttribute('data-onload-complete', true);
        try {
            if (isAborted) {
                console.warn('Script load aborted: ' + scriptSrc);
            } else if (!script.readyState || script.readyState === "loaded" || script.readyState === "complete") {
                // If the options contains an onload function, call it.
                if (typeof normalizedOptions.success === 'function') {
                    normalizedOptions.success(script);
                }
                return;
            }
            if (typeof normalizedOptions.error === 'function') {
                normalizedOptions.error(script, isAborted);
            }
        } finally {
            if (normalizedOptions.removeElementOnLoad) {
                head.removeChild(script);
            }
            // Handle memory leak in IE
            script = script.onload = script.onreadystatechange = null;
        }
    };
    script.onload = onload; 
    script.onreadystatechange = onload;

    script.setAttribute('id', normalizedOptions.scriptId);
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', normalizedOptions.scriptSrcBase + scriptSrc);
    if (normalizedOptions.originalScriptSrc) {
        script.setAttribute('data-referrer', normalizedOptions.originalScriptSrc);        
    }
    if (normalizedOptions.async) {
        script.setAttribute('async', normalizedOptions.async);
    }
    
    head.appendChild(script);
    
    return script;
};

exports.notifyModuleExported = function(moduleSpec, moduleExports) {
    var moduleNamespaceObj = exports.getModuleNamespaceObj(moduleSpec);
    var loadingModule = getLoadingModule(moduleNamespaceObj, moduleSpec.moduleName);
    
    loadingModule.loaded = true;
    if (loadingModule.waitList) {
        for (var i = 0; i < loadingModule.waitList.length; i++) {
            var waiter = loadingModule.waitList[i];
            clearTimeout(waiter.timeoutObj);
            waiter.resolve(moduleExports);
        }
    }    
};

exports.addModuleCSSToPage = function(namespace, moduleName) {
    var moduleSpec = exports.getModuleSpec(namespace + ':' + moduleName);
    var cssElId = exports.toModuleId(namespace, moduleName) + ':css';
    var cssPath = exports.toModuleSrc(moduleSpec, 'css');
    return exports.addCSSToPage(namespace, cssPath, cssElId);
};

exports.addPluginCSSToPage = function(namespace, cssPath, cssElId) {
    var cssPath = exports.getPluginPath(namespace) + '/' + cssPath;
    return exports.addCSSToPage(namespace, cssPath, cssElId);
};

exports.addCSSToPage = function(namespace, cssPath, cssElId) {
    var document = windowHandle.getWindow().document;
    
    if (cssElId === undefined) {
        cssElId = 'jenkins-js-module:' + namespace + ':css:' + cssPath;
    }
    
    var cssEl = document.getElementById(cssElId);
    
    if (cssEl) {
        // already added to page
        return;
    }

    var docHead = exports.getHeadElement();
    cssEl = createElement('link');
    cssEl.setAttribute('id', cssElId);
    cssEl.setAttribute('type', 'text/css');
    cssEl.setAttribute('rel', 'stylesheet');
    cssEl.setAttribute('href', cssPath);
    docHead.appendChild(cssEl);

    return cssEl;
};

exports.getGlobalModules = function() {
    var jenkinsCIGlobal = exports.getJenkins();
    if (!jenkinsCIGlobal.globals) {
        jenkinsCIGlobal.globals = {
            globalNS: true
        };
    }
    return jenkinsCIGlobal.globals;
};

exports.getNamespaces = function() {
    var jenkinsCIGlobal = exports.getJenkins();

    // The namespaces are stored in an object named "plugins". This is a legacy from the
    // time when all modules lived in plugins. By right we'd like to rename this, but
    // that would cause compatibility issues.

    if (!jenkinsCIGlobal.plugins) {
        jenkinsCIGlobal.plugins = {
            __README__: 'This object holds namespaced JS modules/bundles, with the property names representing the module namespace. It\'s name ("plugins") is a legacy thing. Changing it to a better name (e.g. "namespaces") would cause compatibility issues.'
        };
    }
    return jenkinsCIGlobal.plugins;
};

exports.toModuleId = function(namespace, moduleName) {
    return 'jenkins-js-module:' + namespace + ':' + moduleName;
};

exports.toModuleSrc = function(moduleSpec, srcType) {
    var nsProvider = moduleSpec.nsProvider;

    // If a moduleSpec on a module/bundle import doesn't specify a namespace provider
    // (i.e. is of the form "a:b" and not "core-assets/a:b"),
    // then check "this" bundles module spec and see if it was imported from a specific
    // namespace. If it was (e.g. 'core-assets'), then import from that namespace.
    if (nsProvider === undefined) {
        nsProvider = thisBundleNamespaceProvider();
        if (nsProvider === undefined) {
            nsProvider = 'plugin';
        }
        // Store the nsProvider back onto the moduleSpec.
        moduleSpec.nsProvider = nsProvider;
    }

    var srcPath = undefined;
    if (srcType === 'js') {
        srcPath = moduleSpec.moduleName + '.js';
    } else if (srcType === 'css') {
        srcPath = moduleSpec.moduleName + '/style.css';
    } else {
        throw 'Unsupported srcType "'+ srcType + '".';
    }

    if (nsProvider === 'plugin') {
        return exports.getPluginJSModulesPath(moduleSpec.namespace) + '/' + srcPath;
    } if (nsProvider === 'core-assets') {
        return exports.getCoreAssetsJSModulesPath(moduleSpec.namespace) + '/' + srcPath;
    } else {
        throw 'Unsupported namespace provider: ' + nsProvider;
    }
};

exports.getPluginJSModulesPath = function(pluginId) {
    return exports.getPluginPath(pluginId) + '/jsmodules';
};

exports.getCoreAssetsJSModulesPath = function(namespace) {
    return getRootURL() + '/assets/' + namespace + '/jsmodules';
};

exports.getPluginPath = function(pluginId) {
    return getRootURL() + '/plugin/' + pluginId;
};

exports.getHeadElement = function() {
    var window = windowHandle.getWindow();
    var docHead = window.document.getElementsByTagName("head");
    if (!docHead || docHead.length == 0) {
        throw 'No head element found in document.';
    }
    return docHead[0];
};

exports.setRootURL = function(url) {    
    if (!jenkinsCIGlobal) {
        exports.initJenkinsGlobal();
    }
    jenkinsCIGlobal.rootURL = url;
};

exports.parseResourceQName = function(resourceQName) {
    var qNameTokens = resourceQName.split(":");
    if (qNameTokens.length === 2) {
        var namespace = qNameTokens[0].trim();
        var nsTokens = namespace.split("/");
        var namespaceProvider = undefined;
        if (nsTokens.length === 2) {
            namespaceProvider = nsTokens[0].trim();
            namespace = nsTokens[1].trim();
            if (namespaceProvider !== 'plugin' && namespaceProvider !== 'core-assets') {
                console.error('Unsupported module namespace provider "' + namespaceProvider + '". Setting to undefined.');
                namespaceProvider = undefined;
            }
        }
        return {
            nsProvider: namespaceProvider,
            namespace: namespace,
            moduleName: qNameTokens[1].trim()
        };
    } else {
        // The module/bundle is not in a namespace and doesn't
        // need to be loaded i.e. it will load itself and export.
        return {
            moduleName: qNameTokens[0].trim()
        };
    }
};

exports.getModule = function(moduleSpec) {
    if (moduleSpec.namespace) {
        var plugin = exports.getNamespace(moduleSpec.namespace);
        return plugin[moduleSpec.moduleName];
    } else {
        var globals = exports.getGlobalModules();
        return globals[moduleSpec.moduleName];
    }
};

exports.getModuleSpec = function(moduleQName) {
    var moduleSpec = exports.parseResourceQName(moduleQName);
    var moduleNamespaceObj = exports.getModuleNamespaceObj(moduleSpec);
    if (moduleNamespaceObj) {
        var loading = getLoadingModule(moduleNamespaceObj, moduleSpec.moduleName);
        if (loading && loading.moduleSpec) {
            return loading.moduleSpec;
        }
    }
    return moduleSpec;
};

function getScriptId(scriptSrc, config) {
    if (typeof config === 'string') {
        return config;
    } else if (typeof config === 'object' && config.scriptId) {
        return config.scriptId;
    } else {
        return 'jenkins-script:' + scriptSrc;
    }    
}

exports.getRootURL = getRootURL;
function getRootURL() {
    if (jenkinsCIGlobal && jenkinsCIGlobal.rootURL) {
        return jenkinsCIGlobal.rootURL;
    }
    
    var docHead = exports.getHeadElement();
    var resURL = getAttribute(docHead, "data-resurl");

    if (!resURL) {
        var resURL = getAttribute(docHead, "resURL");
    
        if (!resURL) {
            throw "Attribute 'data-resurl' not defined on the document <head> element.";
        }
    }

    if (jenkinsCIGlobal) {
        jenkinsCIGlobal.rootURL = resURL;
    }
    
    return resURL;
}

exports.getAdjunctURL = getAdjunctURL;
function getAdjunctURL() {
    if (jenkinsCIGlobal && jenkinsCIGlobal.adjunctURL) {
        return jenkinsCIGlobal.adjunctURL;
    }
    
    var docHead = exports.getHeadElement();
    var adjunctURL = getAttribute(docHead, "data-adjuncturl");

    if (!adjunctURL) {
        throw "Attribute 'data-adjuncturl' not defined on the document <head> element.";
    }

    if (jenkinsCIGlobal) {
        jenkinsCIGlobal.adjunctURL = adjunctURL;
    }
    
    return adjunctURL;
}

function createElement(name) {
    var document = windowHandle.getWindow().document;
    return document.createElement(name);
}

function getAttribute(element, attributeName) {
    var value = element.getAttribute(attributeName.toLowerCase());
    
    if (value) {
        return value;
    } else {
        // try without lowercasing
        return element.getAttribute(attributeName);
    }    
}

function getLoadingModule(moduleNamespaceObj, moduleName) {
    if (!moduleNamespaceObj.loadingModules) {
        moduleNamespaceObj.loadingModules = {};
    }
    if (!moduleNamespaceObj.loadingModules[moduleName]) {
        moduleNamespaceObj.loadingModules[moduleName] = {};
    }
    return moduleNamespaceObj.loadingModules[moduleName];
}

function endsWith(string, suffix) {
    return (string.indexOf(suffix, string.length - suffix.length) !== -1);
}

function thisBundleNamespaceProvider() {
    if (whoami !== undefined) {
        return whoami.nsProvider;
    }
    return undefined;
}

function getBundleNSProviderFromScriptElement(namespace, moduleName) {
    var docHead = exports.getHeadElement();
    var scripts = docHead.getElementsByTagName("script");

    for (var i = 0; i < scripts.length; i++) {
        var script = scripts[i];
        var elNamespace = script.getAttribute('data-jenkins-module-namespace');
        var elModuleName = script.getAttribute('data-jenkins-module-moduleName');

        if (elNamespace === namespace && elModuleName === moduleName) {
            return script.getAttribute('data-jenkins-module-nsProvider');
        }
    }

    return undefined;
}

},{"./promise":3,"window-handle":4}],3:[function(require,module,exports){
/*
 * Very simple "Promise" impl.
 * <p>
 * Intentionally not using the "promise" module/polyfill because it will add a few Kb and we 
 * only need something very simple here. We really just want to follow the main pattern
 * and don't need some of the fancy stuff.
 * <p>
 * I think so long as we stick to same interface/interaction pattern as outlined in the link
 * below, then we can always switch to the "promise" module later without breaking anything.
 * <p>
 * See https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
 */

exports.make = function(executor) {
    var thePromise = new APromise();
    executor.call(thePromise, function(result) {
        thePromise.resolve(result);
    }, function(reason) {
        thePromise.reject(reason);
    });
    return thePromise;
};

function APromise() {
    this.state = 'PENDING';
    this.whenFulfilled = undefined;
    this.whenRejected = undefined;
    this.applyFulfillArgs = false;
}

APromise.prototype.applyArgsOnFulfill = function() {
    this.applyFulfillArgs = true;
    return this;
}

APromise.prototype.resolve = function (result) {
    this.state = 'FULFILLED';
    
    var thePromise = this;
    function doFulfill(whenFulfilled, result) {
        if (thePromise.applyFulfillArgs) {
            whenFulfilled.apply(whenFulfilled, result);
        } else {
            whenFulfilled(result);
        }
    }
    
    if (this.whenFulfilled) {
        doFulfill(this.whenFulfilled, result);
    }
    // redefine "onFulfilled" to call immediately
    this.onFulfilled = function (whenFulfilled) {
        if (whenFulfilled) {
            doFulfill(whenFulfilled, result);
        }
        return this;
    }
};

APromise.prototype.reject = function (reason) {
    this.state = 'REJECTED';
    if (this.whenRejected) {
        this.whenRejected(reason);
    }
    // redefine "onRejected" to call immediately
    this.onRejected = function(whenRejected) {
        if (whenRejected) {
            whenRejected(reason);
        }
        return this;
    }
};

APromise.prototype.onFulfilled = function(whenFulfilled) {
    if (!whenFulfilled) {
        throw 'Must provide an "whenFulfilled" callback.';
    }
    this.whenFulfilled = whenFulfilled;
    return this;
};

APromise.prototype.onRejected = function(whenRejected) {        
    if (whenRejected) {
        this.whenRejected = whenRejected;
    }
    return this;
};

},{}],4:[function(require,module,exports){
var theWindow;
var defaultTimeout = 10000;
var callbacks = [];
var windowSetTimeouts = [];

function execCallback(callback, theWindow) {
    if (callback) {
        try {
            callback.call(callback, theWindow);                
        } catch (e) {
            console.log("Error invoking window-handle callback.");
            console.log(e);
        }
    }
}

/**
 * Get the global "window" object.
 * @param callback An optional callback that can be used to receive the window asynchronously. Useful when
 * executing in test environment i.e. where the global window object might not exist immediately. 
 * @param timeout The timeout if waiting on the global window to be initialised.
 * @returns {*}
 */
exports.getWindow = function(callback, timeout) {
    
	if (theWindow) {
        execCallback(callback, theWindow);
        return theWindow;
	} 
	
	try {
		if (window) {
            execCallback(callback, window);
			return window;
		} 
	} catch (e) {
		// no window "yet". This should only ever be the case in a test env.
		// Fall through and use callbacks, if supplied.
	}

	if (callback) {
        function waitForWindow(callback) {
            callbacks.push(callback);
            var windowSetTimeout = setTimeout(function() {
                callback.error = "Timed out waiting on the window to be set.";
                callback.call(callback);
            }, (timeout?timeout:defaultTimeout));
            windowSetTimeouts.push(windowSetTimeout);
        }
        waitForWindow(callback);
	} else {
		throw "No 'window' available. Consider providing a 'callback' and receiving the 'window' async when available. Typically, this should only be the case in a test environment.";
	}
}

/**
 * Set the global window e.g. in a test environment.
 * <p>
 * Once called, all callbacks (registered by earlier 'getWindow' calls) will be invoked.
 * 
 * @param newWindow The window.
 */
exports.setWindow = function(newWindow) {
	for (var i = 0; i < windowSetTimeouts.length; i++) {
		clearTimeout(windowSetTimeouts[i]);
	}
    windowSetTimeouts = [];
	theWindow = newWindow;
	for (var i = 0; i < callbacks.length; i++) {
		execCallback(callbacks[i], theWindow);
	}
    callbacks = [];
}

/**
 * Set the default time to wait for the global window to be set.
 * <p>
 * Default is 10 seconds (10000 ms).
 * 
 * @param millis Milliseconds to wait for the global window to be set.
 */
exports.setDefaultTimeout = function(millis) {
    defaultTimeout = millis;
}
},{}],5:[function(require,module,exports){
var theWindow;
var defaultTimeout = 10000;
var callbacks = [];
var windowSetTimeouts = [];

function execCallback(callback, theWindow) {
    if (callback) {
        try {
            callback.call(callback, theWindow);                
        } catch (e) {
            console.log("Error invoking window-handle callback.");
            console.log(e.stack);
        }
    }
}

/**
 * Get the global "window" object.
 * @param callback An optional callback that can be used to receive the window asynchronously. Useful when
 * executing in test environment i.e. where the global window object might not exist immediately. 
 * @param timeout The timeout if waiting on the global window to be initialised.
 * @returns {*}
 */
exports.getWindow = function(callback, timeout) {
    callbacks.push(callback);
    
	if (theWindow) {
        execCallback(callback, theWindow);
        return theWindow;
	} 
	
	try {
		if (window) {
            execCallback(callback, window);
			return window;
		} 
	} catch (e) {
		// no window "yet". This should only ever be the case in a test env.
		// Fall through and use callbacks, if supplied.
	}

	if (callback) {
        function waitForWindow(callback) {
            var windowSetTimeout = setTimeout(function() {
                callback.error = "Timed out waiting on the window to be set.";
                callback.call(callback);
            }, (timeout?timeout:defaultTimeout));
            windowSetTimeouts.push(windowSetTimeout);
        }
        waitForWindow(callback);
	} else {
		throw new Error("No 'window' available. Consider providing a 'callback' and receiving the 'window' async when available. Typically, this should only be the case in a test environment.");
	}
}

/**
 * Set the global window e.g. in a test environment.
 * <p>
 * Once called, all callbacks (registered by earlier 'getWindow' calls) will be invoked.
 * 
 * @param newWindow The window.
 */
exports.setWindow = function(newWindow) {
	for (var i = 0; i < windowSetTimeouts.length; i++) {
		clearTimeout(windowSetTimeouts[i]);
	}
    windowSetTimeouts = [];
	theWindow = newWindow;
	for (var i = 0; i < callbacks.length; i++) {
		execCallback(callbacks[i], theWindow);
	}
}

/**
 * Set the default time to wait for the global window to be set.
 * <p>
 * Default is 10 seconds (10000 ms).
 * 
 * @param millis Milliseconds to wait for the global window to be set.
 */
exports.setDefaultTimeout = function(millis) {
    defaultTimeout = millis;
}

/**
 * Reset the window handle, clearing callbacks etc.
 */
exports.reset = function() {
    callbacks = [];
};
},{}],6:[function(require,module,exports){
require('jenkins-js-modules').whoami('undefined:config-tabbar');

require('jenkins-js-modules')
    .import('core-assets/jquery-detached:jquery2')
    .onFulfilled(function() {

var $ = require('jenkins-js-modules').require('core-assets/jquery-detached:jquery2').getJQuery();
var page = require('./util/page.js');
var jenkinsLocalStorage = require('./util/jenkinsLocalStorage.js');

exports.tabs = []; // Useful for testing.

$(function() {
    var tabBarWidget = require('./widgets/config/tabbar.js');

    tabBarWidget.addPageTabs('.config-table.tabbed', function(tabBar) {
        exports.tabs.push(tabBar);

        // We want to merge some sections together.
        // Merge the "Advanced" section into the "General" section.
        var generalSection = tabBar.getSection('config_general');
        if (generalSection) {
            generalSection.adoptSection('config_advanced_project_options');
        }

        tabBarWidget.addFinderToggle(tabBar);
        tabBar.onShowSection(function() {
            // Hook back into hudson-behavior.js
            page.fireBottomStickerAdjustEvent();
        });

        if (tabBar.hasSections()) {
            var tabBarLastSectionKey = 'config:' + tabBar.configForm.attr('name') + ':last-tab';
            var tabBarLastSection = jenkinsLocalStorage.getPageItem(tabBarLastSectionKey, tabBar.sections[0].id);
            tabBar.onShowSection(function() {
                jenkinsLocalStorage.setPageItem(tabBarLastSectionKey, this.id);
            });
            tabBar.showSection(tabBarLastSection);
        }
    });
});
		require('jenkins-js-modules').export(undefined, 'config-tabbar', {});
    });


},{"./util/jenkinsLocalStorage.js":8,"./util/page.js":11,"./widgets/config/tabbar.js":16,"jenkins-js-modules":1}],7:[function(require,module,exports){

exports.specify = function(selector, id, priority, behavior) {
    Behaviour.specify(selector, id, priority, behavior); // jshint ignore:line
};
},{}],8:[function(require,module,exports){
var windowHandle = require('window-handle');
var storage = require('./localStorage.js');

/** 
 * Store a Jenkins globally scoped value.
 */
exports.setGlobalItem = function(name, value) {
    storage.setItem('jenkins:' + name, value);
};

/** 
 * Get a Jenkins globally scoped value.
 */
exports.getGlobalItem = function(name, defaultVal) {
    return storage.getItem('jenkins:' + name, defaultVal);
};

/** 
 * Store a Jenkins page scoped value.
 */
exports.setPageItem = function(name, value) {
    name = 'jenkins:' + name + ':' + windowHandle.getWindow().location.href;
    storage.setItem(name, value);
};

/** 
 * Get a Jenkins page scoped value.
 */
exports.getPageItem = function(name, defaultVal) {
    name = 'jenkins:' + name + ':' + windowHandle.getWindow().location.href;
    return storage.getItem(name, defaultVal);
};
},{"./localStorage.js":10,"window-handle":5}],9:[function(require,module,exports){
/*
 * Some internal jQuery extensions.
 */

var jQD = require('jenkins-js-modules').require('core-assets/jquery-detached:jquery2');
var $ext;

exports.getJQuery = function() {
    if (!$ext) {
        initJQueryExt();
    }
    return $ext;
};

/*
 * Clear the $ext instance if the window changes. Primarily for unit testing.
 */
var windowHandle = require('window-handle');
windowHandle.getWindow(function() {
    $ext = undefined;
});

function initJQueryExt() {
    // We are going to be adding "stuff" to jQuery. We create a totally new jQuery instance
    // because we do NOT want to run the risk of polluting the shared instance.
    $ext = jQD.newJQuery();

    /**
     * A pseudo selector that performs a case insensitive text contains search i.e. the same
     * as the standard ':contains' selector, but case insensitive.
     */
    $ext.expr[":"].containsci = $ext.expr.createPseudo(function (text) {
        return function (element) {
            var elementText = $ext(element).text();
            var result = (elementText.toUpperCase().indexOf(text.toUpperCase()) !== -1);
            return result;
        };
    });
}
initJQueryExt();

},{"jenkins-js-modules":1,"window-handle":5}],10:[function(require,module,exports){
var windowHandle = require('window-handle');
var win = windowHandle.getWindow();
var storage = win.localStorage;

exports.setMock = function() {
    storage = {
        storage: {},
        setItem: function (name, value) {
            this.storage[name] = value;
        },
        getItem: function (name) {
            return this.storage[name];
        },
        removeItem: function (name) {
            delete this.storage[name];
        }
    };
};

exports.setItem = function(name, value) {
    storage.setItem(name, value);
};

exports.getItem = function(name, defaultVal) {
    var value = storage.getItem(name);
    if (!value) {
        value = defaultVal;
    }
    return  value;
};

exports.removeItem = function(name) {
    return storage.removeItem(name);
};

if (typeof storage === "undefined") {
    console.warn('HTML5 localStorage not supported by this browser.');
    // mock it...
    exports.setMock();
}
},{"window-handle":5}],11:[function(require,module,exports){
var jQD = require('jenkins-js-modules').require('core-assets/jquery-detached:jquery2');
var windowHandle = require('window-handle');
var timestamp = (new Date().getTime());
var loadedClass = 'jenkins-loaded-' + timestamp;

/**
 * Wait for the specified element to be added to the DOM.
 * <p>
 * A jQuery based alternative to Behaviour.specify. Grrrr.
 * @param selector The jQuery selector.
 * @param callback The callback to call after finding new elements. This
 * callback must return a boolean value of true if scanning is to continue. 
 * @param contextEl The jQuery selector context (optional).
 */
exports.onload = function(selector, callback, contextEl) {
    var $ = jQD.getJQuery();

    function registerRescan() {
        setTimeout(scan, 50);
    }
    function scan() {
        var elements = $(selector, contextEl).not(loadedClass);
        if (elements.size() > 0) {
            elements.addClass(loadedClass);
            if (callback(elements) === true) {
                registerRescan();
            }
        } else {
            registerRescan();
        }
    }
    scan();
};

exports.winScrollTop = function() {
    var $ = jQD.getJQuery();
    var win = $(windowHandle.getWindow());
    return win.scrollTop();
};

exports.onWinScroll = function(callback) {
    var $ = jQD.getJQuery();
    $(windowHandle.getWindow()).on('scroll', callback);
};

exports.pageHeaderHeight = function() {
    return elementHeight('#page-head');
};

exports.breadcrumbBarHeight = function() {
    return elementHeight('#breadcrumbBar');
};

exports.fireBottomStickerAdjustEvent = function() {
    Event.fire(window, 'jenkins:bottom-sticker-adjust'); // jshint ignore:line
};

// YUI Drag widget does not like to work on elements with a relative position.
// This tells the element to switch to static position at the start of the drag, so it can work.
exports.fixDragEvent = function(handle) {
    var $ = jQD.getJQuery();
    var isReady = false;
    var $handle = $(handle);
    var $chunk = $handle.closest('.repeated-chunk');
    $handle.add('#ygddfdiv')
	.mousedown(function(){
	    isReady = true;
	})
	.mousemove(function(){
	    if(isReady && !$chunk.hasClass('dragging')){
		$chunk.addClass('dragging');
	    }
	}).mouseup(function(){
	    isReady = false;
	    $chunk.removeClass('dragging');
	});
};

exports.removeTextHighlighting = function(selector) {
    var $ = jQD.getJQuery();
    $('span.highlight-split', selector).each(function() {
        var highlightSplit = $(this);
        highlightSplit.before(highlightSplit.text());
        highlightSplit.remove();
    });
};

function elementHeight(selector) {
    var $ = jQD.getJQuery();
    return $(selector).height();
}
},{"jenkins-js-modules":1,"window-handle":5}],12:[function(require,module,exports){
var jQD = require('../../../util/jquery-ext.js');

module.exports = ConfigRowGrouping;

/*
 * =======================================================================================
 * Configuration table row grouping i.e. row-set-*, optional-block-*, radio-block-* etc
 * 
 * A ConfigSection maintains a list of ConfigRowGrouping and then ConfigRowGrouping
 * itself maintains a list i.e. it's hierarchical. See ConfigSection.gatherRowGroups().
 * =======================================================================================
 */
function ConfigRowGrouping(startRow, parentRowGroupContainer) {
    this.startRow = startRow;
    this.parentRowGroupContainer = parentRowGroupContainer;
    this.endRow = undefined;
    this.rows = [];
    this.rowGroups = []; // Support groupings nested inside groupings
    this.toggleWidget = undefined;
    this.label = undefined;
}

ConfigRowGrouping.prototype.getRowCount = function(includeChildren) {
    var count = this.rows.length;
    if (includeChildren === undefined || includeChildren === true) {
        for (var i = 0; i < this.rowGroups.length; i++) {
            count += this.rowGroups[i].getRowCount();
        }
    }
    return count;
};

ConfigRowGrouping.prototype.getLabels = function() {
    var labels = [];
    
    if (this.label) {
        labels.push(this.label);
    }
    for (var i = 0; i < this.rowGroups.length; i++) {
        var rowSet = this.rowGroups[i];
        labels.push(rowSet.getLabels());
    }
    return labels;
};

ConfigRowGrouping.prototype.updateVisibility = function() {
    if (this.toggleWidget !== undefined) {
        var isChecked = this.toggleWidget.is(':checked');
        for (var i = 0; i < this.rows.length; i++) {
            if (isChecked) {
                this.rows[i].show();
            } else {
                this.rows[i].not('.help-area').hide();
            }
        }
    }
    for (var ii = 0; ii < this.rowGroups.length; ii++) {
        var rowSet = this.rowGroups[ii];
        rowSet.updateVisibility();        
    }
};

/*
 * Find the row-set toggle widget i.e. the input element that indicates that
 * the row-set rows should be made visible or not.
 */
ConfigRowGrouping.prototype.findToggleWidget = function(row) {
    var $ = jQD.getJQuery();
    var input = $(':input.block-control', row);
    if (input.size() === 1) {
        this.toggleWidget = input;
        this.label = input.parent().find('label').text();
        input.addClass('disable-behavior');
    }
};

},{"../../../util/jquery-ext.js":9}],13:[function(require,module,exports){
var jQD = require('../../../util/jquery-ext.js');
var util = require('./util.js');
var page = require('../../../util/page.js');
var ConfigRowGrouping = require('./ConfigRowGrouping.js');
var pageHeaderHeight = page.pageHeaderHeight();

module.exports = ConfigSection;

/*
 * =======================================================================================
 * Configuration table section.
 * =======================================================================================
 */
function ConfigSection(headerRow, parentCMD) {
    this.headerRow = headerRow;
    this.parentCMD = parentCMD;
    this.title = headerRow.attr('title');
    this.id = util.toId(this.title);
    this.rowGroups = undefined;
    this.activator = undefined;
    this.subSections = [];

    this.headerRow.addClass(this.id);
}

ConfigSection.prototype.isTopLevelSection = function() {
    return (this.parentCMD.getSection(this.id) !== undefined);
};

ConfigSection.prototype.isVisible = function() {
    return this.headerRow.is(':visible');
};

/**
 * Get the page offset (height) at which this section comes
 * into view.
 * @returns {number}
 */
ConfigSection.prototype.getViewportEntryOffset = function() {
    return this.headerRow.offset().top - pageHeaderHeight;
};

/**
 * Get the sibling section at the relative offset.
 * @param relOffset
 */
ConfigSection.prototype.getSibling = function(relOffset) {
    var sections = this.parentCMD.sections;
    var endIndex = sections.length - 1;

    for (var i = 0; i < endIndex; i++) {
        var testIndex = i + relOffset;
        if (testIndex < 0) {
            continue;
        } else if (testIndex > endIndex) {
            return undefined;
        }
        if (sections[i] === this) {
            return sections[testIndex];
        }
    }

    return undefined;
};

/**
 * Move another top-level section into this section i.e. adopt it.
 * <p>
 * This allows us to take a top level section (by id) and push it down
 * into another section e.g. pushing the "Advanced" section into the
 * "General" section.
 * @param sectionId The id of the top-level section to be adopted.
 */
ConfigSection.prototype.adoptSection = function(sectionId) {
    if (!this.isTopLevelSection()) {
        // Only top-level sections can adopt.
        return;
    }
    
    var child = this.parentCMD.getSection(sectionId);
    if (child && this.parentCMD.removeSection(child.id)) {
        this.subSections.push(child);
    }
};

/*
 * Get the section rows.
 */
ConfigSection.prototype.getRows = function() {
    var curTr = this.headerRow.next();
    var rows = [];
    var numNewRows = 0;

    rows.push(curTr);
    while(curTr.size() === 1 && !curTr.hasClass('section-header-row')) {
        rows.push(curTr);
        if (!curTr.hasClass(this.id)) {
            numNewRows++;
            curTr.addClass(this.id);
        }
        curTr = curTr.next();
    }
    
    if (numNewRows > 0) {
        // We have new rows in the section ... reset cached info.
        if (this.rowGroups !== undefined) {
            this.gatherRowGroups(rows);
        }
    }
    
    return rows;
};

/*
 * Set the element (jquery) that activates the section (on click).
 */
ConfigSection.prototype.setActivator = function(activator) {
    this.activator = activator;

    var section = this;
    section.activator.click(function() {
        section.parentCMD.showSection(section);
    });
};

ConfigSection.prototype.activate = function() {
    if (this.activator) {
        this.activator.click();
    } else {
        console.warn('No activator attached to config section object.');
    }
};

ConfigSection.prototype.markAsActive = function() {
    this.parentCMD.hideSection();
    this.activator.addClass('active');
    this.markRowsAsActive();
};

ConfigSection.prototype.markRowsAsActive = function() {
    var rows = this.getRows();
    for (var i = 0; i < rows.length; i++) {
        rows[i].addClass('active');
    }
    for (var ii = 0; ii < this.subSections.length; ii++) {
        this.subSections[ii].markRowsAsActive();
    }
    this.updateRowGroupVisibility();
};

ConfigSection.prototype.hasText = function(text) {
    var $ = jQD.getJQuery();
    var selector = ":containsci('" + text + "')";
    var sectionRows = this.getRows();

    for (var i1 = 0; i1 < sectionRows.length; i1++) {
        var row = sectionRows[i1];
        var elementsWithText = $(selector, row);

        if (elementsWithText.size() > 0) {
            return true;
        }
    }

    for (var i2 = 0; i2 < this.subSections.length; i2++) {
        if (this.subSections[i2].hasText(text)) {
            return true;
        }
    }

    return false;
};

ConfigSection.prototype.activeRowCount = function() {
    var activeRowCount = 0;
    var rows = this.getRows();
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].hasClass('active')) {
            activeRowCount++;
        }
    }
    return activeRowCount;
};

ConfigSection.prototype.updateRowGroupVisibility = function() {
    if (this.rowGroups === undefined) {
        // Lazily gather row grouping information.
        this.gatherRowGroups();
    }
    for (var i = 0; i < this.rowGroups.length; i++) {
        var rowGroup = this.rowGroups[i];
        rowGroup.updateVisibility();
    }
    for (var ii = 0; ii < this.subSections.length; ii++) {
        this.subSections[ii].updateRowGroupVisibility();
    }
};

ConfigSection.prototype.gatherRowGroups = function(rows) {
    this.rowGroups = [];

    // Only tracking row-sets that are bounded by 'row-set-start' and 'row-set-end' (for now).
    // Also, only capturing the rows after the 'block-control' input (checkbox, radio etc)
    // and before the 'row-set-end'.
    // TODO: Find out how these actually work. It seems like they can be nested into a hierarchy :(
    // Also seems like you can have these "optional-block" thingies which are not wrapped
    // in 'row-set-start' etc. Grrrrrr :(

    if (rows === undefined) {
        rows = this.getRows();
    }
    if (rows.length > 0) {
        // Create a top level "fake" ConfigRowGrouping just to capture
        // the top level groupings. We copy the rowGroups info out
        // of this and use it in the top "this" ConfigSection instance. 
        var rowGroupContainer = new ConfigRowGrouping(rows[0], undefined);

        this.rowGroups = rowGroupContainer.rowGroups;

        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];

            if (row.hasClass('row-group-start')) {
                var newRowGroup = new ConfigRowGrouping(row, rowGroupContainer);
                if (rowGroupContainer) {
                    rowGroupContainer.rowGroups.push(newRowGroup);
                }
                rowGroupContainer = newRowGroup;
                newRowGroup.findToggleWidget(row);
            } else if (rowGroupContainer) {
                if (row.hasClass('row-group-end')) {
                    rowGroupContainer.endRow = row;
                    rowGroupContainer = rowGroupContainer.parentRowGroupContainer; // pop back off the "stack"
                } else if (rowGroupContainer.toggleWidget === undefined) {
                    rowGroupContainer.findToggleWidget(row);
                } else {
                    // we have the toggleWidget, which means that this row is
                    // one of the rows after that row and is one of the rows that's
                    // subject to being made visible/hidden when the input is
                    // checked or unchecked.
                    rowGroupContainer.rows.push(row);
                }
            }
        }
    }
};

ConfigSection.prototype.getRowGroupLabels = function() {
    var labels = [];
    for (var i = 0; i < this.rowGroups.length; i++) {
        var rowGroup = this.rowGroups[i];
        labels.push(rowGroup.getLabels());
    }
    return labels;
};

ConfigSection.prototype.highlightText = function(text) {
    var $ = jQD.getJQuery();
    var selector = ":containsci('" + text + "')";
    var rows = this.getRows();
    
    for (var i1 = 0; i1 < rows.length; i1++) {
        var row = rows[i1];

        page.removeTextHighlighting(row);

        if (text !== '') {
            var regex = new RegExp('(' + text + ')',"gi");

            /*jshint loopfunc: true */
            $(selector, row).find(':not(:input)').each(function() {
                var $this = $(this);
                $this.contents().each(function () {
                    // We specifically only mess with text nodes
                    if (this.nodeType === 3) {
                        var $textNode = $(this);
                        var highlightedMarkup = $textNode.text().replace(regex, '<span class="highlight">$1</span>');
                        $textNode.replaceWith('<span class="highlight-split">' + highlightedMarkup + '</span>');
                    }
                });
            });
        }
    }

    for (var i2 = 0; i2 < this.subSections.length; i2++) {
        this.subSections[i2].highlightText(text);
    }
};

},{"../../../util/jquery-ext.js":9,"../../../util/page.js":11,"./ConfigRowGrouping.js":12,"./util.js":15}],14:[function(require,module,exports){
/*
 * Internal support module for config tables.
 */

var jQD = require('../../../util/jquery-ext.js');
var ConfigSection = require('./ConfigSection.js');
var page = require('../../../util/page.js');
var util = require('./util.js');

exports.markConfigTableParentForm = function(configTable) {
    var form = configTable.closest('form');
    form.addClass('jenkins-config');
    return form;
};

exports.findConfigTables = function() {
    var $ = jQD.getJQuery();
    // The config tables are the immediate child <table> elements of <form> elements
    // with a name of "config"?
    return $('form[name="config"] > table');
};

exports.fromConfigTable = function(configTable) {
    var $ = jQD.getJQuery();
    var sectionHeaders = $('.section-header', configTable);
    var configForm = exports.markConfigTableParentForm(configTable);

    // Mark the ancestor <tr>s of the section headers and add a title
    sectionHeaders.each(function () {
        var sectionHeader = $(this);
        var sectionRow = sectionHeader.closest('tr');
        var sectionTitle = sectionRow.text();

        // Remove leading hash from accumulated text in title (from <a> element).
        if (sectionTitle.indexOf('#') === 0) {
            sectionTitle = sectionTitle.substring(1);
        }

        sectionRow.addClass('section-header-row');
        sectionRow.attr('title', sectionTitle);
    });

    var configTableMetadata = new ConfigTableMetaData(configForm, configTable);
    var topRows = configTableMetadata.getTopRows();
    var firstRow = configTableMetadata.getFirstRow();
    var curSection;

    // The first set of rows don't have a 'section-header-row', so we manufacture one,
    // calling it a "General" section. We do this by marking the first row in the table.
    // See the next block of code.
    
    if(!firstRow.hasClass('section-header-row')){
      var generalRow = $('<tr class="section-header-row insert first" title="General"><td colspan="4"><div class="section-header"><a class="section-anchor">#</a>General</div></td></tr>');
      firstRow.before(generalRow);
      firstRow = configTableMetadata.getFirstRow();
      var newArray = $.makeArray(topRows);
      newArray.unshift(generalRow[0]);
      topRows = $(newArray);
    }

    firstRow.addClass('section-header-row');
    firstRow.attr('title', "General");

    // Go through the top level <tr> elements (immediately inside the <tbody>)
    // and group the related <tr>s based on the "section-header-row", using a "normalized"
    // version of the section title as the section id.
    topRows.each(function () {
        var tr = $(this);
        if (tr.hasClass('section-header-row')) {
            // a new section
            curSection = new ConfigSection(tr, configTableMetadata);
            configTableMetadata.sections.push(curSection);
        }
    });

    var buttonsRow = $('#bottom-sticker', configTable).closest('tr');
    buttonsRow.removeClass(curSection.id);
    buttonsRow.addClass(util.toId('buttons'));

    return configTableMetadata;
};

/*
 * =======================================================================================
 * ConfigTable MetaData class.
 * =======================================================================================
 */
function ConfigTableMetaData(configForm, configTable) {
    this.$ = jQD.getJQuery();
    this.configForm = configForm;
    this.configTable = configTable;
    this.configTableBody = this.$('> tbody', configTable);
    this.activatorContainer = undefined;
    this.sections = [];
    this.findInput = undefined;
    this.showListeners = [];
    this.configWidgets = undefined;
    this.addWidgetsContainer();
    this.addFindWidget();
}

ConfigTableMetaData.prototype.getTopRows = function() {
    var topRows = this.configTableBody.children('tr');
    topRows.addClass('config-table-top-row');
    return topRows;
};

ConfigTableMetaData.prototype.getFirstRow = function() {
    return this.getTopRows().first();
};

ConfigTableMetaData.prototype.addWidgetsContainer = function() {
    var $ = jQD.getJQuery();
    this.configWidgets = $('<div class="jenkins-config-widgets"></div>');
    this.configWidgets.insertBefore(this.configForm);
};

ConfigTableMetaData.prototype.addFindWidget = function() {
    var $ = jQD.getJQuery();
    var thisTMD = this;
    var findWidget = $('<div class="find-container"><div class="find"><span title="Clear" class="clear">x</span><input placeholder="find"/></div></div>');

    thisTMD.findInput = $('input', findWidget);

    // Add the find text clearer
    $('.clear', findWidget).click(function() {
        thisTMD.findInput.val('');
        thisTMD.showSections('');
        thisTMD.findInput.focus();
    });

    var findTimeout;
    thisTMD.findInput.keydown(function() {
        if (findTimeout) {
            clearTimeout(findTimeout);
            findTimeout = undefined;
        }
        findTimeout = setTimeout(function() {
            findTimeout = undefined;
            thisTMD.showSections(thisTMD.findInput.val());
        }, 300);
    });

    $('.jenkins-config-widgets .find-container input').focus(function() {
        page.fireBottomStickerAdjustEvent();
    });

    this.configWidgets.append(findWidget);
};

ConfigTableMetaData.prototype.sectionCount = function() {
    return this.sections.length;
};

ConfigTableMetaData.prototype.hasSections = function() {
    var hasSections = (this.sectionCount() > 0);
    if (!hasSections) {
        console.warn('Jenkins configuration without sections?');
    }
    return  hasSections;
};

ConfigTableMetaData.prototype.sectionIds = function() {
    var sectionIds = [];
    for (var i = 0; i < this.sections.length; i++) {
        sectionIds.push(this.sections[i].id);
    }
    return sectionIds;
};

ConfigTableMetaData.prototype.activateSection = function(sectionId) {
    if (!sectionId) {
        throw 'Invalid section id "' + sectionId + '"';
    }

    var section = this.getSection(sectionId);
    if (section) {
        section.activate();
    }
};

ConfigTableMetaData.prototype.activeSection = function() {
    if (this.hasSections()) {
        for (var i = 0; i < this.sections.length; i++) {
            var section = this.sections[i];
            if (section.activator.hasClass('active')) {
                return section;
            }
        }
    }
};

ConfigTableMetaData.prototype.getSection = function(ref) {
    if (this.hasSections()) {
        if (typeof ref === 'number') {
            // It's a section index...
            if (ref >= 0 && ref <= this.sections.length - 1) {
                return this.sections[ref];
            }
        } else {
            // It's a section ID...
            for (var i = 0; i < this.sections.length; i++) {
                var section = this.sections[i];
                if (section.id === ref) {
                    return section;
                }
            }
        }
    }
    return undefined;
};

ConfigTableMetaData.prototype.removeSection = function(sectionId) {
    if (this.hasSections()) {
        for (var i = 0; i < this.sections.length; i++) {
            var section = this.sections[i];
            if (section.id === sectionId) {
                this.sections.splice(i, 1);
                if (section.activator) {
                    section.activator.remove();
                }
                return true;
            }
        }
    }
    return false;
};

ConfigTableMetaData.prototype.activateFirstSection = function() {
    if (this.hasSections()) {
        this.activateSection(this.sections[0].id);
    }
};

ConfigTableMetaData.prototype.activeSectionCount = function() {
    var activeSectionCount = 0;
    if (this.hasSections()) {
        for (var i = 0; i < this.sections.length; i++) {
            var section = this.sections[i];
            if (section.activator.hasClass('active')) {
                activeSectionCount++;
            }
        }
    }
    return activeSectionCount;
};

ConfigTableMetaData.prototype.showSection = function(section) {
    if (typeof section === 'string') {
        section = this.getSection(section);
    }

    if (section) {
        var topRows = this.getTopRows();

        // Active the specified section
        section.markAsActive();

        // and always show the buttons
        topRows.filter('.config_buttons').show();

        // Update text highlighting
        section.highlightText(this.findInput.val());

        fireListeners(this.showListeners, section);
    }
};

ConfigTableMetaData.prototype.hideSection = function() {
    var topRows = this.getTopRows();
    var $ = jQD.getJQuery();

    $('.config-section-activator.active', this.activatorContainer).removeClass('active');
    topRows.filter('.active').removeClass('active');
};

ConfigTableMetaData.prototype.onShowSection = function(listener) {
    this.showListeners.push(listener);
};

ConfigTableMetaData.prototype.showSections = function(withText) {
    this.removeTextHighlighting();

    if (withText === '') {
        if (this.hasSections()) {
            for (var i1 = 0; i1 < this.sections.length; i1++) {
                this.sections[i1].activator.removeClass('hidden');
            }
            var activeSection = this.activeSection();
            if (!activeSection) {
                this.showSection(this.sections[0]);
            } else {
                activeSection.highlightText(this.findInput.val());
            }
        }
    } else {
        if (this.hasSections()) {
            var sectionsWithText = [];

            for (var i2 = 0; i2 < this.sections.length; i2++) {
                var section = this.sections[i2];

                if (section.hasText(withText)) {
                    section.activator.removeClass('hidden');
                    sectionsWithText.push(section);
                } else {
                    section.activator.addClass('hidden');
                }
            }

            // Select the first section to contain the text.
            if (sectionsWithText.length > 0) {
                this.showSection(sectionsWithText[0]);
            } else {
                this.hideSection();
            }
        }
    }
};

/**
 * We need this because sections can mysteriously change visibility,
 * which looks strange for scroolspy.
 */
ConfigTableMetaData.prototype.trackSectionVisibility = function() {
    if (isTestEnv()) {
        return;
    }

    var thisConfig = this;
    
    try {
        for (var i = 0; i < this.sections.length; i++) {
            var section = this.sections[i];
            if (section.isVisible()) {
                section.activator.show();
            } else {
                section.activator.hide();
            }
        }
    } finally {
        var interval = (thisConfig.trackSectionVisibilityTO || 0);
        
        // The rescan interval will drop off over time, starting out very fast.
        interval += 10;
        interval =  Math.min(interval, 500);
        thisConfig.trackSectionVisibilityTO = interval;

        setTimeout(function() {
            thisConfig.trackSectionVisibility();
        }, interval);
    }
};

ConfigTableMetaData.prototype.removeTextHighlighting = function() {
    page.removeTextHighlighting(this.configForm);
};

function fireListeners(listeners, contextObject) {
    for (var i = 0; i < listeners.length; i++) {
        fireListener(listeners[i], contextObject);
    }
    function fireListener(listener, contextObject) {
        setTimeout(function() {
            listener.call(contextObject);
        }, 1);
    }
}

function isTestEnv() {
    if (window === undefined) {
        return true;
    } else if (window.navigator === undefined) {
        return true;
    } else if (window.navigator.userAgent === undefined) {
        return true;
    } else if (window.navigator.userAgent === 'JasmineTest') {
        return true;
    } else if (window.navigator.userAgent === 'JenkinsTest') {
        return true;
    } else if (window.navigator.userAgent.toLowerCase().indexOf("node.js") !== -1) {
        return true;
    }
    
    return false;
}
},{"../../../util/jquery-ext.js":9,"../../../util/page.js":11,"./ConfigSection.js":13,"./util.js":15}],15:[function(require,module,exports){

exports.toId = function(string) {
    string = string.trim();
    return 'config_' + string.replace(/[\W_]+/g, '_').toLowerCase();
};
},{}],16:[function(require,module,exports){
var jQD = require('jenkins-js-modules').require('core-assets/jquery-detached:jquery2');
var page = require('../../util/page.js');
var jenkinsLocalStorage = require('../../util/jenkinsLocalStorage.js');
var tableMetadata = require('./model/ConfigTableMetaData.js');
var behaviorShim = require('../../util/behavior-shim');

exports.tabBarShowPreferenceKey = 'config:usetabs';

exports.addPageTabs = function(configSelector, onEachConfigTable, options) {
    var $ = jQD.getJQuery();

    $(function() {
        behaviorShim.specify(".dd-handle", 'config-drag-start', 1000, function(el) {
            page.fixDragEvent(el);
        });

        // We need to wait until after radioBlock.js Behaviour.js rules
        // have been applied, otherwise row-set rows become visible across sections.
        page.onload('.block-control', function() {
            // Only do job configs for now.
            var configTables = $(configSelector);
            if (configTables.size() > 0) {
                var tabBarShowPreference = jenkinsLocalStorage.getGlobalItem(exports.tabBarShowPreferenceKey, "yes");

                page.fixDragEvent(configTables);

                if (tabBarShowPreference === "yes") {
                    configTables.each(function() {
                        var configTable = $(this);
                        var tabBar = exports.addTabs(configTable, options);

                        onEachConfigTable.call(configTable, tabBar);

                        tabBar.deactivator.click(function() {
                            jenkinsLocalStorage.setGlobalItem(exports.tabBarShowPreferenceKey, "no");
                            require('window-handle').getWindow().location.reload();
                        });
                    });
                } else {
                    configTables.each(function() {
                        var configTable = $(this);
                        var activator = exports.addTabsActivator(configTable);
                        tableMetadata.markConfigTableParentForm(configTable);
                        activator.click(function() {
                            jenkinsLocalStorage.setGlobalItem(exports.tabBarShowPreferenceKey, "yes");
                            require('window-handle').getWindow().location.reload();
                        });
                    });
                }
            }
        }, configSelector);
    });
};

exports.addTabsOnFirst = function() {
    return exports.addTabs(tableMetadata.findConfigTables().first());
};

exports.addTabs = function(configTable, options) {
    var $ = jQD.getJQuery();
    var configTableMetadata;
    var tabOptions = (options || {});
    var trackSectionVisibility = (tabOptions.trackSectionVisibility || false);

    if ($.isArray(configTable)) {
        // It's a config <table> metadata block
        configTableMetadata = configTable;
    } else if (typeof configTable === 'string') {
        // It's a config <table> selector
        var configTableEl = $(configTable);
        if (configTableEl.size() === 0) {
            throw "No config table found using selector '" + configTable + "'";
        } else {
            configTableMetadata = tableMetadata.fromConfigTable(configTableEl);
        }
    } else {
        // It's a config <table> element
        configTableMetadata = tableMetadata.fromConfigTable(configTable);
    }

    var tabBar = $('<div class="tabBar config-section-activators"></div>');
    configTableMetadata.activatorContainer = tabBar;

    function newTab(section) {
        var tab = $('<div class="tab config-section-activator"></div>');

        tab.text(section.title);
        tab.addClass(section.id);

        return tab;
    }

    var section;
    for (var i = 0; i < configTableMetadata.sections.length; i++) {
        section = configTableMetadata.sections[i];
        var tab = newTab(section);
        tabBar.append(tab);
        section.setActivator(tab);
    }

    var tabs = $('<div class="form-config tabBarFrame"></div>');
    var noTabs = $('<div class="noTabs" title="Remove configuration tabs and revert to the &quot;classic&quot; configuration view">Remove tabs</div>');

    configTableMetadata.configWidgets.append(tabs);
    configTableMetadata.configWidgets.prepend(noTabs);
    tabs.append(tabBar);

    tabs.mouseenter(function() {
        tabs.addClass('mouse-over');
    });
    tabs.mouseleave(function() {
        tabs.removeClass('mouse-over');
    });
    configTableMetadata.deactivator = noTabs;

    // Always activate the first section by default. 
    configTableMetadata.activateFirstSection();
    
    if (trackSectionVisibility === true) {
        configTableMetadata.trackSectionVisibility();
    }

    return configTableMetadata;
};

exports.addTabsActivator = function(configTable) {
    var $ = jQD.getJQuery();
    var configWidgets = $('<div class="jenkins-config-widgets"><div class="showTabs" title="Add configuration section tabs">Add tabs</div></div>');
    configWidgets.insertBefore(configTable.parent());
    return configWidgets;
};


exports.addFinderToggle = function(configTableMetadata) {
    var $ = jQD.getJQuery();
    var findToggle = $('<div class="find-toggle" title="Find"></div>');
    var finderShowPreferenceKey = 'config:showfinder';

    findToggle.click(function() {
        var findContainer = $('.find-container', configTableMetadata.configWidgets);
        if (findContainer.hasClass('visible')) {
            findContainer.removeClass('visible');
            jenkinsLocalStorage.setGlobalItem(finderShowPreferenceKey, "no");
        } else {
            findContainer.addClass('visible');
            $('input', findContainer).focus();
            jenkinsLocalStorage.setGlobalItem(finderShowPreferenceKey, "yes");
        }
    });

    if (jenkinsLocalStorage.getGlobalItem(finderShowPreferenceKey, "yes") === 'yes') {
        findToggle.click();
    }
};
},{"../../util/behavior-shim":7,"../../util/jenkinsLocalStorage.js":8,"../../util/page.js":11,"./model/ConfigTableMetaData.js":14,"jenkins-js-modules":1,"window-handle":5}]},{},[6]);
