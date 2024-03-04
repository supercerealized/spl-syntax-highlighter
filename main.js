// SPL syntax highlighting
// This defines a 'splunk' mode for CodeMirror which is the underlyting obsidian codeblock editor
// SPL Syntax Highlighting Definitions based on docs.splunk.com 
// Author: connor@shields.mx

'use strict';

var obsidian = require('obsidian');

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function createCommonjsModule(fn, basedir, module) {
	return module = {
		path: basedir,
		exports: {},
		require: function (path, base) {
			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
		}
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('requires dont seem to be supported');
}

var codemirror = CodeMirror;

// SPL Syntax Highlighting Definitions based on docs.splunk.com 
function defineSPLMode(CodeMirror) {
    CodeMirror.defineMode("splunk", function(config) {
        var keywords = /^(abs|acos|where|index|sourcetype|source|acosh|asin|asinh|atan|atan2|atanh|case|cidrmatch|ceiling|coalesce|commands|cos|cosh|exact|exp|dc|false|floor|hypot|if|in|isbool|isint|isnotnull|isnull|isnum|isstr|json_object|json_array|json_extract|json_keys|json_set|json_valid|len|like|log|lookup|ln|lower|ltrim|match|max|md5|min|mvappend|mvcount|mvdedup|mvfilter|mvfind|mvindex|mvjoin|mvmap|mvrange|mvsort|mvzip|now|null|nullif|pi|pow|printf|random|relative_time|replace|round|rtrim|searchmatch|sha1|sha256|sha512|sigfig|sin|sinh|spath|split|sqrt|strftime|strptime|substr|tan|tanh|time|tonumber|tostring|trim|true|typeof|upper|urldecode|validate|avg|count|distinct_count|earliest|earliest_time|estdc|estdc_error|first|last|latest|latest_time|list|max|mean|median|min|mode|percentile|per_day|per_hour|per_minute|per_second|range|rate|rate_avg|rate_sum|stdev|stdevp|sum|sumsq|values|var|varp)\b/;
        var operators = /^\||(BY|AS|OR|AND|IN|WHERE|NOT)\b/;
        var built_ins = /^(as|by|over|where|output|outputnew|abstract|accum|addcoltotals|addinfo|addtotals|analyzefields|anomalies|anomalousvalue|anomalydetection|append|appendcols|appendpipe|arules|associate|audit|autoregress|awssnsalert|bin|bucket|bucketdir|cefout|chart|cluster|cofilter|collect|concurrency|contingency|convert|correlate|ctable|datamodel|datamodelsimple|dbinspect|dbxquery|dedup|delete|delta|diff|entitymerge|erex|eval|eventcount|eventstats|extract|fieldformat|fields|fieldsummary|filldown|fillnull|findtypes|folderize|foreach|format|from|gauge|gentimes|geom|geomfilter|geostats|head|highlight|history|iconify|inputcsv|inputintelligence|inputlookup|iplocation|join|kmeans|kvform|loadjob|localize|localop|lookup|makecontinuous|makemv|makeresults|map|mcollect|metadata|metasearch|meventcollect|mpreview|msearch|mstats|multikv|multisearch|mvcombine|mvexpand|nomv|outlier|outputcsv|outputlookup|outputtext|overlap|pivot|predict|rangemap|rare|redistribute|regex|relevancy|reltime|rename|replace|require|rest|return|reverse|rex|rtorder|run|savedsearch|script|scrub|search|searchtxn|selfjoin|sendemail|set|setfields|sichart|sirare|sistats|sitimechart|sitop|snowincident|snowincidentstream|snowevent|snoweventstream|sort|spath|stats|strcat|streamstats|table|tags|tail|timechart|timewrap|top|transaction|transpose|trendline|tscollect|tstats|typeahead|typelearner|typer|union|uniq|untable|walklex|where|x11|xmlkv|xmlunescape|xpath|xsDisplayConcept|xsDisplayContext|xsFindBestConcept|xsListConcepts|xsListContexts|xsUpdateDDContext|xsWhere|xyseries)\b/;

        function tokenizer(stream, state) {
            if (stream.eatSpace()) return null;
            var sol = stream.sol();
            var ch = stream.next();

            if (ch === '/' && stream.eat('/')) {
                stream.skipToEnd();
                return 'comment'; // single line comment - yes this is not comment syntax in splunk but the tick mark comment syntax can create issues with markdown codeblocks
            }

            if (ch === '"' || ch === "'") {
                state.tokenize = tokenString(ch);
                return state.tokenize(stream, state); // string tokens
            }

            if (/\d/.test(ch)) {
                stream.eatWhile(/[\w\.]/);
                return 'number';
            }

            if (/[{}\(\),;\:\.]/.test(ch)) {
                return null; // punc
            }

            if (ch === '|' || ch === '=') {
                return 'operator'; // added the pipe character to operators because I've always wanted it to be highlighted
            }

            stream.eatWhile(/\w/);
            var cur = stream.current();

            if (keywords.test(cur)) {
                return 'keyword'; // defined above
            }

            if (built_ins.test(cur)) {
                return 'builtin'; // defined above
            }

            if (operators.test(cur)) {
                return 'operator'; // defined above
            }

            return 'variable';
        }

        function tokenString(quote) {
            return function(stream, state) {
                var escaped = false, next, end = false;
                while ((next = stream.next()) != null) {
                    if (next === quote && !escaped) {
                        end = true;
                        break;
                    }
                    escaped = !escaped && next === '\\';
                }
                if (end || !(escaped || quote === '`')) {
                    state.tokenize = tokenizer;
                }
                return 'string';
            };
        }

        return {
            startState: function() { return {tokenize: tokenizer}; },
            token: function(stream, state) {
                return state.tokenize(stream, state);
            },
            lineComment: '//'
        };
    });
    
    CodeMirror.defineMIME("text/x-splunk", "splunk");
}

// SPL Syntax Highlight Plugin Class
var SPLSyntaxHighlightPlugin = /** @class */ (function (_super) {
    __extends(SPLSyntaxHighlightPlugin, _super);
    function SPLSyntaxHighlightPlugin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }

    SPLSyntaxHighlightPlugin.prototype.onload = function () {
        defineSPLMode(codemirror);
        this.app.workspace.onLayoutReady(this.refreshLeaves.bind(this));
    };

    SPLSyntaxHighlightPlugin.prototype.onunload = function () {
        this.refreshLeaves();
    };
    
    SPLSyntaxHighlightPlugin.prototype.refreshLeaves = function () {
        this.app.workspace.iterateCodeMirrors(function (cm) {
            cm.setOption("mode", "text/x-splunk");
        });
    };

    return SPLSyntaxHighlightPlugin;
}(obsidian.Plugin));

module.exports = SPLSyntaxHighlightPlugin;
