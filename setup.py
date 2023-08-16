from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in a3trans/__init__.py
from a3trans import __version__ as version

setup(
	name="a3trans",
	version=version,
	description="Efficient Dispatching and tracking solution",
	author="Nijina A",
	author_email="njna@acube.co",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
