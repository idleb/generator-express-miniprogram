'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const _ = require('lodash');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        'Welcome to the priceless ' +
          chalk.red('generator-express-miniprogram') +
          ' generator!'
      )
    );

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Project name',
        default: this.appname
      },
      {
        type: 'input',
        name: 'description',
        message: 'Project description',
        default: 'A miniProgram project'
      },
      {
        type: 'confirm',
        name: 'lint',
        message: 'Use ESLint to lint your code?',
        default: true
      },
      {
        type: 'confirm',
        name: 'unitTest',
        message: 'Set up unit tests',
        default: true
      },
      {
        type: 'confirm',
        name: 'cos',
        message: 'Upload your resources to COS',
        default: true
      },
      {
        type: 'confirm',
        name: 'login',
        message: 'Use Wechat Login for Website',
        default: true
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  initPackage() {
    let pkg = this.fs.readJSON(this.templatePath('package.json'), {});
    const { props } = this;

    pkg = _.merge(pkg, {
      name: props.name,
      description: props.description
    });

    if (props.lint) {
      pkg = _.merge(pkg, {
        scripts: {
          lint: 'eslint --ext .js'
        },
        devDependencies: {
          eslint: '^4.9.0'
        }
      });
    }

    if (props.unitTest) {
      pkg = _.merge(pkg, {
        scripts: {
          test: 'mocha --recursive'
        },
        devDependencies: {
          chai: '^4.1.2',
          'chai-http': '^3.0.0',
          'chai-as-promised': '^7.1.1',
          mocha: '^5.0.0',
          sinon: '^4.2.2'
        }
      });
    }

    if (props.cos) {
      pkg = _.merge(pkg, {
        dependencies: {
          'cos-nodejs-sdk-v5': '^2.2.6'
        }
      });
    }

    this.fs.writeJSON(this.destinationPath('package.json'), pkg);
  }

  writing() {
    if (this.props.lint) {
      this.fs.copy(
        this.templatePath('.eslintrc.yml'),
        this.destinationPath('.eslintrc.yml')
      );
    }

    let files = [
      'bin/www',
      'controllers/index.js',
      'controllers/user.js',
      'lib/weixin.js',
      'models/index.js',
      'public/css/style.css',
      'public/img/image.png',
      'public/favicon.ico',
      'routes/index.js',
      'tools/db.sql',
      'tools/initdb.js',
      'views/error.ejs',
      'views/footer.ejs',
      'views/header.ejs',
      'views/index.ejs',
      'views/pagination.ejs',
      '.gitignore'
    ];

    let tplFiles = [
      'config/dev.js',
      'config/index.js',
      'config/prod.js',
      'routes/api.js',
      'app.js'
    ];

    if (this.props.cos) {
      files = files.concat(['lib/cos.js', 'controllers/upload.js']);
      this.fs.copyTpl(
        this.templatePath('routes/api.js'),
        this.destinationPath('routes/api.js'),
        this.props
      );
    }

    tplFiles.forEach(file => {
      this.fs.copyTpl(this.templatePath(file), this.destinationPath(file), this.props);
    });

    files.forEach(file => {
      this.fs.copy(this.templatePath(file), this.destinationPath(file), this.props);
    });
  }

  install() {
    this.installDependencies();
  }
};
