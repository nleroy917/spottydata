#!/usr/bin/env node
"use strict";exports.__esModule=true;exports.nextLint=void 0;var _fs=require("fs");var _index=_interopRequireDefault(require("next/dist/compiled/arg/index.js"));var _path=require("path");var _chalk=_interopRequireDefault(require("chalk"));var _constants=require("../lib/constants");var _runLintCheck=require("../lib/eslint/runLintCheck");var _utils=require("../server/lib/utils");var _storage=require("../telemetry/storage");var _config=_interopRequireDefault(require("../next-server/server/config"));var _constants2=require("../next-server/lib/constants");var _events=require("../telemetry/events");var _compileError=require("../lib/compile-error");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}const eslintOptions=args=>{var _args$Ext,_args$Rulesdir,_args$Fix,_args$FixType,_args$Cache;return{overrideConfigFile:args['--config']||null,extensions:(_args$Ext=args['--ext'])!=null?_args$Ext:['.js','.jsx','.ts','.tsx'],resolvePluginsRelativeTo:args['--resolve-plugins-relative-to']||null,rulePaths:(_args$Rulesdir=args['--rulesdir'])!=null?_args$Rulesdir:[],fix:(_args$Fix=args['--fix'])!=null?_args$Fix:false,fixTypes:(_args$FixType=args['--fix-type'])!=null?_args$FixType:null,ignorePath:args['--ignore-path']||null,ignore:!Boolean(args['--no-ignore']),allowInlineConfig:!Boolean(args['--no-inline-config']),reportUnusedDisableDirectives:args['--report-unused-disable-directives']||null,cache:(_args$Cache=args['--cache'])!=null?_args$Cache:false,cacheLocation:args['--cache-location']||'.eslintcache',errorOnUnmatchedPattern:!Boolean(args['--no-error-on-unmatched-pattern'])};};const nextLint=argv=>{const validArgs={// Types
'--help':Boolean,'--base-dir':String,'--dir':[String],// Aliases
'-h':'--help','-b':'--base-dir','-d':'--dir'};const validEslintArgs={// Types
'--config':String,'--ext':[String],'--resolve-plugins-relative-to':String,'--rulesdir':[String],'--fix':Boolean,'--fix-type':[String],'--ignore-path':String,'--no-ignore':Boolean,'--quiet':Boolean,'--no-inline-config':Boolean,'--report-unused-disable-directives':String,'--cache':Boolean,'--cache-location':String,'--no-error-on-unmatched-pattern':Boolean,// Aliases
'-c':'--config'};let args;try{args=(0,_index.default)({...validArgs,...validEslintArgs},{argv});}catch(error){if(error.code==='ARG_UNKNOWN_OPTION'){return(0,_utils.printAndExit)(error.message,1);}throw error;}if(args['--help']){(0,_utils.printAndExit)(`
      Description
        Run ESLint on every file in specified directories. 
        If not configured, ESLint will be set up for the first time.

      Usage
        $ next lint <baseDir> [options]
      
      <baseDir> represents the directory of the Next.js application.
      If no directory is provided, the current directory will be used.

      Options
        Basic configuration:
          -h, --help                     List this help
          -d, --dir Array                Set directory, or directories, to run ESLint - default: 'pages', 'components', and 'lib'
          -c, --config path::String      Use this configuration file, overriding all other config options
          --ext [String]                 Specify JavaScript file extensions - default: .js, .jsx, .ts, .tsx
          --resolve-plugins-relative-to path::String  A folder where plugins should be resolved from, CWD by default

        Specifying rules:
          --rulesdir [path::String]      Use additional rules from this directory

        Fixing problems:
          --fix                          Automatically fix problems
          --fix-type Array               Specify the types of fixes to apply (problem, suggestion, layout)

        Ignoring files:
          --ignore-path path::String     Specify path of ignore file
          --no-ignore                    Disable use of ignore files and patterns

        Handling warnings:
          --quiet                        Report errors only - default: false

        Inline configuration comments:
          --no-inline-config             Prevent comments from changing config or rules
          --report-unused-disable-directives  Adds reported errors for unused eslint-disable directives ("error" | "warn" | "off")

        Caching:
          --cache                        Only check changed files - default: false
          --cache-location path::String  Path to the cache file or directory - default: .eslintcache
        
        Miscellaneous:
          --no-error-on-unmatched-pattern  Prevent errors when pattern is unmatched - default: false
          `,0);}const baseDir=(0,_path.resolve)(args._[0]||'.');// Check if the provided directory exists
if(!(0,_fs.existsSync)(baseDir)){(0,_utils.printAndExit)(`> No such directory exists as the project root: ${baseDir}`);}const dirs=args['--dir'];const lintDirs=(dirs!=null?dirs:_constants.ESLINT_DEFAULT_DIRS).reduce((res,d)=>{const currDir=(0,_path.join)(baseDir,d);if(!(0,_fs.existsSync)(currDir))return res;res.push(currDir);return res;},[]);const reportErrorsOnly=Boolean(args['--quiet']);(0,_runLintCheck.runLintCheck)(baseDir,lintDirs,false,eslintOptions(args),reportErrorsOnly).then(async lintResults=>{const lintOutput=typeof lintResults==='string'?lintResults:lintResults==null?void 0:lintResults.output;if(typeof lintResults!=='string'&&lintResults!=null&&lintResults.eventInfo){const conf=await(0,_config.default)(_constants2.PHASE_PRODUCTION_BUILD,baseDir);const telemetry=new _storage.Telemetry({distDir:(0,_path.join)(baseDir,conf.distDir)});telemetry.record((0,_events.eventLintCheckCompleted)({...lintResults.eventInfo,buildLint:false}));await telemetry.flush();}if(typeof lintResults!=='string'&&lintResults!=null&&lintResults.isError&&lintOutput){throw new _compileError.CompileError(lintOutput);}if(lintOutput){console.log(lintOutput);}else{console.log(_chalk.default.green('✔ No ESLint warnings or errors'));}}).catch(err=>{(0,_utils.printAndExit)(err.message);});};exports.nextLint=nextLint;
//# sourceMappingURL=next-lint.js.map