#! python3
import os
import sys
from shutil import which
import subprocess
from setuptools import setup

def is_tool(name):
    """Check whether `name` is on PATH and marked as executable."""

    return which(name) is not None

# check dependencies

# ruby
if is_tool('ruby'):
    print("Ruby... installed ✅")
else:
    print("Ruby... not found ❌")
    print("Please install... exiting")
    sys.exit(1)

# npm/node.js
if is_tool('node'):
    print("Node.js... installed ✅")
else:
    print("Node.js... not found ❌")
    print("Please install... exiting")
    sys.exit(1)
    
# npm
if is_tool('npm'):
    print("npm... installed ✅")
else:
    print("npm... not found ❌")
    print("Please install... exiting")
    sys.exit(1)

# get python install requirements
req_file = './requirements.txt'
with open(req_file, 'r') as fh:
    install_reqs = fh.read.splitlines()

# create .env files
with open('.env', 'a+') as fh: # root
    pass

with open('./lib/.env', 'a+') as fh: # lib
    pass

with open('./web/.env', 'a+') as fh: # react env variables
    pass

# install npm dependencies
subprocess.Popen(['npm','install'],cwd="./web")

setup(name="spottydata", install_requires=install_reqs)

print("Success... spottydata development environment successfully installed.")
print('Please contact me on GitHub or at NLeRoy917@gmail.com for releveant development environment variables.')
print('Run "spottydata develop" to launch development environment.')


