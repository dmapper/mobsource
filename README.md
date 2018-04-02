# mobsource

# Usage
### Clone
```
git clone https://github.com/dmapper/mobsource.git
```
### Development
```
npm install
npm start
Open http://localhost:3000
```
### Build
```
npm run build
```

# How to deploy:

### # Add next remote to git configuration file

```bash
[remote "deis-prod"]
  url = ssh://git@deis-builder.35.185.88.179.nip.io:2222/mobsource.git
  fetch = +refs/heads/*:refs/remotes/deis-prod/*
```
### # Install Deis Workflow client

Instruction [here](https://deis.com/docs/workflow/quickstart/install-cli-tools/). Skip `Helm Installation and Step 2: Boot a Kubernetes Cluster and Install Deis Workflow`

### # Register and login in the Deis Controller

Deis controller address: http://deis.35.185.88.179.nip.io
Instruction [here](https://deis.com/docs/workflow/users/registration/). Skip `Registering New Users and next sections`.

### # Add your ssh key to the Deis Controller.

Instruction [here](https://deis.com/docs/workflow/users/ssh-keys/)

### # Ask Eugene to promote your user to an admin

Write to oeswww@gmail.com or skype:oreshkin_life

### # Create local `production` branch

```bash
git checkout -b production origin/production
```

### # Run next command

It will deploy changes from `production` branch. So you must merge your branch to `production`.

```bash
npm run deploy-prod
```

#### If you work in `master` you can use short command to merge `master` to `production`

```bash
npm run gmp
```

#### As a result you can merge master to production and run deploying at once

```bash
npm run gmp && npm run deploy-prod
```