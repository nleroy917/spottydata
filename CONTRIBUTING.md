# Contributing
**If you have specific questions, shoot me a DM on Twitter: @NathanJLeRoy**

I openly welcome contributions to SpottyData! The code can be messy at times as it was my first ever React project - so there is a lot to change and update. In addition, there are so many things I want to add; I can't do them all!

# How to contribute
1. **Fork** spottydata on github by clicking the Fork button in the upper right corner
2. **Clone** the newly forked repo to your machine
3. **Navigate** into the cloned repo
4. **Check the origin remote** by running `git remote -v`
5. **Set the upstream remote** to spottydata by running `git remote add upstream https://github.com/NLeRoy917/spottydata.git`
6. **Create a new branch** to make your changes by running `git checkout -b BRANCH_NAME`
7. **Make changes**
8. **Push** your changes to your fork
9. **Pull Request** your fork when you are done adding your changes

# Development Environment
Both the python api and the React frontend have specific environment variables that are omitted from this repo of course for security. Shoot me a message and I can get you the files necessary to access the application.
0. Both **Python 3** and **Node.js** are requied for this application
1. You will need a `.env` file at the root of the repository
2. You will need a `.env` file inside `web/` (That is `web/.env`)
3. You can choose to create a python virtual environment or not - this is optional
4. Run `pip install -r requirements.txt`
5. `cd` into `web/` and run `yarn install`
6. From the root of the repository set an environment variable `FLASK_ENV=development` (**Windows:** `set FLASK_ENV=development`, **MacOS:** `export FLASK_ENV=development`)
7. **Start the development API** by running `python api.py`
8. `cd` into `web/`
9. **Install** the node modules by running `yarn install`
10. **Start the UI** by running `yarn start`

# Coding Standards
I don't really have any preference for coding paradigms, but I will ask that if you contribute to the frontend in any capacity please only use hooks and functional components for the react code.
