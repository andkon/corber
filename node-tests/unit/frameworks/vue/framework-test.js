const td             = require('testdouble');
const expect         = require('../../../helpers/expect');
const mockProject    = require('../../../fixtures/ember-cordova-mock/project');

describe('Vue Framework', function() {
  afterEach(function() {
    td.reset();
  });

  it('has required props', function() {
    let Vue = require('../../../../lib/frameworks/vue/framework');
    let framework = new Vue();

    expect(framework.name).to.equal('vue');
    expect(framework.buildCommand).to.equal('npm run build');
    expect(framework.buildPath).to.equal('./dist');
    expect(framework.port).to.equal(8080);
  });

  it('build initializes a new BuildTask', function() {
    let BuildTask = td.replace('../../../../lib/frameworks/vue/tasks/build');
    let buildDouble = td.replace(BuildTask.prototype, 'run');
    let Vue = require('../../../../lib/frameworks/vue/framework');

    let framework = new Vue();

    framework.build({cordovaOutputPath: 'fakePath'});
    td.verify(new BuildTask({
      cordovaOutputPath: 'fakePath',
      buildCommand: 'npm run build',
      buildPath: './dist'
    }));

    td.verify(buildDouble());
  });

  it('serve intializes a new ServeTask', function() {
    let ServeTask = td.replace('../../../../lib/frameworks/vue/tasks/serve');
    let serveDouble = td.replace(ServeTask.prototype, 'run');
    let Vue = require('../../../../lib/frameworks/vue/framework');

    let framework = new Vue();

    framework.serve();
    td.verify(new ServeTask());

    td.verify(serveDouble());
  });

  describe('buildValidators', function() {
    it('inits a root-url validator', function() {
      let ValidateRoot = td.replace('../../../../lib/validators/root-url');
      let Vue = require('../../../../lib/frameworks/vue/framework');
      let framework = new Vue({root: mockProject.project.root});
      framework._buildValidators('build', {});

      td.verify(new ValidateRoot({
        config: {},
        rootProps: ['assetsPublicPath'],
        path: 'config/index.js',
        force: undefined,
        env: 'build'
      }));
    });
  });

  it('validateBuild calls _buildValidators then runs validators', function() {
    let runValidatorDouble = td.replace('../../../../lib/utils/run-validators');
    let Vue = require('../../../../lib/frameworks/vue/framework');
    let framework = new Vue({root: mockProject.project.root});

    let passedEnv = undefined;
    td.replace(framework, '_buildValidators', function(env) {
      passedEnv = env;
      return ['validations'];
    });

    framework.validateBuild({});

    expect(passedEnv).to.equal('build');
    td.verify(runValidatorDouble(['validations']));
  });

  it('validateServe calls _buildValidators then runs validators', function() {
    let runValidatorDouble = td.replace('../../../../lib/utils/run-validators');
    let Vue = require('../../../../lib/frameworks/vue/framework');
    let framework = new Vue({root: mockProject.project.root});

    let passedEnv = undefined;
    td.replace(framework, '_buildValidators', function(env) {
      passedEnv = env;
      return ['validations'];
    });

    framework.validateServe({});

    expect(passedEnv).to.equal('dev');
    td.verify(runValidatorDouble(['validations']));
  });
});